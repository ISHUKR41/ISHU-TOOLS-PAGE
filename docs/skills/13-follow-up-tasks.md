# Follow-Up Tasks Skill — Ultra-Detailed Reference

## What It Does
Ensures that when a task is complete, the user is made aware of logical next steps, related improvements, and adjacent work that would build on what was just done. This creates a natural product iteration loop: complete → reflect → suggest → user chooses → continue.

**Use this before ending every significant task.** Don't just deliver the feature and stop — think about what a senior engineer would naturally say next.

---

## When to Use

- After implementing a new tool category (suggest adding more tools in that category)
- After fixing a bug (suggest adding tests, documenting the fix, checking for related bugs)
- After a UI improvement (suggest applying the same improvement to related components)
- After adding SEO for some tools (suggest doing all tools systematically)
- After a backend optimization (suggest similar optimizations in related handlers)
- Before saying "done" — always do a mental pass: "what would I naturally do next?"

## When NOT to Use
- For tiny one-line fixes — don't pad the response with unnecessary suggestions
- When the user explicitly said "just do X, nothing else"
- When there are critical errors that still need fixing first

---

## Good vs Bad Follow-Up Suggestions

### GOOD — Specific, actionable, clearly related
```
✅ "I've added 46 mega handlers (science, geography, cooking). 
   Want me to also:
   1. Add dedicated category pages for Science, Geography, and Cooking?
   2. Update the sitemap.xml with the 80+ new tool URLs?
   3. Write meta descriptions for the new video downloader tools?
```

### BAD — Vague, unrelated, or overwhelming
```
❌ "Want me to add more features?"
❌ "I can improve the code quality"
❌ [Lists 15 suggestions — user can't process this]
```

---

## Follow-Up Categories for ISHU TOOLS

### After adding new tools
- Update sitemap.xml with new tool URLs
- Add SEO meta descriptions for new tools
- Add the new category to the homepage grid
- Add new tool icons (if needed)
- Test all new tool handlers end-to-end

### After a backend change
- Restart + verify handler count in logs
- Test the changed handler with real input
- Check if related handlers need the same fix
- Update error handling patterns

### After a frontend UI change
- Apply the same change to mobile breakpoints
- Check the change at 375px, 768px, 1280px, 1920px widths
- Verify animations work (no jank) on the change
- Update the relevant Storybook/mockup if one exists

### After a performance improvement
- Run Lighthouse before + after to measure impact
- Apply the same technique to other slow pages
- Check Core Web Vitals impact (LCP, FID, CLS)

### After SEO improvements
- Submit updated sitemap to Google Search Console
- Check if schema markup (JSON-LD) is still valid
- Verify OG images for social sharing are correct

---

## Output Format (Use This Structure)

```
✅ Completed: [What was done — be specific]

Suggested next steps:
1. [Most impactful follow-up] — [why it matters, ~effort estimate]
2. [Second follow-up] — [why it matters]  
3. [Third optional follow-up] — [why it matters]

Would you like me to continue with any of these?
```

---

## ISHU TOOLS Session Follow-Up Examples

After completing today's session (mega handlers + skill docs):

```
✅ Completed:
- 694 total handlers loaded (46 new: science/geo/cooking/video/student)
- toolFields.ts updated with form fields for all 45+ new tools
- toolPresentation.ts updated with science/geography/cooking color themes
- registry.py updated with new ToolCategory definitions
- 48 skill docs expanded to ultra-detailed reference quality

Suggested next steps:
1. Create dedicated category pages for Science, Geography, and Cooking tools
   — Currently these tools exist but have no dedicated browsing page
   
2. Update sitemap.xml with 80+ new tool URLs
   — New tools are invisible to Google without sitemap entries

3. Add the 3 new categories to the homepage category grid
   — Science (#38bdf8), Geography (#4ade80), Cooking (#fb923c) visually visible
   
4. Build the "Category of the Day" widget for the hero section
   — Highlights a different tool category daily, good for engagement

Would you like me to continue with any of these?
```

---

## Effort Estimation Guide

| Label | Rough Time |
|---|---|
| "~5 min" | A few line edits |
| "~15 min" | Single file change or small addition |
| "~30 min" | New component or moderate feature |
| "~1 hour" | New page or significant backend work |
| "~2-3 hours" | Large feature (new tool category, redesign) |
| "~half day" | Major system change (auth, payments, i18n) |

---

## Related Skills
- `project_tasks` — For follow-ups that are large enough to be formal tracked tasks
- `brainstorming` — For exploring what the best follow-ups could be
- `agent-inbox` — Check inbox for user-requested follow-ups before suggesting your own
