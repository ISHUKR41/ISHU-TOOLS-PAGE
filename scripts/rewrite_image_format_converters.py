"""
Enrich image-format converter rows in registry.py and catalogFallback.ts.
Adds: precise title with extensions, description with format pros + use case,
richer search tags. Idempotent.
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "backend" / "app" / "registry.py"
FALLBACK = ROOT / "frontend" / "src" / "data" / "catalogFallback.ts"

# Per-format facts.
F = {
    "png":  ("PNG",  ".png",  "lossless raster with alpha transparency"),
    "jpg":  ("JPG",  ".jpg",  "lossy photo format with small file sizes"),
    "jpeg": ("JPEG", ".jpeg", "lossy photo format (same as JPG)"),
    "webp": ("WebP", ".webp", "modern web format ~30% smaller than JPG/PNG"),
    "bmp":  ("BMP",  ".bmp",  "uncompressed legacy Windows bitmap"),
    "gif":  ("GIF",  ".gif",  "indexed-palette format used for animations"),
    "tiff": ("TIFF", ".tiff", "lossless print/scan format"),
    "tif":  ("TIF",  ".tif",  "lossless print/scan format"),
    "ico":  ("ICO",  ".ico",  "Windows favicon container"),
    "heic": ("HEIC", ".heic", "iPhone-native HEVC photo format"),
    "svg":  ("SVG",  ".svg",  "scalable vector graphics"),
    "pdf":  ("PDF",  ".pdf",  "Portable Document Format"),
    "image":("Image","image", "any raster image (PNG/JPG/WebP)"),
}

# Special hand-tuned descriptions for common pairs.
DESC = {
    ("jpg","png"):  "Convert JPG/JPEG photos to lossless PNG with optional transparency. Re-save without quality loss. Batch supported, no watermark.",
    ("jpeg","png"): "Convert JPEG to lossless PNG instantly. Preserves full color, no recompression artifacts. Free, batch supported.",
    ("png","jpg"):  "Convert transparent PNG to JPG with white (or chosen) background. Smaller files, perfect for sharing. Quality control included.",
    ("png","jpeg"): "Convert PNG to JPEG with quality control. Removes alpha by flattening over white. Free, batch supported.",
    ("webp","png"): "Convert modern WebP images to widely-compatible PNG with transparency preserved. Useful when an app rejects .webp uploads.",
    ("png","webp"): "Convert PNG to WebP — typically 25-35% smaller with the same visual quality. Great for faster page loads.",
    ("heic","png"): "Convert iPhone HEIC photos to PNG so any device can open them. Lossless, full quality preserved.",
    ("heic","jpg"): "Convert iPhone HEIC photos to JPG (the universal photo format). Smaller files, opens everywhere.",
    ("heic","webp"):"Convert iPhone HEIC to lightweight WebP for fast websites and email. Quality preserved.",
    ("heic","pdf"): "Convert iPhone HEIC photos straight to a PDF — perfect for sending receipts, IDs, and scans.",
    ("svg","jpg"):  "Rasterize vector SVG into a JPG image at the resolution you need. Fonts and shapes flattened.",
    ("svg","png"):  "Rasterize vector SVG into a transparent PNG at the resolution you need.",
    ("png","ico"):  "Convert PNG into a multi-size ICO favicon (16/32/48/64/128/256). Drop straight into your site.",
    ("jpg","ico"):  "Convert JPG into an ICO favicon. Auto-square crop and multi-size output included.",
    ("ico","png"):  "Extract favicon ICO frames as PNGs. Each size becomes its own file.",
    ("gif","png"):  "Extract the first frame of a GIF as a transparent PNG.",
    ("gif","jpg"):  "Extract the first frame of a GIF as a JPG photo.",
    ("tiff","jpg"): "Convert TIFF/TIF scans to JPG — much smaller files, easy to email.",
    ("tiff","pdf"): "Convert TIFF scans straight into a single PDF — ideal for filing and sharing.",
    ("png","pdf"):  "Wrap a PNG image into a single-page PDF (A4 or original size).",
    ("png","svg"):  "Wrap a PNG inside an SVG container — keeps the file vector-compatible for embedding.",
    ("jpg","svg"):  "Wrap a JPG inside an SVG container — useful when a tool only accepts vector inputs.",
    ("image","svg"):"Convert any raster image (PNG/JPG/WebP) into an SVG container — keeps original quality, embeddable anywhere.",
}

def _enrich(slug: str) -> tuple[str, str, list[str]] | None:
    m = re.match(r"^([a-z]+)-to-([a-z]+)$", slug)
    if not m: return None
    a, b = m.group(1), m.group(2)
    if a not in F or b not in F: return None

    A_disp, A_ext, A_note = F[a]
    B_disp, B_ext, B_note = F[b]
    title = f"{A_disp} to {B_disp} Converter ({A_ext} → {B_ext})"
    if a == "image":
        title = f"Image to {B_disp} Converter (any image → {B_ext})"

    desc = DESC.get((a, b))
    if not desc:
        # Generic but format-aware fallback.
        desc = f"Convert {A_disp} ({A_note}) to {B_disp} ({B_note}). Free, no signup, batch supported."

    tags = list(dict.fromkeys([
        f"{a} to {b}",
        f"convert {a} to {b}",
        f"{a} {b} converter",
        f"{A_ext} to {B_ext}",
        f"{a} to {b} free",
        A_disp.lower(), B_disp.lower(),
        f"{B_disp.lower()} from {A_disp.lower()}",
        "image converter",
    ]))
    return title, desc, tags

def _ts_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def patch_registry() -> int:
    text = REGISTRY.read_text(encoding="utf-8")
    m = re.search(r"_IMAGE_FORMAT_DEFS\s*[:=][^=\n]*=\s*\[", text)
    if not m: return 0
    start = m.end(); depth = 1; i = start
    while i < len(text) and depth > 0:
        c = text[i]
        if c == "[": depth += 1
        elif c == "]": depth -= 1
        i += 1
    block = text[start : i - 1]
    pat = re.compile(
        r"\(\s*\"([a-z-]+)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\[([^\]]*)\]\s*\)",
    )
    changed = 0
    def repl(mm: re.Match) -> str:
        nonlocal changed
        slug = mm.group(1)
        en = _enrich(slug)
        if not en: return mm.group(0)
        title, desc, tags = en
        # Preserve any specifically-tuned titles like favicon-generator
        if slug == "favicon-generator":
            return mm.group(0)
        # Preserve titles that already include "Favicon Generator" descriptor
        if "Favicon Generator" in mm.group(2):
            return mm.group(0)
        tag_str = ", ".join('"' + t.replace('"', '\\"') + '"' for t in tags)
        new = f'("{slug}", "{title}", "{desc}", [{tag_str}])'
        if new != mm.group(0):
            changed += 1
        return new
    new_block = pat.sub(repl, block)
    new_text = text[:start] + new_block + text[i - 1:]
    if new_text != text:
        REGISTRY.write_text(new_text, encoding="utf-8")
    return changed

def patch_fallback() -> int:
    text = FALLBACK.read_text(encoding="utf-8")
    obj_pat = re.compile(
        r"""
        \{\s*
        "slug"\s*:\s*"(?P<slug>[a-z-]+)"\s*,\s*
        "title"\s*:\s*"(?P<title>[^"]*)"\s*,\s*
        "description"\s*:\s*"(?P<desc>[^"]*)"\s*,\s*
        "category"\s*:\s*"(?P<cat>image-tools|image-core|image-format|format-lab|developer-tools|student-tools)"\s*,\s*
        "tags"\s*:\s*\[(?P<tags>[^\]]*)\]\s*,\s*
        "input_kind"\s*:\s*"(?P<ik>[^"]*)"\s*,\s*
        "accepts_multiple"\s*:\s*(?P<am>true|false)\s*
        \}
        """,
        re.VERBOSE,
    )
    changed = 0
    def repl(m: re.Match) -> str:
        nonlocal changed
        slug = m.group("slug")
        en = _enrich(slug)
        if not en: return m.group(0)
        if slug == "favicon-generator": return m.group(0)
        if "Favicon Generator" in m.group("title"): return m.group(0)
        title, desc, tags = en
        tag_lines = ",\n      ".join(_ts_str(t) for t in tags)
        new = (
            "{\n"
            f'    "slug": {_ts_str(slug)},\n'
            f'    "title": {_ts_str(title)},\n'
            f'    "description": {_ts_str(desc)},\n'
            f'    "category": "{m.group("cat")}",\n'
            f'    "tags": [\n      {tag_lines}\n    ],\n'
            f'    "input_kind": {_ts_str(m.group("ik"))},\n'
            f'    "accepts_multiple": {m.group("am")}\n'
            "  }"
        )
        if new != m.group(0):
            changed += 1
        return new
    new_text = obj_pat.sub(repl, text)
    if new_text != text:
        FALLBACK.write_text(new_text, encoding="utf-8")
    return changed

if __name__ == "__main__":
    print("registry.py rows updated:", patch_registry())
    print("catalogFallback.ts entries updated:", patch_fallback())
