# Design Skill

## What It Does
Provides a DESIGN subagent — a specialized AI assistant optimized for frontend UI/UX work. The DESIGN subagent produces high-quality, production-ready components with creative aesthetics that avoid generic AI-generated look-and-feel.

## When to Use
- Building new UI components or pages
- Redesigning existing interfaces
- Creating design variants for comparison
- Complex CSS/animation work
- When you want professional-grade visual output
- Mockup creation and design exploration

## Design Subagent Strengths
- Deep knowledge of modern CSS techniques (glassmorphism, gradients, etc.)
- GSAP, Framer Motion, and CSS animation expertise
- Responsive design patterns
- Color theory and typography
- Component architecture and composition
- Brand-consistent design language

## Delegation Pattern
```javascript
// Delegate to DESIGN subagent for UI work
const result = await subagent({
    taskDescription: `
        Create a modern tool card component for ISHU TOOLS.
        - Dark theme (#000 background)
        - Glassmorphism card style
        - Smooth hover animations
        - Category color accents
        - Files: frontend/src/components/tools/ToolCard.tsx
    `,
    agentType: "DESIGN"
});
```

## Best Practices
1. Provide clear design brief with colors, style references, and file paths
2. Share existing CSS variables and design tokens
3. Specify animation preferences (subtle vs dramatic)
4. Include responsive requirements (mobile-first, breakpoints)
5. Reference competitor sites or inspiration for style direction

## Design System (ISHU TOOLS)
- Background: `#000000` / `#040813`
- Accent: `#007aff` (blue), `#34c759` (green), `#ff375f` (red)
- Font: System font stack (SF Pro / Segoe UI / Roboto)
- Theme: Dark, glassmorphism, subtle gradients
- Animations: Framer Motion, smooth 0.3-0.4s transitions

## Related Skills
- `delegation` — The subagent system
- `design-exploration` — For exploring multiple design variants
- `mockup-sandbox` — Previewing designs on the canvas
- `frontend-design` — User-provided advanced design skill
