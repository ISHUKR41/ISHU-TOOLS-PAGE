# Slides Skill — Ultra-Detailed Reference

## What It Does
Creates, edits, and imports slide deck presentations in the Replit workspace. Slides are built as React components — each slide is a component that can have animations, images, charts, and custom layouts. Supports importing `.pptx` files and converting them to editable React format. Presentations render as interactive, animated slide sequences.

---

## When to Use

- User asks for "slides", "presentation", "pitch deck", "deck", or "slide deck"
- User attaches a `.pptx` file and wants to edit/import it
- Creating tutorial slides for complex ISHU TOOLS features
- Building a "How ISHU TOOLS Works" explainer
- Creating school/university presentation templates (student tools category)
- Product demo slide deck for investors or partnerships

---

## Slide Component Architecture

Each presentation is a directory of React slide components:

```
presentations/
└── ishu-tools-demo/
    ├── manifest.json      ← Slide order and metadata
    ├── Slide1.tsx         ← Title slide
    ├── Slide2.tsx         ← Problem statement
    ├── Slide3.tsx         ← ISHU TOOLS solution
    ├── Slide4.tsx         ← Tool categories showcase
    ├── Slide5.tsx         ← Key features
    ├── Slide6.tsx         ← Student benefits
    └── Slide7.tsx         ← CTA / contact
```

---

## Manifest File

```json
{
  "title": "ISHU TOOLS — 700+ Free Online Tools for Students",
  "author": "Ishu Kumar",
  "version": "1.0",
  "theme": "dark",
  "slides": [
    {
      "id": "slide-1",
      "component": "Slide1",
      "title": "Title Slide",
      "notes": "Introduce ISHU TOOLS as the go-to free tools platform for Indian students"
    },
    {
      "id": "slide-2",
      "component": "Slide2",
      "title": "The Problem",
      "notes": "Students need expensive tools. ISHU TOOLS makes them free."
    }
  ]
}
```

---

## Slide Component Templates

### Title Slide
```typescript
// Slide1.tsx — Title Slide
import { motion } from 'framer-motion'

export function Slide1() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #040813 0%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Brand mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={{ 
          fontSize: '14px', letterSpacing: '0.3em', 
          color: '#007aff', fontWeight: 600, marginBottom: 16 
        }}>
          ISHU KUMAR PRESENTS
        </div>
      </motion.div>
      
      {/* Title */}
      <motion.h1
        style={{ 
          fontSize: '72px', fontWeight: 800, color: '#ffffff',
          textAlign: 'center', lineHeight: 1.1, margin: 0,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        ISHU TOOLS
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p
        style={{ 
          fontSize: '28px', color: 'rgba(255,255,255,0.6)',
          textAlign: 'center', marginTop: 20 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        700+ Free Online Tools for Students
      </motion.p>
      
      {/* Categories badge row */}
      <motion.div
        style={{ display: 'flex', gap: 12, marginTop: 40 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        {['PDF', 'Image', 'Video', 'Math', 'Science', 'Health'].map(cat => (
          <span key={cat} style={{
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            fontWeight: 500,
          }}>{cat}</span>
        ))}
      </motion.div>
    </div>
  )
}
```

### Content Slide with List
```typescript
// Slide3.tsx — Features List
export function Slide3() {
  const features = [
    "100% Free — No hidden charges, ever",
    "No signup required — Just use the tool",
    "700+ tools across 15+ categories",
    "Indian student-focused (CGPA, Attendance, EMI)",
    "Works on mobile — fully responsive",
    "No watermarks on downloads",
  ]
  
  return (
    <div style={{ padding: '80px', background: '#040813', height: '100%' }}>
      <motion.h2 style={{ fontSize: 48, fontWeight: 700, color: '#fff', margin: 0 }}>
        Why ISHU TOOLS?
      </motion.h2>
      
      <div style={{ marginTop: 48 }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <span style={{ color: '#007aff', fontSize: 20 }}>✓</span>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>{f}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

---

## PPTX Import Process

```javascript
// When user attaches a .pptx file:
// 1. Read the file using the pptx skill
// 2. Extract: slide text, layouts, images, speaker notes
// 3. Convert each slide to a React component
// 4. Match original visual design as closely as possible
// 5. Add Framer Motion transitions
// 6. Create manifest.json

// See the pptx skill for file manipulation details
```

---

## Presentation Slide Sizes

```typescript
// Standard sizes
const SLIDE_SIZES = {
  standard: { width: 1280, height: 720 },    // 16:9 HD
  widescreen: { width: 1920, height: 1080 }, // 16:9 Full HD
  presentation: { width: 1024, height: 768 }, // 4:3 classic
  poster: { width: 1080, height: 1920 },     // 9:16 vertical
}
```

---

## Common ISHU TOOLS Presentation Decks

### 1. Product Demo (7 slides)
Title → Problem → Solution → Tool Categories → Student Features → Reviews → CTA

### 2. Investor/Partnership Deck (12 slides)
Title → Mission → Market → Product → Traction → Team → Revenue Model → Roadmap → Ask

### 3. Tutorial Deck (per tool)
Tool Name → What It Does → Step 1 → Step 2 → Result → Tips → More Tools

---

## Related Skills
- `pptx` — User-provided skill for .pptx file manipulation
- `media-generation` — For slide background images and illustrations
- `design` — DESIGN subagent for slide visual design
- `video-js` — For turning slide content into animated video
