# Workflows Skill

## What It Does
Manages Replit workflows — the persistent background processes that run your application. Workflows are defined in `.replit` and can be started, stopped, restarted, and configured. They're what users see running in the Replit interface.

## When to Use
- App isn't showing in the preview pane
- Starting/stopping/restarting the development server
- Adding a new workflow (e.g., a separate worker process)
- Changing what port a workflow serves on
- After installing packages (workflows need restart to pick up changes)
- Configuring workflow output type (webview vs console)

## Current Workflows (ISHU TOOLS)
| Name | Command | Port | Output |
|---|---|---|---|
| `Backend API` | `python backend/run.py` | 8000 | console |
| `Start application` | `cd frontend && npm run dev` | 5000 | webview |
| `Project` | Runs both in parallel | — | — |

## Workflow Configuration (.replit)
```toml
[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "cd /home/runner/workspace/frontend && npm run dev"
waitForPort = 5000

[workflows.workflow.metadata]
outputType = "webview"  # Shows web preview to user
```

## Output Types
- `webview` — Shows the running app in the preview pane
- `console` — Shows terminal output (for backends/workers)

## Restart vs Start
- `restart_workflow` — Sends SIGTERM, waits, then SIGKILL if needed
- Use after code changes, package installations, or when app is stuck

## Troubleshooting
1. Port not responding → Check `waitForPort` matches actual server port
2. App not showing in preview → Ensure `outputType: "webview"` is set
3. Import errors → Restart after `pip install` / `npm install`
4. Port already in use → Kill old process first

## Related Skills
- `repl_setup` — Configuring host/port for Replit environment
- `package-management` — Installing packages (requires workflow restart)
- `deployment` — Production workflows are separate
