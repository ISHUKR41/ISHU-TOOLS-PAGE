# Validation Skill

## What It Does
Registers shell commands as named validation steps — like CI checks — that can be triggered and monitored to verify code quality. Think of it as a local CI pipeline that runs on the Replit environment.

## When to Use
- Setting up automated checks for TypeScript, ESLint, tests
- Running before committing or deploying
- Verifying builds pass after changes
- Setting up linting checks
- Continuous quality validation during development

## Key Capabilities
- Register named validation steps with shell commands
- Trigger individual or all validation steps
- Monitor status: running, passed, failed
- View output from validation runs

## Common Validation Steps for ISHU TOOLS
```javascript
// Register TypeScript check
await registerValidation({
    name: "TypeScript Check",
    command: "cd frontend && npx tsc --noEmit"
});

// Register build check
await registerValidation({
    name: "Frontend Build",
    command: "cd frontend && npm run build"
});

// Register ESLint
await registerValidation({
    name: "ESLint",
    command: "cd frontend && npx eslint src --ext .ts,.tsx"
});

// Run all validations
await runAllValidations();

// Run specific validation
await runValidation({ name: "TypeScript Check" });
```

## Best Practices
1. Always run TypeScript check after major refactors
2. Run build check before marking deployment ready
3. Set up validation early in the project lifecycle
4. Use meaningful names that describe what's being checked

## Integration with Workflow
1. Make code changes
2. Run `runValidation({ name: "TypeScript Check" })`
3. Check for errors in output
4. Fix any issues
5. Re-run validation to confirm
6. Proceed to deployment

## Related Skills
- `diagnostics` — LSP-based static analysis (complementary)
- `deployment` — Use validation before deploying
- `workflows` — Running the actual app workflows
