# Mockup Sandbox Skill

## What It Does
Creates an isolated Vite development server for previewing React components without affecting the main application. Each component gets a unique `/preview/` URL that can be embedded as an iframe on the canvas board.

## When to Use
- Designing new components before adding to the app
- Comparing multiple design variants side-by-side
- Showing responsive previews (mobile/tablet/desktop widths)
- Previewing component states (loading, error, empty, filled)
- Dark vs light mode comparisons
- Any request to show rendered web content on the board

## NEVER Do This
- **Never embed the main app URL** directly as an iframe — use mockup sandbox `/preview/` URLs only
- The main dev server URL shows the full app, not isolated components

## Setup Process
1. Create `mockup-sandbox/` at project root (if it doesn't exist)
2. Initialize with Vite + React + TypeScript
3. Create component files under `mockup-sandbox/src/previews/`
4. Each preview exports a default React component
5. The sandbox serves each at `/preview/[filename]`

## URL Pattern
```
http://localhost:[sandbox_port]/preview/ToolCard
http://localhost:[sandbox_port]/preview/HeroSection
http://localhost:[sandbox_port]/preview/BentoGrid
```

## Component Preview Structure
```typescript
// mockup-sandbox/src/previews/ToolCard.tsx
export default function ToolCardPreview() {
  return (
    <div style={{ padding: '2rem', background: '#000' }}>
      <ToolCard title="Merge PDF" category="pdf-core" />
    </div>
  )
}
```

## Variant Comparison Pattern
Create multiple files for side-by-side comparison:
- `ToolCard_A.tsx` — Variant A
- `ToolCard_B.tsx` — Variant B
- `ToolCard_C.tsx` — Variant C

Then embed all three as iframes at different canvas positions with labels.

## Image Handling in Sandbox
- Import images using `new URL('../../assets/image.png', import.meta.url).href`
- Never use `attached_assets/` paths in src attributes — copy to `public/` first

## Related Skills
- `canvas` — Placing sandbox iframes on the board
- `artifacts` — The `createArtifact()` call that initializes the sandbox
- `mockup-extract` — Extracting app components into the sandbox
- `mockup-graduate` — Moving approved sandbox designs to the main app
