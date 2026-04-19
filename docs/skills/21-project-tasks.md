# Project Tasks Skill

## What It Does
Creates and manages persistent project tasks that are visible to the user. Tasks are assigned to isolated task agents that work in separate environments and merge their completed work back to the main branch. This is a **Planning mode** feature.

## ONLY USE IN PLAN MODE
This skill is for creating tasks in planning mode. In Build mode, you execute work directly — you don't create project tasks for yourself.

## When to Use (Plan Mode)
- User asks you to plan features or improvements
- Breaking down a large request into parallel workstreams
- Creating tasks that will be done by isolated task agents
- Documenting planned work for user review and approval

## Task File Structure
Tasks are written to `.local/tasks/` as markdown files:

```markdown
# Task: [Title]

## Objective
[Clear description of what needs to be done]

## Acceptance Criteria
- [ ] Specific measurable outcome 1
- [ ] Specific measurable outcome 2

## Technical Details
- Key files to modify: [paths]
- Dependencies: [what this depends on]
- Skills needed: [relevant skills]

## Estimated Effort
[S/M/L — Small/Medium/Large]
```

## Task Lifecycle
1. **Create** — Write task file in `.local/tasks/`
2. **Propose** — Present to user via project_tasks tool
3. **Assign** — User assigns to themselves or a task agent
4. **Execute** — Task agent or main agent does the work
5. **Merge** — Task agent's code merges via PR after user approval
6. **Post-setup** — `post_merge_setup.sh` runs automatically

## Key Rules
- Create ONE task per user request by default
- Only create multiple tasks if goals are clearly independent
- Declare ordering through task dependencies
- Propose immediately — don't wait for one task to finish
- Main agent (you) never creates tasks in Build mode

## Related Skills
- `post_merge_setup` — Runs after task merges
- `delegation` — Local helpers (different from task agents)
