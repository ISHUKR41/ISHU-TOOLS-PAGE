# Design Skill — Ultra-Detailed Reference

## What It Does
Provides access to the DESIGN subagent — a specialized AI optimized exclusively for frontend UI/UX work. The DESIGN subagent produces visually sophisticated, production-ready components with a professional aesthetic that doesn't look generic or AI-generated. It has deep expertise in modern CSS techniques, animation systems, and the specific design language of ISHU TOOLS.

---

## ISHU TOOLS Design Language

The DESIGN subagent knows and applies these design principles:

### Visual Style
- **Theme:** Deep dark backgrounds (#000 / #040813)
- **Surface:** Glassmorphism cards (backdrop-filter: blur; rgba backgrounds)
- **Typography:** System font stack → SF Pro / Segoe UI / Roboto — no web fonts needed
- **Colors:** Per-category accent colors (see `toolPresentation.ts`)
- **Radius:** 16px for cards, 12px for inputs, 8px for buttons
- **Spacing:** 8px grid system

### Category Color System
```
PDF tools:        #ef4444 (red)
Image tools:      #a855f7 (purple)
Developer tools:  #22c55e (green)
Video tools:      #f87171 (coral)
Math tools:       #f59e0b (amber)
Health tools:     #ec4899 (pink)
Finance tools:    #10b981 (teal)
Science tools:    #38bdf8 (sky blue)
Geography tools:  #4ade80 (lime)
Cooking tools:    #fb923c (orange)
```

### Animation System
- **Hover:** Scale 1.02, brightness 1.05, 200ms ease
- **Click/press:** Scale 0.98, 100ms
- **Page enter:** Fade + slide up (y: 20 → 0), 400ms ease-out
- **Stagger:** 50-80ms between list items
- **Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy elements

### Inspiration References
- Apple.com — Huge typography, generous whitespace, silky animations
- Stripe.com — Precision, gradient meshes, purple/indigo palette
- Awwwards.com — Bold, experimental layouts
- Lusion.co — Immersive, 3D, atmospheric
- Cuberto.com — Strong personality, custom cursors, dramatic hover states
- Bruno Simon — Interactive, playful, 3D web experiences

---

## When to Use
- Building a new page from scratch (category page, about page, etc.)
- Redesigning an existing component (ToolCard, Navbar, Footer)
- Creating a micro-interaction (button hover, loading state)
- Designing the mobile navigation menu
- Building the animated hero section
- Creating result display components (JSON viewer, table renderer, image viewer)
- PWA install prompt design
- Any work where visual quality is the primary concern

## When NOT to Use
- Simple text/logic changes with no UI impact
- Backend handler logic
- API endpoint design
- Database schema work

---

## Using the DESIGN Subagent

### Basic pattern (synchronous)
```javascript
const result = await subagent({
  taskDescription: `
    [Your detailed design brief here]
  `,
  agentType: "DESIGN"
});
```

### For parallel work (async)
```javascript
const jobId = await startAsyncSubagent({
  taskDescription: "...",
  agentType: "DESIGN"
});
// Main agent continues working
await wait_for_background_tasks({ timeout_seconds: 120 });
```

---

## Writing a Great Design Brief

The quality of the output is proportional to the quality of the brief. A great brief includes:

```javascript
const result = await subagent({
  taskDescription: `
    TASK: Redesign the ToolCard component for ISHU TOOLS
    
    CURRENT STATE:
    - File: frontend/src/features/home/components/ToolCard.tsx
    - Has: basic card with title, icon, hover shadow
    - Missing: category color accent, animation polish, description text
    
    REQUIREMENTS:
    1. Glassmorphism surface: rgba(255,255,255,0.04) with backdrop-filter: blur(16px)
    2. Left border accent: 3px solid var(--accent) where --accent comes from category
    3. Hover state: scale(1.02), glow shadow with category color, border brightens
    4. Tool icon: colored icon matching category accent, 32px, top-left
    5. Title: 15px, semibold, white
    6. Description: 2-line clamp, 13px, rgba(255,255,255,0.6)
    7. Category badge: bottom-right, rounded pill, tiny text
    8. Framer Motion: whileHover scale, layout animation for grid reflow
    
    DESIGN REFERENCE:
    - Category colors: frontend/src/lib/toolPresentation.ts → CATEGORY_THEME_MAP
    - Overall style: dark glassmorphism, like Linear.app or Vercel dashboard
    - Hover state inspiration: Stripe pricing cards hover effect
    
    CONSTRAINTS:
    - Keep TypeScript strict
    - Keep existing prop interface: { tool: Tool, onClick: () => void }
    - Don't change any other files
    - Mobile: full width below 640px
    
    FILES TO MODIFY:
    - frontend/src/features/home/components/ToolCard.tsx
  `,
  agentType: "DESIGN"
});
```

---

## DESIGN Subagent Capabilities

### CSS Techniques
- **Glassmorphism:** `backdrop-filter: blur(); background: rgba()`
- **Gradients:** Mesh gradients, radial glows, linear sweeps
- **Animations:** CSS keyframes, Framer Motion variants, GSAP
- **Custom properties:** Dynamic theming with CSS variables
- **Container queries:** Responsive components independent of viewport
- **Grid/Flexbox:** Complex layouts with auto-placement

### React Patterns
- Compound components (Card + Card.Header + Card.Body)
- Render props for flexible composition
- forwardRef for DOM access
- useCallback / useMemo for performance
- Custom hooks (useHover, useIntersectionObserver)

### Framer Motion Patterns
```typescript
// Staggered list
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 }}}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }}

// Spring animation
<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>

// Page transition
<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
```

---

## Common ISHU TOOLS Design Requests

### Hero Section
```
Large gradient headline → tool count badge → search bar → category pills → CTA
Height: 70-80vh, centered, animated particle/mesh background
```

### Tool Category Grid
```
Responsive grid: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
Each cell: category card with icon, label, tool count
Hover: lift + category color glow
```

### Tool Page Header
```
Breadcrumb → H1 title → short description → trust badges (free, no signup, instant)
Category accent color themes the page header
```

### Result Display
```
JSON: syntax-highlighted code block with copy button
Table: clean grid with zebra stripes, sortable headers
Image: preview with download button
Text: monospace, scrollable, line count
```

---

## Related Skills
- `delegation` — How to call subagents (technical details)
- `design-exploration` — Multiple variants before choosing one
- `mockup-sandbox` — Preview designs on canvas without touching the app
- `frontend-design` — User-provided design skill with 50+ style options
- `ui-ux-pro-max` — 161 palettes, 99 UX guidelines
