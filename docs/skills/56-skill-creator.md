# Skill Creator Skill — Create, Improve & Benchmark Agent Skills

## What It Does
Creates new skills from scratch, modifies and improves existing skills, runs evaluations to test skill performance, benchmarks with variance analysis, and optimizes skill descriptions for better trigger accuracy.

---

## Activation Triggers
- "Create a skill from scratch"
- "Make a new skill for..."
- "Edit / optimize this skill"
- "Teach the agent how to..."
- "Save these instructions as a skill"
- "Run evals on a skill"
- "Benchmark this skill"
- "Improve skill trigger accuracy"

---

## Skill File Structure

```
.agents/skills/my-skill/
├── SKILL.md           # Main skill instructions (REQUIRED)
├── examples/          # Optional: examples directory
│   └── example1.md
└── assets/            # Optional: additional files
```

---

## SKILL.md Front Matter

```yaml
---
name: my-skill-name
description: One-line description used for skill discovery/matching (critical — affects trigger accuracy)
metadata:
  version: 1.0.0
  author: Ishu Kumar
---
```

---

## Writing a Good SKILL.md

```markdown
# My Skill Name — Short Description

## What It Does
2-3 sentence overview of what this skill enables.

## Activation Triggers
- "phrase 1" / "phrase 2" (exact phrases that should trigger this skill)
- Scenarios where this skill is relevant

## When to Use
| Scenario | Use? |
|---|---|
| [scenario] | YES / NO |

## Step-by-Step Instructions
Numbered steps with code examples where relevant.

## Examples
### Example 1: [Common use case]
[Input] → [Action] → [Output]

## Tips & Gotchas
- Important notes
- Common mistakes to avoid
```

---

## Evaluating a Skill

### What to Eval
1. **Trigger accuracy** — Does it fire when it should?
2. **Output quality** — Does it produce correct results?
3. **Edge cases** — Does it handle bad inputs gracefully?

### Eval Process
```
1. Define test cases (input prompt → expected behavior)
2. Run 5-10 examples per test case
3. Score: trigger rate, output quality, consistency
4. Iterate on SKILL.md based on failures
```

---

## Improving Trigger Accuracy

### In the `description` field:
- Include exact phrases users say: "when user asks to...", "when user says..."
- Include synonyms: "create / build / make / generate"
- Include domain terms: "invoice / bill / receipt"

### In the `## Activation Triggers` section:
- List specific phrases verbatim
- Include negative examples ("NOT when user wants to...")

---

## Where Skills Live
- Replit-provided: `.local/skills/`
- User-created: `.agents/skills/`
- Secondary skills: `.local/secondary_skills/`

---

## Tips
- Keep SKILL.md focused — one skill per file
- Include code examples for all technical operations
- Update version in metadata when making significant changes
- Document limitations explicitly to prevent over-use
