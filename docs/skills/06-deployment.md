# Deployment Skill — Ultra-Detailed Reference

## What It Does
Manages the full lifecycle of publishing ISHU TOOLS to Replit's production cloud infrastructure. Production is completely separate from development — its own container, its own database, its own environment variables. This skill handles: configuring what command runs in prod, publishing the app, debugging production-only errors, fetching live server logs, and pointing a custom domain.

---

## Production vs Development Architecture

```
DEVELOPMENT (what you build in)           PRODUCTION (what users access)
─────────────────────────────────         ────────────────────────────────
Vite dev server (HMR, source maps)   →   Built + minified static bundle
uvicorn --reload (auto-reload)        →   uvicorn (no reload, optimized)
SQLite or dev Postgres                →   Isolated Postgres instance
Secrets from dev vault                →   Secrets from production vault
localhost:5000 / 8000                 →   yourapp.replit.app (or custom domain)
```

---

## When to Use This Skill

### Publishing / Deploying
- User says: "publish my app", "make it live", "deploy", "go production"
- A new feature is complete and verified working in development
- Initial launch of ISHU TOOLS to the public

### Debugging Production Issues
- "My deployed app shows a 500 error"
- "It works locally but crashes on the live site"
- "The production site is down"
- "API calls fail in production"
- User reports errors on ishutools.com (custom domain)

### Configuration
- Changing which port the production server runs on
- Setting production environment variables
- Configuring deployment regions (US, EU, Asia)
- Setting up custom domain

---

## Deployment Configuration

```javascript
// Configure the deployment (run before publishing)
await deployConfig({
  deploymentTarget: "autoscale",  // "autoscale" | "static" | "reserved-vm"
  run: "python backend/run.py",   // Production start command
  build: "cd frontend && npm run build",  // Build step
  publicDir: "frontend/dist"      // Serve built static files
});
```

### Deployment Target Types
| Type | Best For | Scaling |
|---|---|---|
| `autoscale` | Web apps with variable traffic | Auto scales up/down |
| `static` | Static sites, no backend | CDN-served, no server cost |
| `reserved-vm` | Always-on, consistent resources | Fixed VM, no cold starts |

For ISHU TOOLS (full-stack React + FastAPI): **`autoscale`** is the correct choice.

---

## Publishing

After configuration:
```javascript
// Present the deploy button to the user (they click to confirm)
// Use the suggest_deploy tool (not a function you call in code_execution)
suggest_deploy()
```

**Important:** Only call `suggest_deploy` when:
1. The app is fully working in development
2. All critical features are tested
3. No known errors or broken handlers
4. Production environment variables are configured

---

## Fetching Production Logs

When a production issue is reported, use `fetch_deployment_logs`:

```javascript
// Get all recent production logs
const logs = await fetch_deployment_logs({});

// Filter for errors only
const errors = await fetch_deployment_logs({
  message: "ERROR|Exception|traceback|500"
});

// With context (see lines before/after each error)
const withContext = await fetch_deployment_logs({
  message: "ERROR",
  message_context: { lines: 10, limit: 3 }
});

// Time-filtered (last hour)
const recent = await fetch_deployment_logs({
  after_timestamp: (Date.now() - 3600000)  // ms since epoch
});
```

### Common Error Patterns to Search
```
"ERROR"              → All errors
"Exception"          → Python exceptions
"traceback"          → Python stack traces
"ModuleNotFoundError" → Missing package in production
"KeyError"           → Missing environment variable (os.environ["KEY"] failed)
"refused"            → Connection refused (DB, Redis, external API)
"timeout"            → Slow external services
"502|503|504"        → Gateway errors (backend crashed)
```

---

## Debugging Production-Only Issues

### Pattern: Works in dev, breaks in prod

**Step 1:** Check production logs
```javascript
const logs = await fetch_deployment_logs({ message: "ERROR|traceback" });
```

**Step 2:** Check production environment variables
```javascript
// In production, secrets must be set separately
// Common issue: OPENAI_API_KEY set in dev but not production
```

**Step 3:** Check if it's a build issue
```bash
# Test the production build locally
cd frontend && npm run build
# Look for build errors in the output
```

**Step 4:** Check for path differences
- Dev: `/home/runner/workspace/backend/...`
- Prod: paths might differ — always use `os.path.dirname(__file__)` relative paths

### Common Production-Only Failures

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ModuleNotFoundError` | Package not in requirements.txt | Add + redeploy |
| `KeyError: 'OPENAI_API_KEY'` | Missing prod secret | Set in deployment env vars |
| 502 Bad Gateway | Backend crashed | Check logs for Python error |
| Static assets 404 | Wrong `publicDir` config | Update deployConfig |
| Database connection refused | Wrong `DATABASE_URL` in prod | Set production DATABASE_URL |
| CORS errors | Production domain not in CORS allowlist | Update FastAPI CORS settings |

---

## ISHU TOOLS Production Configuration

```python
# backend/run.py — production-safe startup
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    workers = int(os.environ.get("WORKERS", 1))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        workers=workers,
        log_level="info",
        # NO --reload in production
    )
```

```typescript
// vite.config.ts — production build settings
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,   // Don't expose source in production
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        }
      }
    }
  }
})
```

---

## Custom Domain Setup
1. In Replit deployment settings → Custom Domain → Enter `ishutools.com`
2. Add DNS records at your registrar:
   - `CNAME www → your-repl.replit.app`
   - `A @ → Replit's IP`
3. Replit handles TLS/HTTPS automatically via Let's Encrypt

---

## Production Checklist Before Deploying
- [ ] All 694 handlers load without `WARNING` messages
- [ ] All new tool pages work end-to-end (submit form → see result)
- [ ] `npm run build` completes without TypeScript errors
- [ ] Production environment variables are set (DATABASE_URL, SECRET_KEY, etc.)
- [ ] SEO meta tags are correct on all tool pages
- [ ] `robots.txt` and `sitemap.xml` are accessible
- [ ] PWA manifest is valid
- [ ] No console errors on tool pages
- [ ] Mobile responsive (test at 375px viewport)

---

## Related Skills
- `database` — Querying production database (read-only)
- `environment-secrets` — Production secrets need separate configuration
- `workflows` — Development workflows (different from production)
- `security_scan` — Run before first production deploy
