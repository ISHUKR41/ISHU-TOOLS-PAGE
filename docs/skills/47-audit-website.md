# Audit Website Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Performs a comprehensive automated website audit using the `squirrelscan` CLI — checking 230+ rules across 15+ categories including SEO, performance, security, technical, content, accessibility, mobile-friendliness, broken links, structured data, Core Web Vitals, social media tags, analytics, and internationalization. Returns LLM-optimized reports with health scores and prioritized recommendations.

---

## When to Use

- "Audit my website" — full health check
- "Find what's wrong with my site" — discovery mode
- Before launching a new version — pre-launch gate
- After traffic drops or rankings decline — diagnosis
- Competitive analysis: audit iLovePDF/smallpdf to understand their advantage
- Monthly maintenance check
- After deploying major changes

## When to Use seo-audit instead
- Specifically focusing on Google ranking factors
- Keyword research and targeting
- Competitor keyword analysis

---

## CLI Usage

```bash
# Full audit — all 230+ rules
squirrelscan https://ishutools.com --format json

# Single category audit
squirrelscan https://ishutools.com --category seo
squirrelscan https://ishutools.com --category performance
squirrelscan https://ishutools.com --category accessibility
squirrelscan https://ishutools.com --category security

# Audit a specific page (most important for ISHU TOOLS)
squirrelscan https://ishutools.com/tools/compress-pdf --category seo

# Bulk audit: check all tool pages
squirrelscan https://ishutools.com/sitemap.xml --bulk --category seo

# Comparison: audit vs competitor
squirrelscan https://ishutools.com --compare https://www.ilovepdf.com
```

---

## Audit Categories (230+ Rules)

### 1. SEO (50+ rules)
- Title tags: length, keyword presence, uniqueness
- Meta descriptions: length, action-oriented, uniqueness
- Canonical tags: present, self-referential
- H1 hierarchy: one per page, keyword-rich
- Internal linking structure
- Image alt text completeness
- Keyword density and natural usage
- Page URLs: clean, keyword-inclusive

### 2. Performance (30+ rules)
- Resource sizes: JS bundle, CSS, images
- Caching headers: Cache-Control, ETags
- Compression: gzip/brotli enabled
- Render-blocking resources
- Unused CSS/JS detection
- Critical CSS inlining
- Third-party script impact

### 3. Security (20+ rules)
- HTTPS: all resources, no mixed content
- Content Security Policy (CSP) header
- X-Frame-Options, X-XSS-Protection
- HSTS (HTTP Strict Transport Security)
- Cookie security: Secure, HttpOnly, SameSite flags
- Information disclosure via headers

### 4. Technical (25+ rules)
- Robots.txt: exists, configured correctly
- Sitemap.xml: exists, valid, submitted to Search Console
- Crawlability: no accidental noindex, no orphan pages
- 404 error page: custom, not generic
- Redirect chains: no 301→301→301 chains

### 5. Content (20+ rules)
- Readability score (Flesch-Kincaid)
- Word count: sufficient for topic
- Heading structure: H1→H2→H3 hierarchy
- Duplicate content detection
- Thin content pages

### 6. Broken Links (unlimited)
- All internal links checked (returns 200/301 or 404)
- External links checked
- Image source URLs checked
- Anchor link targets verified

### 7. Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1
- FCP (First Contentful Paint): < 1.8s

### 8. Social (15+ rules)
- Open Graph tags: og:title, og:description, og:image, og:url, og:type
- Twitter Card tags: card type, title, description, image
- OG image dimensions (1200×630px recommended)
- Social preview simulation

### 9. Structured Data (Schema.org)
- WebApplication, SoftwareApplication
- BreadcrumbList
- FAQPage (for rich results)
- Organization (for site-wide)
- Schema validation: no errors via validator.schema.org

### 10. Accessibility
- Color contrast ratios
- ARIA labels
- Keyboard navigation
- Focus management
- Form labels
- Skip navigation links

---

## Expected Report Structure

```json
{
  "url": "https://ishutools.com",
  "audited_at": "2026-04-19T10:30:00Z",
  "health_score": 72,
  "issues": {
    "critical": 3,
    "high": 11,
    "medium": 24,
    "low": 45
  },
  "categories": {
    "seo": { "score": 68, "issues": 14 },
    "performance": { "score": 82, "issues": 6 },
    "security": { "score": 90, "issues": 2 },
    "technical": { "score": 55, "issues": 8 },
    "accessibility": { "score": 74, "issues": 9 }
  },
  "recommendations": [
    {
      "priority": "critical",
      "category": "technical",
      "issue": "Missing sitemap.xml",
      "url": "https://ishutools.com/sitemap.xml",
      "impact": "Google cannot discover your 700+ tool pages",
      "fix": "Generate sitemap.xml with all tool URLs and add to /public/. Submit to Google Search Console."
    },
    {
      "priority": "high",
      "category": "seo",
      "issue": "Meta tags injected via client-side JavaScript",
      "impact": "Crawlers that don't execute JS see empty meta tags",
      "fix": "Migrate to Next.js SSR or use a prerendering service"
    }
  ]
}
```

---

## ISHU TOOLS Predicted Audit Results

Based on current architecture:

| Category | Expected Score | Key Issues |
|---|---|---|
| SEO | 65-70 | CSR meta tags, missing sitemap |
| Performance | 80-85 | Good (Vite, code splitting) |
| Security | 85-90 | Good (HTTPS, but CSP missing) |
| Technical | 50-60 | No sitemap, robots.txt needs update |
| Accessibility | 70-75 | Some aria-label gaps, contrast check needed |
| Social | 60-70 | OG images missing for most tools |
| Structured Data | 75-80 | Good JSON-LD, may have validation errors |

**Overall Predicted Health Score: ~72/100**

---

## Acting on Audit Results

Priority order:
1. **Critical** → Fix immediately (blocking indexation or causing errors)
2. **High** → Fix before next deploy
3. **Medium** → Schedule for next sprint
4. **Low** → Batch and fix quarterly

---

## Competitive Audit

```bash
# Audit the top 3 competitors to understand their advantages
squirrelscan https://www.ilovepdf.com --format json > /tmp/ilovepdf-audit.json
squirrelscan https://smallpdf.com --format json > /tmp/smallpdf-audit.json
squirrelscan https://www.pdf2go.com --format json > /tmp/pdf2go-audit.json

# Compare scores
cat /tmp/ilovepdf-audit.json | jq '.health_score'
```

This reveals what ISHU TOOLS competitors are doing well that we can learn from or exceed.

---

## Related Skills
- `seo-audit` — SEO-focused analysis with keyword research
- `web-design-guidelines` — Accessibility audit (overlapping with squirrelscan)
- `security_scan` — Code-level security scanning (squirrelscan checks headers/config)
- `web-search` — Research solutions to issues found
