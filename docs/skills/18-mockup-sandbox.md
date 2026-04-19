# Mockup Sandbox Skill — Ultra-Detailed Reference

## What It Does
Sets up an isolated Vite development server for rendering React components independently from the main ISHU TOOLS application. Every component gets a dedicated `/preview/[name]` URL that can be embedded as a live, interactive iframe on the canvas board. This is the foundation for all design variant comparison workflows.

**Core principle:** The main app URL shows the full app. The sandbox shows isolated components. Never mix them.

---

## When to Use

| Situation | Action |
|---|---|
| Design new component before adding to app | Create sandbox preview |
| Compare 2+ design variants | Multiple sandbox previews on canvas |
| Show responsive variants (375px, 768px, 1280px) | Same sandbox at different iframe widths |
| Preview component states (loading, error, empty) | Different props in each preview |
| Dark mode vs light mode | Two previews |
| User asks to "show me" anything visual | Sandbox + canvas iframe |

## When NOT to Use
- Quick one-line CSS fixes → just edit the file directly
- Backend-only changes → no visual component, no sandbox needed
- The user wants to see the full app → take a screenshot instead

---

## Sandbox Directory Structure

```
mockup-sandbox/          ← Root of the sandbox
├── package.json         ← Vite + React + dependencies
├── vite.config.ts       ← Preview routing config
├── index.html
└── src/
    ├── main.tsx         ← Entry point (renders previews by route)
    ├── previews/        ← One file per preview component
    │   ├── ToolCard.tsx         ← /preview/ToolCard
    │   ├── ToolCard_A.tsx       ← /preview/ToolCard_A (Variant A)
    │   ├── ToolCard_B.tsx       ← /preview/ToolCard_B (Variant B)
    │   ├── HeroSection.tsx      ← /preview/HeroSection
    │   └── CategoryPage.tsx     ← /preview/CategoryPage
    ├── components/      ← Shared components used by previews
    ├── lib/             ← Copied/adapted from main app
    └── mock-data.ts     ← Realistic fake data for stubs
```

---

## Setup Process (First Time)

```javascript
// Initialize the mockup sandbox
const artifact = await createArtifact({ artifactType: 'mockup-sandbox' });
const sandboxBaseUrl = artifact.previewBaseUrl;
// e.g., "https://sandbox-abc123.replit.app"

// The preview URL pattern:
// ${sandboxBaseUrl}/preview/ComponentName
```

The `createArtifact` call:
1. Creates `mockup-sandbox/` directory
2. Initializes Vite + React + TypeScript
3. Sets up the `/preview/[name]` routing
4. Returns the base URL for embedding

---

## Creating a Component Preview

```typescript
// mockup-sandbox/src/previews/ToolCard_B.tsx
// Every preview MUST export a default component

import { motion } from 'framer-motion'

// Inline the types needed (don't import from main app — different module graph)
interface Tool {
  slug: string
  title: string
  description: string
  category: string
}

const MOCK_TOOL: Tool = {
  slug: "compress-pdf",
  title: "Compress PDF — Free Online PDF Compressor",
  description: "Reduce PDF file size without losing quality. No signup needed.",
  category: "pdf-core",
}

// Category color map (copy from main app or inline here)
const CATEGORY_COLORS: Record<string, string> = {
  "pdf-core": "#ef4444",
  "image-tools": "#a855f7",
  "developer-tools": "#22c55e",
  "science-tools": "#38bdf8",
  "cooking-tools": "#fb923c",
}

// The actual component design (Variant B — Glassmorphism Max)
function ToolCard_B({ tool }: { tool: Tool }) {
  const accent = CATEGORY_COLORS[tool.category] || "#007aff"
  
  return (
    <motion.div
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: `1px solid rgba(255,255,255,0.12)`,
        padding: "20px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 20px 60px ${accent}33`,
        borderColor: `${accent}66`,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div style={{ fontSize: "24px", marginBottom: "12px" }}>📄</div>
      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: 0 }}>
        {tool.title}
      </h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "6px", lineClamp: 2 }}>
        {tool.description}
      </p>
      <span style={{
        position: "absolute", bottom: "12px", right: "12px",
        background: `${accent}22`, color: accent,
        padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      }}>
        PDF
      </span>
    </motion.div>
  )
}

// Required: default export wraps component in realistic context
export default function ToolCard_B_Preview() {
  return (
    <div style={{
      padding: "3rem",
      background: "#040813",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ width: "320px" }}>
        <ToolCard_B tool={MOCK_TOOL} />
      </div>
    </div>
  )
}
```

---

## Image Handling in Sandbox

Images referenced in sandbox components need special treatment:

```typescript
// ❌ WRONG — attached_assets path won't work in sandbox
<img src="/attached_assets/logo.png" />

// ✓ CORRECT option 1: Public URL from main app
<img src="https://your-app.replit.app/logo.png" />

// ✓ CORRECT option 2: import URL
import logoUrl from '../../public/logo.png'  // Relative to sandbox
<img src={logoUrl} />

// ✓ CORRECT option 3: Copy to sandbox public/
// Copy attached_assets/logo.png to mockup-sandbox/public/logo.png
<img src="/logo.png" />
```

---

## Vite Config for Mockup Sandbox

```typescript
// mockup-sandbox/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,    // Different from main app (5000) to avoid conflict
    allowedHosts: true,
  },
  // Route /preview/:name → renders that preview component
  // This is handled by the main.tsx routing logic
})
```

---

## Placing Previews on Canvas

After the sandbox is running and preview components are created:

```javascript
const state = await get_canvas_state();
// Find empty area (check state.shapes positions)

// Standard layout: 3 variants, 40px gap
const positions = [
  { x: 100, y: 200 },
  { x: 580, y: 200 },
  { x: 1060, y: 200 },
];

const shapeIds = await Promise.all(
  ['ToolCard_A', 'ToolCard_B', 'ToolCard_C'].map(async (name, i) => {
    // Label above each iframe
    await createShape({
      type: "TEXT", x: positions[i].x, y: positions[i].y - 30,
      content: `Variant ${String.fromCharCode(65 + i)}: ${name.replace('_', ' ')}`,
      fontSize: 14, color: "#888",
    });
    // The iframe
    return createShape({
      type: "IFRAME",
      x: positions[i].x, y: positions[i].y,
      width: 420, height: 600,
      src: `${sandboxBaseUrl}/preview/${name}`,
    });
  })
);

// Present to user
presentArtifact({ shapeIds: shapeIds.map(s => s.id) });
```

---

## Troubleshooting Sandbox

| Issue | Likely Cause | Fix |
|---|---|---|
| Blank iframe | Component not exported as default | Add `export default` |
| Build error | Missing import or type | Fix the import or inline the type |
| Image broken | Wrong path | Use public URL or copy to sandbox/public |
| Animation not working | Framer Motion not installed in sandbox | Add to sandbox package.json |
| Can't find `CATEGORY_THEME_MAP` | Different module graph | Copy the relevant section inline |

---

## Related Skills
- `canvas` — Board state management and iframe placement
- `artifacts` — The `createArtifact` call that initializes this environment
- `mockup-extract` — Copy real app components into this sandbox
- `mockup-graduate` — Move approved sandbox designs into the main app
- `design-exploration` — Orchestrating multiple variants in this environment
