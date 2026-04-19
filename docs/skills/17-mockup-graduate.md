# Mockup Graduate Skill

## What It Does
Integrates approved mockup designs from the canvas sandbox back into the main application. Reads the approved component, analyzes the main app's patterns, transforms the mockup code to match app conventions, installs any new dependencies, and verifies the integration.

## When to Use
- User approves a design variant on the canvas
- "Use this one" — user selects a mockup
- "Put this in my app"
- "I like variant B, integrate it"
- "Graduate this mockup to production"
- "Apply this design to the main app"

## Graduation Process
1. **Read the approved mockup** from the sandbox directory
2. **Analyze the main app** — patterns, imports, naming, CSS conventions
3. **Transform the code** — match main app's style (CSS variables, class names, etc.)
4. **Replace the target file(s)** in the main application
5. **Install any new dependencies** that the mockup introduced
6. **Verify** — restart workflow and check for errors
7. **Present the result** — take screenshot to confirm

## Key Transformation Steps
- Replace sandbox CSS classes with main app CSS classes
- Swap mock API calls with real API functions
- Restore proper router navigation
- Convert inline styles to CSS variables where possible
- Ensure responsive breakpoints match main app conventions

## Conflict Resolution
- If mockup uses different naming than main app → normalize to main app's convention
- If mockup introduces new dependencies → check they're not already installed under a different name
- If mockup's styling conflicts with global CSS → use more specific selectors

## Verification Checklist
- [ ] No TypeScript errors in graduated component
- [ ] App builds without errors
- [ ] Component renders correctly in development
- [ ] Responsive behavior preserved
- [ ] Animations work as expected

## Related Skills
- `mockup-sandbox` — Where the approved design came from
- `mockup-extract` — How the component got onto the canvas
- `canvas` — The visual board where designs were shown
- `design` — DESIGN subagent that may have created the mockup
