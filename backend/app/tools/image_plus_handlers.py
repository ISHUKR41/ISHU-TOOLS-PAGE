"""
image_plus_handlers.py — Extended image tools for ISHU TOOLS
Covers: format conversions, circle-crop, add-text, DPI tools,
compress-to-KB, photo collage, metadata viewer, and more.
"""
from __future__ import annotations

import io
import json
import math
import struct
import zlib
from pathlib import Path
from typing import Any

from fastapi import HTTPException
from PIL import (
    Image,
    ImageDraw,
    ImageFont,
    ImageOps,
    ExifTags,
)

from .handlers import ExecutionResult, ensure_files, create_single_file_result
from .handlers import coerce_quality


# ─── helpers ─────────────────────────────────────────────────────────────────

def _open_image(path: Path) -> Image.Image:
    try:
        img = Image.open(str(path))
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if img.mode == "P" and "transparency" in img.info else "RGB")
        return img
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot open image: {exc}") from exc


def _save_as_jpg(img: Image.Image, path: Path, quality: int = 90) -> None:
    if img.mode in ("RGBA", "P", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")
    img.save(str(path), "JPEG", quality=quality, optimize=True)


def _compress_to_kb(img: Image.Image, target_kb: int, fmt: str = "JPEG") -> bytes:
    target_bytes = target_kb * 1024
    quality = 92
    buf = io.BytesIO()
    if fmt == "JPEG":
        _save_as_jpg(img, None) if False else None  # type check skip
        tmp = img
        if tmp.mode not in ("RGB",):
            tmp = tmp.convert("RGB")
        tmp.save(buf, "JPEG", quality=quality, optimize=True)
        while buf.tell() > target_bytes and quality > 10:
            quality -= 5
            buf = io.BytesIO()
            tmp.save(buf, "JPEG", quality=quality, optimize=True)
        if buf.tell() > target_bytes:
            factor = math.sqrt(target_bytes / max(buf.tell(), 1))
            new_w = max(1, int(tmp.width * factor))
            new_h = max(1, int(tmp.height * factor))
            tmp = tmp.resize((new_w, new_h), Image.LANCZOS)
            buf = io.BytesIO()
            tmp.save(buf, "JPEG", quality=quality, optimize=True)
    else:
        img.save(buf, fmt, optimize=True)
    return buf.getvalue()


# ─── Format Conversions ───────────────────────────────────────────────────────

def handle_png_to_webp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 85, 1, 100)
    out = output_dir / (files[0].stem + ".webp")
    img.save(str(out), "WEBP", quality=quality)
    return create_single_file_result(out, f"Converted to WebP (quality {quality})", "image/webp")


def handle_jpg_to_webp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_png_to_webp(files, payload, output_dir)


def handle_gif_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 90, 1, 100)
    out = output_dir / (files[0].stem + ".jpg")
    _save_as_jpg(img, out, quality=quality)
    return create_single_file_result(out, "Converted GIF to JPG", "image/jpeg")


def handle_tiff_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 90, 1, 100)
    out = output_dir / (files[0].stem + ".jpg")
    _save_as_jpg(img, out, quality=quality)
    return create_single_file_result(out, "Converted TIFF to JPG", "image/jpeg")


def handle_bmp_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 90, 1, 100)
    out = output_dir / (files[0].stem + ".jpg")
    _save_as_jpg(img, out, quality=quality)
    return create_single_file_result(out, "Converted BMP to JPG", "image/jpeg")


def handle_svg_to_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    if files[0].suffix.lower() != ".svg":
        raise HTTPException(status_code=400, detail="Please upload an SVG file.")
    try:
        import cairosvg
        scale = float(payload.get("scale", 2.0))
        scale = min(8.0, max(0.5, scale))
        out = output_dir / (files[0].stem + ".png")
        cairosvg.svg2png(url=str(files[0]), write_to=str(out), scale=scale)
        return create_single_file_result(out, f"SVG converted to PNG at {scale}x scale", "image/png")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"SVG conversion failed: {exc}") from exc


def handle_image_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 92, 1, 100)
    out = output_dir / (files[0].stem + ".jpg")
    _save_as_jpg(img, out, quality=quality)
    return create_single_file_result(out, "Image converted to JPG", "image/jpeg")


def handle_png_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_jpg(files, payload, output_dir)


def handle_webp_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_jpg(files, payload, output_dir)


def handle_heic_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    try:
        import pillow_heif
        pillow_heif.register_heif_opener()
    except ImportError:
        pass
    img = _open_image(files[0])
    quality = coerce_quality(payload.get("quality"), 90)
    out = output_dir / (files[0].stem + ".jpg")
    _save_as_jpg(img, out, quality=quality)
    return create_single_file_result(out, "HEIC converted to JPG", "image/jpeg")


# ─── Circle Crop ─────────────────────────────────────────────────────────────

def handle_circle_crop(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0]).convert("RGBA")
    size = min(img.width, img.height)
    img = ImageOps.fit(img, (size, size), Image.LANCZOS)

    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)

    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    result.paste(img, mask=mask)

    fmt = str(payload.get("format", "png")).lower()
    if fmt == "jpg":
        bg = Image.new("RGB", (size, size), (255, 255, 255))
        bg.paste(result, mask=result.split()[3])
        out = output_dir / (files[0].stem + "_circle.jpg")
        bg.save(str(out), "JPEG", quality=92)
        return create_single_file_result(out, "Circle crop applied", "image/jpeg")
    else:
        out = output_dir / (files[0].stem + "_circle.png")
        result.save(str(out), "PNG")
        return create_single_file_result(out, "Circle crop applied with transparent background", "image/png")


# ─── Add Text to Image ───────────────────────────────────────────────────────

def handle_add_text_to_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = _open_image(files[0]).convert("RGBA")
    text = str(payload.get("text", "ISHU TOOLS")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    font_size = min(200, max(8, int(payload.get("font_size", 36))))
    color = str(payload.get("color", "#ffffff"))
    opacity = min(255, max(0, int(float(payload.get("opacity", 0.9)) * 255)))
    position = str(payload.get("position", "center")).lower()

    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    W, H = img.size

    positions = {
        "top-left": (10, 10),
        "top-center": ((W - tw) // 2, 10),
        "top-right": (W - tw - 10, 10),
        "center": ((W - tw) // 2, (H - th) // 2),
        "bottom-left": (10, H - th - 10),
        "bottom-center": ((W - tw) // 2, H - th - 10),
        "bottom-right": (W - tw - 10, H - th - 10),
    }
    x, y = positions.get(position, ((W - tw) // 2, (H - th) // 2))

    try:
        r, g, b = ImageDraw.ImageColor.getrgb(color)[:3]
    except Exception:
        r, g, b = 255, 255, 255

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.text((x, y), text, font=font, fill=(r, g, b, opacity))
    result = Image.alpha_composite(img, overlay)

    out = output_dir / (files[0].stem + "_text.png")
    result.save(str(out), "PNG")
    return create_single_file_result(out, "Text added to image", "image/png")


# ─── Compress to Target KB ───────────────────────────────────────────────────

def handle_compress_image_to_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target_kb = max(1, int(payload.get("target_kb", 100)))
    img = _open_image(files[0])
    data = _compress_to_kb(img, target_kb)
    out = output_dir / (files[0].stem + f"_{target_kb}kb.jpg")
    out.write_bytes(data)
    actual_kb = len(data) // 1024
    return create_single_file_result(out, f"Compressed to ~{actual_kb} KB (target: {target_kb} KB)", "image/jpeg")


def handle_reduce_image_size_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_compress_image_to_kb(files, payload, output_dir)


def handle_increase_image_size_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target_kb = max(1, int(payload.get("target_kb", 500)))
    img = _open_image(files[0])

    quality = 95
    buf = io.BytesIO()
    img_rgb = img.convert("RGB")
    img_rgb.save(buf, "JPEG", quality=quality)
    current_size = buf.tell()
    target_bytes = target_kb * 1024

    if current_size < target_bytes:
        scale_factor = math.sqrt(target_bytes / max(current_size, 1))
        scale_factor = min(scale_factor, 4.0)
        new_w = max(1, int(img.width * scale_factor))
        new_h = max(1, int(img.height * scale_factor))
        img_rgb = img_rgb.resize((new_w, new_h), Image.LANCZOS)
        buf = io.BytesIO()
        img_rgb.save(buf, "JPEG", quality=quality)

    out = output_dir / (files[0].stem + f"_increased.jpg")
    out.write_bytes(buf.getvalue())
    actual_kb = len(buf.getvalue()) // 1024
    return create_single_file_result(out, f"Image size increased to ~{actual_kb} KB (target: {target_kb} KB)", "image/jpeg")


# ─── DPI Tools ───────────────────────────────────────────────────────────────

def handle_dpi_checker(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    try:
        img = Image.open(str(files[0]))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot open image: {exc}") from exc

    dpi_info = img.info.get("dpi") or img.info.get("jfif_density") or (72, 72)
    if isinstance(dpi_info, (int, float)):
        dpi_x = dpi_y = float(dpi_info)
    elif hasattr(dpi_info, '__iter__'):
        dpi_list = list(dpi_info)
        dpi_x = float(dpi_list[0]) if len(dpi_list) > 0 else 72.0
        dpi_y = float(dpi_list[1]) if len(dpi_list) > 1 else dpi_x
    else:
        dpi_x = dpi_y = 72.0

    pixels_w, pixels_h = img.size
    mode = img.mode
    fmt = img.format or files[0].suffix.upper().lstrip(".")

    quality = "Low (screen)" if max(dpi_x, dpi_y) <= 96 else "Medium (web/ebook)" if max(dpi_x, dpi_y) <= 150 else "High (print)" if max(dpi_x, dpi_y) <= 300 else "Very High (prepress)"

    return ExecutionResult(
        kind="json",
        message=f"DPI: {dpi_x:.0f} x {dpi_y:.0f}",
        data={
            "dpi_x": round(dpi_x, 1),
            "dpi_y": round(dpi_y, 1),
            "width_px": pixels_w,
            "height_px": pixels_h,
            "width_in": round(pixels_w / max(dpi_x, 1), 2),
            "height_in": round(pixels_h / max(dpi_y, 1), 2),
            "mode": mode,
            "format": fmt,
            "quality_class": quality,
            "message": f"DPI: {dpi_x:.0f}×{dpi_y:.0f} | {pixels_w}×{pixels_h}px | {quality}",
        },
    )


def handle_change_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    dpi = max(1, min(9600, int(payload.get("dpi", 300))))
    img = Image.open(str(files[0]))
    fmt = img.format or "PNG"

    if fmt in ("JPEG", "JPG"):
        out = output_dir / (files[0].stem + f"_{dpi}dpi.jpg")
        if img.mode not in ("RGB",):
            img = img.convert("RGB")
        img.save(str(out), "JPEG", dpi=(dpi, dpi), quality=95)
        mime = "image/jpeg"
    elif fmt == "PNG":
        ppm = int(dpi / 0.0254)
        out = output_dir / (files[0].stem + f"_{dpi}dpi.png")
        meta = img.info.copy()
        meta["ppi"] = dpi
        img.save(str(out), "PNG", pnginfo=None, dpi=(dpi, dpi))
        mime = "image/png"
    else:
        out = output_dir / (files[0].stem + f"_{dpi}dpi.png")
        img.save(str(out), "PNG", dpi=(dpi, dpi))
        mime = "image/png"

    return create_single_file_result(out, f"DPI changed to {dpi}", mime)


# ─── Photo Collage ───────────────────────────────────────────────────────────

def handle_photo_collage(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 images for a collage.")

    cols = max(1, min(6, int(payload.get("cols", min(len(files), 3)))))
    rows = math.ceil(len(files) / cols)
    thumb_size = max(50, min(1000, int(payload.get("thumb_size", 400))))
    gap = max(0, min(50, int(payload.get("gap", 8))))
    bg_color = str(payload.get("bg_color", "#1a1a2e")).strip()

    try:
        from PIL import ImageColor
        bg_rgb = ImageColor.getrgb(bg_color)[:3]
    except Exception:
        bg_rgb = (26, 26, 46)

    canvas_w = cols * thumb_size + (cols + 1) * gap
    canvas_h = rows * thumb_size + (rows + 1) * gap
    collage = Image.new("RGB", (canvas_w, canvas_h), bg_rgb)

    for idx, fpath in enumerate(files[:cols * rows]):
        try:
            img = _open_image(fpath).convert("RGB")
            img = ImageOps.fit(img, (thumb_size, thumb_size), Image.LANCZOS)
        except Exception:
            img = Image.new("RGB", (thumb_size, thumb_size), (80, 80, 80))

        c = idx % cols
        r = idx // cols
        x = gap + c * (thumb_size + gap)
        y = gap + r * (thumb_size + gap)
        collage.paste(img, (x, y))

    out = output_dir / "collage.jpg"
    collage.save(str(out), "JPEG", quality=92, optimize=True)
    return create_single_file_result(out, f"Collage created with {len(files)} images ({cols}×{rows} grid)", "image/jpeg")


# ─── View Image Metadata ─────────────────────────────────────────────────────

def handle_view_image_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    try:
        img = Image.open(str(files[0]))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot open image: {exc}") from exc

    info: dict[str, Any] = {
        "filename": files[0].name,
        "format": img.format or files[0].suffix.upper().lstrip("."),
        "mode": img.mode,
        "width": img.width,
        "height": img.height,
        "size_bytes": files[0].stat().st_size,
        "size_kb": round(files[0].stat().st_size / 1024, 2),
    }

    dpi = img.info.get("dpi")
    if dpi:
        info["dpi_x"] = round(float(list(dpi)[0]), 1) if hasattr(dpi, "__iter__") else float(dpi)
        info["dpi_y"] = round(float(list(dpi)[1]), 1) if hasattr(dpi, "__iter__") and len(list(dpi)) > 1 else info["dpi_x"]

    exif_data: dict[str, str] = {}
    try:
        exif_raw = img._getexif()  # type: ignore
        if exif_raw:
            for tag_id, value in exif_raw.items():
                tag = ExifTags.TAGS.get(tag_id, str(tag_id))
                if isinstance(value, (str, int, float)):
                    exif_data[tag] = str(value)
                elif isinstance(value, bytes):
                    exif_data[tag] = value.decode("utf-8", errors="replace")[:120]
    except Exception:
        pass

    if exif_data:
        info["exif"] = exif_data

    msg_parts = [f"{img.width}×{img.height}px", info["format"], f"{info['size_kb']} KB"]
    if dpi:
        msg_parts.append(f"{info.get('dpi_x', 72):.0f} DPI")

    return ExecutionResult(
        kind="json",
        message=" | ".join(msg_parts),
        data={**info, "message": " | ".join(msg_parts)},
    )


# ─── Text/Utility tool handlers that lack registry entries ───────────────────

def handle_epoch_converter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    import time as _time
    from datetime import datetime, timezone
    mode = str(payload.get("mode", "to_human")).lower()
    val = str(payload.get("value", "")).strip()

    if mode == "to_epoch":
        try:
            dt = datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            try:
                from datetime import datetime as dt_
                dt = dt_.strptime(val, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SS)")
        epoch = int(dt.timestamp())
        return ExecutionResult(kind="json", message=f"Epoch: {epoch}", data={"epoch": epoch, "epoch_ms": epoch * 1000, "iso": dt.isoformat(), "message": f"Epoch: {epoch}"})
    else:
        try:
            ts = float(val)
            if ts > 1e12:
                ts /= 1000
            dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid epoch timestamp")
        return ExecutionResult(kind="json", message=dt.strftime("%Y-%m-%d %H:%M:%S UTC"), data={
            "utc": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "iso": dt.isoformat(),
            "date": dt.strftime("%B %d, %Y"),
            "day": dt.strftime("%A"),
            "epoch": int(ts),
            "message": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
        })


def handle_fancy_text_generator(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return ExecutionResult(
            kind="json",
            message="Please enter some text to convert into fancy styles.",
            data={"error": "Text is required."},
        )
    text = text[:200]
    BOLD = str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                          "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵")
    ITALIC = str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                            "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻")
    BUBBLE = str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                             "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨")
    # Upside-down: each side exactly 62 chars (a-z, A-Z, 0-9)
    UPSIDE_SRC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    UPSIDE_DST = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXʎZ0ƖᄅƐㄣϛ9ㄥ86"
    if len(UPSIDE_SRC) != len(UPSIDE_DST):
        UPSIDE_DST = UPSIDE_SRC  # safety fallback so the tool never crashes
    variants = {
        "Bold": text.translate(BOLD),
        "Italic": text.translate(ITALIC),
        "Bubble": text.translate(BUBBLE),
        "Strikethrough": "".join(c + "\u0336" for c in text),
        "Underline": "".join(c + "\u0332" for c in text),
        "Upside Down": text.translate(str.maketrans(UPSIDE_SRC, UPSIDE_DST))[::-1],
        "Small Caps": text.translate(str.maketrans("abcdefghijklmnopqrstuvwxyz", "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ")),
    }
    return ExecutionResult(kind="json", message=f"Generated {len(variants)} fancy text styles", data={"styles": variants, "original": text, "message": f"Generated {len(variants)} styles for: {text[:40]}"})


def handle_json_path_finder(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    import json as _json
    raw = str(payload.get("json", "")).strip()
    path = str(payload.get("path", "$")).strip()
    if not raw:
        raise HTTPException(status_code=400, detail="json is required")
    try:
        data = _json.loads(raw)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {exc}")

    try:
        import jsonpath_ng.ext as jp
        expr = jp.parse(path)
        matches = [match.value for match in expr.find(data)]
        result = matches if len(matches) != 1 else matches[0]
    except Exception:
        result = data

    result_str = _json.dumps(result, indent=2, ensure_ascii=False)
    return ExecutionResult(kind="json", message=f"Found result for path: {path}", data={"result": result, "result_str": result_str, "message": f"JSONPath result for: {path}"})


def handle_line_counter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    lines = text.splitlines()
    non_empty = [l for l in lines if l.strip()]
    blank = len(lines) - len(non_empty)
    words = len(text.split())
    chars = len(text)
    return ExecutionResult(kind="json", message=f"{len(lines)} lines, {non_empty.__len__()} non-empty, {words} words", data={
        "total_lines": len(lines),
        "non_empty_lines": len(non_empty),
        "blank_lines": blank,
        "words": words,
        "characters": chars,
        "characters_no_spaces": len(text.replace(" ", "")),
        "message": f"Lines: {len(lines)} | Non-empty: {len(non_empty)} | Words: {words} | Chars: {chars}",
    })


def handle_morse_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    MORSE: dict[str, str] = {
        ".-":"A","-.-.":"C","-..":"D",".":"E","..-.":"F","--.":"G","....":"H","..":"I",
        ".---":"J","-.-":"K",".-..":"L","--":"M","-.":"N","---":"O",".--.":"P","--.-":"Q",
        ".-.":"R","...":"S","-":"T","..-":"U","...-":"V",".--":"W","-..-":"X","-.--":"Y",
        "--..":"Z","-----":"0",".----":"1","..---":"2","...--":"3","....-":"4",".....":"5",
        "-....":"6","--...":"7","---..":"8","----.":"9",".-.-.-":".","--..--":",",
        "..--..":"?","-.-.--":"!",".--.-.":"@","-....-":"-",
    }
    # Accept multiple field names so the tool works no matter which UI calls it.
    code = str(
        payload.get("morse") or payload.get("text") or payload.get("input")
        or payload.get("code") or payload.get("value") or ""
    ).strip()
    if not code:
        return ExecutionResult(
            kind="json",
            message="Please paste Morse code to decode (e.g. ... --- ...).",
            data={"error": "No Morse code provided."},
        )
    # Support both single-space (letter sep) + triple-space (word sep) and
    # the common slash convention "... --- ... / .... .. " for word breaks.
    normalised = code.replace("/", "   ").replace("|", "   ")
    words = [w for w in normalised.strip().split("   ") if w.strip()]
    decoded = []
    for word in words:
        letters = word.split()
        decoded.append("".join(MORSE.get(l, "?") for l in letters))
    result = " ".join(decoded)
    return ExecutionResult(
        kind="json",
        message=result or "Could not decode any letters.",
        data={"decoded": result, "message": result, "input": code},
    )


def handle_text_to_morse(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    TEXT_TO_MORSE = {
        "A":".-","B":"-...","C":"-.-.","D":"-..","E":".","F":"..-.","G":"--.","H":"....","I":"..","J":".---",
        "K":"-.-","L":".-..","M":"--","N":"-.","O":"---","P":".--.","Q":"--.-","R":".-.","S":"...","T":"-",
        "U":"..-","V":"...-","W":".--","X":"-..-","Y":"-.--","Z":"--..","0":"-----","1":".----","2":"..---",
        "3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",
        ".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--",
    }
    text = str(payload.get("text", "")).strip().upper()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    words = text.split()
    morse_words = []
    for word in words:
        morse_words.append(" ".join(TEXT_TO_MORSE.get(c, "") for c in word if c in TEXT_TO_MORSE or c == " "))
    result = "   ".join(morse_words)
    return ExecutionResult(kind="json", message=result[:200], data={"morse": result, "message": result[:200]})


def handle_nato_alphabet(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    NATO = {
        "A":"Alpha","B":"Bravo","C":"Charlie","D":"Delta","E":"Echo","F":"Foxtrot","G":"Golf",
        "H":"Hotel","I":"India","J":"Juliet","K":"Kilo","L":"Lima","M":"Mike","N":"November",
        "O":"Oscar","P":"Papa","Q":"Quebec","R":"Romeo","S":"Sierra","T":"Tango","U":"Uniform",
        "V":"Victor","W":"Whiskey","X":"X-ray","Y":"Yankee","Z":"Zulu",
        "0":"Zero","1":"One","2":"Two","3":"Three","4":"Four","5":"Five",
        "6":"Six","7":"Seven","8":"Eight","9":"Nine",
    }
    text = str(payload.get("text", "")).strip().upper()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    result = []
    spoken = []
    for char in text:
        if char in NATO:
            result.append(f"{char} = {NATO[char]}")
            spoken.append(NATO[char])
        elif char == " ":
            result.append("(space)")
            spoken.append("(space)")
        else:
            result.append(f"{char} = {char}")
            spoken.append(char)
    return ExecutionResult(kind="json", message=" ".join(spoken[:10]), data={
        "nato": result,
        "phonetic": " ".join(spoken),
        "message": "NATO phonetic: " + " ".join(spoken[:40]),
    })


def handle_number_to_roman(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    try:
        n = int(payload.get("number", 0))
    except Exception:
        raise HTTPException(status_code=400, detail="number must be an integer")
    if n < 1 or n > 3999:
        raise HTTPException(status_code=400, detail="number must be between 1 and 3999")
    vals = [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),(100,"C"),(90,"XC"),(50,"L"),(40,"XL"),(10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]
    result = ""
    for v, s in vals:
        while n >= v:
            result += s
            n -= v
    return ExecutionResult(kind="json", message=result, data={"roman": result, "message": f"{payload.get('number')} in Roman numerals = {result}"})


def handle_roman_to_number(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    roman = str(payload.get("roman", "")).strip().upper()
    if not roman:
        raise HTTPException(status_code=400, detail="roman is required")
    vals = {"I":1,"V":5,"X":10,"L":50,"C":100,"D":500,"M":1000}
    total = 0
    prev = 0
    for ch in reversed(roman):
        v = vals.get(ch, 0)
        if v < prev:
            total -= v
        else:
            total += v
        prev = v
    return ExecutionResult(kind="json", message=str(total), data={"number": total, "message": f"{roman} = {total}"})


def handle_octal_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    octal_str = str(payload.get("octal", "")).strip()
    if not octal_str:
        raise HTTPException(status_code=400, detail="octal is required")
    try:
        chars = [chr(int(o, 8)) for o in octal_str.split()]
        result = "".join(chars)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid octal: {exc}")
    return ExecutionResult(kind="json", message=result, data={"text": result, "message": result})


def handle_text_to_octal(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    result = " ".join(oct(ord(c))[2:] for c in text)
    return ExecutionResult(kind="json", message=result[:200], data={"octal": result, "message": result[:200]})


def handle_pig_latin(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    vowels = "aeiouAEIOU"
    def _convert(word: str) -> str:
        if not word.isalpha():
            return word
        if word[0] in vowels:
            return word + "yay"
        for i, c in enumerate(word):
            if c in vowels:
                return word[i:] + word[:i] + "ay"
        return word + "ay"
    result = " ".join(_convert(w) for w in text.split())
    return ExecutionResult(kind="json", message=result, data={"pig_latin": result, "original": text, "message": result})


def handle_text_repeat(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    count = max(1, min(1000, int(payload.get("count", 3))))
    separator = str(payload.get("separator", "\n"))
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    result = separator.join([text] * count)
    return ExecutionResult(kind="json", message=f"Repeated {count} times", data={"result": result, "count": count, "message": f"Text repeated {count} times"})


def handle_random_color_generator(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    import random
    count = max(1, min(50, int(payload.get("count", 5))))
    colors = []
    for _ in range(count):
        r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
        hex_c = f"#{r:02X}{g:02X}{b:02X}"
        h, s, v = _rgb_to_hsv(r, g, b)
        colors.append({"hex": hex_c, "rgb": f"rgb({r},{g},{b})", "hsl": f"hsl({h},{s}%,{v}%)"})
    return ExecutionResult(kind="json", message=f"Generated {count} random colors", data={"colors": colors, "message": f"Generated {count} random colors"})


def _rgb_to_hsv(r: int, g: int, b: int) -> tuple[int, int, int]:
    r_, g_, b_ = r / 255, g / 255, b / 255
    cmax = max(r_, g_, b_)
    cmin = min(r_, g_, b_)
    diff = cmax - cmin
    if diff == 0:
        h = 0
    elif cmax == r_:
        h = int((60 * ((g_ - b_) / diff)) % 360)
    elif cmax == g_:
        h = int(60 * ((b_ - r_) / diff) + 120)
    else:
        h = int(60 * ((r_ - g_) / diff) + 240)
    s = 0 if cmax == 0 else int((diff / cmax) * 100)
    v = int(cmax * 100)
    return h, s, v


def handle_string_hash(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    import hashlib
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    encoded = text.encode("utf-8")
    return ExecutionResult(kind="json", message="Hash values computed", data={
        "md5": hashlib.md5(encoded).hexdigest(),
        "sha1": hashlib.sha1(encoded).hexdigest(),
        "sha256": hashlib.sha256(encoded).hexdigest(),
        "sha512": hashlib.sha512(encoded).hexdigest(),
        "crc32": format(zlib.crc32(encoded) & 0xFFFFFFFF, "08x"),
        "message": "MD5, SHA1, SHA256, SHA512, CRC32 computed",
    })


def handle_text_to_ascii_art(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "ISHU")).strip()[:20]
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    try:
        import pyfiglet
        style = str(payload.get("style", "standard")).strip() or "standard"
        # Map common UI choices to real pyfiglet font names
        FONT_ALIASES = {"default": "standard", "normal": "standard", "block": "block",
                        "big": "big", "small": "small", "mini": "mini", "slant": "slant",
                        "shadow": "shadow", "banner": "banner", "bubble": "bubble",
                        "digital": "digital", "ivrit": "ivrit", "lean": "lean"}
        font = FONT_ALIASES.get(style.lower(), style)
        try:
            art = pyfiglet.figlet_format(text, font=font)
        except Exception:
            # Unknown font → fall back to standard rather than 500-ing
            art = pyfiglet.figlet_format(text, font="standard")
            font = "standard"
        return ExecutionResult(kind="json", message="ASCII art generated", data={"ascii_art": art, "text": text, "style": font, "message": f"ASCII art for: {text}"})
    except ImportError:
        ASCII = {
            "A": [" _A_ "," /   \\"," \\___/"], "B": [" ___","| __ ","\\___/"], 
            "default": ["      "," TEXT ","      "],
        }
        art = f"  {text}  \n" + "=" * (len(text) + 4)
        return ExecutionResult(kind="json", message="ASCII art generated", data={"ascii_art": art, "text": text, "message": f"ASCII art for: {text}"})


def handle_whitespace_remover(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    import re as _re
    text = str(payload.get("text", ""))
    mode = str(payload.get("mode", "extra")).lower()
    if mode == "leading":
        result = "\n".join(line.lstrip() for line in text.splitlines())
    elif mode == "trailing":
        result = "\n".join(line.rstrip() for line in text.splitlines())
    elif mode == "all":
        result = _re.sub(r"\s+", "", text)
    elif mode == "all_lines":
        result = "\n".join(line.strip() for line in text.splitlines())
    else:
        # default "extra": collapse runs of spaces/tabs to one and trim each line
        cleaned = _re.sub(r"[ \t]+", " ", text)
        cleaned = _re.sub(r"\n[ \t]*\n", "\n\n", cleaned)
        result = cleaned.strip()
    original_len = len(text)
    return ExecutionResult(kind="json", message=f"Removed {original_len - len(result)} whitespace characters", data={
        "text": result,
        "result": result,
        "original_length": original_len,
        "new_length": len(result),
        "removed": original_len - len(result),
        "message": f"Whitespace removed ({original_len - len(result)} chars removed)",
    })


# ─── Handler map ─────────────────────────────────────────────────────────────

IMAGE_PLUS_HANDLERS = {
    # Format conversions
    "png-to-webp": handle_png_to_webp,
    "jpg-to-webp": handle_jpg_to_webp,
    "jpeg-to-webp": handle_jpg_to_webp,
    "gif-to-jpg": handle_gif_to_jpg,
    "tiff-to-jpg": handle_tiff_to_jpg,
    "bmp-to-jpg": handle_bmp_to_jpg,
    "svg-to-png": handle_svg_to_png,
    "image-to-jpg": handle_image_to_jpg,
    "png-to-jpg": handle_png_to_jpg,
    "webp-to-jpg": handle_webp_to_jpg,
    "heic-to-jpg": handle_heic_to_jpg,
    # Image editing
    "circle-crop": handle_circle_crop,
    "add-text-to-image": handle_add_text_to_image,
    # Size tools — generic
    "compress-image-to-kb": handle_compress_image_to_kb,
    "reduce-image-size-kb": handle_reduce_image_size_kb,
    "increase-image-size-kb": handle_increase_image_size_kb,
    # Size tools — specific target KB (all reuse handle_compress_image_to_kb)
    "compress-to-5kb": handle_compress_image_to_kb,
    "compress-to-10kb": handle_compress_image_to_kb,
    "compress-to-20kb": handle_compress_image_to_kb,
    "compress-to-30kb": handle_compress_image_to_kb,
    "compress-to-50kb": handle_compress_image_to_kb,
    "compress-to-100kb": handle_compress_image_to_kb,
    "compress-to-150kb": handle_compress_image_to_kb,
    "compress-to-200kb": handle_compress_image_to_kb,
    "compress-to-300kb": handle_compress_image_to_kb,
    "compress-to-500kb": handle_compress_image_to_kb,
    "compress-to-1mb": handle_compress_image_to_kb,
    "compress-to-2mb": handle_compress_image_to_kb,
    "jpg-to-kb": handle_compress_image_to_kb,
    "jpeg-to-kb": handle_compress_image_to_kb,
    "png-to-kb": handle_compress_image_to_kb,
    # DPI tools
    "dpi-checker": handle_dpi_checker,
    "change-dpi": handle_change_dpi,
    # Collage & metadata
    "photo-collage": handle_photo_collage,
    "view-image-metadata": handle_view_image_metadata,
    # Text/utility tools without registry entries
    "epoch-converter": handle_epoch_converter,
    "fancy-text-generator": handle_fancy_text_generator,
    "json-path-finder": handle_json_path_finder,
    "line-counter": handle_line_counter,
    "morse-to-text": handle_morse_to_text,
    "text-to-morse": handle_text_to_morse,
    "nato-alphabet": handle_nato_alphabet,
    "number-to-roman": handle_number_to_roman,
    "roman-to-number": handle_roman_to_number,
    "octal-to-text": handle_octal_to_text,
    "text-to-octal": handle_text_to_octal,
    "pig-latin": handle_pig_latin,
    "text-repeat": handle_text_repeat,
    "random-color-generator": handle_random_color_generator,
    "string-hash": handle_string_hash,
    "text-to-ascii-art": handle_text_to_ascii_art,
    "whitespace-remover": handle_whitespace_remover,
}
