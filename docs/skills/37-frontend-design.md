# Frontend Design Skill (User-Provided)

## What It Does
Creates distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code and UI design that avoids generic AI aesthetics. Use for web components, pages, dashboards, and any visual UI work.

## Activation Triggers
- Build/create/design web components, pages, or applications
- "Make this look better" or "modernize the UI"
- Website, landing page, dashboard, React components
- HTML/CSS layouts or styling/beautifying any web UI
- Any design work on ISHU TOOLS frontend

## Design Philosophy
The skill produces designs that:
- Feel **hand-crafted**, not AI-generated
- Have **visual character** and personality
- Use **modern CSS** techniques effectively
- Are **performant** (no heavy frameworks)
- Feel like **top-tier products** (Stripe, Linear, Vercel level)

## Design Techniques Used
- **Glassmorphism** — Frosted glass panels with backdrop-filter
- **Mesh gradients** — Dynamic, alive color backgrounds
- **Micro-animations** — Subtle hover/focus states
- **Layered depth** — Multiple z-levels with shadows/blurs
- **Typography hierarchy** — Clear visual weight distribution
- **Color psychology** — Purposeful accent color choices

## CSS Patterns Produced
```css
/* Glassmorphism card */
.tool-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
```

## ISHU TOOLS Design System
- Background: Deep space `#000` → `#040813`
- Grid overlay: 54px subtle lines
- Cards: Glassmorphism with category-specific accent colors
- Typography: System fonts (Apple/Windows native)
- Animations: Framer Motion, 0.3s ease transitions

## Related Skills
- `design` — DESIGN subagent delegation
- `ui-ux-pro-max` — User-provided comprehensive UI/UX guide
- `web-design-guidelines` — Accessibility and best practice review
