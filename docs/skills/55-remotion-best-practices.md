# Remotion Best Practices Skill — Programmatic Video in React

## What It Does
Create agency-quality animated videos programmatically using React, Framer Motion, GSAP, and Three.js. Renders MP4 videos that auto-play with no interactive elements. Ideal for marketing clips, explainers, social media content, product demos, and motion graphics.

---

## Activation Triggers
- "Create a video programmatically"
- "Animate this as a video"
- "Marketing video / explainer video"
- "Motion graphics / animated logo"
- "Social media content (Reels/Shorts)"
- "Product demo video"
- "Remotion", "React video"

---

## Core Architecture

```typescript
import { Composition, AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#03060e' }}>
      <div style={{ opacity, fontSize: 64, color: '#3bd0ff' }}>
        ISHU TOOLS
      </div>
    </AbsoluteFill>
  );
};
```

---

## Composition Setup

```typescript
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}  // 5 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

---

## Animation Patterns

### Spring Animation
```typescript
const scale = spring({ frame, fps, from: 0, to: 1, config: { damping: 100, stiffness: 200 } });
```

### Text Reveal (Character by Character)
```typescript
const text = "ISHU TOOLS";
const charsToShow = Math.floor(interpolate(frame, [0, 60], [0, text.length], { extrapolateRight: 'clamp' }));
return <span>{text.slice(0, charsToShow)}</span>;
```

### Smooth Entrance
```typescript
const translateY = interpolate(frame, [0, 45], [50, 0], { extrapolateRight: 'clamp' });
const opacity = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp' });
```

### Sequence (Staggered Animations)
```typescript
import { Sequence } from 'remotion';
<Sequence from={0} durationInFrames={60}><Title /></Sequence>
<Sequence from={30} durationInFrames={60}><Subtitle /></Sequence>
```

---

## Common Video Types for ISHU TOOLS

### Tool Demo Video (15 seconds)
- Frames 0-30: ISHU TOOLS logo entrance
- Frames 30-60: Tool name + description appear
- Frames 60-120: Screen recording mock of tool usage
- Frames 120-150: CTA: "Try it free at ishutools.com"

### Social Media Short (30 seconds at 60fps)
- 1800 total frames
- Bold text animations, high contrast
- Square or 9:16 format

---

## Dependencies
```json
{
  "remotion": "^4.0.0",
  "@remotion/player": "^4.0.0",
  "framer-motion": "^11.0.0",
  "gsap": "^3.12.0"
}
```

---

## Rendering
```bash
npx remotion render MyVideo out/video.mp4
npx remotion render MyVideo out/video.mp4 --codec=h264 --crf=18
```

---

## Tips
- Use `useCurrentFrame()` as the single source of truth for animations
- Keep computations deterministic — no `Date.now()` or `Math.random()`
- Use `staticFile()` for assets (images, fonts, audio)
- `interpolate()` with `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` prevents overshoot
- Videos auto-play, no interactive elements — design for passive viewing
