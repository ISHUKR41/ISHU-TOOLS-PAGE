# PDF Skill — Comprehensive PDF Processing

## What It Does
All PDF operations: reading/extracting text from PDFs, combining/merging, splitting, rotating, adding watermarks, filling forms, encrypting/decrypting, extracting images, OCR on scanned PDFs, and creating new PDFs.

---

## Activation Triggers
- Any `.pdf` file involvement
- "Read a PDF", "extract text from PDF"
- "Merge / combine PDFs"
- "Split a PDF", "rotate pages"
- "Add watermark to PDF"
- "Fill PDF form"
- "Encrypt / protect PDF"
- "OCR scanned PDF"
- "Convert PDF to Word/Excel"
- "Create a PDF from scratch"

---

## Available Python Libraries (Backend)
ISHU TOOLS backend has these PDF libraries pre-installed:

| Library | Best For |
|---|---|
| `PyMuPDF (fitz)` | Fast text extraction, rendering, page manipulation |
| `pikepdf` | Encryption, decryption, structural editing |
| `pypdf` | Merging, splitting, page manipulation |
| `reportlab` | Create PDFs from scratch (text, tables, charts) |
| `pdf2docx` | PDF to Word/DOCX conversion |
| `pdfplumber` | Table extraction from PDFs |
| `pypdfium2` | High-fidelity PDF rendering |

---

## Common Operations

### Extract Text
```python
import fitz
doc = fitz.open("file.pdf")
text = "\n".join(page.get_text() for page in doc)
```

### Merge PDFs
```python
import pypdf
merger = pypdf.PdfMerger()
for path in pdf_files:
    merger.append(path)
merger.write("merged.pdf")
```

### Extract Tables
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
```

### Create PDF
```python
from reportlab.pdfgen import canvas
c = canvas.Canvas("output.pdf")
c.drawString(100, 750, "Hello from ISHU TOOLS!")
c.save()
```

### Protect/Encrypt PDF
```python
import pikepdf
with pikepdf.open("input.pdf") as pdf:
    pdf.save("protected.pdf", encryption=pikepdf.Encryption(
        owner="ownerpass", user="userpass", R=4
    ))
```

---

## ISHU TOOLS PDF Tool Categories
1. **PDF Core**: Merge, Split, Compress, Rotate, Watermark
2. **PDF Security**: Protect, Unlock, Redact, Sign
3. **PDF Advanced**: Organize, Compare, Translate, OCR
4. **Office Suite**: PDF ↔ Word, Excel, PowerPoint
5. **PDF Insights**: Extract text, tables, images, metadata

---

## Tips
- For scanned PDFs → use `rapidocr` or `pytesseract` for OCR
- For large PDFs → process page by page to avoid memory issues
- For tables → `pdfplumber` is significantly better than basic text extraction
- For complex layouts → use `PyMuPDF` with block-level extraction
