# Agent Inbox Skill — Ultra-Detailed Reference

## What It Does
Manages user feedback items submitted through the Replit agent feedback system. When users experience bugs, have feature requests, or submit general feedback, it flows into an inbox that this skill can read, triage, and act on. Keeps the product iteration loop tight — feedback → implementation → resolution.

---

## When to Use
- User says "what feedback has been submitted?" or "check inbox"
- Reviewing bug reports from real users before fixing issues
- Triaging feature requests to decide what to build next
- Before starting a new session — check if there are critical unresolved issues
- After a deployment — check if users reported anything broken

## When NOT to Use
- Creating development tasks (use `project_tasks`)
- Debugging technical errors (use `diagnostics` + `refresh_all_logs`)
- User is submitting new feedback directly in chat (handle it inline)

---

## Available Functions (code_execution sandbox)

### List all inbox items
```javascript
const items = await listInboxItems();
console.log(items);
// Returns array of feedback items:
// [
//   { 
//     id: "abc123",
//     type: "bug" | "feature" | "feedback",
//     title: "compress-pdf not working with 50MB files",
//     body: "Full description...",
//     status: "open" | "in_progress" | "resolved",
//     createdAt: "2026-04-19T10:30:00Z",
//     priority: "high" | "medium" | "low"
//   }
// ]
```

### Read specific item
```javascript
const item = await getInboxItem({ id: "abc123" });
console.log(item.body);  // Full feedback text
```

### Mark as resolved
```javascript
await resolveInboxItem({ id: "abc123" });
```

### Mark as in-progress
```javascript
await updateInboxItem({ id: "abc123", status: "in_progress" });
```

---

## Typical Workflow for ISHU TOOLS

```
1. Start of session → listInboxItems()
   → See: 3 bugs, 5 feature requests, 2 general feedback

2. Triage by priority:
   HIGH: "Video downloader crashes on Instagram Reels"
   MEDIUM: "Add more Indian food to food calorie lookup"
   LOW: "Dark mode toggle request"

3. Fix HIGH bugs immediately
4. Create project tasks for MEDIUM feature requests
5. Mark LOW items as "acknowledged" or future consideration
6. After fixing → resolveInboxItem() to close the loop
```

---

## Feedback Types for ISHU TOOLS

### Bug Reports (Fix immediately if critical)
- Tool returning wrong results
- Server error (500) on specific inputs
- File upload failing
- Video downloader not working
- Slow performance on certain tools
- Mobile layout broken

### Feature Requests (Common from students)
- "Add [new tool]" — log in project tasks
- "Support [new video platform]" — add to handlers
- "Add dark/light mode toggle" — frontend feature
- "Need Hindi language support" — i18n request
- "Calculator for [specific formula]" — math tools

### General Feedback
- "Great tool, helped me!" — positive, no action needed
- "This is better than iLovePDF" — positive signal
- "The site is slow" → investigate performance
- "I couldn't find [tool]" → improve search/discoverability

---

## Prioritization for ISHU TOOLS

```
CRITICAL (fix in same session):
- Any tool returning 500 errors
- File upload completely broken
- App not loading at all

HIGH (fix within 24h):
- Video downloader broken for popular platform
- Wrong calculation results
- Mobile layout unusable

MEDIUM (next sprint):
- New tool requests
- UX improvements
- Performance optimizations

LOW (backlog):
- Nice-to-have features
- Minor visual tweaks
- Additional language support
```

---

## Related Skills
- `project_tasks` — Create formal tasks from high-priority feedback
- `diagnostics` — Investigate technical bug reports
- `deployment` — Check prod logs when bug reports mention "on the live site"
- `web-search` — Research user-requested features before implementing
