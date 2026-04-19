# UI/UX Pro Max Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
The definitive UI/UX design intelligence layer. Contains 50+ design styles, 161 curated color palettes, 57 font pairings, 99 UX guidelines, 25 chart type recommendations, and framework-specific implementation across React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS. Use for any design decision on ISHU TOOLS.

---

## Activation Triggers

Activate whenever:
- Planning, building, creating, designing, or implementing UI
- Reviewing, fixing, improving, optimizing, or checking UI/UX code
- Component types: button, modal, navbar, sidebar, card, table, form, chart
- Styles: glassmorphism, minimalism, dark mode, responsive, animation
- Actions: color choice, font pairing, spacing, layout, interaction states

---

## The 50+ Design Styles (Most Relevant for ISHU TOOLS)

### Currently Used
```
Glassmorphism     — Frosted glass cards, backdrop-filter
Dark Mode         — Deep navy/black, light-on-dark text
Minimalism        — White space, hierarchy, no decoration
Bento Grid        — Asymmetric card grid layouts
```

### Styles to Explore
```
Neumorphism       — Soft shadows, extruded UI
Claymorphism      — 3D clay-like shapes, colorful
Brutalism         — Raw, bold, anti-aesthetic (for category headers?)
Aurora            — Gradient mesh, northern lights aesthetic
```

---

## Color System for ISHU TOOLS

### Primary Palette
```css
/* Foundation — don't change these */
--bg-primary:   #000000;   /* True black */
--bg-secondary: #040813;   /* Near-black, slight blue */
--accent:       #007aff;   /* iOS Blue — trust, tech, action */
--accent-warm:  #ff9500;   /* iOS Orange — warmth, energy */
```

### Extended Category Palettes
```css
/* Derived from iOS system colors — proven, accessible */
--pdf:       #ff3b30;  /* iOS Red */
--image:     #bf5af2;  /* iOS Purple */
--dev:       #32d74b;  /* iOS Green */
--video:     #ff6961;  /* Pastel Red */
--math:      #ffd60a;  /* iOS Yellow */
--health:    #ff2d55;  /* iOS Pink */
--finance:   #30d158;  /* iOS Mint */
--science:   #64d2ff;  /* iOS Cyan */
--geography: #30d158;  /* iOS Green alt */
--cooking:   #ff9f0a;  /* iOS Orange */
--student:   #5e5ce6;  /* iOS Indigo */
```

### How Category Colors Work
```typescript
// At runtime, ToolPage sets data-category attribute
<div data-category={tool.category}>
  
// CSS custom property inheritance:
[data-category="science-tools"] { --accent: var(--science); }
[data-category="cooking-tools"] { --accent: var(--cooking); }

// Components use var(--accent) — automatically themed
.tool-icon { color: var(--accent); }
.card-border { border-color: var(--accent); }
.cta-button { background: var(--accent); }
```

---

## Font Pairings for ISHU TOOLS

### Current (System Fonts — Recommended)
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Renders as: SF Pro (Mac/iOS), Segoe UI (Windows), Roboto (Android) */
/* Zero loading time, native feel, no layout shift */
```

### If Adding Custom Fonts
```css
/* Option A: Inter — clean, designed for screens */
font-family: 'Inter', sans-serif;

/* Option B: Plus Jakarta Sans — distinctive, modern */
font-family: 'Plus Jakarta Sans', sans-serif;

/* Option C: Geist (Vercel's font) — developer-friendly */
font-family: 'Geist', sans-serif;
```

**Recommendation:** Stay with system fonts for ISHU TOOLS. The performance cost of loading custom fonts outweighs the aesthetic benefit for a utility tool platform.

---

## 99 UX Guidelines (Top 20 for ISHU TOOLS)

### Critical
1. **Touch targets:** minimum 44×44px — every button, link, card
2. **Loading states:** show skeleton for anything > 200ms
3. **Error messages:** specific, actionable, human ("File too large. Maximum size is 50MB.")
4. **Empty states:** explain WHY and what to do ("No tools found. Try a different search term.")
5. **Progress:** show for operations > 2 seconds (file upload, video download)
6. **Contrast:** WCAG AA (4.5:1) for body text, 3:1 for large text
7. **First load:** critical content visible in < 1 second

### Performance UX
8. **Optimistic UI:** show expected result immediately, reconcile on response
9. **Debounce:** search inputs 150-200ms delay
10. **Virtualization:** lists > 50 items should use virtual scrolling
11. **Skeleton screens:** better than spinners (user sees layout, less jank)
12. **Progressive disclosure:** show most-used features first, advanced on scroll

### Interaction
13. **Hover states:** every clickable element must have a visible hover state
14. **Focus states:** keyboard navigation requires visible focus rings
15. **Destructive actions:** confirm before delete/override (but not for every action)
16. **Undo:** offer undo for non-trivial actions when possible
17. **Feedback:** every user action should produce a response within 100ms

### Mobile
18. **Thumb zone:** primary actions in bottom 60% of screen
19. **No hover-only:** don't hide essential info in hover states (mobile has no hover)
20. **Scroll lock:** modals/sheets should lock background scroll

---

## Chart Types for ISHU TOOLS

Where charts could add value:
```
Tool Usage Analytics:
  Bar chart: most-used tools by category
  Line chart: daily usage over time
  
Health/Finance Tools:
  Pie chart: macro breakdown (protein/carbs/fat)
  Bar chart: BMI comparison
  
Student Tools:
  Line chart: CGPA trend over semesters
  Donut chart: attendance breakdown (present/absent/holiday)
```

Recommended libraries:
- **Recharts** — React-native, lightweight, good defaults
- **Chart.js** — More charts, larger bundle
- **Victory** — React-native, composable

---

## ISHU TOOLS UX Improvements (Priority Order)

### High Impact, Low Effort
1. **Recent tools** (localStorage) — "Continue where you left off" section
2. **Copy result button** — One-click copy for text outputs
3. **Keyboard shortcut to tool** — Cmd/Ctrl+K opens tool search
4. **Tool loading skeleton** — Replace spinner with layout skeleton

### Medium Impact, Medium Effort
5. **Favorite tools** — Star tools, persisted in localStorage
6. **Tool comparison** — "See similar tools" suggestions
7. **Batch mode** — Upload multiple files, process all
8. **Tool history** — "You've used this tool 12 times" (local)

### Long Term
9. **Personalized homepage** — Show recently/frequently used categories first
10. **Tool rating** — Thumbs up/down on result quality

---

## Component State Inventory (ISHU TOOLS)

Every component needs all these states designed:
```
ToolCard:
  ✓ Default (resting)
  ✓ Hover (elevated, glowing)
  ✓ Active/Pressed (scaled down)
  ✓ Loading (processing indicator)
  ❌ Skeleton (loading state)  ← Not yet implemented
  ❌ Error state              ← Shows "Try again" button

ToolForm:
  ✓ Empty (initial)
  ✓ File selected (preview)
  ✓ Processing (spinner + progress)
  ✓ Result ready (success state)
  ❌ Error state with retry   ← Needs improvement
  ❌ Partial result (for large files)
```

---

## Related Skills
- `frontend-design` — Practical implementation of these principles
- `design` — DESIGN subagent for execution
- `web-design-guidelines` — Accessibility review and compliance checking
- `design-exploration` — Trying multiple approaches before committing
