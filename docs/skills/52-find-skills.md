# Find Skills Skill — Discover & Install Agent Skills

## What It Does
Helps users and agents discover available skills when they ask "how do I do X" or "is there a skill for...". Searches the skills catalog and returns matching skills with installation instructions.

---

## Activation Triggers
- "How do I do X?" (where X might require a skill)
- "Find a skill for..."
- "Is there a skill that can...?"
- "I want to extend the agent's capabilities"
- "Can the agent do X?" / "Does the agent know how to...?"

---

## How to Use

### JavaScript: skillSearch() in code_execution
```javascript
// Search for a skill by keyword
const results = await skillSearch("pdf processing");
console.log(results);

// Returns: [{name, path, description}, ...]
```

### Bash: Browse available skills
```bash
# List Replit-provided skills
ls .local/skills/

# List user-provided skills
ls .agents/skills/

# List secondary skills
ls .local/secondary_skills/
```

---

## Skills Discovery by Category

| Need | Search Query |
|---|---|
| AI/ML capabilities | "ai image generation" or "inference" |
| Payments | "stripe" or "revenuecat" |
| Authentication | "better auth" or "auth" |
| Database | "database" or "sql" |
| SEO | "seo" or "search engine" |
| UI Design | "design" or "ui ux" |
| Video | "video" or "remotion" |
| PDF | "pdf" |
| Browser automation | "browser" |
| Marketing copy | "copywriting" |
| Presentations | "slides" or "pptx" |

---

## Installing a Found Skill
Skills are already installed and available — just read the SKILL.md file to activate them:

```bash
# Read a skill's full documentation
cat .local/skills/SKILL_NAME/SKILL.md
# or
cat .agents/skills/SKILL_NAME/SKILL.md
# or
cat .local/secondary_skills/SKILL_NAME/SKILL.md
```

---

## Tips
- Always call `skillSearch()` before concluding a capability doesn't exist
- Secondary skills (40+) cover specialized domains: resume, meal planning, stock analysis, etc.
- New skills can be created with the `skill-authoring` or `skill-creator` skill
