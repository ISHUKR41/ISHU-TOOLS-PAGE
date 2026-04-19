# Video.js Skill

## What It Does
Creates agency-quality short animated videos (up to 5 minutes) programmatically using React, Framer Motion, GSAP, and Three.js. Produces marketing clips, motion graphics, animated explainers, social media content, product demos, and broadcast-quality videos that play in the browser.

## When to Use
- Creating product demo videos for ISHU TOOLS
- Marketing animation clips for social media
- Animated explainer for "How ISHU TOOLS works"
- Intro/outro animations
- Data visualization with motion

## Key Characteristics
- Videos **auto-play** (no user interaction needed)
- **No interactive elements** — purely motion/visual content
- Renders in the browser using CSS, Canvas, or WebGL
- Can use Three.js for 3D elements
- Uses GSAP ScrollTrigger for scroll-based animations
- This is NOT a video editor (no timeline editing of footage)

## Technology Stack
- **Framer Motion** — React-based animations
- **GSAP** — High-performance timeline animations
- **Three.js / @react-three/fiber** — 3D elements
- **Canvas API** — Custom drawn graphics
- **CSS animations** — Pure CSS motion

## Example: Hero Animation
```typescript
const HeroAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <LogoMark />
    <motion.h1
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      ISHU TOOLS
    </motion.h1>
  </motion.div>
)
```

## Media Asset Usage
- Attached images can be used as video elements
- Use import paths for local assets
- Videos can reference attached_assets for input footage

## Related Skills
- `media-generation` — For AI-generated images/videos
- `design` — DESIGN subagent for visual direction
- `mockup-sandbox` — Previewing video animations on canvas
