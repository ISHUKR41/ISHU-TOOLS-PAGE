# Workflows Skill — Ultra-Detailed Reference

## What It Does
Manages Replit workflows — the persistent background processes that drive the ISHU TOOLS platform. Workflows are defined in `.replit` and controlled via Replit's process manager. They are the **only** reliable way to run long-lived servers in the Replit environment; plain shell commands die when the terminal session ends.

Every workflow has:
- **A shell command** (`args`) — the exact process to spawn
- **A port to wait on** (`waitForPort`) — Replit monitors this and marks the workflow healthy when the port opens
- **An output type** (`outputType`) — either `webview` (shows preview) or `console` (shows terminal)
- **A name** — what the user sees in the Replit UI

---

## ISHU TOOLS Current Workflows
| Name | Command | Port | Output | Purpose |
|---|---|---|---|---|
| `Backend API` | `python backend/run.py` | 8000 | `console` | FastAPI server — 700+ tool handlers |
| `Start application` | `cd frontend && npm run dev` | 5000 | `webview` | Vite React 19 app, user sees this |

---

## When to Use This Skill

### Restart (most common)
After **any** of the following, restart the relevant workflow:
- Installing a pip package (`pip install foo` → restart Backend API)
- Installing an npm package (`npm install foo` → restart Start application)
- Editing Python files (FastAPI auto-reloads via uvicorn `--reload`, but explicit restart clears state)
- Editing `.replit` workflow config
- Port conflict or hung process
- "App not loading" or "502 Bad Gateway" reports from user
- After adding new handlers to `handlers.py` — the dedup logic runs on startup

### Configure / Add
When you need to:
- Change the port a server listens on
- Add a new background worker (e.g., a task queue consumer)
- Switch outputType (e.g., make a backend show as webview for testing)
- Add environment variable overrides to a workflow

### Diagnose
When:
- Preview pane shows nothing (blank page)
- User sees "Could not connect" error
- Frontend loads but backend API calls fail (502/503)

---

## `.replit` Workflow Config Structure

```toml
# Full structure of a Replit workflow definition
[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "cd /home/runner/workspace/frontend && npm run dev"
waitForPort = 5000

[workflows.workflow.metadata]
agentBlocking = false
outputType = "webview"   # webview | console
restartOn = "manual"     # manual | fileChange | never
```

### Important fields:
- `waitForPort` — Replit won't mark workflow as running until this TCP port accepts connections. MUST match the server's actual `--port` / `PORT` value.
- `outputType = "webview"` — Required for the user to see a web preview. Only **one** workflow should be `webview` at a time (the main frontend).
- `author = "agent"` — Marks it as agent-managed (vs user-created). Both work identically.

---

## How to Restart a Workflow
Use the `restart_workflow` tool (NOT shell `kill`):

```
restart_workflow(name="Backend API")
restart_workflow(name="Start application")
```

**What happens internally:**
1. Sends `SIGTERM` to the workflow process group
2. Waits up to `workflow_timeout` seconds (default: 30s) for graceful shutdown
3. If still alive after timeout → sends `SIGKILL`
4. Spawns fresh process from the configured command
5. Monitors `waitForPort` until healthy

**Never** use `kill -9` or `pkill` manually — Replit's process manager will re-spawn it incorrectly.

---

## Common Failure Patterns & Fixes

### 1. Port already in use
**Symptom:** `Address already in use` in Backend API logs  
**Cause:** Old Python process still alive (SIGTERM wasn't caught)  
**Fix:** Restart the workflow again — second restart always succeeds because SIGKILL fires

### 2. Frontend shows blank page / spinner forever
**Symptom:** Webview shows nothing but no errors  
**Cause:** Usually the `waitForPort` value doesn't match what Vite actually binds to  
**Fix:**
```bash
# Check what port Vite is actually on:
grep -r "port" frontend/vite.config.ts
# Then update workflow waitForPort to match
```

### 3. API calls return 502
**Symptom:** Frontend loads but `/api/tools` returns 502 or network error  
**Cause:** Backend API workflow crashed or never started  
**Fix:** Check Backend API logs (`refresh_all_logs`), fix the Python error, restart

### 4. Import errors on startup
**Symptom:** `ModuleNotFoundError` in Backend API logs  
**Cause:** New pip package installed but process hasn't picked it up  
**Fix:** Always restart Backend API workflow after `pip install`

### 5. Hot reload not working
**Symptom:** Code changes in Python not reflected  
**Cause:** uvicorn `--reload` watches specific dirs; new subdirs might not be watched  
**Fix:** Add the dir to `--reload-dir` in `backend/run.py` or just restart manually

---

## Workflow Lifecycle in ISHU TOOLS

```
User visits site
      │
      ▼
Vite Dev Server (port 5000)
  └── Serves React 19 app
  └── /api/* → proxied to port 8000
          │
          ▼
    FastAPI (port 8000)
      └── backend/run.py (uvicorn)
      └── /api/tools → 700+ handlers
      └── /api/registry → category/tool list
      └── /api/health → health check
```

The Vite proxy config in `frontend/vite.config.ts` routes `/api` → `http://localhost:8000`. This means if Backend API is down, **all tool calls fail** even though the frontend loads fine.

---

## ISHU TOOLS Backend Startup Sequence

When `Backend API` starts, `handlers.py` runs its import chain:
1. Base handlers (~384)
2. Extra developer handlers (+58 → 415)
3. Text/math/encoding extras (+40 → 440)
4. Image-plus handlers (+52 → 459) 
5. Phase3 PDF/image/student (+25 → 468)
6. Health/finance handlers (+49 → 513)
7. Video/network/finance/math (+76 → 579)
8. Ultra validators/CSS/health (+99 → 668)
9. **Mega new handlers (+46 → 694)** ← newest batch

If any import fails, a WARNING is printed but the server still starts with the remaining handlers. Always check for `WARNING: Could not load` messages after restart.

---

## Adding a New Workflow

To add a third workflow (e.g., a background task queue):

```toml
# Append to .replit
[[workflows.workflow]]
name = "Task Worker"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "python backend/worker.py"
waitForPort = 8001

[workflows.workflow.metadata]
outputType = "console"
```

Then call `restart_workflow(name="Task Worker")` to start it.

---

## Performance Notes for ISHU TOOLS
- Backend API uses uvicorn with `--workers 1` (default) — single process, async I/O. For CPU-heavy tools (image processing, PDF), this can cause latency spikes. Consider `--workers 2` if needed.
- Vite dev server has HMR (Hot Module Replacement) — frontend changes don't need workflow restart, they push to browser automatically.
- Workflow restart adds ~3-5 seconds of downtime — minimize unnecessary restarts during active development.

---

## Related Skills
- `repl_setup` — Configuring host/CORS/port for Replit proxy environment
- `package-management` — Installing packages (always restart workflow after)
- `deployment` — Production uses a separate run config, not these workflows
- `diagnostics` — TypeScript/Python errors that prevent workflows from starting
