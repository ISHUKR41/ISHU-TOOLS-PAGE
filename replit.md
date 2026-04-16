# ISHU TOOLS

## Overview
ISHU TOOLS (Indian Student Hub University Tools) — a full-stack free online toolkit with 349+ unique tools (441+ including variants) across 26 categories: PDF, Image, Developer, Math, Text, AI, Color, Security, Conversion, Social Media. Dark-themed, animated, SEO-optimized, modern React frontend (Vite + TypeScript) and FastAPI Python backend.

## Architecture
- **Frontend**: React + Vite + TypeScript, Framer Motion animations, Lucide icons, dark theme
  - Port: 5000 (dev server)
  - Entry: `frontend/src/main.tsx`
  - Routing: React Router v6
  - Key pages: HomePage (`/`), ToolPage (`/tools/:slug`), CategoryPage (`/category/:id`), AllToolsPage (`/tools`)
  - Layout: `SiteShell` wraps all pages — mega-menu nav + expanded footer
- **Backend**: FastAPI (Python)
  - Port: 8000
  - Entry: `backend/run.py`
  - Tool registry: `backend/app/registry.py`
  - Tool handlers: `backend/app/tools/handlers.py`
  - 431 registered handlers (GRAND TOTAL including extra/new handlers)

## Key Files
- `backend/app/registry.py` — tool definitions (slug, title, category, tags, input_kind)
- `backend/app/tools/handlers.py` — all handler functions (431 total)
- `backend/app/main.py` — FastAPI app with /sitemap.xml + /robots.txt dynamic endpoints
- `frontend/src/index.css` — all CSS (dark theme, hero-v2, mega-menu, animations, responsive)
- `frontend/src/components/layout/SiteShell.tsx` — mega-menu nav + expanded footer (9 links/col)
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner with FAQ/SEO sections
- `frontend/src/features/tool/components/ToolSidebar.tsx` — tool sidebar
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid + FAQ + how-to
- `frontend/src/features/home/components/HeroSection.tsx` — hero-v2 redesign
- `frontend/src/lib/seoData.ts` — per-tool SEO data (title, desc, keywords, FAQ)
- `frontend/src/lib/toolPresentation.ts` — category themes, tool input/output helpers
- `frontend/src/hooks/useCatalogData.ts` — deduplicates categories+tools from API
- `frontend/public/robots.txt` — no JS/CSS blocking (SPA friendly)
- `frontend/public/sitemap.xml` — 414 tools + 33 categories = 448 URLs

## SEO Features
- Per-tool dynamic meta tags (title, description, keywords, canonical, OG, Twitter cards)
- Per-tool JSON-LD structured data (WebApplication, Organization)
- Per-tool FAQ JSON-LD (from seoData.ts)
- Dynamic sitemap.xml (also served by FastAPI at /sitemap.xml)
- robots.txt with no JS/CSS asset blocking (critical for SPA crawlability)
- sitemap.xml: 414 tool slugs + 33 categories + homepage + /tools = 450 URLs
- Comprehensive long-tail keywords per tool in seoData.ts

## Design System
- Dark bg: #03060e — accent: #3bd0ff (teal-blue) — hero gradient: teal-to-purple
- Font: Space Grotesk (display), Manrope (body)
- Hero V2: animated orbs, grid overlay, large gradient heading, stats counter, ticker, trust badges
- Tool card: per-category accent, hover radial glow, spring animation
- Animations: Framer Motion (page, cards, hero sections), CSS keyframes (orbs, ticker, pulse)
- Mega-menu: 6-column dropdown with 12 links per category
- Responsive: full mobile support with mobile nav panel

## Tool Categories (26 unique after deduplication)
- PDF Core, PDF Security, PDF Advanced, PDF Insights
- Image Core, Image Effects, Image Enhance, Image Layout
- Document Convert, Office Suite, OCR Vision, eBook Convert, Vector Lab
- Text AI, Text Cleanup, Text Ops, Format Lab
- Developer Tools, Code Tools, Color Tools, Hash/Crypto, SEO Tools
- Math Tools, Unit Converter, Student Tools, Security Tools, Conversion Tools, Social Media
- Batch Automation, Page Ops, Data Tools, Archive Lab

## Backend Libraries
FastAPI, PyMuPDF/fitz, pikepdf, pypdf, reportlab, WeasyPrint, Pillow, opencv-headless, rembg, rapidocr, deep-translator, python-docx, python-pptx, openpyxl, qrcode, bs4, httpx, python-barcode

## Important Bugs Fixed
- Compress PDF: returns original when compression fails
- HTTP header encoding: non-ASCII chars in X-Tool-Message sanitized globally
- Duplicate categories/tools in registry: deduplicated in useCatalogData.ts (client-side)
- robots.txt was incorrectly blocking /assets/, *.js$, *.css$ — now fixed (SPA crawlability)

## Social Links
- LinkedIn: https://linkedin.com/in/ishu-kumar-5a0940281/
- Instagram: @ishukr10
- YouTube: @ishu-fun
- X/Twitter: @ISHU_IITP

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
