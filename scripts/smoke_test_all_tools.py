"""Smoke-test every registered tool by POSTing empty form-data to /api/tools/{slug}/run.

Classifies responses so we know which handlers crash (5xx / unhandled exception)
vs. which gracefully reject (4xx with helpful message) vs. which actually run.
Run only against the local dev backend on port 8000.
"""
from __future__ import annotations

import asyncio
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

import httpx

BASE = "http://localhost:8000"
CONCURRENCY = 24


async def probe(client: httpx.AsyncClient, slug: str) -> tuple[str, int, str]:
    try:
        r = await client.post(f"{BASE}/api/tools/{slug}/execute", data={}, timeout=20.0)
        body = ""
        try:
            j = r.json()
            body = (j.get("detail") or j.get("message") or "")[:160] if isinstance(j, dict) else str(j)[:160]
        except Exception:
            body = r.text[:160]
        return slug, r.status_code, body
    except Exception as e:  # network / timeout
        return slug, -1, f"EXC {type(e).__name__}: {e}"


async def main() -> None:
    tools = httpx.get(f"{BASE}/api/tools", timeout=10.0).json()
    slugs = [t["slug"] for t in tools]
    print(f"Probing {len(slugs)} tools with concurrency={CONCURRENCY}…", file=sys.stderr)

    sem = asyncio.Semaphore(CONCURRENCY)
    results: list[tuple[str, int, str]] = []

    async with httpx.AsyncClient() as client:
        async def go(s: str) -> None:
            async with sem:
                results.append(await probe(client, s))
                if len(results) % 100 == 0:
                    print(f"  {len(results)}/{len(slugs)}", file=sys.stderr)

        await asyncio.gather(*(go(s) for s in slugs))

    by_status = Counter(r[1] for r in results)
    print("\n=== Status distribution ===")
    for code, n in sorted(by_status.items()):
        print(f"  {code}: {n}")

    # Bucket the bad ones
    crashes = [(s, c, b) for s, c, b in results if c >= 500 or c == -1]
    print(f"\n=== Crashing handlers (5xx / network): {len(crashes)} ===")
    for s, c, b in sorted(crashes)[:80]:
        print(f"  [{c}] {s}: {b}")

    out = Path("/tmp/smoke_results.json")
    out.write_text(json.dumps(results, indent=2))
    print(f"\nFull results → {out}")


if __name__ == "__main__":
    asyncio.run(main())
