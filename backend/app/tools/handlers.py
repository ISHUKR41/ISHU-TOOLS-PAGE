from __future__ import annotations

import csv
import difflib
import html
import io
import json
import math
import re
import shutil
import textwrap
import uuid
import zipfile
from collections import Counter
from dataclasses import dataclass
from datetime import datetime
from email import policy
from email.parser import BytesParser
from pathlib import Path
from typing import Any, Callable

import fitz
import httpx
import qrcode
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
from docx import Document
from fastapi import HTTPException, UploadFile
from openpyxl import Workbook, load_workbook
from PIL import Image, ImageColor, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps
from pptx import Presentation
from pptx.util import Inches
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from ..config import JOBS_DIR, MAX_UPLOAD_MB


@dataclass
class ExecutionResult:
    kind: str
    message: str
    output_path: Path | None = None
    filename: str | None = None
    data: dict[str, Any] | None = None
    content_type: str | None = None


ToolHandler = Callable[[list[Path], dict[str, Any], Path], ExecutionResult]


STOPWORDS = {
    "the",
    "is",
    "a",
    "an",
    "of",
    "to",
    "in",
    "and",
    "or",
    "on",
    "for",
    "with",
    "this",
    "that",
    "it",
    "as",
    "by",
    "at",
    "from",
    "be",
    "are",
    "was",
    "were",
    "will",
    "can",
    "your",
    "you",
    "we",
    "our",
}


MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024


def create_job_workspace() -> tuple[str, Path, Path]:
    job_id = uuid.uuid4().hex
    job_dir = JOBS_DIR / job_id
    input_dir = job_dir / "input"
    output_dir = job_dir / "output"
    input_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)
    return job_id, input_dir, output_dir


def save_uploads(files: list[UploadFile], input_dir: Path) -> list[Path]:
    saved_paths: list[Path] = []
    for index, upload in enumerate(files):
        filename = upload.filename or f"file-{index}"
        safe_name = f"{index + 1}_{Path(filename).name}"
        destination = input_dir / safe_name
        with destination.open("wb") as f:
            written = 0
            while True:
                chunk = upload.file.read(1024 * 1024)
                if not chunk:
                    break
                written += len(chunk)
                if written > MAX_UPLOAD_BYTES:
                    raise HTTPException(
                        status_code=413,
                        detail=f"{filename} exceeds max upload size of {MAX_UPLOAD_MB} MB",
                    )
                f.write(chunk)
        saved_paths.append(destination)
    return saved_paths


def parse_payload(payload_str: str | None) -> dict[str, Any]:
    if not payload_str:
        return {}
    try:
        return json.loads(payload_str)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid payload JSON") from exc


def ensure_files(files: list[Path], min_count: int = 1) -> None:
    if len(files) < min_count:
        raise HTTPException(status_code=400, detail=f"This tool requires at least {min_count} file(s)")


def parse_page_numbers(raw: str, total_pages: int) -> list[int]:
    cleaned = raw.strip().lower()
    if not cleaned or cleaned == "all":
        return list(range(1, total_pages + 1))

    pages: list[int] = []
    for token in cleaned.split(","):
        part = token.strip()
        if not part:
            continue
        if "-" in part:
            start_raw, end_raw = part.split("-", 1)
            if start_raw.strip().isdigit() and end_raw.strip().isdigit():
                start = int(start_raw)
                end = int(end_raw)
                if start <= end:
                    pages.extend(range(start, end + 1))
        elif part.isdigit():
            pages.append(int(part))

    ordered_unique: list[int] = []
    seen: set[int] = set()
    for page_no in pages:
        if 1 <= page_no <= total_pages and page_no not in seen:
            ordered_unique.append(page_no)
            seen.add(page_no)

    return ordered_unique


def zip_outputs(paths: list[Path], output_dir: Path, zip_name: str) -> Path:
    archive_base = output_dir / zip_name
    zip_file = shutil.make_archive(str(archive_base), "zip", root_dir=output_dir, base_dir=".")
    return Path(zip_file)


def create_single_file_result(path: Path, message: str, content_type: str = "application/octet-stream") -> ExecutionResult:
    return ExecutionResult(
        kind="file",
        message=message,
        output_path=path,
        filename=path.name,
        content_type=content_type,
    )


def create_zip_result(output_dir: Path, message: str, zip_name: str = "result") -> ExecutionResult:
    zip_file = zip_outputs(list(output_dir.iterdir()), output_dir, zip_name)
    return ExecutionResult(
        kind="file",
        message=message,
        output_path=zip_file,
        filename=zip_file.name,
        content_type="application/zip",
    )


def extract_pdf_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    text_parts: list[str] = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts).strip()


def text_to_pdf(text: str, output_path: Path, title: str = "Generated Document") -> None:
    pdf = canvas.Canvas(str(output_path), pagesize=A4)
    pdf.setTitle(title)
    width, height = A4
    margin = 40
    y = height - margin

    for raw_line in text.splitlines() or [text]:
        wrapped = textwrap.wrap(raw_line, width=100) or [""]
        for line in wrapped:
            if y <= margin:
                pdf.showPage()
                y = height - margin
            pdf.drawString(margin, y, line)
            y -= 14

    pdf.save()


def chunk_text(text: str, max_chars: int = 4000) -> list[str]:
    cleaned = text.strip()
    if not cleaned:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(cleaned):
        end = min(start + max_chars, len(cleaned))
        chunks.append(cleaned[start:end])
        start = end
    return chunks


def summarize_text_algo(text: str, max_sentences: int = 5) -> str:
    if not text.strip():
        return ""

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    if len(sentences) <= max_sentences:
        return " ".join(sentences)

    words = re.findall(r"[A-Za-z']+", text.lower())
    frequencies: dict[str, int] = {}
    for word in words:
        if word not in STOPWORDS and len(word) > 2:
            frequencies[word] = frequencies.get(word, 0) + 1

    scored: list[tuple[int, str]] = []
    for idx, sentence in enumerate(sentences):
        sentence_words = re.findall(r"[A-Za-z']+", sentence.lower())
        score = sum(frequencies.get(word, 0) for word in sentence_words)
        scored.append((score * 1000 - idx, sentence))

    top = sorted(scored, reverse=True)[:max_sentences]
    selected = {item[1] for item in top}
    ordered = [sentence for sentence in sentences if sentence in selected]
    return " ".join(ordered)


def translate_text_chunks(text: str, target_lang: str) -> str:
    if not text.strip():
        return ""
    translator = GoogleTranslator(source="auto", target=target_lang)
    translated_parts: list[str] = []
    for chunk in chunk_text(text, max_chars=3500):
        translated_parts.append(translator.translate(chunk))
    return "\n".join(translated_parts)


def read_text_input(files: list[Path], payload: dict[str, Any]) -> str:
    text = str(payload.get("text", "")).strip()
    if text:
        return text

    if files:
        source = files[0]
        suffix = source.suffix.lower()
        if suffix == ".pdf":
            return extract_pdf_text(source)
        if suffix in {".txt", ".md", ".csv", ".log", ".json", ".xml", ".yml", ".yaml", ".rtf"}:
            return source.read_text(encoding="utf-8", errors="ignore")

    return ""


def extract_docx_text(docx_path: Path) -> str:
    document = Document(str(docx_path))
    lines: list[str] = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text:
            lines.append(text)

    for table in document.tables:
        for row in table.rows:
            values = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if values:
                lines.append(" | ".join(values))

    return "\n".join(lines).strip()


def build_docx_from_text(text: str, output_path: Path, heading: str) -> None:
    document = Document()
    document.add_heading(heading, level=1)

    paragraphs = [line.strip() for line in text.splitlines() if line.strip()]
    if not paragraphs:
        paragraphs = ["No textual content was found in the source file."]

    for paragraph in paragraphs:
        document.add_paragraph(paragraph)

    document.save(str(output_path))


def top_matching_sentences(text: str, question: str, limit: int = 3) -> list[str]:
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    if not sentences:
        return []

    keywords = [word for word in re.findall(r"[A-Za-z']+", question.lower()) if len(word) > 2]
    if not keywords:
        return sentences[:limit]

    scored: list[tuple[int, str]] = []
    for index, sentence in enumerate(sentences):
        lowered = sentence.lower()
        score = sum(lowered.count(keyword) for keyword in keywords)
        scored.append((score * 1000 - index, sentence))

    best = [item[1] for item in sorted(scored, reverse=True) if item[0] > 0][:limit]
    if not best:
        return sentences[:limit]
    return best


def open_image(path: Path) -> Image.Image:
    return Image.open(path)


def save_image(img: Image.Image, output_path: Path, fmt: str | None = None, quality: int | None = None) -> None:
    kwargs: dict[str, Any] = {}
    if quality:
        kwargs["quality"] = quality
        kwargs["optimize"] = True

    normalized_format = None
    if fmt:
        format_upper = fmt.upper()
        normalized_format = {"JPG": "JPEG", "TIF": "TIFF"}.get(format_upper, format_upper)

    img.save(output_path, format=normalized_format, **kwargs)


def render_pdf_pages_to_pil_images(pdf_path: Path, scale: float = 2.0) -> list[Image.Image]:
    document = fitz.open(str(pdf_path))
    images: list[Image.Image] = []

    try:
        matrix = fitz.Matrix(scale, scale)
        for page in document:
            pix = page.get_pixmap(matrix=matrix)
            image = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            images.append(image)
    finally:
        document.close()

    return images


def build_tiff_from_images(images: list[Image.Image], output_path: Path) -> None:
    if not images:
        raise HTTPException(status_code=400, detail="No pages were rendered for TIFF export")

    prepared = [img.convert("RGB") for img in images]
    prepared[0].save(output_path, save_all=True, append_images=prepared[1:], compression="tiff_deflate")


def basic_rtf_escape(text: str) -> str:
    escaped = text.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")
    return escaped.replace("\n", "\\par\n")


def build_rtf_from_text(text: str, output_path: Path) -> None:
    content = text.strip() or "No textual content was found in the source file."
    rtf_body = basic_rtf_escape(content)
    output_path.write_text("{\\rtf1\\ansi\\deff0\n" + rtf_body + "\n}", encoding="utf-8")


def decode_rtf_hex_escapes(content: str) -> str:
    def repl(match: re.Match[str]) -> str:
        try:
            return bytes.fromhex(match.group(1)).decode("cp1252", errors="ignore")
        except ValueError:
            return ""

    return re.sub(r"\\'([0-9a-fA-F]{2})", repl, content)


def extract_rtf_text(rtf_path: Path) -> str:
    raw = rtf_path.read_text(encoding="utf-8", errors="ignore")
    raw = decode_rtf_hex_escapes(raw)
    raw = re.sub(r"\\par[d]? ?", "\n", raw)
    raw = re.sub(r"\\tab ?", "\t", raw)
    raw = re.sub(r"\\[a-zA-Z]+-?\d* ?", "", raw)
    raw = raw.replace("{", "").replace("}", "")
    lines = [line.strip() for line in raw.splitlines()]
    return "\n".join(line for line in lines if line).strip()


def build_odt_from_text(text: str, output_path: Path, title: str) -> None:
    from odf import teletype
    from odf.opendocument import OpenDocumentText
    from odf.text import H, P

    document = OpenDocumentText()
    document.text.addElement(H(outlinelevel=1, text=title))

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        lines = ["No textual content was found in the source file."]

    for line in lines:
        paragraph = P()
        teletype.addTextToElement(paragraph, line)
        document.text.addElement(paragraph)

    document.save(str(output_path), addsuffix=False)


def extract_odt_text(odt_path: Path) -> str:
    from odf import teletype
    from odf.opendocument import load
    from odf.text import H, P

    document = load(str(odt_path))
    lines: list[str] = []
    for element in list(document.getElementsByType(H)) + list(document.getElementsByType(P)):
        text = teletype.extractText(element).strip()
        if text:
            lines.append(text)
    return "\n".join(lines).strip()


def build_epub_from_text(text: str, output_path: Path, title: str) -> None:
    from ebooklib import epub

    book = epub.EpubBook()
    book.set_identifier(uuid.uuid4().hex)
    book.set_title(title)
    book.set_language("en")

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        lines = ["No textual content was found in the source file."]

    chapter_html = "".join(f"<p>{html.escape(line)}</p>" for line in lines)
    chapter = epub.EpubHtml(title=title, file_name="chapter-1.xhtml", lang="en")
    chapter.content = f"<html><body><h1>{html.escape(title)}</h1>{chapter_html}</body></html>"

    book.add_item(chapter)
    book.toc = (chapter,)
    book.spine = ["nav", chapter]
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    epub.write_epub(str(output_path), book)


def extract_epub_text(epub_path: Path) -> str:
    from ebooklib import ITEM_DOCUMENT, epub

    book = epub.read_epub(str(epub_path))
    chunks: list[str] = []
    for item in book.get_items():
        if item.get_type() != ITEM_DOCUMENT:
            continue
        soup = BeautifulSoup(item.get_body_content(), "html.parser")
        text = soup.get_text("\n", strip=True)
        if text:
            chunks.append(text)
    return "\n\n".join(chunks).strip()


def get_ocr_engine():
    from rapidocr_onnxruntime import RapidOCR

    if not hasattr(get_ocr_engine, "_engine"):
        get_ocr_engine._engine = RapidOCR()
    return get_ocr_engine._engine


def extract_ocr_lines_from_image(image_path: Path) -> list[str]:
    engine = get_ocr_engine()
    result, _ = engine(str(image_path))
    if not result:
        return []
    return [str(item[1]).strip() for item in result if len(item) > 1 and str(item[1]).strip()]


def extract_ocr_text_from_image(image_path: Path) -> str:
    return "\n".join(extract_ocr_lines_from_image(image_path)).strip()


def extract_ocr_text_from_pdf(pdf_path: Path, temp_dir: Path) -> str:
    document = fitz.open(str(pdf_path))
    pages_text: list[str] = []

    try:
        for index, page in enumerate(document, start=1):
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            page_image = temp_dir / f"ocr-page-{index}.png"
            pix.save(str(page_image))
            page_text = extract_ocr_text_from_image(page_image)
            if page_text:
                pages_text.append(f"Page {index}\n{page_text}")
    finally:
        document.close()

    return "\n\n".join(pages_text).strip()


def detect_faces_in_image(image_path: Path) -> tuple[Any, Any]:
    import cv2

    classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    image = cv2.imread(str(image_path))
    if image is None:
        raise HTTPException(status_code=400, detail="Unable to open image for face detection")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(36, 36))
    return image, faces


def get_resampling_module() -> Any:
    return getattr(Image, "Resampling", Image)


def register_heif_support() -> None:
    try:
        from pillow_heif import register_heif_opener

        register_heif_opener()
    except Exception:
        pass


def open_image_file(image_path: Path, mode: str | None = None) -> Image.Image:
    if image_path.suffix.lower() in {".heic", ".heif"}:
        register_heif_support()
    image = ImageOps.exif_transpose(Image.open(image_path))
    return image.convert(mode) if mode else image


def load_ui_font(size: int) -> Any:
    normalized_size = max(12, int(size))
    candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/calibri.ttf"),
        Path("C:/Windows/Fonts/verdana.ttf"),
        Path("C:/Windows/Fonts/tahoma.ttf"),
        Path("C:/Windows/Fonts/DejaVuSans.ttf"),
    ]

    for candidate in candidates:
        if candidate.exists():
            try:
                return ImageFont.truetype(str(candidate), normalized_size)
            except OSError:
                continue

    for candidate_name in ("arial.ttf", "segoeui.ttf", "calibri.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(candidate_name, normalized_size)
        except OSError:
            continue

    return ImageFont.load_default()


def parse_color_value(raw: Any, default: tuple[int, int, int]) -> tuple[int, int, int]:
    try:
        return ImageColor.getrgb(str(raw).strip())
    except Exception:
        return default


def clamp_percentage(raw: Any, default: float) -> float:
    try:
        value = float(raw)
    except (TypeError, ValueError):
        value = default
    return max(0.0, min(100.0, value))


def resolve_anchor_position(
    position: str,
    base_size: tuple[int, int],
    overlay_size: tuple[int, int],
    margin: int = 24,
) -> tuple[int, int]:
    base_width, base_height = base_size
    overlay_width, overlay_height = overlay_size
    normalized = position.strip().lower()

    if normalized == "top-left":
        return margin, margin
    if normalized == "top-right":
        return max(0, base_width - overlay_width - margin), margin
    if normalized == "bottom-left":
        return margin, max(0, base_height - overlay_height - margin)
    if normalized == "center":
        return max(0, (base_width - overlay_width) // 2), max(0, (base_height - overlay_height) // 2)
    return max(0, base_width - overlay_width - margin), max(0, base_height - overlay_height - margin)


def save_images_as_pdf(images: list[Image.Image], output_path: Path) -> None:
    if not images:
        raise HTTPException(status_code=400, detail="No images were available to build a PDF")

    prepared = [image.convert("RGB") for image in images]
    prepared[0].save(output_path, save_all=True, append_images=prepared[1:])


def image_paths_to_pdf(paths: list[Path], output_path: Path) -> None:
    save_images_as_pdf([open_image_file(path, "RGB") for path in paths], output_path)


def color_to_pdf_tuple(raw: Any, default: tuple[int, int, int] = (255, 234, 88)) -> tuple[float, float, float]:
    rgb = parse_color_value(raw, default)
    return tuple(round(channel / 255, 4) for channel in rgb)


def extract_top_keywords(text: str, limit: int = 8) -> list[dict[str, Any]]:
    words = [word for word in re.findall(r"[A-Za-z']+", text.lower()) if word not in STOPWORDS and len(word) > 2]
    return [
        {"keyword": word, "count": count}
        for word, count in Counter(words).most_common(max(1, limit))
    ]


def extract_image_dpi_info(source: Path) -> dict[str, Any]:
    image = open_image_file(source)
    raw_dpi = image.info.get("dpi")
    if isinstance(raw_dpi, tuple) and len(raw_dpi) >= 2:
        dpi_x, dpi_y = raw_dpi[0], raw_dpi[1]
    elif isinstance(raw_dpi, (int, float)):
        dpi_x = dpi_y = raw_dpi
    else:
        dpi_x = dpi_y = 72

    return {
        "format": image.format,
        "size": {"width": image.width, "height": image.height},
        "dpi": {"x": round(float(dpi_x), 2), "y": round(float(dpi_y), 2)},
    }


def resize_image_to_physical_units(
    source: Path,
    output_path: Path,
    width_value: float,
    height_value: float,
    dpi: int,
    unit: str,
) -> None:
    unit_to_inches = {
        "cm": 1 / 2.54,
        "mm": 1 / 25.4,
        "inch": 1.0,
    }
    factor = unit_to_inches[unit]
    width_px = max(1, int(round(width_value * factor * dpi)))
    height_px = max(1, int(round(height_value * factor * dpi)))
    image = open_image_file(source)
    resized = image.resize((width_px, height_px), get_resampling_module().LANCZOS)
    save_image(resized, output_path, quality=95)


def dispatch_existing_handler(
    slug: str,
    files: list[Path],
    payload: dict[str, Any],
    output_dir: Path,
) -> ExecutionResult:
    handler = HANDLERS.get(slug)
    if not handler:
        raise HTTPException(status_code=501, detail=f"Handler not found for {slug}")
    return handler(files, payload, output_dir)


def handle_merge_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)
    writer = PdfWriter()
    for file_path in files:
        reader = PdfReader(str(file_path))
        for page in reader.pages:
            writer.add_page(page)

    output = output_dir / "merged.pdf"
    with output.open("wb") as f:
        writer.write(f)
    return create_single_file_result(output, "PDF files merged successfully", "application/pdf")


def handle_split_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))

    requested = str(payload.get("pages", "all"))
    pages = parse_page_numbers(requested, len(reader.pages))
    if not pages:
        raise HTTPException(status_code=400, detail="Provide valid pages like '1,2,5' or ranges like '2-4'")

    for page_no in pages:
        if page_no < 1 or page_no > len(reader.pages):
            continue
        writer = PdfWriter()
        writer.add_page(reader.pages[page_no - 1])
        part = output_dir / f"page-{page_no}.pdf"
        with part.open("wb") as f:
            writer.write(f)

    return create_zip_result(output_dir, "PDF split completed", "split-pages")


def handle_compress_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image_quality = max(20, min(95, int(payload.get("image_quality", 75))))
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    for page in writer.pages:
        try:
            page.compress_content_streams()
        except Exception:
            pass

    if reader.metadata:
        writer.add_metadata(reader.metadata)

    output = output_dir / "compressed.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF compressed successfully", "application/pdf")


def handle_rotate_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    angle = int(payload.get("angle", 90))
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        page.rotate(angle)
        writer.add_page(page)

    output = output_dir / "rotated.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF rotation completed", "application/pdf")


def handle_organize_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    raw_order = str(payload.get("page_order", "")).strip()
    if not raw_order:
        raise HTTPException(status_code=400, detail="page_order is required, e.g. 3,1,2")

    order = [int(p.strip()) for p in raw_order.split(",") if p.strip().isdigit()]
    if not order:
        raise HTTPException(status_code=400, detail="No valid page numbers in page_order")

    writer = PdfWriter()
    total = len(reader.pages)
    for page_no in order:
        if 1 <= page_no <= total:
            writer.add_page(reader.pages[page_no - 1])

    output = output_dir / "organized.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF pages reorganized", "application/pdf")


def handle_crop_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    left = float(payload.get("left", 0))
    right = float(payload.get("right", 0))
    top = float(payload.get("top", 0))
    bottom = float(payload.get("bottom", 0))

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        box = page.mediabox
        x0 = float(box.left) + left
        y0 = float(box.bottom) + bottom
        x1 = float(box.right) - right
        y1 = float(box.top) - top
        page.mediabox.lower_left = (x0, y0)
        page.mediabox.upper_right = (x1, y1)
        writer.add_page(page)

    output = output_dir / "cropped.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF cropped successfully", "application/pdf")


def _merge_overlay_to_pdf(
    files: list[Path],
    output_dir: Path,
    text_value: str,
    mode: str,
    font_size: int,
) -> Path:
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for idx, page in enumerate(reader.pages, start=1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)

        stream = io.BytesIO()
        overlay_canvas = canvas.Canvas(stream, pagesize=(width, height))
        overlay_canvas.setFont("Helvetica", font_size)

        if mode == "numbers":
            draw_text = str(idx)
            overlay_canvas.drawCentredString(width / 2, 24, draw_text)
        else:
            overlay_canvas.drawString(36, 24, text_value)

        overlay_canvas.save()
        stream.seek(0)

        overlay_pdf = PdfReader(stream)
        page.merge_page(overlay_pdf.pages[0])
        writer.add_page(page)

    output = output_dir / ("numbered.pdf" if mode == "numbers" else "watermarked.pdf")
    with output.open("wb") as f:
        writer.write(f)
    return output


def handle_watermark_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    watermark = str(payload.get("text", "ISHU TOOLS")).strip() or "ISHU TOOLS"
    font_size = int(payload.get("font_size", 18))
    output = _merge_overlay_to_pdf(files, output_dir, watermark, "watermark", font_size)
    return create_single_file_result(output, "Watermark applied", "application/pdf")


def handle_page_numbers_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    font_size = int(payload.get("font_size", 12))
    output = _merge_overlay_to_pdf(files, output_dir, "", "numbers", font_size)
    return create_single_file_result(output, "Page numbers added", "application/pdf")


def handle_protect_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    password = str(payload.get("password", "")).strip()
    if not password:
        raise HTTPException(status_code=400, detail="password is required")

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password)
    output = output_dir / "protected.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF protected", "application/pdf")


def handle_unlock_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    password = str(payload.get("password", "")).strip()

    reader = PdfReader(str(files[0]))
    if reader.is_encrypted:
        if not password:
            raise HTTPException(status_code=400, detail="password is required for encrypted PDF")
        reader.decrypt(password)

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    output = output_dir / "unlocked.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF unlocked", "application/pdf")


def handle_redact_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    keywords_raw = str(payload.get("keywords", "")).strip()
    keywords = [k.strip() for k in keywords_raw.split(",") if k.strip()]
    if not keywords:
        raise HTTPException(status_code=400, detail="keywords is required, e.g. secret,phone")

    document = fitz.open(str(files[0]))
    for page in document:
        for keyword in keywords:
            found = page.search_for(keyword)
            for area in found:
                page.add_redact_annot(area, fill=(0, 0, 0))
        page.apply_redactions()

    output = output_dir / "redacted.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()

    return create_single_file_result(output, "PDF redaction complete", "application/pdf")


def handle_compare_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)

    first = extract_pdf_text(files[0]).splitlines()
    second = extract_pdf_text(files[1]).splitlines()

    diff = difflib.unified_diff(first, second, fromfile=files[0].name, tofile=files[1].name, lineterm="")
    output = output_dir / "comparison.diff.txt"
    output.write_text("\n".join(diff), encoding="utf-8")

    return create_single_file_result(output, "PDF comparison generated", "text/plain")


def handle_extract_text_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    output = output_dir / "extracted.txt"
    output.write_text(extract_pdf_text(files[0]), encoding="utf-8")
    return create_single_file_result(output, "Text extracted", "text/plain")


def handle_extract_images_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    document = fitz.open(str(files[0]))
    count = 0

    for page_index in range(len(document)):
        page = document[page_index]
        for image_index, image in enumerate(page.get_images(full=True), start=1):
            xref = image[0]
            base = document.extract_image(xref)
            image_bytes = base["image"]
            ext = base.get("ext", "png")
            output_file = output_dir / f"page-{page_index + 1}-img-{image_index}.{ext}"
            output_file.write_bytes(image_bytes)
            count += 1

    document.close()

    if count == 0:
        raise HTTPException(status_code=400, detail="No embedded images found in the PDF")

    return create_zip_result(output_dir, "Images extracted from PDF", "pdf-images")


_FITZ_NATIVE_FORMATS = {"png", "jpg", "jpeg", "pnm", "pgm", "ppm", "pbm", "pam", "psd", "ps"}


def _pdf_to_image(files: list[Path], output_dir: Path, ext: str) -> ExecutionResult:
    document = fitz.open(str(files[0]))
    use_pillow = ext.lower() not in _FITZ_NATIVE_FORMATS

    for index, page in enumerate(document, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        output = output_dir / f"page-{index}.{ext}"
        if use_pillow:
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            img.save(str(output))
        else:
            pix.save(str(output))

    document.close()
    return create_zip_result(output_dir, f"PDF converted to {ext.upper()}", f"pdf-to-{ext}")


def handle_pdf_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    return _pdf_to_image(files, output_dir, "jpg")


def handle_pdf_to_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    return _pdf_to_image(files, output_dir, "png")


def handle_jpg_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    output = output_dir / "images.pdf"
    image_paths_to_pdf(files, output)
    return create_single_file_result(output, "Images converted to PDF", "application/pdf")


def handle_image_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_jpg_to_pdf(files, payload, output_dir)


def handle_repair_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]), strict=False)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    output = output_dir / "repaired.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF repair attempt completed", "application/pdf")


def handle_translate_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target = str(payload.get("target_lang", "en")).strip() or "en"
    content = extract_pdf_text(files[0])
    translated = translate_text_chunks(content, target)

    output = output_dir / "translated.pdf"
    text_to_pdf(translated, output, title="Translated PDF")
    return create_single_file_result(output, "PDF translated", "application/pdf")


def handle_summarize_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    summary = summarize_text_algo(content)

    output = output_dir / "summary.txt"
    output.write_text(summary, encoding="utf-8")
    return create_single_file_result(output, "PDF summary generated", "text/plain")


def handle_compress_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    quality = int(payload.get("quality", 70))

    for file_path in files:
        img = Image.open(file_path)
        ext = file_path.suffix.lower().replace(".", "")
        target_ext = "jpg" if ext in {"jpeg", "jpg"} else ext
        output = output_dir / f"compressed-{file_path.stem}.{target_ext}"
        save_image(img.convert("RGB") if target_ext == "jpg" else img, output, fmt=target_ext.upper(), quality=quality)

    if len(files) == 1:
        only_file = next(output_dir.iterdir())
        return create_single_file_result(only_file, "Image compressed", "image/*")

    return create_zip_result(output_dir, "Images compressed", "compressed-images")


def handle_resize_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    width = int(payload.get("width", 1200))
    height = int(payload.get("height", 800))

    source = Image.open(files[0])
    resized = source.resize((width, height))
    output = output_dir / f"resized-{files[0].name}"
    save_image(resized, output)
    return create_single_file_result(output, "Image resized", "image/*")


def handle_crop_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = Image.open(files[0])
    x = int(payload.get("x", 0))
    y = int(payload.get("y", 0))
    w = int(payload.get("width", max(1, source.width - x)))
    h = int(payload.get("height", max(1, source.height - y)))

    cropped = source.crop((x, y, x + w, y + h))
    output = output_dir / f"cropped-{files[0].name}"
    save_image(cropped, output)
    return create_single_file_result(output, "Image cropped", "image/*")


def handle_rotate_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    angle = float(payload.get("angle", 90))

    source = Image.open(files[0])
    rotated = source.rotate(-angle, expand=True)
    output = output_dir / f"rotated-{files[0].name}"
    save_image(rotated, output)
    return create_single_file_result(output, "Image rotated", "image/*")


def handle_convert_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target_format = str(payload.get("target_format", "png")).lower().strip()
    if target_format not in {"png", "jpg", "jpeg", "webp", "gif", "bmp"}:
        raise HTTPException(status_code=400, detail="target_format must be one of png,jpg,webp,gif,bmp")

    img = Image.open(files[0])
    converted = img.convert("RGB") if target_format in {"jpg", "jpeg"} else img
    output = output_dir / f"converted.{ 'jpg' if target_format == 'jpeg' else target_format }"
    save_image(converted, output, fmt=target_format.upper())
    return create_single_file_result(output, "Image converted", "image/*")


def handle_watermark_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = str(payload.get("text", "ISHU TOOLS")).strip() or "ISHU TOOLS"

    image = Image.open(files[0]).convert("RGBA")
    layer = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)
    font = ImageFont.load_default()

    x = int(payload.get("x", 20))
    y = int(payload.get("y", image.height - 30))
    draw.text((x, y), text, fill=(255, 255, 255, 160), font=font)

    output_img = Image.alpha_composite(image, layer).convert("RGB")
    output = output_dir / f"watermarked-{files[0].stem}.jpg"
    output_img.save(output, quality=92)
    return create_single_file_result(output, "Watermark added", "image/jpeg")


def handle_grayscale_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image = Image.open(files[0]).convert("L")
    output = output_dir / f"grayscale-{files[0].name}"
    image.save(output)
    return create_single_file_result(output, "Grayscale applied", "image/*")


def handle_blur_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    radius = float(payload.get("radius", 4))

    image = Image.open(files[0])
    blurred = image.filter(ImageFilter.GaussianBlur(radius=radius))
    output = output_dir / f"blur-{files[0].name}"
    blurred.save(output)
    return create_single_file_result(output, "Blur effect applied", "image/*")


def handle_pixelate_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    factor = int(payload.get("factor", 12))
    factor = max(2, factor)

    source = Image.open(files[0])
    small = source.resize((max(1, source.width // factor), max(1, source.height // factor)), Image.NEAREST)
    pixelated = small.resize(source.size, Image.NEAREST)

    output = output_dir / f"pixelate-{files[0].name}"
    pixelated.save(output)
    return create_single_file_result(output, "Pixelate effect applied", "image/*")


def handle_meme_generator(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    top_text = str(payload.get("top_text", "TOP TEXT")).strip()
    bottom_text = str(payload.get("bottom_text", "BOTTOM TEXT")).strip()

    image = Image.open(files[0]).convert("RGB")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    if top_text:
        draw.text((20, 20), top_text, fill="white", font=font)
    if bottom_text:
        draw.text((20, image.height - 40), bottom_text, fill="white", font=font)

    output = output_dir / "meme.jpg"
    image.save(output, quality=92)
    return create_single_file_result(output, "Meme generated", "image/jpeg")


def handle_pdf_to_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    return _pdf_to_image(files, output_dir, "png")


def handle_html_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    url = str(payload.get("url", "")).strip()
    html_content = str(payload.get("html", "")).strip()

    if url:
        try:
            with httpx.Client(timeout=20, follow_redirects=True, verify=False) as client:
                response = client.get(url)
                response.raise_for_status()
                html_content = response.text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")

    if not html_content:
        raise HTTPException(status_code=400, detail="Provide either url or html in payload")

    text = BeautifulSoup(html_content, "html.parser").get_text("\n", strip=True)
    output = output_dir / "html-to-pdf.pdf"
    text_to_pdf(text, output, title="HTML to PDF")
    return create_single_file_result(output, "HTML converted to PDF", "application/pdf")


def handle_md_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = read_text_input(files, payload)
    if not text:
        raise HTTPException(status_code=400, detail="Provide markdown text or upload an md/txt file")

    plain_text = re.sub(r"[#>*`_\-]", "", text)
    output = output_dir / "markdown.pdf"
    text_to_pdf(plain_text, output, title="Markdown to PDF")
    return create_single_file_result(output, "Markdown converted to PDF", "application/pdf")


def handle_txt_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = read_text_input(files, payload)
    if not text:
        raise HTTPException(status_code=400, detail="Provide text in payload or upload txt file")

    output = output_dir / "text.pdf"
    text_to_pdf(text, output, title="Text to PDF")
    return create_single_file_result(output, "Text converted to PDF", "application/pdf")


def handle_summarize_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to summarize")

    summary = summarize_text_algo(content)
    output = output_dir / "summary.txt"
    output.write_text(summary, encoding="utf-8")
    return create_single_file_result(output, "Text summarized", "text/plain")


def handle_translate_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to translate")

    target = str(payload.get("target_lang", "en")).strip() or "en"
    translated = translate_text_chunks(content, target)

    output = output_dir / "translated.txt"
    output.write_text(translated, encoding="utf-8")
    return create_single_file_result(output, "Text translated", "text/plain")


def handle_qr_code_generator(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Provide text or URL in payload.text")

    image = qrcode.make(text)
    output = output_dir / "qr-code.png"
    image.save(output)
    return create_single_file_result(output, "QR generated", "image/png")


def handle_extract_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = files[0]
    metadata: dict[str, Any] = {"filename": source.name, "suffix": source.suffix.lower()}

    if source.suffix.lower() == ".pdf":
        reader = PdfReader(str(source))
        metadata["pdf_metadata"] = dict(reader.metadata or {})
        metadata["pages"] = len(reader.pages)
    else:
        image = Image.open(source)
        metadata["format"] = image.format
        metadata["mode"] = image.mode
        metadata["size"] = {"width": image.width, "height": image.height}
        metadata["exif"] = {str(k): str(v) for k, v in image.getexif().items()}

    output = output_dir / "metadata.json"
    output.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return create_single_file_result(output, "Metadata extracted", "application/json")


def handle_remove_metadata_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)

    for source in files:
        image = Image.open(source)
        clean = Image.new(image.mode, image.size)
        clean.putdata(list(image.getdata()))
        out = output_dir / f"clean-{source.name}"
        clean.save(out)

    if len(files) == 1:
        result = next(output_dir.iterdir())
        return create_single_file_result(result, "Metadata removed", "image/*")

    return create_zip_result(output_dir, "Metadata removed from images", "clean-images")


def handle_extract_pages(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_split_pdf(files, payload, output_dir)


def handle_delete_pages(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    to_delete = parse_page_numbers(str(payload.get("pages", "")), len(reader.pages))
    if not to_delete:
        raise HTTPException(status_code=400, detail="Provide pages to delete, e.g. 2,4 or 5-8")

    writer = PdfWriter()
    for page_index, page in enumerate(reader.pages, start=1):
        if page_index not in to_delete:
            writer.add_page(page)

    output = output_dir / "pages-deleted.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "Selected pages deleted", "application/pdf")


def handle_rearrange_pages(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_organize_pdf(files, payload, output_dir)


def handle_resize_pages_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    scale = float(payload.get("scale", 1.0))
    if scale <= 0:
        raise HTTPException(status_code=400, detail="scale must be greater than 0")

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        page.scale_by(scale)
        writer.add_page(page)

    output = output_dir / "resized-pages.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF page size scaled", "application/pdf")


def handle_add_text_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_watermark_pdf(files, payload, output_dir)


def handle_header_footer_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    header = str(payload.get("header", "")).strip()
    footer = str(payload.get("footer", "")).strip()
    font_size = int(payload.get("font_size", 11))

    if not header and not footer:
        raise HTTPException(status_code=400, detail="Provide header or footer text")

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)

        stream = io.BytesIO()
        overlay_canvas = canvas.Canvas(stream, pagesize=(width, height))
        overlay_canvas.setFont("Helvetica", font_size)

        if header:
            overlay_canvas.drawString(36, height - 28, header)
        if footer:
            overlay_canvas.drawString(36, 22, footer)

        overlay_canvas.save()
        stream.seek(0)

        overlay_pdf = PdfReader(stream)
        page.merge_page(overlay_pdf.pages[0])
        writer.add_page(page)

    output = output_dir / "header-footer.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "Header and footer added", "application/pdf")


def handle_whiteout_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    keywords_raw = str(payload.get("keywords", "")).strip()
    keywords = [k.strip() for k in keywords_raw.split(",") if k.strip()]
    if not keywords:
        raise HTTPException(status_code=400, detail="keywords is required, e.g. name,email")

    document = fitz.open(str(files[0]))
    for page in document:
        for keyword in keywords:
            found = page.search_for(keyword)
            for area in found:
                page.add_redact_annot(area, fill=(1, 1, 1))
        page.apply_redactions()

    output = output_dir / "whiteout.pdf"
    document.save(str(output), garbage=4, deflate=True)
    document.close()

    return create_single_file_result(output, "Whiteout applied", "application/pdf")


def handle_remove_metadata_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    output = output_dir / "clean-metadata.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF metadata removed", "application/pdf")


def handle_grayscale_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = fitz.open(str(files[0]))
    target = fitz.open()

    for page in source:
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csGRAY)
        new_page = target.new_page(width=pix.width, height=pix.height)
        new_page.insert_image(fitz.Rect(0, 0, pix.width, pix.height), pixmap=pix)

    output = output_dir / "grayscale.pdf"
    target.save(str(output), garbage=4, deflate=True)
    source.close()
    target.close()
    return create_single_file_result(output, "PDF converted to grayscale", "application/pdf")


def handle_png_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_webp_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_gif_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_bmp_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_create_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_txt_to_pdf(files, payload, output_dir)


def handle_url_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_html_to_pdf(files, payload, output_dir)


def _convert_alias(files: list[Path], payload: dict[str, Any], output_dir: Path, target_format: str) -> ExecutionResult:
    alias_payload = dict(payload)
    alias_payload["target_format"] = target_format
    return handle_convert_image(files, alias_payload, output_dir)


def handle_jpg_to_png(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return _convert_alias(files, payload, output_dir, "png")


def handle_png_to_jpg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return _convert_alias(files, payload, output_dir, "jpg")


def handle_image_to_webp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return _convert_alias(files, payload, output_dir, "webp")


def handle_pdf_to_txt(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    output = output_dir / "pdf.txt"
    output.write_text(content, encoding="utf-8")
    return create_single_file_result(output, "PDF converted to TXT", "text/plain")


def handle_pdf_to_markdown(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    markdown = "\n\n".join(lines)
    output = output_dir / "pdf.md"
    output.write_text(markdown, encoding="utf-8")
    return create_single_file_result(output, "PDF converted to Markdown", "text/markdown")


def handle_pdf_to_json(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    content = extract_pdf_text(files[0])
    data = {
        "filename": files[0].name,
        "pages": len(reader.pages),
        "metadata": dict(reader.metadata or {}),
        "text": content,
    }
    output = output_dir / "pdf.json"
    output.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return create_single_file_result(output, "PDF converted to JSON", "application/json")


def handle_pdf_to_csv(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    lines = [line.strip() for line in content.splitlines() if line.strip()]

    output = output_dir / "pdf.csv"
    with output.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["line_number", "text"])
        for index, line in enumerate(lines, start=1):
            writer.writerow([index, line])

    return create_single_file_result(output, "PDF converted to CSV", "text/csv")


def handle_flip_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    mode = str(payload.get("mode", "horizontal")).strip().lower()
    image = Image.open(files[0])

    if mode == "vertical":
        transformed = ImageOps.flip(image)
    else:
        transformed = ImageOps.mirror(image)

    output = output_dir / f"flip-{files[0].name}"
    save_image(transformed, output)
    return create_single_file_result(output, "Image flipped", "image/*")


def handle_add_border_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    border_size = int(payload.get("border_size", 20))
    color = str(payload.get("color", "#ffffff")).strip() or "#ffffff"

    image = Image.open(files[0])
    bordered = ImageOps.expand(image, border=max(0, border_size), fill=color)
    output = output_dir / f"border-{files[0].name}"
    save_image(bordered, output)
    return create_single_file_result(output, "Border added to image", "image/*")


def handle_thumbnail_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    max_width = int(payload.get("max_width", 320))
    max_height = int(payload.get("max_height", 320))

    image = Image.open(files[0]).copy()
    image.thumbnail((max_width, max_height))
    output = output_dir / f"thumbnail-{files[0].name}"
    save_image(image, output)
    return create_single_file_result(output, "Thumbnail generated", "image/*")


def handle_image_collage(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    columns = max(1, int(payload.get("columns", 2)))
    cell_size = max(80, int(payload.get("cell_size", 420)))

    images = [Image.open(path).convert("RGB") for path in files]
    rows = (len(images) + columns - 1) // columns

    collage = Image.new("RGB", (columns * cell_size, rows * cell_size), color="white")
    for index, img in enumerate(images):
        fitted = ImageOps.fit(img, (cell_size, cell_size))
        x = (index % columns) * cell_size
        y = (index // columns) * cell_size
        collage.paste(fitted, (x, y))

    output = output_dir / "collage.jpg"
    collage.save(output, quality=92)
    return create_single_file_result(output, "Image collage created", "image/jpeg")


def handle_word_count_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to analyze")

    words = re.findall(r"[A-Za-z']+", content)
    sentences = [s for s in re.split(r"(?<=[.!?])\s+", content.strip()) if s]
    data = {
        "characters": len(content),
        "words": len(words),
        "sentences": len(sentences),
        "avg_word_length": round(sum(len(word) for word in words) / max(1, len(words)), 2),
    }

    output = output_dir / "word-count.json"
    output.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return create_single_file_result(output, "Word count report generated", "application/json")


def _sentence_case(text: str) -> str:
    lowered = text.strip().lower()
    if not lowered:
        return ""
    return lowered[0].upper() + lowered[1:]


def handle_case_converter_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to convert")

    mode = str(payload.get("mode", "upper")).strip().lower()
    if mode == "lower":
        converted = content.lower()
    elif mode == "title":
        converted = content.title()
    elif mode == "sentence":
        converted = " ".join(_sentence_case(part) for part in re.split(r"(?<=[.!?])\s+", content) if part)
    else:
        converted = content.upper()

    output = output_dir / "case-converted.txt"
    output.write_text(converted, encoding="utf-8")
    return create_single_file_result(output, "Text case converted", "text/plain")


def handle_extract_keywords_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to extract keywords")

    top_n = max(1, int(payload.get("top_n", 20)))
    words = [
        word
        for word in re.findall(r"[A-Za-z']+", content.lower())
        if word not in STOPWORDS and len(word) > 2
    ]

    top_words = Counter(words).most_common(top_n)
    output = output_dir / "keywords.txt"
    output.write_text("\n".join(f"{word},{count}" for word, count in top_words), encoding="utf-8")
    return create_single_file_result(output, "Keywords extracted", "text/plain")


def handle_slug_generator_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        text = read_text_input(files, payload)
    if not text:
        raise HTTPException(status_code=400, detail="Provide text for slug generation")

    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    output = output_dir / "slug.txt"
    output.write_text(slug, encoding="utf-8")
    return create_single_file_result(output, "Slug generated", "text/plain")


def handle_json_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide JSON text or upload file")

    try:
        parsed = json.loads(raw)
        content = json.dumps(parsed, indent=2)
    except json.JSONDecodeError:
        content = raw

    output = output_dir / "json.pdf"
    text_to_pdf(content, output, title="JSON to PDF")
    return create_single_file_result(output, "JSON converted to PDF", "application/pdf")


def handle_xml_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide XML text or upload file")

    output = output_dir / "xml.pdf"
    text_to_pdf(raw, output, title="XML to PDF")
    return create_single_file_result(output, "XML converted to PDF", "application/pdf")


def handle_csv_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide CSV text or upload file")

    output = output_dir / "csv.pdf"
    text_to_pdf(raw, output, title="CSV to PDF")
    return create_single_file_result(output, "CSV converted to PDF", "application/pdf")


def handle_pdf_pages_to_zip(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pdf_to_image(files, payload, output_dir)


def handle_zip_images_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = files[0]
    if source.suffix.lower() != ".zip":
        raise HTTPException(status_code=400, detail="Upload a ZIP file containing images")

    extract_dir = output_dir / "zip-images"
    extract_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(source, "r") as archive:
        archive.extractall(extract_dir)

    image_paths = [
        path
        for path in extract_dir.rglob("*")
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tif", ".tiff"}
    ]
    if not image_paths:
        raise HTTPException(status_code=400, detail="No images found inside ZIP")

    images = [Image.open(path).convert("RGB") for path in image_paths]
    output = output_dir / "zip-images.pdf"
    images[0].save(output, save_all=True, append_images=images[1:])
    return create_single_file_result(output, "ZIP images converted to PDF", "application/pdf")


def handle_pdf_to_docx(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    output = output_dir / "pdf.docx"
    build_docx_from_text(content, output, "PDF to DOCX")
    return create_single_file_result(
        output,
        "PDF converted to DOCX",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )


def handle_docx_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_docx_text(files[0])
    output = output_dir / "docx.pdf"
    text_to_pdf(content, output, title="DOCX to PDF")
    return create_single_file_result(output, "DOCX converted to PDF", "application/pdf")


def handle_pdf_to_excel(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    lines = [line.strip() for line in content.splitlines() if line.strip()]

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "PDF Text"
    sheet.append(["line_number", "text"])

    for index, line in enumerate(lines, start=1):
        sheet.append([index, line])

    output = output_dir / "pdf.xlsx"
    workbook.save(str(output))
    return create_single_file_result(
        output,
        "PDF converted to Excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


def handle_excel_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    workbook = load_workbook(str(files[0]), data_only=True)
    lines: list[str] = []

    for sheet in workbook.worksheets:
        lines.append(f"Sheet: {sheet.title}")
        for row in sheet.iter_rows(values_only=True):
            values = [str(cell).strip() if cell is not None else "" for cell in row]
            if any(values):
                lines.append(" | ".join(values))
        lines.append("")

    output = output_dir / "excel.pdf"
    text_to_pdf("\n".join(lines).strip(), output, title="Excel to PDF")
    return create_single_file_result(output, "Excel converted to PDF", "application/pdf")


def handle_pdf_to_pptx(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    document = fitz.open(str(files[0]))
    presentation = Presentation()

    for index, page in enumerate(document, start=1):
        slide = presentation.slides.add_slide(presentation.slide_layouts[1])
        if slide.shapes.title:
            slide.shapes.title.text = f"Page {index}"

        content = page.get_text("text").strip() or f"Page {index} has no extractable text."
        body_text = content[:3800]

        if len(slide.placeholders) > 1 and hasattr(slide.placeholders[1], "text_frame"):
            slide.placeholders[1].text_frame.text = body_text
        else:
            text_box = slide.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(8.0), Inches(4.5))
            text_box.text_frame.text = body_text

    document.close()

    output = output_dir / "pdf.pptx"
    presentation.save(str(output))
    return create_single_file_result(
        output,
        "PDF converted to PPTX",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    )


def handle_pptx_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    presentation = Presentation(str(files[0]))
    lines: list[str] = []

    for index, slide in enumerate(presentation.slides, start=1):
        lines.append(f"Slide {index}")
        for shape in slide.shapes:
            text_value = str(getattr(shape, "text", "")).strip()
            if text_value:
                lines.append(text_value)
        lines.append("")

    output = output_dir / "pptx.pdf"
    text_to_pdf("\n".join(lines).strip(), output, title="PPTX to PDF")
    return create_single_file_result(output, "PPTX converted to PDF", "application/pdf")


def handle_sign_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
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
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.add_metadata(
        {
            "/Title": str(payload.get("title", files[0].stem)).strip() or files[0].stem,
            "/Producer": "ISHU TOOLS Archival Export",
            "/Creator": "ISHU TOOLS",
        }
    )

    output = output_dir / "archival.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF archival export generated", "application/pdf")


def handle_scan_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_chat_with_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    question = str(payload.get("question", "")).strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")

    max_sentences = max(1, min(8, int(payload.get("max_sentences", 3))))
    content = extract_pdf_text(files[0])
    if not content:
        raise HTTPException(status_code=400, detail="No extractable text found in this PDF")

    matches = top_matching_sentences(content, question, max_sentences)
    answer = " ".join(matches)

    return ExecutionResult(
        kind="json",
        message="Answer generated from PDF",
        data={
            "question": question,
            "answer": answer,
            "evidence": matches,
        },
    )


def handle_create_workflow(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    workflow_name = str(payload.get("workflow_name", "My Workflow")).strip() or "My Workflow"
    raw_steps = str(payload.get("steps", "")).strip()
    if not raw_steps:
        raise HTTPException(status_code=400, detail="steps is required, use comma or new lines")

    steps = [step.strip() for step in re.split(r"[\n,]+", raw_steps) if step.strip()]
    if not steps:
        raise HTTPException(status_code=400, detail="No valid workflow steps were provided")

    payload_data = {
        "name": workflow_name,
        "steps": [{"order": index + 1, "tool": step} for index, step in enumerate(steps)],
        "step_count": len(steps),
    }

    output = output_dir / "workflow.json"
    output.write_text(json.dumps(payload_data, indent=2), encoding="utf-8")
    return create_single_file_result(output, "Workflow created", "application/json")


def handle_upscale_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    scale = float(payload.get("scale", 2.0))
    if scale <= 1:
        raise HTTPException(status_code=400, detail="scale must be greater than 1")

    image = Image.open(files[0])
    target_size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    upscaled = image.resize(target_size, resample=Image.LANCZOS)

    output = output_dir / f"upscaled-{files[0].name}"
    save_image(upscaled, output)
    return create_single_file_result(output, "Image upscaled", "image/*")


def handle_add_image_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)

    pdf_file = next((path for path in files if path.suffix.lower() == ".pdf"), None)
    image_file = next(
        (
            path
            for path in files
            if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tif", ".tiff"}
        ),
        None,
    )

    if not pdf_file or not image_file:
        raise HTTPException(status_code=400, detail="Upload one PDF and one image file")

    scale = max(0.05, min(0.8, float(payload.get("scale", 0.2))))
    opacity = max(10, min(100, int(payload.get("opacity", 65))))

    image = Image.open(image_file).convert("RGBA")
    if opacity < 100:
        alpha = image.getchannel("A")
        alpha = alpha.point(lambda value: int(value * (opacity / 100)))
        image.putalpha(alpha)

    document = fitz.open(str(pdf_file))

    for page in document:
        width = int(page.rect.width)
        height = int(page.rect.height)

        target_width = max(36, int(width * scale))
        target_height = max(36, int(image.height * (target_width / max(1, image.width))))
        resized = image.resize((target_width, target_height), resample=Image.LANCZOS)

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


def handle_pdf_page_count(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    text = extract_pdf_text(files[0])
    words = re.findall(r"[A-Za-z']+", text)
    report = {
        "filename": files[0].name,
        "pages": len(reader.pages),
        "words": len(words),
        "characters": len(text),
    }

    output = output_dir / "pdf-page-count.json"
    output.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return create_single_file_result(output, "PDF statistics generated", "application/json")


def handle_reverse_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for page in reversed(reader.pages):
        writer.add_page(page)

    output = output_dir / "reversed.pdf"
    with output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(output, "PDF pages reversed", "application/pdf")


def handle_flatten_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = fitz.open(str(files[0]))
    flattened = fitz.open()

    for page in source:
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img_bytes = pix.tobytes("png")
        target_page = flattened.new_page(width=pix.width, height=pix.height)
        target_page.insert_image(fitz.Rect(0, 0, pix.width, pix.height), stream=img_bytes)

    output = output_dir / "flattened.pdf"
    flattened.save(str(output), garbage=4, deflate=True)
    source.close()
    flattened.close()
    return create_single_file_result(output, "PDF flattened successfully", "application/pdf")


def handle_pdf_to_html(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = extract_pdf_text(files[0])
    escaped = html.escape(text)
    html_doc = f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>{html.escape(files[0].stem)}</title>
  <style>body {{ font-family: Arial, sans-serif; margin: 24px; line-height: 1.5; }} pre {{ white-space: pre-wrap; }}</style>
</head>
<body>
  <h1>{html.escape(files[0].name)}</h1>
  <pre>{escaped}</pre>
</body>
</html>
"""

    output = output_dir / "pdf.html"
    output.write_text(html_doc, encoding="utf-8")
    return create_single_file_result(output, "PDF converted to HTML", "text/html")


def handle_pdf_to_bmp(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    return _pdf_to_image(files, output_dir, "bmp")


def handle_pdf_to_gif(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    document = fitz.open(str(files[0]))

    for index, page in enumerate(document, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        output = output_dir / f"page-{index}.gif"
        image.convert("P", palette=Image.ADAPTIVE).save(output, format="GIF")

    document.close()
    return create_zip_result(output_dir, "PDF converted to GIF", "pdf-to-gif")


def handle_sharpen_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    factor = float(payload.get("factor", 2.0))

    image = Image.open(files[0])
    enhanced = ImageEnhance.Sharpness(image).enhance(max(0.0, factor))
    output = output_dir / f"sharpen-{files[0].name}"
    save_image(enhanced, output)
    return create_single_file_result(output, "Image sharpened", "image/*")


def handle_brighten_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    factor = float(payload.get("factor", 1.25))

    image = Image.open(files[0])
    enhanced = ImageEnhance.Brightness(image).enhance(max(0.0, factor))
    output = output_dir / f"bright-{files[0].name}"
    save_image(enhanced, output)
    return create_single_file_result(output, "Image brightness adjusted", "image/*")


def handle_contrast_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    factor = float(payload.get("factor", 1.2))

    image = Image.open(files[0])
    enhanced = ImageEnhance.Contrast(image).enhance(max(0.0, factor))
    output = output_dir / f"contrast-{files[0].name}"
    save_image(enhanced, output)
    return create_single_file_result(output, "Image contrast adjusted", "image/*")


def handle_invert_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image = Image.open(files[0]).convert("RGB")
    inverted = ImageOps.invert(image)
    output = output_dir / f"invert-{files[0].name}"
    save_image(inverted, output)
    return create_single_file_result(output, "Image colors inverted", "image/*")


def handle_posterize_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    bits = int(payload.get("bits", 4))
    bits = min(8, max(1, bits))

    image = Image.open(files[0]).convert("RGB")
    posterized = ImageOps.posterize(image, bits)
    output = output_dir / f"posterize-{files[0].name}"
    save_image(posterized, output)
    return create_single_file_result(output, "Posterize effect applied", "image/*")


def handle_image_histogram(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image = Image.open(files[0]).convert("RGB")
    histogram = image.histogram()

    red = histogram[:256]
    green = histogram[256:512]
    blue = histogram[512:768]
    pixels = max(1, image.width * image.height)

    def channel_mean(channel_values: list[int]) -> float:
        return round(sum(index * count for index, count in enumerate(channel_values)) / pixels, 2)

    data = {
        "filename": files[0].name,
        "width": image.width,
        "height": image.height,
        "mode": image.mode,
        "mean_rgb": {
            "r": channel_mean(red),
            "g": channel_mean(green),
            "b": channel_mean(blue),
        },
    }

    output = output_dir / "image-histogram.json"
    output.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return create_single_file_result(output, "Image histogram generated", "application/json")


def handle_remove_extra_spaces_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to clean")

    cleaned_lines = [re.sub(r"[ \t]+", " ", line).strip() for line in content.splitlines()]
    cleaned = "\n".join(cleaned_lines).strip()

    output = output_dir / "cleaned-text.txt"
    output.write_text(cleaned, encoding="utf-8")
    return create_single_file_result(output, "Extra spaces removed", "text/plain")


def handle_sort_lines_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text with multiple lines")

    direction = str(payload.get("direction", "asc")).strip().lower()
    reverse = direction == "desc"
    lines = [line for line in content.splitlines() if line.strip()]
    sorted_lines = sorted(lines, key=str.casefold, reverse=reverse)

    output = output_dir / "sorted-lines.txt"
    output.write_text("\n".join(sorted_lines), encoding="utf-8")
    return create_single_file_result(output, "Lines sorted", "text/plain")


def handle_deduplicate_lines_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text with lines")

    seen: set[str] = set()
    unique_lines: list[str] = []
    for line in content.splitlines():
        normalized = line.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        unique_lines.append(normalized)

    output = output_dir / "deduplicated-lines.txt"
    output.write_text("\n".join(unique_lines), encoding="utf-8")
    return create_single_file_result(output, "Duplicate lines removed", "text/plain")


def handle_find_replace_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text for find/replace")

    find_text = str(payload.get("find", "")).strip()
    replace_text = str(payload.get("replace", ""))
    case_sensitive_raw = payload.get("case_sensitive", False)
    if isinstance(case_sensitive_raw, bool):
        case_sensitive = case_sensitive_raw
    else:
        case_sensitive = str(case_sensitive_raw).strip().lower() in {"1", "true", "yes", "on"}
    if not find_text:
        raise HTTPException(status_code=400, detail="find value is required")

    if case_sensitive:
        updated = content.replace(find_text, replace_text)
    else:
        updated = re.sub(re.escape(find_text), replace_text, content, flags=re.IGNORECASE)

    output = output_dir / "find-replace.txt"
    output.write_text(updated, encoding="utf-8")
    return create_single_file_result(output, "Find and replace applied", "text/plain")


def handle_split_text_file(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text content to split")

    lines_per_file = max(1, int(payload.get("lines_per_file", 100)))
    lines = content.splitlines()
    for index, start in enumerate(range(0, len(lines), lines_per_file), start=1):
        chunk = lines[start : start + lines_per_file]
        part = output_dir / f"part-{index}.txt"
        part.write_text("\n".join(chunk), encoding="utf-8")

    return create_zip_result(output_dir, "Text split into multiple files", "split-text")


def handle_reading_time_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    content = read_text_input(files, payload)
    if not content:
        raise HTTPException(status_code=400, detail="Provide text to estimate reading time")

    words = re.findall(r"[A-Za-z']+", content)
    wpm = max(100, int(payload.get("wpm", 200)))
    minutes = max(1, math.ceil(len(words) / wpm))

    report = {
        "words": len(words),
        "wpm": wpm,
        "estimated_minutes": minutes,
    }

    output = output_dir / "reading-time.json"
    output.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return create_single_file_result(output, "Reading time estimated", "application/json")


def handle_images_to_zip(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image_suffixes = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"}
    image_files = [path for path in files if path.suffix.lower() in image_suffixes]
    if not image_files:
        raise HTTPException(status_code=400, detail="Upload at least one image file")

    for image_file in image_files:
        shutil.copy(image_file, output_dir / image_file.name)

    return create_zip_result(output_dir, "Images packed into ZIP", "images-zip")


def handle_batch_convert_images(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target_format = str(payload.get("target_format", "png")).strip().lower()
    if target_format not in {"png", "jpg", "jpeg", "webp", "gif", "bmp"}:
        raise HTTPException(status_code=400, detail="target_format must be one of png,jpg,webp,gif,bmp")

    normalized_ext = "jpg" if target_format == "jpeg" else target_format
    for source in files:
        image = Image.open(source)
        converted = image.convert("RGB") if normalized_ext == "jpg" else image
        output = output_dir / f"{source.stem}.{normalized_ext}"
        save_image(converted, output, fmt=target_format.upper())

    if len(files) == 1:
        single = next(output_dir.iterdir())
        return create_single_file_result(single, "Image converted", "image/*")

    return create_zip_result(output_dir, "Batch image conversion completed", "batch-images")


def handle_merge_text_files(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    separator = str(payload.get("separator", "\n\n-----\n\n"))
    chunks: list[str] = []

    for source in files:
        chunks.append(source.read_text(encoding="utf-8", errors="ignore"))

    merged = separator.join(chunks)
    output = output_dir / "merged-text.txt"
    output.write_text(merged, encoding="utf-8")
    return create_single_file_result(output, "Text files merged", "text/plain")


def handle_json_prettify(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide JSON content")

    parsed = json.loads(raw)
    output = output_dir / "pretty.json"
    output.write_text(json.dumps(parsed, indent=2, ensure_ascii=False), encoding="utf-8")
    return create_single_file_result(output, "JSON formatted successfully", "application/json")


def handle_csv_to_json(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide CSV content")

    reader = csv.DictReader(io.StringIO(raw))
    rows = list(reader)

    output = output_dir / "data.json"
    output.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    return create_single_file_result(output, "CSV converted to JSON", "application/json")


def handle_json_to_csv(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    raw = read_text_input(files, payload)
    if not raw:
        raise HTTPException(status_code=400, detail="Provide JSON content")

    parsed = json.loads(raw)
    if isinstance(parsed, dict):
        rows = [parsed]
    elif isinstance(parsed, list):
        rows = [item for item in parsed if isinstance(item, dict)]
    else:
        raise HTTPException(status_code=400, detail="JSON must be an object or list of objects")

    if not rows:
        raise HTTPException(status_code=400, detail="No object rows found to convert")

    fieldnames: list[str] = []
    seen_fields: set[str] = set()
    for row in rows:
        for key in row.keys():
            if key not in seen_fields:
                seen_fields.add(key)
                fieldnames.append(key)

    output = output_dir / "data.csv"
    with output.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return create_single_file_result(output, "JSON converted to CSV", "text/csv")


def handle_pdf_to_tiff(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    images = render_pdf_pages_to_pil_images(files[0], scale=2.0)
    output = output_dir / "pdf.tiff"
    build_tiff_from_images(images, output)
    return create_single_file_result(output, "PDF converted to TIFF", "image/tiff")


def handle_tiff_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_image_to_pdf(files, payload, output_dir)


def handle_pdf_to_svg(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    document = fitz.open(str(files[0]))

    try:
        for index, page in enumerate(document, start=1):
            svg_text = page.get_svg_image()
            (output_dir / f"page-{index}.svg").write_text(svg_text, encoding="utf-8")
    finally:
        document.close()

    if len(list(output_dir.glob("*.svg"))) == 1:
        svg_file = next(output_dir.glob("*.svg"))
        return create_single_file_result(svg_file, "PDF converted to SVG", "image/svg+xml")

    return create_zip_result(output_dir, "PDF pages converted to SVG", "pdf-to-svg")


def handle_svg_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    generated_pdfs: list[Path] = []

    for index, source in enumerate(files, start=1):
        svg_content = source.read_text(encoding="utf-8", errors="ignore")
        text_content = BeautifulSoup(svg_content, "html.parser").get_text(" ", strip=True)
        pdf_path = output_dir / f"svg-{index}.pdf"
        pdf_canvas = canvas.Canvas(str(pdf_path), pagesize=A4)
        pdf_canvas.setFont("Helvetica", 11)
        pdf_canvas.drawString(40, 780, f"Converted from: {source.name}")
        y = 760
        for line in textwrap.wrap(text_content, width=90):
            if y < 40:
                pdf_canvas.showPage()
                pdf_canvas.setFont("Helvetica", 11)
                y = 780
            pdf_canvas.drawString(40, y, line)
            y -= 15
        pdf_canvas.save()
        generated_pdfs.append(pdf_path)

    if len(generated_pdfs) == 1:
        return create_single_file_result(generated_pdfs[0], "SVG converted to PDF", "application/pdf")

    writer = PdfWriter()
    for pdf_path in generated_pdfs:
        reader = PdfReader(str(pdf_path))
        for page in reader.pages:
            writer.add_page(page)

    merged_output = output_dir / "svg-merged.pdf"
    with merged_output.open("wb") as f:
        writer.write(f)

    return create_single_file_result(merged_output, "SVG files converted to a merged PDF", "application/pdf")


def handle_pdf_to_rtf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_pdf_text(files[0])
    output = output_dir / "pdf.rtf"
    build_rtf_from_text(content, output)
    return create_single_file_result(output, "PDF converted to RTF", "application/rtf")


def handle_rtf_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_rtf_text(files[0])
    output = output_dir / "rtf.pdf"
    text_to_pdf(content, output, title="RTF to PDF")
    return create_single_file_result(output, "RTF converted to PDF", "application/pdf")


def handle_pdf_to_odt(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    title = str(payload.get("title", files[0].stem)).strip() or files[0].stem
    content = extract_pdf_text(files[0])
    output = output_dir / "pdf.odt"
    build_odt_from_text(content, output, title)
    return create_single_file_result(output, "PDF converted to ODT", "application/vnd.oasis.opendocument.text")


def handle_odt_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_odt_text(files[0])
    output = output_dir / "odt.pdf"
    text_to_pdf(content, output, title="ODT to PDF")
    return create_single_file_result(output, "ODT converted to PDF", "application/pdf")


def handle_pdf_to_epub(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    title = str(payload.get("title", files[0].stem)).strip() or files[0].stem
    content = extract_pdf_text(files[0])
    output = output_dir / "pdf.epub"
    build_epub_from_text(content, output, title)
    return create_single_file_result(output, "PDF converted to EPUB", "application/epub+zip")


def handle_epub_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    content = extract_epub_text(files[0])
    output = output_dir / "epub.pdf"
    text_to_pdf(content, output, title="EPUB to PDF")
    return create_single_file_result(output, "EPUB converted to PDF", "application/pdf")


def handle_ocr_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = extract_ocr_text_from_image(files[0])
    if not text:
        raise HTTPException(status_code=400, detail="No readable text was detected in the image")

    output = output_dir / "ocr-image.txt"
    output.write_text(text, encoding="utf-8")
    return create_single_file_result(output, "OCR extracted text from image", "text/plain")


def handle_ocr_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    temp_dir = output_dir / "_ocr_pages"
    temp_dir.mkdir(parents=True, exist_ok=True)
    text = extract_ocr_text_from_pdf(files[0], temp_dir)
    if not text:
        raise HTTPException(status_code=400, detail="No readable text was detected in the PDF pages")

    output = output_dir / "ocr.pdf"
    text_to_pdf(text, output, title="OCR PDF")
    return create_single_file_result(output, "OCR-generated searchable PDF created", "application/pdf")


def remove_background_fallback(image_bytes: bytes, tolerance: int) -> bytes:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    sample_points = [
        pixels[0, 0],
        pixels[max(0, width - 1), 0],
        pixels[0, max(0, height - 1)],
        pixels[max(0, width - 1), max(0, height - 1)],
    ]
    bg = tuple(int(sum(pixel[idx] for pixel in sample_points) / len(sample_points)) for idx in range(3))
    threshold_sq = max(1, tolerance) ** 2

    new_pixels = []
    for r, g, b, a in image.getdata():
        distance_sq = (r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2
        if distance_sq <= threshold_sq:
            new_pixels.append((r, g, b, 0))
        else:
            new_pixels.append((r, g, b, a))

    image.putdata(new_pixels)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def handle_remove_background(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image_bytes = files[0].read_bytes()
    tolerance = max(5, min(80, int(payload.get("tolerance", 28))))

    try:
        from rembg import remove

        removed = remove(image_bytes)
    except Exception:
        removed = remove_background_fallback(image_bytes, tolerance)

    output = output_dir / f"{files[0].stem}-background-removed.png"
    output.write_bytes(removed)
    return create_single_file_result(output, "Background removed from image", "image/png")


def handle_blur_background(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    from rembg import remove

    radius = max(2, float(payload.get("radius", 12)))
    original = open_image_file(files[0], "RGBA")
    cutout = Image.open(io.BytesIO(remove(files[0].read_bytes()))).convert("RGBA")
    mask = cutout.getchannel("A")
    blurred = original.filter(ImageFilter.GaussianBlur(radius=radius))
    output_img = Image.composite(original, blurred, mask)

    output = output_dir / f"{files[0].stem}-blur-background.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Background blur applied", "image/png")


def handle_blur_face(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    import cv2

    blur_strength = max(15, int(payload.get("blur_strength", 45)))
    if blur_strength % 2 == 0:
        blur_strength += 1

    image, faces = detect_faces_in_image(files[0])
    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face was detected in the uploaded image")

    for (x, y, w, h) in faces:
        region = image[y : y + h, x : x + w]
        image[y : y + h, x : x + w] = cv2.GaussianBlur(region, (blur_strength, blur_strength), 0)

    output = output_dir / f"{files[0].stem}-blur-face.png"
    cv2.imwrite(str(output), image)
    return create_single_file_result(output, "Faces blurred successfully", "image/png")


def handle_pixelate_face(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    import cv2

    pixel_size = max(4, int(payload.get("pixel_size", 16)))
    image, faces = detect_faces_in_image(files[0])
    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face was detected in the uploaded image")

    for (x, y, w, h) in faces:
        region = image[y : y + h, x : x + w]
        tiny = cv2.resize(
            region,
            (max(1, w // pixel_size), max(1, h // pixel_size)),
            interpolation=cv2.INTER_LINEAR,
        )
        image[y : y + h, x : x + w] = cv2.resize(tiny, (w, h), interpolation=cv2.INTER_NEAREST)

    output = output_dir / f"{files[0].stem}-pixelate-face.png"
    cv2.imwrite(str(output), image)
    return create_single_file_result(output, "Faces pixelated successfully", "image/png")


def handle_add_text_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Provide the text you want to place on the image")

    font_size = max(12, int(payload.get("font_size", 48)))
    opacity = int(round(clamp_percentage(payload.get("opacity", 90), 90) * 2.55))
    x = int(payload.get("x", 40))
    y = int(payload.get("y", 40))
    text_color = parse_color_value(payload.get("color", "#ffffff"), (255, 255, 255))

    image = open_image_file(files[0], "RGBA")
    layer = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)
    font = load_ui_font(font_size)
    stroke_opacity = max(60, min(220, opacity))
    draw.text(
        (x, y),
        text,
        fill=(*text_color, opacity),
        font=font,
        stroke_width=max(1, font_size // 18),
        stroke_fill=(0, 0, 0, stroke_opacity),
    )

    output_img = Image.alpha_composite(image, layer)
    output = output_dir / f"{files[0].stem}-text.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Text added to image", "image/png")


def handle_add_logo_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)

    base = open_image_file(files[0], "RGBA")
    logo = open_image_file(files[1], "RGBA")
    scale_percent = clamp_percentage(payload.get("scale_percent", 20), 20)
    opacity = clamp_percentage(payload.get("opacity", 85), 85)
    position = str(payload.get("position", "bottom-right"))

    max_width = max(40, int(base.width * (scale_percent / 100)))
    max_height = max(40, int(base.height * 0.35))
    logo.thumbnail((max_width, max_height), get_resampling_module().LANCZOS)

    alpha = logo.getchannel("A").point(lambda value: int(value * (opacity / 100)))
    logo.putalpha(alpha)

    x, y = resolve_anchor_position(position, base.size, logo.size)
    output_img = base.copy()
    output_img.alpha_composite(logo, (x, y))

    output = output_dir / f"{files[0].stem}-logo-overlay.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Logo added to image", "image/png")


def handle_join_images(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)
    direction = str(payload.get("direction", "horizontal")).strip().lower()
    gap = max(0, int(payload.get("gap", 16)))
    background = parse_color_value(payload.get("background", "#0b1120"), (11, 17, 32))

    images = [open_image_file(path, "RGBA") for path in files]
    if direction == "vertical":
        canvas_width = max(image.width for image in images)
        canvas_height = sum(image.height for image in images) + gap * (len(images) - 1)
        canvas_image = Image.new("RGBA", (canvas_width, canvas_height), (*background, 255))
        y = 0
        for image in images:
            x = (canvas_width - image.width) // 2
            canvas_image.alpha_composite(image, (x, y))
            y += image.height + gap
    else:
        canvas_width = sum(image.width for image in images) + gap * (len(images) - 1)
        canvas_height = max(image.height for image in images)
        canvas_image = Image.new("RGBA", (canvas_width, canvas_height), (*background, 255))
        x = 0
        for image in images:
            y = (canvas_height - image.height) // 2
            canvas_image.alpha_composite(image, (x, y))
            x += image.width + gap

    output = output_dir / "joined-images.png"
    save_image(canvas_image, output, fmt="PNG")
    return create_single_file_result(output, "Images joined into a single canvas", "image/png")


def handle_split_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    columns = max(1, int(payload.get("columns", 2)))
    rows = max(1, int(payload.get("rows", 2)))
    image = open_image_file(files[0], "RGBA")

    for row_index in range(rows):
        top = round(row_index * image.height / rows)
        bottom = round((row_index + 1) * image.height / rows)
        for col_index in range(columns):
            left = round(col_index * image.width / columns)
            right = round((col_index + 1) * image.width / columns)
            tile = image.crop((left, top, right, bottom))
            output = output_dir / f"tile-r{row_index + 1}-c{col_index + 1}.png"
            save_image(tile, output, fmt="PNG")

    if columns * rows == 1:
        tile_file = next(output_dir.glob("*.png"))
        return create_single_file_result(tile_file, "Image split into one tile", "image/png")

    return create_zip_result(output_dir, "Image split into tiles", "split-image")


def handle_circle_crop_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image = open_image_file(files[0], "RGBA")
    side = min(image.width, image.height)
    cropped = ImageOps.fit(image, (side, side))

    target_size = max(0, int(payload.get("size", side)))
    if target_size:
        cropped = cropped.resize((target_size, target_size), get_resampling_module().LANCZOS)
        side = target_size

    mask = Image.new("L", (side, side), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, side, side), fill=255)

    output_img = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    output_img.paste(cropped, (0, 0), mask)
    output = output_dir / f"{files[0].stem}-circle-crop.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Circle crop created", "image/png")


def handle_square_crop_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    image = open_image_file(files[0], "RGBA")
    side = min(image.width, image.height)
    output_img = ImageOps.fit(image, (side, side))

    target_size = max(0, int(payload.get("size", side)))
    if target_size:
        output_img = output_img.resize((target_size, target_size), get_resampling_module().LANCZOS)

    output = output_dir / f"{files[0].stem}-square-crop.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Square crop created", "image/png")


def handle_image_color_picker(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    color_count = max(3, min(12, int(payload.get("colors", 5))))
    source = open_image_file(files[0], "RGB")

    sample = source.copy()
    sample.thumbnail((220, 220), get_resampling_module().LANCZOS)
    quantized = sample.quantize(colors=color_count, method=Image.MEDIANCUT)
    palette = quantized.getpalette()
    total_pixels = max(1, sample.width * sample.height)
    swatches: list[dict[str, Any]] = []

    for palette_index, count in Counter(quantized.getdata()).most_common(color_count):
        rgb = tuple(palette[palette_index * 3 : palette_index * 3 + 3])
        swatches.append(
            {
                "hex": "#{:02X}{:02X}{:02X}".format(*rgb),
                "rgb": list(rgb),
                "coverage_percent": round((count / total_pixels) * 100, 2),
            }
        )

    (output_dir / "palette.json").write_text(json.dumps(swatches, indent=2), encoding="utf-8")

    swatch_width = 240
    swatch_height = 120
    preview = Image.new("RGB", (swatch_width, swatch_height * len(swatches)), color="#050816")
    draw = ImageDraw.Draw(preview)
    font = load_ui_font(22)
    small_font = load_ui_font(16)

    for index, swatch in enumerate(swatches):
        top = index * swatch_height
        color = tuple(swatch["rgb"])
        draw.rectangle((0, top, swatch_width, top + swatch_height), fill=color)
        text_color = (17, 24, 39) if sum(color) > 420 else (248, 250, 252)
        draw.text((18, top + 22), swatch["hex"], fill=text_color, font=font)
        draw.text(
            (18, top + 60),
            f"{swatch['coverage_percent']}% coverage",
            fill=text_color,
            font=small_font,
        )

    preview.save(output_dir / "palette-preview.png")
    return create_zip_result(output_dir, "Image palette extracted", "image-color-picker")


def handle_motion_blur_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    import cv2
    import numpy as np

    direction = str(payload.get("direction", "horizontal")).strip().lower()
    strength = max(3, min(31, int(payload.get("strength", 9))))
    if strength % 2 == 0:
        strength += 1

    image = cv2.imread(str(files[0]), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise HTTPException(status_code=400, detail="Unable to open image for motion blur")

    kernel = np.zeros((strength, strength), dtype=np.float32)
    if direction == "vertical":
        kernel[:, strength // 2] = 1.0
    else:
        kernel[strength // 2, :] = 1.0
    kernel /= kernel.sum()

    blurred = cv2.filter2D(image, -1, kernel)
    output = output_dir / f"{files[0].stem}-motion-blur.png"
    cv2.imwrite(str(output), blurred)
    return create_single_file_result(output, "Motion blur applied", "image/png")


def handle_optimize_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    optimized_payload = dict(payload)
    optimized_payload.setdefault("image_quality", 55)
    return handle_compress_pdf(files, optimized_payload, output_dir)


def handle_remove_pages(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_delete_pages(files, payload, output_dir)


def handle_pdf_ocr(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_ocr_pdf(files, payload, output_dir)


def handle_image_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_ocr_image(files, payload, output_dir)


def handle_jpg_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_ocr_image(files, payload, output_dir)


def handle_png_to_text(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_ocr_image(files, payload, output_dir)


def handle_ai_summarizer(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if files:
        return handle_summarize_pdf(files, payload, output_dir)
    return handle_summarize_text(files, payload, output_dir)


def handle_word_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_docx_to_pdf(files, payload, output_dir)


def handle_pdf_to_word(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pdf_to_docx(files, payload, output_dir)


def handle_powerpoint_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pptx_to_pdf(files, payload, output_dir)


def handle_pdf_to_powerpoint(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_pdf_to_pptx(files, payload, output_dir)


def handle_add_page_numbers(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_page_numbers_pdf(files, payload, output_dir)


def handle_add_watermark(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_watermark_pdf(files, payload, output_dir)


def handle_edit_metadata(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    if files and files[0].suffix.lower() == ".pdf":
        return handle_edit_metadata_pdf(files, payload, output_dir)
    return handle_extract_metadata(files, payload, output_dir)


def handle_pdf_viewer(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    reader = PdfReader(str(files[0]))
    preview_pages: list[dict[str, Any]] = []
    for index, page in enumerate(reader.pages[:3], start=1):
        preview_pages.append(
            {
                "page": index,
                "preview": (page.extract_text() or "").strip()[:1200],
            }
        )

    return ExecutionResult(
        kind="json",
        message="PDF preview generated",
        data={
            "filename": files[0].name,
            "pages": len(reader.pages),
            "metadata": dict(reader.metadata or {}),
            "preview_pages": preview_pages,
        },
    )


def handle_pdf_intelligence(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = extract_pdf_text(files[0])
    reader = PdfReader(str(files[0]))
    summary_sentences = max(2, min(8, int(payload.get("summary_sentences", 4))))
    top_keywords = max(3, min(15, int(payload.get("top_keywords", 8))))

    return ExecutionResult(
        kind="json",
        message="PDF intelligence report generated",
        data={
            "filename": files[0].name,
            "pages": len(reader.pages),
            "characters": len(text),
            "words": len(re.findall(r"[A-Za-z']+", text)),
            "summary": summarize_text_algo(text, max_sentences=summary_sentences),
            "keywords": extract_top_keywords(text, limit=top_keywords),
            "preview": text[:1600],
        },
    )


def handle_annotate_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required for annotation")

    page_number = max(1, int(payload.get("page", 1)))
    x = float(payload.get("x", 48))
    y = float(payload.get("y", 72))
    width = max(120.0, float(payload.get("width", 220)))
    height = max(40.0, float(payload.get("height", 80)))
    font_size = max(8, int(payload.get("font_size", 12)))
    color = color_to_pdf_tuple(payload.get("color", "#38bdf8"), (56, 189, 248))

    document = fitz.open(str(files[0]))
    try:
        if page_number > len(document):
            raise HTTPException(status_code=400, detail="Selected page is outside the PDF range")
        page = document[page_number - 1]
        annotation = page.add_freetext_annot(fitz.Rect(x, y, x + width, y + height), text)
        annotation.update(fontsize=font_size, text_color=color, fill_color=(1, 1, 1))

        output = output_dir / "annotated.pdf"
        document.save(str(output))
    finally:
        document.close()

    return create_single_file_result(output, "PDF annotation added", "application/pdf")


def handle_highlight_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    page_number = max(1, int(payload.get("page", 1)))
    x = float(payload.get("x", 48))
    y = float(payload.get("y", 72))
    width = max(24.0, float(payload.get("width", 180)))
    height = max(12.0, float(payload.get("height", 24)))
    opacity = max(0.1, min(1.0, float(payload.get("opacity", 0.35))))
    color = color_to_pdf_tuple(payload.get("color", "#fde047"), (253, 224, 71))

    document = fitz.open(str(files[0]))
    try:
        if page_number > len(document):
            raise HTTPException(status_code=400, detail="Selected page is outside the PDF range")
        page = document[page_number - 1]
        rect = fitz.Rect(x, y, x + width, y + height)
        annotation = page.add_rect_annot(rect)
        annotation.set_colors(stroke=color, fill=color)
        annotation.set_opacity(opacity)
        annotation.update()

        output = output_dir / "highlighted.pdf"
        document.save(str(output))
    finally:
        document.close()

    return create_single_file_result(output, "PDF highlight added", "application/pdf")


def handle_pdf_filler(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_annotate_pdf(files, payload, output_dir)


def handle_edit_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    mode = str(payload.get("mode", "add_text")).strip().lower()
    if mode == "watermark":
        return handle_watermark_pdf(files, payload, output_dir)
    if mode == "annotate":
        return handle_annotate_pdf(files, payload, output_dir)
    if mode == "highlight":
        return handle_highlight_pdf(files, payload, output_dir)
    if mode == "add_image":
        return handle_add_image_pdf(files, payload, output_dir)
    return handle_add_text_pdf(files, payload, output_dir)


def handle_pdf_security(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    mode = str(payload.get("mode", "protect")).strip().lower()
    if mode == "unlock":
        return handle_unlock_pdf(files, payload, output_dir)
    return handle_protect_pdf(files, payload, output_dir)


def handle_convert_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    suffixes = {path.suffix.lower() for path in files}
    image_types = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff", ".jfif", ".heic", ".heif"}
    if suffixes.issubset(image_types):
        return handle_jpg_to_pdf(files, payload, output_dir)

    if len(files) > 1:
        raise HTTPException(status_code=400, detail="Multiple uploads are currently supported for image-to-PDF conversion only")

    source = files[0]
    extension = source.suffix.lower()
    handler_by_extension: dict[str, ToolHandler] = {
        ".docx": handle_docx_to_pdf,
        ".pptx": handle_pptx_to_pdf,
        ".xlsx": handle_excel_to_pdf,
        ".xlsm": handle_excel_to_pdf,
        ".csv": handle_csv_to_pdf,
        ".json": handle_json_to_pdf,
        ".xml": handle_xml_to_pdf,
        ".txt": handle_txt_to_pdf,
        ".md": handle_md_to_pdf,
        ".svg": handle_svg_to_pdf,
        ".rtf": handle_rtf_to_pdf,
        ".odt": handle_odt_to_pdf,
        ".epub": handle_epub_to_pdf,
        ".eml": handle_eml_to_pdf,
        ".fb2": handle_fb2_to_pdf,
        ".cbz": handle_cbz_to_pdf,
    }
    handler = handler_by_extension.get(extension)
    if not handler:
        raise HTTPException(status_code=400, detail=f"Unsupported input format for convert-to-pdf: {extension or 'unknown'}")
    return handler(files, payload, output_dir)


def handle_convert_from_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    target = str(payload.get("target_format", "jpg")).strip().lower()
    handler_by_target: dict[str, ToolHandler] = {
        "jpg": handle_pdf_to_jpg,
        "jpeg": handle_pdf_to_jpg,
        "png": handle_pdf_to_png,
        "docx": handle_pdf_to_docx,
        "word": handle_pdf_to_docx,
        "pptx": handle_pdf_to_pptx,
        "powerpoint": handle_pdf_to_pptx,
        "xlsx": handle_pdf_to_excel,
        "excel": handle_pdf_to_excel,
        "txt": handle_pdf_to_txt,
        "md": handle_pdf_to_markdown,
        "markdown": handle_pdf_to_markdown,
        "json": handle_pdf_to_json,
        "csv": handle_pdf_to_csv,
        "image": handle_pdf_to_image,
        "tiff": handle_pdf_to_tiff,
        "svg": handle_pdf_to_svg,
        "rtf": handle_pdf_to_rtf,
        "odt": handle_pdf_to_odt,
        "epub": handle_pdf_to_epub,
        "html": handle_pdf_to_html,
        "bmp": handle_pdf_to_bmp,
        "gif": handle_pdf_to_gif,
        "pdfa": handle_pdf_to_pdfa,
    }
    handler = handler_by_target.get(target)
    if not handler:
        raise HTTPException(status_code=400, detail=f"Unsupported target format for convert-from-pdf: {target}")
    return handler(files, payload, output_dir)


def handle_pdf_converter(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    source = files[0]
    if source.suffix.lower() == ".pdf":
        return handle_convert_from_pdf(files, payload, output_dir)

    target = str(payload.get("target_format", "pdf")).strip().lower()
    if target not in {"", "pdf"}:
        raise HTTPException(
            status_code=400,
            detail="For non-PDF source files, pdf-converter currently outputs PDF. Set target_format to pdf.",
        )
    return handle_convert_to_pdf(files, payload, output_dir)


def handle_check_image_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    return ExecutionResult(
        kind="json",
        message="Image DPI analyzed",
        data=extract_image_dpi_info(files[0]),
    )


def handle_convert_dpi(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    dpi = max(36, int(payload.get("dpi", 300)))
    image = open_image_file(files[0])
    output = output_dir / f"{files[0].stem}-dpi-{dpi}{files[0].suffix.lower() or '.png'}"
    image.save(output, dpi=(dpi, dpi))
    return create_single_file_result(output, "Image DPI updated", "image/*")


def handle_resize_image_in_cm(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    width = float(payload.get("width_cm", 3.5))
    height = float(payload.get("height_cm", 4.5))
    dpi = max(36, int(payload.get("dpi", 300)))
    output = output_dir / f"{files[0].stem}-cm{files[0].suffix.lower() or '.png'}"
    resize_image_to_physical_units(files[0], output, width, height, dpi, "cm")
    return create_single_file_result(output, "Image resized in centimeters", "image/*")


def handle_resize_image_in_mm(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    width = float(payload.get("width_mm", 35))
    height = float(payload.get("height_mm", 45))
    dpi = max(36, int(payload.get("dpi", 300)))
    output = output_dir / f"{files[0].stem}-mm{files[0].suffix.lower() or '.png'}"
    resize_image_to_physical_units(files[0], output, width, height, dpi, "mm")
    return create_single_file_result(output, "Image resized in millimeters", "image/*")


def handle_resize_image_in_inch(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    width = float(payload.get("width_inch", 2))
    height = float(payload.get("height_inch", 2))
    dpi = max(36, int(payload.get("dpi", 300)))
    output = output_dir / f"{files[0].stem}-inch{files[0].suffix.lower() or '.png'}"
    resize_image_to_physical_units(files[0], output, width, height, dpi, "inch")
    return create_single_file_result(output, "Image resized in inches", "image/*")


def handle_add_name_dob_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    name = str(payload.get("name", "")).strip()
    dob = str(payload.get("dob", "")).strip()
    if not name and not dob:
        raise HTTPException(status_code=400, detail="Provide a name or DOB to place on the photo")

    x = int(payload.get("x", 24))
    y = int(payload.get("y", 24))
    font_size = max(14, int(payload.get("font_size", 28)))
    text_color = parse_color_value(payload.get("color", "#ffffff"), (255, 255, 255))
    lines = [line for line in [name, dob] if line]

    image = open_image_file(files[0], "RGBA")
    layer = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)
    font = load_ui_font(font_size)
    cursor_y = y
    for line in lines:
        draw.text(
            (x, cursor_y),
            line,
            fill=(*text_color, 255),
            font=font,
            stroke_width=max(1, font_size // 18),
            stroke_fill=(0, 0, 0, 180),
        )
        cursor_y += font_size + 8

    output_img = Image.alpha_composite(image, layer)
    output = output_dir / f"{files[0].stem}-named.png"
    save_image(output_img, output, fmt="PNG")
    return create_single_file_result(output, "Name and DOB added to image", "image/png")


def handle_merge_photo_signature(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 2)
    gap = max(0, int(payload.get("gap", 20)))
    direction = str(payload.get("direction", "vertical")).strip().lower()
    background = parse_color_value(payload.get("background", "#ffffff"), (255, 255, 255))

    photo = open_image_file(files[0], "RGBA")
    signature = open_image_file(files[1], "RGBA")
    signature.thumbnail((photo.width, max(60, photo.height // 4)), get_resampling_module().LANCZOS)

    if direction == "horizontal":
        width = photo.width + signature.width + gap
        height = max(photo.height, signature.height)
        canvas_image = Image.new("RGBA", (width, height), (*background, 255))
        canvas_image.alpha_composite(photo, (0, (height - photo.height) // 2))
        canvas_image.alpha_composite(signature, (photo.width + gap, (height - signature.height) // 2))
    else:
        width = max(photo.width, signature.width)
        height = photo.height + signature.height + gap
        canvas_image = Image.new("RGBA", (width, height), (*background, 255))
        canvas_image.alpha_composite(photo, ((width - photo.width) // 2, 0))
        canvas_image.alpha_composite(signature, ((width - signature.width) // 2, photo.height + gap))

    output = output_dir / "photo-signature.png"
    save_image(canvas_image, output, fmt="PNG")
    return create_single_file_result(output, "Photo and signature merged", "image/png")


def handle_black_and_white_image(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    threshold = max(0, min(255, int(payload.get("threshold", 128))))
    source = open_image_file(files[0], "L")
    output_img = source.point(lambda value: 255 if value >= threshold else 0, mode="1")
    output = output_dir / f"{files[0].stem}-black-white.png"
    output_img.save(output)
    return create_single_file_result(output, "Black and white effect applied", "image/png")


def handle_picture_to_pixel_art(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    alias_payload = dict(payload)
    alias_payload.setdefault("factor", 24)
    return handle_pixelate_image(files, alias_payload, output_dir)


def handle_censor_photo(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    try:
        censor_payload = dict(payload)
        censor_payload.setdefault("pixel_size", 14)
        return handle_pixelate_face(files, censor_payload, output_dir)
    except HTTPException:
        alias_payload = dict(payload)
        alias_payload.setdefault("factor", 20)
        return handle_pixelate_image(files, alias_payload, output_dir)


def handle_generate_signature(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Provide signature text")

    width = max(240, int(payload.get("width", 720)))
    height = max(100, int(payload.get("height", 240)))
    font_size = max(28, int(payload.get("font_size", 96)))
    text_color = parse_color_value(payload.get("color", "#0f172a"), (15, 23, 42))

    image = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    font = load_ui_font(font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = max(10, (width - text_width) // 2)
    y = max(10, (height - text_height) // 2 - bbox[1])
    draw.text((x, y), text, fill=(*text_color, 255), font=font)

    output = output_dir / "signature.png"
    save_image(image, output, fmt="PNG")
    return create_single_file_result(output, "Signature image generated", "image/png")


def handle_eml_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    message = BytesParser(policy=policy.default).parsebytes(files[0].read_bytes())

    body_parts: list[str] = []
    if message.is_multipart():
        for part in message.walk():
            if part.get_content_type() == "text/plain":
                body_parts.append(part.get_content())
    else:
        body_parts.append(message.get_content())

    lines = [
        f"Subject: {message.get('subject', '')}",
        f"From: {message.get('from', '')}",
        f"To: {message.get('to', '')}",
        f"Date: {message.get('date', '')}",
        "",
        "\n".join(part.strip() for part in body_parts if str(part).strip()),
    ]
    output = output_dir / "email.pdf"
    text_to_pdf("\n".join(lines).strip(), output, title="EML to PDF")
    return create_single_file_result(output, "Email converted to PDF", "application/pdf")


def handle_fb2_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    xml_text = files[0].read_text(encoding="utf-8", errors="ignore")
    content = BeautifulSoup(xml_text, "xml").get_text("\n", strip=True)
    output = output_dir / "fb2.pdf"
    text_to_pdf(content, output, title="FB2 to PDF")
    return create_single_file_result(output, "FB2 converted to PDF", "application/pdf")


def handle_cbz_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    images: list[Image.Image] = []
    with zipfile.ZipFile(files[0], "r") as archive:
        for name in sorted(archive.namelist()):
            suffix = Path(name).suffix.lower()
            if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}:
                continue
            with archive.open(name) as member:
                images.append(Image.open(io.BytesIO(member.read())).convert("RGB"))

    output = output_dir / "cbz.pdf"
    save_images_as_pdf(images, output)
    return create_single_file_result(output, "CBZ converted to PDF", "application/pdf")


def handle_ebook_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    ensure_files(files, 1)
    extension = files[0].suffix.lower()
    if extension == ".epub":
        return handle_epub_to_pdf(files, payload, output_dir)
    if extension == ".fb2":
        return handle_fb2_to_pdf(files, payload, output_dir)
    if extension == ".cbz":
        return handle_cbz_to_pdf(files, payload, output_dir)
    raise HTTPException(status_code=400, detail=f"Unsupported eBook format: {extension or 'unknown'}")


def handle_heic_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_jpg_to_pdf(files, payload, output_dir)


def handle_heif_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_jpg_to_pdf(files, payload, output_dir)


def handle_jfif_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_jpg_to_pdf(files, payload, output_dir)


def handle_zip_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    return handle_zip_images_to_pdf(files, payload, output_dir)


HANDLERS: dict[str, ToolHandler] = {
    "merge-pdf": handle_merge_pdf,
    "split-pdf": handle_split_pdf,
    "extract-pages": handle_extract_pages,
    "delete-pages": handle_delete_pages,
    "compress-pdf": handle_compress_pdf,
    "optimize-pdf": handle_optimize_pdf,
    "rotate-pdf": handle_rotate_pdf,
    "organize-pdf": handle_organize_pdf,
    "rearrange-pages": handle_rearrange_pages,
    "crop-pdf": handle_crop_pdf,
    "resize-pages-pdf": handle_resize_pages_pdf,
    "watermark-pdf": handle_watermark_pdf,
    "add-text-pdf": handle_add_text_pdf,
    "page-numbers-pdf": handle_page_numbers_pdf,
    "header-footer-pdf": handle_header_footer_pdf,
    "protect-pdf": handle_protect_pdf,
    "pdf-security": handle_pdf_security,
    "unlock-pdf": handle_unlock_pdf,
    "redact-pdf": handle_redact_pdf,
    "whiteout-pdf": handle_whiteout_pdf,
    "remove-metadata-pdf": handle_remove_metadata_pdf,
    "compare-pdf": handle_compare_pdf,
    "extract-text-pdf": handle_extract_text_pdf,
    "extract-images-pdf": handle_extract_images_pdf,
    "pdf-to-jpg": handle_pdf_to_jpg,
    "pdf-to-png": handle_pdf_to_png,
    "grayscale-pdf": handle_grayscale_pdf,
    "jpg-to-pdf": handle_jpg_to_pdf,
    "heic-to-pdf": handle_heic_to_pdf,
    "heif-to-pdf": handle_heif_to_pdf,
    "jfif-to-pdf": handle_jfif_to_pdf,
    "image-to-pdf": handle_image_to_pdf,
    "scan-to-pdf": handle_scan_to_pdf,
    "png-to-pdf": handle_png_to_pdf,
    "webp-to-pdf": handle_webp_to_pdf,
    "gif-to-pdf": handle_gif_to_pdf,
    "bmp-to-pdf": handle_bmp_to_pdf,
    "convert-to-pdf": handle_convert_to_pdf,
    "convert-from-pdf": handle_convert_from_pdf,
    "pdf-converter": handle_pdf_converter,
    "pdf-to-docx": handle_pdf_to_docx,
    "pdf-to-word": handle_pdf_to_word,
    "docx-to-pdf": handle_docx_to_pdf,
    "word-to-pdf": handle_word_to_pdf,
    "pdf-to-excel": handle_pdf_to_excel,
    "excel-to-pdf": handle_excel_to_pdf,
    "pdf-to-pptx": handle_pdf_to_pptx,
    "pdf-to-powerpoint": handle_pdf_to_powerpoint,
    "pptx-to-pdf": handle_pptx_to_pdf,
    "powerpoint-to-pdf": handle_powerpoint_to_pdf,
    "repair-pdf": handle_repair_pdf,
    "create-pdf": handle_create_pdf,
    "pdf-to-pdfa": handle_pdf_to_pdfa,
    "sign-pdf": handle_sign_pdf,
    "edit-metadata-pdf": handle_edit_metadata_pdf,
    "edit-metadata": handle_edit_metadata,
    "translate-pdf": handle_translate_pdf,
    "summarize-pdf": handle_summarize_pdf,
    "ai-summarizer": handle_ai_summarizer,
    "pdf-viewer": handle_pdf_viewer,
    "pdf-intelligence": handle_pdf_intelligence,
    "edit-pdf": handle_edit_pdf,
    "annotate-pdf": handle_annotate_pdf,
    "highlight-pdf": handle_highlight_pdf,
    "pdf-filler": handle_pdf_filler,
    "chat-with-pdf": handle_chat_with_pdf,
    "compress-image": handle_compress_image,
    "resize-image": handle_resize_image,
    "resize-image-in-cm": handle_resize_image_in_cm,
    "resize-image-in-mm": handle_resize_image_in_mm,
    "resize-image-in-inch": handle_resize_image_in_inch,
    "upscale-image": handle_upscale_image,
    "crop-image": handle_crop_image,
    "rotate-image": handle_rotate_image,
    "convert-image": handle_convert_image,
    "jpg-to-png": handle_jpg_to_png,
    "png-to-jpg": handle_png_to_jpg,
    "image-to-webp": handle_image_to_webp,
    "watermark-image": handle_watermark_image,
    "add-name-dob-image": handle_add_name_dob_image,
    "merge-photo-signature": handle_merge_photo_signature,
    "grayscale-image": handle_grayscale_image,
    "black-and-white-image": handle_black_and_white_image,
    "blur-image": handle_blur_image,
    "pixelate-image": handle_pixelate_image,
    "picture-to-pixel-art": handle_picture_to_pixel_art,
    "censor-photo": handle_censor_photo,
    "meme-generator": handle_meme_generator,
    "generate-signature": handle_generate_signature,
    "pdf-to-image": handle_pdf_to_image,
    "html-to-pdf": handle_html_to_pdf,
    "url-to-pdf": handle_url_to_pdf,
    "md-to-pdf": handle_md_to_pdf,
    "txt-to-pdf": handle_txt_to_pdf,
    "eml-to-pdf": handle_eml_to_pdf,
    "fb2-to-pdf": handle_fb2_to_pdf,
    "cbz-to-pdf": handle_cbz_to_pdf,
    "ebook-to-pdf": handle_ebook_to_pdf,
    "summarize-text": handle_summarize_text,
    "translate-text": handle_translate_text,
    "qr-code-generator": handle_qr_code_generator,
    "extract-metadata": handle_extract_metadata,
    "check-image-dpi": handle_check_image_dpi,
    "convert-dpi": handle_convert_dpi,
    "remove-metadata-image": handle_remove_metadata_image,
    "pdf-to-txt": handle_pdf_to_txt,
    "pdf-to-markdown": handle_pdf_to_markdown,
    "pdf-to-json": handle_pdf_to_json,
    "pdf-to-csv": handle_pdf_to_csv,
    "flip-image": handle_flip_image,
    "add-border-image": handle_add_border_image,
    "thumbnail-image": handle_thumbnail_image,
    "image-collage": handle_image_collage,
    "word-count-text": handle_word_count_text,
    "case-converter-text": handle_case_converter_text,
    "extract-keywords-text": handle_extract_keywords_text,
    "slug-generator-text": handle_slug_generator_text,
    "create-workflow": handle_create_workflow,
    "json-to-pdf": handle_json_to_pdf,
    "xml-to-pdf": handle_xml_to_pdf,
    "csv-to-pdf": handle_csv_to_pdf,
    "add-image-pdf": handle_add_image_pdf,
    "pdf-pages-to-zip": handle_pdf_pages_to_zip,
    "zip-images-to-pdf": handle_zip_images_to_pdf,
    "zip-to-pdf": handle_zip_to_pdf,
    "pdf-page-count": handle_pdf_page_count,
    "reverse-pdf": handle_reverse_pdf,
    "flatten-pdf": handle_flatten_pdf,
    "pdf-to-html": handle_pdf_to_html,
    "pdf-to-bmp": handle_pdf_to_bmp,
    "pdf-to-gif": handle_pdf_to_gif,
    "pdf-to-tiff": handle_pdf_to_tiff,
    "tiff-to-pdf": handle_tiff_to_pdf,
    "pdf-to-svg": handle_pdf_to_svg,
    "svg-to-pdf": handle_svg_to_pdf,
    "pdf-to-rtf": handle_pdf_to_rtf,
    "rtf-to-pdf": handle_rtf_to_pdf,
    "pdf-to-odt": handle_pdf_to_odt,
    "odt-to-pdf": handle_odt_to_pdf,
    "pdf-to-epub": handle_pdf_to_epub,
    "epub-to-pdf": handle_epub_to_pdf,
    "ocr-image": handle_ocr_image,
    "image-to-text": handle_image_to_text,
    "jpg-to-text": handle_jpg_to_text,
    "png-to-text": handle_png_to_text,
    "ocr-pdf": handle_ocr_pdf,
    "pdf-ocr": handle_pdf_ocr,
    "remove-background": handle_remove_background,
    "blur-background": handle_blur_background,
    "blur-face": handle_blur_face,
    "pixelate-face": handle_pixelate_face,
    "add-text-image": handle_add_text_image,
    "add-logo-image": handle_add_logo_image,
    "join-images": handle_join_images,
    "split-image": handle_split_image,
    "circle-crop-image": handle_circle_crop_image,
    "square-crop-image": handle_square_crop_image,
    "image-color-picker": handle_image_color_picker,
    "motion-blur-image": handle_motion_blur_image,
    "sharpen-image": handle_sharpen_image,
    "brighten-image": handle_brighten_image,
    "contrast-image": handle_contrast_image,
    "invert-image": handle_invert_image,
    "posterize-image": handle_posterize_image,
    "image-histogram": handle_image_histogram,
    "remove-extra-spaces-text": handle_remove_extra_spaces_text,
    "sort-lines-text": handle_sort_lines_text,
    "deduplicate-lines-text": handle_deduplicate_lines_text,
    "find-replace-text": handle_find_replace_text,
    "split-text-file": handle_split_text_file,
    "reading-time-text": handle_reading_time_text,
    "images-to-zip": handle_images_to_zip,
    "batch-convert-images": handle_batch_convert_images,
    "merge-text-files": handle_merge_text_files,
    "json-prettify": handle_json_prettify,
    "csv-to-json": handle_csv_to_json,
    "json-to-csv": handle_json_to_csv,
    "remove-pages": handle_remove_pages,
    "add-page-numbers": handle_add_page_numbers,
    "add-watermark": handle_add_watermark,
}
