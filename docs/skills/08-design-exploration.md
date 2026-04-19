# Design Exploration Skill — Ultra-Detailed Reference

## What It Does
Intercepts user requests for design alternatives and produces a structured **design brief** before spawning multiple DESIGN subagents in parallel. Instead of immediately implementing one solution, it explores 2-4 different design directions side-by-side on the canvas, so the user can make an informed visual choice before any code is written in the main app.

This skill prevents the "one shot" problem — where the agent guesses at a design direction and the user has to iterate multiple times. Instead: analyze → brief → variants → user chooses → implement.

---

## When This Skill Activates

Listen for these phrases (exact or implied):
- "Show me options for the [component]"
- "Generate variations of this design"
- "Explore different looks for this"
- "What else could this look like?"
- "Try different approaches"
- "Give me ideas for [X]"
- "I want to see alternatives"
- "Can you show me a few different designs?"
- "Explore directions for the home page"

**Also activates** when the user selects a component and asks for "ideas", "directions", or "possibilities" — even without explicit variant words.

---

## The Full Exploration Workflow

```
Step 1: INTERCEPT
  ↓ Don't immediately implement — pause and analyze first

Step 2: ANALYZE (READ existing code)
  ↓ Read the actual source file of the component being referenced
  ↓ Never approximate or hand-code from memory

Step 3: BRIEF CREATION
  ↓ Write a structured design brief with 2-4 variant directions
  ↓ Each variant has: style name, key features, color direction, differentiator

Step 4: PARALLEL SUBAGENT LAUNCH
  ↓ Launch one DESIGN subagent per variant simultaneously
  ↓ Each subagent works on an isolated mockup sandbox component

Step 5: CANVAS PLACEMENT
  ↓ get_canvas_state → find empty area
  ↓ Place iframes side-by-side with labels (Variant A, B, C)
  ↓ Add text labels above each iframe

Step 6: PRESENT TO USER
  ↓ Tell user the variants are ready on the canvas
  ↓ Describe each option briefly in plain language
  ↓ Ask which they prefer (or ask for more iterations)

Step 7: GRADUATE (if chosen)
  ↓ User picks Variant B → mockup-graduate skill integrates into main app
```

---

## Design Brief Structure

```markdown
# Design Brief: [Component Name] — [Date]

## Context
- Component: ToolCard (frontend/src/features/home/components/ToolCard.tsx)
- Current state: Basic card with title, icon, box shadow on hover
- User goal: More visual richness, differentiated by category

## Target Environment
- React 19 + TypeScript
- Framer Motion for animations
- CSS custom properties for theming
- Existing category colors: CATEGORY_THEME_MAP in toolPresentation.ts

---

## Variant A: "Linear Dark" — Minimal Developer Aesthetic
- Inspired by: Linear.app, Vercel Dashboard
- Background: solid rgba(255,255,255,0.03) — very subtle
- Border: 1px solid rgba(255,255,255,0.08) — barely visible
- Left accent: 3px left border in category color
- Hover: subtle brightness increase, border-color shifts to accent
- Typography: tight, monospace label for category
- Animation: 150ms ease, minimal movement
- Feel: professional, clean, no distractions

## Variant B: "Glassmorphism Max" — Apple/Stripe Inspiration
- Inspired by: Apple M4 product pages, Stripe pricing
- Background: rgba(255,255,255,0.06) + backdrop-filter: blur(20px)
- Border: 1px solid rgba(255,255,255,0.12)
- Glow: box-shadow with category color at 20% opacity on hover
- Icon: gradient icon container matching category accent
- Hover: scale(1.03), glow intensifies, icon lifts slightly
- Animation: spring physics (stiffness: 400, damping: 25)
- Feel: modern, polished, high-end

## Variant C: "Bold Category" — Color-Forward
- Inspired by: Notion icon cards, Raycast extension cards
- Background: category color at 8% opacity
- Border: category color at 30% opacity
- Top bar: full category color at 100%, 4px height
- Icon: large, 48px, category color
- Hover: category color background intensifies to 15%
- Animation: lift (translateY -4px), no scale
- Feel: colorful, fun, clearly differentiated by category
```

---

## Parallel Variant Implementation

```javascript
// Launch all variants simultaneously
const [jobA, jobB, jobC] = await Promise.all([
  startAsyncSubagent({
    taskDescription: `Create Variant A: Linear Dark style ToolCard...`,
    agentType: "DESIGN"
  }),
  startAsyncSubagent({
    taskDescription: `Create Variant B: Glassmorphism Max style ToolCard...`,
    agentType: "DESIGN"
  }),
  startAsyncSubagent({
    taskDescription: `Create Variant C: Bold Category style ToolCard...`,
    agentType: "DESIGN"
  })
]);

// Wait for all to complete
await wait_for_background_tasks({ timeout_seconds: 180 });

// Place on canvas
const canvasState = await get_canvas_state();
// Find empty area, place iframes side by side
```

---

## Canvas Layout for Variants

```
[Variant A Label]  [Variant B Label]  [Variant C Label]
[  iframe A   ]    [  iframe B   ]    [  iframe C   ]
[  400x600    ]    [  400x600    ]    [  400x600    ]

Gap between variants: 40px
Labels: TEXT shapes, 20px above iframe
Position start: (100, 200) or first empty area
```

---

## Rules for This Skill

1. **ALWAYS read existing source code** before writing the brief — use real component code as the starting point, never recreate from memory
2. **NEVER skip the brief** — going straight to implementation defeats the purpose
3. **Use mockup-extract** if the component exists in the main app (extract it first, then create variants)
4. **Keep variants clearly differentiated** — don't create three versions of the same thing with tiny differences
5. **Label everything** — user must be able to tell variants apart without explanation
6. **Present shape IDs** to the user via `presentArtifact` so they can click to open

---

## ISHU TOOLS Variant Ideas (Inspiration)

### ToolCard Variants
- A: Minimal Linear dark — monospace badge, hairline borders
- B: Glassmorphism with category glow — backdrop blur, spring animation
- C: Bold large icon — category-colored icon at 48px, no border

### Hero Section Variants
- A: Centered headline + subtitle + search bar — Apple product page style
- B: Split layout — left text, right animated tool grid — Stripe marketing style
- C: Full-screen gradient with floating tool cards — Awwwards style

### Category Page Header Variants
- A: Full-bleed gradient header with category color
- B: Minimal text-only header with tiny colored badge
- C: Icon-forward large SVG illustration above text

---

## Related Skills
- `design` — DESIGN subagent for individual component work
- `mockup-sandbox` — Creating the preview environment
- `canvas` — Board state and shape placement
- `mockup-extract` — Extracting existing app components onto canvas first
- `mockup-graduate` — Integrating chosen variant into the main app
