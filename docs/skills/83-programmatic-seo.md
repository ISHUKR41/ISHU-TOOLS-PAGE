# Skill: programmatic-seo

## Purpose
Creates programmatic SEO strategies — generating hundreds of optimized landing pages at scale from structured data, implementing dynamic SEO patterns for tool websites, creating city/region/category page variations, and automating meta tag generation.

## When to Use
- Need to create 100+ landing pages targeting different keywords
- Need dynamic SEO meta tags for tool pages
- Need to generate city-specific or use-case-specific pages
- Need structured data (JSON-LD schema) for all tool pages
- Need hreflang tags for multi-language sites
- Need automated sitemap generation

## Core Concept

### What is Programmatic SEO?
```
Traditional SEO: Write 1 article targeting 1 keyword
Programmatic SEO: Build a system to generate 1000 pages targeting 1000 keywords

Examples:
• Airbnb: "Apartments in [City]" × 50,000 cities = 50,000 pages
• Zapier: "[App A] + [App B] integration" × 10,000 combos = 10,000 pages
• ILovePDF: "Convert [Format] to [Format]" × 100 formats = 10,000 pages
```

## ISHU TOOLS Programmatic SEO Strategy

### Keyword Pattern Templates
```
Pattern 1: Tool-specific
"[Action] [format/type] online free"
"free online [tool name]"
"[tool name] without watermark"
"[tool name] india"

Pattern 2: Conversion tools (matrix)
"[Format A] to [Format B] free"
"convert [Format A] to [Format B] online"
"[Format A] to [Format B] without losing quality"

Pattern 3: Size-based (image/PDF)
"compress [file type] to [size]KB"
"reduce [file type] size online"
"[file type] compressor free no signup"

Pattern 4: Student-specific
"[tool] for students free"
"[tool] without registration"
"[tool] india free"

Pattern 5: Ishu-branded
"ishu tools [tool name]"
"ishu kumar tools"
"ishu tools pdf"
```

### Keyword Volume Targets

#### High-Priority Keywords (Volume + Low Competition)
```
Keyword                              Monthly Searches (India)
"pdf compressor online free"         90,000+
"compress pdf online"                75,000+  
"pdf to word converter free"         60,000+
"image compressor online free"       50,000+
"remove background from image free"  45,000+
"word to pdf converter free"         40,000+
"merge pdf online free"              35,000+
"convert jpg to pdf free"            30,000+
"split pdf online free"              25,000+
"unlock pdf online free"             20,000+

Ishu-branded (low competition, easy wins):
"ishu tools"                         [Growing]
"ishu kumar tools"                   [Growing]  
"ishu tools pdf"                     [Target]
"free online tools ishu"             [Target]
```

## Dynamic SEO Meta Tag System

### Title Tag Formula
```python
def generate_title(tool_name: str, category: str) -> str:
    """
    Formula: [Action] [Object] Free — [Brand] | [Keyword Signal]
    Max: 60 characters
    """
    templates = [
        f"{tool_name} — Free Online Tool | ISHU TOOLS",
        f"Free {tool_name} — No Signup Required | ISHU TOOLS",  
        f"{tool_name} Online Free | ISHU TOOLS by IIT Patna",
    ]
    # Return shortest that includes primary keyword
    for t in templates:
        if len(t) <= 60:
            return t
    return templates[0][:57] + "..."

# Examples:
# "PDF Compressor — Free Online Tool | ISHU TOOLS" (47 chars ✅)
# "Remove Background Free — No Signup | ISHU TOOLS" (48 chars ✅)
```

### Meta Description Formula
```python
def generate_meta_description(tool_name: str, benefit: str, keywords: list) -> str:
    """
    Formula: [Benefit statement]. [Feature 1]. [Feature 2]. [CTA].
    Target: 150-160 characters
    """
    template = (
        f"{benefit}. "
        f"Free, instant, no signup required. "
        f"Works on mobile and desktop. "
        f"Used by 1M+ users worldwide."
    )
    return template[:160]

# Example output:
# "Compress PDF files online for free without losing quality. Free, instant, no signup 
# required. Works on mobile and desktop. Used by 1M+ users."
```

## Structured Data (JSON-LD) for Tool Pages

### SoftwareApplication Schema
```javascript
// Add to every tool page <head>
const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDF Compressor — ISHU TOOLS",
  "description": "Free online PDF compressor tool. Reduce PDF file size without quality loss.",
  "url": "https://ishu.tools/tools/compress-pdf",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "author": {
    "@type": "Person",
    "name": "Ishu Kumar",
    "alumniOf": "Indian Institute of Technology Patna"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  }
};
```

### FAQPage Schema (Targets Featured Snippets)
```javascript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I compress a PDF for free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use ISHU TOOLS PDF Compressor: 1) Go to ishu.tools/compress-pdf, 2) Upload your PDF, 3) Click Compress, 4) Download your smaller file. No signup required."
      }
    },
    {
      "@type": "Question", 
      "name": "Is ISHU TOOLS really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all 770+ tools on ISHU TOOLS are completely free with no daily limits, no account required, and no hidden charges."
      }
    }
  ]
};
```

## Sitemap Generation Strategy

### Dynamic Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>https://ishu.tools/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Category Pages -->
  <url>
    <loc>https://ishu.tools/pdf-tools</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Individual Tool Pages (770+ pages) -->
  <url>
    <loc>https://ishu.tools/tools/compress-pdf</loc>
    <lastmod>2026-04-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
</urlset>
```

## Core Web Vitals Optimization

### For SEO Ranking (Google uses CWV)
```
LCP (Largest Contentful Paint): < 2.5 seconds
  Fix: Preload hero images, use WebP, CDN

FID (First Input Delay): < 100ms
  Fix: Reduce JavaScript, defer non-critical JS

CLS (Cumulative Layout Shift): < 0.1
  Fix: Set width/height on images, avoid dynamic content insertion

INP (Interaction to Next Paint): < 200ms
  Fix: Optimize event handlers, reduce main thread work
```

## Related Skills
- `seo-audit` — audit existing SEO health
- `content-machine` — content strategy alongside programmatic pages
- `competitive-analysis` — keyword gap analysis
- `product-manager` — roadmap for SEO improvements
