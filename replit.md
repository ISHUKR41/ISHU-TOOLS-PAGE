# ISHU TOOLS

## Overview
ISHU TOOLS (Indian Student Hub University Tools) — a full-stack free online toolkit with 449 tools across 33 categories: PDF, Image, Developer, Math, Text, AI, Color, Security, Conversion, Social Media, and Student Tools. Dark-themed, performance-optimized, SEO-first, modern React frontend (Vite + TypeScript) and FastAPI Python backend.

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
- `frontend/src/index.css` — all CSS (dark theme, hero-v2, mega-menu, animations, responsive, bento-grid, shimmer skeleton) ~4880 lines
- `frontend/src/components/layout/SiteShell.tsx` — mega-menu nav + expanded footer (9 links/col)
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner with FAQ/SEO sections
- `frontend/src/features/tool/components/ToolSidebar.tsx` — tool sidebar with "How to use" steps
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid + FAQ + how-to
- `frontend/src/features/home/components/HeroSection.tsx` — hero-v2 redesign with animated stats
- `frontend/src/lib/seoData.ts` — per-tool SEO data (286 handcrafted entries + smart auto-generator v2 fallback)
- `frontend/src/lib/toolPresentation.ts` — category themes, tool input/output helpers, getToolUsageSteps()
- `frontend/src/hooks/useCatalogData.ts` — caches and defensively deduplicates categories+tools from API
- `scripts/generate_seo_pages.py` — generates static per-tool/per-category SEO HTML and sitemap after frontend builds for better crawler coverage on deployed static hosting
- `frontend/public/robots.txt` — no JS/CSS blocking (SPA friendly)
- `frontend/public/sitemap.xml` — static sitemap; FastAPI also serves a dynamic sitemap from the current backend registry

## SEO Features (Comprehensive v2)
- Per-tool dynamic meta tags (title, description, keywords, canonical, OG, Twitter cards)
- Per-tool JSON-LD structured data (WebApplication, Organization, HowTo, BreadcrumbList)
- Per-tool FAQ JSON-LD from seoData.ts — 286 handcrafted entries covering all major tools
- Smart auto-generator v2 (createGeneratedSEO) — produces specific competitor-aware SEO for all remaining tools based on tool type detection (isPdf, isImage, isConvert, isCompress, isCalculator, isDeveloper, isOCR, isSecurity, isSocial, isConverter, isColor, isSEO) with tool-specific FAQs and competitor comparison keywords
- Competitor keywords baked in: iLovePDF, SmallPDF, PDFCandy, Adobe (PDF); iLoveIMG, pi7.org, Canva (images); jwt.io (developer)
- Dynamic sitemap.xml (also served by FastAPI at /sitemap.xml)
- robots.txt with no JS/CSS asset blocking (critical for SPA crawlability)
- sitemap.xml: static file with all 422 tool URLs + 33 category pages + homepage (457 total)
- WebSite SearchAction schema in index.html for Google sitelinks searchbox
- Tool pages show deduplicated intent keyword chips covering student, mobile, no-signup, privacy, alternative-tool, and branded Ishu queries
- Homepage features: "Why ISHU TOOLS" bento-grid comparison section with competitor mentions

## Design System
- Dark bg: #03060e — accent: #3bd0ff (teal-blue) — hero gradient: teal-to-purple
- Font: Space Grotesk (display), Manrope (body)
- Hero V2: animated orbs, grid overlay, large gradient heading, stats counter, ticker, trust badges
- Tool card: per-category accent, CSS-only hover (translateY + rotateX/Y), radial glow pseudo-element
- Animations: Framer Motion (page transitions only), CSS keyframes (orbs, ticker, pulse, floatOrb)
- Tool section entrance: `animation-timeline: view()` scroll-driven fade-in in Chrome, graceful @supports fallback
- Mega-menu: 6-column dropdown with 12 links per category
- Responsive: full mobile support with mobile nav panel
- Custom scrollbar styling with accent color
- FAQ accordion with +/× indicator, smooth height animation
- Gradient border for CTA buttons
- How It Works: 4-step layout with Lucide icons (MousePointerClick, Upload, Download, CheckCircle)
- Social chip/trust badge hover effects
- Reduced-motion and slow-device CSS guards disable expensive animations; mobile disables heavy blur

## Performance Optimizations
- Removed 449 Framer Motion `whileHover` event listeners from ToolCard — replaced with pure CSS GPU-composited transforms (`translateY(-6px) rotateX/Y`)
- `content-visibility: auto; contain-intrinsic-size: 0 600px` on every `.tool-section` — sections render lazily as they scroll into view
- `will-change: transform` on animated hero elements and card pseudo-elements
- CSS-only hover effects instead of JS event listeners on tool cards
- `color-mix(in srgb, ...)` for accent-tinted borders — no extra DOM elements
- Tool count badge in section heading rendered inline without extra wrapper components

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
- Duplicate categories/tools in registry: deduplicated in FastAPI catalog endpoints and defensively in useCatalogData.ts
- robots.txt was incorrectly blocking /assets/, *.js$, *.css$ — now fixed (SPA crawlability)
- Tool "How to use" steps now correctly show per-category steps (not generic file upload for all)
- QR code generator now shows correct steps (not the generic developer tool steps)
- Added 8 real student/everyday tools: Citation Generator, Flashcard Generator, Study Planner, Grade Calculator, Attendance Calculator, Reading Time Calculator, Plagiarism Risk Checker, Resume Bullet Generator
- React duplicate-key warnings from repeated SEO keyword chips fixed with case-insensitive keyword deduplication on tool pages

## Social Links
- LinkedIn: https://linkedin.com/in/ishu-kumar-5a0940281/
- Instagram: @ishukr10
- YouTube: @ishu-fun
- X/Twitter: @ISHU_IITP

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
