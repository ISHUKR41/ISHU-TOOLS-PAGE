# Skill: file-converter

## Purpose
Handles file format conversion tasks — identifies the correct conversion method, required libraries, quality considerations, and provides working code or step-by-step instructions for converting between any file formats.

## When to Use
- Need to convert between document formats (PDF, DOCX, XLSX, PPTX, etc.)
- Need to convert between image formats (JPG, PNG, WebP, AVIF, etc.)
- Need to convert audio/video formats
- Need to convert data formats (JSON, CSV, XML, YAML, etc.)
- Need to convert e-book formats (EPUB, MOBI, PDF, etc.)
- Need to implement a conversion tool in the backend

## Conversion Matrix

### Document Conversions (Python Libraries)
| From → To | Library | Quality |
|-----------|---------|---------|
| PDF → DOCX | `pdf2docx` | ⭐⭐⭐⭐ |
| DOCX → PDF | `docx2pdf` / `python-docx` | ⭐⭐⭐⭐⭐ |
| PDF → HTML | `pdfminer.six` + `beautifulsoup4` | ⭐⭐⭐ |
| HTML → PDF | `weasyprint` / `xhtml2pdf` | ⭐⭐⭐⭐ |
| XLSX → CSV | `openpyxl` / `pandas` | ⭐⭐⭐⭐⭐ |
| CSV → XLSX | `openpyxl` / `pandas` | ⭐⭐⭐⭐⭐ |
| DOCX → HTML | `mammoth` | ⭐⭐⭐⭐ |
| MD → HTML | `markdown` library | ⭐⭐⭐⭐⭐ |
| MD → PDF | `markdown` + `weasyprint` | ⭐⭐⭐⭐ |
| EPUB → PDF | `calibre` CLI / `pypandoc` | ⭐⭐⭐ |

### Image Conversions (Pillow / ImageMagick)
| From → To | Method | Notes |
|-----------|--------|-------|
| PNG → WebP | `Pillow` | Lossless or lossy |
| JPG → PNG | `Pillow` | Quality preserved |
| Any → AVIF | `pillow-avif-plugin` | Best web format |
| HEIC → JPG | `pillow-heif` | iOS photo format |
| SVG → PNG | `cairosvg` | Vector to raster |
| GIF → MP4 | `ffmpeg` | Video from animation |
| RAW → JPG | `rawpy` + `imageio` | Camera raw files |

### Data Conversions (Pure Python)
| From → To | Library | Notes |
|-----------|---------|-------|
| JSON → CSV | `pandas` / `json` | Flatten nested JSON |
| CSV → JSON | `pandas` | Column-based mapping |
| XML → JSON | `xmltodict` | Preserves attributes |
| JSON → XML | `dicttoxml` | Configurable namespace |
| YAML → JSON | `pyyaml` | YAML as JSON superset |
| JSON → YAML | `pyyaml` | Cleaner config files |
| TOML → JSON | `tomllib` (py3.11+) | Config files |
| INI → JSON | `configparser` | Legacy config |

### Audio Conversions (pydub + ffmpeg)
| From | To | Command |
|------|----|---------|
| MP3 | WAV | `AudioSegment.from_mp3(f).export("out.wav")` |
| WAV | MP3 | `AudioSegment.from_wav(f).export("out.mp3", format="mp3", bitrate="192k")` |
| M4A | MP3 | `AudioSegment.from_file(f, "m4a").export(...)` |
| Any | OGG | `AudioSegment.from_file(f).export("out.ogg", format="ogg")` |
| FLAC | WAV | ffmpeg: `ffmpeg -i input.flac output.wav` |

## Code Examples

### PDF to DOCX (Python)
```python
from pdf2docx import Converter

def pdf_to_docx(input_path: str, output_path: str) -> None:
    cv = Converter(input_path)
    cv.convert(output_path, start=0, end=None)
    cv.close()
```

### Image Format Conversion (Pillow)
```python
from PIL import Image

def convert_image(input_path: str, output_path: str, quality: int = 85) -> dict:
    with Image.open(input_path) as img:
        # Convert to RGB if needed (for JPEG)
        if img.mode in ('RGBA', 'P') and output_path.endswith('.jpg'):
            img = img.convert('RGB')
        img.save(output_path, quality=quality, optimize=True)
    
    return {
        "original_format": img.format,
        "output_format": output_path.split('.')[-1].upper(),
        "size": img.size,
        "mode": img.mode,
    }
```

### JSON ↔ CSV (Pandas)
```python
import pandas as pd
import json

def json_to_csv(json_path: str, csv_path: str) -> None:
    with open(json_path) as f:
        data = json.load(f)
    df = pd.json_normalize(data)
    df.to_csv(csv_path, index=False)

def csv_to_json(csv_path: str, json_path: str, orient: str = "records") -> None:
    df = pd.read_csv(csv_path)
    df.to_json(json_path, orient=orient, indent=2)
```

### XLSX to CSV (openpyxl)
```python
import openpyxl
import csv

def xlsx_to_csv(xlsx_path: str, csv_path: str, sheet_name: str = None) -> None:
    wb = openpyxl.load_workbook(xlsx_path)
    ws = wb[sheet_name] if sheet_name else wb.active
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for row in ws.iter_rows(values_only=True):
            writer.writerow(row)
```

## Quality Considerations

### Document Conversions
- **PDF → DOCX**: Complex layouts (multi-column, tables with borders) may lose formatting
- **DOCX → PDF**: Near-perfect if using LibreOffice or Word engine
- **HTML → PDF**: CSS support varies by engine (WeasyPrint supports most CSS3)

### Image Conversions  
- **JPEG quality**: 85 = excellent quality, 70 = web optimized, 60 = small file
- **PNG → WebP**: 25-35% smaller with same quality
- **SVG → PNG**: Must specify DPI (72=screen, 300=print)

## Supported Format Summary (ISHU TOOLS)
```
Documents: PDF, DOCX, XLSX, PPTX, ODT, ODS, ODP, RTF, TXT, MD, HTML, EPUB
Images: JPG, PNG, WebP, AVIF, GIF, SVG, HEIC, BMP, TIFF, ICO, PSD
Audio: MP3, WAV, OGG, M4A, FLAC, AAC
Data: JSON, CSV, XML, YAML, TOML, INI
Archives: ZIP, TAR, GZ (extraction + creation)
```

## Related Skills
- `pdf` — PDF-specific operations
- `pptx` — PowerPoint creation and editing
- `excel-generator` — Excel spreadsheet creation
- `photo-editor` — image manipulation beyond conversion
