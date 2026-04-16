# ISHU TOOLS

## Overview
ISHU TOOLS (Indian Student Hub University Tools) — a full-stack free online toolkit with 449 raw registry entries, 422 unique tool slugs after client-side deduplication, across 33 categories: PDF, Image, Developer, Math, Text, AI, Color, Security, Conversion, Social Media, and Student Tools. Dark-themed, animated, SEO-optimized, modern React frontend (Vite + TypeScript) and FastAPI Python backend.

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
  - Tool handlers: `backend/app/tools/handlers.py` + `developer_handlers.py` + `everyday_handlers.py` + `production_handlers.py` + `new_tools_handlers.py` + `extra_tools_handlers.py`
  - 449 raw registry entries, 422 unique tool slugs, and 439 available backend handlers

## Key Files
- `backend/app/registry.py` — tool definitions (slug, title, category, tags, input_kind)
- `backend/app/tools/handlers.py` — main handler functions
- `backend/app/main.py` — FastAPI app with /sitemap.xml + /robots.txt dynamic endpoints
- `frontend/src/index.css` — all CSS (dark theme, hero-v2, mega-menu, animations, responsive) ~3700+ lines
- `frontend/src/components/layout/SiteShell.tsx` — mega-menu nav + expanded footer (9 links/col)
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner with FAQ/SEO sections
- `frontend/src/features/tool/components/ToolSidebar.tsx` — tool sidebar with "How to use" steps
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid + FAQ + how-to
- `frontend/src/features/home/components/HeroSection.tsx` — hero-v2 redesign with animated stats
- `frontend/src/lib/seoData.ts` — per-tool SEO data (156+ handcrafted entries)
- `frontend/src/lib/toolPresentation.ts` — category themes, tool input/output helpers, getToolUsageSteps()
- `frontend/src/hooks/useCatalogData.ts` — deduplicates categories+tools from API
- `frontend/public/robots.txt` — no JS/CSS blocking (SPA friendly)
- `frontend/public/sitemap.xml` — static sitemap; FastAPI also serves a dynamic sitemap from the current backend registry

## SEO Features
- Per-tool dynamic meta tags (title, description, keywords, canonical, OG, Twitter cards)
- Per-tool JSON-LD structured data (WebApplication, Organization, HowTo, BreadcrumbList)
- Per-tool FAQ JSON-LD (from seoData.ts — 156+ handcrafted entries)
- Dynamic sitemap.xml (also served by FastAPI at /sitemap.xml)
- robots.txt with no JS/CSS asset blocking (critical for SPA crawlability)
- sitemap.xml: generated dynamically from current tool slugs + categories + homepage + /tools
- Comprehensive long-tail keywords per tool in seoData.ts, including fallback student, mobile, no-login, privacy, and category-intent terms for every future tool
- Category pages include enriched meta tags, canonical URLs, Open Graph/Twitter metadata, CollectionPage JSON-LD, popular tool links, and long-tail category copy
- WebSite SearchAction schema in index.html for Google sitelinks searchbox

## Design System
- Dark bg: #03060e — accent: #3bd0ff (teal-blue) — hero gradient: teal-to-purple
- Font: Space Grotesk (display), Manrope (body)
- Hero V2: animated orbs, grid overlay, large gradient heading, stats counter, ticker, trust badges
- Tool card: per-category accent, hover radial glow, spring animation, CSS glow effect
- Animations: Framer Motion (page, cards, hero sections), CSS keyframes (orbs, ticker, pulse, floatOrb)
- Mega-menu: 6-column dropdown with 12 links per category
- Responsive: full mobile support with mobile nav panel
- Custom scrollbar styling with accent color
- FAQ accordion with open animations
- Gradient border for CTA buttons
- Social chip/trust badge hover effects
- Reduced-motion and slow-device CSS guards disable expensive animations; mobile disables heavy blur on major surfaces for smoother performance

## Tool "How to use" Steps (getToolUsageSteps in toolPresentation.ts)
Per-category smart steps:
- QR/barcode tools: "Enter URL/data → Customize size/format → Click Generate, download"
- Password generator: "Set length → Toggle character types → Click Generate"
- Math/calculator tools: "Enter values → Select units → Click Calculate/Convert"
- Color tools: "Enter color value → Adjust options → Copy values"
- Hash/crypto tools: "Paste text/file → Choose algorithm → Click Run"
- Student/SEO tools: "Fill in details → Adjust options → Click Run, copy/download"
- Developer/text/format tools: "Paste code/text → Adjust options → Click Run"
- PDF security: "Upload PDF → Enter password/settings → Click Run, download"
- Text/AI tools: "Paste text or upload → Choose language → Click Run"
- Image tools: "Upload image → Tune settings → Click Run, download"
- PDF tools (general): "Upload PDF → Set options → Click Run, download"
- Document/office/ebook: "Upload document → Select format → Click Run, download"

## Tool Categories (33 unique)
- PDF Core, PDF Security, PDF Advanced, PDF Insights
- Image Core (image-core: 48), Image Effects, Image Enhance (22), Image Layout (45)
- Document Convert, Office Suite, OCR Vision, eBook Convert, Vector Lab
- Text AI, Text Cleanup, Text Ops, Format Lab (28)
- Developer Tools (43), Code Tools, Color Tools, Hash/Crypto, SEO Tools
- Math Tools, Unit Converter, Student Tools (24), Security Tools, Conversion Tools, Social Media
- Batch Automation, Page Ops (15), Data Tools, Archive Lab, Utility

## Backend Libraries
FastAPI, PyMuPDF/fitz, pikepdf, pypdf, reportlab, WeasyPrint, Pillow, opencv-headless, rembg, rapidocr, deep-translator, python-docx, python-pptx, openpyxl, qrcode, bs4, httpx, python-barcode

## Important Bugs Fixed
- Compress PDF: returns original when compression fails
- HTTP header encoding: non-ASCII chars in X-Tool-Message sanitized globally
- Duplicate categories/tools in registry: deduplicated in useCatalogData.ts (client-side)
- robots.txt was incorrectly blocking /assets/, *.js$, *.css$ — now fixed (SPA crawlability)
- Tool "How to use" steps now correctly show per-category steps (not generic file upload for all)
- QR code generator now shows correct steps (not the generic developer tool steps)
- Added 8 real student/everyday tools: Citation Generator, Flashcard Generator, Study Planner, Grade Calculator, Attendance Calculator, Reading Time Calculator, Plagiarism Risk Checker, Resume Bullet Generator

## Social Links
- LinkedIn: https://linkedin.com/in/ishu-kumar-5a0940281/
- Instagram: @ishukr10
- YouTube: @ishu-fun
- X/Twitter: @ISHU_IITP

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
