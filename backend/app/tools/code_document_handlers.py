from __future__ import annotations

import ast
import re
from pathlib import Path
from typing import Any

from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

from .handlers import ExecutionResult


MAX_PY_SOURCE_BYTES = 2 * 1024 * 1024


def _coerce_bool(value: Any, default: bool = True) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "y", "on"}


def _coerce_font_size(value: Any) -> int:
    try:
        return max(7, min(12, int(float(value))))
    except (TypeError, ValueError):
        return 9


def _safe_filename(name: str, suffix: str = ".pdf") -> str:
    stem = re.sub(r"[^A-Za-z0-9_.-]+", "_", Path(name or "python-code").stem).strip("._")
    return f"{stem or 'python-code'}{suffix}"


def _read_python_source(files: list[Path], payload: dict[str, Any]) -> tuple[str, str, int]:
    if files:
        source_path = next((path for path in files if path.suffix.lower() == ".py"), files[0])
        if source_path.suffix.lower() != ".py":
            raise ValueError("Please upload a .py Python file.")
        size = source_path.stat().st_size
        if size > MAX_PY_SOURCE_BYTES:
            raise ValueError("Python file is too large. Upload a file under 2 MB.")
        raw = source_path.read_bytes()
        if b"\x00" in raw[:4096]:
            raise ValueError("This looks like a binary file. Upload plain Python source code.")
        return raw.decode("utf-8", errors="replace"), source_path.name, size

    text = str(payload.get("code") or payload.get("text") or "").strip()
    if not text:
        raise ValueError("Upload a .py file or paste Python code.")
    encoded = text.encode("utf-8", errors="replace")
    if len(encoded) > MAX_PY_SOURCE_BYTES:
        raise ValueError("Python code is too large. Keep it under 2 MB.")
    return text, "pasted-python-code.py", len(encoded)


def _source_outline(source: str) -> tuple[list[str], list[str], str | None]:
    classes: list[str] = []
    functions: list[str] = []
    syntax_warning: str | None = None
    try:
        tree = ast.parse(source)
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                classes.append(node.name)
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                functions.append(node.name)
    except SyntaxError as exc:
        syntax_warning = f"Syntax warning near line {exc.lineno or '?'}: PDF created without executing the file."
    return classes[:20], functions[:30], syntax_warning


def _draw_header(pdf: canvas.Canvas, page_width: float, page_height: float, title: str, page_no: int) -> None:
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(36, page_height - 28, title[:90])
    pdf.setFont("Helvetica", 8)
    pdf.drawRightString(page_width - 36, 18, f"Page {page_no} - ISHU TOOLS Python to PDF")
    pdf.line(36, page_height - 34, page_width - 36, page_height - 34)


def _write_wrapped_line(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font_name: str,
    font_size: int,
) -> list[str]:
    chunks: list[str] = []
    current = ""
    for char in text:
        trial = current + char
        if current and pdfmetrics.stringWidth(trial, font_name, font_size) > max_width:
            chunks.append(current)
            current = char
        else:
            current = trial
    chunks.append(current)
    return chunks or [""]


def _create_python_pdf(
    source: str,
    output_path: Path,
    source_name: str,
    source_size: int,
    payload: dict[str, Any],
) -> None:
    page_size = letter if str(payload.get("page_size", "a4")).lower() == "letter" else A4
    font_size = _coerce_font_size(payload.get("font_size"))
    include_line_numbers = _coerce_bool(payload.get("include_line_numbers"), True)
    include_summary = _coerce_bool(payload.get("include_summary"), True)

    classes, functions, syntax_warning = _source_outline(source)
    lines = source.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    page_width, page_height = page_size
    margin_x = 36
    margin_top = 48
    margin_bottom = 36
    line_height = max(10, font_size + 3)
    line_no_width = 38 if include_line_numbers else 0
    code_x = margin_x + line_no_width
    max_code_width = page_width - code_x - margin_x

    pdf = canvas.Canvas(str(output_path), pagesize=page_size)
    pdf.setTitle(f"Python to PDF - {source_name}")
    page_no = 1
    _draw_header(pdf, page_width, page_height, source_name, page_no)
    y = page_height - margin_top

    if include_summary:
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(margin_x, y, "Python Source PDF")
        y -= 24
        pdf.setFont("Helvetica", 10)
        summary = [
            f"File: {source_name}",
            f"Size: {source_size:,} bytes",
            f"Lines: {len(lines):,}",
            f"Classes: {', '.join(classes) if classes else 'None detected'}",
            f"Functions: {', '.join(functions[:12]) if functions else 'None detected'}",
        ]
        if syntax_warning:
            summary.append(syntax_warning)
        for item in summary:
            for chunk in _write_wrapped_line(pdf, item, margin_x, y, page_width - (2 * margin_x), "Helvetica", 10):
                pdf.drawString(margin_x, y, chunk)
                y -= 14
        y -= 12
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(margin_x, y, "Source Code")
        y -= 18

    pdf.setFont("Courier", font_size)
    for index, raw_line in enumerate(lines, start=1):
        clean_line = raw_line.expandtabs(4)
        clean_line = "".join(ch if ch == "\t" or ch == " " or ch.isprintable() else " " for ch in clean_line)
        wrapped = _write_wrapped_line(pdf, clean_line, code_x, y, max_code_width, "Courier", font_size)
        for part_index, chunk in enumerate(wrapped):
            if y < margin_bottom:
                pdf.showPage()
                page_no += 1
                _draw_header(pdf, page_width, page_height, source_name, page_no)
                pdf.setFont("Courier", font_size)
                y = page_height - margin_top
            if include_line_numbers and part_index == 0:
                pdf.setFillColorRGB(0.38, 0.42, 0.48)
                pdf.drawRightString(margin_x + line_no_width - 8, y, str(index))
                pdf.setFillColorRGB(0, 0, 0)
            pdf.drawString(code_x, y, chunk)
            y -= line_height

    pdf.save()


def handle_python_to_pdf(files: list[Path], payload: dict[str, Any], output_dir: Path) -> ExecutionResult:
    try:
        source, source_name, source_size = _read_python_source(files, payload)
    except ValueError as exc:
        return ExecutionResult(
            kind="json",
            message=str(exc),
            data={"error": "invalid_python_input", "fallback_mode": True},
        )

    output_path = output_dir / _safe_filename(source_name)
    try:
        _create_python_pdf(source, output_path, source_name, source_size, payload)
    except Exception:
        try:
            from .handlers import text_to_pdf

            text_to_pdf(source, output_path, title=f"Python Source - {source_name}")
        except Exception:
            return ExecutionResult(
                kind="json",
                message="Could not create the PDF right now. Please retry with a smaller plain-text Python file.",
                data={"error": "pdf_generation_failed", "fallback_mode": True},
            )

    return ExecutionResult(
        kind="file",
        message="Python file converted to a readable PDF with code formatting.",
        output_path=output_path,
        filename=output_path.name,
        content_type="application/pdf",
    )


CODE_DOCUMENT_HANDLERS: dict[str, Any] = {
    "python-to-pdf": handle_python_to_pdf,
    "py-to-pdf": handle_python_to_pdf,
    "python-file-to-pdf": handle_python_to_pdf,
}
