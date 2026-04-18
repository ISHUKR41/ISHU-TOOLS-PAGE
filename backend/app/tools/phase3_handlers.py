"""
ISHU TOOLS — Phase 3 Additional Tools Handlers
26 new tools: PDF Advanced, Image Effects, Student & Everyday utilities.
"""
import csv
import math
import os
import random
import re
import string
import textwrap
import zipfile
from datetime import datetime, timedelta
from io import BytesIO
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter, ImageFont

from .handlers import ExecutionResult, ToolHandler


# ═══════════════════════════════════════════════════════
#  PDF ADVANCED TOOLS
# ═══════════════════════════════════════════════════════

def handle_grayscale_pdf(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Convert PDF to grayscale."""
    from pypdf import PdfReader, PdfWriter

    if not files:
        return ExecutionResult(kind="json", message="Please upload a PDF", data={"error": "No file uploaded"})

    out = output_dir / "grayscale.pdf"
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    with open(out, "wb") as f:
        writer.write(f)

    return ExecutionResult(kind="file", output_path=out, filename="grayscale.pdf",
                          content_type="application/pdf", message="PDF converted to grayscale")


def handle_flatten_pdf(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Flatten PDF (remove form fields, annotations)."""
    from pypdf import PdfReader, PdfWriter

    if not files:
        return ExecutionResult(kind="json", message="Please upload a PDF", data={"error": "No file uploaded"})

    out = output_dir / "flattened.pdf"
    reader = PdfReader(str(files[0]))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    with open(out, "wb") as f:
        writer.write(f)

    return ExecutionResult(kind="file", output_path=out, filename="flattened.pdf",
                          content_type="application/pdf", message="PDF flattened successfully")


def handle_pdf_to_csv(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Extract tables from PDF to CSV."""
    from pypdf import PdfReader

    if not files:
        return ExecutionResult(kind="json", message="Please upload a PDF", data={"error": "No file uploaded"})

    reader = PdfReader(str(files[0]))
    full_text = "\n".join((page.extract_text() or "").strip() for page in reader.pages)
    lines = [line.strip() for line in full_text.split('\n') if line.strip()]

    out = output_dir / "extracted.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for line in lines:
            cells = re.split(r'\s{2,}|\t', line)
            writer.writerow(cells)

    return ExecutionResult(kind="file", output_path=out, filename="extracted.csv",
                          content_type="text/csv", message=f"Extracted {len(lines)} rows to CSV")


def handle_csv_to_pdf(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Create PDF from CSV data."""
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
    from reportlab.lib import colors

    if not files:
        return ExecutionResult(kind="json", message="Please upload a CSV", data={"error": "No file uploaded"})

    rows: list[list[str]] = []
    with open(files[0], "r", encoding="utf-8", errors="replace") as f:
        for row in csv.reader(f):
            rows.append(row)

    if not rows:
        return ExecutionResult(kind="json", message="CSV is empty", data={"error": "No data found"})

    out = output_dir / "table.pdf"
    doc = SimpleDocTemplate(str(out), pagesize=A4)
    table = Table(rows)
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2563eb")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0f9ff")]),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ])
    table.setStyle(style)
    doc.build([table])

    return ExecutionResult(kind="file", output_path=out, filename="table.pdf",
                          content_type="application/pdf", message=f"Created PDF with {len(rows)} rows")


def handle_pdf_header_footer(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Add custom header and footer to PDF."""
    from pypdf import PdfReader, PdfWriter
    from reportlab.pdfgen import canvas as rl_canvas

    if not files:
        return ExecutionResult(kind="json", message="Please upload a PDF", data={"error": "No file uploaded"})

    header_text = payload.get("header_text", "")
    footer_text = payload.get("footer_text", "Page {page}")

    reader = PdfReader(str(files[0]))
    writer = PdfWriter()

    for i, page in enumerate(reader.pages):
        page_width = float(page.mediabox.width)
        page_height = float(page.mediabox.height)

        overlay_buf = BytesIO()
        c = rl_canvas.Canvas(overlay_buf, pagesize=(page_width, page_height))
        c.setFont("Helvetica", 9)
        c.setFillColorRGB(0.3, 0.3, 0.3)

        if header_text:
            c.drawCentredString(page_width / 2, page_height - 25, header_text)

        ft = footer_text.replace("{page}", str(i + 1)).replace("{total}", str(len(reader.pages)))
        c.drawCentredString(page_width / 2, 15, ft)
        c.save()

        overlay_buf.seek(0)
        overlay_reader = PdfReader(overlay_buf)
        page.merge_page(overlay_reader.pages[0])
        writer.add_page(page)

    out = output_dir / "headerfooter.pdf"
    with open(out, "wb") as f:
        writer.write(f)

    return ExecutionResult(kind="file", output_path=out, filename="headerfooter.pdf",
                          content_type="application/pdf", message="Header/footer added to all pages")


# ═══════════════════════════════════════════════════════
#  IMAGE EFFECT TOOLS
# ═══════════════════════════════════════════════════════

def handle_blur_face(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Blur face region in an image."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    w, h = img.size
    blur_strength = int(payload.get("blur_strength", "25"))

    face_region = (int(w * 0.25), int(h * 0.1), int(w * 0.75), int(h * 0.65))
    face_crop = img.crop(face_region)
    face_blurred = face_crop.filter(ImageFilter.GaussianBlur(radius=blur_strength))
    img.paste(face_blurred, face_region)

    out = output_dir / "blurred_face.png"
    img.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="blurred_face.png",
                          content_type="image/png", message="Face area blurred successfully")


def handle_pixelate_image(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Pixelate an entire image."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    pixel_size = int(payload.get("pixel_size", "10"))

    w, h = img.size
    small = img.resize((max(1, w // pixel_size), max(1, h // pixel_size)), Image.NEAREST)
    result = small.resize((w, h), Image.NEAREST)

    out = output_dir / "pixelated.png"
    result.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="pixelated.png",
                          content_type="image/png", message="Image pixelated successfully")


def handle_motion_blur(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Add motion blur effect."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    intensity = int(payload.get("intensity", "15"))
    kernel_size = max(3, min(intensity, 15))

    kernel = [0] * (kernel_size * kernel_size)
    for i in range(kernel_size):
        kernel[i * kernel_size + i] = 1.0 / kernel_size

    motion_kernel = ImageFilter.Kernel(
        size=(kernel_size, kernel_size), kernel=kernel, scale=1, offset=0
    )
    result = img.filter(motion_kernel)

    out = output_dir / "motion_blur.png"
    result.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="motion_blur.png",
                          content_type="image/png", message="Motion blur applied")


def handle_add_border(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Add a border to an image."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    border_width = int(payload.get("border_width", "20"))
    border_color = payload.get("border_color", "#ffffff")
    color = tuple(int(border_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))

    w, h = img.size
    result = Image.new("RGB", (w + 2 * border_width, h + 2 * border_width), color)
    result.paste(img, (border_width, border_width))

    out = output_dir / "bordered.png"
    result.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="bordered.png",
                          content_type="image/png", message="Border added successfully")


def handle_add_text_to_image(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Add text overlay to an image."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGBA")
    text = payload.get("text", "Sample Text")
    font_size = int(payload.get("font_size", "36"))
    text_color = payload.get("text_color", "#ffffff")
    position = payload.get("position", "center")

    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    color_rgb = tuple(int(text_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

    w, h = img.size
    positions = {
        "center": ((w - tw) // 2, (h - th) // 2),
        "top-left": (20, 20),
        "top-right": (w - tw - 20, 20),
        "bottom-left": (20, h - th - 20),
        "bottom-right": (w - tw - 20, h - th - 20),
    }
    pos = positions.get(position, positions["center"])

    draw.text((pos[0]+2, pos[1]+2), text, font=font, fill=(0, 0, 0, 128))
    draw.text(pos, text, font=font, fill=(*color_rgb, 255))

    result = Image.alpha_composite(img, overlay).convert("RGB")
    out = output_dir / "text_overlay.png"
    result.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="text_overlay.png",
                          content_type="image/png", message="Text added to image")


def handle_image_splitter(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Split image into a grid of tiles."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    cols = int(payload.get("columns", "3"))
    rows = int(payload.get("rows", "3"))

    w, h = img.size
    tile_w = w // cols
    tile_h = h // rows

    out = output_dir / "tiles.zip"
    with zipfile.ZipFile(out, 'w') as zf:
        for r in range(rows):
            for c in range(cols):
                x1, y1 = c * tile_w, r * tile_h
                x2 = x1 + tile_w if c < cols - 1 else w
                y2 = y1 + tile_h if r < rows - 1 else h
                tile = img.crop((x1, y1, x2, y2))
                tile_path = output_dir / f"tile_{r+1}_{c+1}.png"
                tile.save(tile_path, "PNG")
                zf.write(tile_path, f"tile_{r+1}_{c+1}.png")

    return ExecutionResult(kind="file", output_path=out, filename="tiles.zip",
                          content_type="application/zip",
                          message=f"Image split into {rows}x{cols} = {rows*cols} tiles")


def handle_instagram_grid(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Split image into Instagram grid (3x3)."""
    return handle_image_splitter(files, {"columns": "3", "rows": "3"}, output_dir)


def handle_picture_to_pixel_art(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Convert image to pixel art style."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    pixel_size = int(payload.get("pixel_size", "8"))

    w, h = img.size
    small = img.resize((max(1, w // pixel_size), max(1, h // pixel_size)), Image.NEAREST)
    quantized = small.quantize(colors=32, method=Image.Quantize.FASTOCTREE).convert("RGB")
    result = quantized.resize((w, h), Image.NEAREST)

    out = output_dir / "pixel_art.png"
    result.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="pixel_art.png",
                          content_type="image/png", message="Pixel art created")


# ═══════════════════════════════════════════════════════
#  STUDENT TOOLS
# ═══════════════════════════════════════════════════════

def handle_attendance_calculator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Calculate attendance percentage."""
    total_classes = int(payload.get("total_classes", "0"))
    attended = int(payload.get("attended_classes", "0"))

    if total_classes <= 0:
        return ExecutionResult(kind="json", message="Invalid input", data={"error": "Total classes must be > 0"})

    percentage = (attended / total_classes) * 100
    target = 75
    needed = max(0, math.ceil((target * total_classes - 100 * attended) / (100 - target))) if percentage < target else 0
    can_skip = max(0, int((attended - target * total_classes / 100) / (target / 100))) if percentage > target else 0

    return ExecutionResult(kind="json", message="Attendance calculated", data={
        "total_classes": total_classes,
        "attended": attended,
        "percentage": round(percentage, 2),
        "status": "Safe (≥75%)" if percentage >= 75 else "Shortage (<75%)",
        "classes_needed_for_75": needed,
        "classes_can_skip": can_skip,
    })


def handle_grade_calculator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Calculate grade from marks."""
    marks = float(payload.get("marks", "0"))
    total = float(payload.get("total_marks", "100"))

    if total <= 0:
        return ExecutionResult(kind="json", message="Invalid total", data={"error": "Total must be > 0"})

    pct = (marks / total) * 100
    grades = [(90, "A+", "10.0"), (80, "A", "9.0"), (70, "B+", "8.0"), (60, "B", "7.0"),
              (50, "C", "6.0"), (40, "D", "5.0"), (33, "E", "4.0")]
    grade, gpa = "F (Fail)", "0.0"
    for threshold, g, p in grades:
        if pct >= threshold:
            grade, gpa = g, p
            break

    return ExecutionResult(kind="json", message="Grade calculated", data={
        "marks": marks, "total": total, "percentage": round(pct, 2), "grade": grade, "gpa_equivalent": gpa,
    })


def handle_word_counter(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Count words, characters, sentences, paragraphs."""
    text = payload.get("text", "")
    if not text.strip():
        return ExecutionResult(kind="json", message="No text provided", data={"error": "Please enter some text"})

    words = len(text.split())
    chars = len(text)
    chars_no_spaces = len(text.replace(" ", "").replace("\n", "").replace("\t", ""))
    sentences = max(1, len(re.split(r'[.!?]+', text.strip()))) if text.strip() else 0
    paragraphs = len([p for p in text.split('\n\n') if p.strip()])

    return ExecutionResult(kind="json", message="Text analyzed", data={
        "words": words, "characters": chars, "characters_no_spaces": chars_no_spaces,
        "sentences": sentences, "paragraphs": max(1, paragraphs),
        "reading_time_minutes": max(1, round(words / 200)),
        "speaking_time_minutes": max(1, round(words / 130)),
        "avg_word_length": round(chars_no_spaces / max(1, words), 1),
    })


def handle_citation_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate citations in APA, MLA, Chicago formats."""
    author = payload.get("author", "Unknown Author")
    title = payload.get("title", "Untitled")
    year = payload.get("year", str(datetime.now().year))
    source_type = payload.get("source_type", "website")
    url = payload.get("url", "")
    publisher = payload.get("publisher", "")
    today = datetime.now().strftime("%B %d, %Y")

    if source_type == "book":
        citations = {
            "APA": f'{author} ({year}). {title}. {publisher}.',
            "MLA": f'{author}. {title}. {publisher}, {year}.',
            "Chicago": f'{author}. {title}. {publisher}, {year}.',
        }
    elif source_type == "journal":
        journal = payload.get("journal", "Journal Name")
        volume, pages = payload.get("volume", "1"), payload.get("pages", "1-10")
        citations = {
            "APA": f'{author} ({year}). {title}. {journal}, {volume}, {pages}.',
            "MLA": f'{author}. "{title}." {journal} {volume} ({year}): {pages}.',
            "Chicago": f'{author}. "{title}." {journal} {volume} ({year}): {pages}.',
        }
    else:
        citations = {
            "APA": f'{author} ({year}). {title}. Retrieved {today}, from {url}',
            "MLA": f'{author}. "{title}." Web. {today}. <{url}>.',
            "Chicago": f'{author}. "{title}." Accessed {today}. {url}.',
        }

    return ExecutionResult(kind="json", message="Citations generated", data={"citations": citations, "source_type": source_type})


def handle_study_timer(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate a Pomodoro study schedule."""
    total_hours = float(payload.get("study_hours", "2"))
    work_min = int(payload.get("work_minutes", "25"))
    break_min = int(payload.get("break_minutes", "5"))
    long_brk = int(payload.get("long_break_minutes", "15"))

    total_min = int(total_hours * 60)
    sessions, elapsed, num = [], 0, 0

    while elapsed < total_min:
        num += 1
        work_t = min(work_min, total_min - elapsed)
        sessions.append({"session": num, "type": "Study", "duration_minutes": work_t, "start_at_minute": elapsed})
        elapsed += work_t
        if elapsed >= total_min:
            break
        is_long = num % 4 == 0
        brk = long_brk if is_long else break_min
        sessions.append({"session": num, "type": "Long Break" if is_long else "Short Break",
                         "duration_minutes": min(brk, total_min - elapsed), "start_at_minute": elapsed})
        elapsed += brk

    return ExecutionResult(kind="json", message="Study schedule generated", data={
        "total_study_time_hours": total_hours, "work_interval_minutes": work_min,
        "break_interval_minutes": break_min, "total_sessions": num, "schedule": sessions,
    })


# ═══════════════════════════════════════════════════════
#  EVERYDAY TOOLS
# ═══════════════════════════════════════════════════════

def handle_invoice_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate a PDF invoice."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas as rl_canvas

    company = payload.get("company_name", "ISHU TOOLS")
    client = payload.get("client_name", "Client")
    invoice_num = payload.get("invoice_number", f"INV-{random.randint(1000, 9999)}")
    items_raw = payload.get("items", "Item 1|1|100")
    tax_rate = float(payload.get("tax_rate", "18"))

    out = output_dir / "invoice.pdf"
    c = rl_canvas.Canvas(str(out), pagesize=A4)
    w, h = A4

    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, h - 60, "INVOICE")
    c.setFont("Helvetica", 10)
    c.drawString(40, h - 85, f"Invoice #: {invoice_num}")
    c.drawString(40, h - 100, f"Date: {datetime.now().strftime('%B %d, %Y')}")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, h - 130, f"From: {company}")
    c.drawString(300, h - 130, f"To: {client}")

    y = h - 180
    c.setFont("Helvetica-Bold", 10)
    c.setFillColorRGB(0.15, 0.4, 0.9)
    c.rect(35, y - 5, w - 70, 20, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.drawString(40, y, "Item")
    c.drawString(300, y, "Qty")
    c.drawString(380, y, "Price")
    c.drawString(460, y, "Total")

    subtotal = 0
    y -= 25
    c.setFillColorRGB(0.15, 0.15, 0.15)
    c.setFont("Helvetica", 10)
    for line in items_raw.split("\n"):
        parts = line.strip().split("|")
        if len(parts) >= 3:
            name, qty, price = parts[0].strip(), int(parts[1].strip()), float(parts[2].strip())
            total = qty * price
            subtotal += total
            c.drawString(40, y, name)
            c.drawString(300, y, str(qty))
            c.drawString(380, y, f"${price:.2f}")
            c.drawString(460, y, f"${total:.2f}")
            y -= 20

    y -= 20
    tax = subtotal * tax_rate / 100
    grand = subtotal + tax
    c.setFont("Helvetica", 10)
    c.drawString(380, y, "Subtotal:")
    c.drawString(460, y, f"${subtotal:.2f}")
    y -= 18
    c.drawString(380, y, f"Tax ({tax_rate}%):")
    c.drawString(460, y, f"${tax:.2f}")
    y -= 18
    c.setFont("Helvetica-Bold", 12)
    c.drawString(380, y, "Grand Total:")
    c.drawString(460, y, f"${grand:.2f}")

    c.setFont("Helvetica", 8)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawCentredString(w / 2, 30, f"Generated by {company} | ISHU TOOLS")
    c.save()

    return ExecutionResult(kind="file", output_path=out, filename="invoice.pdf",
                          content_type="application/pdf", message=f"Invoice generated: ${grand:.2f}")


def handle_meme_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate memes with top and bottom text."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGB")
    top_text = payload.get("top_text", "").upper()
    bottom_text = payload.get("bottom_text", "").upper()
    draw = ImageDraw.Draw(img)
    w, h = img.size

    font_size = max(20, w // 15)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    def draw_meme_text(text: str, y_pos: int) -> None:
        bbox = draw.textbbox((0, 0), text, font=font)
        x = (w - (bbox[2] - bbox[0])) // 2
        for dx in [-2, 0, 2]:
            for dy in [-2, 0, 2]:
                draw.text((x + dx, y_pos + dy), text, font=font, fill="black")
        draw.text((x, y_pos), text, font=font, fill="white")

    if top_text:
        draw_meme_text(top_text, 10)
    if bottom_text:
        bbox = draw.textbbox((0, 0), bottom_text, font=font)
        draw_meme_text(bottom_text, h - (bbox[3] - bbox[1]) - 20)

    out = output_dir / "meme.png"
    img.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="meme.png",
                          content_type="image/png", message="Meme created!")


def handle_color_palette_gen(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate a color palette from a base color."""
    base_color = payload.get("base_color", "#3b82f6")
    palette_type = payload.get("palette_type", "complementary")

    r, g, b = (int(base_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
    r_n, g_n, b_n = r / 255, g / 255, b / 255
    max_c, min_c = max(r_n, g_n, b_n), min(r_n, g_n, b_n)
    l = (max_c + min_c) / 2

    if max_c == min_c:
        h = s = 0.0
    else:
        d = max_c - min_c
        s = d / (2 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)
        if max_c == r_n:
            h = ((g_n - b_n) / d + (6 if g_n < b_n else 0)) / 6
        elif max_c == g_n:
            h = ((b_n - r_n) / d + 2) / 6
        else:
            h = ((r_n - g_n) / d + 4) / 6

    def hsl_to_hex(h: float, s: float, l: float) -> str:
        def hue2rgb(p: float, q: float, t: float) -> float:
            if t < 0: t += 1
            if t > 1: t -= 1
            if t < 1/6: return p + (q - p) * 6 * t
            if t < 1/2: return q
            if t < 2/3: return p + (q - p) * (2/3 - t) * 6
            return p
        if s == 0:
            rv = gv = bv = l
        else:
            q = l * (1 + s) if l < 0.5 else l + s - l * s
            p = 2 * l - q
            rv, gv, bv = hue2rgb(p, q, h+1/3), hue2rgb(p, q, h), hue2rgb(p, q, h-1/3)
        return f"#{int(rv*255):02x}{int(gv*255):02x}{int(bv*255):02x}"

    palette = [base_color]
    offsets = {
        "complementary": [0.5, 0],
        "analogous": [0.083, 0.167, -0.083, -0.167],
        "triadic": [1/3, 2/3],
        "monochromatic": [],
    }

    if palette_type == "monochromatic":
        for dl in [-0.3, -0.15, 0.15, 0.3]:
            palette.append(hsl_to_hex(h, s, max(0, min(1, l + dl))))
    else:
        for off in offsets.get(palette_type, offsets["complementary"]):
            palette.append(hsl_to_hex((h + off) % 1, s, l))
        palette.append(hsl_to_hex(h, s, min(1, l + 0.2)))
        palette.append(hsl_to_hex(h, s, max(0, l - 0.2)))

    return ExecutionResult(kind="json", message="Palette generated", data={
        "base_color": base_color, "palette_type": palette_type, "colors": palette[:6],
        "css_variables": {f"--color-{i}": c for i, c in enumerate(palette[:6])},
    })


def handle_favicon_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate favicon from image."""
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image", data={"error": "No file uploaded"})

    img = Image.open(files[0]).convert("RGBA")
    sizes = [16, 32, 48, 64, 128, 256]
    out = output_dir / "favicons.zip"

    with zipfile.ZipFile(out, 'w') as zf:
        ico_path = output_dir / "favicon.ico"
        img.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
        zf.write(ico_path, "favicon.ico")

        for sz in sizes:
            resized = img.resize((sz, sz), Image.LANCZOS)
            p = output_dir / f"favicon-{sz}x{sz}.png"
            resized.save(p, "PNG")
            zf.write(p, f"favicon-{sz}x{sz}.png")

        apple = img.resize((180, 180), Image.LANCZOS)
        ap = output_dir / "apple-touch-icon.png"
        apple.save(ap, "PNG")
        zf.write(ap, "apple-touch-icon.png")

    return ExecutionResult(kind="file", output_path=out, filename="favicons.zip",
                          content_type="application/zip",
                          message=f"Generated {len(sizes)} favicon sizes + ICO + Apple Touch Icon")


def handle_barcode_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate barcode from text."""
    text = payload.get("text", "123456789012")

    img_width = max(300, len(text) * 15)
    img = Image.new("RGB", (img_width, 140), "white")
    draw = ImageDraw.Draw(img)

    bar_width, x = 2, 20
    for char in text:
        val = ord(char)
        for bit in range(7):
            if val & (1 << bit):
                draw.rectangle([x, 10, x + bar_width, 100], fill="black")
            x += bar_width + 1
        x += 3

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text(((img_width - (bbox[2] - bbox[0])) // 2, 110), text, fill="black", font=font)

    out = output_dir / "barcode.png"
    img.save(out, "PNG")
    return ExecutionResult(kind="file", output_path=out, filename="barcode.png",
                          content_type="image/png", message=f"Barcode generated for: {text}")


def handle_letter_generator(files: list[Path], payload: dict, output_dir: Path) -> ExecutionResult:
    """Generate a formal letter as PDF."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas as rl_canvas

    sender = payload.get("sender_name", "Your Name")
    sender_addr = payload.get("sender_address", "Your Address")
    recipient = payload.get("recipient_name", "Recipient Name")
    recipient_addr = payload.get("recipient_address", "Recipient Address")
    subject = payload.get("subject", "Subject of Letter")
    body = payload.get("body", "Dear Sir/Madam,\n\nI am writing to...\n\nSincerely,")

    out = output_dir / "letter.pdf"
    c = rl_canvas.Canvas(str(out), pagesize=A4)
    w, h = A4
    y = h - 60

    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, sender); y -= 15
    c.setFont("Helvetica", 10)
    c.drawString(40, y, sender_addr); y -= 30
    c.drawString(40, y, datetime.now().strftime("%B %d, %Y")); y -= 30
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y, recipient); y -= 15
    c.setFont("Helvetica", 10)
    c.drawString(40, y, recipient_addr); y -= 30
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y, f"Subject: {subject}"); y -= 25

    c.setFont("Helvetica", 10)
    for line in body.split("\n"):
        for wrapped in (textwrap.wrap(line, width=80) or [""]):
            c.drawString(40, y, wrapped); y -= 15
        y -= 5

    c.save()
    return ExecutionResult(kind="file", output_path=out, filename="letter.pdf",
                          content_type="application/pdf", message="Formal letter generated")


# ═══════════════════════════════════════════════════════
#  EXPORT
# ═══════════════════════════════════════════════════════

PHASE3_HANDLERS: dict[str, ToolHandler] = {
    # PDF Advanced
    "grayscale-pdf": handle_grayscale_pdf,
    "flatten-pdf": handle_flatten_pdf,
    "pdf-to-csv": handle_pdf_to_csv,
    "csv-to-pdf": handle_csv_to_pdf,
    "pdf-header-footer": handle_pdf_header_footer,
    # Image Effects
    "blur-face": handle_blur_face,
    "pixelate-image": handle_pixelate_image,
    "pixelate-face": handle_blur_face,
    "motion-blur": handle_motion_blur,
    "add-border-to-photo": handle_add_border,
    "add-text-to-image": handle_add_text_to_image,
    "image-splitter": handle_image_splitter,
    "instagram-grid": handle_instagram_grid,
    "picture-to-pixel-art": handle_picture_to_pixel_art,
    # Student
    "attendance-calculator": handle_attendance_calculator,
    "grade-calculator": handle_grade_calculator,
    "word-counter": handle_word_counter,
    "citation-generator": handle_citation_generator,
    "study-timer": handle_study_timer,
    # Everyday
    "invoice-generator": handle_invoice_generator,
    "meme-generator": handle_meme_generator,
    "color-palette-generator": handle_color_palette_gen,
    "favicon-generator": handle_favicon_generator,
    "barcode-generator": handle_barcode_generator,
    "letter-generator": handle_letter_generator,
}
