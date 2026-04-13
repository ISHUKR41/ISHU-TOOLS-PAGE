"""
eBook and Format Conversion Handlers for ISHU TOOLS
Handles EPUB, RTF, ODT, TIFF, SVG, and other format conversions
"""
from __future__ import annotations
import io
import zipfile
from pathlib import Path
from typing import Any
from fastapi import HTTPException
from PIL import Image
from pypdf import PdfReader, PdfWriter

from .handlers import (
    ExecutionResult, create_single_file_result, create_zip_result, ensure_files,
    extract_pdf_text, text_to_pdf, open_image_file, save_image, image_paths_to_pdf
)


# ============================================================================
# TIFF Conversions
# ============================================================================

def handle_pdf_to_tiff(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to TIFF"""
    ensure_files(files, 1)
    import fitz
    
    document = fitz.open(str(files[0]))
    images = []
    
    for page in document:
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        images.append(img)
    
    document.close()
    
    output = output_dir / "converted.tiff"
    if images:
        images[0].save(output, save_all=True, append_images=images[1:], compression="tiff_deflate")
    
    return create_single_file_result(output, "PDF converted to TIFF", "image/tiff")


def handle_tiff_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert TIFF to PDF"""
    ensure_files(files, 1)
    
    images = []
    for file_path in files:
        img = Image.open(file_path)
        # Handle multi-page TIFF
        try:
            for i in range(img.n_frames):
                img.seek(i)
                images.append(img.convert("RGB").copy())
        except:
            images.append(img.convert("RGB"))
    
    output = output_dir / "tiff-converted.pdf"
    if images:
        images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "TIFF converted to PDF", "application/pdf")


# ============================================================================
# SVG Conversions
# ============================================================================

def handle_pdf_to_svg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to SVG"""
    ensure_files(files, 1)
    import fitz
    
    document = fitz.open(str(files[0]))
    
    for index, page in enumerate(document, start=1):
        svg_text = page.get_svg_image()
        output = output_dir / f"page-{index}.svg"
        output.write_text(svg_text, encoding="utf-8")
    
    document.close()
    return create_zip_result(output_dir, "PDF converted to SVG", "pdf-to-svg")


def handle_svg_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert SVG to PDF"""
    ensure_files(files, 1)
    
    # For SVG, we'll convert to image first then to PDF
    try:
        from cairosvg import svg2png
        
        images = []
        for svg_file in files:
            png_data = svg2png(url=str(svg_file))
            img = Image.open(io.BytesIO(png_data)).convert("RGB")
            images.append(img)
        
        output = output_dir / "svg-converted.pdf"
        if images:
            images[0].save(output, save_all=True, append_images=images[1:])
        
        return create_single_file_result(output, "SVG converted to PDF", "application/pdf")
    except ImportError:
        # Fallback: just create a text PDF mentioning the SVG files
        text = f"SVG files: {', '.join(f.name for f in files)}"
        output = output_dir / "svg-list.pdf"
        text_to_pdf(text, output, title="SVG Files")
        return create_single_file_result(output, "SVG list created", "application/pdf")


# ============================================================================
# RTF Conversions
# ============================================================================

def handle_pdf_to_rtf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to RTF"""
    ensure_files(files, 1)
    
    text = extract_pdf_text(files[0])
    
    # Create basic RTF document
    rtf_content = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Arial;}}\f0\fs24 "
    rtf_content += text.replace("\n", r"\par ")
    rtf_content += "}"
    
    output = output_dir / "converted.rtf"
    output.write_text(rtf_content, encoding="utf-8")
    return create_single_file_result(output, "PDF converted to RTF", "application/rtf")


def handle_rtf_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert RTF to PDF"""
    ensure_files(files, 1)
    
    # Read RTF and extract text (basic parsing)
    rtf_content = files[0].read_text(encoding="utf-8", errors="ignore")
    # Remove RTF control words
    import re
    text = re.sub(r'\\[a-z]+\d*\s?', ' ', rtf_content)
    text = re.sub(r'[{}]', '', text)
    text = text.strip()
    
    output = output_dir / "rtf-converted.pdf"
    text_to_pdf(text, output, title="RTF to PDF")
    return create_single_file_result(output, "RTF converted to PDF", "application/pdf")


# ============================================================================
# ODT Conversions
# ============================================================================

def handle_pdf_to_odt(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to ODT"""
    ensure_files(files, 1)
    
    text = extract_pdf_text(files[0])
    
    # Create basic ODT (OpenDocument Text) - simplified version
    # In production, use odfpy library
    output = output_dir / "converted.odt"
    
    # Create a minimal ODT structure
    odt_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                         xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">
  <office:body>
    <office:text>
      <text:p>{text}</text:p>
    </office:text>
  </office:body>
</office:document-content>"""
    
    # Create ODT as ZIP
    with zipfile.ZipFile(output, 'w') as odt_zip:
        odt_zip.writestr('content.xml', odt_content)
        odt_zip.writestr('mimetype', 'application/vnd.oasis.opendocument.text')
    
    return create_single_file_result(output, "PDF converted to ODT", "application/vnd.oasis.opendocument.text")


def handle_odt_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert ODT to PDF"""
    ensure_files(files, 1)
    
    # Extract text from ODT
    try:
        with zipfile.ZipFile(files[0], 'r') as odt_zip:
            content_xml = odt_zip.read('content.xml').decode('utf-8')
            # Basic XML parsing to extract text
            import re
            text = re.sub(r'<[^>]+>', ' ', content_xml)
            text = ' '.join(text.split())
    except:
        text = "Could not extract text from ODT file"
    
    output = output_dir / "odt-converted.pdf"
    text_to_pdf(text, output, title="ODT to PDF")
    return create_single_file_result(output, "ODT converted to PDF", "application/pdf")


# ============================================================================
# EPUB Conversions
# ============================================================================

def handle_pdf_to_epub(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to EPUB"""
    ensure_files(files, 1)
    
    text = extract_pdf_text(files[0])
    
    # Create basic EPUB structure
    output = output_dir / "converted.epub"
    
    with zipfile.ZipFile(output, 'w') as epub_zip:
        # mimetype
        epub_zip.writestr('mimetype', 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
        
        # container.xml
        container_xml = '''<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>'''
        epub_zip.writestr('META-INF/container.xml', container_xml)
        
        # content.opf
        content_opf = f'''<?xml version="1.0"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{files[0].stem}</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="content"/>
  </spine>
</package>'''
        epub_zip.writestr('content.opf', content_opf)
        
        # content.html
        content_html = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>{files[0].stem}</title></head>
<body><p>{text.replace(chr(10), '</p><p>')}</p></body>
</html>'''
        epub_zip.writestr('content.html', content_html)
    
    return create_single_file_result(output, "PDF converted to EPUB", "application/epub+zip")


def handle_epub_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert EPUB to PDF"""
    ensure_files(files, 1)
    
    # Extract text from EPUB
    text_parts = []
    try:
        with zipfile.ZipFile(files[0], 'r') as epub_zip:
            for name in epub_zip.namelist():
                if name.endswith('.html') or name.endswith('.xhtml'):
                    content = epub_zip.read(name).decode('utf-8', errors='ignore')
                    # Basic HTML tag removal
                    import re
                    clean_text = re.sub(r'<[^>]+>', ' ', content)
                    text_parts.append(clean_text)
    except:
        text_parts = ["Could not extract text from EPUB file"]
    
    text = '\n\n'.join(text_parts)
    output = output_dir / "epub-converted.pdf"
    text_to_pdf(text, output, title="EPUB to PDF")
    return create_single_file_result(output, "EPUB converted to PDF", "application/pdf")


# ============================================================================
# Optimize PDF
# ============================================================================

def handle_optimize_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Optimize PDF for smaller file size"""
    ensure_files(files, 1)
    
    import fitz
    document = fitz.open(str(files[0]))
    
    output = output_dir / "optimized.pdf"
    document.save(
        str(output),
        garbage=4,
        deflate=True,
        clean=True,
        linear=True
    )
    document.close()
    
    return create_single_file_result(output, "PDF optimized", "application/pdf")


# ============================================================================
# Generic Converters
# ============================================================================

def handle_convert_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Generic converter to PDF"""
    ensure_files(files, 1)
    
    file_ext = files[0].suffix.lower()
    
    # Route to appropriate handler based on extension
    if file_ext in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif'}:
        return image_paths_to_pdf(files, output_dir / "converted.pdf")
    elif file_ext in {'.txt', '.md'}:
        text = files[0].read_text(encoding='utf-8')
        output = output_dir / "converted.pdf"
        text_to_pdf(text, output, title="Converted to PDF")
        return create_single_file_result(output, "Converted to PDF", "application/pdf")
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {file_ext}")


def handle_convert_from_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Generic converter from PDF"""
    ensure_files(files, 1)
    
    target_format = str(payload.get("format", "txt")).strip().lower()
    
    if target_format in {"txt", "text"}:
        return handle_pdf_to_txt(files, payload, output_dir)
    elif target_format in {"jpg", "jpeg", "png", "image"}:
        return handle_pdf_to_jpg(files, payload, output_dir)
    elif target_format == "docx":
        from .production_handlers import handle_pdf_to_docx
        return handle_pdf_to_docx(files, payload, output_dir)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported target format: {target_format}")


def handle_pdf_converter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Smart PDF converter"""
    ensure_files(files, 1)
    
    file_ext = files[0].suffix.lower()
    
    if file_ext == '.pdf':
        return handle_convert_from_pdf(files, payload, output_dir)
    else:
        return handle_convert_to_pdf(files, payload, output_dir)


# Export all handlers
__all__ = [
    "handle_pdf_to_tiff", "handle_tiff_to_pdf",
    "handle_pdf_to_svg", "handle_svg_to_pdf",
    "handle_pdf_to_rtf", "handle_rtf_to_pdf",
    "handle_pdf_to_odt", "handle_odt_to_pdf",
    "handle_pdf_to_epub", "handle_epub_to_pdf",
    "handle_optimize_pdf", "handle_convert_to_pdf",
    "handle_convert_from_pdf", "handle_pdf_converter",
]
