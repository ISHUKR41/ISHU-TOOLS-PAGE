# ISHU TOOLS

## Overview
A fully functional, professional web platform with 193+ PDF, Image, Text, and AI tools. Dark-themed, animated, modern React frontend (Vite + TypeScript) and FastAPI Python backend.

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
  - All 193 tools have registered handlers

## Key Files
- `backend/app/registry.py` — 193 tool definitions (slug, title, category, tags, input_kind)
- `backend/app/tools/handlers.py` — handler functions for all tools
- `frontend/src/index.css` — all CSS (dark theme, animations, components)
- `frontend/src/components/layout/SiteShell.tsx` — nav header + footer
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner UI
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid
- `frontend/src/features/home/components/HeroSection.tsx` — hero banner

## Tool Categories
- PDF Core (merge, split, compress, rotate, watermark, protect, unlock, OCR...)
- PDF Conversion (to/from Word, Excel, PPT, images, ebook formats...)
- Image Tools (compress, resize, crop, remove-bg, convert, watermark...)
- AI Tools (translate, summarize, chat-with-pdf, OCR, QR...)
- Text & Export (JSON to CSV, CSV to Excel, extract text, etc.)

## Backend Libraries
FastAPI, PyMuPDF/fitz, pypdf, reportlab, Pillow, opencv-headless, rembg, rapidocr, deep-translator, python-docx, python-pptx, openpyxl, odfpy, ebooklib, qrcode, bs4, httpx, rarfile, ezdxf, matplotlib

## Design Inspiration
iLovePDF, iLoveIMG, PDF Candy, Apple, Stripe, Figma — dark, minimal, modern

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
