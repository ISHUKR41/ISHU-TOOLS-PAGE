# Repl Setup Skill — Ultra-Detailed Reference

## What It Does
Configures web applications to run correctly inside the Replit proxied environment. Replit's preview pane is an iframe served through a reverse proxy with mTLS — this means `localhost` references, certain CORS patterns, and default server bindings all fail unless configured correctly. This skill covers every scenario where Replit's environment causes unexpected behavior.

---

## The Replit Network Architecture

```
User's Browser
      │
      ▼
Replit Proxy (HTTPS + mTLS)
      │  proxies through
      ▼
Container (your app)
  ├── Port 5000 → Vite dev server → serves React app
  └── Port 8000 → uvicorn → FastAPI backend API
```

Key implications:
- All requests arrive **at the proxy**, not at your server directly
- The browser's `Origin` header shows `https://yourapp.replit.dev`, not `localhost`
- `localhost` from INSIDE the container reaches other services fine
- `localhost` from OUTSIDE the container (browser) is proxied

---

## Critical Configuration Requirements

### 1. Server must bind to `0.0.0.0`
```python
# FastAPI (backend/run.py)
uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
# NOT: host="127.0.0.1" (only accessible inside container)
# NOT: host="localhost" (same problem)
```

```typescript
// Vite (frontend/vite.config.ts)
server: {
  host: '0.0.0.0',    // Bind to all interfaces
  port: 5000,
  allowedHosts: true,  // CRITICAL: prevents "Invalid Host header" error
}
```

### 2. `allowedHosts: true` in Vite
Without this, Vite rejects requests from the Replit proxy domain:
```
Error: Invalid Host header
```
This appears as a blank preview pane with no helpful error message.

### 3. Use relative URLs in frontend code
```typescript
// ❌ WRONG — hardcoded localhost breaks in production and in Replit proxy
const response = await fetch('http://localhost:8000/api/tools')

// ✓ CORRECT — relative URL works everywhere
const response = await fetch('/api/tools')
// Vite proxy forwards /api → http://localhost:8000/api
```

### 4. Vite Proxy Configuration (API calls)
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path,  // Keep /api prefix
  }
}
```

---

## Port Configuration (`.replit`)

```toml
# .replit
[[ports]]
localPort = 5000
externalPort = 80    # Main entry point — users go to http://yourapp.replit.app

[[ports]]
localPort = 8000
externalPort = 8000  # Backend API (for direct API access if needed)
```

**Important:** The workflow `waitForPort` must match `localPort`:
```toml
[[workflows.workflow.tasks]]
waitForPort = 5000   # ← Must match localPort = 5000
```

---

## CORS Configuration (FastAPI)

For ISHU TOOLS, the Vite proxy handles API routing — CORS isn't needed for same-origin calls. But if the frontend ever calls the backend directly (e.g., in production without the proxy), CORS must be configured:

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "https://yourapp.replit.app",  # Your Replit dev URL
    "https://ishutools.com",       # Custom domain
    "http://localhost:5000",       # Local dev
    os.environ.get("FRONTEND_URL", ""),  # Dynamic
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Cache Control (Dev Only)

Replit's proxy can aggressively cache responses. During development, disable caching:

```python
# FastAPI — add no-cache headers in development
import os

@app.middleware("http")
async def no_cache_dev(request: Request, call_next):
    response = await call_next(request)
    if os.environ.get("NODE_ENV") != "production":
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
    return response
```

---

## Using `REPLIT_DEV_DOMAIN`

For shell commands or server-side code that needs the public URL:

```bash
# Test the backend from inside the container
curl http://localhost:8000/api/health

# Test the full stack (as the proxy sees it)
curl $REPLIT_DEV_DOMAIN/api/health
```

```python
# Get the public domain in Python
import os
public_url = os.environ.get("REPLIT_DEV_DOMAIN", "http://localhost:8000")
```

---

## Preview Pane Debugging Checklist

When the preview pane shows nothing or errors:

```
Step 1: Check workflow is running
  → refresh_all_logs → look for Backend API + Start application status

Step 2: Verify Vite binds to 0.0.0.0
  → frontend/vite.config.ts → server.host === '0.0.0.0'

Step 3: Check allowedHosts
  → server.allowedHosts === true

Step 4: Verify port matches
  → workflow waitForPort === vite server.port === .replit localPort

Step 5: Check for "Invalid Host header" in logs
  → grep "Invalid Host" /tmp/logs/Start_application_*.log

Step 6: Try hard-refresh in preview pane (Ctrl+Shift+R)

Step 7: Restart both workflows
  → restart_workflow("Backend API")
  → restart_workflow("Start application")
```

---

## Framework-Specific Notes

### Vite + React (ISHU TOOLS current stack)
```typescript
// Complete working vite.config.ts for Replit
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true }
    }
  },
  preview: {
    host: '0.0.0.0',  // Also needed for `vite preview`
    port: 5000,
  }
})
```

### FastAPI + uvicorn (ISHU TOOLS backend)
```python
# backend/run.py — complete production-ready config
import uvicorn
import os

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",          # Bind to all interfaces
        port=int(os.environ.get("PORT", 8000)),
        reload=True,              # Auto-reload in development
        reload_dirs=["backend"],  # Watch this directory
        workers=1,                # Single worker (async handles concurrency)
        log_level="info",
    )
```

---

## Related Skills
- `workflows` — waitForPort and outputType configuration
- `react-vite` — Full Vite configuration reference
- `deployment` — Production environment has different networking requirements
