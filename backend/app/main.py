from collections import Counter, defaultdict, OrderedDict
from datetime import date
import hashlib
import json
import os
import time
from pathlib import Path
import importlib.util
import platform
import re
import shutil
from threading import Lock
from typing import Annotated, Any

from fastapi import BackgroundTasks, Body, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response

from .config import STORAGE_DIR
from .models import ToolDefinition
from .registry import CATEGORIES, TOOLS
from .tools.handlers import HANDLERS, create_job_workspace, get_soffice_binary, parse_payload, save_uploads

app = FastAPI(
    title="Ishu Tools API",
    version="1.0.0",
    description="Backend API for ISHU TOOLS document and image operations.",
)

SITE_BASE_URL = os.getenv("PUBLIC_SITE_URL", "https://ishutools.fun").rstrip("/")
SITE_FALLBACK_URL = os.getenv("FALLBACK_SITE_URL", "https://ishutools.vercel.app").rstrip("/")

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


# ── Global popularity telemetry (persistent) ───────────────────────────────
_TOOL_BY_SLUG: dict[str, ToolDefinition] = {}
_TOOL_SLUG_COUNTS = Counter(tool.slug for tool in TOOLS)
_DUPLICATE_TOOL_SLUGS = sorted(slug for slug, count in _TOOL_SLUG_COUNTS.items() if count > 1)
for _tool in TOOLS:
    _TOOL_BY_SLUG.setdefault(_tool.slug, _tool)
_TOOL_SLUGS = set(_TOOL_BY_SLUG)
_CATEGORY_IDS = {category.id for category in CATEGORIES}
_ORPHAN_CATEGORY_IDS = sorted({tool.category for tool in TOOLS if tool.category not in _CATEGORY_IDS})
_MISSING_HANDLER_SLUGS = sorted(slug for slug in _TOOL_SLUGS if slug not in HANDLERS)
_POPULARITY_FILE = STORAGE_DIR / "tool_popularity.json"
_popularity_lock = Lock()

_DAILY_CATEGORY_PRIORITY = [
    "pdf-core",
    "image-core",
    "unit-converter",
    "developer-tools",
    "math-tools",
    "student-tools",
    "finance-tools",
    "health-tools",
    "text-ops",
    "video-tools",
    "office-suite",
    "format-lab",
    "image-layout",
    "image-tools",
    "pdf-advanced",
    "pdf-security",
    "network-tools",
    "color-tools",
    "security-tools",
    "productivity",
    "audio-tools",
    "data-tools",
    "seo-tools",
    "social-media",
]

_DAILY_TOOL_BONUS = {
    "scientific-calculator": 260,
    "merge-pdf": 250,
    "compress-pdf": 248,
    "compress-image": 246,
    "pdf-to-word": 244,
    "word-to-pdf": 242,
    "remove-background": 240,
    "jpg-to-pdf": 238,
    "pdf-to-jpg": 236,
    "split-pdf": 234,
    "qr-code-generator": 232,
    "json-formatter": 230,
    "password-generator": 228,
    "bmi-calculator": 226,
    "percentage-calculator": 224,
    "age-calculator": 222,
    "gst-calculator-india": 220,
    "emi-calculator-advanced": 218,
    "sip-calculator-india": 216,
    "income-tax-calculator-india": 214,
    "word-counter": 212,
    "case-converter": 210,
    "uuid-generator": 208,
    "base64-encode": 206,
    "base64-decode": 204,
    "unit-converter": 202,
    "currency-converter": 200,
    "instagram-downloader": 198,
    "youtube-downloader": 196,
    "image-to-text": 194,
    "ocr-pdf": 192,
}

_SEARCH_SYNONYMS = {
    "combine": ("merge", "join", "jodo"),
    "join": ("merge", "combine", "jodo"),
    "merge": ("combine", "join", "jodo"),
    "shrink": ("compress", "reduce", "minify", "optimize", "kam"),
    "compress": ("shrink", "reduce", "optimize", "minify", "kam"),
    "reduce": ("compress", "shrink", "kam"),
    "bg": ("background", "remove background"),
    "background": ("bg", "remove background"),
    "remove": ("delete", "erase", "hatao", "nikalo"),
    "delete": ("remove", "hatao"),
    "convert": ("change", "transform", "badlo"),
    "change": ("convert", "badlo"),
    "calculator": ("calc", "calculate", "ganit"),
    "calc": ("calculator", "calculate"),
    "calculate": ("calculator", "compute"),
    "scientific": ("calculator", "math", "sin", "cos", "log"),
    "maths": ("math", "calculator"),
    "math": ("maths", "calculator"),
    "photo": ("image", "picture", "pic"),
    "image": ("photo", "picture", "img", "pic"),
    "img": ("image", "photo", "picture"),
    "pic": ("image", "photo", "picture"),
    "picture": ("image", "photo"),
    "pdf": ("document", "file"),
    "document": ("pdf", "doc", "file"),
    "doc": ("document", "word", "pdf"),
    "docx": ("word", "document"),
    "word": ("docx", "document"),
    "xlsx": ("excel", "spreadsheet"),
    "excel": ("xlsx", "spreadsheet"),
    "pptx": ("powerpoint", "presentation", "slides"),
    "powerpoint": ("pptx", "presentation", "slides"),
    "qr": ("qrcode", "qr code"),
    "qrcode": ("qr", "qr code"),
    "url": ("link",),
    "link": ("url",),
    "instagram": ("insta", "ig", "reels", "reel"),
    "insta": ("instagram", "ig", "reel"),
    "ig": ("instagram", "insta", "reel"),
    "reel": ("instagram", "insta", "reels"),
    "reels": ("instagram", "insta", "reel"),
    "youtube": ("yt", "shorts", "video"),
    "yt": ("youtube",),
    "download": ("save", "fetch", "get"),
    "save": ("download", "fetch", "get"),
    "get": ("download", "fetch"),
    "saver": ("download", "save"),
    "create": ("generate", "make", "banao"),
    "generate": ("create", "make", "banao"),
    "banao": ("make", "create", "generate"),
    "jodo": ("merge", "join", "combine"),
    "hatao": ("remove", "delete"),
    "nikalo": ("extract", "remove"),
    "badlo": ("convert", "change"),
}


def _load_popularity_store() -> tuple[dict[str, int], int, str]:
    if not _POPULARITY_FILE.exists():
        return {}, 0, ""

    try:
        raw = json.loads(_POPULARITY_FILE.read_text(encoding="utf-8"))
        counts_raw = raw.get("counts", {}) if isinstance(raw, dict) else {}
        counts: dict[str, int] = {}
        for slug, value in (counts_raw.items() if isinstance(counts_raw, dict) else []):
            if slug in _TOOL_SLUGS:
                try:
                    parsed = int(value)
                except Exception:
                    parsed = 0
                if parsed > 0:
                    counts[slug] = parsed
        total = int(raw.get("total_events", sum(counts.values()))) if isinstance(raw, dict) else sum(counts.values())
        updated = str(raw.get("updated_at", "")) if isinstance(raw, dict) else ""
        return counts, max(total, 0), updated
    except Exception:
        return {}, 0, ""


_tool_popularity, _popularity_total, _popularity_updated_at = _load_popularity_store()


def _persist_popularity_store() -> None:
    payload = {
        "counts": _tool_popularity,
        "total_events": _popularity_total,
        "updated_at": _popularity_updated_at,
    }
    tmp = _POPULARITY_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=True, separators=(",", ":")), encoding="utf-8")
    tmp.replace(_POPULARITY_FILE)


def _record_tool_visit(slug: str) -> tuple[int, int]:
    global _popularity_total, _popularity_updated_at
    with _popularity_lock:
        next_count = (_tool_popularity.get(slug, 0) + 1)
        _tool_popularity[slug] = next_count
        _popularity_total += 1
        _popularity_updated_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        _persist_popularity_store()
        return next_count, _popularity_total


def _popularity_snapshot() -> tuple[dict[str, int], int, str]:
    with _popularity_lock:
        return dict(_tool_popularity), _popularity_total, _popularity_updated_at


def _normalize_search_text(value: str) -> str:
    return re.sub(
        r"\s+",
        " ",
        re.sub(r"[^a-z0-9.+#%\-\s]", " ", str(value).lower().replace("_", " ").replace("/", " ")),
    ).strip()


def _search_terms(query: str) -> list[str]:
    return [term for term in _normalize_search_text(query).split() if term]


def _expand_search_term(term: str) -> list[str]:
    expanded = [term, *_SEARCH_SYNONYMS.get(term, ())]
    seen: set[str] = set()
    values: list[str] = []
    for item in expanded:
        normalized = _normalize_search_text(item)
        if normalized and normalized not in seen:
            seen.add(normalized)
            values.append(normalized)
    return values


def _levenshtein(a: str, b: str) -> int:
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)
    row = list(range(len(b) + 1))
    for i, char_a in enumerate(a, start=1):
        prev = row[0]
        row[0] = i
        for j, char_b in enumerate(b, start=1):
            tmp = row[j]
            row[j] = min(row[j] + 1, row[j - 1] + 1, prev + (0 if char_a == char_b else 1))
            prev = tmp
    return row[-1]


def _fuzzy_word_match(term: str, haystack: str) -> bool:
    if len(term) < 3:
        return False
    max_distance = 1 if len(term) <= 5 else 2
    for word in re.split(r"[\s-]+", haystack):
        if abs(len(word) - len(term)) <= max_distance and _levenshtein(term, word) <= max_distance:
            return True
    return False


def _tool_priority_score(tool: ToolDefinition, popularity_map: dict[str, int]) -> float:
    global_count = popularity_map.get(tool.slug, 0)
    static_rank = float(tool.popularity_rank or 0)
    try:
        category_index = _DAILY_CATEGORY_PRIORITY.index(tool.category)
    except ValueError:
        category_score = 0.0
    else:
        category_score = float(len(_DAILY_CATEGORY_PRIORITY) - category_index) * 1.5
    return (
        float(_DAILY_TOOL_BONUS.get(tool.slug, 0))
        + static_rank * 0.8
        + category_score
        + min(260.0, float(global_count)) * 0.7
        + (20.0 * ((global_count + 1) ** 0.5))
    )


def _query_score(tool: ToolDefinition, query: str, popularity_map: dict[str, int]) -> float:
    normalized_query = _normalize_search_text(query)
    tokens = _search_terms(normalized_query)
    title = _normalize_search_text(tool.title)
    slug = _normalize_search_text(tool.slug.replace("-", " "))
    desc = _normalize_search_text(tool.description)
    tags = _normalize_search_text(" ".join(tool.tags))
    category = _normalize_search_text(tool.category)
    haystack = f"{title} {slug} {desc} {tags} {category}"

    if not tokens:
        return _tool_priority_score(tool, popularity_map)

    score = 0.0
    for token in tokens:
        best = 0.0
        for index, term in enumerate(_expand_search_term(token)):
            multiplier = 1.0 if index == 0 else 0.72
            if title == term:
                best = max(best, 1200.0 * multiplier)
            elif slug == term:
                best = max(best, 1100.0 * multiplier)
            elif title.startswith(term):
                best = max(best, 720.0 * multiplier)
            elif slug.startswith(term):
                best = max(best, 680.0 * multiplier)
            elif re.search(rf"\b{re.escape(term)}", title):
                best = max(best, 460.0 * multiplier)
            elif term in title:
                best = max(best, 300.0 * multiplier)
            elif term in slug:
                best = max(best, 260.0 * multiplier)
            elif term in tags:
                best = max(best, 180.0 * multiplier)
            elif term in desc:
                best = max(best, 80.0 * multiplier)
            elif term in category:
                best = max(best, 52.0 * multiplier)
            elif index == 0 and _fuzzy_word_match(term, haystack):
                best = max(best, 36.0)
        if best == 0:
            return -1
        score += best

    if title == normalized_query:
        score += 600.0
    if slug == normalized_query:
        score += 540.0
    if normalized_query and normalized_query in title:
        score += 220.0
    if normalized_query and normalized_query in slug:
        score += 190.0

    score += max(0.0, 44.0 - len(title) / 2)
    score += min(220.0, _tool_priority_score(tool, popularity_map) * 0.24)
    return score


def _catalog_score(tool: ToolDefinition, popularity_map: dict[str, int]) -> float:
    return _tool_priority_score(tool, popularity_map)


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
    tool = _TOOL_BY_SLUG.get(slug)
    if tool:
        return tool
    raise HTTPException(status_code=404, detail="Tool not found")


@app.get("/health")
@app.get("/api/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if not _MISSING_HANDLER_SLUGS and not _DUPLICATE_TOOL_SLUGS else "degraded",
        "tools": len(_TOOL_SLUGS),
        "handlers": len(HANDLERS),
        "categories": len(_CATEGORY_IDS),
        "missing_handlers": len(_MISSING_HANDLER_SLUGS),
        "duplicate_slugs": len(_DUPLICATE_TOOL_SLUGS),
        "orphan_categories": len(_ORPHAN_CATEGORY_IDS),
    }


@app.get("/sitemap.xml", response_class=Response)
def sitemap_xml() -> Response:
    today = date.today().strftime("%Y-%m-%d")
    base = SITE_BASE_URL

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
    content = f"""# ISHU TOOLS — robots.txt
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
Sitemap: {SITE_BASE_URL}/sitemap.xml
Sitemap: {SITE_FALLBACK_URL}/sitemap.xml

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
    base = SITE_BASE_URL
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
- **Mirror URL**: {SITE_FALLBACK_URL}
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
    base = SITE_BASE_URL
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
    records = list(_TOOL_BY_SLUG.values())

    if category:
        records = [tool for tool in records if tool.category == category]

    popularity_map, _, _ = _popularity_snapshot()

    if q:
        query = q.lower().strip()
        scored: list[tuple[float, ToolDefinition]] = []
        for tool in records:
            score = _query_score(tool, query, popularity_map)
            if score >= 0:
                scored.append((score, tool))
        scored.sort(key=lambda item: (-item[0], item[1].title.lower()))
        records = [tool for _, tool in scored]
    else:
        records.sort(key=lambda tool: (-_catalog_score(tool, popularity_map), tool.title.lower()))

    data = [tool.model_dump() for tool in records]
    cache_header = _CACHE_CONTROL_STATIC if not q else "no-store"
    return JSONResponse(content=data, headers={"Cache-Control": cache_header})


@app.get("/api/popularity")
def tool_popularity() -> Response:
    counts, total_events, updated_at = _popularity_snapshot()
    top_items = sorted(counts.items(), key=lambda item: item[1], reverse=True)[:250]
    payload = {
        "status": "ok",
        "total_events": total_events,
        "updated_at": updated_at,
        "counts": counts,
        "top": [{"slug": slug, "count": count} for slug, count in top_items],
    }
    return JSONResponse(
        content=payload,
        headers={"Cache-Control": "public, max-age=60, stale-while-revalidate=30"},
    )


@app.get("/api/tools/integrity")
def tools_integrity() -> Response:
    """Machine-readable catalog/handler integrity report for deploy checks."""
    payload = {
        "status": "ok" if not _MISSING_HANDLER_SLUGS and not _DUPLICATE_TOOL_SLUGS else "degraded",
        "tool_count": len(_TOOL_SLUGS),
        "raw_tool_records": len(TOOLS),
        "handler_count": len(HANDLERS),
        "category_count": len(_CATEGORY_IDS),
        "missing_handlers": _MISSING_HANDLER_SLUGS,
        "duplicate_slugs": _DUPLICATE_TOOL_SLUGS,
        "orphan_categories": _ORPHAN_CATEGORY_IDS,
        "coverage_percent": round(((len(_TOOL_SLUGS) - len(_MISSING_HANDLER_SLUGS)) / max(1, len(_TOOL_SLUGS))) * 100, 2),
    }
    return JSONResponse(
        content=payload,
        headers={"Cache-Control": "public, max-age=60, stale-while-revalidate=60"},
    )


@app.post("/api/popularity/visit")
def track_tool_visit(
    request: Request,
    payload: dict[str, Any] = Body(default={}),
) -> Response:
    slug = str(payload.get("slug", "")).strip().lower()
    if not slug:
        raise HTTPException(status_code=422, detail="Field 'slug' is required.")
    if slug not in _TOOL_SLUGS:
        raise HTTPException(status_code=404, detail="Tool not found")

    client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or \
                (request.client.host if request.client else "unknown")
    _check_rate_limit(client_ip)

    count, total_events = _record_tool_visit(slug)
    return JSONResponse(
        content={
            "status": "ok",
            "slug": slug,
            "count": count,
            "total_events": total_events,
        },
        headers={"Cache-Control": "no-store"},
    )


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


def _friendly_error_message(exc: Exception, files: list | None = None) -> str:
    """Translate raw library exceptions into user-friendly text.

    Goals:
    - Never leak server filesystem paths to the client.
    - Map common library errors (PIL, PyPDF2, ffmpeg, requests, yt-dlp) to
      plain-English suggestions the user can act on.
    """
    import re as _re
    raw = str(exc) if exc else ""
    # Scrub server paths /home/runner/... or /tmp/... and replace with the
    # uploaded file name when known.
    upload_name = ""
    if files:
        try:
            first = files[0]
            upload_name = getattr(first, "filename", "") or ""
        except Exception:
            upload_name = ""
    raw = _re.sub(r"/[\w\-./]+/jobs/[a-f0-9]+/(?:input|output)/[\w\-.]+", upload_name or "your file", raw)
    raw = _re.sub(r"/(home|tmp|var|usr)/[\w\-./]+", "[file]", raw)

    low = raw.lower()
    cls = exc.__class__.__name__

    # ── Image library (Pillow) ──────────────────────────────────────────────
    if "cannot identify image file" in low or "unidentifiedimageerror" in cls.lower():
        return "We couldn't read that image. Please upload a valid image file (PNG, JPG, WebP, BMP, GIF or TIFF)."
    if "image file is truncated" in low:
        return "The image file appears to be incomplete or corrupted. Please re-export it and try again."
    if "decompression bomb" in low:
        return "That image is too large to process safely. Please resize it before uploading."

    # ── PDF library (PyPDF2 / pypdf) ────────────────────────────────────────
    if "stream has ended unexpectedly" in low or "eof marker not found" in low or "pdf header" in low:
        return "We couldn't read that PDF — the file looks corrupted or incomplete. Please re-export it and try again."
    if "file has not been decrypted" in low or "encrypted" in low and "pdf" in low:
        return "This PDF is password-protected. Please remove the password before uploading, or use the Unlock PDF tool first."
    if cls in ("PdfReadError", "PdfStreamError"):
        return "This PDF could not be parsed. It may be corrupted, scanned-only, or use a non-standard format."

    # ── ffmpeg / video / audio ──────────────────────────────────────────────
    if "ffmpeg" in low or "moov atom not found" in low or "invalid data found" in low:
        return "We couldn't process that media file. Please make sure it's a valid video or audio file (MP4, MOV, MP3, WAV, etc.)."
    if "no such file or directory" in low and ("ffmpeg" in low or "ffprobe" in low):
        return "Media processing is temporarily unavailable on the server. Please try again in a moment."

    # ── Network / yt-dlp / requests ─────────────────────────────────────────
    if "yt-dlp" in low or "youtube_dl" in low or "extractorerror" in cls.lower():
        return "The video host blocked or rate-limited the download. Try again in a minute, or paste your browser cookies in the optional Cookies field below."
    if "ssl" in low and ("error" in low or "verify" in low):
        return "Could not establish a secure connection to that URL. Please check the link and try again."
    if "timed out" in low or "timeout" in low:
        return "The request took too long. Please try a smaller file or try again in a moment."
    if "connection" in low and ("refused" in low or "reset" in low):
        return "Network connection failed. Please check your link and try again."

    # ── Numeric conversion (calculator inputs) ─────────────────────────────
    if cls == "ValueError" and ("could not convert" in low or "invalid literal" in low):
        return "Please enter valid numbers in all fields and try again."
    if cls == "ZeroDivisionError" or "division by zero" in low:
        return "Calculation cannot divide by zero. Please adjust your inputs."

    # ── Generic library / programmer errors — never expose tracebacks ──────
    if cls in ("KeyError", "IndexError", "TypeError", "AttributeError", "UnboundLocalError"):
        return "Something went wrong while processing your input. Please double-check the values and try again."
    if cls == "MemoryError":
        return "The file is too large for this tool. Please try a smaller file."
    if "permission denied" in low:
        return "Could not write the result. Please try again."

    # ── Fallback: trimmed message, no paths ─────────────────────────────────
    safe = raw.strip()[:180] or "Something went wrong."
    return f"Could not complete the task: {safe}"


@app.get("/api/cache/stats")
def cache_stats() -> dict:
    """Return LRU cache statistics for monitoring."""
    return {"cache": _tool_cache.stats(), "rate_limit": {"window_s": _RATE_LIMIT_WINDOW, "max_requests": _RATE_LIMIT_REQUESTS}}


@app.post("/api/tools/{slug}/execute")
def run_tool(
    request: Request,
    background_tasks: BackgroundTasks,
    slug: str,
    files: Annotated[list[UploadFile] | None, File()] = None,
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

    uploaded_files = files or []
    payload_data = parse_payload(payload)

    # ── Check LRU cache for text-only tools ──────────────────────────────────
    use_cache = _should_cache(slug, uploaded_files)
    if use_cache:
        cached = _tool_cache.get(slug, payload_data)
        if cached is not None:
            return JSONResponse(
                content=cached,
                headers={"X-Cache": "HIT", "Cache-Control": "private, max-age=300"},
            )

    # ── Validate file upload requirements ──
    if tool.input_kind == "files" and not uploaded_files:
        raise HTTPException(
            status_code=422,
            detail=f"{tool.title} requires at least one file to be uploaded.",
        )

    # ── Validate individual file sizes (100 MB max per file) ──
    MAX_FILE_SIZE = 100 * 1024 * 1024
    for f in uploaded_files:
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
    MAX_TOTAL_UPLOAD_SIZE = 250 * 1024 * 1024
    known_total_size = sum(int(f.size or 0) for f in uploaded_files)
    if known_total_size > MAX_TOTAL_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Total upload size exceeds 250 MB. Please split the job into smaller batches.",
        )

    for f in uploaded_files:
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
    saved_files = save_uploads(uploaded_files, input_dir) if uploaded_files else []

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
        friendly = _friendly_error_message(exc, uploaded_files)
        # Detect user-input/file-validation issues and surface them as 400 (not scary 500).
        low = friendly.lower()
        validation_signals = (
            "couldn't read", "could not read", "looks corrupted", "password-protected",
            "valid image", "valid pdf", "valid file", "valid url", "invalid file",
            "not a zip", "not a valid", "unsupported", "please upload", "please re-export",
            "bad zip", "package not found", "cannot be used in worksheets",
        )
        status = 400 if any(sig in low for sig in validation_signals) else 500
        raise HTTPException(status_code=status, detail=friendly) from exc

    if result.kind == "json":
        # JSON results don't need the workspace — clean it up immediately
        background_tasks.add_task(_cleanup_workspace, job_root)
        # If the handler signalled a graceful error via data.error, surface it as status:"error"
        # so the frontend can render the helpful message in its error UI instead of treating it
        # as a successful response. This fixes the universal "looks broken" UX across hundreds
        # of tools (Instagram cookies needed, invalid URL, missing field, rate-limited, etc.).
        result_data = result.data or {}
        has_error = isinstance(result_data, dict) and bool(result_data.get("error"))
        response_data = {
            "status": "error" if has_error else "success",
            "message": result.message,
            "job_id": job_id,
            "data": result_data,
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
