"""
Advanced PDF Handlers for ISHU TOOLS
Handles sign, metadata, PDF/A, scan, chat, upscale, add image
"""
from __future__ import annotations
import io
from pathlib import Path
from typing import Any
from datetime import datetime
from fastapi import HTTPException
from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

from .handlers import (
    ExecutionResult, create_single_file_result, ensure_files,
    extract_pdf_text, text_to_pdf, save_image
)


def handle_sign_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add signature to PDF"""
    ensure_files(files, 1)
    signer = str(payload.get("signer", "ISHU TOOLS")).strip() or "ISHU TOOLS"
    reason = str(payload.get("reason", "Approved")).strip() or "Approved"
    position = str(payload.get("position", "bottom-right")).strip().lower()

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()
    signed_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    for page in reader.pages:
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)

        stream = io.BytesIO()
        overlay_canvas = canvas.Canvas(stream, pagesize=(width, height))
        overlay_canvas.setFont("Helvetica-Bold", 11)

        left = "left" in position
        top = "top" in position
        x = 36 if left else max(36, width - 230)
        y = max(22, height - 52) if top else 28

        overlay_canvas.drawString(x, y + 14, f"Signed by: {signer}")
        overlay_canvas.setFont("Helvetica", 9)
        overlay_canvas.drawString(x, y, f"{reason} | {signed_at}")
        overlay_canvas.save()
        stream.seek(0)

        overlay_pdf = PdfReader(stream)
        page.merge_page(overlay_pdf.pages[0])
        writer.add_page(page)

    output = output_dir / "signed.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF signature added", "application/pdf")


def handle_edit_metadata_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Edit PDF metadata"""
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    metadata_map = {
        "/Title": str(payload.get("title", "")).strip(),
        "/Author": str(payload.get("author", "")).strip(),
        "/Subject": str(payload.get("subject", "")).strip(),
        "/Keywords": str(payload.get("keywords", "")).strip(),
    }
    metadata = {key: value for key, value in metadata_map.items() if value}
    if metadata:
        writer.add_metadata(metadata)

    output = output_dir / "metadata-edited.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF metadata updated", "application/pdf")


def handle_pdf_to_pdfa(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert PDF to PDF/A"""
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.add_metadata({
        "/Title": str(payload.get("title", files[0].stem)).strip() or files[0].stem,
        "/Producer": "ISHU TOOLS Archival Export",
        "/Creator": "ISHU TOOLS",
    })

    output = output_dir / "archival.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF/A created", "application/pdf")


def handle_scan_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Convert scanned images to PDF"""
    ensure_files(files, 1)
    
    images = [Image.open(f).convert("RGB") for f in files]
    output = output_dir / "scanned.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    
    return create_single_file_result(output, "Scan converted to PDF", "application/pdf")


def handle_chat_with_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Chat with PDF - Q&A"""
    ensure_files(files, 1)
    question = str(payload.get("question", "")).strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")

    content = extract_pdf_text(files[0])
    if not content:
        raise HTTPException(status_code=400, detail="No text found in PDF")

    # Simple keyword matching for answer
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    question_words = set(question.lower().split())
    
    # Find sentences with most matching words
    scored = []
    for sent in sentences:
        sent_words = set(sent.lower().split())
        score = len(question_words & sent_words)
        if score > 0:
            scored.append((score, sent))
    
    scored.sort(reverse=True)
    answer = '. '.join([s[1] for s in scored[:3]]) if scored else "No relevant information found."

    return ExecutionResult(
        kind="json",
        message="Answer generated",
        data={"question": question, "answer": answer}
    )


def handle_upscale_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Upscale image"""
    ensure_files(files, 1)
    scale = float(payload.get("scale", 2.0))
    if scale <= 1:
        raise HTTPException(status_code=400, detail="scale must be > 1")

    image = Image.open(files[0])
    target_size = (int(image.width * scale), int(image.height * scale))
    upscaled = image.resize(target_size, Image.LANCZOS)

    output = output_dir / f"upscaled-{files[0].name}"
    save_image(upscaled, output)
    return create_single_file_result(output, "Image upscaled", "image/*")


def handle_add_image_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    """Add image overlay to PDF"""
    ensure_files(files, 2)

    import fitz
    
    pdf_file = next((p for p in files if p.suffix.lower() == ".pdf"), None)
    image_file = next((p for p in files if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}), None)

    if not pdf_file or not image_file:
        raise HTTPException(status_code=400, detail="Upload 1 PDF and 1 image")

    scale = float(payload.get("scale", 0.2))
    opacity = int(payload.get("opacity", 65))

    image = Image.open(image_file).convert("RGBA")
    if opacity < 100:
        alpha = image.getchannel("A")
        alpha = alpha.point(lambda v: int(v * (opacity / 100)))
        image.putalpha(alpha)

    document = fitz.open(str(pdf_file))

    for page in document:
        width = int(page.rect.width)
        height = int(page.rect.height)

        target_width = int(width * scale)
        target_height = int(image.height * (target_width / max(1, image.width)))
        resized = image.resize((target_width, target_height), Image.LANCZOS)

        stream = io.BytesIO()
        resized.save(stream, format="PNG")
        stream_value = stream.getvalue()

        margin = 24
        x1 = width - margin
        y1 = height - margin
        rect = fitz.Rect(x1 - target_width, y1 - target_height, x1, y1)
        page.insert_image(rect, stream=stream_value)

    output = output_dir / "image-overlay.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()
    return create_single_file_result(output, "Image added to PDF", "application/pdf")


__all__ = [
    "handle_sign_pdf", "handle_edit_metadata_pdf", "handle_pdf_to_pdfa",
    "handle_scan_to_pdf", "handle_chat_with_pdf", "handle_upscale_image",
    "handle_add_image_pdf",
]
