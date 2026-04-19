# Secondary Skills Overview — Ultra-Detailed Reference

## What This Is
A comprehensive catalog of secondary (specialized) skills available in `.local/secondary_skills/`. These are user-provided or community skills that extend the agent's capabilities beyond the core Replit skills. Each skill has a `SKILL.md` file with detailed instructions.

---

## How to Access Any Secondary Skill

```javascript
// Option 1: Direct read (when you know the skill name)
readFile(".local/secondary_skills/[skill-name]/SKILL.md")

// Option 2: Fuzzy search by topic
const results = await skillSearch("recipe generation")
// Returns: [{ name: "recipe-creator", path: "...", description: "..." }]
```

---

## Complete Secondary Skills Catalog

### Content & Marketing

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `copywriting` | Write homepage hero text, CTA buttons, pricing page copy — persuasive, conversion-optimized |
| `ad-creative` | Generate ad copy and visuals for Google/Meta ads promoting ISHU TOOLS |
| `content-machine` | Bulk-generate tool descriptions, blog posts, educational content at scale |
| `podcast-marketing` | Strategy for ISHU TOOLS YouTube/podcast content ("Top 10 PDF tools for students") |

**Most relevant for ISHU TOOLS:** `copywriting` (homepage + tool page copy), `content-machine` (bulk SEO content for 700+ tools)

---

### Business & Finance

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `competitive-analysis` | Systematic analysis of iLovePDF, SmallPDF, PDFCandy — features, SEO, pricing |
| `branding-generator` | Create ISHU TOOLS brand guidelines: colors, typography, logo usage, voice/tone |
| `invoice-generator` | Powers the Invoice Generator tool in ISHU TOOLS |
| `tax-reviewer` | Powers GST calculator, Indian income tax tools |
| `stock-analyzer` | Powers stock price/analysis tools |
| `real-estate-analyzer` | Powers EMI calculator, property value tools |

**Most relevant:** `competitive-analysis` (quarterly review of top competitors)

---

### AI & Research

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `deep-research` | In-depth research on new tool ideas, Indian student needs, competitor strategies |
| `design-thinker` | Apply design thinking framework when redesigning UX flows |
| `product-manager` | Feature prioritization, roadmap planning, user story writing |

**Most relevant:** `deep-research` (researching new tool categories to add), `product-manager` (planning the Premium tier rollout)

---

### Document Processing

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `pdf` | Python library guidance for PDF manipulation — used in backend handlers |
| `pptx` | PowerPoint manipulation — PPTX tools in ISHU TOOLS |
| `excel-generator` | Excel file creation — for spreadsheet tools |
| `file-converter` | General file conversion patterns and libraries |

**Most relevant:** `pdf` (improving PDF handlers), `pptx` (PPTX to PDF, PDF to PPTX)

**Example: Using the pdf skill for PDF compression handler:**
```python
# From pdf skill guidance:
from pypdf import PdfWriter, PdfReader
import os

def compress_pdf(input_path: str, output_path: str, quality: str = "medium") -> dict:
    reader = PdfReader(input_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        page.compress_content_streams()  # Compress page content
        writer.add_page(page)
    
    writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    original_size = os.path.getsize(input_path)
    compressed_size = os.path.getsize(output_path)
    reduction = (1 - compressed_size / original_size) * 100
    
    return {
        "original_size_kb": original_size // 1024,
        "compressed_size_kb": compressed_size // 1024,
        "reduction_percent": round(reduction, 1)
    }
```

---

### Developer Tools

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `github-solution-finder` | Find open-source libraries for implementing specific tools |
| `browser-use` | Automated testing of ISHU TOOLS tool pages |
| `skill-finder` | "Is there a skill for X?" — discover available skills |
| `skill-creator` | Create/improve skills for ISHU TOOLS-specific patterns |
| `find-skills` | Search skills by topic keyword |

**Example: Using github-solution-finder:**
```
"Find a Python library for extracting text from PDF with OCR support"
→ Finds: pdfminer.six, pytesseract, easyocr — with integration examples
```

---

### Student & Educational Tools (Match ISHU TOOLS Features)

| Skill | ISHU TOOLS Tool It Powers / Improves |
|---|---|
| `flashcard-generator` | Study flashcard tool (powers AI flashcard generation) |
| `resume-maker` | Resume builder tool |
| `interview-prep` | Interview question generator for student tools |
| `meal-planner` | Improves food calorie lookup tool content |
| `recipe-creator` | Empowers cooking tools category |

---

### Visual & Media

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `photo-editor` | Guides improvement of image processing handlers |
| `infographic-builder` | Creates visual tool comparison infographics for marketing |
| `storyboard` | Creates storyboards for ISHU TOOLS explainer videos |
| `video-editing` | Guides video tools category improvements |
| `recreate-screenshot` | Clone competitor UI from screenshots for design reference |

---

### SEO & Web Growth

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `programmatic-seo` | Generate 700+ unique, SEO-optimized tool pages systematically |
| `seo-auditor` | Alternative SEO audit tool |
| `website-cloning` | Clone design elements from competitor sites for reference |

**Most impactful:** `programmatic-seo` — This could be transformative. Instead of generic tool pages, programmatic SEO creates rich, unique pages for every tool targeting long-tail keywords like:
- "compress pdf free online no signup india"
- "merge pdf files online for students"
- "pdf to word converter hindi"

---

### Professional & Utility

| Skill | Key Use Case for ISHU TOOLS |
|---|---|
| `geo` | Geographic data for geography tools category (capitals, coordinates, country info) |
| `remotion-best-practices` | Better video tool using Remotion (React-based video framework) |
| `legal-contract` | Powers legal document tools |
| `personal-shopper` | Could power product recommendation tools |

---

## Quick Skill Discovery Pattern

```javascript
// When you need a skill but aren't sure which one:
const results = await skillSearch("extract text from image OCR");
// Returns: [{ name: "pdf", ... }, { name: "photo-editor", ... }]

// Then read the most relevant:
readFile(".local/secondary_skills/pdf/SKILL.md")
```

---

## Top 5 Secondary Skills for ISHU TOOLS (Priority)

1. **`pdf`** — Core to 100+ PDF tool handlers. Read this before improving any PDF handler.
2. **`competitive-analysis`** — Run quarterly against iLovePDF/SmallPDF to identify gaps.
3. **`programmatic-seo`** — Biggest growth lever: proper SEO for all 700+ tool pages.
4. **`copywriting`** — Homepage and tool page copy needs professional marketing writing.
5. **`branding-generator`** — ISHU TOOLS needs a consistent brand identity as it grows.
