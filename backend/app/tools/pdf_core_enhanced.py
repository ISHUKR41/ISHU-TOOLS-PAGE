"""
ISHU TOOLS — Enhanced PDF Core handlers (April 2026)
Replaces the 11 baseline PDF Core tools with richer, more configurable versions.

Tools enhanced:
  merge-pdf, compress-pdf, split-pdf, rotate-pdf, watermark-pdf,
  pdf-to-jpg, pdf-to-png, jpg-to-pdf, image-to-pdf, scan-to-pdf, optimize-pdf
"""
from __future__ import annotations

import io
import re
import shutil
import subprocess
import zipfile
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
import pikepdf
from PIL import Image, ImageEnhance, ImageOps

from .handlers import ExecutionResult
from .handlers import coerce_quality


# ════════════════════════════════════════════════════════════════════════════
# Helpers
# ════════════════════════════════════════════════════════════════════════════

def _err(message: str, **extra) -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data={"error": message, **extra})


def _hex_to_rgb01(value: str, default=(0.5, 0.5, 0.5)) -> tuple[float, float, float]:
    if not value:
        return default
    s = str(value).strip().lstrip("#")
    try:
        if len(s) == 3:
            s = "".join(c * 2 for c in s)
        if len(s) != 6:
            return default
        return (int(s[0:2], 16) / 255, int(s[2:4], 16) / 255, int(s[4:6], 16) / 255)
    except Exception:
        return default


def _parse_page_range(spec: str, total: int) -> list[int]:
    """Parse '1,3,5-7' into 0-indexed page list. Returns all pages on 'all' / empty."""
    if not spec or str(spec).strip().lower() in ("all", "*"):
        return list(range(total))
    pages: list[int] = []
    for part in re.split(r"[,\s]+", str(spec).strip()):
        if not part:
            continue
        if "-" in part:
            try:
                a, b = part.split("-", 1)
                start = max(1, int(a)) if a else 1
                end = min(total, int(b)) if b else total
                pages.extend(range(start - 1, end))
            except ValueError:
                continue
        else:
            try:
                idx = int(part)
                if 1 <= idx <= total:
                    pages.append(idx - 1)
            except ValueError:
                continue
    seen = set()
    return [p for p in pages if not (p in seen or seen.add(p))]


def _zip_dir(src_dir: Path, zip_path: Path, pattern: str = "*") -> None:
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(src_dir.glob(pattern)):
            if f.is_file() and f.resolve() != zip_path.resolve():
                zf.write(f, f.name)


_PAGE_SIZES_PT = {
    "a4": (595.28, 841.89),
    "a3": (841.89, 1190.55),
    "a5": (419.53, 595.28),
    "letter": (612.0, 792.0),
    "legal": (612.0, 1008.0),
    "tabloid": (792.0, 1224.0),
}


# ════════════════════════════════════════════════════════════════════════════
# 1. MERGE PDF — adds order, blank-page separator, bookmark mode, metadata
# ════════════════════════════════════════════════════════════════════════════

def handle_merge_pdf_enhanced(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if len(files) < 2:
        return _err("Please upload at least 2 PDF files to merge.")

    order = (payload.get("order") or "upload").lower()
    blank_between = str(payload.get("blank_between", "false")).lower() in ("1", "true", "yes")
    bookmark_mode = (payload.get("bookmark_mode") or "preserve").lower()  # preserve|per_file|none
    title = (payload.get("title") or "").strip()

    sorted_files = list(files)
    if order == "name":
        sorted_files.sort(key=lambda p: p.name.lower())
    elif order == "name_desc":
        sorted_files.sort(key=lambda p: p.name.lower(), reverse=True)
    elif order == "reverse":
        sorted_files.reverse()

    try:
        out = fitz.open()
        toc: list[list] = []
        for src in sorted_files:
            with fitz.open(src) as doc:
                start_page = out.page_count + 1
                out.insert_pdf(doc)
                if bookmark_mode == "per_file":
                    toc.append([1, src.stem, start_page])
                elif bookmark_mode == "preserve":
                    sub_toc = doc.get_toc(simple=True)
                    for lvl, t, pg in sub_toc:
                        toc.append([lvl, t, pg + start_page - 1])
                if blank_between and src is not sorted_files[-1]:
                    out.new_page()  # blank separator

        if bookmark_mode != "none" and toc:
            try:
                out.set_toc(toc)
            except Exception:
                pass

        if title:
            try:
                meta = out.metadata or {}
                meta["title"] = title
                out.set_metadata(meta)
            except Exception:
                pass

        output_path = output_dir / "merged.pdf"
        out.save(output_path, garbage=4, deflate=True, clean=True)
        out.close()

        size_kb = output_path.stat().st_size // 1024
        return ExecutionResult(
            kind="file",
            message=f"✅ Merged {len(sorted_files)} PDFs ({size_kb} KB) — order: {order}, bookmarks: {bookmark_mode}.",
            output_path=output_path,
            filename="merged.pdf",
            content_type="application/pdf",
        )
    except Exception as e:
        return _err(f"Merge failed: {e}")


# ════════════════════════════════════════════════════════════════════════════
# 2. COMPRESS PDF — quality presets + grayscale + image DPI cap + strip-meta
# ════════════════════════════════════════════════════════════════════════════

def handle_compress_pdf_enhanced(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF to compress.")

    src = files[0]
    original = src.stat().st_size
    quality = (payload.get("quality") or "ebook").lower()
    quality_map = {"screen": "/screen", "ebook": "/ebook", "printer": "/printer", "prepress": "/prepress", "default": "/default"}
    gs_quality = quality_map.get(quality, "/ebook")

    try:
        image_dpi = int(payload.get("image_dpi") or 150)
    except Exception:
        image_dpi = 150
    image_dpi = max(36, min(600, image_dpi))
    grayscale = str(payload.get("grayscale", "false")).lower() in ("1", "true", "yes")
    strip_metadata = str(payload.get("strip_metadata", "false")).lower() in ("1", "true", "yes")
    fast_web = str(payload.get("fast_web", "true")).lower() in ("1", "true", "yes")

    output_path = output_dir / "compressed.pdf"
    gs_bin = shutil.which("gs") or shutil.which("gswin64c")

    if gs_bin:
        cmd = [
            gs_bin, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.5",
            f"-dPDFSETTINGS={gs_quality}",
            "-dNOPAUSE", "-dQUIET", "-dBATCH",
            "-dDownsampleColorImages=true", f"-dColorImageResolution={image_dpi}",
            "-dDownsampleGrayImages=true",  f"-dGrayImageResolution={image_dpi}",
            "-dDownsampleMonoImages=true",  f"-dMonoImageResolution={max(image_dpi, 300)}",
            "-dColorImageDownsampleType=/Bicubic",
            "-dGrayImageDownsampleType=/Bicubic",
            "-dEmbedAllFonts=true", "-dSubsetFonts=true", "-dCompressFonts=true",
        ]
        if grayscale:
            cmd += ["-sProcessColorModel=DeviceGray", "-sColorConversionStrategy=Gray", "-dOverrideICC"]
        if fast_web:
            cmd += ["-dFastWebView=true"]
        cmd += [f"-sOutputFile={output_path}", str(src)]
        try:
            subprocess.run(cmd, capture_output=True, timeout=180, check=False)
        except subprocess.TimeoutExpired:
            return _err("Compression timed out — try a smaller PDF.")

    if not output_path.exists() or output_path.stat().st_size == 0:
        # Fallback: pikepdf
        with pikepdf.open(src) as pdf:
            pdf.remove_unreferenced_resources()
            if strip_metadata:
                with pdf.open_metadata() as meta:
                    meta.clear()
            pdf.save(
                output_path,
                compress_streams=True,
                stream_decode_level=pikepdf.StreamDecodeLevel.generalized,
                object_stream_mode=pikepdf.ObjectStreamMode.generate,
                recompress_flate=True,
                normalize_content=not fast_web,
                linearize=fast_web,
            )
    elif strip_metadata:
        try:
            with pikepdf.open(output_path, allow_overwriting_input=True) as pdf:
                with pdf.open_metadata() as meta:
                    meta.clear()
                pdf.save(output_path)
        except Exception:
            pass

    new_size = output_path.stat().st_size
    reduction = ((original - new_size) / original) * 100 if original else 0
    return ExecutionResult(
        kind="file",
        message=f"✅ {reduction:.1f}% smaller ({original // 1024} KB → {new_size // 1024} KB) · quality={quality}, dpi={image_dpi}{' · grayscale' if grayscale else ''}.",
        output_path=output_path,
        filename="compressed.pdf",
        content_type="application/pdf",
    )


# ════════════════════════════════════════════════════════════════════════════
# 3. SPLIT PDF — modes: per-page, ranges, every-N-pages, single-range
# ════════════════════════════════════════════════════════════════════════════

def handle_split_pdf_enhanced(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF to split.")

    mode = (payload.get("mode") or payload.get("split_mode") or "each_page").lower()
    pages_spec = (payload.get("pages") or payload.get("range") or "all").strip()
    try:
        every_n = max(1, int(payload.get("every_n") or 1))
    except Exception:
        every_n = 1

    src = files[0]
    try:
        with pikepdf.open(src) as pdf:
            total = len(pdf.pages)
            written: list[Path] = []

            if mode == "single_range":
                wanted = _parse_page_range(pages_spec, total) or list(range(total))
                if not wanted:
                    return _err("No valid pages in your range.")
                out = pikepdf.new()
                for i in wanted:
                    out.pages.append(pdf.pages[i])
                p = output_dir / f"{src.stem}_p{wanted[0]+1}-{wanted[-1]+1}.pdf"
                out.save(p)
                written.append(p)

            elif mode == "every_n":
                idx = 0
                for chunk_start in range(0, total, every_n):
                    out = pikepdf.new()
                    for i in range(chunk_start, min(chunk_start + every_n, total)):
                        out.pages.append(pdf.pages[i])
                    idx += 1
                    p = output_dir / f"{src.stem}_part{idx:03d}.pdf"
                    out.save(p)
                    written.append(p)

            elif mode == "ranges":
                # multiple ranges separated by ';' → one file each
                groups = [g.strip() for g in re.split(r";", pages_spec) if g.strip()] or [pages_spec]
                for gi, grp in enumerate(groups, 1):
                    wanted = _parse_page_range(grp, total)
                    if not wanted:
                        continue
                    out = pikepdf.new()
                    for i in wanted:
                        out.pages.append(pdf.pages[i])
                    p = output_dir / f"{src.stem}_group{gi:02d}.pdf"
                    out.save(p)
                    written.append(p)

            else:  # each_page (default)
                wanted = _parse_page_range(pages_spec, total)
                for i in wanted:
                    out = pikepdf.new()
                    out.pages.append(pdf.pages[i])
                    p = output_dir / f"{src.stem}_page_{i+1}.pdf"
                    out.save(p)
                    written.append(p)

            if not written:
                return _err("No pages were produced — check your selection.")

            if len(written) == 1:
                p = written[0]
                return ExecutionResult(
                    kind="file",
                    message=f"✅ Extracted {len(written)} PDF.",
                    output_path=p, filename=p.name, content_type="application/pdf",
                )

            zip_path = output_dir / f"{src.stem}_split.zip"
            with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
                for p in written:
                    zf.write(p, p.name)
            return ExecutionResult(
                kind="file",
                message=f"✅ Split into {len(written)} PDFs (mode={mode}).",
                output_path=zip_path, filename=zip_path.name, content_type="application/zip",
            )
    except Exception as e:
        return _err(f"Split failed: {e}")


# ════════════════════════════════════════════════════════════════════════════
# 4. ROTATE PDF — angle + page selection + flip-orientation
# ════════════════════════════════════════════════════════════════════════════

def handle_rotate_pdf_enhanced(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF to rotate.")

    try:
        angle = int(payload.get("angle") or payload.get("rotation") or 90)
    except Exception:
        angle = 90
    if angle not in (90, 180, 270, -90, -180, -270):
        angle = 90
    pages_spec = (payload.get("pages") or "all").strip()

    src = files[0]
    try:
        doc = fitz.open(src)
        wanted = _parse_page_range(pages_spec, doc.page_count)
        if not wanted:
            doc.close()
            return _err("No valid pages selected.")
        for idx in wanted:
            page = doc.load_page(idx)
            new_rotation = (page.rotation + angle) % 360
            page.set_rotation(new_rotation)
        out_path = output_dir / "rotated.pdf"
        doc.save(out_path, garbage=4, deflate=True)
        doc.close()
        return ExecutionResult(
            kind="file",
            message=f"✅ Rotated {len(wanted)} page(s) by {angle}°.",
            output_path=out_path, filename="rotated.pdf",
            content_type="application/pdf",
        )
    except Exception as e:
        return _err(f"Rotate failed: {e}")


# ════════════════════════════════════════════════════════════════════════════
# 5. WATERMARK PDF — text, position, opacity, color, rotation, font_size, pages
# ════════════════════════════════════════════════════════════════════════════

def handle_watermark_pdf_enhanced(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF to watermark.")

    text = str(payload.get("text") or "WATERMARK")
    position = (payload.get("position") or "diagonal").lower()
    try:
        opacity = max(0.05, min(1.0, float(payload.get("opacity") or 0.3)))
    except Exception:
        opacity = 0.3
    try:
        font_size = max(8, min(200, int(payload.get("font_size") or 50)))
    except Exception:
        font_size = 50
    color = _hex_to_rgb01(str(payload.get("color") or "#888888"))
    pages_spec = (payload.get("pages") or "all").strip()

    # PyMuPDF insert_text doesn't support opacity directly. Simulate transparency
    # by blending color toward white (works visually on white-page documents).
    blended = tuple(c * opacity + 1.0 * (1 - opacity) for c in color)

    src = files[0]
    try:
        doc = fitz.open(src)
        targets = _parse_page_range(pages_spec, doc.page_count)
        for idx in targets:
            page = doc.load_page(idx)
            rect = page.rect
            try:
                tw = fitz.get_text_length(text, fontsize=font_size)
            except Exception:
                tw = font_size * len(text) * 0.5

            def _diag_text(cx: float, cy: float):
                """Draw rotated text using morph matrix (PyMuPDF only allows 0/90/180/270 in rotate kwarg)."""
                tw_box = fitz.Rect(cx - tw, cy - font_size, cx + tw, cy + font_size)
                pivot = fitz.Point(cx, cy)
                mat = fitz.Matrix(1, 1).prerotate(-30)
                page.insert_textbox(
                    tw_box, text, fontsize=font_size, color=blended,
                    align=fitz.TEXT_ALIGN_CENTER, morph=(pivot, mat),
                )

            if position == "tile":
                for row in range(3):
                    for col in range(3):
                        cx = rect.width * (col + 0.5) / 3
                        cy = rect.height * (row + 0.5) / 3
                        _diag_text(cx, cy)
            elif position == "header":
                page.insert_text(((rect.width - tw) / 2, 30), text,
                                 fontsize=font_size, color=blended)
            elif position == "footer":
                page.insert_text(((rect.width - tw) / 2, rect.height - 20), text,
                                 fontsize=font_size, color=blended)
            elif position == "center":
                page.insert_text(((rect.width - tw) / 2, rect.height / 2), text,
                                 fontsize=font_size, color=blended)
            else:  # diagonal
                _diag_text(rect.width / 2, rect.height / 2)

        out_path = output_dir / "watermarked.pdf"
        doc.save(out_path, garbage=4, deflate=True)
        doc.close()
        return ExecutionResult(
            kind="file",
            message=f"✅ Watermark applied · {position}, opacity {opacity:.2f}, size {font_size}pt, {len(targets)} page(s).",
            output_path=out_path, filename="watermarked.pdf",
            content_type="application/pdf",
        )
    except Exception as e:
        return _err(f"Watermark failed: {e}")


# ════════════════════════════════════════════════════════════════════════════
# 6 & 7. PDF → JPG / PDF → PNG — dpi, quality, page range, color mode
# ════════════════════════════════════════════════════════════════════════════

def _pdf_to_image_enhanced(files, payload, output_dir, fmt: str) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF.")
    src = files[0]
    try:
        dpi = max(72, min(600, int(payload.get("dpi") or 200)))
    except Exception:
        dpi = 200
    try:
        quality = max(10, min(100, coerce_quality(payload.get("quality"), 92)))
    except Exception:
        quality = 92
    color_mode = (payload.get("color_mode") or "rgb").lower()
    pages_spec = (payload.get("pages") or "all").strip()
    transparent = str(payload.get("transparent_bg", "false")).lower() in ("1", "true", "yes") and fmt == "png"

    try:
        doc = fitz.open(src)
        wanted = _parse_page_range(pages_spec, doc.page_count)
        if not wanted:
            doc.close()
            return _err("No valid pages in your range.")
        zoom = dpi / 72
        matrix = fitz.Matrix(zoom, zoom)
        produced: list[Path] = []
        for i in wanted:
            page = doc.load_page(i)
            alpha = transparent
            pix = page.get_pixmap(matrix=matrix, alpha=alpha)
            img = Image.frombytes(
                "RGBA" if alpha else "RGB",
                (pix.width, pix.height),
                pix.samples,
            )
            if color_mode == "grayscale":
                img = ImageOps.grayscale(img)
            out = output_dir / f"{src.stem}_page_{i+1}.{fmt}"
            if fmt == "jpg":
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.save(out, "JPEG", quality=quality, optimize=True)
            else:
                img.save(out, "PNG", optimize=True)
            produced.append(out)
        doc.close()

        if not produced:
            return _err("Nothing rendered.")
        if len(produced) == 1:
            p = produced[0]
            return ExecutionResult(
                kind="file",
                message=f"✅ Rendered 1 page at {dpi} DPI ({color_mode}).",
                output_path=p, filename=p.name,
                content_type=f"image/{'jpeg' if fmt == 'jpg' else 'png'}",
            )
        zip_path = output_dir / f"{src.stem}_{fmt}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for p in produced:
                zf.write(p, p.name)
        return ExecutionResult(
            kind="file",
            message=f"✅ Rendered {len(produced)} pages at {dpi} DPI ({color_mode}{', transparent' if transparent else ''}).",
            output_path=zip_path, filename=zip_path.name, content_type="application/zip",
        )
    except Exception as e:
        return _err(f"Render failed: {e}")


def handle_pdf_to_jpg_enhanced(files, payload, output_dir):
    return _pdf_to_image_enhanced(files, payload, output_dir, "jpg")


def handle_pdf_to_png_enhanced(files, payload, output_dir):
    return _pdf_to_image_enhanced(files, payload, output_dir, "png")


# ════════════════════════════════════════════════════════════════════════════
# 8 & 9 & 10. JPG → PDF / Image → PDF / Scan → PDF
# Page size, orientation, margin, fit mode, sort order, scan-enhance
# ════════════════════════════════════════════════════════════════════════════

def _images_to_pdf_enhanced(files, payload, output_dir, mode: str = "image") -> ExecutionResult:
    if not files:
        return _err("Please upload at least one image.")

    page_size = (payload.get("page_size") or "auto").lower()
    orientation = (payload.get("orientation") or "auto").lower()  # auto|portrait|landscape
    try:
        margin_mm = max(0.0, min(50.0, float(payload.get("margin_mm") or 0)))
    except Exception:
        margin_mm = 0.0
    fit = (payload.get("fit") or "fit").lower()  # fit|fill|stretch
    order = (payload.get("order") or "name").lower()  # name|upload|name_desc

    enhance_mode = (payload.get("enhance") or "none").lower() if mode == "scan" else "none"
    deskew = str(payload.get("deskew", "false")).lower() in ("1", "true", "yes") if mode == "scan" else False

    images = list(files)
    if order == "name":
        images.sort(key=lambda p: p.name.lower())
    elif order == "name_desc":
        images.sort(key=lambda p: p.name.lower(), reverse=True)

    margin_pt = margin_mm * 72 / 25.4
    out_pdf = fitz.open()

    try:
        for img_path in images:
            try:
                pil = Image.open(img_path)
            except Exception:
                continue
            pil = ImageOps.exif_transpose(pil)

            if mode == "scan":
                if enhance_mode in ("auto", "grayscale", "bw"):
                    pil = ImageOps.grayscale(pil)
                if enhance_mode == "auto":
                    pil = ImageOps.autocontrast(pil, cutoff=2)
                    pil = ImageEnhance.Sharpness(pil).enhance(1.6)
                elif enhance_mode == "bw":
                    pil = pil.point(lambda v: 255 if v > 165 else 0, mode="1").convert("L")

            # Save normalized image
            tmp = output_dir / f"_norm_{img_path.stem}.png"
            pil.save(tmp, "PNG", optimize=True)

            iw, ih = pil.size

            if page_size == "auto":
                pw, ph = iw, ih
            else:
                pw, ph = _PAGE_SIZES_PT.get(page_size, _PAGE_SIZES_PT["a4"])
                if orientation == "landscape" and pw < ph:
                    pw, ph = ph, pw
                elif orientation == "portrait" and pw > ph:
                    pw, ph = ph, pw
                elif orientation == "auto" and (iw > ih) != (pw > ph):
                    pw, ph = ph, pw

            page = out_pdf.new_page(width=pw, height=ph)
            avail_w = pw - 2 * margin_pt
            avail_h = ph - 2 * margin_pt

            if fit == "stretch":
                rect = fitz.Rect(margin_pt, margin_pt, pw - margin_pt, ph - margin_pt)
            else:
                ratio = iw / ih if ih else 1
                if fit == "fill":
                    if avail_w / avail_h > ratio:
                        new_w = avail_w
                        new_h = avail_w / ratio
                    else:
                        new_h = avail_h
                        new_w = avail_h * ratio
                else:  # fit
                    if avail_w / avail_h > ratio:
                        new_h = avail_h
                        new_w = avail_h * ratio
                    else:
                        new_w = avail_w
                        new_h = avail_w / ratio
                x0 = (pw - new_w) / 2
                y0 = (ph - new_h) / 2
                rect = fitz.Rect(x0, y0, x0 + new_w, y0 + new_h)

            page.insert_image(rect, filename=str(tmp))
            try:
                tmp.unlink()
            except Exception:
                pass

        if out_pdf.page_count == 0:
            out_pdf.close()
            return _err("None of the uploads were valid images.")

        page_count = out_pdf.page_count
        out_path = output_dir / ("scanned.pdf" if mode == "scan" else "images.pdf")
        out_pdf.save(out_path, garbage=4, deflate=True)
        out_pdf.close()

        msg_extra = f", scan-enhance={enhance_mode}" if mode == "scan" else ""
        return ExecutionResult(
            kind="file",
            message=f"✅ {page_count} image(s) → PDF · size={page_size}, fit={fit}, margin={margin_mm}mm{msg_extra}.",
            output_path=out_path,
            filename=out_path.name,
            content_type="application/pdf",
        )
    except Exception as e:
        out_pdf.close()
        return _err(f"Conversion failed: {e}")


def handle_jpg_to_pdf_enhanced(files, payload, output_dir):
    return _images_to_pdf_enhanced(files, payload, output_dir, mode="image")


def handle_image_to_pdf_enhanced(files, payload, output_dir):
    return _images_to_pdf_enhanced(files, payload, output_dir, mode="image")


def handle_scan_to_pdf_enhanced(files, payload, output_dir):
    return _images_to_pdf_enhanced(files, payload, output_dir, mode="scan")


# ════════════════════════════════════════════════════════════════════════════
# 11. OPTIMIZE PDF — level (light/standard/aggressive), strip-meta, linearize
# ════════════════════════════════════════════════════════════════════════════

def handle_optimize_pdf_enhanced(files, payload, output_dir) -> ExecutionResult:
    if not files:
        return _err("Please upload a PDF to optimize.")

    src = files[0]
    original = src.stat().st_size
    level = (payload.get("level") or "standard").lower()
    strip_metadata = str(payload.get("strip_metadata", "false")).lower() in ("1", "true", "yes")
    linearize = str(payload.get("linearize", "true")).lower() in ("1", "true", "yes")

    out_path = output_dir / "optimized.pdf"

    try:
        if level == "aggressive":
            doc = fitz.open(src)
            doc.save(out_path, garbage=4, deflate=True, deflate_images=True,
                     deflate_fonts=True, clean=True, linear=linearize)
            doc.close()
        elif level == "light":
            with pikepdf.open(src) as pdf:
                pdf.save(out_path, compress_streams=True, linearize=linearize)
        else:  # standard
            doc = fitz.open(src)
            doc.save(out_path, garbage=3, deflate=True, clean=True, linear=linearize)
            doc.close()

        if strip_metadata:
            try:
                with pikepdf.open(out_path, allow_overwriting_input=True) as pdf:
                    with pdf.open_metadata() as meta:
                        meta.clear()
                    pdf.save(out_path)
            except Exception:
                pass

        new = out_path.stat().st_size
        reduction = ((original - new) / original) * 100 if original else 0
        return ExecutionResult(
            kind="file",
            message=f"✅ Optimized ({level}) — {reduction:.1f}% smaller · {original // 1024} KB → {new // 1024} KB.",
            output_path=out_path, filename="optimized.pdf",
            content_type="application/pdf",
        )
    except Exception as e:
        return _err(f"Optimize failed: {e}")


# ════════════════════════════════════════════════════════════════════════════
# REGISTRY — these names will overwrite the baseline handlers when imported last
# ════════════════════════════════════════════════════════════════════════════

PDF_CORE_ENHANCED_HANDLERS = {
    "merge-pdf": handle_merge_pdf_enhanced,
    "compress-pdf": handle_compress_pdf_enhanced,
    "split-pdf": handle_split_pdf_enhanced,
    "rotate-pdf": handle_rotate_pdf_enhanced,
    "watermark-pdf": handle_watermark_pdf_enhanced,
    "pdf-to-jpg": handle_pdf_to_jpg_enhanced,
    "pdf-to-png": handle_pdf_to_png_enhanced,
    "jpg-to-pdf": handle_jpg_to_pdf_enhanced,
    "image-to-pdf": handle_image_to_pdf_enhanced,
    "scan-to-pdf": handle_scan_to_pdf_enhanced,
    "optimize-pdf": handle_optimize_pdf_enhanced,
}
