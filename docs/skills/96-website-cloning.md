# Skill: website-cloning

## Purpose
Analyzes websites for design patterns, component structures, and UX flows — then recreates similar experiences ethically using original code and content, focused on inspired-by implementations rather than copying.

## When to Use
- User wants a website "inspired by" a specific design they love
- User wants to implement a specific UX pattern they saw elsewhere
- User wants to extract the layout/structure approach from a reference site
- User wants to match the visual aesthetic of a professional website
- User needs to analyze a competitor's website structure

## ⚠️ Important Note
```
Website cloning for the purpose of impersonation, phishing, or IP theft 
is ILLEGAL and unethical. This skill is only for:
✅ Learning from design patterns (inspiration)
✅ Creating original work inspired by good UX
✅ Analyzing structure for your OWN website improvement
✅ Implementing similar FUNCTIONALITY with original content
❌ NOT for copying content, branding, or trademarks
```

## Analysis Framework

### How to Analyze a Reference Website

#### Visual Layer Analysis
```
1. COLOR SYSTEM
   - Primary background color (often defined in <body> CSS)
   - Card/surface colors (1-2 levels above background)
   - Text color hierarchy (primary, secondary, muted)
   - Accent colors (CTAs, highlights, borders)
   - Tool: Right-click → Inspect → body styles

2. TYPOGRAPHY SYSTEM
   - Font families (check Google Fonts or font-face declarations)
   - Heading sizes (h1-h6 pixel values)
   - Body text size (usually 14-16px)
   - Line height (typically 1.4-1.6)
   - Font weight usage (400=regular, 500=medium, 600=semibold, 700=bold)

3. SPACING SYSTEM
   - Base unit (4px or 8px grid?)
   - Container max-width (usually 1200-1400px)
   - Section padding (often 80-120px vertical)
   - Card padding (usually 20-32px)

4. LAYOUT SYSTEM
   - Grid: CSS Grid? Flexbox? Or both?
   - Number of columns (1, 2, 3, 4?)
   - Gap between items
   - Breakpoints (open DevTools, drag window to see layout shift)
```

#### UX Pattern Identification
```
□ Navigation pattern: Top bar / Sidebar / Tab bar / Hamburger
□ Search behavior: Instant / Submit button / Command palette
□ Card interaction: Hover effects / Click highlight / Fade
□ Loading state: Skeleton / Spinner / Progressive
□ Empty state: Illustration / Message / CTA
□ Error state: Toast / Inline / Modal
□ Filter/Sort: Dropdown / Chips / Sidebar
□ Pagination: Numbered / Load more / Infinite scroll
□ Auth flow: Sign up → Verify → Onboard
```

## Websites Referenced in ISHU TOOLS Requirements

### Snipe.design Analysis
```
Aesthetic: Minimalist dark, monochrome with sharp accents
Key Patterns:
• Asymmetric grid layouts
• Sharp geometric shapes
• High-contrast typography
• Subtle grain/noise textures
• Bold white text on near-black background

CSS Patterns to Recreate:
background: #0a0a0a;
color: #f5f5f5;
font-family: 'Clash Display', sans-serif; /* or similar geometric */
/* Grain overlay */
.noise::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/noise.png');
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
}
```

### Unicorn.studio Analysis
```
Aesthetic: WebGL/3D interactive, dark, particle effects
Key Patterns:
• Canvas-based animated backgrounds
• Floating 3D elements
• Glassmorphism cards over animated backgrounds
• Smooth page transitions
• Large, bold display typography

For ISHU TOOLS: Adapt the glassmorphism cards and particle effects
(use CSS particle animations instead of WebGL for performance)
```

### Manus.im Analysis
```
Aesthetic: Ultra-clean, whitespace-heavy, professional
Key Patterns:
• Generous negative space
• Single-column content with occasional breaking elements
• Subtle animations on scroll (fade in, slide up)
• Borderless cards with shadow-only depth
• Minimal color palette (neutral + one accent)

CSS Approach:
.section { padding: 120px 0; }
.card {
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 2px 40px rgba(0,0,0,0.08);
  /* No border */
}
```

### 21st.dev Analysis
```
Aesthetic: Developer-focused, component showcase, dark
Key Patterns:
• Monospace elements for code
• Syntax highlighting aesthetics applied to UI
• Grid-based component browser
• Tag/filter chip system for categories
• Preview + Code toggle for each component

Pattern Borrowed for ISHU TOOLS:
• Category filter chips at top of tools list
• Tool card preview on hover
• Keyboard shortcut hints in UI
```

### Landing.love Analysis
```
Aesthetic: Creative agency, bold, unexpected layouts
Key Patterns:
• Hero sections with large, kinetic typography
• Scroll-triggered animations
• Bold color blocking
• Diagonal elements breaking the grid
• Video backgrounds or animated illustrations

Adapted for ISHU TOOLS:
• Hero with animated tool count: "770+ Free Tools"
• Category cards with color-blocked backgrounds
• Animated transition between tool categories
```

## Implementation: ISHU TOOLS Redesign (Inspired Elements)

### Hero Section (Inspired by Snipe + Manus)
```jsx
// Glassmorphism + Bold Typography + Noise Texture
<section className="hero">
  <div className="hero__noise" />
  <div className="hero__glow" />
  <div className="hero__content">
    <div className="hero__badge">✦ 770+ Free Tools</div>
    <h1 className="hero__headline">
      Every tool you need.<br/>
      <span className="hero__gradient">Completely free.</span>
    </h1>
    <p className="hero__sub">
      PDF, images, video, math, code, finance — no signup, no limits.
    </p>
    <div className="hero__actions">
      <a href="/tools" className="btn-primary">Explore Tools →</a>
      <span className="hero__stat">Used by students at 500+ colleges</span>
    </div>
  </div>
</section>
```

### Tool Card (Inspired by 21st.dev Component Browser)
```jsx
// Category color system + Hover preview
<article className={`tool-card tool-card--${category}`} data-tool={slug}>
  <span className="tool-card__icon" aria-hidden>{icon}</span>
  <div className="tool-card__body">
    <h3 className="tool-card__name">{title}</h3>
    <p className="tool-card__desc">{description}</p>
  </div>
  <div className="tool-card__footer">
    <span className="tool-card__cat">{category}</span>
    <span className="tool-card__arrow">→</span>
  </div>
</article>
```

## Performance Budget (FAANG-Level)
```
Metric              Target    ISHU TOOLS Current  Fix
LCP                 < 2.5s    ~3-4s               Preload hero
FID/INP             < 200ms   ~150ms              ✅ Good
CLS                 < 0.1     ~0.15               Add min-heights
Bundle size         < 200KB   ~280KB              Code split
Tool card paint     < 100ms   ~90ms               ✅ Good
Mobile FPS          60fps     ~45fps              Reduce animations
```

## Related Skills
- `frontend-design` — original design creation
- `recreate-screenshot` — pixel-perfect recreation
- `ui-ux-pro-max` — detailed implementation
- `competitive-analysis` — design competitor analysis
