# Brainstorming Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Explores user intent, extracts precise requirements, and explores multiple design/implementation approaches BEFORE writing any code. Prevents the most common agent mistake: building the wrong thing efficiently. This skill intercepts requests for new features, tools, or components and ensures the implementation direction is correct before investing time.

---

## CRITICAL: Activate Before ANY Creative Work

This is not optional. Use this skill before:
- Creating a new tool handler
- Building a new UI component or page
- Adding a new feature to ISHU TOOLS
- Modifying significant behavior
- Writing new content (tool descriptions, SEO copy)

The one exception: simple, clearly-scoped tasks ("fix this typo", "change this color value") don't need brainstorming.

---

## Why Skipping This Is Costly

```
User: "Add a unit converter tool"
Agent jumps to implementation → builds temperature/length converter
User: "I meant currency converter specifically for INR"
Agent: Rewrites the handler

Cost: 2x implementation time + user frustration

vs.

User: "Add a unit converter tool"
Agent brainstorms first: 
  "I see several types of unit converters we could add:
   1. General unit converter (length, mass, temperature, volume)
   2. Currency converter (live rates? or static INR rates?)
   3. Data storage converter (MB/GB/TB)
   Which would you like? And should currency use live exchange rates?"
User: "Currency, yes use live rates, focus on USD, EUR, GBP to INR"
Agent implements: exactly what was asked
Cost: 5 minutes brainstorming → correct implementation first time
```

---

## Brainstorming Process

### Step 1: Understand the Goal
What problem is the user actually trying to solve? What's the underlying need?

```
Surface request: "Add a CGPA calculator"
Underlying need: Indian engineering students need to convert SGPA/CGPA quickly
This reveals: Should support multiple SGPA inputs, different semester credit weights
```

### Step 2: Clarify the Scope
What's in scope, what's out? What are the boundaries?

```
Questions for "Add a food calorie lookup tool":
- Pre-defined food database or user-entered macros?
- Indian foods specifically? (paratha, dal makhani, idli, etc.)
- Show just calories or full macros (protein, carbs, fat)?
- Per-serving or per-100g output?
- Save favorite foods? (requires database)
```

### Step 3: Consider Multiple Approaches
What are 2-3 different ways to implement this?

```
"Add a video downloader" — approaches:
A. yt-dlp Python library (best quality, handles most sites)
B. youtube-dl fallback (older, slower, some sites yt-dlp handles better)
C. External API (rapidapi.com video download API — simpler but costs money)
D. Public API endpoint (fragile, breaks often)

Recommendation: A (yt-dlp) — established, actively maintained, free
```

### Step 4: Identify Dependencies and Risks
What could go wrong? What do we need first?

```
For "Video downloader with playlist support":
Risk 1: YouTube rate limits yt-dlp requests — need retry logic
Risk 2: Long playlists timeout FastAPI request — need background tasks
Risk 3: Storage: where do we put the downloaded file? — need temp file cleanup
Dependency: yt-dlp must be installed (package-management skill)
```

### Step 5: Define Done
What does the completed feature look like?

```
"Done" for video downloader means:
✓ User pastes YouTube URL → gets MP4 download
✓ User pastes Instagram URL → gets video download  
✓ Error message if URL is unsupported
✓ Progress indicator while processing
✓ File automatically cleaned up after download
✓ No crash on invalid URL
```

---

## Questions by Feature Type

### For new backend tools
1. What input does the tool accept? (text, file, URL, numbers)
2. What should the output be? (text, file download, JSON, table)
3. Are there quality or accuracy requirements?
4. What happens with invalid/edge case inputs?
5. Any Indian-specific considerations? (INR currency, Indian food, CGPA system)
6. Should it work offline or does it call external APIs?

### For UI components
1. Where does this component appear? (homepage, tool page, category page)
2. What data does it show?
3. What interactions are needed? (click, hover, drag, select)
4. Desktop and mobile or desktop only?
5. Any reference sites to match?

### For SEO improvements
1. Which pages/tools should be prioritized?
2. What keywords are we targeting?
3. Is this for Google ranking or social sharing (OG)?
4. Do we need structured data (JSON-LD) or is it already there?

### For performance improvements
1. What's currently slow? (measured or perceived?)
2. On what device/connection is it slow?
3. Is it load time, interaction lag, or animation jank?
4. What's the target metric?

---

## ISHU TOOLS Specific Brainstorming Examples

### "Add more student tools"
```
Brainstorm questions:
1. Which student types? (engineering, medical, law, arts, commerce?)
2. Indian university specific? (CBSE, JEE, GATE, NEET?)
3. Academic or daily life tools?
4. Examples: CGPA/SGPA ✓, attendance calc ✓, study timer, flashcards, 
   timetable builder, citation generator, plagiarism checker?
5. Should they work offline (PWA) or need internet?
```

### "Make the homepage better"
```
Brainstorm questions:
1. What's the current problem? (too many items? hard to find tools? slow?)
2. Who are we optimizing for? (student on mobile? desktop power user?)
3. What metric defines "better"? (time to find tool? bounce rate?)
4. Design references? (comparison: iLovePDF vs Smallpdf vs tools.fun?)
5. Any specific sections that feel wrong?
```

---

## When NOT to Brainstorm
- Fixing a specific bug (just fix it)
- Simple text/color changes
- Adding a tool the user described in complete detail
- Urgent production fixes
- Requests the user made very specifically

---

## Related Skills
- `design-exploration` — After brainstorming UI, explore design variants
- `project_tasks` — For larger features that need formal task planning
- `follow-up-tasks` — For suggesting related improvements after implementation
