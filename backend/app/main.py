from datetime import date
from pathlib import Path
import importlib.util
import platform
import shutil
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response

from .models import ToolDefinition
from .registry import CATEGORIES, TOOLS
from .tools.handlers import HANDLERS, create_job_workspace, get_soffice_binary, parse_payload, save_uploads

app = FastAPI(
    title="Ishu Tools API",
    version="1.0.0",
    description="Backend API for ISHU TOOLS document and image operations.",
)

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
        "qr-code-generator", "remove-background", "pdf-to-excel",
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


@app.get("/api/categories")
def categories() -> list[dict]:
    seen: set[str] = set()
    records = []
    for category in CATEGORIES:
        if category.id in seen:
            continue
        seen.add(category.id)
        records.append(category)
    return [category.model_dump() for category in records]


@app.get("/api/tools")
def list_tools(category: str | None = None, q: str | None = None) -> list[dict]:
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

    return [tool.model_dump() for tool in records]


@app.get("/api/tools/{slug}")
def tool_details(slug: str) -> dict:
    tool = get_tool(slug)
    return tool.model_dump()


@app.post("/api/tools/{slug}/execute")
def run_tool(
    slug: str,
    files: Annotated[list[UploadFile], File()] = [],
    payload: Annotated[str | None, Form()] = None,
):
    tool = get_tool(slug)
    handler = HANDLERS.get(slug)
    if not handler:
        raise HTTPException(status_code=501, detail=f"Handler is not implemented for {tool.title}")

    payload_data = parse_payload(payload)

    job_id, input_dir, output_dir = create_job_workspace()
    saved_files = save_uploads(files, input_dir) if files else []

    result = handler(saved_files, payload_data, output_dir)

    if result.kind == "json":
        return JSONResponse(
            content={
                "status": "success",
                "message": result.message,
                "job_id": job_id,
                "data": result.data or {},
            }
        )

    if result.kind == "file" and result.output_path and Path(result.output_path).exists():
        safe_message = (result.message or "").encode("latin-1", errors="replace").decode("latin-1")
        return FileResponse(
            path=result.output_path,
            filename=result.filename,
            media_type=result.content_type or "application/octet-stream",
            headers={
                "X-Tool-Message": safe_message,
                "X-Job-Id": job_id,
            },
        )

    raise HTTPException(status_code=500, detail="Tool execution did not produce a valid output")
