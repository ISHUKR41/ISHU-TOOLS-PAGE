# Environment Secrets Skill — Ultra-Detailed Reference

## What It Does
Provides secure management of environment variables and secrets. Enables viewing, setting, and deleting environment variables without ever exposing sensitive values in code, chat, or files. Replit stores these in an encrypted vault — they appear at runtime as standard environment variables.

**CRITICAL RULE:** You MUST read this skill before ANY operation involving API keys, tokens, database URLs, passwords, or config values. Handling secrets incorrectly is the #1 security mistake in web development.

---

## ISHU TOOLS Secrets in Use
| Variable | Used By | Purpose | Required? |
|---|---|---|---|
| `DATABASE_URL` | FastAPI backend | PostgreSQL connection | Yes (if DB enabled) |
| `SECRET_KEY` | FastAPI sessions | JWT signing / HMAC | Yes |
| `VITE_API_BASE_URL` | Vite frontend | API base URL for browser | No (uses relative) |
| `OPENAI_API_KEY` | AI tool features | GPT API calls | Optional |
| `REDIS_URL` | Cache layer | Rate limiting / caching | Optional |

---

## Available Functions (code_execution sandbox)

### View what's set (safe — names only, never values)
```javascript
const secrets = await viewEnvVars();
console.log(secrets); // ["DATABASE_URL", "SECRET_KEY", ...]
```

### Set a secret
```javascript
await setEnvVar({ key: "OPENAI_API_KEY", value: "sk-proj-..." });
// Encrypted immediately. Value never stored in plaintext.
```

### Delete a secret
```javascript
await deleteEnvVar({ key: "OLD_API_KEY" });
```

### Request from user (secure UI dialog)
```javascript
await requestSecret({
  key: "OPENAI_API_KEY",
  description: "Your OpenAI API key — get it at platform.openai.com/api-keys"
});
// User sees a secure input box in the Replit UI. You never see the value.
```

---

## Reading Secrets at Runtime

### Python (FastAPI — backend)
```python
import os

# Required secrets — fail fast if missing
SECRET_KEY = os.environ["SECRET_KEY"]  # KeyError if not set (good!)
DATABASE_URL = os.environ["DATABASE_URL"]

# Optional secrets — provide fallback
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")

# Never do this:
# print(SECRET_KEY)  ← leaked in logs
# return {"key": api_key}  ← leaked in API response
```

### TypeScript / Vite Frontend
```typescript
// ONLY VITE_ prefixed vars are available in browser code
const apiUrl = import.meta.env.VITE_API_BASE_URL  // ✓ OK

// These DON'T work in browser-side code:
// process.env.SECRET_KEY  ← undefined in browser
// import.meta.env.SECRET_KEY  ← not exposed by Vite (correct)
```

**Vite security model:** Vite intentionally only exposes `VITE_*` vars to the browser bundle. Any var without `VITE_` prefix is stripped at build time. This prevents accidental exposure of server secrets.

---

## Security Rules (Non-Negotiable)

1. **Never hardcode secrets in source files** — even in comments, even "temporarily"
2. **Never print or log secret values** — Replit may redact, but it still briefly appears
3. **Never ask user to paste secrets in chat** — use `requestSecret()` — the UI input is encrypted
4. **Never write secrets to `.env` files** — these get committed and exposed in git
5. **Never return secrets in API responses** — even in "debug" endpoints
6. **Rotate secrets immediately if leaked** — if a key appears in code/chat → revoke + replace
7. **Principle of least privilege** — only set secrets that the current feature actually needs

---

## After Setting a Secret — Restart Required

Secrets take effect in new processes. Existing processes don't see new values until restarted:

```
Secret set in vault
      ↓
restart_workflow(name="Backend API")   ← Python reads os.environ at startup
restart_workflow(name="Start application")  ← if a VITE_ var changed (rebuild needed)
```

Python's `os.environ` is loaded **once** at process start. You can force re-read with:
```python
import importlib, os
os.environ.update({})  # Won't work — need process restart
```
Always restart the workflow.

---

## Variable Naming Conventions

```
DATABASE_URL          SCREAMING_SNAKE_CASE for backend vars
SECRET_KEY            Generic secret keys
OPENAI_API_KEY        SERVICE_NAME_API_KEY pattern
STRIPE_SECRET_KEY     Platform convention (Stripe uses this name)
VITE_API_BASE_URL     Frontend vars MUST start with VITE_
VITE_SITE_URL         Frontend-visible config
```

---

## Development vs Production Secrets

These are **completely separate vaults:**
- Development → secrets set in Replit dev environment → used when `npm run dev` / `uvicorn` runs
- Production → secrets must be set separately in Replit's deployment settings

Common mistake: setting `OPENAI_API_KEY` in dev but forgetting to set it in production → deployed app shows errors even though dev works fine.

To fix: Go to deployment settings → environment variables → add all secrets again.

---

## Checking What's Set (Safe Pattern)
```javascript
// Before starting work, audit what exists
const vars = await viewEnvVars();
const missing = ["DATABASE_URL", "SECRET_KEY"].filter(k => !vars.includes(k));
if (missing.length) {
  console.log("Missing required secrets:", missing);
}
```

---

## Common Mistakes to Avoid

```python
# ❌ WRONG — hardcoded secret in source
OPENAI_KEY = "sk-proj-abc123xyz"

# ❌ WRONG — .env file committed to git
# .env file: SECRET_KEY=my_secret_value

# ❌ WRONG — logging secret
logger.info(f"Using API key: {api_key}")

# ✓ CORRECT — read from environment, no logging
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not configured")
```

---

## Related Skills
- `integrations` — Check FIRST before requesting any third-party API key manually
- `deployment` — Production has a separate secrets vault
- `database` — `DATABASE_URL` is the most critical secret for ISHU TOOLS backend
