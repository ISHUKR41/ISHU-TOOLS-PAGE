# Mockup Graduate Skill — Ultra-Detailed Reference

## What It Does
Integrates an approved design from the mockup-sandbox canvas into the main ISHU TOOLS application. This is the "ship it" step in the design workflow: canvas mockup → production code. The graduation process transforms sandbox code to match the main app's conventions, installs any new dependencies, and verifies the integration works.

---

## When to Activate

Listen for:
- "Use this one" — after seeing variants on canvas
- "I like variant B, put it in the app"
- "Graduate this to the main app"
- "Apply this design"
- "Looks good, integrate it"
- User points to a specific canvas iframe and says "use that"

---

## The Full Graduation Process

### Step 1: Identify the approved mockup
```javascript
// Find which sandbox component was approved
// e.g., mockup-sandbox/src/previews/ToolCard_B.tsx
const approved = readFile("mockup-sandbox/src/previews/ToolCard_B.tsx");
const component = readFile("mockup-sandbox/src/components/ToolCard_B.tsx");
```

### Step 2: Analyze the main app's conventions
Before writing a single line, understand:
- CSS approach (CSS modules? Tailwind? CSS-in-JS? Global CSS?)
- Import paths and aliases
- TypeScript strictness settings
- Component naming conventions
- Prop interface patterns
- Animation approach (Framer Motion variants vs inline)
- Existing CSS custom properties (--accent, --surface, etc.)

```javascript
// Read the existing component to understand conventions
const existing = readFile("frontend/src/features/home/components/ToolCard.tsx");
const globalCSS = readFile("frontend/src/index.css");
const toolPresentation = readFile("frontend/src/lib/toolPresentation.ts");
```

### Step 3: Transform the sandbox code

#### Path rewrites
```typescript
// Sandbox (relative to sandbox)
import { CATEGORY_THEME_MAP } from '../../lib/toolPresentation'

// Main app (correct paths)
import { CATEGORY_THEME_MAP } from '../../../lib/toolPresentation'
```

#### Un-stub dependencies
```typescript
// Replace stubs with real implementations

// STUB (was in sandbox):
const navigate = (path: string) => console.log('Navigate to:', path)

// REAL (main app):
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()

// STUB:
const tools = MOCK_TOOLS

// REAL:
const { tools } = useToolsContext()  // or actual data source
```

#### CSS variable normalization
```typescript
// Sandbox may have used inline hex values:
background: '#007aff'

// Main app should use CSS variables:
background: 'var(--accent)'
```

#### Prop interface matching
```typescript
// Ensure the interface matches what callers expect
// Check how the component is called in the main app:
grep -r "ToolCard" frontend/src --include="*.tsx"
// Adjust props to match the existing call sites
```

### Step 4: Write the graduated component
```javascript
// Write the transformed code to the main app file
writeFile("frontend/src/features/home/components/ToolCard.tsx", transformedCode);
```

### Step 5: Install new dependencies
```javascript
// Check if mockup used any packages not in main app
// e.g., if mockup used 'react-spring' but main app uses 'framer-motion'
const newPackages = ["some-package"];  // Detected during analysis
await installLanguagePackages({ language: "nodejs", packages: newPackages });
```

### Step 6: Verify the integration
```javascript
// TypeScript check
const errors = await runDiagnostics({ severity: "error" });
if (errors.diagnostics.length > 0) {
  // Fix errors
}

// Visual verification
restart_workflow(name="Start application");
// Take screenshot
const screenshot = await screenshot({ type: "app_preview", path: "/" });
```

---

## Common Transformation Challenges

### Challenge: Sandbox uses hardcoded test data
```typescript
// Sandbox had:
const tools = [{ slug: "compress-pdf", title: "..." }]

// Main app needs:
const { data: tools } = useQuery('/api/registry/tools')
// or: passed as props from parent component
```

### Challenge: Sandbox animations are more aggressive
```typescript
// Sandbox might have dramatic animations
// Tone down for production: 
// - Reduce motion duration
// - Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### Challenge: Sandbox doesn't handle edge cases
```typescript
// Sandbox showed only the happy path
// Main app needs:
// - Loading state (skeleton)
// - Error state (error boundary)
// - Empty state (no tools in category)
// - Long title truncation (text-overflow: ellipsis)
```

### Challenge: Different CSS scope
```typescript
// Sandbox may have global CSS that conflicts in main app
// Solution: scope all CSS under a specific class
.tool-card-v2 { ... }  // More specific selector
// Or use CSS modules for true isolation
```

---

## Graduation Verification Checklist

- [ ] No TypeScript errors (`runDiagnostics`)
- [ ] App builds without errors (`npm run build`)
- [ ] Component renders correctly at desktop (1280px+)
- [ ] Component renders correctly at tablet (768px)
- [ ] Component renders correctly at mobile (375px)
- [ ] Animations work smoothly (no jank)
- [ ] Dark theme intact (not accidentally introducing white backgrounds)
- [ ] Category color theming still works (accent colors applied correctly)
- [ ] Loading/error/empty states handled
- [ ] Accessibility: interactive elements are keyboard-navigable
- [ ] No console errors in browser

---

## Post-Graduation Cleanup

After successful graduation:
```bash
# Optional: remove the sandbox component (it's been graduated)
# Or keep it for reference — both are fine

# Remove from canvas if desired
await deleteShape({ id: "graduated-iframe-shape-id" })

# Take a final screenshot of the live result
await screenshot({ type: "app_preview", path: "/" })
```

---

## Related Skills
- `mockup-sandbox` — The sandbox environment the code came from
- `mockup-extract` — How the component originally got onto the canvas
- `canvas` — Managing canvas shapes after graduation
- `diagnostics` — Verifying no errors after graduation
- `design` — DESIGN subagent if additional polish is needed after graduation
