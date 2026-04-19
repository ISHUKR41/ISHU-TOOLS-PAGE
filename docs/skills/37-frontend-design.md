# Frontend Design Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Creates distinctive, production-grade frontend interfaces with visual quality that rivals top tech companies (Stripe, Linear, Vercel, Apple). Generates creative, polished React/CSS/HTML code that avoids the generic "AI-generated" look — giving ISHU TOOLS a unique visual personality that makes it memorable and trustworthy.

---

## Activation Triggers
- Building any web component, page, or UI element
- "Make this look better", "modernize the UI", "improve the design"
- Website, landing page, dashboard, React components, CSS layouts
- Styling or beautifying existing UI
- Any visual design work on ISHU TOOLS

---

## Core Design Philosophy

### 1. Hand-Crafted Feel Over Generic
Every design decision should feel intentional, not templated. The goal is visual design that looks like a human designer who cares about craft — not a CSS framework applied thoughtlessly.

```css
/* ❌ Generic AI output */
.card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

/* ✓ Craft-quality output — dark, specific, layered */
.tool-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Subtle inner glow — feels premium */
.tool-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
  pointer-events: none;
}
```

---

## Design Techniques Applied

### Glassmorphism (ISHU TOOLS Primary Style)
```css
/* Frosted glass — the ISHU TOOLS card style */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}
```

### Mesh Gradient Backgrounds
```css
/* Living, breathing background */
.hero-bg {
  background: 
    radial-gradient(ellipse 80% 50% at 20% 30%, rgba(0, 122, 255, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 70%, rgba(52, 199, 89, 0.06) 0%, transparent 50%),
    #040813;
}
```

### Layered Depth
```css
/* Multiple z-levels create richness */
.surface-1 { background: rgba(255,255,255,0.02); }
.surface-2 { background: rgba(255,255,255,0.04); }
.surface-3 { background: rgba(255,255,255,0.06); }

/* Each level slightly brighter — natural light behavior */
```

### Micro-Animations
```typescript
// Hover: subtle but clear — user knows it's interactive
whileHover={{ 
  y: -4,                          // Slight lift
  scale: 1.02,                    // Subtle scale
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",  // Deeper shadow
}}
transition={{ 
  type: "spring",                 // Spring physics
  stiffness: 400,                 // Snappy
  damping: 25,                    // No oscillation
}}
```

### Typography Hierarchy
```css
/* Clear size system — max 3 sizes per viewport */
.text-hero  { font-size: clamp(3rem, 6vw, 7.5rem); font-weight: 800; letter-spacing: -0.04em; }
.text-title { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; letter-spacing: -0.02em; }
.text-body  { font-size: 1rem; font-weight: 400; line-height: 1.65; }
.text-small { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
```

---

## ISHU TOOLS Design System (Complete)

### Colors
```css
:root {
  /* Backgrounds */
  --bg-deep:     #000000;
  --bg-base:     #040813;
  --bg-surface:  rgba(255, 255, 255, 0.04);
  --bg-elevated: rgba(255, 255, 255, 0.07);
  
  /* Text */
  --text-primary:   rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.60);
  --text-tertiary:  rgba(255, 255, 255, 0.35);
  
  /* Accents */
  --accent:     #007aff;
  --accent-alt: #5e5ce6;  /* Purple alternative */
  --success:    #34c759;
  --warning:    #ff9f0a;
  --danger:     #ff3b30;
  
  /* Category Colors */
  --pdf:        #ef4444;
  --image:      #a855f7;
  --dev:        #22c55e;
  --video:      #f87171;
  --math:       #f59e0b;
  --health:     #ec4899;
  --finance:    #10b981;
  --science:    #38bdf8;
  --geography:  #4ade80;
  --cooking:    #fb923c;
  
  /* Borders */
  --border:      rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);
  
  /* Radius */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;
  
  /* Animations */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-mid:  250ms;
  --duration-slow: 400ms;
}
```

### Component Patterns
```typescript
// ToolCard — the atomic unit of ISHU TOOLS
function ToolCard({ tool, accent }) {
  return (
    <motion.div
      className="tool-card"
      style={{ '--accent': accent } as React.CSSProperties}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Top: icon + category badge */}
      <div className="card-top">
        <span className="tool-icon" style={{ color: accent }}>{tool.icon}</span>
        <span className="category-badge">{tool.categoryLabel}</span>
      </div>
      {/* Middle: title + description */}
      <h3 className="card-title">{tool.title}</h3>
      <p className="card-desc">{tool.description}</p>
      {/* Bottom: tags */}
      <div className="card-tags">
        {tool.tags?.slice(0, 2).map(t => <Tag key={t}>{t}</Tag>)}
      </div>
    </motion.div>
  )
}
```

---

## Reference Sites for Design Direction

| Site | What to Learn From |
|---|---|
| stripe.com | Precision, gradient meshes, large typography |
| linear.app | Dense information, dark theme, monospace |
| vercel.com | Clean dark, strong contrast, minimal |
| apple.com | Typography, whitespace, silky animations |
| framer.com | Creative layouts, bold colors, 3D elements |
| lusion.co | Atmospheric, immersive, 3D backgrounds |
| raycast.com | Dark, rich, gradient accents |

---

## Common Anti-Patterns to Avoid

```css
/* ❌ Pure black backgrounds look flat */
background: #000000;
/* ✓ Near-black with slight blue tint feels deep and modern */
background: #040813;

/* ❌ White text on dark — too high contrast, tiring */
color: #ffffff;
/* ✓ Slightly tinted white — softer, premium */
color: rgba(255, 255, 255, 0.92);

/* ❌ Flat box shadows */
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
/* ✓ Deep atmospheric shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3);
```

---

## Related Skills
- `design` — DESIGN subagent for delegating UI work
- `ui-ux-pro-max` — 161 palettes, 99 UX guidelines, 50+ styles
- `design-exploration` — Generating multiple variants to choose from
- `web-design-guidelines` — Accessibility audit after designing
