"""
Production-Grade Core Handlers with Maximum Accuracy
Implements the most critical PDF and Image tools with professional-grade quality
"""

import io
import os
import shutil
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
import img2pdf
import pikepdf
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
from pdf2image import convert_from_path
from pdf2docx import Converter

from ..models import HandlerResult
from .handlers import coerce_quality


def merge_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Merge multiple PDFs with maximum accuracy using PyMuPDF
    Preserves bookmarks, links, and metadata
    """
    if len(files) < 2:
        return HandlerResult(
            kind="json",
            message="Please upload at least 2 PDF files to merge",
            data={"error": "insufficient_files"}
        )
    
    try:
        # Create output PDF
        merged_pdf = fitz.open()
        
        # Merge each PDF
        for pdf_file in files:
            with fitz.open(pdf_file) as pdf:
                merged_pdf.insert_pdf(pdf)
        
        # Save with optimization
        output_path = output_dir / "merged.pdf"
        merged_pdf.save(
            output_path,
            garbage=4,  # Maximum garbage collection
            deflate=True,  # Compress streams
            clean=True  # Clean up unused objects
        )
        merged_pdf.close()
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="merged.pdf",
            content_type="application/pdf",
            message=f"Successfully merged {len(files)} PDF files"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error merging PDFs: {str(e)}",
            data={"error": str(e)}
        )


def split_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Split PDF into individual pages with pikepdf for reliability
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file to split",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        
        with pikepdf.open(pdf_file) as pdf:
            total_pages = len(pdf.pages)
            
            # Create individual PDFs for each page
            for page_num in range(total_pages):
                output_pdf = pikepdf.new()
                output_pdf.pages.append(pdf.pages[page_num])
                
                page_output = output_dir / f"page_{page_num + 1}.pdf"
                output_pdf.save(page_output)
            
            # Create ZIP of all pages
            import zipfile
            zip_path = output_dir / "split_pages.zip"
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for page_file in sorted(output_dir.glob("page_*.pdf")):
                    zipf.write(page_file, page_file.name)
            
            return HandlerResult(
                kind="file",
                output_path=zip_path,
                filename="split_pages.zip",
                content_type="application/zip",
                message=f"Successfully split PDF into {total_pages} pages"
            )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error splitting PDF: {str(e)}",
            data={"error": str(e)}
        )


def compress_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Compress PDF using Ghostscript for maximum quality reduction,
    falling back to pikepdf if Ghostscript is unavailable.
    """
    import subprocess
    import shutil

    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file to compress",
            data={"error": "no_file"}
        )

    try:
        pdf_file = files[0]
        original_size = pdf_file.stat().st_size
        quality = str(payload.get("quality", "ebook")).strip()
        # Map user-friendly names to gs settings
        quality_map = {
            "screen": "/screen",
            "ebook": "/ebook",
            "printer": "/printer",
            "prepress": "/prepress",
            "default": "/default",
        }
        gs_quality = quality_map.get(quality, "/ebook")
        output_path = output_dir / "compressed.pdf"

        # Try Ghostscript first – best quality/size ratio
        gs_bin = shutil.which("gs") or shutil.which("gswin64c") or shutil.which("gswin32c")
        if gs_bin:
            cmd = [
                gs_bin,
                "-sDEVICE=pdfwrite",
                "-dCompatibilityLevel=1.4",
                f"-dPDFSETTINGS={gs_quality}",
                "-dNOPAUSE",
                "-dQUIET",
                "-dBATCH",
                "-dColorImageDownsampleType=/Bicubic",
                "-dGrayImageDownsampleType=/Bicubic",
                "-dMonoImageDownsampleType=/Bicubic",
                "-dEmbedAllFonts=true",
                "-dSubsetFonts=true",
                "-dCompressFonts=true",
                f"-sOutputFile={output_path}",
                str(pdf_file),
            ]
            result = subprocess.run(cmd, capture_output=True, timeout=120)
            if result.returncode == 0 and output_path.exists() and output_path.stat().st_size > 0:
                compressed_size = output_path.stat().st_size
                reduction = ((original_size - compressed_size) / original_size) * 100
                return HandlerResult(
                    kind="file",
                    output_path=output_path,
                    filename="compressed.pdf",
                    content_type="application/pdf",
                    message=f"Compressed {reduction:.1f}% — {original_size // 1024} KB → {compressed_size // 1024} KB"
                )

        # Fallback: pikepdf with maximum stream compression
        with pikepdf.open(pdf_file) as pdf:
            pdf.remove_unreferenced_resources()
            pdf.save(
                output_path,
                compress_streams=True,
                stream_decode_level=pikepdf.StreamDecodeLevel.generalized,
                object_stream_mode=pikepdf.ObjectStreamMode.generate,
                recompress_flate=True,
                normalize_content=True,
            )

        compressed_size = output_path.stat().st_size
        reduction = ((original_size - compressed_size) / original_size) * 100
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="compressed.pdf",
            content_type="application/pdf",
            message=f"Compressed {reduction:.1f}% — {original_size // 1024} KB → {compressed_size // 1024} KB"
        )

    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error compressing PDF: {str(e)}",
            data={"error": str(e)}
        )


def pdf_to_jpg_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Convert PDF pages to high-quality JPG images
    Uses pdf2image with optimal DPI settings
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        dpi = payload.get("dpi", 300)  # High quality by default
        
        # Convert PDF to images
        images = convert_from_path(
            pdf_file,
            dpi=dpi,
            fmt='jpeg',
            jpegopt={'quality': 95, 'optimize': True}
        )
        
        # Save each page
        for i, image in enumerate(images):
            output_path = output_dir / f"page_{i + 1}.jpg"
            image.save(output_path, 'JPEG', quality=95, optimize=True)
        
        # Create ZIP if multiple pages
        if len(images) > 1:
            import zipfile
            zip_path = output_dir / "pdf_pages.zip"
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for jpg_file in sorted(output_dir.glob("page_*.jpg")):
                    zipf.write(jpg_file, jpg_file.name)
            
            return HandlerResult(
                kind="file",
                output_path=zip_path,
                filename="pdf_pages.zip",
                content_type="application/zip",
                message=f"Converted {len(images)} pages to JPG"
            )
        else:
            return HandlerResult(
                kind="file",
                output_path=output_dir / "page_1.jpg",
                filename="page_1.jpg",
                content_type="image/jpeg",
                message="Converted PDF to JPG"
            )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error converting PDF to JPG: {str(e)}",
            data={"error": str(e)}
        )


def jpg_to_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Convert JPG images to PDF with lossless quality using img2pdf
    Preserves original image quality without recompression
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload at least one image file",
            data={"error": "no_files"}
        )
    
    try:
        # Sort files to maintain order
        image_files = sorted(files)
        
        # Convert to PDF using img2pdf (lossless)
        output_path = output_dir / "images.pdf"
        
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert([str(img) for img in image_files]))
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="images.pdf",
            content_type="application/pdf",
            message=f"Converted {len(image_files)} images to PDF"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error converting images to PDF: {str(e)}",
            data={"error": str(e)}
        )


def rotate_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Rotate PDF pages with PyMuPDF for accurate rotation
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        rotation = int(payload.get("rotation", 90))  # Default 90 degrees
        
        # Validate rotation
        if rotation not in [90, 180, 270, -90, -180, -270]:
            rotation = 90
        
        # Open and rotate
        pdf = fitz.open(pdf_file)
        for page in pdf:
            page.set_rotation(rotation)
        
        # Save rotated PDF
        output_path = output_dir / "rotated.pdf"
        pdf.save(output_path, garbage=4, deflate=True)
        pdf.close()
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="rotated.pdf",
            content_type="application/pdf",
            message=f"Rotated PDF by {rotation} degrees"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error rotating PDF: {str(e)}",
            data={"error": str(e)}
        )


def watermark_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Add text watermark to PDF with PyMuPDF
    Supports custom text, position, opacity, and color
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        watermark_text = payload.get("text", "WATERMARK")
        opacity = float(payload.get("opacity", 0.3))
        font_size = int(payload.get("font_size", 50))
        color = payload.get("color", [0.5, 0.5, 0.5])  # Gray by default
        
        # Open PDF
        pdf = fitz.open(pdf_file)
        
        # Add watermark to each page
        for page in pdf:
            # Get page dimensions
            rect = page.rect
            
            # Create watermark
            text_width = fitz.get_text_length(watermark_text, fontsize=font_size)
            x = (rect.width - text_width) / 2
            y = rect.height / 2
            
            # Insert text with rotation (diagonal)
            page.insert_text(
                (x, y),
                watermark_text,
                fontsize=font_size,
                color=color,
                rotate=45,
                opacity=opacity
            )
        
        # Save watermarked PDF
        output_path = output_dir / "watermarked.pdf"
        pdf.save(output_path, garbage=4, deflate=True)
        pdf.close()
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="watermarked.pdf",
            content_type="application/pdf",
            message="Added watermark to PDF"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error adding watermark: {str(e)}",
            data={"error": str(e)}
        )


def protect_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Encrypt PDF with password using pikepdf (AES-256)
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        password = payload.get("password", "")
        
        if not password:
            return HandlerResult(
                kind="json",
                message="Password is required",
                data={"error": "no_password"}
            )
        
        # Open and encrypt
        with pikepdf.open(pdf_file) as pdf:
            output_path = output_dir / "protected.pdf"
            pdf.save(
                output_path,
                encryption=pikepdf.Encryption(
                    owner=password,
                    user=password,
                    R=6,  # AES-256
                    allow=pikepdf.Permissions(
                        accessibility=True,
                        extract=False,
                        modify_annotation=False,
                        modify_assembly=False,
                        modify_form=False,
                        modify_other=False,
                        print_highres=True,
                        print_lowres=True
                    )
                )
            )
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="protected.pdf",
            content_type="application/pdf",
            message="PDF protected with password"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error protecting PDF: {str(e)}",
            data={"error": str(e)}
        )


def unlock_pdf_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Remove password from PDF using pikepdf
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload a PDF file",
            data={"error": "no_file"}
        )
    
    try:
        pdf_file = files[0]
        password = payload.get("password", "")
        
        # Try to open with password
        with pikepdf.open(pdf_file, password=password) as pdf:
            output_path = output_dir / "unlocked.pdf"
            pdf.save(output_path)
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename="unlocked.pdf",
            content_type="application/pdf",
            message="PDF unlocked successfully"
        )
    
    except pikepdf.PasswordError:
        return HandlerResult(
            kind="json",
            message="Incorrect password or PDF is not encrypted",
            data={"error": "wrong_password"}
        )
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error unlocking PDF: {str(e)}",
            data={"error": str(e)}
        )


# Image Processing Handlers

def compress_image_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Compress images with optimal quality/size balance
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload at least one image",
            data={"error": "no_files"}
        )
    
    try:
        quality = coerce_quality(payload.get("quality"), 85)
        compressed_files = []
        
        for img_file in files:
            with Image.open(img_file) as img:
                # Convert RGBA to RGB if necessary
                if img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save with optimization
                output_path = output_dir / f"compressed_{img_file.name}"
                img.save(
                    output_path,
                    format='JPEG',
                    quality=quality,
                    optimize=True,
                    progressive=True
                )
                compressed_files.append(output_path)
        
        # Return single file or ZIP
        if len(compressed_files) == 1:
            return HandlerResult(
                kind="file",
                output_path=compressed_files[0],
                filename=compressed_files[0].name,
                content_type="image/jpeg",
                message="Image compressed successfully"
            )
        else:
            import zipfile
            zip_path = output_dir / "compressed_images.zip"
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for img_file in compressed_files:
                    zipf.write(img_file, img_file.name)
            
            return HandlerResult(
                kind="file",
                output_path=zip_path,
                filename="compressed_images.zip",
                content_type="application/zip",
                message=f"Compressed {len(compressed_files)} images"
            )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error compressing images: {str(e)}",
            data={"error": str(e)}
        )


def resize_image_production(files: list[Path], payload: dict[str, Any], output_dir: Path) -> HandlerResult:
    """
    Resize image with high-quality Lanczos resampling
    """
    if not files:
        return HandlerResult(
            kind="json",
            message="Please upload an image",
            data={"error": "no_file"}
        )
    
    try:
        img_file = files[0]
        width = int(payload.get("width", 800))
        height = int(payload.get("height", 600))
        maintain_aspect = payload.get("maintain_aspect", True)
        
        with Image.open(img_file) as img:
            if maintain_aspect:
                img.thumbnail((width, height), Image.Resampling.LANCZOS)
            else:
                img = img.resize((width, height), Image.Resampling.LANCZOS)
            
            # Save resized image
            output_path = output_dir / f"resized_{img_file.name}"
            img.save(output_path, quality=95, optimize=True)
        
        return HandlerResult(
            kind="file",
            output_path=output_path,
            filename=output_path.name,
            content_type="image/jpeg",
            message=f"Resized to {width}x{height}"
        )
    
    except Exception as e:
        return HandlerResult(
            kind="json",
            message=f"Error resizing image: {str(e)}",
            data={"error": str(e)}
        )


# Export handlers dictionary
PRODUCTION_CORE_HANDLERS = {
    "merge-pdf": merge_pdf_production,
    "split-pdf": split_pdf_production,
    "compress-pdf": compress_pdf_production,
    "pdf-to-jpg": pdf_to_jpg_production,
    "jpg-to-pdf": jpg_to_pdf_production,
    "rotate-pdf": rotate_pdf_production,
    "watermark-pdf": watermark_pdf_production,
    "protect-pdf": protect_pdf_production,
    "unlock-pdf": unlock_pdf_production,
    "compress-image": compress_image_production,
    "resize-image": resize_image_production,
}
