# Delegation Skill — Ultra-Detailed Reference

## What It Does
Enables the main agent to delegate focused tasks to specialized local subagents that run **in the same Replit environment**. Subagents are helpers — they share your files, your packages, your working directory. They are NOT isolated agents (those are `project_tasks`).

Use delegation to:
- Parallelize independent work (e.g., design + backend simultaneously)
- Invoke the DESIGN subagent for specialized UI/animation work
- Run focused, deep tasks while the main agent handles other things
- Break large implementations into concurrent workstreams

---

## Key Distinction: Local Subagents vs Task Agents

| Aspect | Local Subagents (Delegation) | Task Agents (project_tasks) |
|---|---|---|
| Environment | Same as main agent | Completely isolated container |
| Files | Shares your files | Separate copy of codebase |
| State | Ephemeral — runs and returns | Persistent — creates branch, merges via PR |
| Initiation | You call them, they work for you | User assigns, Replit manages |
| Mode | Build mode only | Plan mode only |
| Use case | UI work, parallel tasks | Large independent features |

**Never confuse these.** Delegation is you calling a helper. Project tasks are user-assigned work in isolated environments.

---

## Available Subagent Types

### DESIGN Subagent
Specialized for frontend UI/UX work. Has deep knowledge of:
- React component architecture
- CSS animations and transitions  
- Tailwind CSS utility patterns
- Framer Motion animations
- Responsive design patterns
- Design inspiration (Apple, Stripe, Awwwards, Lusion, Cuberto)
- Color theory and typography

Use for: designing new pages, creating components, animation systems, layout work.

### General Subagent
Handles any focused task with full access to all tools.

---

## Available Functions

### `subagent` — Synchronous (blocks until done)
```javascript
// Wait for the subagent to finish before continuing
const result = await subagent({
  taskDescription: `
    Design the ToolPage hero section for ISHU TOOLS.
    
    Requirements:
    - Glassmorphism card with category color accent
    - Tool title as H1 (for SEO)
    - Short description text
    - Animated gradient background
    - Files: frontend/src/features/tool/ToolPage.tsx
    - Reference: https://smallpdf.com design aesthetic
    - Category colors are in: frontend/src/lib/toolPresentation.ts
  `,
  agentType: "DESIGN"
});
console.log(result);
```

### `startAsyncSubagent` — Asynchronous (returns immediately)
```javascript
// Launch and continue working — don't wait
const jobId = await startAsyncSubagent({
  taskDescription: "Create the animated ToolCard component with hover effects...",
  agentType: "DESIGN"
});
// Do other work here...
// Then wait when ready:
await wait_for_background_tasks({ timeout_seconds: 120 });
```

### `messageSubagent` — Send follow-up (fire-and-forget)
```javascript
await messageSubagent({
  jobId: "the-job-id",
  message: "Also make the card responsive — it should stack vertically below 768px"
});
```

### `messageSubagentAndGetResponse` — Send follow-up + wait for answer
```javascript
const answer = await messageSubagentAndGetResponse({
  jobId: "the-job-id",
  message: "What color did you use for the science-tools category?"
});
console.log(answer);
```

---

## When to Use Delegation for ISHU TOOLS

### Use DESIGN subagent for:
- Designing a new category page (geography-tools, cooking-tools, science-tools)
- Redesigning ToolCard with more visual richness
- Creating the mobile navigation menu
- Building the animated hero section
- Designing tool result display components (JSON viewer, table renderer)
- PWA install prompt UI
- Dark mode refinement

### Use async parallel subagents for:
- UI design (DESIGN) + backend handler (main) running simultaneously
- Multiple category pages designed at once
- Frontend + documentation updates in parallel

---

## Task Description Best Practices

A good task description includes:
1. **Goal** — What to build, in 1-2 sentences
2. **Requirements** — Specific functional requirements
3. **Files** — Which files to edit/create
4. **Design references** — URLs, screenshots, color systems
5. **Constraints** — "Don't change the API signature", "Keep Tailwind only"
6. **Context** — Current state, what's already there

```javascript
const result = await subagent({
  taskDescription: `
    TASK: Build the CategoryPage component for ISHU TOOLS
    
    GOAL: Create a dedicated page for each tool category showing all tools in that category
    with a rich header, search filter, and animated tool grid.
    
    REQUIREMENTS:
    - Route: /category/:categoryId
    - Header: Category title, icon, description, tool count badge
    - Tool grid: Responsive (1-2-3-4 columns), animated on scroll
    - Search: Filter tools within the category by name/tag
    - Category colors from: frontend/src/lib/toolPresentation.ts CATEGORY_THEME_MAP
    - Breadcrumb: Home → Category Name
    - Empty state: "No tools found" with search clear button
    
    FILES TO EDIT:
    - frontend/src/features/category/CategoryPage.tsx (create)
    - frontend/src/App.tsx (add route)
    
    DESIGN REFERENCE:
    - Match overall ISHU TOOLS aesthetic (glassmorphism, dark theme)
    - Category accent color should theme the entire page header
    - Framer Motion for staggered card entrance
    
    CONSTRAINTS:
    - Use existing ToolCard component — don't redesign it
    - Keep TypeScript strict — no 'any' types
    - Use React Router's useParams for categoryId
  `,
  agentType: "DESIGN"
});
```

---

## Parallel Work Pattern

For maximum efficiency when doing UI + backend simultaneously:

```javascript
// Launch DESIGN subagent for UI work
const designJobId = await startAsyncSubagent({
  taskDescription: "Design the new science-tools category page...",
  agentType: "DESIGN"
});

// Main agent handles backend while DESIGN works
// (add handlers, update registry, etc.)

// Wait for DESIGN to finish
await wait_for_background_tasks({ timeout_seconds: 180 });

// Review DESIGN's work and integrate
```

---

## Common Mistakes

```javascript
// ❌ Vague task description — subagent won't know what to do
await subagent({ taskDescription: "Make the UI better" })

// ✓ Specific with context, files, and requirements
await subagent({ 
  taskDescription: "Improve the ToolCard hover state: add a 2px accent-colored border, scale to 1.02, add a subtle glow shadow. Files: frontend/src/features/home/components/ToolCard.tsx. Current state: has a basic box shadow on hover."
})

// ❌ Using delegation when project_tasks is correct
// (Don't delegate a multi-week feature — use project_tasks)

// ❌ Forgetting to wait for async subagent before using its output
const jobId = await startAsyncSubagent({ ... })
// Immediately reading files DESIGN is writing → race condition
// Use wait_for_background_tasks first
```

---

## Related Skills
- `design` — DESIGN subagent detailed guide
- `project_tasks` — For isolated task agents (completely different system)
- `design-exploration` — Generating multiple design variants in parallel
