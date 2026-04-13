"""
Complete implementation of ALL missing handlers for ISHU TOOLS
This file contains implementations for all remaining tools
"""
from __future__ import annotations
import io
import json
import subprocess
import zipfile
from pathlib import Path
from typing import Any
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from fastapi import HTTPException

from .handlers import (
    ExecutionResult, create_single_file_result, create_zip_result, ensure_files,
    extract_pdf_text, text_to_pdf, open_image_file, save_image, get_resampling_module,
    try_libreoffice_convert_to_pdf, extract_docx_text, build_docx_from_text,
    render_pdf_pages_to_pil_images, extract_ocr_text_from_image, detect_faces_in_image,
    load_ui_font, parse_color_value, resize_image_to_physical_units, extract_image_dpi_info
)


# ============================================================================
# HTML TO IMAGE
# ============================================================================
def handle_html_to_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert HTML to image using selenium"""
    url = str(payload.get("url", "")).strip()
    html_content = str(payload.get("html", "")).strip()
    
    if not url and not html_content:
        raise HTTPException(status_code=400, detail="Provide url or html content")
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
        if url:
            driver.get(url)
        else:
            driver.get("data:text/html;charset=utf-8," + html_content)
        
        output = output_dir / "screenshot.png"
        driver.save_screenshot(str(output))
        driver.quit()
        
        return create_single_file_result(output, "HTML converted to image", "image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HTML to image conversion failed: {str(e)}")


# ============================================================================
# IMAGE COMPRESSION TO SPECIFIC KB SIZES
# ============================================================================
def compress_image_to_target_kb(source: Path, output: Path, target_kb: int) -> None:
    """Compress image to target KB size"""
    img = open_image_file(source, "RGB")
    target_bytes = target_kb * 1024
    
    # Binary search for optimal quality
    min_quality, max_quality = 1, 95
    best_quality = 85
    
    for _ in range(10):  # Max 10 iterations
        quality = (min_quality + max_quality) // 2
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=quality, optimize=True)
        size = buffer.tell()
        
        if abs(size - target_bytes) < target_bytes * 0.05:  # Within 5%
            best_quality = quality
            break
        elif size > target_bytes:
            max_quality = quality - 1
        else:
            min_quality = quality + 1
            best_quality = quality
    
    img.save(output, format="JPEG", quality=best_quality, optimize=True)


def handle_reduce_image_size_in_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target_kb = int(payload.get("target_kb", 100))
    
    output = output_dir / f"compressed-{target_kb}kb.jpg"
    compress_image_to_target_kb(files[0], output, target_kb)
    return create_single_file_result(output, f"Image compressed to ~{target_kb}KB", "image/jpeg")


def handle_compress_to_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_reduce_image_size_in_kb(files, payload, output_dir)


def handle_compress_specific_kb(target_kb: int):
    """Factory function for specific KB compression handlers"""
    def handler(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
        ensure_files(files, 1)
        output = output_dir / f"compressed-{target_kb}kb.jpg"
        compress_image_to_target_kb(files[0], output, target_kb)
        return create_single_file_result(output, f"Image compressed to ~{target_kb}KB", "image/jpeg")
    return handler


# ============================================================================
# PASSPORT PHOTO AND SOCIAL MEDIA RESIZE
# ============================================================================
def handle_passport_photo_maker(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    size_type = str(payload.get("size_type", "35x45mm")).strip().lower()
    
    # Common passport sizes in pixels at 300 DPI
    sizes = {
        "35x45mm": (413, 531),  # 3.5x4.5cm
        "2x2inch": (600, 600),
        "35x35mm": (413, 413),
        "51x51mm": (600, 600),
    }
    
    target_size = sizes.get(size_type, (413, 531))
    
    img = open_image_file(files[0])
    resized = ImageOps.fit(img, target_size, get_resampling_module().LANCZOS)
    
    output = output_dir / f"passport-photo-{size_type}.jpg"
    resized.save(output, quality=95, dpi=(300, 300))
    return create_single_file_result(output, f"Passport photo created ({size_type})", "image/jpeg")


def handle_passport_size_photo(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_passport_photo_maker(files, payload, output_dir)


def handle_social_media_resize(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    platform = str(payload.get("platform", "instagram")).strip().lower()
    
    sizes = {
        "instagram": (1080, 1080),
        "instagram-story": (1080, 1920),
        "facebook": (1200, 630),
        "twitter": (1200, 675),
        "youtube": (2560, 1440),
        "linkedin": (1200, 627),
        "whatsapp": (192, 192),
    }
    
    target_size = sizes.get(platform, (1080, 1080))
    
    img = open_image_file(files[0])
    resized = ImageOps.fit(img, target_size, get_resampling_module().LANCZOS)
    
    output = output_dir / f"{platform}-{target_size[0]}x{target_size[1]}.jpg"
    resized.save(output, quality=95)
    return create_single_file_result(output, f"Resized for {platform}", "image/jpeg")


def handle_resize_for_instagram(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    payload["platform"] = "instagram"
    return handle_social_media_resize(files, payload, output_dir)


def handle_resize_for_whatsapp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    payload["platform"] = "whatsapp"
    return handle_social_media_resize(files, payload, output_dir)


def handle_resize_for_youtube(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    payload["platform"] = "youtube"
    return handle_social_media_resize(files, payload, output_dir)


# ============================================================================
# INSTAGRAM GRID AND ADVANCED IMAGE TOOLS
# ============================================================================
def handle_instagram_grid(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    rows = int(payload.get("rows", 3))
    cols = int(payload.get("cols", 3))
    
    img = open_image_file(files[0])
    piece_width = img.width // cols
    piece_height = img.height // rows
    
    for row in range(rows):
        for col in range(cols):
            left = col * piece_width
            top = row * piece_height
            right = left + piece_width
            bottom = top + piece_height
            
            piece = img.crop((left, top, right, bottom))
            output = output_dir / f"grid-{row+1}-{col+1}.jpg"
            piece.save(output, quality=95)
    
    return create_zip_result(output_dir, f"Instagram grid created ({rows}x{cols})", "instagram-grid")


# ============================================================================
# IMAGE FORMAT CONVERSIONS
# ============================================================================
def handle_convert_to_jpg_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = open_image_file(files[0], "RGB")
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, quality=95)
    return create_single_file_result(output, "Converted to JPG", "image/jpeg")


def handle_convert_from_jpg_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    target_format = str(payload.get("target_format", "png")).lower()
    payload["target_format"] = target_format
    from .handlers import handle_convert_image
    return handle_convert_image(files, payload, output_dir)


def handle_heic_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = open_image_file(files[0], "RGB")
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, quality=95)
    return create_single_file_result(output, "HEIC converted to JPG", "image/jpeg")


def handle_webp_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = open_image_file(files[0], "RGB")
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, quality=95)
    return create_single_file_result(output, "WEBP converted to JPG", "image/jpeg")


def handle_jpeg_to_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = open_image_file(files[0])
    output = output_dir / f"{files[0].stem}.png"
    img.save(output)
    return create_single_file_result(output, "JPEG converted to PNG", "image/png")


def handle_png_to_jpeg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    img = open_image_file(files[0], "RGB")
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, quality=95)
    return create_single_file_result(output, "PNG converted to JPEG", "image/jpeg")


# ============================================================================
# PHOTO EDITOR AND ENHANCEMENT TOOLS
# ============================================================================
def handle_photo_editor(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Multi-purpose photo editor"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    # Apply various adjustments based on payload
    if payload.get("brightness"):
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(float(payload["brightness"]))
    
    if payload.get("contrast"):
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(float(payload["contrast"]))
    
    if payload.get("sharpness"):
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(float(payload["sharpness"]))
    
    if payload.get("saturation"):
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(float(payload["saturation"]))
    
    output = output_dir / f"edited-{files[0].name}"
    save_image(img, output, quality=95)
    return create_single_file_result(output, "Photo edited", "image/*")


def handle_unblur_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Sharpen blurry images"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    # Apply unsharp mask
    sharpened = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    
    output = output_dir / f"unblurred-{files[0].name}"
    save_image(sharpened, output, quality=95)
    return create_single_file_result(output, "Image sharpened", "image/*")


def handle_increase_image_quality(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Enhance image quality"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    # Enhance sharpness and contrast
    img = ImageEnhance.Sharpness(img).enhance(1.5)
    img = ImageEnhance.Contrast(img).enhance(1.2)
    
    output = output_dir / f"enhanced-{files[0].name}"
    save_image(img, output, quality=98)
    return create_single_file_result(output, "Image quality enhanced", "image/*")


def handle_beautify_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Beautify image with auto-enhancements"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    # Auto enhance
    img = ImageEnhance.Color(img).enhance(1.1)
    img = ImageEnhance.Brightness(img).enhance(1.05)
    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Sharpness(img).enhance(1.2)
    
    output = output_dir / f"beautified-{files[0].name}"
    save_image(img, output, quality=95)
    return create_single_file_result(output, "Image beautified", "image/*")


def handle_retouch_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Retouch image with smoothing"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    # Apply smooth filter
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img = ImageEnhance.Sharpness(img).enhance(1.1)
    
    output = output_dir / f"retouched-{files[0].name}"
    save_image(img, output, quality=95)
    return create_single_file_result(output, "Image retouched", "image/*")


def handle_super_resolution(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Upscale image with super resolution"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    scale = int(payload.get("scale", 2))
    new_size = (img.width * scale, img.height * scale)
    
    # Use LANCZOS for high-quality upscaling
    upscaled = img.resize(new_size, get_resampling_module().LANCZOS)
    upscaled = ImageEnhance.Sharpness(upscaled).enhance(1.2)
    
    output = output_dir / f"upscaled-{scale}x-{files[0].name}"
    save_image(upscaled, output, quality=98)
    return create_single_file_result(output, f"Image upscaled {scale}x", "image/*")


# ============================================================================
# ADDITIONAL IMAGE TOOLS
# ============================================================================
def handle_zoom_out_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add padding around image (zoom out effect)"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    padding = int(payload.get("padding", 50))
    bg_color = parse_color_value(payload.get("bg_color", "white"), (255, 255, 255))
    
    new_size = (img.width + 2 * padding, img.height + 2 * padding)
    result = Image.new("RGB", new_size, bg_color)
    result.paste(img, (padding, padding))
    
    output = output_dir / f"zoomed-out-{files[0].name}"
    save_image(result, output, quality=95)
    return create_single_file_result(output, "Zoom out applied", "image/*")


def handle_add_white_border_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add white border around image"""
    payload["bg_color"] = "white"
    payload["padding"] = int(payload.get("border_width", 20))
    return handle_zoom_out_image(files, payload, output_dir)


def handle_freehand_crop(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Freehand crop with coordinates"""
    from .handlers import handle_crop_image
    return handle_crop_image(files, payload, output_dir)


def handle_crop_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Crop PNG with transparency support"""
    ensure_files(files, 1)
    img = open_image_file(files[0])
    
    x = int(payload.get("x", 0))
    y = int(payload.get("y", 0))
    w = int(payload.get("width", max(1, img.width - x)))
    h = int(payload.get("height", max(1, img.height - y)))
    
    cropped = img.crop((x, y, x + w, y + h))
    output = output_dir / f"cropped-{files[0].stem}.png"
    cropped.save(output)
    return create_single_file_result(output, "PNG cropped", "image/png")


def handle_image_splitter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Split image into parts"""
    from .handlers import handle_split_image
    return handle_split_image(files, payload, output_dir)


def handle_a4_size_resize(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize image to A4 size"""
    ensure_files(files, 1)
    # A4 at 300 DPI: 2480 x 3508 pixels
    img = open_image_file(files[0])
    resized = ImageOps.fit(img, (2480, 3508), get_resampling_module().LANCZOS)
    
    output = output_dir / f"a4-{files[0].name}"
    resized.save(output, quality=95, dpi=(300, 300))
    return create_single_file_result(output, "Resized to A4", "image/*")


def handle_check_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Check image DPI"""
    from .handlers import handle_check_image_dpi
    return handle_check_image_dpi(files, payload, output_dir)


def handle_color_code_from_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract color codes from image"""
    from .handlers import handle_image_color_picker
    return handle_image_color_picker(files, payload, output_dir)


def handle_view_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """View image metadata"""
    from .handlers import handle_extract_metadata
    return handle_extract_metadata(files, payload, output_dir)


def handle_remove_image_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Remove image metadata"""
    from .handlers import handle_remove_metadata_image
    return handle_remove_metadata_image(files, payload, output_dir)
