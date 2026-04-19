# Video.js / Programmatic Video Skill — Ultra-Detailed Reference

## What It Does
Creates agency-quality short animated videos (up to 5 minutes) programmatically using React, Framer Motion, GSAP, and Three.js. These videos run entirely in the browser — no server rendering needed. Perfect for product demos, social media animations, explainer videos, and marketing content for ISHU TOOLS.

**Critical distinction:** This creates browser-rendered animations that ARE videos. This is NOT a video editor — you can't trim/splice/edit existing footage. You write code that produces motion graphics from scratch.

---

## When to Use

| Request | Use This |
|---|---|
| "Create a product demo animation for ISHU TOOLS" | ✓ |
| "Make a short promo video for social media" | ✓ |
| "Animated logo reveal" | ✓ |
| "Motion graphic showing how PDF compression works" | ✓ |
| "Explainer video: 5 reasons to use ISHU TOOLS" | ✓ |
| "Cut this YouTube video" | ✗ (Not a video editor) |
| "Trim the beginning of this clip" | ✗ (Not a video editor) |

---

## Technology Stack

| Technology | Purpose | Best For |
|---|---|---|
| **Framer Motion** | React-based declarative animations | Simple transitions, text reveals, card animations |
| **GSAP** | Timeline-based professional animations | Complex choreography, synchronized motion |
| **Three.js / @react-three/fiber** | 3D elements and environments | Logo reveals, particle systems, 3D text |
| **Canvas API** | Custom drawn graphics | Data visualizations, custom shapes |
| **CSS animations** | Lightweight motion | Background gradients, simple reveals |

---

## Key Characteristics

1. **Auto-play** — Videos start immediately, no user click needed
2. **No interactive elements** — Purely visual, no buttons/forms
3. **Fixed duration** — Each segment has predetermined timing
4. **Browser-native** — Renders in real-time, no export needed
5. **React components** — Clean, composable, easy to modify

---

## ISHU TOOLS Video Ideas

### 1. Hero Animation (15 seconds)
```typescript
// Opening: black screen
// 0s-2s: ISHU TOOLS logo fades + scales in
// 2s-4s: "700+ Free Online Tools" text types in
// 4s-8s: Tool cards cascade in from grid (one category at a time, colored)
// 8s-12s: Quick montage: PDF → Image → Video → Math (each 1s)
// 12s-15s: CTA: "Start for free • ishutools.com"

const HeroVideo = () => {
  return (
    <div style={{ background: '#000', width: '1920px', height: '1080px', position: 'relative' }}>
      <LogoReveal delay={0} />
      <TaglineReveal delay={2} />
      <ToolCategoryGrid delay={4} />
      <CTAReveal delay={12} />
    </div>
  )
}
```

### 2. Feature Highlight (30 seconds)
```typescript
// Shows specific tools in action
// Screen recording style (simulated) of tool usage
// Before/after comparison (large PDF → compressed PDF)
```

### 3. Social Media Story (15 seconds vertical 9:16)
```typescript
// 1080×1920 for Instagram/YouTube Shorts
// Bold text, quick cuts, emoji accents
// "Try these FREE tools 👇"
```

---

## GSAP Timeline Pattern

```typescript
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function ISHUToolsIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    
    // Build the animation timeline
    tl
      // Logo entrance
      .fromTo('.logo', 
        { opacity: 0, scale: 0.7, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 }
      )
      // Tagline types in
      .fromTo('.tagline',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6 },
        "+=0.3"  // 0.3s after previous
      )
      // Tool cards cascade
      .fromTo('.tool-card',
        { opacity: 0, y: 40, stagger: 0.08 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 },
        "+=0.5"
      )
      // Glow effect on logo
      .to('.logo', {
        filter: 'drop-shadow(0 0 20px #007aff)',
        duration: 0.5,
        yoyo: true, repeat: 2
      }, "+=1")
    
    return () => { tl.kill() }
  }, [])
  
  return (
    <div ref={containerRef} style={{ background: '#040813', width: 1920, height: 1080 }}>
      <div className="logo">ISHU TOOLS</div>
      <div className="tagline">700+ Free Online Tools</div>
      {MOCK_TOOLS.map(t => <div key={t.slug} className="tool-card">{t.title}</div>)}
    </div>
  )
}
```

---

## Three.js / @react-three/fiber for 3D

```typescript
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'

function LogoIn3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#007aff" />
      <Float speed={2} rotationIntensity={0.3}>
        <Text
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ISHU TOOLS
        </Text>
      </Float>
    </Canvas>
  )
}
```

---

## Framer Motion Video Pattern

```typescript
// Sequence of scenes using AnimatePresence
const scenes = [
  { id: 'intro', duration: 3000 },
  { id: 'tools', duration: 5000 },
  { id: 'cta', duration: 3000 },
]

function VideoPlayer() {
  const [currentScene, setCurrentScene] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScene(s => Math.min(s + 1, scenes.length - 1))
    }, scenes[currentScene].duration)
    return () => clearTimeout(timer)
  }, [currentScene])
  
  return (
    <AnimatePresence mode="wait">
      {currentScene === 0 && <IntroScene key="intro" />}
      {currentScene === 1 && <ToolsScene key="tools" />}
      {currentScene === 2 && <CTAScene key="cta" />}
    </AnimatePresence>
  )
}
```

---

## Video Sizes for Different Platforms

| Platform | Size | Aspect | Duration |
|---|---|---|---|
| YouTube | 1920×1080 | 16:9 | Any |
| YouTube Shorts | 1080×1920 | 9:16 | < 60s |
| Instagram Story | 1080×1920 | 9:16 | 15-30s |
| Twitter/X | 1280×720 | 16:9 | 30-60s |
| LinkedIn | 1920×1080 | 16:9 | 30-90s |
| OG Image Preview | 1200×630 | ~2:1 | Static |

---

## Related Skills
- `media-generation` — AI-generated images for use in video scenes
- `design` — DESIGN subagent for visual art direction of the video
- `mockup-sandbox` — Preview video components on the canvas
- `agent-tools` — inference.sh can generate AI videos (Veo, Seedance models)
