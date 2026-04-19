# Validation Skill — Ultra-Detailed Reference

## What It Does
Registers shell commands as named, repeatable validation steps — essentially a local CI pipeline that runs inside the Replit environment. Instead of manually running `npx tsc` and remembering the output, you register a "TypeScript Check" validation once and trigger it by name from anywhere. Results are tracked and accessible.

---

## When to Use

| Situation | Validation to Run |
|---|---|
| After adding new TypeScript files | TypeScript Check |
| After a major refactor | TypeScript Check + ESLint |
| Before saying "done" to user | All validations |
| Before suggesting deployment | Frontend Build |
| After adding new Python handlers | Python Import Check |
| Weekly code quality review | All validations |

---

## Available Functions (code_execution sandbox)

### Register a validation step
```javascript
// Create or update a validation (upsert behavior)
await setValidationCommand({
  name: "TypeScript Check",
  command: "cd /home/runner/workspace/frontend && npx tsc --noEmit --pretty 2>&1 | tail -20"
});
```

### Run a specific validation
```javascript
const result = await runValidation({ name: "TypeScript Check" });
console.log(result.output);  // Output of the command
console.log(result.exitCode);  // 0 = pass, non-zero = fail
```

### Run all validations
```javascript
const results = await runAllValidations();
results.forEach(r => {
  const status = r.exitCode === 0 ? "✓" : "✗";
  console.log(`${status} ${r.name}: ${r.exitCode === 0 ? 'PASS' : 'FAIL'}`);
});
```

### Check validation status
```javascript
const status = await getValidationStatus({ name: "TypeScript Check" });
console.log(status);
// { name: "TypeScript Check", status: "passed" | "failed" | "running", lastRun: "..." }
```

---

## ISHU TOOLS Validation Suite

Set up these validations once and run them regularly:

```javascript
// Full ISHU TOOLS validation suite setup

// 1. TypeScript compile check
await setValidationCommand({
  name: "TypeScript",
  command: "cd /home/runner/workspace/frontend && npx tsc --noEmit 2>&1 | tail -30"
});

// 2. Frontend build check
await setValidationCommand({
  name: "Frontend Build",
  command: "cd /home/runner/workspace/frontend && npm run build 2>&1 | tail -20"
});

// 3. Python syntax check (all backend files)
await setValidationCommand({
  name: "Python Syntax",
  command: "python -m py_compile backend/app/tools/handlers.py backend/app/tools/mega_new_handlers.py backend/app/registry.py && echo 'All Python files OK'"
});

// 4. Backend handler count check
await setValidationCommand({
  name: "Handler Count",
  command: "python -c \"from backend.app.tools.handlers import HANDLERS; count = len(HANDLERS); print(f'{count} handlers loaded'); exit(0 if count >= 600 else 1)\""
});

// 5. Registry tool count check
await setValidationCommand({
  name: "Registry Count",
  command: "python -c \"from backend.app.registry import TOOLS; print(f'{len(TOOLS)} tools in registry')\""
});

// 6. ESLint check
await setValidationCommand({
  name: "ESLint",
  command: "cd /home/runner/workspace/frontend && npx eslint src --ext .ts,.tsx --max-warnings 0 2>&1 | tail -20"
});
```

---

## Pre-Deployment Validation Run

Before every production deploy, run all validations:

```javascript
// Complete pre-deploy check
const allResults = await runAllValidations();

let allPassed = true;
const summary = allResults.map(r => {
  const pass = r.exitCode === 0;
  if (!pass) allPassed = false;
  return `${pass ? '✓' : '✗'} ${r.name}`;
}).join('\n');

console.log("=== Pre-Deploy Validation ===");
console.log(summary);
console.log(allPassed ? "\n✅ All checks passed — safe to deploy" : "\n❌ Failures detected — DO NOT deploy");
```

---

## Interpreting TypeScript Output

```
# Clean output (no errors):
# (no output, exit code 0)

# With errors:
src/features/tool/toolFields.ts:2943:3 - error TS2304: Cannot find name 'booleanOptions'.

# Quick fix:
# Search the file, find where booleanOptions is used, ensure it's defined before use
```

---

## Integrating with Development Workflow

**Best practice sequence after code changes:**

```
1. Make changes
2. runValidation({ name: "TypeScript" })  // Instant feedback
3. Fix any errors
4. runValidation({ name: "Python Syntax" })  // Check backend
5. runValidation({ name: "Handler Count" })  // Verify handlers loaded
6. If all pass → restart workflows → manual smoke test
7. If deploying → runAllValidations() → confirm all green
```

---

## Validation vs Diagnostics

| Feature | Validation Skill | Diagnostics Skill |
|---|---|---|
| TypeScript errors | ✓ (via tsc) | ✓ (via LSP) |
| Python errors | ✓ (via py_compile) | Partial |
| Build verification | ✓ | ✗ |
| Custom checks | ✓ (any shell command) | ✗ |
| Real-time (as you type) | ✗ | ✓ |
| Persistent/named | ✓ | ✗ |
| Triggered manually | ✓ | ✓ |

**Use both:** Diagnostics for real-time IDE-style checking while coding; Validation for formal pre-deploy gates.

---

## Related Skills
- `diagnostics` — Real-time LSP diagnostics (complementary)
- `deployment` — Run all validations before deploying
- `security_scan` — Add security scans to validation suite
