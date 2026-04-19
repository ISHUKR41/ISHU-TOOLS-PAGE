# Replit Docs Skill

## What It Does
Searches Replit's official documentation for information about platform features, pricing, deployment options, capabilities, and technical specifications. Use when you need accurate information about what Replit supports.

## When to Use
- Checking what Replit features are available at different pricing tiers
- Understanding Replit's deployment (Autoscale, Reserved VM, etc.)
- Verifying whether a specific capability exists on the platform
- Researching Replit's infrastructure details
- Answering "does Replit support X?" questions

## Key Search Areas
- Deployment types and pricing
- Resource limits (CPU, RAM, disk)
- Database capabilities
- AI/ML support
- Custom domains
- Team features
- Security and compliance

## Common Documentation Topics
```javascript
// Search Replit docs
const docs = await searchReplitDocs({ query: "deployment regions" });
const pricing = await searchReplitDocs({ query: "deployment pricing plans" });
const limits = await searchReplitDocs({ query: "resource limits CPU RAM" });
```

## Deployment Types (from Replit Docs)
- **Autoscale** — Serverless, scales to zero, pay per request
- **Reserved VM** — Always-on, dedicated compute
- **Static** — CDN-deployed static sites
- **Scheduled** — Cron job-style scheduled runs

## Resource Limits
- Check official docs for current limits (they change)
- Free tier has significant constraints
- Paid plans offer more compute and bandwidth

## Related Skills
- `deployment` — Practical deployment implementation
- `integrations` — What integrations Replit supports
