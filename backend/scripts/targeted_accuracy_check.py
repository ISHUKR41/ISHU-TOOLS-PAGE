from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.tools.handlers import HANDLERS, create_job_workspace, extract_pdf_text
from backend.scripts.smoke_tool_matrix import prepare_fixtures


def run_tool(slug: str, file_keys: list[str], payload: dict, fixtures: dict[str, Path]) -> None:
    job_id, input_dir, output_dir = create_job_workspace()
    local_files: list[Path] = []

    for key in file_keys:
        source = fixtures[key]
        destination = input_dir / source.name
        shutil.copy(source, destination)
        local_files.append(destination)

    result = HANDLERS[slug](local_files, payload, output_dir)
    if result.kind != "file" or result.output_path is None or not result.output_path.exists():
        raise RuntimeError(f"{slug}: expected file output")

    output_size_kb = round(result.output_path.stat().st_size / 1024, 1)
    print(f"[{slug}] PASS -> {result.output_path.name} ({output_size_kb} KB)")

    if slug == "pdf-to-html":
        html_text = result.output_path.read_text(encoding="utf-8", errors="ignore")
        lowered = html_text.lower()
        if "<html" not in lowered:
            raise RuntimeError("pdf-to-html: output is not valid HTML")
        if "pdf-page" not in lowered and "<pre>" not in lowered:
            raise RuntimeError("pdf-to-html: expected page/content markup not found")

    if slug in {"ocr-pdf", "pdf-ocr"}:
        text = extract_pdf_text(result.output_path)
        alnum_chars = len("".join(ch for ch in text if ch.isalnum()))
        print(f"[{slug}] OCR_EXTRACTED_ALNUM={alnum_chars}")
        if alnum_chars < 30:
            raise RuntimeError(f"{slug}: OCR searchable text too low")


if __name__ == "__main__":
    fixtures_dir = ROOT_DIR / "backend" / "storage" / "smoke-fixtures"
    fixtures = prepare_fixtures(fixtures_dir)

    run_tool("pdf-to-html", ["pdf"], {}, fixtures)
    run_tool("pdf-to-excel", ["pdf"], {}, fixtures)
    run_tool("ocr-pdf", ["ocr_pdf"], {}, fixtures)
    run_tool("pdf-ocr", ["ocr_pdf"], {}, fixtures)

    print("TARGETED_ACCURACY_CHECK=OK")
