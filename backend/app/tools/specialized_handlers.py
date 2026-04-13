"""
Specialized Handlers for ISHU TOOLS
Handles specialized format conversions and advanced tools
"""
from __future__ import annotations
import io
import json
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
# Email and Archive Conversions
# ============================================================================

def handle_eml_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert EML email to PDF"""
    ensure_files(files, 1)
    
    import email
    from email import policy
    
    with open(files[0], 'rb') as f:
        msg = email.message_from_binary_file(f, policy=policy.default)
    
    # Extract email content
    lines = []
    lines.append(f"From: {msg.get('From', 'Unknown')}")
    lines.append(f"To: {msg.get('To', 'Unknown')}")
    lines.append(f"Subject: {msg.get('Subject', 'No Subject')}")
    lines.append(f"Date: {msg.get('Date', 'Unknown')}")
    lines.append("\n" + "="*50 + "\n")
    
    # Get body
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                lines.append(part.get_content())
    else:
        lines.append(msg.get_content())
    
    text = "\n".join(lines)
    output = output_dir / "email.pdf"
    text_to_pdf(text, output, title="Email Message")
    return create_single_file_result(output, "Email converted to PDF", "application/pdf")


def handle_fb2_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert FB2 eBook to PDF"""
    ensure_files(files, 1)
    
    # FB2 is XML-based
    import xml.etree.ElementTree as ET
    
    try:
        tree = ET.parse(files[0])
        root = tree.getroot()
        
        # Extract text from FB2
        text_parts = []
        for elem in root.iter():
            if elem.text and elem.text.strip():
                text_parts.append(elem.text.strip())
        
        text = "\n\n".join(text_parts)
    except:
        text = files[0].read_text(encoding='utf-8', errors='ignore')
    
    output = output_dir / "fb2-converted.pdf"
    text_to_pdf(text, output, title="FB2 to PDF")
    return create_single_file_result(output, "FB2 converted to PDF", "application/pdf")


def handle_cbz_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert CBZ comic book to PDF"""
    ensure_files(files, 1)
    
    # CBZ is a ZIP file with images
    extract_dir = output_dir / "cbz-images"
    extract_dir.mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(files[0], 'r') as cbz_zip:
        cbz_zip.extractall(extract_dir)
    
    # Find all images
    image_paths = sorted([
        p for p in extract_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    ])
    
    if not image_paths:
        raise HTTPException(status_code=400, detail="No images found in CBZ file")
    
    images = [Image.open(p).convert("RGB") for p in image_paths]
    output = output_dir / "comic.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "CBZ converted to PDF", "application/pdf")


def handle_ebook_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Generic eBook to PDF converter"""
    ensure_files(files, 1)
    
    file_ext = files[0].suffix.lower()
    
    if file_ext == '.epub':
        from .ebook_handlers import handle_epub_to_pdf
        return handle_epub_to_pdf(files, payload, output_dir)
    elif file_ext == '.fb2':
        return handle_fb2_to_pdf(files, payload, output_dir)
    elif file_ext == '.cbz':
        return handle_cbz_to_pdf(files, payload, output_dir)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported eBook format: {file_ext}")


# ============================================================================
# HEIC/HEIF Conversions
# ============================================================================

def handle_heic_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert HEIC images to PDF"""
    ensure_files(files, 1)
    
    try:
        from pillow_heif import register_heif_opener
        register_heif_opener()
    except ImportError:
        pass
    
    images = [Image.open(f).convert("RGB") for f in files]
    output = output_dir / "heic-converted.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "HEIC converted to PDF", "application/pdf")


def handle_heif_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert HEIF images to PDF"""
    return handle_heic_to_pdf(files, payload, output_dir)


def handle_jfif_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert JFIF images to PDF"""
    ensure_files(files, 1)
    
    images = [Image.open(f).convert("RGB") for f in files]
    output = output_dir / "jfif-converted.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "JFIF converted to PDF", "application/pdf")


# ============================================================================
# Archive Operations
# ============================================================================

def handle_zip_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert ZIP of images to PDF"""
    from .handlers import handle_zip_images_to_pdf
    return handle_zip_images_to_pdf(files, payload, output_dir)


def handle_cbr_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert CBR comic book to PDF"""
    ensure_files(files, 1)
    
    # CBR is typically RAR format, but can also be ZIP
    # Try to extract as ZIP first
    extract_dir = output_dir / "cbr-images"
    extract_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        with zipfile.ZipFile(files[0], 'r') as cbr_zip:
            cbr_zip.extractall(extract_dir)
    except:
        # If not ZIP, try rarfile
        try:
            import rarfile
            with rarfile.RarFile(files[0], 'r') as cbr_rar:
                cbr_rar.extractall(extract_dir)
        except:
            raise HTTPException(status_code=400, detail="Could not extract CBR file")
    
    # Find all images
    image_paths = sorted([
        p for p in extract_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    ])
    
    if not image_paths:
        raise HTTPException(status_code=400, detail="No images found in CBR file")
    
    images = [Image.open(p).convert("RGB") for p in image_paths]
    output = output_dir / "comic.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "CBR converted to PDF", "application/pdf")


# ============================================================================
# PDF Security and Intelligence
# ============================================================================

def handle_pdf_security(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Unified PDF security tool"""
    ensure_files(files, 1)
    
    action = str(payload.get("action", "protect")).strip().lower()
    
    if action == "protect":
        from .handlers import handle_protect_pdf
        return handle_protect_pdf(files, payload, output_dir)
    elif action == "unlock":
        from .handlers import handle_unlock_pdf
        return handle_unlock_pdf(files, payload, output_dir)
    else:
        raise HTTPException(status_code=400, detail="action must be 'protect' or 'unlock'")


def handle_ai_summarizer(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """AI-powered text summarizer"""
    from .handlers import read_text_input, summarize_text_algo
    
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text or PDF to summarize")
    
    summary = summarize_text_algo(content)
    
    return ExecutionResult(
        kind="json",
        message="Summary generated",
        data={"summary": summary, "original_length": len(content), "summary_length": len(summary)}
    )


def handle_pdf_viewer(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """PDF viewer/inspector"""
    ensure_files(files, 1)
    
    reader = PdfReader(str(files[0]))
    text_preview = extract_pdf_text(files[0])[:500]
    
    data = {
        "filename": files[0].name,
        "pages": len(reader.pages),
        "metadata": dict(reader.metadata or {}),
        "text_preview": text_preview,
        "file_size_bytes": files[0].stat().st_size,
    }
    
    return ExecutionResult(
        kind="json",
        message="PDF information retrieved",
        data=data
    )


def handle_pdf_intelligence(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """PDF intelligence and analytics"""
    ensure_files(files, 1)
    
    reader = PdfReader(str(files[0]))
    text = extract_pdf_text(files[0])
    
    import re
    words = re.findall(r'[A-Za-z]+', text)
    sentences = [s for s in re.split(r'(?<=[.!?])\s+', text.strip()) if s]
    
    from collections import Counter
    word_freq = Counter(w.lower() for w in words if len(w) > 3)
    top_keywords = word_freq.most_common(20)
    
    data = {
        "filename": files[0].name,
        "pages": len(reader.pages),
        "words": len(words),
        "sentences": len(sentences),
        "characters": len(text),
        "avg_words_per_page": round(len(words) / max(1, len(reader.pages)), 2),
        "top_keywords": [{"word": w, "count": c} for w, c in top_keywords],
        "metadata": dict(reader.metadata or {}),
    }
    
    return ExecutionResult(
        kind="json",
        message="PDF intelligence generated",
        data=data
    )


# ============================================================================
# Advanced PDF Operations
# ============================================================================

def handle_edit_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Unified PDF editor"""
    ensure_files(files, 1)
    
    action = str(payload.get("action", "watermark")).strip().lower()
    
    if action == "watermark":
        from .handlers import handle_watermark_pdf
        return handle_watermark_pdf(files, payload, output_dir)
    elif action == "annotate":
        return handle_annotate_pdf(files, payload, output_dir)
    elif action == "highlight":
        return handle_highlight_pdf(files, payload, output_dir)
    else:
        from .handlers import handle_watermark_pdf
        return handle_watermark_pdf(files, payload, output_dir)


def handle_annotate_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add annotations to PDF"""
    ensure_files(files, 1)
    
    annotation_text = str(payload.get("text", "Annotation")).strip()
    page_num = int(payload.get("page", 1))
    
    import fitz
    document = fitz.open(str(files[0]))
    
    if 0 < page_num <= len(document):
        page = document[page_num - 1]
        # Add text annotation
        page.add_text_annot((50, 50), annotation_text)
    
    output = output_dir / "annotated.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()
    
    return create_single_file_result(output, "PDF annotated", "application/pdf")


def handle_highlight_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Highlight text in PDF"""
    ensure_files(files, 1)
    
    keyword = str(payload.get("keyword", "")).strip()
    if not keyword:
        raise HTTPException(status_code=400, detail="Provide keyword to highlight")
    
    import fitz
    document = fitz.open(str(files[0]))
    
    for page in document:
        text_instances = page.search_for(keyword)
        for inst in text_instances:
            highlight = page.add_highlight_annot(inst)
            highlight.set_colors(stroke=(1, 1, 0))  # Yellow
            highlight.update()
    
    output = output_dir / "highlighted.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()
    
    return create_single_file_result(output, "PDF highlighted", "application/pdf")


def handle_pdf_filler(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Fill PDF form fields"""
    ensure_files(files, 1)
    
    text = str(payload.get("text", "")).strip()
    x = int(payload.get("x", 100))
    y = int(payload.get("y", 100))
    page_num = int(payload.get("page", 1))
    
    import fitz
    document = fitz.open(str(files[0]))
    
    if 0 < page_num <= len(document):
        page = document[page_num - 1]
        page.insert_text((x, y), text, fontsize=12)
    
    output = output_dir / "filled.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()
    
    return create_single_file_result(output, "PDF filled", "application/pdf")


def handle_remove_pages(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Remove pages from PDF"""
    from .handlers import handle_delete_pages
    return handle_delete_pages(files, payload, output_dir)


def handle_add_page_numbers(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add page numbers to PDF"""
    from .handlers import handle_page_numbers_pdf
    return handle_page_numbers_pdf(files, payload, output_dir)


def handle_add_watermark(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add watermark to PDF"""
    from .handlers import handle_watermark_pdf
    return handle_watermark_pdf(files, payload, output_dir)


# Export all handlers
__all__ = [
    "handle_eml_to_pdf", "handle_fb2_to_pdf", "handle_cbz_to_pdf", "handle_ebook_to_pdf",
    "handle_heic_to_pdf", "handle_heif_to_pdf", "handle_jfif_to_pdf",
    "handle_zip_to_pdf", "handle_cbr_to_pdf",
    "handle_pdf_security", "handle_ai_summarizer", "handle_pdf_viewer", "handle_pdf_intelligence",
    "handle_edit_pdf", "handle_annotate_pdf", "handle_highlight_pdf", "handle_pdf_filler",
    "handle_remove_pages", "handle_add_page_numbers", "handle_add_watermark",
]
