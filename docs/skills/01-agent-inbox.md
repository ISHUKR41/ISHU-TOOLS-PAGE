# Agent Inbox Skill

## What It Does
Manages user feedback items submitted via the Replit Agent feedback system. Allows the agent to list, read, and respond to bug reports, feature requests, and general feedback from users.

## When to Use
- User asks about pending feedback or bug reports
- Need to review feature requests submitted by users
- Managing inbox items, marking them resolved
- Checking what users have reported as broken or needed

## Key Capabilities
- List all pending feedback items with priority/status
- Read full details of any specific feedback item
- Mark items as resolved or in-progress
- Filter by type: bug reports, feature requests, general feedback
- Track feedback across sessions

## Usage Notes
- Available as a pre-registered callback in the code execution sandbox
- Returns structured data with feedback item IDs, types, and content
- Useful for product iteration and quality assurance

## Example Workflow
1. User says "what feedback has been submitted?"
2. Call `listInboxItems()` to get all pending items
3. Present summary to user with counts by type
4. Read specific items with `getInboxItem(id)`
5. Mark resolved with `resolveInboxItem(id)`

## Related Skills
- `project_tasks` — for creating tasks from feedback
- `diagnostics` — for investigating bug reports
