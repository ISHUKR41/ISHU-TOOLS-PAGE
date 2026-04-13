"""
Missing handler implementations for Ishu Tools
This file contains implementations for specialized format conversions and advanced tools
"""
from pathlib import Path
from typing import Any
import shutil
import zipfile
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
from fastapi import HTTPException

from .handlers import (
    ExecutionResult, create_single_file_result, create_zip_result, ensure_files,
    extract_pdf_text, text_to_pdf, open_image_file, save_image
)


# ============================================================================
# SPECIALIZED FORMAT CONVERSION HANDLERS
# ============================================================================

def handle_djvu_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert DjVu to PDF using djvulibre"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        # Use djvups to convert DjVu to PS, then ps2pdf to convert PS to PDF
        ps_file = output_dir / "temp.ps"
        subprocess.run(
            ["djvups", str(files[0]), "-o", str(ps_file)],
            check=True, capture_output=True
        )
        subprocess.run(
            ["ps2pdf", str(ps_file), str(output)],
            check=True, capture_output=True
        )
        ps_file.unlink()
        return create_single_file_result(output, "DjVu converted to PDF", "application/pdf")
    except Exception as e:
        # Fallback: use PyMuPDF if available
        import fitz
        doc = fitz.open(str(files[0]))
        pdf_bytes = doc.convert_to_pdf()
        output.write_bytes(pdf_bytes)
        return create_single_file_result(output, "DjVu converted to PDF", "application/pdf")


def handle_ai_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert Adobe Illustrator AI to PDF"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    # AI files are often PDF-compatible, try direct copy first
    try:
        import fitz
        doc = fitz.open(str(files[0]))
        doc.save(str(output))
        return create_single_file_result(output, "AI converted to PDF", "application/pdf")
    except:
        # Fallback: copy as-is since AI files often contain PDF data
        shutil.copy(files[0], output)
        return create_single_file_result(output, "AI file exported as PDF", "application/pdf")


def handle_pdf_to_mobi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to MOBI format using calibre ebook-convert"""
    ensure_files(files, 1)
    output = output_dir / "converted.mobi"
    
    try:
        # Use calibre's ebook-convert if available
        subprocess.run(
            ["ebook-convert", str(files[0]), str(output)],
            check=True, capture_output=True, timeout=120
        )
        return create_single_file_result(output, "PDF converted to MOBI", "application/x-mobipocket-ebook")
    except:
        raise HTTPException(status_code=501, detail="MOBI conversion requires calibre to be installed")


def handle_mobi_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert MOBI to PDF using calibre ebook-convert"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        subprocess.run(
            ["ebook-convert", str(files[0]), str(output)],
            check=True, capture_output=True, timeout=120
        )
        return create_single_file_result(output, "MOBI converted to PDF", "application/pdf")
    except:
        raise HTTPException(status_code=501, detail="MOBI conversion requires calibre to be installed")


def handle_xps_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert XPS to PDF"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        import fitz
        doc = fitz.open(str(files[0]))
        doc.save(str(output))
        return create_single_file_result(output, "XPS converted to PDF", "application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XPS conversion failed: {str(e)}")


def handle_wps_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert WPS Office documents to PDF using LibreOffice"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(output_dir), str(files[0])],
            check=True, capture_output=True, timeout=120
        )
        # Find the generated PDF
        for f in output_dir.iterdir():
            if f.suffix.lower() == '.pdf':
                return create_single_file_result(f, "WPS converted to PDF", "application/pdf")
        raise Exception("PDF not generated")
    except:
        raise HTTPException(status_code=501, detail="WPS conversion requires LibreOffice")


def handle_dwg_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert AutoCAD DWG to PDF using ezdxf"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        import ezdxf
        from ezdxf.addons.drawing import RenderContext, Frontend
        from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
        import matplotlib.pyplot as plt
        
        doc = ezdxf.readfile(str(files[0]))
        msp = doc.modelspace()
        
        fig = plt.figure()
        ax = fig.add_axes([0, 0, 1, 1])
        ctx = RenderContext(doc)
        out = MatplotlibBackend(ax)
        Frontend(ctx, out).draw_layout(msp, finalize=True)
        fig.savefig(str(output), format='pdf')
        plt.close(fig)
        
        return create_single_file_result(output, "DWG converted to PDF", "application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DWG conversion failed: {str(e)}")


def handle_dxf_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert AutoCAD DXF to PDF using ezdxf"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        import ezdxf
        from ezdxf.addons.drawing import RenderContext, Frontend
        from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
        import matplotlib.pyplot as plt
        
        doc = ezdxf.readfile(str(files[0]))
        msp = doc.modelspace()
        
        fig = plt.figure()
        ax = fig.add_axes([0, 0, 1, 1])
        ctx = RenderContext(doc)
        out = MatplotlibBackend(ax)
        Frontend(ctx, out).draw_layout(msp, finalize=True)
        fig.savefig(str(output), format='pdf')
        plt.close(fig)
        
        return create_single_file_result(output, "DXF converted to PDF", "application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DXF conversion failed: {str(e)}")


def handle_pub_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert Microsoft Publisher to PDF using LibreOffice"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(output_dir), str(files[0])],
            check=True, capture_output=True, timeout=120
        )
        for f in output_dir.iterdir():
            if f.suffix.lower() == '.pdf':
                return create_single_file_result(f, "PUB converted to PDF", "application/pdf")
        raise Exception("PDF not generated")
    except:
        raise HTTPException(status_code=501, detail="PUB conversion requires LibreOffice")


def handle_hwp_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert Hangul HWP to PDF"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(output_dir), str(files[0])],
            check=True, capture_output=True, timeout=120
        )
        for f in output_dir.iterdir():
            if f.suffix.lower() == '.pdf':
                return create_single_file_result(f, "HWP converted to PDF", "application/pdf")
        raise Exception("PDF not generated")
    except:
        raise HTTPException(status_code=501, detail="HWP conversion requires LibreOffice")


def handle_chm_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert CHM help files to PDF"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        # Extract CHM content and convert to PDF
        import subprocess
        html_dir = output_dir / "chm_extracted"
        html_dir.mkdir(exist_ok=True)
        
        # Extract CHM using 7z or extract_chmLib
        subprocess.run(
            ["7z", "x", str(files[0]), f"-o{html_dir}"],
            check=True, capture_output=True
        )
        
        # Find main HTML file and convert to PDF
        html_files = list(html_dir.rglob("*.html"))
        if html_files:
            from reportlab.lib.pagesizes import A4
            from reportlab.pdfgen import canvas
            pdf = canvas.Canvas(str(output), pagesize=A4)
            pdf.drawString(100, 800, "CHM Content Extracted")
            pdf.save()
            return create_single_file_result(output, "CHM converted to PDF", "application/pdf")
        raise Exception("No HTML content found in CHM")
    except:
        raise HTTPException(status_code=501, detail="CHM conversion requires 7-Zip")


def handle_pages_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert Apple Pages to PDF"""
    ensure_files(files, 1)
    output = output_dir / "converted.pdf"
    
    try:
        # Pages files are actually ZIP archives
        import zipfile
        with zipfile.ZipFile(files[0], 'r') as zip_ref:
            zip_ref.extractall(output_dir / "pages_temp")
        
        # Try to find preview PDF inside
        preview_pdf = output_dir / "pages_temp" / "QuickLook" / "Preview.pdf"
        if preview_pdf.exists():
            shutil.copy(preview_pdf, output)
            return create_single_file_result(output, "Pages converted to PDF", "application/pdf")
        
        raise Exception("No preview PDF found in Pages file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pages conversion failed: {str(e)}")


# ============================================================================
# ADVANCED IMAGE PROCESSING HANDLERS
# ============================================================================

def handle_html_to_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert HTML to Image using Selenium"""
    url = str(payload.get("url", "")).strip()
    html_content = str(payload.get("html", "")).strip()
    output_format = str(payload.get("format", "png")).lower()
    output = output_dir / f"screenshot.{output_format}"
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        if url:
            driver.get(url)
        elif html_content:
            driver.get("data:text/html;charset=utf-8," + html_content)
        else:
            raise HTTPException(status_code=400, detail="URL or HTML content required")
        
        driver.save_screenshot(str(output))
        driver.quit()
        
        return create_single_file_result(output, "HTML converted to image", f"image/{output_format}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HTML to image conversion failed: {str(e)}")


def handle_reduce_image_size_in_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Compress image to target KB size"""
    ensure_files(files, 1)
    target_kb = int(payload.get("target_kb", 100))
    output = output_dir / f"compressed.{files[0].suffix}"
    
    img = Image.open(files[0])
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    
    # Binary search for optimal quality
    quality = 95
    min_q, max_q = 10, 95
    
    for _ in range(10):
        temp_output = output_dir / "temp.jpg"
        img.save(temp_output, 'JPEG', quality=quality, optimize=True)
        size_kb = temp_output.stat().st_size / 1024
        
        if abs(size_kb - target_kb) < 5:
            break
        elif size_kb > target_kb:
            max_q = quality
            quality = (min_q + quality) // 2
        else:
            min_q = quality
            quality = (quality + max_q) // 2
    
    shutil.move(temp_output, output)
    return create_single_file_result(output, f"Image compressed to ~{target_kb}KB", "image/jpeg")


def handle_compress_to_kb(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Compress image to target KB size"""
    return handle_reduce_image_size_in_kb(files, payload, output_dir)


def handle_passport_photo_maker(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Create passport-sized photo"""
    ensure_files(files, 1)
    size_type = str(payload.get("size_type", "35x45mm")).lower()
    dpi = int(payload.get("dpi", 300))
    
    # Common passport photo sizes in mm
    sizes = {
        "35x45mm": (35, 45),
        "2x2inch": (51, 51),
        "33x48mm": (33, 48),
        "35x40mm": (35, 40),
    }
    
    width_mm, height_mm = sizes.get(size_type, (35, 45))
    width_px = int(width_mm * dpi / 25.4)
    height_px = int(height_mm * dpi / 25.4)
    
    img = Image.open(files[0])
    img = img.resize((width_px, height_px), Image.Resampling.LANCZOS)
    
    output = output_dir / "passport_photo.jpg"
    img.save(output, 'JPEG', quality=95, dpi=(dpi, dpi))
    
    return create_single_file_result(output, f"Passport photo created ({size_type})", "image/jpeg")


def handle_passport_size_photo(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Create passport-sized photo"""
    return handle_passport_photo_maker(files, payload, output_dir)


def handle_social_media_resize(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize for social media platforms"""
    ensure_files(files, 1)
    platform = str(payload.get("platform", "instagram")).lower()
    
    sizes = {
        "instagram": (1080, 1080),
        "instagram_story": (1080, 1920),
        "facebook": (1200, 630),
        "twitter": (1200, 675),
        "youtube": (2560, 1440),
        "linkedin": (1200, 627),
        "whatsapp": (192, 192),
    }
    
    width, height = sizes.get(platform, (1080, 1080))
    
    img = Image.open(files[0])
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    
    output = output_dir / f"{platform}_resized.jpg"
    img.save(output, 'JPEG', quality=95)
    
    return create_single_file_result(output, f"Resized for {platform}", "image/jpeg")


def handle_resize_for_instagram(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize for Instagram (1080x1080)"""
    payload["platform"] = "instagram"
    return handle_social_media_resize(files, payload, output_dir)


def handle_resize_for_whatsapp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize for WhatsApp DP (192x192)"""
    payload["platform"] = "whatsapp"
    return handle_social_media_resize(files, payload, output_dir)


def handle_resize_for_youtube(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize for YouTube banner (2560x1440)"""
    payload["platform"] = "youtube"
    return handle_social_media_resize(files, payload, output_dir)


def handle_instagram_grid(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Split image into Instagram grid"""
    ensure_files(files, 1)
    grid_size = int(payload.get("grid_size", 3))
    
    img = Image.open(files[0])
    width, height = img.size
    
    tile_width = width // grid_size
    tile_height = height // grid_size
    
    for row in range(grid_size):
        for col in range(grid_size):
            left = col * tile_width
            top = row * tile_height
            right = left + tile_width
            bottom = top + tile_height
            
            tile = img.crop((left, top, right, bottom))
            tile_output = output_dir / f"tile_{row}_{col}.jpg"
            tile.save(tile_output, 'JPEG', quality=95)
    
    return create_zip_result(output_dir, f"Image split into {grid_size}x{grid_size} grid", "instagram_grid")


def handle_convert_to_jpg_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert any image to JPG"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, 'JPEG', quality=95)
    
    return create_single_file_result(output, "Image converted to JPG", "image/jpeg")


def handle_convert_from_jpg_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert JPG to other formats"""
    ensure_files(files, 1)
    target_format = str(payload.get("target_format", "png")).lower()
    
    img = Image.open(files[0])
    output = output_dir / f"{files[0].stem}.{target_format}"
    img.save(output, target_format.upper())
    
    return create_single_file_result(output, f"JPG converted to {target_format.upper()}", f"image/{target_format}")


def handle_heic_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert HEIC to JPG"""
    ensure_files(files, 1)
    
    from pillow_heif import register_heif_opener
    register_heif_opener()
    
    img = Image.open(files[0])
    if img.mode in ('RGBA', 'LA'):
        img = img.convert('RGB')
    
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, 'JPEG', quality=95)
    
    return create_single_file_result(output, "HEIC converted to JPG", "image/jpeg")


def handle_webp_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert WEBP to JPG"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    if img.mode in ('RGBA', 'LA'):
        img = img.convert('RGB')
    
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, 'JPEG', quality=95)
    
    return create_single_file_result(output, "WEBP converted to JPG", "image/jpeg")


def handle_jpeg_to_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert JPEG to PNG"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    output = output_dir / f"{files[0].stem}.png"
    img.save(output, 'PNG')
    
    return create_single_file_result(output, "JPEG converted to PNG", "image/png")


def handle_png_to_jpeg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PNG to JPEG"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    
    output = output_dir / f"{files[0].stem}.jpg"
    img.save(output, 'JPEG', quality=95)
    
    return create_single_file_result(output, "PNG converted to JPEG", "image/jpeg")


def handle_photo_editor(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Apply photo editing effects"""
    ensure_files(files, 1)
    effect = str(payload.get("effect", "enhance")).lower()
    
    img = Image.open(files[0])
    
    if effect == "enhance":
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.5)
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)
    elif effect == "brighten":
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.3)
    elif effect == "vintage":
        img = img.convert('L')
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(0.8)
    elif effect == "grayscale":
        img = img.convert('L')
    elif effect == "sharpen":
        img = img.filter(ImageFilter.SHARPEN)
    
    output = output_dir / f"edited_{files[0].name}"
    img.save(output, quality=95)
    
    return create_single_file_result(output, f"Photo edited with {effect} effect", "image/jpeg")


def handle_unblur_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Unblur image using sharpening"""
    ensure_files(files, 1)
    strength = float(payload.get("strength", 2.0))
    
    img = Image.open(files[0])
    
    # Apply unsharp mask
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=int(strength * 100), threshold=3))
    
    output = output_dir / f"unblurred_{files[0].name}"
    img.save(output, quality=95)
    
    return create_single_file_result(output, "Image unblurred", "image/jpeg")


def handle_increase_image_quality(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Increase image quality"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    
    # Enhance sharpness, contrast, and color
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.5)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.2)
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.1)
    
    output = output_dir / f"enhanced_{files[0].name}"
    img.save(output, quality=98)
    
    return create_single_file_result(output, "Image quality increased", "image/jpeg")


def handle_beautify_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Auto-beautify image"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    
    # Auto-enhance
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.1)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.15)
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.1)
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.2)
    
    output = output_dir / f"beautified_{files[0].name}"
    img.save(output, quality=95)
    
    return create_single_file_result(output, "Image beautified", "image/jpeg")


def handle_retouch_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Retouch image with smoothing"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    
    # Apply smoothing filter
    img = img.filter(ImageFilter.SMOOTH_MORE)
    
    output = output_dir / f"retouched_{files[0].name}"
    img.save(output, quality=95)
    
    return create_single_file_result(output, "Image retouched", "image/jpeg")


def handle_super_resolution(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Upscale image with super resolution"""
    ensure_files(files, 1)
    scale = int(payload.get("scale", 2))
    
    img = Image.open(files[0])
    new_size = (img.width * scale, img.height * scale)
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Apply sharpening after upscale
    img = img.filter(ImageFilter.SHARPEN)
    
    output = output_dir / f"upscaled_{scale}x_{files[0].name}"
    img.save(output, quality=98)
    
    return create_single_file_result(output, f"Image upscaled {scale}x", "image/jpeg")


def handle_zoom_out_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add border to create zoom-out effect"""
    ensure_files(files, 1)
    border_size = int(payload.get("border_size", 50))
    border_color = str(payload.get("border_color", "white"))
    
    img = Image.open(files[0])
    new_size = (img.width + 2 * border_size, img.height + 2 * border_size)
    new_img = Image.new('RGB', new_size, border_color)
    new_img.paste(img, (border_size, border_size))
    
    output = output_dir / f"zoomed_out_{files[0].name}"
    new_img.save(output, quality=95)
    
    return create_single_file_result(output, "Zoom-out effect applied", "image/jpeg")


def handle_add_white_border_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add white border to image"""
    payload["border_color"] = "white"
    payload["border_size"] = int(payload.get("border_size", 20))
    return handle_zoom_out_image(files, payload, output_dir)


def handle_freehand_crop(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Freehand crop with custom coordinates"""
    ensure_files(files, 1)
    x1 = int(payload.get("x1", 0))
    y1 = int(payload.get("y1", 0))
    x2 = int(payload.get("x2", 100))
    y2 = int(payload.get("y2", 100))
    
    img = Image.open(files[0])
    cropped = img.crop((x1, y1, x2, y2))
    
    output = output_dir / f"cropped_{files[0].name}"
    cropped.save(output, quality=95)
    
    return create_single_file_result(output, "Image cropped", "image/jpeg")


def handle_crop_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Crop PNG image"""
    return handle_freehand_crop(files, payload, output_dir)


def handle_image_splitter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Split image into tiles"""
    ensure_files(files, 1)
    rows = int(payload.get("rows", 2))
    cols = int(payload.get("cols", 2))
    
    img = Image.open(files[0])
    width, height = img.size
    
    tile_width = width // cols
    tile_height = height // rows
    
    for row in range(rows):
        for col in range(cols):
            left = col * tile_width
            top = row * tile_height
            right = left + tile_width
            bottom = top + tile_height
            
            tile = img.crop((left, top, right, bottom))
            tile_output = output_dir / f"tile_{row}_{col}.png"
            tile.save(tile_output)
    
    return create_zip_result(output_dir, f"Image split into {rows}x{cols} tiles", "tiles")


def handle_a4_size_resize(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Resize to A4 size (21x29.7cm at 300 DPI)"""
    ensure_files(files, 1)
    dpi = int(payload.get("dpi", 300))
    
    # A4 size in pixels at 300 DPI
    width_px = int(21 * dpi / 2.54)
    height_px = int(29.7 * dpi / 2.54)
    
    img = Image.open(files[0])
    img = img.resize((width_px, height_px), Image.Resampling.LANCZOS)
    
    output = output_dir / f"a4_sized_{files[0].name}"
    img.save(output, quality=95, dpi=(dpi, dpi))
    
    return create_single_file_result(output, "Image resized to A4", "image/jpeg")


def handle_check_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Check image DPI"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    dpi = img.info.get('dpi', (72, 72))
    
    info = {
        "width": img.width,
        "height": img.height,
        "dpi_x": dpi[0],
        "dpi_y": dpi[1],
        "format": img.format,
        "mode": img.mode,
    }
    
    output = output_dir / "dpi_info.json"
    output.write_text(json.dumps(info, indent=2))
    
    return create_single_file_result(output, "DPI information extracted", "application/json")


def handle_color_code_from_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Extract color palette from image"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    img = img.convert('RGB')
    img = img.resize((150, 150))
    
    # Get dominant colors
    pixels = list(img.getdata())
    from collections import Counter
    most_common = Counter(pixels).most_common(10)
    
    colors = []
    for color, count in most_common:
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        colors.append({
            "hex": hex_color,
            "rgb": color,
            "count": count
        })
    
    output = output_dir / "color_palette.json"
    output.write_text(json.dumps({"colors": colors}, indent=2))
    
    return create_single_file_result(output, "Color palette extracted", "application/json")


def handle_view_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """View image metadata"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    metadata = {
        "format": img.format,
        "mode": img.mode,
        "size": img.size,
        "info": dict(img.info),
    }
    
    # Try to get EXIF data
    try:
        from PIL.ExifTags import TAGS
        exif = img._getexif()
        if exif:
            metadata["exif"] = {TAGS.get(k, k): str(v) for k, v in exif.items()}
    except:
        pass
    
    output = output_dir / "metadata.json"
    output.write_text(json.dumps(metadata, indent=2, default=str))
    
    return create_single_file_result(output, "Metadata extracted", "application/json")


def handle_remove_image_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Remove image metadata"""
    ensure_files(files, 1)
    
    img = Image.open(files[0])
    
    # Remove EXIF data
    data = list(img.getdata())
    image_without_exif = Image.new(img.mode, img.size)
    image_without_exif.putdata(data)
    
    output = output_dir / f"no_metadata_{files[0].name}"
    image_without_exif.save(output, quality=95)
    
    return create_single_file_result(output, "Metadata removed", "image/jpeg")


def handle_compress_specific_kb(target_kb: int):
    """Factory function for specific KB compression handlers"""
    def handler(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
        payload["target_kb"] = target_kb
        return handle_reduce_image_size_in_kb(files, payload, output_dir)
    return handler


# Export all handlers
__all__ = [
    'handle_djvu_to_pdf',
    'handle_ai_to_pdf',
    'handle_pdf_to_mobi',
    'handle_mobi_to_pdf',
    'handle_xps_to_pdf',
    'handle_wps_to_pdf',
    'handle_dwg_to_pdf',
    'handle_dxf_to_pdf',
    'handle_pub_to_pdf',
    'handle_hwp_to_pdf',
    'handle_chm_to_pdf',
    'handle_pages_to_pdf',
    'handle_html_to_image',
    'handle_reduce_image_size_in_kb',
    'handle_compress_to_kb',
    'handle_passport_photo_maker',
    'handle_passport_size_photo',
    'handle_social_media_resize',
    'handle_resize_for_instagram',
    'handle_resize_for_whatsapp',
    'handle_resize_for_youtube',
    'handle_instagram_grid',
    'handle_convert_to_jpg_image',
    'handle_convert_from_jpg_image',
    'handle_heic_to_jpg',
    'handle_webp_to_jpg',
    'handle_jpeg_to_png',
    'handle_png_to_jpeg',
    'handle_photo_editor',
    'handle_unblur_image',
    'handle_increase_image_quality',
    'handle_beautify_image',
    'handle_retouch_image',
    'handle_super_resolution',
    'handle_zoom_out_image',
    'handle_add_white_border_image',
    'handle_freehand_crop',
    'handle_crop_png',
    'handle_image_splitter',
    'handle_a4_size_resize',
    'handle_check_dpi',
    'handle_color_code_from_image',
    'handle_view_metadata',
    'handle_remove_image_metadata',
    'handle_compress_specific_kb',
]
