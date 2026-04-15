# ISHU TOOLS

## Overview
A fully functional, professional web platform with 295 PDF, Image, Text, and AI tools. Dark-themed, animated, modern React frontend (Vite + TypeScript) and FastAPI Python backend.

## Architecture
- **Frontend**: React + Vite + TypeScript, Framer Motion animations, Lucide icons, dark theme
  - Port: 5000 (dev server)
  - Entry: `frontend/src/main.tsx`
  - Routing: React Router v6
  - Key pages: HomePage (`/`), ToolPage (`/tools/:slug`)
  - Layout: `SiteShell` wraps all pages — nav + footer
- **Backend**: FastAPI (Python)
  - Port: 8000
  - Entry: `backend/run.py`
  - Tool registry: `backend/app/registry.py`
  - Tool handlers: `backend/app/tools/handlers.py`
  - All 295 tools have registered handlers (verified 0 missing)

## Key Files
- `backend/app/registry.py` — 295 tool definitions (slug, title, category, tags, input_kind)
- `backend/app/tools/handlers.py` — all handler functions
- `backend/app/main.py` — FastAPI app with non-ASCII header sanitization
- `frontend/src/index.css` — all CSS (dark theme, animations, gradient text)
- `frontend/src/components/layout/SiteShell.tsx` — nav header + footer
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner UI
- `frontend/src/features/tool/components/ToolSidebar.tsx` — tool sidebar
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid
- `frontend/src/features/home/components/HeroSection.tsx` — hero banner

## Tool Categories (22 total)
- PDF Core: merge, split, compress, rotate, watermark, protect, unlock, OCR
- PDF Conversion: to/from Word, Excel, PPT, images, ebook formats
- PDF Advanced: rearrange pages, compare, flatten, annotate, sign, redact
- Image Core: compress, resize, crop, flip, rotate, convert, remove-bg
- Image Effects: watermark, blur, grayscale, pixelate, meme, collage
- Document Convert: docx/xlsx/pptx/csv to/from PDF, HTML to PDF, Markdown
- Text/AI: translate, summarize, OCR, QR code, word count, barcode
- And more: page operations, metadata, security, formats...

## Backend Libraries
FastAPI, PyMuPDF/fitz, pikepdf, pypdf, reportlab, WeasyPrint, Pillow, opencv-headless, rembg, rapidocr, deep-translator, python-docx, python-pptx, openpyxl, qrcode, bs4, httpx

## Design System
- Dark theme: background #020d18, accent #3bd0ff (teal-blue), gradient text on H1
- Font: Space Grotesk (display), Manrope (body)
- Tool card colors: per-category accent colors via getCategoryTheme()
- Animations: Framer Motion for page transitions and hover effects

## Important Bugs Fixed
- Compress PDF: now returns original file when compression fails to improve size
- HTTP header encoding: non-ASCII characters in X-Tool-Message are now sanitized globally
- Em dash in message strings replaced with regular hyphens
- header-and-footer tool added to registry, handler, and toolFields

## Social Links
- LinkedIn: https://linkedin.com/in/ishu
- Instagram: @ishukr10
- YouTube: @ishu-fun
- X/Twitter: @ISHU_IITP

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
