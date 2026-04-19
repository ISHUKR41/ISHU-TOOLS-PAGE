# Diagnostics Skill — Ultra-Detailed Reference

## What It Does
Provides access to Language Server Protocol (LSP) diagnostics — the same real-time error detection VS Code uses — giving you TypeScript type errors, ESLint warnings, and import errors without having to run `tsc`. Also provides rollback capability to previous project checkpoints when changes go badly wrong.

---

## When to Use

| Situation | Action |
|---|---|
| TypeScript errors preventing build | `runDiagnostics()` to find all errors |
| "Why is the app broken?" | Diagnostics → find root cause fast |
| Before a major refactor | Count baseline errors → track improvement |
| After adding new files/imports | Verify no type errors introduced |
| User says "rollback to before X" | Suggest rollback with checkpoint info |
| Backend import error on startup | Check Python syntax/import issues |

## When NOT to Use
- Runtime errors (FastAPI 500s) → use `refresh_all_logs`
- Production errors → use `fetch_deployment_logs`
- Package not found → use `package-management`

---

## TypeScript Diagnostics

```javascript
// Get ALL errors in the frontend project
const result = await runDiagnostics({ severity: "error" });
console.log(`Total errors: ${result.diagnostics.length}`);

// View per-file
result.diagnostics.forEach(d => {
  console.log(`${d.file}:${d.line} — ${d.message}`);
});

// Filter to specific file
const fileErrors = await runDiagnostics({ 
  path: "src/features/tool/toolFields.ts",
  severity: "error"
});

// Get warnings too
const all = await runDiagnostics({ severity: "warning" });
```

**Diagnostic object shape:**
```typescript
interface Diagnostic {
  file: string;      // "src/features/tool/toolFields.ts"
  line: number;      // 42
  column: number;    // 7
  message: string;   // "Property 'url' does not exist on type..."
  severity: "error" | "warning" | "info";
  code: number;      // TypeScript error code (e.g., 2339)
}
```

---

## Common TypeScript Error Patterns in ISHU TOOLS

### Missing fields in TOOL_FIELDS
```typescript
// Error: Element implicitly has 'any' type because expression of type
//        'string' can't be used to index type...
// Fix: Add the tool's entry to TOOL_FIELDS in toolFields.ts
```

### Untyped API response
```typescript
// Error: Type 'unknown' is not assignable to type 'ToolResult'
// Fix: Add proper type assertion
const result = await callTool(slug, params) as ToolResult
```

### Missing export
```typescript
// Error: Module '"./toolPresentation"' has no exported member 'getCategoryTheme'
// Fix: Add the export in toolPresentation.ts
export function getCategoryTheme(category: string) { ... }
```

### Wrong import path
```typescript
// Error: Cannot find module '../lib/toolFields' or its corresponding type declarations
// Fix: Check actual path — it's '../features/tool/toolFields'
```

---

## Python Diagnostics (Backend)

For Python errors, diagnostics uses a combination of LSP (Pylance) and manual verification:

```bash
# Quick Python syntax check without running the server
python -m py_compile backend/app/tools/mega_new_handlers.py
echo $?  # 0 = no syntax errors

# Type checking (if mypy is installed)
mypy backend/app/tools/mega_new_handlers.py --ignore-missing-imports
```

Common backend errors:
- `IndentationError` — inconsistent tabs/spaces
- `SyntaxError` — unclosed parentheses, invalid syntax
- `ImportError` — module not found (install the package)
- `AttributeError` — wrong method name on an object

---

## Pre-Build Diagnostic Checklist

Before restarting workflows or deploying:

```javascript
const errors = await runDiagnostics({ severity: "error" });
if (errors.diagnostics.length > 0) {
  // Group by file for triage
  const byFile = errors.diagnostics.reduce((acc, d) => {
    (acc[d.file] = acc[d.file] || []).push(d);
    return acc;
  }, {});
  console.log(JSON.stringify(byFile, null, 2));
}
```

Also run manually:
```bash
# TypeScript compilation check
cd frontend && npx tsc --noEmit
echo "TypeScript: $?"

# Python syntax check
python -m py_compile backend/app/tools/mega_new_handlers.py
echo "Python: $?"
```

---

## Rollback Capability

If changes broke the app and are complex to undo:

**When to suggest rollback:**
- Multiple files changed, none of it working
- Git is showing a mess of changes with no clear fix
- User says "just undo everything from today"
- A refactor went wrong and the errors are cascading

**How to suggest:**
1. Tell the user clearly what happened and what was changed
2. Mention that Replit auto-creates checkpoints at key moments
3. Say: "I can suggest rolling back to before [change]. This will undo all changes since [time]. Want me to do that?"
4. Call `suggest_rollback()` if user confirms

**Important:** Rollback cannot be undone — make sure the user explicitly consents.

---

## Error Code Reference (TypeScript)

| Code | Meaning |
|---|---|
| 2339 | Property doesn't exist on type |
| 2345 | Argument type incompatible |
| 2304 | Cannot find name (undefined variable) |
| 7006 | Parameter implicitly has 'any' type |
| 2322 | Type not assignable |
| 2307 | Cannot find module |
| 2554 | Expected N arguments, got M |

---

## Workflow for "App is Broken"

```
1. refresh_all_logs → check workflow logs for runtime errors
2. runDiagnostics({ severity: "error" }) → check compile-time errors
3. screenshot({ type: "app_preview", path: "/" }) → see visual state
4. If errors found: fix them
5. If no errors but app still broken: check network tab in browser
6. If complex cascade of errors: suggest rollback
```

---

## Related Skills
- `validation` — Running shell commands as named CI checks
- `deployment` — Production error investigation
- `security_scan` — Code quality and security issues
- `web-search` — Looking up TypeScript error codes
