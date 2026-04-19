# Artifacts Skill

## What It Does
Creates and manages artifact objects in the Replit workspace. For this project, only the **mockup-sandbox** artifact type is supported, which spins up a Vite preview server for live component rendering on the canvas.

## When to Use
- Creating interactive UI previews on the canvas board
- Isolating component previews from the main application
- Side-by-side variant comparisons of UI designs
- Before integrating a new design into the main app

## Supported Artifact Type
- `mockup-sandbox` — Creates a Vite-powered isolated preview server. Each component gets a unique `/preview/` URL for iframe embedding on the canvas.

## Key Constraints
- Only `mockup-sandbox` type is supported — no other artifact types
- If user asks for a different artifact type, explain this limitation
- Canvas iframes must use mockup sandbox `/preview/` URLs (not the main app URL)
- Artifacts create their own Vite server, not the main dev server

## Usage Notes
- Call `createArtifact({ artifactType: 'mockup-sandbox' })` via code execution
- Returns a base URL for component previews
- Works in conjunction with the `canvas` and `mockup-sandbox` skills
- After creating, present shapes to user with shape IDs via `presentArtifact`

## Related Skills
- `mockup-sandbox` — Full workflow for creating previews
- `canvas` — Placing iframe shapes on the board
- `mockup-extract` — Extracting existing components for preview
- `mockup-graduate` — Moving approved mockups into the main app
