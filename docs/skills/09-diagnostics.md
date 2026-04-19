# Diagnostics Skill

## What It Does
Provides access to Language Server Protocol (LSP) diagnostics — static analysis errors, TypeScript type errors, ESLint warnings — and offers tools for investigating project health. Also provides the ability to suggest project rollback to a previous checkpoint.

## When to Use
- Debugging TypeScript compilation errors
- Finding ESLint warnings across the codebase
- Investigating why the app won't build
- Before a major refactor — assess current error count
- User wants to rollback after a bad change
- App is broken and you need to identify root cause quickly

## Key Capabilities
- `runDiagnostics()` — Get all LSP errors/warnings for the project
- Filter by severity: `error`, `warning`, `info`
- Filter by file path or pattern
- Count errors per file for triage
- Identify the most problematic files

## Rollback Capability
If changes made the app worse and are difficult to undo, suggest a rollback:
1. Tell the user what went wrong clearly
2. Propose rolling back to a specific checkpoint
3. Checkpoints are created automatically at key moments

## Usage Notes
- LSP diagnostics are faster than running `tsc` manually
- Returns structured data: file, line, column, message, severity
- Great for "does this code compile?" checks before running
- Use before and after major changes to track error count

## Common Patterns
```javascript
// Get all TypeScript errors
const errors = await runDiagnostics({ severity: "error" });

// Check specific file
const fileErrors = await runDiagnostics({ path: "src/components/ToolCard.tsx" });

// Count errors for triage
console.log(`Total errors: ${errors.diagnostics.length}`);
```

## Related Skills
- `validation` — Running shell commands as CI checks
- `deployment` — Production error investigation
- `web-search` — Looking up error messages
