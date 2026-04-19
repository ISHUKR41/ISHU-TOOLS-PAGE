# Design Exploration Skill

## What It Does
Intercepts user requests for design alternatives, variations, or explorations. Instead of immediately implementing a single design, it creates a structured **design brief** and uses the DESIGN subagent to produce multiple variants side-by-side on the canvas.

## When to Use
- User says "show me options", "give me variations", "try different styles"
- User selects a component and asks for "ideas" or "directions"
- Exploring divergent design alternatives before committing
- User asks "what else could this look like?"
- Any request implying multiple design possibilities

## Key Workflow
1. **Intercept** the request before delegating to design subagent
2. **Analyze** the current component/page being referenced
3. **Create a design brief** with 2-4 clear variant directions
4. **Launch parallel DESIGN subagents** for each variant
5. **Place iframes** side-by-side on the canvas with labels
6. **Present** the variants to the user for selection

## Design Brief Structure
```markdown
# Design Brief: [Component Name]

## Context
- Current state: [description]
- User goal: [what they want to achieve]

## Variant A: [Direction Name]
- Style: [e.g., "Minimal glassmorphism with subtle glow"]
- Colors: [specific values]
- Key differentiator: [what makes this unique]

## Variant B: [Direction Name]
...
```

## Activation Triggers
- "generate variations"
- "explore alternatives"
- "show me options"
- "what else could this be"
- "try different approaches"
- "ideas for [component]"
- "possibilities for [design]"

## Important Rules
1. **ALWAYS analyze existing code** before creating variants — use real source, not approximations
2. Use `mockup-extract` if the component already exists in the app
3. Pass the design brief to DESIGN subagents — don't skip analysis
4. Include file paths in the brief

## Related Skills
- `design` — DESIGN subagent for actual implementation
- `mockup-sandbox` — Creating the preview environment
- `canvas` — Placing variants on the board
- `mockup-extract` — Extracting existing components
