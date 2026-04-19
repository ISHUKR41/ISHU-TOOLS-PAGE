# Skill: seo-auditor

## Purpose
Performs comprehensive technical SEO audits — analyzing on-page optimization, technical factors, Core Web Vitals, backlink profile, content quality, and schema markup — then provides prioritized recommendations with estimated traffic impact.

## When to Use
- Need to understand why a website isn't ranking
- Need a complete technical SEO checklist
- Need to audit a specific tool page's SEO
- Need to check for common SEO mistakes
- Need Core Web Vitals assessment
- Need to check if schema markup is correct

## Audit Framework (230+ Checks)

### Category 1: Technical SEO
```
Crawlability:
□ robots.txt present and correct
□ XML sitemap present and submitted to Google Search Console
□ No noindex on important pages
□ No canonical conflicts
□ No redirect chains (A→B→C should be A→C)
□ No broken links (404 errors)
□ HTTPS on all pages (SSL certificate)
□ Mobile-friendly (passes Google's mobile test)
□ Page speed < 3 seconds on mobile

HTTP Status Codes:
□ Homepage returns 200
□ All tool pages return 200
□ Deleted pages return 301 (redirect) or 404
□ No soft 404s (200 status but "not found" content)
```

### Category 2: On-Page SEO
```
Title Tags:
□ Unique title on every page
□ Primary keyword near the start
□ 50-60 characters (not truncated in SERPs)
□ Brand name at end: "Tool Name | ISHU TOOLS"
□ No duplicate titles

Meta Descriptions:
□ Present on every page
□ 150-160 characters
□ Contains primary keyword
□ Has a call-to-action
□ No duplicate descriptions

Headings:
□ One H1 per page (contains primary keyword)
□ H2s for major sections (include secondary keywords)
□ H3s for subsections
□ Heading hierarchy is logical (no H1→H3 skips)

Content:
□ Primary keyword in first 100 words
□ LSI/related keywords used naturally
□ Content is original (not duplicate)
□ At least 300 words for tool pages
□ FAQs section (targets featured snippets)
```

### Category 3: Core Web Vitals
```
LCP (Largest Contentful Paint):
□ < 2.5 seconds = Good
□ 2.5-4s = Needs Improvement  
□ > 4s = Poor
Fix: Preload LCP image, use WebP, server-side rendering

FID/INP (Interaction to Next Paint):
□ < 200ms = Good
□ 200-500ms = Needs Improvement
□ > 500ms = Poor
Fix: Reduce JS, split code, defer non-critical scripts

CLS (Cumulative Layout Shift):
□ < 0.1 = Good
□ 0.1-0.25 = Needs Improvement
□ > 0.25 = Poor
Fix: Set width/height on images, avoid FOUT
```

### Category 4: Schema Markup
```
Recommended Schema for ISHU TOOLS:
□ SoftwareApplication (for each tool page)
□ FAQPage (for FAQ sections)
□ Organization (for homepage/about)
□ BreadcrumbList (for navigation trail)
□ WebSite + SearchAction (for sitelinks search box)

Validation: Test at schema.org/validator and 
Google's Rich Results Test: search.google.com/test/rich-results
```

## ISHU TOOLS SEO Audit Report (Sample)

### Priority 1 — Critical Issues (Fix Immediately)
```
Issue: Tool pages have generic meta descriptions
Current: "Free online tool from ISHU TOOLS" (same on all 770 pages)
Fix: Generate unique meta descriptions per tool using our formula
Impact: ★★★★★ HIGH — affects SERP click-through rate for all tools

Issue: No schema markup on tool pages
Current: No structured data
Fix: Add SoftwareApplication JSON-LD to each tool page
Impact: ★★★★ HIGH — eligible for rich snippets
```

### Priority 2 — Important Issues
```
Issue: Images missing alt text on tool icons
Fix: Add descriptive alt attributes: alt="PDF Compressor tool icon"
Impact: ★★★ MEDIUM — accessibility + image SEO

Issue: No internal linking between related tools
Fix: Add "Related Tools" section at bottom of each tool page
Impact: ★★★ MEDIUM — improves crawlability and user engagement

Issue: H1 tags not optimized for search
Current: "PDF Compressor" 
Better: "Free PDF Compressor Online — Reduce PDF Size Instantly"
Impact: ★★★ MEDIUM — improved keyword targeting
```

### Priority 3 — Improvements
```
Issue: Page load speed on mobile: 6 seconds
Target: < 3 seconds
Fix: Enable code splitting, lazy load images, use CDN
Impact: ★★★ MEDIUM — affects Core Web Vitals ranking signal

Issue: No FAQ section on tool pages
Fix: Add 5-7 FAQ questions targeting "People Also Ask" boxes
Impact: ★★ LOW-MEDIUM — featured snippet opportunity
```

## Keyword Research Results (For ISHU TOOLS)

### Target Keywords by Volume
```
Tier 1 (100k+ monthly searches, India):
• "pdf compressor" — 90,500
• "image compressor" — 74,000
• "pdf to word" — 68,000
• "word to pdf" — 45,000

Tier 2 (10k-100k monthly searches):
• "pdf merger online" — 33,100
• "remove background from image" — 27,100
• "jpg to pdf" — 22,200
• "pdf converter free" — 18,100
• "free online tools" — 12,000

Tier 3 — Long-tail (1k-10k):
• "compress pdf without losing quality" — 8,100
• "free pdf tools for students" — 2,400
• "ishu tools" — Growing (brand search)
• "ishu tools pdf" — Growing
• "tools by ishu kumar" — Growing
```

## Competitive SEO Gap Analysis
```
ISHU TOOLS vs ILovePDF:
Keywords ILovePDF ranks for that ISHU TOOLS doesn't (yet):
• "ilovepdf alternative" (3,600/mo)
• "pdf tools online free" (14,800/mo)

Quick wins: 
1. Write a blog post comparing ISHU TOOLS vs ILovePDF
2. Target "ilovepdf alternative" as a landing page keyword
3. Add "free" to more page titles
```

## Monthly SEO Maintenance Checklist
```
WEEKLY:
□ Check Google Search Console for errors
□ Monitor Core Web Vitals trends
□ Review new 404 errors

MONTHLY:
□ Review ranking positions for target keywords
□ Check for new backlinks (good and spammy)
□ Review and improve top landing pages
□ Add new FAQ questions based on Search Console queries

QUARTERLY:
□ Full technical audit (crawl with Screaming Frog equivalent)
□ Competitor keyword gap analysis
□ Update page content with new information
□ Review and refresh any tools with declining traffic
```

## Related Skills
- `seo-audit` — full-service SEO audit (user-provided skill)
- `programmatic-seo` — scaling SEO to 770+ pages
- `content-machine` — content strategy for SEO
- `competitive-analysis` — SEO competitor research
