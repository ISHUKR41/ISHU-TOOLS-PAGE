# Artifacts Skill — Ultra-Detailed Reference

## What It Does
Creates and manages artifact objects in the Replit workspace. Artifacts are isolated, self-contained environments for specific purposes. For this project, **only the `mockup-sandbox` artifact type is supported** — it spins up a dedicated Vite preview server that renders React components in isolation, providing unique `/preview/[ComponentName]` URLs for iframe embedding on the canvas board.

---

## Supported Artifact Type: `mockup-sandbox`

The only supported artifact type. Creates a completely isolated Vite + React dev server separate from the main ISHU TOOLS dev server. This separation is intentional — component previews shouldn't interfere with the main app.

```javascript
// Initialize the mockup sandbox
const artifact = await createArtifact({ artifactType: 'mockup-sandbox' });

// Returns:
// {
//   id: "artifact-abc123",
//   type: "mockup-sandbox",
//   previewBaseUrl: "https://sandbox-abc123.replit.app",
//   status: "ready"
// }

// Each component preview is then available at:
// https://sandbox-abc123.replit.app/preview/ComponentName
```

---

## When to Use

| Situation | Use This |
|---|---|
| Showing a component variant on the canvas | ✓ Initialize sandbox → create preview → iframe on canvas |
| Comparing two designs side by side | ✓ Two sandbox previews → two iframes on canvas |
| Extracting existing app component to canvas | ✓ mockup-extract workflow uses this |
| User wants to "see the design before merging" | ✓ |
| Showing a static image or diagram | ✗ Use IMAGE shape on canvas instead |
| Showing the full running app | ✗ Take a screenshot instead |

---

## Key Constraints

### Only one artifact type
```javascript
// ✓ Correct
await createArtifact({ artifactType: 'mockup-sandbox' })

// ❌ These DON'T exist
await createArtifact({ artifactType: 'database' })
await createArtifact({ artifactType: 'api-server' })
await createArtifact({ artifactType: 'notebook' })
```

If the user asks for any other artifact type, explain that only mockup-sandbox is supported for this project, and suggest the appropriate alternative.

### Canvas iframes must use `/preview/` URLs
```javascript
// ✓ Correct — sandbox preview URL
src: "https://sandbox-abc123.replit.app/preview/ToolCard"

// ❌ Wrong — main app URL shows full app, not isolated component
src: "https://yourapp.replit.app/"

// ❌ Wrong — external sites in iframes often blocked by CSP
src: "https://stripe.com"
```

### Artifacts create their own Vite server
- The sandbox Vite server runs on a different port than the main app (usually 5173)
- The two are completely independent — changes to one don't affect the other
- The sandbox has its own `package.json` and can install different packages

---

## Full Workflow: Artifact → Preview → Canvas

```javascript
// Step 1: Create the artifact (one-time setup per session)
const artifact = await createArtifact({ artifactType: 'mockup-sandbox' });
const baseUrl = artifact.previewBaseUrl;

// Step 2: Write component preview files in the sandbox
// (See mockup-sandbox skill for file structure)
writeFile("mockup-sandbox/src/previews/ToolCard_B.tsx", componentCode);

// Step 3: Place iframe on canvas
const canvasState = await get_canvas_state();
const shape = await createShape({
  type: "IFRAME",
  x: 100, y: 200,
  width: 420, height: 600,
  src: `${baseUrl}/preview/ToolCard_B`,
});

// Step 4: Tell user about the shape
presentArtifact({ shapeIds: [shape.id] });
```

---

## Lifecycle

```
createArtifact() → Sandbox spins up (~10-15 seconds)
      ↓
Write preview files to mockup-sandbox/src/previews/
      ↓
Vite HMR picks up changes automatically
      ↓
iframe on canvas shows live component
      ↓
User approves design → mockup-graduate skill integrates it
      ↓
Sandbox can be left running or artifact cleaned up
```

---

## What Happens if Sandbox Crashes

```javascript
// Check if sandbox is healthy
const status = await getArtifactStatus({ id: artifact.id });

if (status.status !== 'ready') {
  // Recreate the artifact
  const newArtifact = await createArtifact({ artifactType: 'mockup-sandbox' });
}
```

---

## presentArtifact — Critical Last Step

After placing any shape on canvas, ALWAYS call `presentArtifact`:
```javascript
presentArtifact({ shapeIds: [shapeA.id, shapeB.id, shapeC.id] });
```
This tells the Replit UI to focus on these shapes and show the user a "Open Canvas" card in the chat. Without this, the user has no way to know the shapes were placed.

---

## Related Skills
- `mockup-sandbox` — Full workflow for creating and managing sandbox previews
- `canvas` — All canvas shape operations (create, update, delete, read)
- `mockup-extract` — Extracting existing app components into the sandbox
- `mockup-graduate` — Moving approved sandbox designs into the main application
