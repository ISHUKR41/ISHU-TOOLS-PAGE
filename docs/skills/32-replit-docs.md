# Replit Docs Skill — Ultra-Detailed Reference

## What It Does
Searches Replit's official documentation for accurate, current information about platform features, capabilities, pricing tiers, deployment options, resource limits, and technical specifications. Essential for answering "does Replit support X?" before attempting to implement something that might not be possible.

---

## When to Use

| Question | Search for |
|---|---|
| "Does Replit support WebSockets?" | "websocket support" |
| "What's the RAM limit on free tier?" | "resource limits free plan" |
| "Can I deploy to a specific region?" | "deployment regions" |
| "Does Replit have a CDN?" | "CDN static deployment" |
| "What's the max file upload size?" | "storage limits file upload" |
| "Can I use Docker?" | "docker containerization" |
| "How does Autoscale billing work?" | "autoscale pricing" |

## When NOT to Use
- For general programming questions → use `web-search` or training knowledge
- For specific third-party library docs → `web-search` or `webFetch` their docs
- For Replit-specific bugs → use `web-search` for community answers

---

## Available Function

```javascript
// Search Replit documentation
const results = await searchReplitDocs({ query: "deployment regions autoscale" });
console.log(results);
```

---

## Replit Deployment Types (Reference)

### Autoscale (Recommended for ISHU TOOLS)
- Serverless deployment that scales to zero when no traffic
- Scales up automatically when requests come in
- **Cold starts:** ~1-2 seconds when scaling from zero (important for ISHU TOOLS!)
- Pay per request/compute unit
- Best for: variable traffic web apps, APIs

### Reserved VM
- Always-on dedicated compute instance
- No cold starts — process is always running
- Fixed cost regardless of traffic
- Best for: high-traffic apps, apps with persistent state, WebSocket servers

### Static
- CDN-deployed static files (HTML, CSS, JS)
- Zero server — pure client-side rendering
- Fastest performance for pure static sites
- Best for: marketing pages, documentation

### Scheduled (Cron)
- Runs on a schedule (cron expression)
- Best for: background jobs, data sync, report generation

---

## Resource Limits Reference (Always Verify Current Values)

| Resource | Free Tier | Typical Paid |
|---|---|---|
| RAM | ~512MB | 2GB+ |
| CPU | 0.5 vCPU | 2+ vCPU |
| Storage | 1GB | 10GB+ |
| Outbound bandwidth | Limited | Higher |
| Concurrent connections | Limited | Higher |

**Always check current official docs** — these change with Replit's pricing updates.

---

## ISHU TOOLS-Specific Replit Questions

### Can ISHU TOOLS handle 1000 concurrent users?
Search: "autoscale concurrency limits" + "reserved vm scaling"

### What happens to uploaded files when Autoscale scales to zero?
Search: "autoscale persistent storage" — Answer: No — use external storage (S3, R2) for persistent files

### Can I use ffmpeg/ghostscript on Replit?
Search: "system packages nix" — Answer: Yes, via Nix system dependencies

### Does Replit support custom domains with HTTPS?
Search: "custom domain ssl https" — Answer: Yes, auto-TLS via Let's Encrypt

### Can I run a background worker alongside the web server?
Search: "multiple workflows processes" — Answer: Yes, configure multiple workflows

### Maximum request timeout?
Search: "request timeout limits" — Check this before building tools with long processing times (video download, large PDF conversion)

---

## Key Platform Limitations to Know

### Things that DON'T work in standard Replit:
- Docker/containerization (`docker run`, `docker-compose`)
- Virtual environments (`venv`, `conda`) — use Nix instead
- `apt-get`/`brew` package management — use Nix system deps
- Root access / `sudo`
- Running on specific hardware (GPU inference is limited)
- Custom OS-level services (systemd, etc.)

### Things that DO work:
- Full Python, Node.js, Rust, Go, etc.
- PostgreSQL (built-in)
- Redis (via external connection)
- WebSockets
- File system access (with Nix-managed tools)
- External API calls
- Background tasks (async Python/Node)
- Multiple ports (multiple workflows)

---

## Common Replit Documentation URLs

```
https://docs.replit.com/
https://docs.replit.com/deployments/autoscale
https://docs.replit.com/deployments/custom-domains
https://docs.replit.com/replit-workspace/nix/nix-on-replit
https://docs.replit.com/category/databases
```

---

## Related Skills
- `deployment` — Practical deployment implementation based on what Replit supports
- `package-management` — Nix system dependencies (what IS supported)
- `workflows` — Understanding Replit's process management
