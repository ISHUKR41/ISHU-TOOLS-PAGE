"""
ISHU TOOLS — Image Format Converter Pack (2026)

Wraps `handle_convert_image` to expose SEO-friendly format-specific slugs:
  jpg-to-png, png-to-jpg, jpg-to-pdf, png-to-pdf, png-to-ico, jpg-to-ico,
  webp-to-png, png-to-bmp, bmp-to-png, bmp-to-jpg, gif-to-png, gif-to-jpg,
  tiff-to-png, tiff-to-jpg, png-to-tiff, jpg-to-tiff, jpg-to-bmp,
  ico-to-png, ico-to-jpg, jpg-to-gif, png-to-gif, etc.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

from .handlers import ExecutionResult, handle_convert_image


def _wrap_image(target_format: str):
    def _h(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
        p = dict(payload or {})
        p["target_format"] = target_format
        return handle_convert_image(files, p, output_dir)
    return _h


IMAGE_FORMAT_HANDLERS: dict = {
    # ── To PNG ──
    "jpg-to-png":   _wrap_image("png"),
    "jpeg-to-png":  _wrap_image("png"),
    "webp-to-png":  _wrap_image("png"),
    "bmp-to-png":   _wrap_image("png"),
    "gif-to-png":   _wrap_image("png"),
    "tiff-to-png":  _wrap_image("png"),
    "tif-to-png":   _wrap_image("png"),
    "ico-to-png":   _wrap_image("png"),
    "heic-to-png":  _wrap_image("png"),
    "svg-to-png":   _wrap_image("png"),

    # ── To JPG ──
    "png-to-jpg":   _wrap_image("jpg"),
    "png-to-jpeg":  _wrap_image("jpg"),
    "bmp-to-jpg":   _wrap_image("jpg"),
    "gif-to-jpg":   _wrap_image("jpg"),
    "tiff-to-jpg":  _wrap_image("jpg"),
    "tif-to-jpg":   _wrap_image("jpg"),
    "ico-to-jpg":   _wrap_image("jpg"),
    "svg-to-jpg":   _wrap_image("jpg"),

    # ── To WebP ──
    "bmp-to-webp":  _wrap_image("webp"),
    "gif-to-webp":  _wrap_image("webp"),
    "tiff-to-webp": _wrap_image("webp"),
    "heic-to-webp": _wrap_image("webp"),

    # ── To BMP ──
    "png-to-bmp":   _wrap_image("bmp"),
    "jpg-to-bmp":   _wrap_image("bmp"),
    "webp-to-bmp":  _wrap_image("bmp"),
    "gif-to-bmp":   _wrap_image("bmp"),

    # ── To GIF (single-frame) ──
    "png-to-gif":   _wrap_image("gif"),
    "jpg-to-gif":   _wrap_image("gif"),
    "webp-to-gif":  _wrap_image("gif"),
    "bmp-to-gif":   _wrap_image("gif"),

    # ── To TIFF ──
    "png-to-tiff":  _wrap_image("tiff"),
    "jpg-to-tiff":  _wrap_image("tiff"),
    "webp-to-tiff": _wrap_image("tiff"),
    "bmp-to-tiff":  _wrap_image("tiff"),

    # ── To ICO (favicon) ──
    "png-to-ico":   _wrap_image("ico"),
    "jpg-to-ico":   _wrap_image("ico"),
    "webp-to-ico":  _wrap_image("ico"),
    "bmp-to-ico":   _wrap_image("ico"),
    "favicon-generator": _wrap_image("ico"),

    # ── To PDF (single-image) ──
    "png-to-pdf":   _wrap_image("pdf"),
    "webp-to-pdf":  _wrap_image("pdf"),
    "bmp-to-pdf":   _wrap_image("pdf"),
    "gif-to-pdf":   _wrap_image("pdf"),
    "tiff-to-pdf":  _wrap_image("pdf"),
    "heic-to-pdf":  _wrap_image("pdf"),

    # ── To SVG (raster wrapped in SVG) ──
    "png-to-svg":   _wrap_image("svg"),
    "jpg-to-svg":   _wrap_image("svg"),
    "image-to-svg": _wrap_image("svg"),
}
