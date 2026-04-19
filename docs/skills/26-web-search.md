# Web Search Skill

## What It Does
Searches the web, fetches page content, extracts brand profiles, and captures screenshots from URLs. Essential for finding current documentation, researching libraries, checking competitor designs, and getting real-time information.

## When to Use
- Looking up current API documentation
- Researching a library or framework before using it
- Checking what a website looks like for design reference
- Finding error solutions for unfamiliar errors
- Getting current information (events after training cutoff)
- Extracting branding colors/fonts from a reference site

## Key Capabilities

### Web Search
```javascript
const results = await webSearch({ query: "yt-dlp python API documentation" });
// Returns: list of results with title, URL, snippet
```

### Fetch Page Content
```javascript
const content = await webFetch({ url: "https://docs.example.com/api" });
// Returns: extracted text content from the page
```

### Extract Brand Profile
```javascript
const brand = await extractBranding({ url: "https://stripe.com" });
// Returns: colors, fonts, design tokens from the site
```

### Screenshot
```javascript
const screenshot = await screenshot({ type: "external_url", url: "https://ilovepdf.com" });
// Returns: image of the page for visual reference
```

## Best Practices
1. Use specific search queries — "yt-dlp format selection python" not just "yt-dlp"
2. Fetch documentation pages directly when you know the URL
3. Use brand extraction when matching a specific site's aesthetic
4. Screenshots are useful for design reference and competitor analysis

## Common Use Cases for ISHU TOOLS
- Checking how iLovePDF, PDFCandy, or Smallpdf handle a specific UI
- Finding yt-dlp documentation for video downloader improvements
- Researching SEO best practices for tool pages
- Finding the latest Tailwind CSS utilities

## Related Skills
- `agent-tools` — User-provided skill with web search via Tavily/Exa
- `seo-audit` — Specialized SEO research and auditing
