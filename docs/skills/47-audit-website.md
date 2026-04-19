# Audit Website Skill (User-Provided)

## What It Does
Audits websites for SEO, performance, security, technical issues, content quality, and 15 other categories using the `squirrelscan` CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations.

## When to Use
- "Audit my website" or "find issues with my site"
- Before launching a new version
- When traffic has dropped or SEO has declined
- Comprehensive health check including 230+ rules

## Audit Categories (230+ Rules)
1. **SEO** — Meta tags, titles, descriptions, keywords, canonical
2. **Performance** — Page speed, resource sizes, caching headers
3. **Security** — HTTPS, CSP headers, mixed content
4. **Technical** — Crawlability, robots.txt, sitemap
5. **Content** — Readability, heading structure, word count
6. **Broken Links** — All internal and external links checked
7. **Images** — Alt text, sizes, formats
8. **Mobile** — Viewport, touch targets, font sizes
9. **Accessibility** — WCAG compliance
10. **Schema** — Structured data validation
11. **Social** — OG tags, Twitter cards
12. **Core Web Vitals** — LCP, FID/INP, CLS
13. **Analytics** — Tracking setup verification
14. **Internationalization** — hreflang, language tags
15. **Progressive Enhancement** — JS-disabled fallback

## CLI Usage
```bash
# Full audit
squirrelscan https://ishutools.com --format json

# Specific category
squirrelscan https://ishutools.com --category seo

# Health score focus
squirrelscan https://ishutools.com --metric health-score
```

## Expected Report Format
```json
{
  "health_score": 78,
  "issues": {
    "critical": 2,
    "high": 8,
    "medium": 15,
    "low": 23
  },
  "recommendations": [
    { "priority": "critical", "issue": "Missing sitemap.xml", "fix": "..." }
  ]
}
```

## ISHU TOOLS Predicted Issues
- Critical: Missing sitemap.xml (needs to be generated)
- High: CSR-only meta tags (crawlers may not execute JS)
- Medium: Missing robots.txt customization
- Low: Some images without explicit dimensions

## Related Skills
- `seo-audit` — SEO-specific auditing
- `web-design-guidelines` — Accessibility review
- `security_scan` — Security vulnerability scanning
