# ISHU TOOLS

## Overview
ISHU TOOLS (Indian Student Hub University Tools) — a full-stack free online toolkit with **766 handlers** across **50 categories** and **715+ live catalog tools** including: PDF, Image, Developer, Math, Text, AI, Color, Security, Conversion, Social Media, Student Tools, **Health & Fitness**, **Finance & Tax** (India-specific: PPF, NPS, EPF, HRA, Gratuity, Net Salary), **Network & Domain**, **Video Tools** (YouTube, TikTok, Twitter/X, Facebook, Vimeo, Dailymotion, Playlist downloader, Pinterest, Reddit, Twitch, LinkedIn, Bilibili, Rumble), **Productivity**, **Validator Tools**, **AI Writing Tools** (headlines, blog outlines, email subjects, social captions), **Crypto/Web3** (profit calculator, ETH gas, DCA, NFT royalties, mining), **HR/Jobs** (salary hike, notice period, job comparator, interview Q&A, resignation letter, negotiation), **Legal Tools** (NDA, freelance contract, privacy policy), **Travel Tools** (cost estimator, visa checklist, packing list), and **Finance V2** (FD, SIP, advanced EMI calculator). Dark-themed, performance-optimized, SEO-first, modern React frontend (Vite + TypeScript) and FastAPI Python backend. PWA-installable with offline support. 766 handlers registered.

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
  - Tool handlers: `backend/app/tools/handlers.py` + `developer_handlers.py` + `everyday_handlers.py` + `production_handlers.py` + `new_tools_handlers.py` + `extra_tools_handlers.py` + `image_plus_handlers.py` + `health_finance_handlers.py` + `video_extra_handlers.py` + **`ultra_tools_handlers.py`** (99 handlers) + **`social_video_handlers.py`** (55 handlers: Pinterest/Reddit/Twitch/LinkedIn/JWT/regex) + **`mega_tools_v2.py`** (34 handlers: AI writing/crypto/HR/legal/travel/dev v2/finance v2/productivity v2)
- **766 registered handlers** (most recent count)
  - Rate limiting: 60 req/min per IP on the execute endpoint
  - Workspace cleanup: auto-removed via BackgroundTasks after every request

## Key Files
- `backend/app/registry.py` — tool definitions (slug, title, category, tags, input_kind)
- `backend/app/tools/handlers.py` — main handler functions
- `backend/app/main.py` — FastAPI app with /sitemap.xml + /robots.txt dynamic endpoints
- `frontend/src/index.css` — all CSS (dark theme, hero-v2, mega-menu, animations, responsive, bento-grid, shimmer skeleton) ~4880 lines
- `frontend/src/components/layout/SiteShell.tsx` — mega-menu nav + expanded footer (9 links/col)
- `frontend/src/features/tool/toolFields.ts` — per-tool form field configs
- `frontend/src/features/tool/ToolPage.tsx` — generic tool runner with FAQ/SEO sections
- `frontend/src/features/tool/components/SmartResultDisplay.tsx` — intelligent result renderer for 25+ tool types (EMI, GST, DNS, IP, matrices, color palettes, Fibonacci, stats, sleep, currency, etc.)
- `frontend/src/components/ui/InstallPWA.tsx` — PWA install banner + floating install button
- `frontend/public/sw.js` — service worker with cache-first/network-first strategies for offline use
- `frontend/public/manifest.json` — installable PWA manifest with shortcuts for high-value tools
- `frontend/src/features/tool/components/ToolSidebar.tsx` — tool sidebar with "How to use" steps
- `frontend/src/features/home/HomePage.tsx` — homepage with search + tool grid + FAQ + how-to
- `frontend/src/features/home/components/HeroSection.tsx` — hero-v2 redesign with animated stats
- `frontend/src/lib/seoData.ts` — per-tool SEO data (715 handcrafted entries, 200 keywords/tool, smart auto-generator v3 fallback with AI/Ishu/Hinglish patterns)
- `frontend/src/lib/toolPresentation.ts` — category themes, tool input/output helpers, getToolUsageSteps()
- `frontend/src/hooks/useCatalogData.ts` — caches and defensively deduplicates categories+tools from API
- `scripts/generate_seo_pages.py` — generates static per-tool/per-category SEO HTML and sitemap after frontend builds for better crawler coverage on deployed static hosting
- `frontend/public/robots.txt` — no JS/CSS blocking (SPA friendly)
- `frontend/public/sitemap.xml` — static sitemap; FastAPI also serves a dynamic sitemap from the current backend registry

## SEO Features (Comprehensive v5)
- Per-tool dynamic meta tags (title, description, keywords, canonical, OG, Twitter cards, author/creator/publisher)
- Per-tool JSON-LD structured data (WebApplication, Organization, HowTo, BreadcrumbList 4-level, SpeakableSpecification)
- Per-tool FAQ JSON-LD from seoData.ts — 10-12 FAQs per tool with voice/Hindi/creator-trust variants
- Category pages: enriched with CollectionPage + BreadcrumbList + FAQPage JSON-LD, full OG+Twitter tags, 30+ keywords per category
- Smart auto-generator v3 (createGeneratedSEO) — type detection flags: isPdf, isImage, isConvert, isCompress, isKbTool, isPassport, isCalculator, isDeveloper, isOCR, isSecurity, isSocial, isConverter, isColor, isSEO, isHealth, isFinance
- Health tools: title = "X — Free Online Health Calculator | ISHU TOOLS"; description targets fitness/India
- Finance tools: title = "X — Free Online Finance Calculator | ISHU TOOLS"; description targets Indian professionals
- Competitor keywords baked in: iLovePDF, SmallPDF, PDFCandy, Adobe (PDF); iLoveIMG, pi7.org, Canva (images)
- Universal Ishu-branded keywords (200/tool): "ishu kumar tools", "ishu tools india", "ishu iitp", "ishu kumar iit patna", "ishu iit patna tools", Hinglish variants (kaise kare, bina signup ke), AI-powered patterns, device-specific and student-India long-tails
- index.html: Person schema for Ishu Kumar (IIT Patna alumnus), 15-entry SiteNavigationElement, 9-question FAQ, enriched noscript with 60+ crawlable links in 6 categories
- WebApplication schema: alumniOf IIT Patna, 3500+ aggregateRating
- robots.txt: max-image-preview:large, max-snippet:-1, max-video-preview:-1 directives per page
- sitemap.xml: static 517-URL sitemap with 2026-04-18 lastmod
- Dynamic sitemap.xml served by FastAPI — HIGH_PRIORITY expanded to include calorie-calculator, gst-calculator, sip-calculator, income-tax-calculator, roi-calculator, budget-planner, water-intake-calculator, sleep-calculator, etc.
- robots.txt with no JS/CSS asset blocking (critical for SPA crawlability)
- WebSite SearchAction schema in index.html for Google sitelinks searchbox
- HOMEPAGE_KEYWORDS updated with health/finance keywords (gst calculator india, calorie calculator india, sip calculator, income tax calculator 2024-25, number to words, etc.)

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
- `useDebounce` and `useThrottle` hooks added at `frontend/src/hooks/useDebounce.ts` for fine-grained input rate-limiting
- Backend GZip middleware enabled for all responses — compression for API payloads
- Tool detail caching (memory + sessionStorage, 10-min TTL) with in-flight request deduplication in `toolsApi.ts`
- Runtime capabilities cached 30 min — avoids repeated polls on every tool page
- Catalog cache uses a v2 session key with 15-minute TTL and idle-time writes after the live 715-tool expansion.
- Above-the-fold HomePage and ToolPage routes are imported eagerly to avoid first-route chunk delay; secondary directory/category pages remain lazy.
- Hero V2 first paint is no longer opacity-gated; stable min-heights reserve hero/status/stats/ticker/quick-link rows to reduce FOUC/CLS.
- Homepage directory uses stable containment/min-height instead of first-viewport `content-visibility:auto`; tool sections keep lazy rendering with larger intrinsic reservations.
- `index.html` includes early font stylesheet preload plus minimal above-the-fold critical CSS for instant dark theme/mobile layout before the bundled CSS finishes loading.

## Error Handling & UX Polish
- React `ErrorBoundary` wraps entire app (in `App.tsx`) with graceful recovery UI + reload/home buttons
- `SkeletonToolPage` — full shimmer skeleton matching the tool page layout (hero, fields, sidebar) shown during tool loading
- Toast notification system (`Toast.tsx` + `ToastProvider` in `App.tsx`) — success/error/info toasts with auto-dismiss, close button, and framer-motion entrance animation
- Toast fires on tool success (file ready), tool error (with message), and clipboard copy confirmation
- Back-to-top button in `SiteShell` — appears after 400px scroll with smooth animation
- Backend handler exceptions caught and returned as clean 500 responses (no stack trace leakage)
- File upload validation: 100 MB size limit + extension whitelist enforced server-side
- Cache-Control headers on GET endpoints (categories/tools/tool-details) to reduce redundant API calls

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

## Tool Categories (27 unique after dedup)
- PDF Core, PDF Security, PDF Advanced, PDF Insights
- Image Core (image-core: 48), Image Effects, Image Enhance (22), Image Layout (45)
- Document Convert, Office Suite, OCR Vision, eBook Convert, Vector Lab
- Text AI, Text Cleanup, Text Ops, Format Lab (28)
- Developer Tools (43), Code Tools, Color Tools, Hash/Crypto, SEO Tools
- Math Tools, Unit Converter, Student Tools (24), Security Tools, Conversion Tools, Social Media
- **Health & Fitness** (8 tools: calorie, bmr, body-fat, water, sleep, heart-rate-zones, steps-to-km, calories-burned)
- **Finance & Tax** (6 tools: gst, sip, roi, budget-planner, savings-goal, income-tax)
- Everyday utilities (number-to-words, roman-numeral, love-calc, date-calc, age-in-seconds, random-name, random-number, time-calc)

## Backend Libraries
FastAPI, PyMuPDF/fitz, pikepdf, pypdf, reportlab, WeasyPrint, Pillow, opencv-headless, rembg, rapidocr, deep-translator, python-docx, python-pptx, openpyxl, qrcode, bs4, httpx, python-barcode

## Skills Documentation
- Full documentation for all 55+ agent skills in `docs/skills/`
- 34 Replit-provided skills documented: agent-inbox, canvas, database, delegation, deployment, design, design-exploration, diagnostics, environment-secrets, expo, external_apis, follow-up-tasks, integrations, media-generation, mockup-extract, mockup-graduate, mockup-sandbox, package-management, post_merge_setup, project_tasks, react-vite, repl_setup, security_scan, workflows, web-search, video-js, stripe, threat_modeling, validation, skill-authoring, replit-docs, revenuecat, slides, artifacts
- 14 user-provided skills documented: agent-tools, brainstorming, frontend-design, seo-audit, ui-ux-pro-max, next-best-practices, vercel-react-best-practices, supabase-postgres-best-practices, web-design-guidelines, vercel-composition-patterns, better-auth-best-practices, vercel-react-native-skills, audit-website, skill-creator
- 40+ secondary skills referenced in docs/skills/48-secondary-skills-overview.md
- Master index at docs/skills/00-INDEX.md with quick-reference table

## Video Tools Added (v2)
New handlers in `backend/app/tools/video_extra_handlers.py`:
- `tiktok-downloader` — TikTok video download without watermark
- `twitter-video-downloader` / `x-video-downloader` — Twitter/X video download
- `facebook-video-downloader` — Facebook video/fb.watch download
- `vimeo-downloader` — Vimeo HD video download
- `dailymotion-downloader` — Dailymotion video download
- `youtube-playlist-downloader` / `playlist-downloader` — YouTube playlist ZIP download (up to 10 videos)
- `youtube-to-mp4` — YouTube to MP4 with quality selection (360p-1080p)
- `youtube-shorts-downloader` — YouTube Shorts download
- `audio-extractor` — Extract MP3 audio from any 1000+ site video URL
- `youtube-audio-downloader` — YouTube audio as high-quality MP3
All new tools have `toolFields.ts` frontend form fields and `registry.py` definitions.

## UI Changes (v3)
- **Bento "Why ISHU TOOLS?" section moved BELOW the tool directory** (was incorrectly above it)
  - New page order: Hero → Search+Filter → Tool Directory → Why ISHU TOOLS? → How It Works → FAQ
- CSS performance additions:
  - `will-change: transform; transform: translateZ(0)` on all animated cards (GPU compositing)
  - `contain: layout style paint` on tool cards (CSS containment for cascade optimization)
  - Category pill touch snap (scroll-snap-type on mobile)
  - `text-wrap: balance/pretty` for headings/paragraphs
  - Improved bento section spacing with border-top separator
  - Better mobile breakpoints at 640px for hero, bento, steps grid

## Important Bugs Fixed
- Compress PDF: returns original when compression fails
- HTTP header encoding: non-ASCII chars in X-Tool-Message sanitized globally
- Duplicate categories/tools in registry: deduplicated in FastAPI catalog endpoints and defensively in useCatalogData.ts
- robots.txt was incorrectly blocking /assets/, *.js$, *.css$ — now fixed (SPA crawlability)
- Tool "How to use" steps now correctly show per-category steps (not generic file upload for all)
- QR code generator now shows correct steps (not the generic developer tool steps)
- Added 8 real student/everyday tools: Citation Generator, Flashcard Generator, Study Planner, Grade Calculator, Attendance Calculator, Reading Time Calculator, Plagiarism Risk Checker, Resume Bullet Generator
- React duplicate-key warnings from repeated SEO keyword chips fixed with case-insensitive keyword deduplication on tool pages
- Health/finance handler parameter mismatches fixed: activity_level→activity, bedtime→sleep_time, name1/name2→text/value, birthdate→dob, etc. All new tools use named params matching toolFields.ts
- Budget planner now supports custom Needs/Wants/Savings percentages (not hardcoded 50/30/20)
- Random number generator now supports unique=true/false flag for lottery-style draws
- Rate limiting added to execute endpoint (60 req/min per IP) — prevents abuse
- Workspace auto-cleanup via BackgroundTasks — prevents disk buildup from tool executions
- Added 8 server-backed tools: SIP Calculator India, Income Tax Calculator India, Salary Hike Calculator, Discount Calculator, Loan Prepayment Calculator, Marks Percentage Calculator, CGPA to Percentage Converter, and Attendance Required Calculator. Added matching frontend fields and handcrafted SEO for top India/student targets.
- Added 8 more production-backed daily-use tools: Fixed Deposit Calculator India, Recurring Deposit Calculator, Loan Eligibility Calculator, Expense Splitter, UPI QR Code Generator, Wi-Fi QR Code Generator, Grade Needed Calculator, and Exam Countdown Calculator. Vercel build now uses Vite build plus static SEO page generation, avoiding TypeScript-only deploy failures while still producing crawlable tool pages.

## Social Links
- LinkedIn: https://linkedin.com/in/ishu-kumar-5a0940281/
- Instagram: @ishukr10
- YouTube: @ishu-fun
- X/Twitter: @ISHU_IITP

## Workflows
- `Backend API`: `cd /home/runner/workspace && python backend/run.py`
- `Start application`: `cd /home/runner/workspace/frontend && npm run dev`
