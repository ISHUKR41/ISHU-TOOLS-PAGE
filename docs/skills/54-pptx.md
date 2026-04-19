# PPTX Skill — PowerPoint Presentation Processing

## What It Does
All `.pptx` operations: creating slide decks, reading/extracting text from PPTX files, editing slides, adding/removing slides, working with templates, converting, merging, and extracting speaker notes.

---

## Activation Triggers
- Any `.pptx` file mentioned
- "Create a slide deck / pitch deck / presentation"
- "Read / parse / extract text from a PPTX file"
- "Edit / update / modify a presentation"
- "Convert PPTX to PDF / images"
- "Combine / merge slide files"
- "Extract speaker notes / comments"
- Keywords: "deck", "slides", "presentation", "PowerPoint"

---

## Available Library: python-pptx

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
```

---

## Core Operations

### Create a New Presentation
```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

prs = Presentation()
# Slide layout: 0=title, 1=title+content, 5=blank
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)

# Set title
title = slide.shapes.title
title.text = "ISHU TOOLS"

# Set body
body = slide.placeholders[1]
body.text = "Your Ultimate Free Toolkit"
body.text_frame.paragraphs[0].font.size = Pt(24)
body.text_frame.paragraphs[0].font.color.rgb = RGBColor(0x3B, 0xD0, 0xFF)

prs.save("presentation.pptx")
```

### Read / Extract Text
```python
from pptx import Presentation

prs = Presentation("input.pptx")
for i, slide in enumerate(prs.slides, 1):
    print(f"\n--- Slide {i} ---")
    for shape in slide.shapes:
        if shape.has_text_frame:
            for para in shape.text_frame.paragraphs:
                print(para.text)
```

### Extract Speaker Notes
```python
for slide in prs.slides:
    notes = slide.notes_slide.notes_text_frame.text if slide.has_notes_slide else ""
    print(notes)
```

### Add Image to Slide
```python
slide.shapes.add_picture("image.png", Inches(1), Inches(1), Inches(4), Inches(3))
```

### Add Table
```python
from pptx.util import Inches
rows, cols = 3, 4
table = slide.shapes.add_table(rows, cols, Inches(1), Inches(2), Inches(8), Inches(3))
table.table.cell(0, 0).text = "Header"
```

---

## ISHU TOOLS Backend
ISHU TOOLS has `python-pptx` and `LibreOffice` available:
- Use `python-pptx` for reading and creating PPTX files
- Use `LibreOffice (soffice)` for converting PPTX to PDF
- The `office-suite` tool category handles PDF ↔ PPTX conversions

---

## PPTX → PDF Conversion (via LibreOffice)
```python
import subprocess
soffice = "/usr/bin/soffice"  # or get_soffice_binary()
subprocess.run([soffice, "--headless", "--convert-to", "pdf", "input.pptx"], 
               capture_output=True)
```

---

## Tips
- Always call `prs.save()` at the end
- Slide layouts: 0=Title Slide, 1=Title+Content, 2=Title Only, 5=Blank
- Use `Inches()` for positioning, `Pt()` for font sizes, `RGBColor(r,g,b)` for colors
- For complex templates, use an existing PPTX as a template instead of building from scratch
