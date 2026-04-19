# Skill Authoring Skill — Ultra-Detailed Reference

## What It Does
Creates new reusable agent skills — stored as `SKILL.md` files in `.local/skills/[name]/` — that teach the agent specialized workflows, conventions, and capabilities that persist across all future sessions. When the user says "remember how to do X" or "create a skill that always does Y", this is the mechanism.

---

## When to Create a Skill

Create a skill when:
- A workflow is complex enough that rediscovering it every session wastes time
- The user says "always do it this way" or "remember this pattern"
- A task has project-specific conventions that aren't obvious
- You've discovered a set of patterns that would be valuable to codify

**For ISHU TOOLS, good skill candidates:**
- "How to add a new backend handler" (the exact pattern: registry.py + handlers.py + toolFields.ts + seoData.ts)
- "ISHU TOOLS design language" (colors, typography, animation system)
- "How to add a new tool category" (registry + frontend color + category page)

---

## Skill File Structure

```
.local/skills/
└── my-skill-name/
    ├── SKILL.md           # Main skill instructions (required)
    ├── templates/         # Code templates (optional)
    │   ├── handler.py.tmpl
    │   └── registry-entry.ts.tmpl
    └── scripts/           # Helper scripts (optional)
        └── validate.sh
```

The `SKILL.md` is the only required file.

---

## SKILL.md Format

```markdown
---
name: skill-name-kebab-case
description: One sentence that clearly describes what this skill does and when 
             to use it. Include 3-5 trigger keywords in the description.
---

# Skill Display Name

## What It Does
[2-3 sentences: what this skill enables. Be specific.]

## When to Use
- [Specific trigger condition 1]
- [Specific trigger condition 2]
- [Phrase users might say that should activate this skill]

## Key Capabilities
[What can be accomplished. Be concrete.]

## Step-by-Step Usage
[Numbered steps for the primary workflow]

## Code Examples
[Real, working code examples with comments]

## Common Mistakes to Avoid
[Pitfalls that are easy to fall into]

## Related Skills
- `other-skill` — How it relates
```

---

## Writing a Great Description (Critical for Skill Matching)

The `description` in the YAML frontmatter is how the agent decides whether this skill is relevant. Bad descriptions lead to the skill never being activated.

```yaml
# ❌ BAD — too vague, no trigger keywords
description: Helps with coding

# ❌ BAD — too broad
description: Authentication and security

# ✓ GOOD — specific action + trigger keywords
description: Add new tool handlers to ISHU TOOLS. Use when creating backend handlers, 
             adding to registry.py, updating toolFields.ts, or extending the tool catalog.

# ✓ GOOD — includes what user might say
description: Configure ISHU TOOLS category system. Triggers on tasks involving new 
             categories, category colors, toolPresentation.ts, or adding a new tool type.
```

---

## ISHU TOOLS-Specific Skills to Create

### Skill 1: ISHU TOOLS Handler Pattern
```markdown
---
name: ishu-handler-pattern
description: Add new tool handlers to ISHU TOOLS backend. Use when adding new tools,
             creating handlers, updating registry.py, or extending the tool catalog.
             Covers the complete flow: handler → registry → toolFields → seoData.
---

# ISHU TOOLS Handler Pattern

## Complete Checklist for Adding a New Tool
1. Add handler function to appropriate handlers file (or create new one)
2. Register in HANDLERS dict
3. Add ToolDefinition to registry.py TOOLS list
4. Add form fields to toolFields.ts TOOL_FIELDS object
5. Category color in toolPresentation.ts CATEGORY_THEME_MAP (if new category)
6. Add ToolCategory to registry.py CATEGORIES list (if new category)
7. Restart Backend API workflow → verify handler count in logs
```

### Skill 2: ISHU TOOLS Design System
```markdown
---
name: ishu-design-system
description: ISHU TOOLS visual design language. Use when designing components,
             picking colors, writing CSS, or working on UI. Contains all design
             tokens, category colors, animation specs, and typography system.
---

# ISHU TOOLS Design System
[All the design tokens, colors, animations]
```

---

## Creating a Skill via code_execution

```javascript
// The skill-authoring skill provides createSkill function
const skill = await createSkill({
  name: "ishu-handler-pattern",
  description: "Add new tool handlers to ISHU TOOLS backend...",
  content: `
---
name: ishu-handler-pattern
description: Add new tool handlers...
---

# ISHU TOOLS Handler Pattern

## Steps
1. Create handler function
2. Add to registry...
  `
});
console.log(`Skill created: ${skill.path}`);
```

Or write the file directly:
```javascript
writeFile(".local/skills/ishu-handler-pattern/SKILL.md", content);
```

---

## Skill Quality Guidelines

A high-quality skill:
1. **Activates at the right time** — description has precise trigger words
2. **Contains real examples** — not pseudocode, but working code
3. **Lists common mistakes** — saves time on future debugging
4. **Stays current** — update when patterns change (e.g., new file structure)
5. **Is focused** — one skill per distinct workflow, not a mega-document

---

## Updating Existing Skills

When the project evolves (new files added, patterns change):
```javascript
// Read current skill
const current = readFile(".local/skills/ishu-handler-pattern/SKILL.md");
// Update with new information
writeFile(".local/skills/ishu-handler-pattern/SKILL.md", updatedContent);
```

---

## Related Skills
- `skill-creator` — User-provided skill for advanced skill creation and evaluation
- `find-skills` — Discovering existing skills before creating duplicates
