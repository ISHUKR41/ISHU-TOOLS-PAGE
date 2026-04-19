# Mockup Extract Skill

## What It Does
Extracts existing components from the main application onto the canvas for redesign or variant exploration. Copies the component and its dependencies into the mockup sandbox, rewrites imports, stubs external dependencies, and embeds the result as a live iframe on the canvas.

## When to Use
- User says "put my [component] on the canvas"
- "Show my current [page/component] on the board"
- "Redesign my existing [component]"
- "Create variants of my current [page]"
- "Improve my [existing component]"
- Any request to iterate on something that already exists in the app

## IMPORTANT RULE
**Never hand-code an approximation of an existing component.** Always use the actual source code as the starting point. The extract workflow ensures fidelity to the real implementation.

## Extraction Process
1. Read the target component file(s)
2. Identify all imports and dependencies
3. Copy files into the mockup sandbox structure
4. Rewrite import paths for the sandbox environment
5. Stub external dependencies (API calls, routing, etc.)
6. Start the preview and embed as canvas iframe
7. Pass shape IDs to `presentArtifact`

## What Gets Stubbed
- API calls → return mock data
- Router navigation → no-ops
- Toast notifications → console.log
- File uploads → mock file objects
- Auth state → default user object

## Usage Pattern
```
1. User: "Put my ToolCard on the canvas to redesign it"
2. Read: frontend/src/components/tools/ToolCard.tsx
3. Copy to: mockup-sandbox/src/components/ToolCard.tsx
4. Rewrite imports, stub API calls
5. Create iframe on canvas at position (100, 100)
6. Present shape ID to user
```

## Related Skills
- `mockup-sandbox` — The underlying sandbox environment
- `canvas` — Placing the iframe on the board
- `mockup-graduate` — Moving approved redesigns back into the main app
- `design-exploration` — Creating multiple variants of extracted components
