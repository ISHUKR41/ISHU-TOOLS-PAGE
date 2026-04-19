# Canvas Skill

## What It Does
Provides full read/write access to the Replit workspace canvas (the visual board). Enables creating, reading, moving, and deleting shapes — including static shapes (text, images, rectangles) and live iframe embeds for UI previews.

## When to Use
- User wants to see a visual layout or mockup on the board
- Creating design variant comparisons side-by-side
- Placing component previews in iframes
- Adding labels, notes, or diagrams to the board
- Reading existing board state before modifications
- Prototype UI without touching the main app

## Key Capabilities
- `get_canvas_state` — Read current board: all shapes, positions, sizes
- Create shapes: rectangles, text, images, iframes, frames
- Update shape properties: position, size, color, label, content
- Delete shapes by ID
- Group/ungroup shapes
- Snap shapes to grid or specific coordinates

## Critical Rules
1. **ALWAYS call `get_canvas_state` before modifying the board** — never assume what's there
2. Place new shapes in empty areas — **never draw on top of existing content**
3. After creating/changing shapes, pass shape IDs to `presentArtifact`
4. Only use mockup sandbox `/preview/` URLs for iframe embeds — never the main app URL
5. Canvas modifications only available in **Build mode** (not Plan mode)

## Shape Types
- `RECTANGLE` — boxes, containers, backgrounds
- `TEXT` — labels, headings, descriptions
- `IMAGE` — static images from URLs or uploaded files
- `IFRAME` — live web content (use with mockup sandbox)
- `FRAME` — grouping container for organizing shapes

## Coordinate System
- Origin (0,0) is top-left
- X increases rightward, Y increases downward
- Default canvas is large — place shapes thoughtfully

## Related Skills
- `mockup-sandbox` — Creating live preview URLs for iframes
- `artifacts` — The artifact system behind sandbox creation
- `mockup-extract` — Extracting existing app components to canvas
- `mockup-graduate` — Graduating canvas mockups back into the app
