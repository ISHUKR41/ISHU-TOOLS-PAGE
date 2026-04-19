# Web Search Skill — Ultra-Detailed Reference

## What It Does
Searches the web, fetches page content, extracts brand color/font profiles, and captures screenshots from URLs. Provides real-time information beyond training data — critical for looking up current API docs, researching libraries, checking competitor design, and finding solutions to novel errors.

---

## When to Use

| Situation | Action |
|---|---|
| New library — need current docs | `webFetch` the documentation URL directly |
| Error message not in training data | `webSearch` the exact error message |
| "What does competitor X look like?" | `screenshot` their site |
| "Match the design of Stripe/Apple" | `extractBranding` for colors + fonts |
| "How does yt-dlp handle X format?" | `webFetch` yt-dlp docs or GitHub |
| SEO research | `webSearch` for top-ranking pages on that keyword |
| Current package version | `webSearch` "package-name latest version npm" |

## When NOT to Use
- Replit-specific questions → use `replit-docs` skill
- Image/media downloads → use `media-generation` skill
- Searching within the project codebase → use `grep` / `glob` tools

---

## Available Functions

### webSearch — Search the web
```javascript
const results = await webSearch({ 
  query: "yt-dlp extract info without downloading python 2024" 
});
// Returns:
// {
//   searchAnswer: "Direct answer text if found",
//   resultPages: [
//     { title: "...", url: "https://...", snippet: "..." },
//     ...
//   ]
// }
```

**Query writing tips:**
- Be specific: `"fastapi background tasks celery" NOT "fastapi async"`
- Include year for current info: `"react 19 concurrent features 2024"`
- Include context: `"pillow pdf to image resolution dpi python"`
- For errors: paste the exact error text in quotes

### webFetch — Fetch page content
```javascript
const page = await webFetch({ url: "https://docs.python.org/3/library/os.html" });
// Returns: { content: "Full extracted text from the page..." }
```

Best for:
- Documentation pages you know the URL of
- GitHub README files: `https://raw.githubusercontent.com/user/repo/main/README.md`
- API reference pages
- Package changelogs

### extractBranding — Get design tokens from a site
```javascript
const brand = await extractBranding({ url: "https://stripe.com" });
// Returns:
// {
//   colors: { primary: "#635BFF", background: "#0A2540", ... },
//   fonts: { heading: "Sohne", body: "Sohne" },
//   gradients: [...],
//   designStyle: "minimalist, professional, purple accent"
// }
```

Use this when the user wants to match the aesthetic of a specific real website — iLovePDF, Smallpdf, Adobe, Figma, etc.

### screenshot — Capture a page visually
```javascript
// External website
const img = await screenshot({ type: "external_url", url: "https://ilovepdf.com" });

// Running app (for verification)
const app = await screenshot({ type: "app_preview", path: "/tools/compress-pdf" });
```

Returns an image you can analyze for layout, design, and content verification.

---

## ISHU TOOLS-Specific Use Cases

### Finding Better Handler Logic
```javascript
// Looking for yt-dlp format info extraction
const docs = await webFetch({ url: "https://github.com/yt-dlp/yt-dlp/blob/master/README.md" });
// Read to understand the --print-json, --format, --no-download options
```

### Competitor Analysis
```javascript
// See how iLovePDF handles their tool page layout
const screenshot1 = await screenshot({ type: "external_url", url: "https://www.ilovepdf.com/compress_pdf" });
const screenshot2 = await screenshot({ type: "external_url", url: "https://smallpdf.com/compress-pdf" });
// Compare layouts, CTAs, trust signals
```

### SEO Research
```javascript
// Find top-ranking pages for a keyword
const results = await webSearch({ query: "site:ishutools.com OR site:ilovepdf.com compress pdf free" });
// See what meta descriptions look like for competitors
```

### Design Inspiration
```javascript
// Extract Apple's design tokens
const appleDesign = await extractBranding({ url: "https://apple.com" });
// Returns their SF Pro font, white/gray palette, large spacing rhythm

// Stripe's design system
const stripeDesign = await extractBranding({ url: "https://stripe.com" });
// Returns their purple accent (#635BFF), dark navy backgrounds
```

### Library Documentation
```javascript
// Framer Motion API
const docs = await webFetch({ url: "https://www.framer.com/motion/animation/" });

// Pillow imaging library
const pillowDocs = await webFetch({ url: "https://pillow.readthedocs.io/en/stable/reference/Image.html" });

// FastAPI background tasks
const fastDocs = await webFetch({ url: "https://fastapi.tiangolo.com/tutorial/background-tasks/" });
```

---

## Best Practices

### 1. Fetch documentation directly (faster than search)
```javascript
// If you know the URL:
await webFetch({ url: "https://docs.fastapi.tiangolo.com/advanced/response-directly/" })
// Don't bother searching for it
```

### 2. Use specific queries for search
```javascript
// ❌ Too vague
await webSearch({ query: "python pdf" })

// ✓ Specific and actionable  
await webSearch({ query: "pypdf2 extract text from scanned pdf OCR python" })
```

### 3. Screenshot before redesigning
Always screenshot the current state AND competitor references before redesigning:
```javascript
// Current ISHU TOOLS page
await screenshot({ type: "app_preview", path: "/tools/compress-pdf" })
// Competitor
await screenshot({ type: "external_url", url: "https://smallpdf.com/compress-pdf" })
```

### 4. Combine search + fetch
```javascript
// Step 1: Find relevant page
const results = await webSearch({ query: "ghostscript pdf compression command line options" })
// Step 2: Fetch the most relevant result
const details = await webFetch({ url: results.resultPages[0].url })
```

---

## Rate Limits & Cost
- Web searches cost tokens — avoid excessive searches
- For known URLs, always prefer `webFetch` over `webSearch`
- `extractBranding` is heavier — use when you actually need the design tokens
- Screenshots are the most expensive — use only when visual reference is essential

---

## Related Skills
- `agent-tools` — User-provided skill with Tavily/Exa web search (alternative)
- `seo-audit` — Specialized for SEO research and competitive analysis
- `media-generation` — For generating images (not fetching external ones)
- `audit-website` — Full website audit with 230+ rules
