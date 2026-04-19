# Canvas Skill — Ultra-Detailed Reference

## What It Does
Provides full read/write access to the Replit workspace canvas — the visual board where you can place shapes, text, images, diagrams, and **live web previews via iframe embeds**. Canvas is the workspace for showing design mockups, variant comparisons, architecture diagrams, and interactive UI previews without touching the main application.

---

## When to Use

| Use Case | Canvas Action |
|---|---|
| Design variant comparison | 2-4 iframes side by side |
| Architecture diagram | Shapes + text labels |
| UI mockup before implementing | Iframe from mockup-sandbox |
| Visual reference / inspiration | Image shape with reference screenshot |
| Design notes / annotations | Text shapes |
| Responsive preview | Multiple iframes at different widths |
| Dark/light mode comparison | Two iframes of same component |

## When NOT to Use
- Build mode Plan mode restriction: can only read canvas in Plan mode
- Never embed the main app URL as an iframe — always use mockup-sandbox `/preview/` URLs

---

## Always Read State First

```javascript
// MANDATORY before ANY canvas operation
const state = await get_canvas_state();
console.log(`Existing shapes: ${state.shapes.length}`);
console.log(`Canvas bounds: ${JSON.stringify(state.viewport)}`);

// Find empty space for new shapes
// Look for gaps between existing shapes
state.shapes.forEach(s => {
  console.log(`${s.id}: ${s.type} at (${s.x}, ${s.y}) size ${s.width}x${s.height}`);
});
```

**Why mandatory:** Canvas persists across sessions. Shapes placed without checking can overlap existing content and confuse the user. Always know what's there before placing.

---

## Shape Types Reference

### RECTANGLE — boxes, backgrounds, containers
```javascript
const rect = await createShape({
  type: "RECTANGLE",
  x: 100, y: 200,
  width: 400, height: 300,
  fill: "#1a1a2e",
  stroke: "rgba(255,255,255,0.1)",
  strokeWidth: 1,
  borderRadius: 16,
  label: "Tool Card Container",
});
```

### TEXT — headings, labels, descriptions
```javascript
const text = await createShape({
  type: "TEXT",
  x: 100, y: 160,
  content: "Variant A: Linear Dark",
  fontSize: 16,
  fontWeight: "semibold",
  color: "#ffffff",
  width: 400,
});
```

### IMAGE — static images from URLs
```javascript
const img = await createShape({
  type: "IMAGE",
  x: 600, y: 200,
  width: 400, height: 300,
  src: "https://...",  // Must be a public URL
});
```

### IFRAME — live web content (most important for design work)
```javascript
const iframe = await createShape({
  type: "IFRAME",
  x: 100, y: 250,
  width: 420, height: 700,
  // ONLY use mockup-sandbox /preview/ URLs
  src: "https://your-sandbox.replit.app/preview/ToolCard",
  // NEVER use the main app URL or external sites
});
```

### FRAME — grouping container
```javascript
const frame = await createShape({
  type: "FRAME",
  x: 50, y: 100,
  width: 900, height: 800,
  label: "Design Variants",
  fill: "rgba(255,255,255,0.02)",
});
```

---

## Standard Canvas Layout for Design Variants

```
                    CANVAS (infinite scroll)
                         
  (100, 100) ──────────────────────────────────────────────
  │   [Variant A]        [Variant B]        [Variant C]   │
  │   TEXT label         TEXT label         TEXT label     │
  │                                                        │
  │   [IFRAME 400x700]   [IFRAME 400x700]   [IFRAME 400x700]
  │   /preview/ToolCardA  /preview/ToolCardB  /preview/ToolCardC
  │                                                        │
  ──────────────────────────────────────────────────────────

Standard spacing:
  - Between variant iframes: 40px gap
  - Label above iframe: 30px
  - Label font: 14px, white, semibold
  - Iframe width: 400-420px (standard component width)
  - Iframe height: match component height (300-800px depending on component)
```

---

## Complete Variant Placement Code

```javascript
// After getting canvas state and finding empty area:
const startX = 100;  // Adjust based on get_canvas_state() result
const startY = 200;
const variantWidth = 420;
const variantHeight = 700;
const gap = 60;

// Variant labels
await createShape({ type: "TEXT", x: startX, y: startY, 
  content: "Variant A — Linear Dark", fontSize: 14, color: "#aaaaaa", width: variantWidth });

await createShape({ type: "TEXT", x: startX + variantWidth + gap, y: startY, 
  content: "Variant B — Glassmorphism", fontSize: 14, color: "#aaaaaa", width: variantWidth });

// Variant iframes
const frameA = await createShape({
  type: "IFRAME",
  x: startX, y: startY + 30,
  width: variantWidth, height: variantHeight,
  src: "https://sandbox-url.replit.app/preview/VariantA"
});

const frameB = await createShape({
  type: "IFRAME",
  x: startX + variantWidth + gap, y: startY + 30,
  width: variantWidth, height: variantHeight,
  src: "https://sandbox-url.replit.app/preview/VariantB"
});

// Tell the user about the shapes
presentArtifact({ shapeIds: [frameA.id, frameB.id] });
```

---

## Updating Existing Shapes

```javascript
// Move a shape
await updateShape({ id: "shape-123", x: 500, y: 300 });

// Resize
await updateShape({ id: "shape-123", width: 500, height: 800 });

// Change content (text shape)
await updateShape({ id: "shape-123", content: "New label text" });

// Change iframe URL
await updateShape({ id: "shape-123", src: "https://new-preview-url/component" });
```

---

## Deleting Shapes

```javascript
// Delete by ID
await deleteShape({ id: "shape-123" });

// Delete multiple
await Promise.all(["id-1", "id-2", "id-3"].map(id => deleteShape({ id })));
```

---

## Critical Rules

1. **Call `get_canvas_state` FIRST** — always. No exceptions.
2. **Only mockup-sandbox `/preview/` URLs** for iframes — never main app URL
3. **Place in empty areas** — check existing shape positions, don't overlap
4. **After placing shapes** — call `presentArtifact` with shape IDs
5. **Canvas is read-only in Plan mode** — only modify in Build mode
6. **Don't ask user to open canvas** — they'll see it automatically via `presentArtifact`

---

## Related Skills
- `mockup-sandbox` — Creating the preview server for iframe content
- `artifacts` — The artifact system (only mockup-sandbox type is supported)
- `mockup-extract` — Extracting existing app components onto canvas
- `mockup-graduate` — Taking approved canvas mockup back into the main app
- `design-exploration` — Using canvas for design variant exploration
