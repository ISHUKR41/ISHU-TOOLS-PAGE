# ISHUTOOLS.FUN — COMPLETE PRODUCTION-LEVEL MASTER IMPROVEMENT PROMPT

> **Domain:** ishutools.fun | ishutools.vercel.app  
> **Scope:** Every single tool, every page, every section, every line — nothing skipped.  
> **Level:** Full production quality. Not demo. Not partial. Not temporary. Complete.

---

## SECTION 0 — CORE RULES BEFORE ANYTHING ELSE

Before touching a single file, burn these rules into your execution logic permanently:

1. **Do NOT delete any tool.** Not a single one. All 1200+ tools stay.
2. **Do NOT hide any tool behind a "Show More" button.** All tools must be visible, always.
3. **Do NOT break working tools while fixing broken ones.** Every change must be safe and isolated.
4. **Do NOT leave any tool in a half-working state.** Either it works fully or document exactly why it can't.
5. **Do NOT make any UI change that slows down the site.** Performance is non-negotiable.
6. **Do NOT skip SEO for even one tool page.** Every page gets full SEO treatment.
7. **Remove the Categories section from the homepage completely.**
8. **Remove the "Most Popular / Top Tools used by everyone" section from the homepage completely.**
9. **Arrange tools from most-used-daily to least-used-daily, intelligently and logically.**
10. **Every tool must work perfectly on Vercel deployment — no serverside-only dependencies, no broken env vars, no missing API calls.**

Think deeply before every single action. Research before you implement. No guessing.

---

## SECTION 1 — PROJECT AUDIT AND ANALYSIS PHASE

### 1.1 — Full Codebase Audit

Before making any improvement, perform a complete, structured audit of the entire codebase:

- **Map every file and folder.** Understand the project structure completely: `/pages`, `/components`, `/lib`, `/utils`, `/public`, `/styles`, `/api`, `/hooks`, `/data`, and any others.
- **Identify the framework.** Is this Next.js, Nuxt, plain React, SvelteKit, or something else? Understand the routing system (App Router vs Pages Router if Next.js), SSR vs SSG vs CSR behavior, API route handling, and how data flows.
- **Identify the styling system.** Tailwind CSS, CSS Modules, Styled Components, plain CSS, or a combination. Understand the token system, breakpoints, and theming.
- **Identify the state management.** Zustand, Redux, Jotai, React Context, or none. Understand how global state and per-tool state is handled.
- **Identify the database layer.** Is there a Prisma schema, Supabase client, Firebase config, MongoDB connection, or just static data? Understand what is stored, what is fetched, and how.
- **Identify all external API integrations.** List every third-party API being used (RapidAPI, YouTube Data API, Instagram Graph API, PDF parsing APIs, etc.), understand their rate limits, authentication, and current status.
- **Identify every environment variable.** Make sure all required `.env` variables are documented, validated at startup, and handled gracefully when missing (especially for Vercel deployments).
- **Identify all broken tools.** Run the site, click every tool, and record exactly what fails, what error it throws, and why. Create a structured bug list with: tool name, error message, root cause, and fix plan.
- **Identify all tools that depend on external APIs that may be rate-limited or deprecated.** Flag them and plan fallback behavior.
- **Identify performance bottlenecks.** Run Lighthouse audit on homepage and at least 10 representative tool pages. Record CLS, LCP, FID/INP, TTFB, and bundle size.
- **Identify SEO gaps.** Check every tool page for missing `<title>`, `<meta description>`, Open Graph tags, structured data, canonical URLs, and sitemap inclusion.
- **Identify accessibility issues.** Check for missing `alt` text, improper heading hierarchy, missing ARIA labels, keyboard navigation issues, and color contrast failures.

Do not skip this audit phase. Every improvement after this must be rooted in the findings of this audit.

---

### 1.2 — Tool Categorization and Priority Ordering

After the audit, organize all 1200+ tools into a priority matrix based on daily usage frequency. Use real-world data, common knowledge about user behavior, and logical reasoning to determine the order. The following is a starting framework — expand it with full detail for all tools:

**Tier 1 — Daily Use (Show First):**
- Text tools: Word Counter, Character Counter, Case Converter, Text to Speech, Speech to Text, Lorem Ipsum Generator, Plagiarism Checker, Grammar Checker, Paraphrasing Tool, Summarizer, Translator
- Image tools: Image Compressor, Image Resizer, Image to PDF, Background Remover, Image Converter (PNG/JPG/WebP), Image Cropper, Screenshot to Text (OCR)
- PDF tools: PDF Compressor, PDF to Word, Word to PDF, PDF Merger, PDF Splitter, PDF Password Remover, PDF to Image
- Converter tools: Unit Converter, Currency Converter, Temperature Converter, Length Converter, Weight Converter
- Calculator tools: Scientific Calculator, Percentage Calculator, Age Calculator, BMI Calculator, Loan EMI Calculator, Tip Calculator, Date Difference Calculator
- Developer tools: JSON Formatter, Base64 Encoder/Decoder, URL Encoder/Decoder, HTML Formatter, CSS Minifier, JS Minifier, Color Picker, Regex Tester, Hash Generator (MD5, SHA)
- Social Media tools: Instagram Downloader, YouTube Thumbnail Downloader, TikTok Video Downloader, Twitter/X Video Downloader, Facebook Video Downloader
- Utility tools: Password Generator, QR Code Generator, Barcode Generator, Random Number Generator, UUID Generator, IP Address Lookup, Whois Lookup

**Tier 2 — Weekly Use (Show Second):**
- SEO tools, writing tools, advanced image tools, video tools, audio tools, coding utilities

**Tier 3 — Occasional Use (Show Last):**
- Niche tools, specialty converters, advanced developer utilities

Within each tier, arrange by most-used first. Apply this ordering across the homepage tool grid, all category pages, and the search results default ordering.

---

## SECTION 2 — HOMEPAGE REDESIGN

### 2.1 — Remove These Sections Permanently

- ❌ Remove the **Categories** section completely from the homepage. Delete its component, remove its import, and clean up any associated CSS. Do not replace it with anything else. Tools speak for themselves.
- ❌ Remove the **"Most Popular / Top Tools used by everyone"** section completely. It creates visual clutter and distraction from the actual tools. Delete the component and all related code.

### 2.2 — Homepage Structure (After Removals)

The homepage should follow this clean, focused structure:

```
[Navbar with Logo + Search + Scientific Calculator link + Navigation]
[Hero Section — minimal, fast, tool-focused headline]
[Search Bar — large, prominent, instant-search enabled]
[Tool Grid — ALL 1200+ tools, intelligently ordered, fully visible]
[Footer — SEO-rich, with links to all major tool categories]
```

No sidebars. No pop-ups on load. No modal advertisements. No cookie banners that block content. No flashy hero animations that delay showing tools. The tools are the product. Show them immediately.

### 2.3 — Hero Section

The hero section should be:
- **Minimal in height.** Users come for tools, not a marketing pitch. The hero should be compact — no full-screen takeover.
- **One powerful headline.** Example: *"1200+ Free Online Tools — All in One Place."* Make it factual, not fluffy.
- **One sub-headline.** Example: *"Fast, free, no signup required. PDF tools, image tools, calculators, converters, and much more."*
- **The search bar IS the hero CTA.** Make the search bar large, centered, and the visual focus of the top of the page.
- **No hero image or illustration that adds weight.** Use a subtle gradient or geometric background at most. Keep it lightweight.
- **Animate with CSS only.** No heavy JS animation libraries just for the hero. A simple fade-in on load is enough.

### 2.4 — Tool Grid (All Tools Visible)

This is the most important section of the homepage:

- Display ALL 1200+ tools in a responsive CSS Grid.
- Grid layout: `repeat(auto-fill, minmax(160px, 1fr))` on desktop, `repeat(auto-fill, minmax(140px, 1fr))` on tablet, 2 or 3 columns on mobile.
- Each tool card must contain:
  - A unique, meaningful icon (use a consistent icon library like Lucide, Phosphor, or a custom SVG set — not random emoji).
  - The tool name (short, clear, readable).
  - A one-line description (10–15 words max).
  - A hover effect: subtle card lift with `box-shadow` and `transform: translateY(-3px)`. Smooth, not jarring.
  - A click area that covers the entire card and navigates to the tool page.
- Lazy render tool cards using virtualization (e.g., `react-virtual` or `@tanstack/react-virtual`) so that 1200 cards don't all render to the DOM at once. This is critical for performance.
- Each card must have a `data-category` and `data-keywords` attribute for client-side filtering and search.
- No pagination. No "Load More." No "Show More." All tools are available, and virtualization handles the performance.

---

## SECTION 3 — SEARCH SYSTEM OVERHAUL

This is one of the most critical improvements. The search must become best-in-class.

### 3.1 — Search Architecture

Implement a multi-layer intelligent search system:

**Layer 1 — Instant Fuzzy Client-Side Search:**
- Use **Fuse.js** (lightweight, no server needed) for client-side fuzzy search across all tool names, descriptions, tags, aliases, and keywords.
- Configure Fuse.js with:
  - `threshold: 0.35` (tolerates typos and partial matches)
  - `keys` weighted as: `name` (weight 3), `aliases` (weight 2.5), `tags` (weight 2), `description` (weight 1)
  - `includeScore: true` for result ranking
  - `minMatchCharLength: 2`
- The search index should be pre-built at build time (as a JSON file) and loaded once on the client. Never rebuild it on every search.
- Results should appear within **50ms** of the user typing. No spinner, no loading state — pure instant response.

**Layer 2 — Alias and Synonym Expansion:**
- Every tool must have a `aliases` array in its data schema. Example for "Image Compressor": `["compress image", "reduce image size", "shrink photo", "make image smaller", "optimize image", "image optimizer"]`
- When the user types "compress photo", the search matches "Image Compressor" even though the word "compress" and "photo" aren't in the tool name.
- Build a comprehensive alias dictionary for all 1200+ tools. Think about what real users type, not what developers name things.
- Include common misspellings as aliases: "calulator" → Calculator, "convertor" → Converter, "downlaod" → Download, etc.

**Layer 3 — Category Tag Filtering (Search-Time Only, Not Homepage Section):**
- When search results appear, allow users to filter by category using small chip/badge buttons that appear at the top of results.
- These category chips are ONLY shown when search results are active. They are NOT a separate homepage section.
- Categories: Text, Image, PDF, Video, Audio, Calculator, Converter, Developer, SEO, Security, Social Media, Finance, Health, Math, Color, File, QR/Barcode, etc.

**Layer 4 — Search UX:**
- When the search bar is focused: show a dropdown/overlay with instant results.
- Show the top 8–10 results in the dropdown as the user types.
- Each result shows: tool icon, tool name, one-line description.
- Pressing Enter or clicking a result navigates directly to that tool.
- Pressing Escape closes the search overlay.
- When no results match: show helpful suggestions like "Did you mean: [similar tool]?" using Fuse.js score data.
- Keyboard navigation: Arrow Up/Down to navigate results, Enter to go to highlighted result.
- On mobile: the search bar opens a full-screen overlay for better UX.
- Include a clear (×) button inside the search input when text is present.

**Layer 5 — Search Persistence and Analytics:**
- Store recent searches in `localStorage` (last 5 searches) and show them when the search bar is focused with empty input.
- Track which tools are searched and clicked most (using a lightweight analytics approach like Vercel Analytics or a simple JSON-based counter) to improve future default ordering.

### 3.2 — What Must NOT Appear During Search

- ❌ No "Categories" section in search results.
- ❌ No "Most Popular" section in search results.
- ❌ No ads or promotional content mixed into results.
- ✅ Only: relevant tool results, ranked by relevance score, filterable by category chip.

---

## SECTION 4 — SCIENTIFIC CALCULATOR (NEW PAGE)

### 4.1 — Page Route

Create a dedicated page at `/scientific-calculator` (or `/tools/scientific-calculator` if that matches your routing convention). Add a direct link to this page in the Navbar — make it visually prominent, not buried in a dropdown.

### 4.2 — Interface Requirements

The Scientific Calculator must look and behave **exactly like a real physical scientific calculator** — specifically modeled after the Casio FX-991ES Plus or similar industry-standard scientific calculator. This is not a simple calculator with a few extra buttons. It is a full-featured scientific calculator.

**Display Panel:**
- A two-line display: top line shows the input expression (in natural textbook/mathbook notation if possible, otherwise standard notation), bottom line shows the result.
- Display should use a **monospace or LCD-style font** (e.g., `Courier New`, `Share Tech Mono`, or a custom LCD font from Google Fonts).
- Display background: dark green or dark blue (like a real calculator LCD) with slightly lighter text.
- Show the current MODE indicator (DEG/RAD/GRAD) at the top of the display.
- Show cursor position when editing long expressions.
- Support scrolling left/right through long expressions using arrow keys.
- Display should show `Error` with a specific error message (e.g., `Math Error`, `Syntax Error`) on invalid operations.

**Button Layout (Physical Calculator Style):**

Row 1 — Mode and Setup:
`[SHIFT]` `[ALPHA]` `[MODE/SETUP]` `[ON/AC]`

Row 2 — Function Keys:
`[sin]` `[cos]` `[tan]` `[log]` `[ln]`

Row 3 — Powers and Roots:
`[x²]` `[x³]` `[xⁿ]` `[√]` `[∛]`

Row 4 — Constants and Memory:
`[π]` `[e]` `[EXP]` `[Ans]` `[M+]`

Row 5 — Fractions and Brackets:
`[a b/c]` `[(]` `[)]` `[%]` `[DEL]`

Row 6–9 — Number Pad + Operations:
```
[7] [8] [9] [÷]
[6] [5] [6] [×]
[3] [2] [1] [−]
[0] [.] [±] [+]
         [=]
```

Row 10 — Additional Scientific:
`[SIN⁻¹]` `[COS⁻¹]` `[TAN⁻¹]` `[10ˣ]` `[eˣ]`

`[HYP]` — activates hyperbolic mode (sinh, cosh, tanh)
`[SHIFT]` — shifts all buttons to their secondary function (shown in yellow/orange text on each button, just like a real Casio)

**Buttons Design:**
- Use a realistic button design with:
  - A primary label (white or black, main function)
  - A secondary label above the button in yellow/orange (SHIFT function)
  - A third label below in red or green (ALPHA function, for variable storage)
- Buttons should have a **pressed state** with CSS: `transform: translateY(2px)` + reduced box-shadow to simulate physical key press.
- Button colors must match real calculators:
  - Number keys: dark gray
  - Operator keys: slightly lighter gray
  - SHIFT key: bright yellow/orange
  - AC/ON key: red or orange
  - = key: a distinct color (blue or orange) larger than other keys

**Calculation Engine:**
- Use **math.js** library for all calculations. It handles:
  - Complex number arithmetic
  - Matrix operations
  - Fraction arithmetic
  - Unit conversions
  - Symbolic expression evaluation
  - Trigonometry in degrees, radians, and gradians
  - Logarithms (log base 10, natural log, log base n)
  - Factorial (n!)
  - Combinations (nCr) and Permutations (nPr)
  - Scientific notation (EXP)
  - Statistical functions (mean, variance, standard deviation)
  - Hyperbolic functions (sinh, cosh, tanh and their inverses)
  - Power and root functions (x², x³, xⁿ, √, ∛, ⁿ√)
  - Constants (π = 3.14159265358979…, e = 2.71828182845904…)

**Features That Must Work:**
- `SHIFT` key toggles secondary functions. When SHIFT is active, all buttons display their secondary label prominently, and the next button press executes the secondary function.
- `ALPHA` key allows storing values to letter variables (A, B, C, D, E, F, X, Y).
- `MODE` cycles through: COMP (basic computation), STAT (statistics mode), TABLE (function table), and CMPLX (complex numbers mode) — at minimum COMP must work fully; STAT and TABLE are bonus.
- `DEG/RAD/GRAD` toggle for angle mode. The current mode is always shown on the display.
- `Ans` key recalls the last calculated answer into the current expression.
- `M+` stores a value to memory. `MR` recalls memory. `MC` clears memory.
- Expression history: pressing the Up arrow key recalls previous expressions (like a real calculator's history scroll).
- `DEL` deletes one character at a time from the right.
- `AC` clears the entire current input. Pressing AC on an empty display resets memory as well.
- Parentheses balancing: the display should show an error if unmatched parentheses are found.
- Scientific notation display: numbers beyond 10 digits should automatically switch to `×10ⁿ` notation.
- Fraction mode: `a b/c` button allows entering fractions like 1 2/3 (mixed number) and converts to decimal or keeps as fraction.

**Keyboard Support:**
- Full keyboard input: number keys, operators, Enter (=), Backspace (DEL), Escape (AC).
- Keyboard shortcut for SHIFT: the `s` key or `F2`.
- Keyboard shortcut for ALPHA: the `a` key or `F3`.

**Responsive Layout:**
- On desktop: the calculator is centered, fixed-width (match real Casio proportions approximately 320px–380px wide).
- On mobile: the calculator fills the screen width, with buttons appropriately sized for touch (minimum 44px × 44px touch target).
- Portrait and landscape orientations are both handled cleanly.
- No horizontal scrolling on any device.

**Additional Polish:**
- Add a subtle animation when pressing buttons (scale + shadow).
- Add a button click sound effect (optional, off by default, togglable in a settings area).
- Add a "Copy Result" button near the display that copies the current result to clipboard.
- Add a "History" panel (toggleable) that shows the last 20 calculations with their results.
- Add a "Formula Reference" section (collapsible) that lists all available functions with their syntax.

**Technology Stack for Calculator:**
- Framework: React (or whatever the project already uses).
- Math engine: `mathjs` (import as ES module).
- Icons: Lucide or Phosphor for any UI icons (not calculator buttons — those are text labels).
- Fonts: A monospace LCD-style font for the display. Google Fonts: `Share Tech Mono` or `VT323`.
- Animations: Pure CSS transitions. No Framer Motion for a calculator — it adds unnecessary weight.
- State: Local React state (useState + useReducer for the calculator state machine). No global state manager needed.

---

## SECTION 5 — NAVBAR IMPROVEMENTS

The Navbar is on every page. It must be fast, clean, and highly functional.

### 5.1 — Navbar Structure

```
[Logo: ishutools.fun] ——— [Search Bar (expandable)] ——— [Scientific Calculator] [Nav Links] [Theme Toggle]
```

- **Logo:** Clean wordmark. Use a distinctive, readable font. Not a complex SVG illustration that adds load weight. The logo text "IshuTools" should be in a bold, modern font with a subtle color accent on a letter or icon. Keep the logo under 5KB.
- **Search Bar:** Always visible in the navbar. On mobile, collapses to a search icon that expands on tap.
- **Scientific Calculator:** A text link or a small button with a calculator icon (from Lucide) labeled "Calculator" that goes to `/scientific-calculator`. This must be in the navbar at all times.
- **Nav Links:** Keep minimal. Suggested: Home | All Tools | (optional: About | Contact). Do not clutter the navbar with category dropdowns. The search handles discovery.
- **Theme Toggle:** A sun/moon icon button for dark/light mode. Theme preference stored in `localStorage`.
- **Mobile Hamburger Menu:** On mobile (below 768px breakpoint), collapse nav links into a hamburger menu. The search bar remains visible (not inside the hamburger).

### 5.2 — Navbar Behavior

- The navbar must be **sticky** (fixed to top on scroll).
- On scroll down: the navbar can become slightly more compact (reduce padding) with a CSS transition. This is called a "shrink on scroll" effect.
- The navbar must have a `z-index` high enough to always appear above tool content and overlays.
- The navbar must have a subtle `backdrop-filter: blur(8px)` and slight transparency when the page has been scrolled, giving a glassmorphism effect that looks modern without being heavy.
- The navbar must not jump or shift layout when the page loads (no CLS from navbar).

---

## SECTION 6 — ALL TOOLS IMPROVEMENT PLAN

This section defines the improvement standard for every single tool. This is not a list of a few tools — it applies to **every single one of the 1200+ tools** on the website. No exceptions.

### 6.1 — Universal Tool Page Standard

Every tool page must have the following structure:

```
[Navbar]
[Tool Breadcrumb: Home > Category > Tool Name]
[Tool Title (H1)]
[Short Tool Description (1–2 sentences)]
[Tool Interface (the actual functional tool)]
[How to Use This Tool (numbered steps)]
[Features List]
[FAQ Section (structured data / schema markup)]
[Related Tools Grid (6–8 relevant tools)]
[Footer]
```

Every tool page must have:
- **A unique `<title>` tag** in the format: `{Tool Name} — Free Online {Tool Name} | IshuTools`
- **A unique `<meta name="description">`** that is 150–160 characters, describes the tool specifically, and includes primary keywords.
- **Open Graph tags**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **Twitter Card tags**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- **Canonical URL tag** pointing to the tool's canonical URL.
- **Structured data (JSON-LD schema)**: At minimum, `WebApplication` schema for every tool. For calculators, use `SoftwareApplication`. For FAQ sections, add `FAQPage` schema.
- **Breadcrumb structured data** (`BreadcrumbList` schema).
- **H1 tag** with the tool name and primary keyword.
- **H2 tags** for "How to Use," "Features," "FAQ," and "Related Tools" sections.
- **Internal links** from the Related Tools section to other tool pages. This builds internal link equity.
- **Image alt text** for all images and icons.
- **Loading state** when a tool is processing.
- **Error state** with a clear, helpful error message.
- **Success state** with clear visual feedback (green checkmark, toast notification, or similar).
- **Mobile responsive layout** — the tool interface must work perfectly on 320px width and above.
- **Copy to clipboard** functionality wherever output is text-based, with a toast notification confirming the copy.
- **Download button** wherever output is a file (image, PDF, audio, video), using a proper browser download trigger.
- **Reset/Clear button** to reset the tool to its initial state.
- **Keyboard accessibility**: all interactive elements reachable by Tab key, Enter/Space to activate.

### 6.2 — Tool Data Schema (Apply to All Tools)

Define a consistent data schema for all 1200+ tools. Store this in a central data file (e.g., `/data/tools.ts` or `/data/tools.json`):

```typescript
interface Tool {
  id: string;                    // Unique slug: "image-compressor"
  name: string;                  // Display name: "Image Compressor"
  description: string;           // Short description (15-20 words)
  longDescription: string;       // SEO description (100-150 words)
  category: ToolCategory;        // Primary category
  subCategory?: string;          // Optional sub-category
  tags: string[];                // Keywords for search
  aliases: string[];             // Alternative names/queries users might type
  icon: string;                  // Icon name from icon library
  route: string;                 // URL path: "/tools/image-compressor"
  isPopular: boolean;            // Flag for popular tools
  tier: 1 | 2 | 3;              // Usage frequency tier (for ordering)
  seo: {
    title: string;               // <title> tag content
    description: string;         // <meta description> content
    keywords: string[];          // Meta keywords (for structured data)
    schema: object;              // JSON-LD schema object
  };
  howToUse: string[];            // Array of numbered steps
  features: string[];            // Array of feature bullet points
  faq: { question: string; answer: string }[];  // FAQ array
  relatedTools: string[];        // Array of related tool IDs
  isWorking: boolean;            // Flag for whether tool is currently functional
  requiresAuth: boolean;         // Whether the tool needs API key
  requiresBackend: boolean;      // Whether tool needs server-side processing
}
```

Fill this schema for every single tool. This schema drives: search indexing, SEO generation, page structure, and related tools recommendations. It is the single source of truth.

### 6.3 — Broken Tool Fixes (Detailed)

The following tools are known to be broken or unreliable. Fix each one properly:

**Instagram Video/Reels/Stories Downloader:**
- Root cause: Instagram constantly changes their API and scraping endpoints. Direct scraping is blocked.
- Fix approach: Use the **RapidAPI Instagram Downloader API** (e.g., `instagram-downloader6` or `social-media-video-downloader` on RapidAPI). These APIs handle the scraping on their end and return download URLs. Implement proper error handling for private accounts, rate limit errors, and invalid URLs.
- Show a loading spinner while the API call is in progress.
- Show the video thumbnail in the result with a download button.
- If the URL is invalid: show "Please enter a valid Instagram post or reel URL."
- If the content is private: show "This content is from a private account and cannot be downloaded."
- Rate limit: Show "Too many requests. Please try again in a few minutes." with retry countdown.
- Vercel: This is a server-side API call. Use a Next.js API route (`/api/instagram-download`) to keep the RapidAPI key secure. Never expose API keys to the client.

**YouTube Thumbnail Downloader:**
- Root cause: Possibly hardcoded to an old URL format.
- Fix: Extract YouTube video ID from any valid YouTube URL format (standard, short, embed, mobile). Use the YouTube thumbnail URL pattern: `https://img.youtube.com/vi/{VIDEO_ID}/{quality}.jpg`. Offer all quality options: maxresdefault, sddefault, hqdefault, mqdefault, default. Show previews of each quality with a download button for each.
- No API key needed for thumbnails — they are publicly accessible. Make the implementation client-side and instant.

**TikTok Video Downloader:**
- Root cause: TikTok blocks direct scraping aggressively.
- Fix: Use RapidAPI's TikTok Download Without Watermark API. Implement via a Next.js API route. Show video preview, offer download with and without watermark. Handle age-restricted content gracefully.

**Twitter/X Video Downloader:**
- Root cause: Twitter API v2 requires authentication for media, and basic scraping is blocked.
- Fix: Use a reliable RapidAPI Twitter video downloader service. Implement proper error handling.

**Facebook Video Downloader:**
- Root cause: Facebook restricts video access based on privacy settings.
- Fix: Support only public Facebook videos. Use RapidAPI for the download link extraction. Show appropriate errors for private content.

**YouTube Video Downloader:**
- Critical note: Direct YouTube video downloading may violate YouTube's Terms of Service. Instead of a true downloader:
  - Option A: Redirect to a trusted third-party service like `yt1s.com` or `savefrom.net` with the video URL pre-filled.
  - Option B: Implement a YouTube transcript/subtitle downloader instead (this is allowed and very useful).
  - Option C: Only offer YouTube audio extraction via a backend service that you control and have legal clarity on.
  - Do NOT use `youtube-dl` or `yt-dlp` on Vercel serverless functions — they are too slow and may violate ToS.

**PDF Tools (Compression, Merge, Split, Password Remove):**
- Use **PDF-lib** (JavaScript library, runs in browser) for client-side PDF manipulation.
- Use **pdf.js** for PDF rendering and preview.
- PDF Compressor: Use `pdf-lib` to remove embedded unused objects, downscale images within the PDF. For heavy compression, consider a server-side approach using `ghostscript` via an API route (if Vercel Pro or a separate backend is available).
- PDF Merger: `pdf-lib` handles this natively and works entirely in the browser. Implement drag-and-drop for adding multiple PDFs.
- PDF Splitter: Allow users to specify page ranges. Use `pdf-lib`. Show a page preview grid so users can select which pages to extract.
- PDF to Word: This is complex. Use a reliable API (e.g., ConvertAPI, iLovePDF API, or PDF.co API) via a Next.js API route. A purely client-side PDF-to-Word conversion is not reliably achievable.
- PDF Password Remover: `pdf-lib` can open password-protected PDFs if the user provides the password, then save without password. Implement this client-side. Warn users that this only works with user-password protection, not owner-password on highly secured PDFs.
- Word to PDF: Use a backend API (ConvertAPI or similar) for reliable conversion. Client-side HTML-to-PDF libraries (jsPDF) are unreliable for complex Word documents.

**Image Background Remover:**
- Use the **Remove.bg API** via an API route. It has a free tier. Show the original and result side-by-side. Allow download as PNG with transparent background.
- Alternative: Use the **@imgly/background-removal** npm package which runs a machine learning model in the browser via WebAssembly (no API key needed, slower but free).

**Image Compressor:**
- Use **browser-image-compression** npm package. It runs entirely in the browser with no server needed.
- Allow batch compression of multiple images.
- Show before/after file size comparison.
- Allow quality slider (0–100%).
- Support PNG, JPG, WebP, GIF input.
- Output should preserve the original format by default, with option to convert.

**OCR (Image to Text):**
- Use **Tesseract.js** which runs in the browser via WebAssembly.
- Support multiple languages (English by default, with dropdown for others).
- Show the extracted text in an editable textarea.
- Add copy and download buttons.
- Show a progress bar while OCR is processing (Tesseract.js provides progress events).

**Grammar Checker:**
- Use the **LanguageTool API** (free tier supports up to 20 requests/minute).
- Highlight errors inline in the text.
- Show suggestions on hover/click of each highlighted error.
- Allow one-click correction for each suggestion.
- Implement via API route to protect API key.

**Text to Speech:**
- Use the **Web Speech API** (built into browsers, no external API needed).
- Provide voice selection (all available system voices).
- Speed and pitch controls.
- Pause, Resume, Stop controls.
- For higher quality voices: integrate **ElevenLabs API** or **Google Cloud TTS** via API route (with user's own API key option).

**Currency Converter:**
- Use the **ExchangeRate-API** free tier or **Open Exchange Rates** for live rates.
- Cache rates in a server-side Redis or edge cache (Vercel KV) to avoid hitting rate limits on every user request.
- Show conversion for the top 50 world currencies.
- Show the "last updated" timestamp for the rate data.
- Provide a historical rate chart using Chart.js or lightweight-charts.

**Unit Converter:**
- No external API needed. All conversion logic is pure math.
- Support all major unit categories: Length, Weight/Mass, Temperature, Area, Volume, Speed, Time, Digital Storage, Energy, Pressure, Frequency, Angle, Force.
- Implement bidirectional conversion: changing either input field recalculates the other.
- Add a favorites/recently-used units feature using localStorage.

**QR Code Generator:**
- Use **qrcode.react** (React) or **qrcode** npm package (vanilla JS).
- Support: URL, text, email, phone number, WiFi credentials, vCard contact, SMS, geolocation.
- Allow customization: size, foreground color, background color, error correction level (L/M/Q/H).
- Allow logo/image overlay in the center of the QR code.
- Download as PNG, SVG, or PDF.
- Real-time preview updates as user types.

**Password Generator:**
- Implement fully client-side with the Web Crypto API (`crypto.getRandomValues`).
- Options: length (4–128 characters), include uppercase, lowercase, numbers, symbols, exclude ambiguous characters.
- Password strength meter (show entropy in bits).
- Generate multiple passwords at once.
- Copy individual passwords to clipboard.
- "Memorable password" mode: generates a diceware-style passphrase.

**Hash Generator (MD5, SHA-1, SHA-256, SHA-512):**
- Use the **Web Crypto API** for SHA variants (built-in, no library needed).
- For MD5, use the `md5` npm package (it's tiny).
- Support text input and file input (hash any file).
- Show all hashes simultaneously (user can see MD5, SHA-1, SHA-256, SHA-512 all at once for the same input).
- File hash: read file in chunks for large files, show progress.

**Color Picker:**
- Use a canvas-based color picker or the **react-colorful** library (tiny, ~2KB).
- Show: HEX, RGB, HSL, HSV, CMYK values simultaneously.
- Allow copy of each format.
- Show a color palette of complementary, analogous, triadic, tetradic colors.
- Color blindness simulator (show how the color looks to people with different types of color blindness).
- Contrast checker: input a background color and text color, show WCAG contrast ratio and pass/fail for AA and AAA.

**JSON Formatter / Validator:**
- Use **monaco-editor** (the VS Code editor) for syntax highlighting. This gives a professional experience.
- Or use **CodeMirror 6** which is lighter (better for performance on low-end devices).
- Features: Format (pretty-print), Minify, Validate (highlight JSON errors with line number), Tree view (collapsible JSON tree), Convert to CSV, Convert to YAML.
- Support large JSON files (use web workers for parsing to avoid UI blocking).
- Dark and light theme modes for the editor.

**Regex Tester:**
- Real-time regex matching as user types.
- Highlight matches in the test string.
- Show match groups in a structured list.
- Support flags: global (g), case-insensitive (i), multiline (m), dotAll (s), unicode (u).
- Common regex patterns library (email, phone, URL, IP address, date, etc.) — one-click to load.
- Explain the regex using a regex explainer (integrate **regexper** or **regex101**-style visualization).

**Base64 Encoder/Decoder:**
- Support text and file (image, document) encoding.
- Show encoded output in a monospace font textarea.
- For image encoding: show a live preview of the Base64 image.
- One-click copy and download.
- Auto-detect mode: when user pastes text, detect if it looks like Base64 and offer to decode.

**Word Counter / Character Counter:**
- Count: characters (with and without spaces), words, sentences, paragraphs, lines.
- Reading time estimate (based on 200 words/minute average).
- Speaking time estimate (based on 125 words/minute average).
- Most frequent words list (top 10).
- Keyword density analysis.
- Flesch-Kincaid readability score.
- Real-time updates as user types (debounced at 100ms to avoid performance issues on large texts).

**Loan EMI Calculator:**
- Inputs: loan amount, interest rate (annual), loan tenure (months or years).
- Outputs: Monthly EMI, Total Interest Payable, Total Amount Payable.
- Show an amortization schedule table (month-by-month breakdown of principal and interest).
- Show a pie chart (Principal vs Interest) using Chart.js.
- Show a line chart of remaining principal over time.
- Export amortization schedule as CSV.

**BMI Calculator:**
- Inputs: Weight (kg or lbs), Height (cm, feet/inches).
- Show BMI value, BMI category (Underweight/Normal/Overweight/Obese).
- Show a visual BMI scale gauge.
- Show healthy weight range for the user's height.
- Metric and imperial unit support with seamless toggle.

**Age Calculator:**
- Calculate exact age in years, months, and days.
- Show next birthday countdown.
- Show the day of the week the person was born.
- Show age in other units: total months, total weeks, total days, total hours, total minutes, total seconds.
- Show how many days until the next birthday.

**Plagiarism Checker:**
- Free basic plagiarism check using web search (search snippets of text and show potential matches).
- Or integrate with a plagiarism API (PlagScan, Copyleaks, or Scribbr — they have free tiers for basic checks).
- Highlight potentially plagiarized sections.
- Show percentage of original vs. potentially plagiarized content.
- Show sources where similar content was found, with links.

**Paraphrasing Tool / Summarizer / Grammar Checker / Text Improver:**
- These are AI-powered tools. Use the **OpenAI API** (GPT-3.5-turbo for cost efficiency) via API route.
- Allow users to bring their own OpenAI API key (store in localStorage, never sent to your server).
- Or use **Hugging Face Inference API** for open-source models (free tier available).
- Or integrate with **Google Gemini API** (has a generous free tier).
- Show a character/word limit with a progress bar.
- Implement streaming responses (SSE or ReadableStream) so the output appears word-by-word, not all at once.

**Translator:**
- Use the **LibreTranslate API** (open source, free self-hostable) or the **MyMemory API** (free tier, no key needed).
- Support 100+ languages.
- Auto-detect source language.
- Swap languages button.
- Show translated text with copy and speak (TTS) buttons.
- Preserve formatting (newlines) in translation.

**Markdown to HTML:**
- Use **marked.js** or **micromark** for parsing.
- Split-pane view: left side is Markdown input, right side is live HTML preview.
- Syntax highlighting for code blocks in the preview using **highlight.js** or **Prism.js**.
- Export: download as HTML file, or copy the HTML.
- Show raw HTML toggle (to see the actual HTML code, not the rendered version).

**URL Shortener:**
- Important: You need a backend and database for this. Use Vercel KV (Redis) or Supabase.
- Generate short codes of 6–8 characters (alphanumeric).
- Allow custom slugs (optional, user-specified).
- Track click counts.
- Show a QR code for the shortened URL automatically.
- Copy shortened URL with one click.

**Whiteboard / Drawing Tool:**
- Use the **Excalidraw** React component. It's open-source and provides a complete whiteboard experience.
- Or implement a simpler canvas-based drawing tool with: brush, eraser, shapes (rectangle, circle, line, arrow), color picker, stroke width, undo/redo.
- Export as PNG or SVG.

**Pomodoro Timer:**
- 25 minutes work, 5 minutes short break, 15 minutes long break (configurable).
- Visual circular progress indicator.
- Audio notification when timer ends (using Web Audio API — generate a beep, no audio file needed).
- Session counter (shows how many pomodoros completed today).
- Daily statistics stored in localStorage.

**Lorem Ipsum Generator:**
- Generate paragraphs, sentences, words, or bytes of Lorem Ipsum.
- Options: starting with "Lorem ipsum…" or random start.
- HTML output option (wraps paragraphs in `<p>` tags).
- Various languages of dummy text (Latin, English-like, Cicero original).
- Copy button and word count display.

**Resume Builder:**
- Multi-step form: Personal Info → Experience → Education → Skills → Preview.
- Live preview that updates as user fills in fields.
- Multiple templates (Modern, Classic, Minimal).
- Export as PDF using jsPDF or print-to-PDF.
- Data saved in localStorage so users don't lose progress on refresh.

**Invoice Generator:**
- Add line items (description, quantity, unit price).
- Auto-calculate subtotal, tax, discount, total.
- Add company logo (image upload).
- Fill in client details.
- Export as PDF.
- Save invoice as JSON for re-editing.

**Favicon Generator:**
- Accept image input (PNG, JPG, SVG).
- Generate .ico file, 16×16, 32×32, 48×48, 64×64, 128×128, 256×256.
- Generate Apple Touch Icon (180×180).
- Download as a ZIP file containing all sizes plus HTML code to include them.

For ALL remaining tools not specifically listed above, apply this general improvement framework:
- Ensure the tool works end-to-end without errors.
- Add loading, error, and success states.
- Add copy/download functionality where applicable.
- Add a reset button.
- Add proper labels and help text.
- Add keyboard accessibility.
- Make mobile responsive.
- Add the full SEO structure (title, meta, schema, FAQ).
- Add the "How to Use" and "Related Tools" sections.

---

## SECTION 7 — PERFORMANCE OPTIMIZATION

Performance is critical. Every millisecond matters. Apply all of the following:

### 7.1 — Core Performance Strategies

**Bundle Size Optimization:**
- Run `next build && next analyze` (using `@next/bundle-analyzer`) to identify large bundles.
- Every library that is above 50KB must be evaluated for necessity. If it can be replaced with a lighter alternative, replace it.
- Use dynamic imports for heavy libraries that are only needed for specific tools:
  ```javascript
  const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
  ```
- Tree-shake all imports. Never import an entire library when only a function is needed.
- Split tool pages into separate chunks so the home page does not load code for every tool.

**Image Optimization:**
- Use Next.js `<Image>` component for all images. It handles WebP conversion, lazy loading, and responsive sizes automatically.
- All static images must be in WebP or AVIF format.
- All icons should be SVG (inline or sprite sheet), not PNG or JPG.
- Implement a sprite sheet for all tool icons to reduce HTTP requests.
- Tool card icons: Use an icon font or SVG sprite, not individual image files.

**Code Splitting and Lazy Loading:**
- Each tool page should only load the code it needs. Do not import the entire tool library on the homepage.
- Use `React.lazy()` and `Suspense` for tool components.
- Tool list on homepage: Use virtual scrolling (react-virtual) to render only visible tool cards.

**Caching Strategy:**
- For API routes that fetch external data (currency rates, etc.): implement HTTP caching headers (`Cache-Control: s-maxage=3600, stale-while-revalidate`) and use Vercel's edge caching.
- For static data (tool list, categories): pre-generate at build time using `getStaticProps`.
- For tool-specific data that changes rarely: use `getStaticProps` with `revalidate` (ISR — Incremental Static Regeneration).

**Font Optimization:**
- Use Google Fonts with `display=swap` and preload the critical font weights.
- Only load the font weights and subsets actually used (e.g., if using `Inter`, only load 400 and 600, not 100–900).
- Consider using a variable font to reduce HTTP requests.

**Third-Party Script Management:**
- Load all analytics scripts (Google Analytics, Vercel Analytics) with `next/script` using the `afterInteractive` or `lazyOnload` strategy. Never block the main thread for analytics.
- Do not load any third-party script that is not strictly necessary.

**Prefetching:**
- Use Next.js `<Link>` component for all internal navigation — it automatically prefetches linked pages on hover.
- Prefetch the top 10 most-visited tool pages at load time using `<link rel="prefetch">`.

**Service Worker (PWA):**
- Implement a service worker using `next-pwa` or Workbox.
- Cache: app shell (navbar, footer, CSS, fonts), all tool metadata JSON, and recently visited tool pages.
- This allows the site to load instantly on repeat visits and work offline for cached pages.
- Add a Web App Manifest (`manifest.json`) for PWA installation.

**Database Query Optimization (if applicable):**
- If using Supabase or Prisma, ensure all queries have proper indexes.
- Use connection pooling.
- Never run N+1 queries.
- Cache frequently accessed data (like the tool list) in-memory or in Redis.

**Vercel-Specific Optimizations:**
- Ensure all API routes that need to be fast are deployed as Edge Functions (using `export const runtime = 'edge'` in Next.js) where possible.
- Use Vercel KV (Redis) for caching expensive computations.
- Configure `vercel.json` with proper headers for all routes.
- Test deployment on Vercel preview before pushing to production. Verify every API route works in the serverless environment.

---

## SECTION 8 — SEO STRATEGY (COMPREHENSIVE)

This is the most extensive SEO implementation possible. Every point must be applied to every page.

### 8.1 — Technical SEO

**Site-Wide Technical SEO:**
- Generate a dynamic `sitemap.xml` that includes every tool page with:
  - `<loc>`: Full URL of the tool page
  - `<lastmod>`: Last modification date
  - `<changefreq>`: `weekly` for most tools, `daily` for the homepage
  - `<priority>`: 1.0 for homepage, 0.9 for top-tier tools, 0.7 for all others
- Generate a `robots.txt` that allows all crawlers to access all tool pages. Disallow only: `/api/*`, `/_next/*`, `/admin/*`.
- Implement proper `<link rel="canonical">` tags on every page to prevent duplicate content issues.
- Ensure all tool pages are accessible without JavaScript (SSR or SSG). Google can index client-rendered content, but SSR is faster and more reliable.
- Fix all 404 errors. Implement a custom 404 page that shows a search bar and suggests popular tools.
- Implement proper 301 redirects for any URL changes.
- Ensure the site is served over HTTPS (Vercel does this automatically).
- Implement `hreflang` tags if the site is ever localized.
- Verify site speed with Google PageSpeed Insights and Core Web Vitals.

**Structured Data (JSON-LD):**

For every tool page, add at minimum:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{Tool Name}",
  "url": "https://ishutools.fun/tools/{tool-slug}",
  "description": "{Tool description}",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "IshuTools",
    "url": "https://ishutools.fun"
  }
}
```

For calculator tools, also add:
```json
{
  "@type": "SoftwareApplication",
  "applicationSubCategory": "Calculator"
}
```

For FAQ sections on each tool page:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I use the {Tool Name}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

For the homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "IshuTools",
  "url": "https://ishutools.fun",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://ishutools.fun/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

This `SearchAction` schema enables Google to show a search box directly in search results for your site.

### 8.2 — On-Page SEO (Per Tool)

Every tool page must be individually optimized with:

**Title Tag Formula:**
`{Tool Name} - Free Online {Tool Name} | IshuTools`

Examples:
- `Image Compressor - Free Online Image Compressor | IshuTools`
- `Scientific Calculator - Free Online Scientific Calculator | IshuTools`
- `JSON Formatter - Free JSON Formatter & Validator Online | IshuTools`

**Meta Description Formula:**
One sentence describing what the tool does + one sentence about key benefits + brand mention.

Example for Image Compressor:
`Compress images online for free without losing quality. Reduce PNG, JPG, and WebP file sizes instantly with our browser-based image compressor. No upload limit. IshuTools.`

**Heading Structure on Each Tool Page:**
- `<h1>`: Exact tool name + primary keyword ("Free Online Image Compressor")
- `<h2>`: "How to Use the Image Compressor" / "Features" / "FAQ"
- `<h3>`: Individual FAQ questions / Feature names

**Keyword Strategy:**
For each tool, target:
1. **Primary keyword**: The tool name itself ("image compressor")
2. **Action keywords**: "compress image online", "reduce image size free", "make image smaller"
3. **Modifier keywords**: "free", "online", "no signup", "without watermark", "fast"
4. **Comparison keywords**: "best image compressor", "image compressor like TinyPNG"
5. **Question keywords**: "how to compress an image", "how to reduce image file size"

Use these keywords naturally in: H1, H2, first paragraph, How to Use steps, FAQ answers, and the meta description.

**Content on Each Tool Page:**
- **How to Use section**: Minimum 5 numbered steps explaining exactly how to use the tool.
- **Features section**: Minimum 5 bullet points listing what makes this tool great.
- **FAQ section**: Minimum 5 questions and answers. FAQs should target question-based keywords ("Is this image compressor free?", "What image formats are supported?", "What is the maximum file size?").
- **Related Tools**: Link to 6–8 semantically related tools. This builds topical authority and internal link equity.

### 8.3 — Domain Authority and External SEO

For off-page and AI-driven ranking, structure the site to:

**AI Search Optimization (AIO / LLMO — LLM Optimization):**
- AI search engines (Google SGE, Bing Copilot, Perplexity) increasingly show answers from authoritative, well-structured content.
- To rank in AI search results:
  - Every tool page must directly answer "what is {tool}" in the first paragraph.
  - Use clear, factual, direct language — AI models prefer this over marketing fluff.
  - Structure content in a Q&A format (FAQs) that AI can extract directly.
  - Mark up structured data comprehensively so AI crawlers can understand your content type.
  - Include comparison content: "IshuTools Image Compressor vs TinyPNG" — this surfaces in AI comparison queries.

**Internal Linking Architecture:**
- Every tool page links to 6–8 related tools.
- The homepage links to every tool (direct navigation).
- Create category landing pages (e.g., `/tools/pdf-tools`, `/tools/image-tools`) that list all tools in that category and link to each tool page. These category pages have their own SEO optimization.
- The footer should contain a mega-link section with all major categories and their top tools listed as links.

**Backlink Strategy (Documentation in the Prompt):**
- Submit ishutools.fun to tool directories: AlternativeTo, Product Hunt, Hacker News "Show HN", G2, Capterra, Slant, StackShare.
- Create a "Free Tools" roundup post and submit it to dev communities: Dev.to, Hashnode, Medium.
- Contact bloggers who write "best free online tools" lists and request inclusion.
- Submit to Reddit communities: r/webtools, r/productivity, r/InternetIsBeautiful.
- Create a Twitter/X thread: "20 free online tools everyone should know about — all at ishutools.fun."

### 8.4 — Local and Voice Search Optimization

Not strictly applicable for a tools website (no physical location), but for voice search:
- Structure FAQ answers to be conversational and direct.
- Target question phrases: "how do I…", "what is the best…", "can I…" — these are exactly what voice search queries look like.
- Implement speakable schema markup where applicable.

---

## SECTION 9 — UI AND DESIGN IMPROVEMENTS

### 9.1 — Design System

Establish a comprehensive design system that applies consistently across all 1200+ tool pages.

**Color Palette:**

Primary: Choose a strong, distinctive primary color. Recommendation: a deep electric blue (#0057FF) or a rich indigo (#4F46E5). This is the brand color — used for primary buttons, links, active states, and key accents.

Background: 
- Light mode: Off-white (#F8F9FA) — not pure white. Pure white is too harsh.
- Dark mode: Deep charcoal (#111827) — not pure black. Pure black is too harsh.

Surface (cards, panels):
- Light mode: Pure white (#FFFFFF) with subtle border (#E5E7EB).
- Dark mode: Slightly lighter charcoal (#1F2937) with subtle border (#374151).

Text:
- Light mode primary: Near-black (#111827)
- Light mode secondary: Medium gray (#6B7280)
- Dark mode primary: Near-white (#F9FAFB)
- Dark mode secondary: Light gray (#9CA3AF)

Semantic colors:
- Success: Emerald green (#10B981)
- Error: Red (#EF4444)
- Warning: Amber (#F59E0B)
- Info: Sky blue (#0EA5E9)

**Typography:**

Do NOT use Inter, Roboto, Arial, or system fonts. Choose distinctive, readable fonts:

Display font (logo, hero headline, tool name H1): 
- **Sora** (Google Fonts) — modern, geometric, memorable.
- Or **Outfit** — clean, distinctive, excellent for branding.
- Or **Plus Jakarta Sans** — professional with character.

Body font (descriptions, UI text):
- **DM Sans** — highly readable, slightly informal, excellent screen font.
- Or **Nunito Sans** — friendly, readable, great for UI.
- Or **Inter** — only acceptable if paired with a very distinctive display font.

Monospace font (code, hash outputs, JSON editor):
- **JetBrains Mono** (Google Fonts) — designed specifically for code, excellent ligatures.
- Or **Fira Code** — classic, great ligatures.

Font Loading:
- Use `font-display: swap` to prevent invisible text during font load.
- Preload only the fonts needed above the fold.
- Use variable fonts where available to reduce HTTP requests.

**Spacing System:**
Use a consistent 4px base spacing system:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px
- `space-24`: 96px

Apply these consistently using Tailwind's spacing scale (`p-4`, `m-8`, etc.) or CSS custom properties.

**Border Radius:**
- Small elements (badges, chips): `4px` (`rounded`)
- Cards and panels: `12px` (`rounded-xl`)
- Buttons: `8px` (`rounded-lg`)
- Full pill (tags, small badges): `9999px` (`rounded-full`)
- Tool card: `16px` (`rounded-2xl`)

**Shadows:**
- Tool card default: subtle shadow `0 1px 3px rgba(0,0,0,0.08)` + border
- Tool card hover: elevated shadow `0 8px 24px rgba(0,0,0,0.12)` + border
- Modal/Dropdown: `0 20px 60px rgba(0,0,0,0.15)`
- Navbar: `0 1px 0 rgba(0,0,0,0.08)` (subtle bottom border shadow)

**Icon System:**
- Use **Lucide React** as the primary icon set. It's well-maintained, has excellent coverage, and is tree-shakeable.
- Every tool must have a unique, relevant icon. Do not reuse the same icon for multiple tools.
- Tool card icon size: 24px × 24px, displayed in the brand primary color.
- Navbar icons: 20px × 20px.
- Button icons: 16px × 16px.
- All icons must have `aria-hidden="true"` and the button/link that contains them must have a descriptive `aria-label`.

### 9.2 — Component Library

Build or improve these core UI components (applied consistently across all tools):

**Button Component:**
- Variants: Primary (filled, brand color), Secondary (outlined), Ghost (text only), Destructive (red).
- Sizes: sm, md (default), lg.
- States: default, hover, active (pressed), focus (keyboard), disabled, loading (with spinner).
- Always include `aria-disabled` for disabled state (not just `disabled` attribute).

**Input Component:**
- Sizes: sm, md (default), lg.
- States: default, focus (with brand color ring), error (with red border + error message), disabled.
- Always include `<label>` element properly associated via `htmlFor`.
- Support `prefix` (icon or text before input) and `suffix` (icon or text after input).

**Textarea Component:**
- Auto-resize to content height (using `scrollHeight` adjustment on input events).
- Character/word count display.
- All other states same as Input.

**Toast/Notification Component:**
- Types: success, error, warning, info.
- Auto-dismiss after 3 seconds.
- Manual dismiss button.
- Stack multiple toasts (max 3 visible at once, queue the rest).
- Animate in from bottom-right (desktop) or top-center (mobile).
- Accessible: `role="alert"`, `aria-live="polite"`.

**File Upload Component:**
- Drag-and-drop zone with clear visual indicator when file is dragged over.
- Click to browse (opens system file picker).
- File type restriction with clear error message for wrong types.
- File size limit with clear error message.
- Show file preview (image thumbnail, PDF page count, file name and size) after upload.
- Remove file button.
- Support multiple files where applicable.
- Progress bar for large file uploads.

**Progress Bar Component:**
- Animated, smooth fill.
- Show percentage label.
- Used for: file processing, OCR progress, PDF operations, API call waiting.

**Modal Component:**
- Accessible: `role="dialog"`, `aria-modal="true"`, focus trap inside modal.
- Close on backdrop click.
- Close on Escape key.
- Animate in/out smoothly.
- Stack support (modal within modal).

**Dropdown/Select Component:**
- Custom styled (not the browser default `<select>` which looks ugly across platforms).
- Keyboard navigable.
- Search/filter option for long lists (e.g., language selector in Translator, currency selector).
- Groups/sections support.

**Slider Component:**
- Custom styled range slider.
- Show current value label that moves with the thumb.
- Min/max labels.
- Used for: quality slider in image compressor, speed in TTS, etc.

**Tab Component:**
- Horizontal tab bar.
- Active tab indicator (sliding underline or pill).
- Keyboard navigation (arrow keys).
- Used for: showing different output formats, input modes, etc.

**Code Display Component:**
- Syntax highlighting using `highlight.js` or `Prism.js`.
- Copy button with success feedback.
- Line numbers.
- Word wrap toggle.
- Language label.

### 9.3 — Dark Mode

- Implement dark mode using CSS custom properties (CSS variables).
- Toggle stored in `localStorage` and in `next-themes` (if using Next.js) for SSR consistency.
- Respect `prefers-color-scheme` media query as the default (system preference).
- All components, pages, and tool interfaces must look correct in both light and dark mode.
- Dark mode toggle button in navbar (sun/moon icon).
- Transition between modes with a smooth `transition: background-color 200ms, color 200ms` on the `body` element.

### 9.4 — Animations and Micro-interactions

Apply these animations throughout (all CSS transitions, no heavy JS animation libraries):

- **Page transitions**: fade-in on route change (200ms opacity transition).
- **Tool card hover**: `transform: translateY(-4px)`, `box-shadow` increase, `200ms ease`.
- **Button hover/active**: subtle scale and brightness change.
- **Search bar focus**: border color change + subtle glow with `box-shadow`.
- **Toast notifications**: slide-in from right (desktop) / slide-down from top (mobile).
- **Loading states**: skeleton screens (pulsing gray placeholder) for async content — never just a blank space.
- **Scientific calculator button press**: `transform: translateY(2px)` + shadow reduction, `80ms` — must feel snappy and tactile.
- **Tool output appearance**: fade-in when result is generated.
- **File drop zone**: scale up slightly + border color change when file is being dragged over.

Do NOT use: Framer Motion for basic animations (too heavy), GSAP for simple transitions, or any animation that takes longer than 400ms (feels slow).

---

## SECTION 10 — ACCESSIBILITY (A11Y)

Accessibility is not optional. It directly impacts SEO (Google uses accessibility as a ranking signal) and reaches more users.

### 10.1 — Keyboard Accessibility

- Every interactive element (buttons, links, inputs, dropdowns, modals) must be reachable and operable using only the keyboard.
- Tab order must be logical (follows visual reading order).
- No keyboard focus traps except inside modals (where trapping is correct behavior).
- Custom interactive components (sliders, color pickers, tab bars) must implement ARIA keyboard patterns from the WAI-ARIA Authoring Practices Guide.
- Visible focus ring on all focusable elements. Do NOT use `outline: none` without providing an alternative focus indicator.

### 10.2 — Screen Reader Accessibility

- All images have descriptive `alt` text. Decorative images have `alt=""`.
- All icons that convey meaning have `aria-label` on their parent button/link.
- All icons that are purely decorative have `aria-hidden="true"`.
- All form inputs have properly associated `<label>` elements.
- Error messages are associated with their inputs using `aria-describedby`.
- Loading states announce to screen readers using `aria-live="polite"`.
- Dynamic content updates (toast notifications, search results) announce using `role="alert"` or `aria-live`.
- Page title changes on route navigation (critical for SPAs — screen readers read the `<title>` on navigation).

### 10.3 — Color and Contrast

- All text must meet WCAG 2.1 AA contrast ratios: 4.5:1 for normal text, 3:1 for large text and UI components.
- Do not rely on color alone to convey information (e.g., error states must use both red color AND an error icon AND a text message).
- Test in color blindness simulation (use Chrome DevTools' "Emulate vision deficiencies" feature).

### 10.4 — Touch and Mobile Accessibility

- Minimum touch target size: 44px × 44px.
- Adequate spacing between touch targets to prevent accidental taps.
- Support pinch-to-zoom (do not set `user-scalable=no` in the viewport meta tag).

---

## SECTION 11 — FOOTER

The footer has significant SEO value. Implement a comprehensive footer:

### 11.1 — Footer Structure

```
[Column 1: IshuTools Brand]
Logo | Short description | Social media links

[Column 2: Popular Tools]
Links to top 10 most popular tools (by category)

[Column 3: Text Tools]  
Links to 8-10 text tools

[Column 4: Image Tools]
Links to 8-10 image tools

[Column 5: PDF Tools]
Links to 8-10 PDF tools

[Column 6: Developer Tools]
Links to 8-10 developer tools

[Column 7: Calculator & Converters]
Links to 8-10 calculator/converter tools

[Bottom Bar]
© 2024 IshuTools.fun | Privacy Policy | Terms of Service | Contact | Sitemap
```

All tool links in the footer are crawlable internal links. They significantly improve internal link equity and help Google discover all tool pages.

Use `rel="nofollow"` on social media links (external) and NO `nofollow` on internal links.

---

## SECTION 12 — VERCEL DEPLOYMENT CHECKLIST

Before every production deployment, verify:

### 12.1 — Environment Variables
- List ALL required environment variables in `.env.example`.
- All are configured in Vercel Dashboard → Project → Settings → Environment Variables.
- None are exposed to the client (only variables prefixed with `NEXT_PUBLIC_` are client-visible).
- API routes validate the presence of required env vars at runtime and return clear error messages if missing.

### 12.2 — API Route Verification
- Every API route works in the Vercel serverless environment (no filesystem access, no long-running processes).
- Functions that might take >10 seconds are handled with Vercel's `maxDuration` configuration.
- All external API calls from API routes have a timeout (e.g., 8 seconds) and error handling.

### 12.3 — Build Verification
- `npm run build` completes without errors and without type errors.
- No console errors on any tool page in production mode.
- All dynamic imports resolve correctly.
- Images are all properly imported or referenced via public URL.

### 12.4 — Lighthouse Score Targets
- Performance: ≥85 (homepage), ≥80 (tool pages)
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥95

### 12.5 — Cross-Browser Testing
- Test in Chrome, Firefox, Safari, Edge.
- Test on iOS Safari and Android Chrome.
- Test on 320px, 375px, 768px, 1024px, 1440px viewport widths.

---

## SECTION 13 — ADDITIONAL TOOLS TO ADD

Add these highly-useful tools that are commonly searched but missing from many tool websites:

**Text Tools:**
- Markdown Editor with Live Preview
- Text to Binary / Binary to Text
- Text to Morse Code / Morse to Text
- Text Sorter (A-Z, Z-A, by line length)
- Text Reverser
- Duplicate Line Remover
- Text to Slug Converter
- HTML Entity Encoder/Decoder

**Image Tools:**
- Image to Base64 Converter
- GIF Maker (from multiple images)
- Image Watermarker
- EXIF Data Viewer/Remover
- Image Color Extractor (extract dominant colors from an image)
- SVG to PNG Converter

**Developer Tools:**
- SQL Formatter
- YAML to JSON / JSON to YAML
- XML Formatter
- JWT Decoder
- Cron Expression Generator
- HTTP Status Code Reference
- Color Palette Generator
- CSS Gradient Generator
- Box Shadow Generator
- Border Radius Generator
- Flexbox Visual Playground
- CSS Grid Visual Playground

**Utility Tools:**
- World Clock (multiple time zones simultaneously)
- Countdown Timer with custom message
- Meeting Time Zone Planner
- Random Password Generator (improved, see Section 6.3)
- Dice Roller
- Coin Flipper
- Random Name Generator (for testing)
- UUID v1, v3, v4, v5 Generator

**Finance Tools:**
- Compound Interest Calculator
- ROI Calculator
- GST Calculator (specifically useful for Indian users)
- SIP Calculator (Systematic Investment Plan — very popular for Indian users)
- PPF Calculator (Public Provident Fund — India)
- Home Loan Calculator
- Salary to Hourly Calculator

**Health Tools:**
- Calorie Calculator (BMR + TDEE)
- Water Intake Calculator
- Macro Nutrient Calculator
- Body Fat Percentage Calculator
- Sleep Cycle Calculator

**Math Tools:**
- Matrix Calculator (Add, Subtract, Multiply, Transpose, Determinant, Inverse)
- Quadratic Equation Solver
- Prime Number Checker
- GCD and LCM Calculator
- Number Base Converter (Binary, Octal, Decimal, Hexadecimal)
- Statistics Calculator (Mean, Median, Mode, Standard Deviation, Variance)

---

## SECTION 14 — MONITORING AND MAINTENANCE

### 14.1 — Error Monitoring
- Implement **Sentry** for error tracking. It catches JavaScript errors, API errors, and performance issues in production.
- Set up alerts for: any error that occurs more than 10 times in an hour.
- Review Sentry dashboard weekly and fix reported errors promptly.

### 14.2 — Analytics
- Use **Vercel Analytics** (built-in, no extra config needed) for page views, Core Web Vitals, and Vercel Speed Insights.
- Add **Google Analytics 4** for more detailed user behavior tracking.
- Track: which tools are used most (to improve ordering), what users search for (to improve aliases), what causes errors (to fix broken tools).

### 14.3 — Uptime Monitoring
- Use a free uptime monitor (e.g., UptimeRobot) to check if the site is accessible every 5 minutes.
- Set up email alerts if the site goes down.

### 14.4 — Regular Maintenance Schedule
- **Weekly**: Review error logs, check API rate limits, verify broken tool reports.
- **Monthly**: Update dependencies (`npm outdated`, `npm update`), check for deprecated APIs, review Lighthouse scores, check sitemap.xml for accuracy.
- **Quarterly**: Audit all external API integrations for continued functionality, add new tools based on user requests and search trend data.

---

## SECTION 15 — FINAL QUALITY CHECKLIST

Before considering any version of the website complete, verify every item:

### Tools
- [ ] All 1200+ tools are present and visible (none deleted, none hidden behind "Show More")
- [ ] All tools are ordered from most-used to least-used (Tier 1 → Tier 2 → Tier 3)
- [ ] Every tool navigates to its own dedicated page (no 404 errors)
- [ ] Every tool works end-to-end without errors
- [ ] Every tool has loading, error, and success states
- [ ] Every tool has a Reset/Clear button
- [ ] Every tool has copy/download functionality where applicable
- [ ] Every tool works on mobile (320px minimum)
- [ ] Every tool is keyboard accessible

### Homepage
- [ ] Categories section removed
- [ ] Most Popular section removed
- [ ] All tools visible in the grid (with virtualization for performance)
- [ ] Search bar is prominent and functional
- [ ] Hero section is compact and tool-focused

### Search
- [ ] Instant fuzzy search with <50ms response
- [ ] Alias/synonym expansion working
- [ ] Keyboard navigation in search results
- [ ] No categories/most-popular shown during search (chips only)
- [ ] Recent searches shown in empty state

### Scientific Calculator
- [ ] Added to navbar
- [ ] Has its own dedicated page
- [ ] Looks and functions like a real Casio scientific calculator
- [ ] All scientific functions work (sin, cos, tan, log, ln, √, xⁿ, etc.)
- [ ] SHIFT key activates secondary functions
- [ ] DEG/RAD/GRAD toggle works
- [ ] Keyboard input works
- [ ] Works on mobile

### SEO
- [ ] Unique <title> on every page
- [ ] Unique <meta description> on every page
- [ ] Open Graph tags on every page
- [ ] JSON-LD structured data on every page
- [ ] Sitemap.xml is accurate and up-to-date
- [ ] robots.txt is correctly configured
- [ ] Canonical URLs on every page
- [ ] Breadcrumb schema on every tool page
- [ ] Internal links from Related Tools sections

### Performance
- [ ] Lighthouse Performance ≥85 on homepage
- [ ] No console errors in production
- [ ] All images use Next.js <Image> component
- [ ] Bundle size analyzed and optimized
- [ ] Virtual scrolling on tool grid

### Accessibility
- [ ] All images have alt text
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] No accessibility errors in axe DevTools scan

### Vercel
- [ ] All env vars configured in Vercel dashboard
- [ ] `npm run build` succeeds with no errors
- [ ] All API routes work in production
- [ ] Site loads correctly in all target browsers

---

*This prompt represents the complete, production-level improvement specification for ishutools.fun. Every section applies to every applicable part of the website. Nothing is optional. Nothing is a suggestion. Everything listed here must be implemented with full attention to detail, deep logic, and engineering excellence. The goal is a world-class tools website that ranks #1 for its category and delivers the best possible experience to every user on every device.*

---

**Website:** https://ishutools.fun  
**Vercel:** https://ishutools.vercel.app  
**Prompt Version:** 1.0 — Complete Production Master  
**Total Tools to Improve:** 1200+  
**Priority:** Maximum — No shortcuts, no demo work, no compromises.
