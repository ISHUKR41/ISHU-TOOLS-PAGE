from collections import defaultdict, OrderedDict
from datetime import date
import hashlib
import json
import time
from pathlib import Path
import importlib.util
import platform
import shutil
from typing import Annotated, Any

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response

from .models import ToolDefinition
from .registry import CATEGORIES, TOOLS
from .tools.handlers import HANDLERS, create_job_workspace, get_soffice_binary, parse_payload, save_uploads

app = FastAPI(
    title="Ishu Tools API",
    version="1.0.0",
    description="Backend API for ISHU TOOLS document and image operations.",
)

# ── Simple in-memory rate limiter ──────────────────────────────────────────
# Allows up to 60 requests per minute per IP on the execute endpoint
_RATE_LIMIT_REQUESTS = 60
_RATE_LIMIT_WINDOW   = 60   # seconds
_rate_buckets: dict[str, list[float]] = defaultdict(list)

def _check_rate_limit(ip: str) -> None:
    now = time.time()
    window_start = now - _RATE_LIMIT_WINDOW
    bucket = _rate_buckets[ip]
    # Remove old timestamps outside the window
    _rate_buckets[ip] = [t for t in bucket if t > window_start]
    if len(_rate_buckets[ip]) >= _RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a moment before trying again.",
            headers={"Retry-After": "60"},
        )
    _rate_buckets[ip].append(now)


# ── In-memory LRU cache for text-only tool results ────────────────────────
# Caches results from tools that process text/JSON payloads (no file uploads)
# This dramatically speeds up repeated identical requests (calculators, converters, etc.)
_CACHE_TTL_SECONDS = 300  # 5 minutes
_CACHE_MAX_SIZE    = 500  # max cached entries

class _TTLLRUCache:
    """Simple LRU cache with per-entry TTL. Thread-safe enough for single-process FastAPI."""
    def __init__(self, max_size: int, ttl: int):
        self._cache: OrderedDict[str, tuple[float, Any]] = OrderedDict()
        self._max_size = max_size
        self._ttl = ttl
        self._hits = 0
        self._misses = 0

    def _make_key(self, slug: str, payload: dict) -> str:
        raw = json.dumps({"slug": slug, "payload": payload}, sort_keys=True, default=str)
        return hashlib.sha256(raw.encode()).hexdigest()[:16]

    def get(self, slug: str, payload: dict) -> dict | None:
        key = self._make_key(slug, payload)
        if key in self._cache:
            ts, val = self._cache[key]
            if time.time() - ts < self._ttl:
                # Move to end (most recently used)
                self._cache.move_to_end(key)
                self._hits += 1
                return val
            else:
                # Expired
                del self._cache[key]
        self._misses += 1
        return None

    def set(self, slug: str, payload: dict, value: dict) -> None:
        key = self._make_key(slug, payload)
        self._cache[key] = (time.time(), value)
        self._cache.move_to_end(key)
        # Evict LRU entries if over capacity
        while len(self._cache) > self._max_size:
            self._cache.popitem(last=False)

    def stats(self) -> dict:
        return {"size": len(self._cache), "hits": self._hits, "misses": self._misses, "max_size": self._max_size}


_tool_cache = _TTLLRUCache(max_size=_CACHE_MAX_SIZE, ttl=_CACHE_TTL_SECONDS)

# Tools whose results should NOT be cached (randomness/live data)
_NO_CACHE_SLUGS = {
    "uuid-generator", "password-generator", "random-number-generator",
    "coin-flip", "dice-roller", "random-color-generator", "random-name-generator",
    "love-calculator", "atm-pin-generator", "world-clock", "stopwatch",
    "ulid-generator", "ics-calendar-generator", "vcard-generator",
    "currency-converter",  # live rates
    "ip-address-lookup", "dns-lookup", "whois-lookup", "ssl-certificate-checker",
    "ip-lookup",
}

def _should_cache(slug: str, files: list) -> bool:
    """Only cache text-only tool calls (no file uploads, no randomness)."""
    return len(files) == 0 and slug not in _NO_CACHE_SLUGS

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Tool-Message", "X-Job-Id"],
)


def get_tool(slug: str) -> ToolDefinition:
    for tool in TOOLS:
        if tool.slug == slug:
            return tool
    raise HTTPException(status_code=404, detail="Tool not found")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/sitemap.xml", response_class=Response)
def sitemap_xml() -> Response:
    today = date.today().strftime("%Y-%m-%d")
    base = "https://ishutools.com"

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    lines.append(f'  <url><loc>{base}/</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>')
    lines.append(f'  <url><loc>{base}/tools</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>')

    seen_cats: set[str] = set()
    for cat in CATEGORIES:
        if cat.id not in seen_cats:
            seen_cats.add(cat.id)
            lines.append(f'  <url><loc>{base}/category/{cat.id}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>')

    HIGH_PRIORITY = {
        "merge-pdf", "compress-pdf", "pdf-to-word", "word-to-pdf", "jpg-to-pdf",
        "pdf-to-jpg", "compress-image", "resize-image", "remove-background",
        "ocr-pdf", "json-formatter", "bmi-calculator", "password-generator",
        "qr-code-generator", "pdf-to-excel",
        # Health & Finance — high-value SEO targets
        "calorie-calculator", "gst-calculator-india", "sip-calculator",
        "income-tax-calculator", "roi-calculator", "budget-planner",
        "water-intake-calculator", "sleep-calculator", "bmr-calculator",
        "heart-rate-zones", "steps-to-km", "calories-burned-calculator",
        "number-to-words", "roman-numeral-converter", "date-calculator",
        "age-in-seconds", "random-name-generator", "random-number-generator",
        # Network tools
        "ip-address-lookup", "dns-lookup", "whois-lookup", "ssl-certificate-checker",
        # Finance tools
        "emi-calculator-advanced", "currency-converter", "fuel-cost-calculator",
        "credit-card-validator", "ifsc-code-finder",
        # Developer tools
        "base64-encoder", "base64-decoder", "regex-tester", "jwt-decoder",
        "hash-generator", "uuid-generator", "lorem-ipsum-generator",
        # Math tools
        "statistics-calculator", "prime-number-checker", "fibonacci-generator",
        "equation-solver", "matrix-calculator",
        # Text tools
        "grammar-checker", "plagiarism-checker", "word-frequency-counter",
        "paraphrase-tool", "text-to-morse",
    }
    seen_slugs: set[str] = set()
    for tool in TOOLS:
        if tool.slug not in seen_slugs:
            seen_slugs.add(tool.slug)
            priority = "0.95" if tool.slug in HIGH_PRIORITY else "0.85"
            lines.append(f'  <url><loc>{base}/tools/{tool.slug}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>{priority}</priority></url>')

    lines.append("</urlset>")
    xml_content = "\n".join(lines)
    return Response(content=xml_content, media_type="application/xml")


@app.get("/robots.txt", response_class=Response)
def robots_txt() -> Response:
    content = """User-agent: *
Allow: /
Allow: /tools/
Allow: /category/
Sitemap: https://ishutools.com/sitemap.xml
Crawl-delay: 1
Disallow: /api/

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0
"""
    return Response(content=content, media_type="text/plain")


def _is_module_available(module_name: str) -> bool:
    return importlib.util.find_spec(module_name) is not None


@app.get("/api/runtime-capabilities")
def runtime_capabilities() -> dict:
    capabilities = {
        "python_version": platform.python_version(),
        "libreoffice": bool(get_soffice_binary()),
        "rembg": _is_module_available("rembg"),
        "rapidocr": _is_module_available("rapidocr_onnxruntime"),
        "pillow_heif": _is_module_available("pillow_heif"),
        "wkhtmltopdf": shutil.which("wkhtmltopdf") is not None,
        "ebook_convert": shutil.which("ebook-convert") is not None,
    }
    return {
        "status": "ok",
        "capabilities": capabilities,
        "notes": [
            "Some advanced conversions rely on optional runtime binaries.",
            "If a capability is unavailable, related tools may return guidance for installation.",
        ],
    }


_CACHE_CONTROL_STATIC = "public, max-age=300, stale-while-revalidate=60"
_CACHE_CONTROL_TOOL = "public, max-age=600, stale-while-revalidate=120"


@app.get("/api/categories")
def categories() -> Response:
    seen: set[str] = set()
    records = []
    for category in CATEGORIES:
        if category.id in seen:
            continue
        seen.add(category.id)
        records.append(category)
    data = [category.model_dump() for category in records]
    return JSONResponse(content=data, headers={"Cache-Control": _CACHE_CONTROL_STATIC})


@app.get("/api/tools")
def list_tools(category: str | None = None, q: str | None = None) -> Response:
    seen: set[str] = set()
    records = []
    for tool in TOOLS:
        if tool.slug in seen:
            continue
        seen.add(tool.slug)
        records.append(tool)

    if category:
        records = [tool for tool in records if tool.category == category]

    if q:
        query = q.lower().strip()
        records = [
            tool
            for tool in records
            if query in tool.title.lower()
            or query in tool.description.lower()
            or any(query in tag.lower() for tag in tool.tags)
        ]

    data = [tool.model_dump() for tool in records]
    cache_header = _CACHE_CONTROL_STATIC if not q else "no-store"
    return JSONResponse(content=data, headers={"Cache-Control": cache_header})


@app.get("/api/tools/{slug}")
def tool_details(slug: str) -> Response:
    tool = get_tool(slug)
    return JSONResponse(content=tool.model_dump(), headers={"Cache-Control": _CACHE_CONTROL_TOOL})


def _cleanup_workspace(job_dir: Path) -> None:
    """Remove the job workspace directory after the response has been sent."""
    try:
        if job_dir.exists():
            shutil.rmtree(job_dir, ignore_errors=True)
    except Exception:
        pass


@app.get("/api/cache/stats")
def cache_stats() -> dict:
    """Return LRU cache statistics for monitoring."""
    return {"cache": _tool_cache.stats(), "rate_limit": {"window_s": _RATE_LIMIT_WINDOW, "max_requests": _RATE_LIMIT_REQUESTS}}


@app.post("/api/tools/{slug}/execute")
def run_tool(
    request: Request,
    background_tasks: BackgroundTasks,
    slug: str,
    files: Annotated[list[UploadFile], File()] = [],
    payload: Annotated[str | None, Form()] = None,
):
    # Rate limiting — 60 requests per minute per IP
    client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or \
                (request.client.host if request.client else "unknown")
    _check_rate_limit(client_ip)
    tool = get_tool(slug)
    handler = HANDLERS.get(slug)
    if not handler:
        raise HTTPException(status_code=501, detail=f"Handler is not implemented for '{tool.title}'. Please check back later.")

    payload_data = parse_payload(payload)

    # ── Check LRU cache for text-only tools ──────────────────────────────────
    use_cache = _should_cache(slug, files)
    if use_cache:
        cached = _tool_cache.get(slug, payload_data)
        if cached is not None:
            return JSONResponse(
                content=cached,
                headers={"X-Cache": "HIT", "Cache-Control": "private, max-age=300"},
            )

    # ── Validate file upload requirements ──
    if tool.input_kind == "files" and not files:
        raise HTTPException(
            status_code=422,
            detail=f"{tool.title} requires at least one file to be uploaded.",
        )

    # ── Validate individual file sizes (100 MB max per file) ──
    MAX_FILE_SIZE = 100 * 1024 * 1024
    for f in files:
        if f.size and f.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File '{f.filename}' exceeds the maximum allowed size of 100 MB.",
            )

    # ── Validate dangerous filenames ──
    ALLOWED_EXTENSIONS = {
        ".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif",
        ".svg", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".odt", ".rtf",
        ".txt", ".md", ".html", ".htm", ".csv", ".json", ".xml", ".epub",
        ".zip", ".heic", ".heif", ".yaml", ".yml", ".mobi",
    }
    for f in files:
        if f.filename:
            ext = Path(f.filename).suffix.lower()
            if ext and ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=422,
                    detail=f"File type '{ext}' is not supported. Allowed types: PDF, images, Office docs, text files.",
                )

    # ── Validate payload size (prevent abuse with huge text inputs) ──
    if payload and len(payload) > 2 * 1024 * 1024:  # 2MB text limit
        raise HTTPException(
            status_code=413,
            detail="Input text is too large (maximum 2 MB). Please reduce your input size.",
        )

    job_id, input_dir, output_dir = create_job_workspace()
    job_root = input_dir.parent   # parent dir of input/ and output/
    saved_files = save_uploads(files, input_dir) if files else []

    try:
        result = handler(saved_files, payload_data, output_dir)
    except HTTPException:
        background_tasks.add_task(_cleanup_workspace, job_root)
        raise
    except ValueError as exc:
        background_tasks.add_task(_cleanup_workspace, job_root)
        raise HTTPException(status_code=422, detail=f"Invalid input: {str(exc)[:200]}") from exc
    except Exception as exc:
        background_tasks.add_task(_cleanup_workspace, job_root)
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(exc)[:200]}. Please try again with a valid file.",
        ) from exc

    if result.kind == "json":
        # JSON results don't need the workspace — clean it up immediately
        background_tasks.add_task(_cleanup_workspace, job_root)
        response_data = {
            "status": "success",
            "message": result.message,
            "job_id": job_id,
            "data": result.data or {},
        }
        # Store in LRU cache if eligible
        if use_cache:
            _tool_cache.set(slug, payload_data, response_data)
        return JSONResponse(
            content=response_data,
            headers={"X-Cache": "MISS"},
        )

    if result.kind == "file" and result.output_path and Path(result.output_path).exists():
        safe_message = (result.message or "").encode("latin-1", errors="replace").decode("latin-1")
        # File will be streamed first, then workspace cleaned
        background_tasks.add_task(_cleanup_workspace, job_root)
        return FileResponse(
            path=result.output_path,
            filename=result.filename,
            media_type=result.content_type or "application/octet-stream",
            headers={
                "X-Tool-Message": safe_message,
                "X-Job-Id": job_id,
            },
        )

    background_tasks.add_task(_cleanup_workspace, job_root)
    raise HTTPException(status_code=500, detail="Tool execution did not produce a valid output. Please try again.")
