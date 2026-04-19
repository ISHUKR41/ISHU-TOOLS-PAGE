# Follow-Up Tasks Skill

## What It Does
Helps propose natural follow-up tasks to the user before marking the current task complete. Ensures users know about logical next steps, related improvements, or outstanding work that could enhance their project.

## When to Use
- After completing a significant feature implementation
- When you notice related improvements while working
- Before ending a task session
- When the user's request implies a broader goal that wasn't fully addressed

## How It Works
1. As you complete your main task, note potential follow-ups
2. Before finishing, use this skill to propose 1-3 relevant follow-up tasks
3. Present them as optional suggestions, not blockers
4. Allow user to choose which ones to pursue

## Good Follow-Up Patterns
- "I've added the video downloader. Want me to also add **playlist support** and **audio extraction**?"
- "The homepage is updated. Want me to also **update the footer** and **sitemap**?"
- "SEO is improved for PDF tools. Want me to **add SEO for all 600+ tools** systematically?"

## Example Output Format
```
✅ Completed: [main task]

Suggested follow-ups:
1. [Related improvement] — would take ~X minutes
2. [Optional enhancement] — builds on what was just done
3. [Performance optimization] — would improve [specific metric]

Would you like me to continue with any of these?
```

## Rules
- Only propose truly relevant follow-ups — not unrelated busywork
- Be specific about what each follow-up entails
- Give rough effort estimates when helpful
- Don't propose more than 3-4 follow-ups at once

## Related Skills
- `project_tasks` — For larger follow-ups that should be tracked as formal tasks
- `brainstorming` — For exploring what follow-ups could be valuable
