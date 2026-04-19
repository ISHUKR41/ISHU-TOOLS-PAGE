# Skill Authoring Skill

## What It Does
Creates reusable agent skills — `.local/skills/[name]/SKILL.md` files — that teach the agent new capabilities, workflows, or domain-specific knowledge. These skills persist across sessions and become part of the agent's toolkit.

## When to Use
- User says "remember how to do X" or "create a skill for Y"
- You discover a reusable workflow that should be formalized
- Documenting project-specific conventions for future sessions
- User wants the agent to always follow certain patterns

## Skill File Structure
```
.local/skills/[skill-name]/
├── SKILL.md          # Main skill instructions
├── scripts/          # Any helper scripts
└── templates/        # Reusable code templates
```

## SKILL.md Format
```markdown
---
name: skill-name
description: One-line description of what this skill does. 
             Should be specific enough for the agent to know when to use it.
---

# Skill Name

## What It Does
[Detailed description]

## When to Use
[Trigger conditions — when should this be activated?]

## Key Capabilities
[What can be done with this skill]

## Usage Notes
[Important constraints, gotchas, examples]
```

## Writing Good Skill Descriptions
The `description` in the frontmatter is crucial — it's used for skill matching:
- Be specific: "Configure Better Auth server and client" not just "authentication"
- Include trigger keywords: "betterauth", "auth.ts", "OAuth"
- Describe the ACTION, not just the topic

## Examples of Good Skills to Create for ISHU TOOLS
1. "Tool Handler Pattern" — how to add new tools to the backend
2. "Registry Entry Format" — exact format for registry.py entries
3. "SEO Data Format" — how to add tool-specific SEO data
4. "Category Theme" — how to add new category colors/themes

## Related Skills
- `skill-creator` — User-provided skill for creating/evaluating skills
- `find-skills` — Discovering existing skills
