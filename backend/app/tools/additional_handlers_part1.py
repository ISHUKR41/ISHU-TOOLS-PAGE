# Additional handlers - Part 1: Office & Document Conversions
from __future__ import annotations
import io
from pathlib import Path
from typing import Any
from fastapi import HTTPException
from PIL import Image
from pypdf import PdfReader, PdfWriter
from docx import Document
from openpyxl import Workbook
from pptx import Presentation
from pptx.util import Inches

from .handlers import (
    ExecutionResult, create_single_file_result, ensure_files,
    extract_pdf_text, text_to_pdf, extract_docx_text, build_docx_from_text,
    extract_epub_text, build_epub_from_text, extract_odt_text, build_odt_from_text,
    extract_rtf_text, build_rtf_from_text, extract_ocr_text_from_pdf,
    extract_ocr_text_from_image, open_image_file, save_image,
    render_pdf_pages_to_pil_images, build_tiff_from_images,
    detect_faces_in_image, get_resampling_module
)


def handle_pdf_to_word(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pdf_to_docx(files, payload, output_dir)


def handle_word_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_docx_to_pdf(files, payload, output_dir)


def handle_pdf_to_powerpoint(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pdf_to_pptx(files, payload, output_dir)


def handle_powerpoint_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pptx_to_pdf(files, payload, output_dir)
