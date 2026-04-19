# Skill: product-manager

## Purpose
Functions as an AI Product Manager — creates PRDs (Product Requirements Documents), user stories, roadmaps, sprint planning, OKRs, feature prioritization frameworks, competitive analysis, and product metrics dashboards for software products.

## When to Use
- Need to write a PRD for a new feature
- Need to prioritize features using a structured framework
- Need to create a product roadmap
- Need to define OKRs and KPIs for a product
- Need to write user stories for developers
- Need a go-to-market strategy for a product launch

## Core Deliverables
| Document | Purpose |
|----------|---------|
| PRD | Specification for a feature or product |
| User Stories | "As a [user], I want [feature] so that [benefit]" |
| Product Roadmap | 3/6/12-month plan with themes |
| OKRs | Objectives + Key Results for a quarter |
| Feature Prioritization | MoSCoW, RICE, or ICE scores |
| Go-to-Market Plan | Launch strategy and metrics |
| Metrics Dashboard | KPIs to track product health |

## PRD Template

```
PRODUCT REQUIREMENTS DOCUMENT (PRD)

Title: [Feature Name]
Author: [PM Name]
Version: 1.0
Status: Draft | In Review | Approved
Date: [Date]
Engineers: [Names]
Designer: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PROBLEM STATEMENT
[What problem does this solve? Who has it? How severe is it?]

User quote: "[Quote from actual user feedback/research]"

2. GOALS
Success metrics:
• [Metric 1]: [Current] → [Target] by [Date]
• [Metric 2]: [Current] → [Target] by [Date]

Non-goals (what this feature does NOT solve):
• [Non-goal 1]

3. USER STORIES
Primary user: [User persona]

As a [persona], I want to [action] so that [benefit].

Acceptance criteria:
Given [context], when [action], then [expected result].

4. TECHNICAL REQUIREMENTS
[API endpoints needed]
[Data schema changes]
[Performance requirements: p99 latency < 200ms]
[Scale: must handle X concurrent users]

5. DESIGN REQUIREMENTS
[Link to Figma mockups]
[Responsive requirements]
[Accessibility requirements (WCAG 2.1 AA)]

6. OUT OF SCOPE (for v1)
[Things deliberately left out]

7. TIMELINE
Week 1-2: Design + Review
Week 3-4: Backend development
Week 5: Frontend development
Week 6: QA + Bug fixes
Week 7: Soft launch (10%)
Week 8: Full launch

8. RISKS
[Risk 1] — Mitigation: [How]
[Risk 2] — Mitigation: [How]

9. OPEN QUESTIONS
[Question 1] — Owner: [Name] — Due: [Date]
[Question 2] — Owner: [Name] — Due: [Date]
```

## Feature Prioritization Frameworks

### RICE Framework
```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: How many users/week? (actual number)
Impact: 3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal
Confidence: 100%=certain, 80%=high, 50%=medium
Effort: Person-months (0.5, 1, 2, 3...)

Example:
Feature A: (1000 × 2 × 0.8) / 2 = 800
Feature B: (500 × 3 × 0.5) / 0.5 = 1500 ← Prioritize this
```

### MoSCoW Prioritization
```
MUST HAVE: [Features that are non-negotiable for launch]
SHOULD HAVE: [High-value features if time permits]
COULD HAVE: [Nice-to-haves for future versions]
WON'T HAVE: [Explicitly out of scope for now]
```

## OKR Framework

### ISHU TOOLS OKR Example (Q2 2026)
```
OBJECTIVE: Make ISHU TOOLS the #1 free toolkit for Indian students

Key Result 1: Reach 100,000 monthly active users (currently 30,000)
Key Result 2: Achieve < 3-second page load on mobile (currently 6s)
Key Result 3: 90%+ tool success rate (tools completing without error)
Key Result 4: Rank #1 for "free pdf tools india" on Google
Key Result 5: Launch 50 new tools in 3 new categories
```

## Product Metrics to Track

### Core Metrics (AARRR Pirate Metrics)
```
ACQUISITION:  Users/month, Traffic sources, CAC
ACTIVATION:   First tool completion rate, Time to first value
RETENTION:    DAU/MAU, 7-day retention, 30-day retention
REFERRAL:     Viral coefficient, Social shares
REVENUE:      (If monetizing) ARPU, Conversion rate
```

### Tool-Specific Metrics (ISHU TOOLS)
```
Per Tool:
- Success rate (% completions without error)
- Average processing time
- File size distribution
- Error frequency and types
- Daily/weekly usage count

Overall Platform:
- Total tools per session
- Return visit rate
- Most popular tools (top 10)
- Least used tools (candidate for removal)
- Mobile vs desktop split
```

## User Story Templates

### For ISHU TOOLS Features
```
Feature: PDF Compressor
User Story: 
As an engineering student submitting assignments,
I want to compress my PDF to under 5MB
So that I can upload it to the university portal (which has a 5MB limit)

Acceptance Criteria:
✅ Given a PDF > 5MB, when I compress it, then the output is < 5MB
✅ Given any PDF, the visual quality should not be visibly degraded
✅ Given a file upload, the processing should complete in < 30 seconds
✅ Given processing is complete, I can download with a single click
✅ Given a mobile browser, the experience matches desktop
```

## Go-to-Market Checklist

### Launch Checklist for New Tool
```
PRE-LAUNCH (1 week before):
□ Backend handler tested and working
□ Frontend form fields configured
□ SEO metadata set (title, description, keywords)
□ Tool page screenshot for social sharing
□ Blog post written explaining the tool
□ Social media posts drafted

LAUNCH DAY:
□ Tool goes live at /tools/[slug]
□ Add to homepage "New tools" section
□ Post on Instagram, LinkedIn, Twitter
□ Submit to "What's new" on Product Hunt (optional)
□ Send newsletter to subscribers

POST-LAUNCH (1 week after):
□ Monitor error rate (should be < 5%)
□ Check loading time (should be < 3s on mobile)
□ Read user feedback (if any)
□ Fix bugs from real usage
□ Update SEO based on search queries found in Analytics
```

## Related Skills
- `brainstorming` — ideation for new features
- `design-thinker` — user research and validation
- `competitive-analysis` — market positioning
- `deep-research` — market intelligence
