# Repl Setup Skill

## What It Does
Configures web applications to run correctly in the Replit proxied environment. Covers host configuration, frontend/backend connectivity, cache control, and framework-specific setup for Angular, React, Vite, and Vue.

## Why This Matters
Replit's preview pane is a **proxied iframe** — the app is served through a reverse proxy with mTLS. Direct `localhost` access doesn't work from outside the container. All servers must bind to `0.0.0.0`.

## Critical Replit Requirements

### Server Must Bind to 0.0.0.0
```python
# FastAPI/Uvicorn
uvicorn.run("app:app", host="0.0.0.0", port=8000)
```

```typescript
// Vite
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,  // REQUIRED — prevents "Invalid Host" errors
  }
})
```

### Use REPLIT_DEV_DOMAIN for External URLs
```bash
# In shell scripts, use public domain instead of localhost
curl $REPLIT_DEV_DOMAIN/api/health

# In app code, use relative URLs
fetch('/api/tools')  # Good — works across environments
fetch('http://localhost:8000/api/tools')  # Bad — breaks in production
```

### Cache Control (Development Only)
```typescript
if (process.env.NODE_ENV !== 'production') {
  res.setHeader('Cache-Control', 'no-store')
}
```

## Port Configuration (.replit)
```toml
[[ports]]
localPort = 5000
externalPort = 80   # Main web interface

[[ports]]
localPort = 8000
externalPort = 8000  # Backend API
```

## Preview Debugging Checklist
1. ✅ Server binds to `0.0.0.0` (not `127.0.0.1`)
2. ✅ `allowedHosts: true` in Vite config
3. ✅ Workflow uses correct port
4. ✅ Correct port in `.replit` `[[ports]]`
5. ✅ No hard-coded `localhost` URLs in frontend code

## Framework-Specific Notes

### Vite + React (Current Stack)
- Use proxy config for API calls (avoid CORS issues)
```typescript
proxy: {
  '/api': { target: 'http://localhost:8000', changeOrigin: true }
}
```

## Related Skills
- `workflows` — Managing workflow configuration
- `react-vite` — React-specific patterns
- `deployment` — Production environment setup
