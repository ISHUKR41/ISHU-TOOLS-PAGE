# Slides Skill

## What It Does
Creates, edits, and imports slide deck artifacts in the Replit workspace. Supports building presentations from scratch, editing existing decks, and importing `.pptx` files. Presentations render as interactive slide components.

## When to Use
- User asks for "slides", "presentation", "pitch deck", or "slide deck"
- Importing and working with .pptx files
- Creating animated slide sequences
- Building visual presentations for projects

## Key Capabilities
- Create slide decks programmatically with React components
- Import `.pptx` files and convert to editable React format
- Edit individual slides — content, layout, animations
- Export to viewable format
- Slide transitions and animations

## Slide Component Structure
```typescript
// Each slide is a React component
export const Slide1 = () => (
  <SlideContainer background="dark" layout="center">
    <Title>ISHU TOOLS</Title>
    <Subtitle>622+ Free Online Tools</Subtitle>
    <AnimatedList items={["No signup", "No watermark", "100% free"]} />
  </SlideContainer>
)
```

## Manifest Contract
The skill uses a manifest file to track slides:
```json
{
  "title": "Deck Name",
  "slides": [
    { "id": "slide-1", "component": "Slide1", "notes": "..." }
  ]
}
```

## PPTX Import
1. User attaches a `.pptx` file
2. Extract slide content, layouts, images
3. Convert to React components matching original design
4. Make slides editable

## Common Use Cases for ISHU TOOLS
- Product demo presentation
- "About ISHU TOOLS" investor/explainer deck
- Tutorial slides for complex tools
- School/university presentation templates (student tools)

## Related Skills
- `pptx` — User-provided skill for .pptx file manipulation
- `media-generation` — For slide background images
- `design` — DESIGN subagent for slide aesthetics
