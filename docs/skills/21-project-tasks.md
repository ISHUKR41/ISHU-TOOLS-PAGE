# Project Tasks Skill — Ultra-Detailed Reference

## What It Does
Creates and manages persistent, user-visible project tasks. Each task is assigned to an **isolated task agent** that works in its own separate environment (with its own copy of the codebase). When the task is complete, the user reviews the work and approves a merge PR. This system is for **Planning mode only** — it's how the main agent breaks large requests into structured, parallelizable work packages.

---

## CRITICAL: Plan Mode Only

This skill is for **Planning mode** only. In Build mode, you do the work directly — you never create project tasks for yourself.

```
Plan Mode → Create tasks → User assigns → Task agents do work → Merge
Build Mode → Do the work directly → Don't create project tasks
```

---

## When to Create a Project Task

Create a formal task when:
- The user explicitly asks you to "plan" something
- The work is large enough that it benefits from isolation (> ~2 hours of work)
- The work can be parallelized with other independent work
- The feature needs to be reviewed separately before merging
- Multiple logical units of work exist (separate concerns, separate files)

Don't create a task when:
- You're in Build mode — just do the work
- The request is a quick fix (< 30 minutes) — do it directly
- The work is tightly coupled to something you're currently doing

---

## Task File Structure

Tasks live in `.local/tasks/` as markdown files:

```markdown
# Task: Add Science Tools Category Page

## Objective
Create a dedicated /category/science-tools page that shows all science tools 
(element-lookup, molecular-weight, physics-calculator) with a rich category header 
and search filter.

## Acceptance Criteria
- [ ] Route /category/science-tools renders a page
- [ ] Page shows all 3 science tools in a grid
- [ ] Header shows category name, icon, color (#38bdf8), and tool count
- [ ] Search/filter works within the category
- [ ] Mobile responsive (1→2→3 col grid)
- [ ] Breadcrumb: Home → Science Tools
- [ ] No TypeScript errors

## Technical Details
Key files to create/modify:
- `frontend/src/features/category/CategoryPage.tsx` (new)
- `frontend/src/App.tsx` (add route)

Key data sources:
- Category themes: `frontend/src/lib/toolPresentation.ts`
- Tool list from API: `GET /api/registry/tools?category=science-tools`

Dependencies:
- Requires T001 (science tools registry entries) to be merged first

## Skills Needed
- react-vite (component structure)
- design (DESIGN subagent for visual polish)

## Estimated Effort: Medium (~2 hours)
```

---

## Creating Tasks (Plan Mode)

```javascript
// In the code_execution sandbox during Plan mode
await createProjectTask({
  title: "Add Science Tools Category Page",
  description: "...",  // Full task description as above
  priority: "high",    // "critical" | "high" | "medium" | "low"
  dependencies: ["T001"],  // Other task IDs this depends on
});
```

---

## Task Lifecycle

```
Main Agent (Plan Mode) creates task file
              ↓
Proposes to user via project_tasks tool
              ↓
User assigns to: "Me" (main agent) OR "Task Agent" (isolated)
              ↓
         ┌────┴────────────────────┐
         │                        │
    Main Agent              Task Agent
    (Build mode)           (Isolated env)
    Do the work            Works in own copy
         │                        │
         ↓                        ↓
   Complete inline          PR ready for review
                                  │
                            User approves merge
                                  │
                            Code merges to main
                                  │
                         post_merge_setup.sh runs
```

---

## Task Dependency Rules

```
Independent tasks → Can run in parallel
Dependent tasks → Must run in sequence

Example:
  T001: Add science tools to registry.py [no deps]
  T002: Build science tools category page [depends on T001]
  T003: Update sitemap.xml with new tool URLs [depends on T001]
  T004: Write content for science tool landing pages [depends on T001]

T001 → T002, T003, T004 all blocked
T002, T003, T004 → can run in parallel after T001 merges
```

---

## How Many Tasks to Create

**Default: ONE task per user request.** Only create multiple tasks when:
- Goals are clearly independent (different parts of codebase, different feature sets)
- Parallel execution would save significant time
- Dependencies between tasks are clean and clear

```
❌ Wrong: Creating 8 tasks for "improve SEO" — just do it inline in Build mode
✓ Right: 1 task for "Add Science Tools page" + 1 task for "Add Geography Tools page" (independent)
```

---

## ISHU TOOLS Typical Task Scenarios

### Large enough for project task:
- "Build a full PWA offline experience" — needs service worker, caching strategy, offline UI
- "Add user accounts with auth" — needs DB schema, auth endpoints, protected routes, profile UI
- "Add payment tiers" — needs Stripe integration, pricing page, feature gating
- "Build a tool recommendation engine" — needs ML model, API endpoint, UI widget

### Too small — just do it in Build mode:
- "Add 5 new math tools"
- "Fix the mobile menu"
- "Update OG image"
- "Add 20 tools to registry.py"

---

## Task Communication to User

When proposing tasks in Plan mode, communicate:
1. What the task does (plain language — user may not be technical)
2. Why it's separated (dependency, isolation, or size)
3. Rough timeline estimate
4. Which tasks depend on each other

```
I've planned 2 tasks for the Science + Geography tool expansion:

**Task 1:** Add science/geography tools to registry + backend handlers
  - This creates the foundation — tools exist in the system
  - ~1 hour of work

**Task 2:** Build dedicated category pages for Science and Geography
  - This creates the browsing UI for the new tools
  - Depends on Task 1 (needs the tools to be in the registry)
  - ~2 hours of work

Tasks can be assigned to you or run by separate background agents.
Want me to create these tasks?
```

---

## Related Skills
- `post_merge_setup` — Runs automatically after each task merge
- `delegation` — Local helpers (completely different from task agents — don't confuse)
- `follow-up-tasks` — Suggesting follow-ups after completing work in Build mode
