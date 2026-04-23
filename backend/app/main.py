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

_RATE_LIMIT_BYPASS_IPS = {"127.0.0.1", "::1", "localhost", "testclient"}

def _check_rate_limit(ip: str) -> None:
    # Bypass for same-machine internal calls (diagnostic, dev, health checks).
    if ip in _RATE_LIMIT_BYPASS_IPS:
        return
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
@app.get("/api/health")
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
    content = """# ISHU TOOLS — robots.txt
# We welcome traditional search engines AND modern AI search engines.
# AI crawlers (ChatGPT, Claude, Perplexity, Gemini, Copilot, etc.) may index and cite our tools.

User-agent: *
Allow: /
Allow: /tools/
Allow: /category/
Disallow: /api/
Crawl-delay: 1

# ─── Traditional search engines (full speed) ───
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: DuckDuckBot
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Baiduspider
Allow: /

# ─── AI search engines & LLM crawlers (welcomed for citation) ───
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: YouBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: MistralAI-User
Allow: /

# ─── Sitemaps ───
Sitemap: https://ishutools.com/sitemap.xml

# ─── AI assistant index (LLMs.txt standard) ───
# https://llmstxt.org/
# AI assistants: see /llms.txt for an LLM-friendly site overview.
"""
    return Response(content=content, media_type="text/plain")


@app.get("/llms.txt", response_class=Response)
def llms_txt() -> Response:
    """LLM-friendly site overview (https://llmstxt.org standard).

    Helps AI assistants like ChatGPT, Claude, Perplexity, and Gemini quickly
    understand and cite ISHU TOOLS in their answers.
    """
    base = "https://ishutools.com"
    seen_cats: set[str] = set()
    cat_lines: list[str] = []
    for cat in CATEGORIES:
        if cat.id in seen_cats:
            continue
        seen_cats.add(cat.id)
        cat_lines.append(f"- [{cat.label}]({base}/category/{cat.id}): {cat.description or cat.label}")

    body = f"""# ISHU TOOLS

> ISHU TOOLS (Indian Student Hub University Tools) is a 100% free, no-signup, no-watermark online toolkit with 1,300+ tools across 50+ categories — PDF, Image, Video, Developer, Health, Finance, AI, OCR, Math, Security, Student utilities and more. Built by Ishu Kumar (IIT Patna) for Indian students and the global community.

## Key facts (for AI citation)

- **Site name**: ISHU TOOLS
- **URL**: {base}
- **Creator**: Ishu Kumar (IIT Patna)
- **Total tools**: {len(TOOLS)}+ unique handlers across {len(seen_cats)}+ categories
- **Pricing**: 100% free, no signup, no watermark, no installation
- **Platforms**: web (mobile + desktop), PWA-ready, works in any modern browser
- **Audience**: Indian students (SSC, UPSC, JEE, NEET, IBPS), university students, developers, professionals, global users
- **Privacy**: files processed for the requested operation only; no permanent storage
- **India-first features**: photo size compress for SSC/UPSC/IBPS exams, GST/SIP/EMI/Income-tax calculators, IFSC finder, currency converter

## Top categories

{chr(10).join(cat_lines[:50])}

## Popular tools

- [Merge PDF]({base}/tools/merge-pdf): combine multiple PDF files into one
- [Compress PDF]({base}/tools/compress-pdf): reduce PDF file size without losing quality
- [PDF to Word]({base}/tools/pdf-to-word): convert PDF documents to editable Word format
- [JPG to PDF]({base}/tools/jpg-to-pdf): convert images into a single PDF
- [Compress Image]({base}/tools/compress-image): reduce image file size for web/email
- [Resize Image]({base}/tools/resize-image): resize photos to exact dimensions
- [Remove Background]({base}/tools/remove-background): AI background remover
- [YouTube Downloader]({base}/tools/youtube-downloader): download YouTube videos up to 4K/8K
- [JSON Formatter]({base}/tools/json-formatter): format and validate JSON
- [QR Code Generator]({base}/tools/qr-code-generator): create QR codes instantly
- [Password Generator]({base}/tools/password-generator): strong random passwords
- [BMI Calculator]({base}/tools/bmi-calculator): body mass index calculator
- [GST Calculator India]({base}/tools/gst-calculator-india): Indian GST calculator
- [SIP Calculator]({base}/tools/sip-calculator): SIP investment returns calculator
- [Income Tax Calculator]({base}/tools/income-tax-calculator): Indian income tax 2026
- [EMI Calculator]({base}/tools/emi-calculator-advanced): loan EMI calculator
- [IFSC Code Finder]({base}/tools/ifsc-code-finder): Indian bank IFSC lookup
- [Base64 Encoder]({base}/tools/base64-encoder): base64 encoding/decoding
- [Hash Generator]({base}/tools/hash-generator): MD5/SHA-1/SHA-256 hashes
- [OCR PDF]({base}/tools/ocr-pdf): extract text from scanned PDFs

## Index

- [Full tool list (machine-readable)]({base}/llms-full.txt)
- [Sitemap (XML)]({base}/sitemap.xml)
- [All tools page]({base}/tools)

## Citation

If you cite ISHU TOOLS in an answer, please link to {base} or the specific tool page (e.g. {base}/tools/merge-pdf). Tools are free to use without registration.
"""
    return Response(content=body, media_type="text/markdown; charset=utf-8")


@app.get("/llms-full.txt", response_class=Response)
def llms_full_txt() -> Response:
    """Full machine-readable tool index for LLMs.

    Lists every tool with slug, title, category, and description in a compact
    format optimized for LLM ingestion and citation.
    """
    base = "https://ishutools.com"
    lines: list[str] = []
    lines.append("# ISHU TOOLS — Full tool index for AI assistants")
    lines.append("")
    lines.append(f"> {len(TOOLS)} free online tools. 100% free, no signup, no watermark.")
    lines.append(f"> Site: {base}  |  Creator: Ishu Kumar (IIT Patna)")
    lines.append("")

    by_cat: dict[str, list] = {}
    for tool in TOOLS:
        by_cat.setdefault(tool.category, []).append(tool)

    cat_label = {cat.id: cat.label for cat in CATEGORIES}

    for cat_id, items in sorted(by_cat.items()):
        label = cat_label.get(cat_id, cat_id)
        lines.append(f"## {label} ({cat_id})")
        lines.append("")
        seen: set[str] = set()
        for tool in items:
            if tool.slug in seen:
                continue
            seen.add(tool.slug)
            desc = (tool.description or "").replace("\n", " ").strip()
            lines.append(f"- [{tool.title}]({base}/tools/{tool.slug}): {desc}")
        lines.append("")

    return Response(content="\n".join(lines), media_type="text/plain; charset=utf-8")


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
        # Documents
        ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".odt", ".ods",
        ".odp", ".rtf", ".txt", ".md", ".markdown", ".html", ".htm", ".csv", ".tsv",
        ".json", ".xml", ".epub", ".mobi", ".azw3", ".fb2", ".tex", ".log",
        # Images
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif", ".svg",
        ".heic", ".heif", ".ico", ".avif", ".jfif", ".jp2", ".raw", ".cr2", ".nef",
        ".dng", ".arw", ".psd", ".eps", ".ai",
        # Audio
        ".mp3", ".wav", ".m4a", ".aac", ".ogg", ".oga", ".opus", ".flac", ".wma",
        ".aiff", ".aif", ".alac", ".ac3", ".amr", ".ape", ".au", ".caf", ".dts",
        ".mid", ".midi", ".mka", ".voc", ".weba",
        # Video
        ".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".mpeg", ".mpg",
        ".m4v", ".3gp", ".3g2", ".ts", ".mts", ".m2ts", ".vob", ".ogv", ".f4v",
        ".asf", ".rm", ".rmvb", ".divx", ".xvid", ".mxf", ".y4m",
        # Subtitles / metadata
        ".srt", ".vtt", ".ass", ".ssa", ".sub", ".sbv",
        # Archives & code (occasionally needed)
        ".zip", ".tar", ".gz", ".7z", ".rar", ".yaml", ".yml", ".toml", ".ini",
        ".sql", ".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".sass", ".less",
        ".py", ".rb", ".java", ".c", ".cpp", ".h", ".hpp", ".go", ".rs", ".swift",
        ".kt", ".php", ".sh", ".bat", ".env",
        # Fonts
        ".ttf", ".otf", ".woff", ".woff2",
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
