# Skill: recreate-screenshot

## Purpose
Analyzes a screenshot of a website, UI, or design and recreates it in code — generating HTML/CSS, React components, or Tailwind implementations that visually match the provided screenshot with high fidelity.

## When to Use
- User has a screenshot of a design they want to implement
- User wants to clone the layout/style of a specific website section
- User wants to recreate a UI component they've seen
- User needs pixel-perfect implementation from a Figma export screenshot
- User wants to extract and reuse a competitor's UI pattern

## Process

### Step 1: Visual Analysis
```
ANALYZE the screenshot for:
□ Layout system: Flexbox vs Grid vs absolute positioned
□ Color palette: Extract primary, secondary, accent, text colors
□ Typography: Font family, sizes, weights, line heights
□ Spacing: Padding and margin patterns (usually 4/8/16/24/32px)
□ Components: What UI components are present
□ Shadows: Box shadows, text shadows
□ Border radius: Amount of corner rounding
□ State: Is this hover/active/focus state?
□ Responsive: What breakpoint does this appear to be?
```

### Step 2: HTML Structure
```
Map visual hierarchy → HTML semantic elements:
Hero → <section> with background
Navigation → <nav> with <ul>/<li>/<a>
Card → <article> or <div.card>
Button → <button> or <a.btn>
Form → <form> with <input>/<label>
Modal → <div.modal> with overlay
Sidebar → <aside>
```

### Step 3: CSS Recreation
```
Extract exact values:
• Colors → CSS custom properties (--color-name: #hex)
• Font sizes → clamp() for fluid sizing
• Spacing → rem values (1rem = 16px)
• Shadows → box-shadow with exact values
• Animations → CSS transitions and keyframes
```

## Usage Examples

```
"Recreate this navbar with logo, links, and CTA button in React + Tailwind"
"Recreate this card component from the screenshot — use CSS modules"
"I have a screenshot of Stripe's pricing page — create the pricing card section"
"Recreate this dark mode dashboard layout I saw on Dribbble"
"Extract the hero section from this ISHU TOOLS screenshot and improve it"
```

## Recreating Common UI Patterns

### Dark Mode Tool Card (Like ISHU TOOLS)
```html
<div class="tool-card">
  <div class="tool-card__icon">🗜️</div>
  <div class="tool-card__content">
    <h3 class="tool-card__title">PDF Compressor</h3>
    <p class="tool-card__desc">Reduce PDF size without quality loss</p>
    <span class="tool-card__badge">PDF Tools</span>
  </div>
</div>

<style>
.tool-card {
  background: rgba(24, 24, 28, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}
.tool-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 122, 255, 0.4);
}
.tool-card__icon {
  font-size: 2rem;
  flex-shrink: 0;
}
.tool-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #F0F0F2;
  margin: 0 0 4px 0;
}
.tool-card__desc {
  font-size: 0.85rem;
  color: #A0A0A8;
  margin: 0 0 8px 0;
  line-height: 1.4;
}
.tool-card__badge {
  font-size: 0.75rem;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
}
</style>
```

### Glassmorphism Card (Inspiration: Manus.im style)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Hero Section (Snipe.design / Unicorn.studio inspired)
```html
<section class="hero">
  <div class="hero__noise-overlay"></div>
  <div class="hero__content">
    <span class="hero__badge">✨ 770+ Free Tools</span>
    <h1 class="hero__title">
      Every tool you need,<br>
      <span class="hero__gradient-text">completely free</span>
    </h1>
    <p class="hero__subtitle">No signup. No limits. No cost.</p>
    <div class="hero__cta-group">
      <a href="/tools" class="btn btn--primary">Explore Tools →</a>
      <a href="#" class="btn btn--ghost">Watch Demo</a>
    </div>
  </div>
</section>

<style>
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at 50% -20%, #1a1a3e 0%, #000000 60%);
  overflow: hidden;
}
.hero__gradient-text {
  background: linear-gradient(135deg, #007AFF, #AF52DE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero__noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise texture */
  opacity: 0.03;
  pointer-events: none;
}
</style>
```

## Extraction Guidelines

### Color Extraction from Screenshot
```
Method 1: Browser DevTools
  Right-click element → Inspect → Look for color values in Styles panel

Method 2: Estimated from screenshot
  Dark backgrounds: Usually #000, #0a0a0a, #111, #1a1a1a, #18181b
  Text: Usually #fff, #f0f0f0, #e0e0e0 for light on dark
  Accents: Identify the dominant accent color (blue, purple, green)

Tool: ColorZilla (browser extension) for exact hex extraction
```

### Spacing Pattern Recognition
```
Most modern UIs use 4px or 8px base grid:
4px = 0.25rem
8px = 0.5rem
12px = 0.75rem
16px = 1rem ← most common padding unit
24px = 1.5rem
32px = 2rem
48px = 3rem
64px = 4rem
```

## Related Skills
- `frontend-design` — original design creation
- `mockup-sandbox` — preview components
- `design-exploration` — variant exploration
- `ui-ux-pro-max` — detailed UI implementation
