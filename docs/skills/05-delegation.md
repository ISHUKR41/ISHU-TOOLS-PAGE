# Delegation Skill

## What It Does
Enables the main agent to delegate tasks to specialized subagents that run in the same environment. Subagents are local helpers — they are NOT isolated task agents (those come from `project_tasks`).

## When to Use
- A task requires specialized expertise (DESIGN subagent for UI work)
- Breaking a large task into parallel workstreams for speed
- Offloading focused subtasks while continuing main work
- Complex implementations that benefit from a dedicated context

## Subagent Types Available
- **DESIGN** — Specialized for frontend UI/UX work, animations, styling
- **ANALYSIS** — For deep code analysis and architecture review
- General purpose subagents for any focused task

## Key Functions
```javascript
// Synchronous: wait for result
const result = await subagent({ taskDescription: "...", agentType: "DESIGN" });

// Asynchronous: start and continue
const jobId = await startAsyncSubagent({ taskDescription: "..." });

// Follow-up to running subagent
await messageSubagent({ jobId, message: "..." });

// Follow-up and wait for response
const reply = await messageSubagentAndGetResponse({ jobId, message: "..." });
```

## Important Distinctions
| Local Subagents (Delegation) | Task Agents (project_tasks) |
|---|---|
| Same environment | Isolated environment |
| Immediate, ephemeral | Persistent, merged via PR |
| Your local helpers | User-assigned separate work |
| Available in Build mode | Available in Plan mode |

## Best Practices
1. Use DESIGN subagent for CSS/component work — it has specialized prompting
2. For parallel work, launch async subagents and wait with `wait_for_background_tasks`
3. Pass clear, scoped task descriptions — avoid ambiguous instructions
4. Share key file paths and context in the task description

## Related Skills
- `design` — DESIGN subagent specifically for UI/frontend work
- `project_tasks` — For isolated task agents (different system)
