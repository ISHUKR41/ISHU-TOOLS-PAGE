# SEO Audit Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Performs comprehensive SEO audits covering technical SEO, on-page optimization, Core Web Vitals, crawl errors, structured data, and indexing issues. Also identifies content improvements and competitive keyword opportunities. Essential before and after any major ISHU TOOLS update that affects search visibility.

---

## Activation Triggers
- "SEO audit", "why am I not ranking", "SEO issues"
- "technical SEO", "meta tags review", "SEO health check"
- "my traffic dropped", "lost rankings", "not showing up in Google"
- "page speed", "core web vitals", "crawl errors", "indexing issues"
- "how do I rank for [keyword]"
- Launching a new tool category → needs SEO setup

---

## ISHU TOOLS SEO Architecture Overview

### What's Already Implemented
```typescript
// seoData.ts — auto-generates rich SEO data for every tool
export function getToolSEO(slug: string): ToolSEO {
  return {
    title: `${tool.title} — Free Online ${tool.categoryLabel} Tool`,
    description: `${tool.description} No signup needed. 100% free.`,
    keywords: [tool.slug, ...tool.tags, "free online", "ishutools.com"],
    
    // OpenGraph (Facebook, LinkedIn, WhatsApp)
    ogTitle: tool.title,
    ogDescription: tool.description,
    ogImage: `/og/${tool.category}.jpg`,
    
    // Twitter Card
    twitterCard: "summary_large_image",
    
    // JSON-LD Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.title,
      "description": tool.description,
      "url": `https://ishutools.com/tools/${slug}`,
      "applicationCategory": "UtilityApplication",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
      "operatingSystem": "Any"
    },
    
    // Breadcrumb
    breadcrumb: [
      { name: "Home", url: "https://ishutools.com" },
      { name: tool.categoryLabel, url: `https://ishutools.com/category/${tool.category}` },
      { name: tool.title, url: `https://ishutools.com/tools/${slug}` }
    ]
  }
}
```

---

## Audit Categories

### 1. Technical SEO Checklist

```bash
# Check robots.txt
curl https://ishutools.com/robots.txt
# Should contain:
# User-agent: *
# Allow: /
# Sitemap: https://ishutools.com/sitemap.xml
# Disallow: /api/  (block API routes)

# Check sitemap
curl https://ishutools.com/sitemap.xml
# Should list all 700+ tool URLs with <lastmod> dates

# Check HTTP status
curl -I https://ishutools.com/tools/compress-pdf
# Should be 200 OK (not 404 or 302)

# Check HTTPS redirect
curl -I http://ishutools.com
# Should redirect to https://

# Check canonical tag
curl https://ishutools.com/tools/compress-pdf | grep canonical
# <link rel="canonical" href="https://ishutools.com/tools/compress-pdf" />
```

### 2. Meta Tags Audit

For every tool page, verify:
```html
<!-- Title: 50-60 chars, keyword first -->
<title>Compress PDF Free — Reduce PDF Size Online | ISHU TOOLS</title>

<!-- Description: 150-160 chars, action-oriented -->
<meta name="description" content="Compress PDF files online for free. Reduce PDF file size without losing quality. No signup, no watermark. Instant PDF compression — ISHU TOOLS">

<!-- OG Tags -->
<meta property="og:title" content="Compress PDF Free — ISHU TOOLS">
<meta property="og:description" content="...">
<meta property="og:image" content="https://ishutools.com/og/pdf-core.jpg">
<meta property="og:url" content="https://ishutools.com/tools/compress-pdf">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@ISHU_IITP">
```

### 3. Page Speed / Core Web Vitals

Run Lighthouse programmatically:
```bash
# Lighthouse CLI audit
npx lighthouse https://ishutools.com/tools/compress-pdf \
  --output json \
  --only-categories performance,seo \
  --chrome-flags="--headless"

# Key metrics to check:
# LCP (Largest Contentful Paint): < 2.5s
# FID / INP (Interaction to Next Paint): < 200ms
# CLS (Cumulative Layout Shift): < 0.1
# Performance Score: > 90
```

Typical ISHU TOOLS issues:
- **LCP slow:** Hero image not preloaded → add `<link rel="preload">` for hero
- **CLS high:** Tool cards shift during load → reserve height for skeleton
- **FID slow:** Large JS bundle blocking main thread → code split more aggressively

### 4. Structured Data Audit

```javascript
// Test with web search
const results = await webFetch({ url: "https://search.google.com/test/rich-results" });
// Or check manually:
const page = await webFetch({ url: "https://ishutools.com/tools/compress-pdf" });
// Find JSON-LD blocks in <script type="application/ld+json">
```

Required structured data for ISHU TOOLS:
- `WebApplication` — for each tool page
- `BreadcrumbList` — navigation path
- `FAQPage` — for rich snippet eligibility
- `SoftwareApplication` — for app-like tools

### 5. Content SEO

For each tool page, verify:
- **H1:** Contains primary keyword (tool name)
- **H2s:** Secondary keywords (how-to, features)
- **Body copy:** 300+ words, keyword-natural, not stuffed
- **Image alt text:** All images have descriptive alts
- **Internal links:** Tool page links to related tools
- **Tool count mention:** "Join 10,000+ students using ISHU TOOLS"

---

## ISHU TOOLS Known SEO Gaps

### Critical (Fix Immediately)
```
❌ Missing sitemap.xml in frontend/public/
   Fix: Generate sitemap with all 700+ tool URLs

❌ robots.txt may be missing or incorrect
   Fix: Add to frontend/public/robots.txt

❌ CSR meta tags (React injects meta via useEffect)
   Problem: Googlebot may not execute JS to see meta
   Fix: Consider SSR with Next.js, or prerender service
```

### High Priority
```
⚠ No sitemap <lastmod> dates
   Fix: Use actual last-modified dates (or today's date for all initially)

⚠ OG images missing for most tools
   Fix: Generate generic category OG images with media-generation skill

⚠ Missing FAQ structured data on tool pages
   Fix: Add FAQ schema with common questions per tool category
```

### Medium Priority
```
• No canonical tags verified (set up in React Helmet or custom hook)
• Missing Hindi/regional language variants (hreflang)
• Tool descriptions could be more keyword-rich
```

---

## Sitemap Generation

```typescript
// scripts/generate-sitemap.ts
import { TOOLS } from '../backend/registry'

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ishutools.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  ${TOOLS.map(tool => `
  <url>
    <loc>https://ishutools.com/tools/${tool.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`
```

---

## Related Skills
- `audit-website` — Full website audit with 230+ rules (more comprehensive)
- `web-search` — Research competitor keywords
- `next-best-practices` — SSR meta tags would fix the CSR SEO problem
- `security_scan` — HTTPS setup is also a security requirement
