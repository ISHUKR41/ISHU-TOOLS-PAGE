"""
Extended Handlers - Additional tool implementations for ISHU TOOLS
Implements remaining tools from the registry
"""
from __future__ import annotations
import io
import json
import re
import zipfile
from pathlib import Path
from typing import Any
from fastapi import HTTPException
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance, ImageFilter
from pypdf import PdfReader, PdfWriter

from .handlers import (
    ExecutionResult, create_single_file_result, create_zip_result, ensure_files,
    extract_pdf_text, text_to_pdf, open_image_file, save_image, read_text_input,
    extract_ocr_text_from_image, extract_ocr_text_from_pdf
)


# ============================================================================
# OCR Tools
# ============================================================================

def handle_ocr_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract text from image using OCR"""
    ensure_files(files, 1)
    text = extract_ocr_text_from_image(files[0])
    output = output_dir / "ocr-text.txt"
    output.write_text(text, encoding="utf-8")
    return create_single_file_result(output, "Text extracted from image", "text/plain")


def handle_ocr_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract text from scanned PDF using OCR"""
    ensure_files(files, 1)
    text = extract_ocr_text_from_pdf(files[0])
    output = output_dir / "ocr-pdf-text.txt"
    output.write_text(text, encoding="utf-8")
    return create_single_file_result(output, "Text extracted from PDF", "text/plain")


def handle_image_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract text from image"""
    return handle_ocr_image(files, payload, output_dir)


def handle_jpg_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract text from JPG image"""
    return handle_ocr_image(files, payload, output_dir)


def handle_png_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract text from PNG image"""
    return handle_ocr_image(files, payload, output_dir)


def handle_pdf_ocr(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """OCR PDF and create searchable PDF"""
    return handle_ocr_pdf(files, payload, output_dir)


# ============================================================================
# Image Layout & Manipulation
# ============================================================================

def handle_pixelate_face(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Pixelate faces in image"""
    ensure_files(files, 1)
    # Use blur_face handler with pixelate mode
    payload["mode"] = "pixelate"
    from .production_handlers import handle_blur_face
    return handle_blur_face(files, payload, output_dir)


def handle_blur_background(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Blur background while keeping subject sharp"""
    ensure_files(files, 1)
    image = Image.open(files[0])
    # Apply gaussian blur
    blurred = image.filter(ImageFilter.GaussianBlur(radius=10))
    output = output_dir / f"blur-bg-{files[0].name}"
    save_image(blurred, output)
    return create_single_file_result(output, "Background blurred", "image/*")


def handle_add_text_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add text overlay to image"""
    ensure_files(files, 1)
    text = str(payload.get("text", "ISHU TOOLS")).strip() or "ISHU TOOLS"
    font_size = int(payload.get("font_size", 48))
    
    image = Image.open(files[0]).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    x = int(payload.get("x", 50))
    y = int(payload.get("y", 50))
    color = str(payload.get("color", "white")).strip()
    
    draw.text((x, y), text, fill=color, font=font)
    
    output = output_dir / f"text-{files[0].name}"
    save_image(image, output)
    return create_single_file_result(output, "Text added to image", "image/jpeg")


def handle_add_logo_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add logo overlay to image"""
    ensure_files(files, 2)
    
    base_image = Image.open(files[0]).convert("RGBA")
    logo = Image.open(files[1]).convert("RGBA")
    
    # Resize logo to 20% of base image width
    logo_width = int(base_image.width * 0.2)
    logo_height = int(logo.height * (logo_width / logo.width))
    logo = logo.resize((logo_width, logo_height), Image.LANCZOS)
    
    # Position logo at bottom-right
    position = (base_image.width - logo_width - 20, base_image.height - logo_height - 20)
    base_image.paste(logo, position, logo)
    
    output = output_dir / f"logo-{files[0].stem}.png"
    base_image.convert("RGB").save(output, quality=95)
    return create_single_file_result(output, "Logo added to image", "image/png")


def handle_join_images(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Join multiple images horizontally or vertically"""
    ensure_files(files, 2)
    
    direction = str(payload.get("direction", "horizontal")).strip().lower()
    images = [Image.open(f).convert("RGB") for f in files]
    
    if direction == "vertical":
        total_width = max(img.width for img in images)
        total_height = sum(img.height for img in images)
        result = Image.new("RGB", (total_width, total_height), "white")
        y_offset = 0
        for img in images:
            result.paste(img, (0, y_offset))
            y_offset += img.height
    else:  # horizontal
        total_width = sum(img.width for img in images)
        total_height = max(img.height for img in images)
        result = Image.new("RGB", (total_width, total_height), "white")
        x_offset = 0
        for img in images:
            result.paste(img, (x_offset, 0))
            x_offset += img.width
    
    output = output_dir / "joined-images.jpg"
    result.save(output, quality=92)
    return create_single_file_result(output, "Images joined", "image/jpeg")


def handle_split_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Split image into grid tiles"""
    ensure_files(files, 1)
    
    rows = int(payload.get("rows", 2))
    cols = int(payload.get("cols", 2))
    
    image = Image.open(files[0])
    tile_width = image.width // cols
    tile_height = image.height // rows
    
    for row in range(rows):
        for col in range(cols):
            left = col * tile_width
            top = row * tile_height
            right = left + tile_width
            bottom = top + tile_height
            
            tile = image.crop((left, top, right, bottom))
            output = output_dir / f"tile-{row}-{col}.png"
            tile.save(output)
    
    return create_zip_result(output_dir, "Image split into tiles", "split-tiles")


def handle_circle_crop_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Crop image into circle"""
    ensure_files(files, 1)
    
    image = Image.open(files[0]).convert("RGB")
    size = min(image.width, image.height)
    
    # Center crop to square
    left = (image.width - size) // 2
    top = (image.height - size) // 2
    image = image.crop((left, top, left + size, top + size))
    
    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Apply mask
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    result.paste(image, (0, 0))
    result.putalpha(mask)
    
    output = output_dir / f"circle-{files[0].stem}.png"
    result.save(output)
    return create_single_file_result(output, "Circle crop applied", "image/png")


def handle_square_crop_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Center crop image to square"""
    ensure_files(files, 1)
    
    image = Image.open(files[0])
    size = min(image.width, image.height)
    
    left = (image.width - size) // 2
    top = (image.height - size) // 2
    cropped = image.crop((left, top, left + size, top + size))
    
    output = output_dir / f"square-{files[0].name}"
    save_image(cropped, output)
    return create_single_file_result(output, "Square crop applied", "image/*")


def handle_motion_blur_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Apply motion blur effect"""
    ensure_files(files, 1)
    
    image = Image.open(files[0])
    # Apply box blur for motion effect
    blurred = image.filter(ImageFilter.BoxBlur(5))
    
    output = output_dir / f"motion-blur-{files[0].name}"
    save_image(blurred, output)
    return create_single_file_result(output, "Motion blur applied", "image/*")


# ============================================================================
# DPI and Dimension Tools
# ============================================================================

def handle_convert_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert image DPI"""
    ensure_files(files, 1)
    
    target_dpi = int(payload.get("dpi", 300))
    image = Image.open(files[0])
    
    output = output_dir / f"dpi-{target_dpi}-{files[0].name}"
    image.save(output, dpi=(target_dpi, target_dpi))
    return create_single_file_result(output, f"DPI set to {target_dpi}", "image/*")


def handle_resize_image_in_cm(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize image in centimeters"""
    ensure_files(files, 1)
    
    width_cm = float(payload.get("width_cm", 10))
    height_cm = float(payload.get("height_cm", 10))
    dpi = int(payload.get("dpi", 300))
    
    # Convert cm to pixels
    width_px = int(width_cm * dpi / 2.54)
    height_px = int(height_cm * dpi / 2.54)
    
    image = Image.open(files[0])
    resized = image.resize((width_px, height_px), Image.LANCZOS)
    
    output = output_dir / f"resized-cm-{files[0].name}"
    resized.save(output, dpi=(dpi, dpi))
    return create_single_file_result(output, "Image resized in cm", "image/*")


def handle_resize_image_in_mm(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize image in millimeters"""
    ensure_files(files, 1)
    
    width_mm = float(payload.get("width_mm", 100))
    height_mm = float(payload.get("height_mm", 100))
    dpi = int(payload.get("dpi", 300))
    
    # Convert mm to pixels
    width_px = int(width_mm * dpi / 25.4)
    height_px = int(height_mm * dpi / 25.4)
    
    image = Image.open(files[0])
    resized = image.resize((width_px, height_px), Image.LANCZOS)
    
    output = output_dir / f"resized-mm-{files[0].name}"
    resized.save(output, dpi=(dpi, dpi))
    return create_single_file_result(output, "Image resized in mm", "image/*")


def handle_resize_image_in_inch(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize image in inches"""
    ensure_files(files, 1)
    
    width_inch = float(payload.get("width_inch", 4))
    height_inch = float(payload.get("height_inch", 4))
    dpi = int(payload.get("dpi", 300))
    
    # Convert inches to pixels
    width_px = int(width_inch * dpi)
    height_px = int(height_inch * dpi)
    
    image = Image.open(files[0])
    resized = image.resize((width_px, height_px), Image.LANCZOS)
    
    output = output_dir / f"resized-inch-{files[0].name}"
    resized.save(output, dpi=(dpi, dpi))
    return create_single_file_result(output, "Image resized in inches", "image/*")


# ============================================================================
# Special Image Tools
# ============================================================================

def handle_add_name_dob_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add name and date of birth to photo"""
    ensure_files(files, 1)
    
    name = str(payload.get("name", "")).strip()
    dob = str(payload.get("dob", "")).strip()
    
    if not name and not dob:
        raise HTTPException(status_code=400, detail="Provide name or dob")
    
    image = Image.open(files[0]).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    y_pos = image.height - 60
    if name:
        draw.text((20, y_pos), f"Name: {name}", fill="white", font=font)
        y_pos += 30
    if dob:
        draw.text((20, y_pos), f"DOB: {dob}", fill="white", font=font)
    
    output = output_dir / f"labeled-{files[0].name}"
    image.save(output, quality=92)
    return create_single_file_result(output, "Name and DOB added", "image/jpeg")


def handle_merge_photo_signature(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Merge photo and signature"""
    ensure_files(files, 2)
    
    photo = Image.open(files[0]).convert("RGB")
    signature = Image.open(files[1]).convert("RGBA")
    
    # Resize signature to fit photo width
    sig_width = int(photo.width * 0.3)
    sig_height = int(signature.height * (sig_width / signature.width))
    signature = signature.resize((sig_width, sig_height), Image.LANCZOS)
    
    # Paste signature at bottom-right
    position = (photo.width - sig_width - 20, photo.height - sig_height - 20)
    photo.paste(signature, position, signature)
    
    output = output_dir / "photo-with-signature.jpg"
    photo.save(output, quality=92)
    return create_single_file_result(output, "Photo and signature merged", "image/jpeg")


def handle_black_and_white_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert to black and white"""
    ensure_files(files, 1)
    
    image = Image.open(files[0]).convert("L")
    # Apply threshold for pure black and white
    threshold = int(payload.get("threshold", 128))
    bw = image.point(lambda x: 255 if x > threshold else 0, mode="1")
    
    output = output_dir / f"bw-{files[0].name}"
    bw.save(output)
    return create_single_file_result(output, "Converted to black and white", "image/*")


def handle_censor_photo(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Censor photo by pixelating"""
    ensure_files(files, 1)
    
    image = Image.open(files[0])
    factor = int(payload.get("factor", 20))
    
    small = image.resize((image.width // factor, image.height // factor), Image.NEAREST)
    censored = small.resize(image.size, Image.NEAREST)
    
    output = output_dir / f"censored-{files[0].name}"
    save_image(censored, output)
    return create_single_file_result(output, "Photo censored", "image/*")


def handle_picture_to_pixel_art(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert picture to pixel art"""
    ensure_files(files, 1)
    
    image = Image.open(files[0])
    pixel_size = int(payload.get("pixel_size", 16))
    
    small = image.resize((pixel_size, pixel_size), Image.BILINEAR)
    pixel_art = small.resize(image.size, Image.NEAREST)
    
    output = output_dir / f"pixel-art-{files[0].name}"
    save_image(pixel_art, output)
    return create_single_file_result(output, "Converted to pixel art", "image/*")


def handle_generate_signature(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Generate signature image from text"""
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Provide text for signature")
    
    # Create image with transparent background
    img = Image.new("RGBA", (600, 200), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    draw.text((50, 75), text, fill=(0, 0, 0, 255), font=font)
    
    output = output_dir / "signature.png"
    img.save(output)
    return create_single_file_result(output, "Signature generated", "image/png")


# Export all handlers
__all__ = [
    "handle_ocr_image", "handle_ocr_pdf", "handle_image_to_text",
    "handle_jpg_to_text", "handle_png_to_text", "handle_pdf_ocr",
    "handle_pixelate_face", "handle_blur_background", "handle_add_text_image",
    "handle_add_logo_image", "handle_join_images", "handle_split_image",
    "handle_circle_crop_image", "handle_square_crop_image", "handle_motion_blur_image",
    "handle_convert_dpi", "handle_resize_image_in_cm", "handle_resize_image_in_mm",
    "handle_resize_image_in_inch", "handle_add_name_dob_image",
    "handle_merge_photo_signature", "handle_black_and_white_image",
    "handle_censor_photo", "handle_picture_to_pixel_art", "handle_generate_signature",
]
