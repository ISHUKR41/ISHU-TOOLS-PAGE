"""Realistic smoke-test: build a payload that satisfies typical required fields
(text, url, file, n, count, password, etc.) so we exercise the actual handler
body, not just FastAPI form validation. Anything that returns 5xx is a real bug.
"""
from __future__ import annotations
import asyncio, io, json, sys
from collections import Counter
from pathlib import Path
import httpx

BASE = "http://localhost:8000"
CONCURRENCY = 16

# Tiny 1x1 PNG (transparent) for any "file" / "image" upload field
TINY_PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082"
)
# Tiny PDF (1 page)
TINY_PDF = (
    b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
    b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 100 100]>>endobj\n"
    b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n"
    b"0000000054 00000 n \n0000000098 00000 n \n"
    b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n152\n%%EOF\n"
)

REALISTIC_TEXT = "Hello World 123. The quick brown fox jumps over the lazy dog."
REALISTIC_URL = "https://example.com/sample.jpg"


def build_payload(slug: str, fields: list[dict]) -> tuple[dict, dict]:
    """Return (data, files) for a multipart POST."""
    data: dict[str, str] = {}
    files: dict[str, tuple[str, bytes, str]] = {}
    for f in fields:
        name = f.get("name") or f.get("key")
        if not name:
            continue
        ftype = (f.get("type") or "").lower()
        # Use provided default/example/options if any
        default = f.get("default") or f.get("example") or f.get("placeholder")
        if ftype in ("file", "image", "files", "pdf", "audio", "video"):
            if "pdf" in ftype or "pdf" in name.lower():
                files[name] = (f"sample.pdf", TINY_PDF, "application/pdf")
            else:
                files[name] = (f"sample.png", TINY_PNG, "image/png")
        elif ftype == "select" and f.get("options"):
            opts = f["options"]
            data[name] = (opts[0]["value"] if isinstance(opts[0], dict) else opts[0])
        elif ftype == "checkbox":
            data[name] = "true"
        elif ftype in ("number", "int", "integer", "range"):
            data[name] = str(default if default is not None else 1)
        elif ftype == "url":
            data[name] = str(default or REALISTIC_URL)
        elif ftype == "color":
            data[name] = str(default or "#3366ff")
        elif ftype == "email":
            data[name] = "test@example.com"
        elif ftype == "password":
            data[name] = "Password123!"
        else:  # text, textarea, anything else
            data[name] = str(default or REALISTIC_TEXT)
    return data, files


async def probe(client: httpx.AsyncClient, tool: dict) -> tuple[str, int, str]:
    slug = tool["slug"]
    fields = tool.get("fields") or []
    data, files = build_payload(slug, fields)
    try:
        r = await client.post(
            f"{BASE}/api/tools/{slug}/execute",
            data=data, files=files or None, timeout=25.0,
        )
        body = ""
        try:
            j = r.json()
            body = (j.get("detail") or j.get("message") or "")[:200] if isinstance(j, dict) else str(j)[:200]
        except Exception:
            body = r.text[:200]
        return slug, r.status_code, body
    except Exception as e:
        return slug, -1, f"EXC {type(e).__name__}: {e}"


async def main() -> None:
    tools = httpx.get(f"{BASE}/api/tools", timeout=10.0).json()
    # Hydrate fields for each tool from /api/tools/{slug}
    print(f"Hydrating fields for {len(tools)} tools…", file=sys.stderr)
    async with httpx.AsyncClient() as client:
        sem = asyncio.Semaphore(CONCURRENCY)
        async def hydrate(t):
            async with sem:
                try:
                    r = await client.get(f"{BASE}/api/tools/{t['slug']}", timeout=10.0)
                    if r.status_code == 200:
                        t["fields"] = r.json().get("fields") or []
                except Exception:
                    pass
        await asyncio.gather(*(hydrate(t) for t in tools))

        print(f"Probing {len(tools)} tools with realistic input…", file=sys.stderr)
        results: list[tuple[str, int, str]] = []
        async def go(t):
            async with sem:
                results.append(await probe(client, t))
                if len(results) % 100 == 0:
                    print(f"  {len(results)}/{len(tools)}", file=sys.stderr)
        await asyncio.gather(*(go(t) for t in tools))

    by = Counter(r[1] for r in results)
    print("\n=== Status distribution ===")
    for c, n in sorted(by.items()):
        print(f"  {c}: {n}")

    crashes = sorted([(s, c, b) for s, c, b in results if c >= 500 or c == -1])
    print(f"\n=== Crashing handlers (5xx / network): {len(crashes)} ===")
    for s, c, b in crashes[:120]:
        print(f"  [{c}] {s}: {b}")

    Path("/tmp/smoke_realistic.json").write_text(json.dumps(results, indent=2))
    print("\nFull results → /tmp/smoke_realistic.json")


if __name__ == "__main__":
    asyncio.run(main())
