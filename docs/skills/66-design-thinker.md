# Skill: design-thinker

## Purpose
Applies Stanford Design Thinking methodology to problem-solving — conducting empathy mapping, defining problem statements, ideating solutions, creating prototypes, and planning user testing. Used for product, service, and UX design challenges.

## When to Use
- Starting a new product and need to validate the problem
- Need to understand users' needs, motivations, and pain points
- Stuck on a design problem and need creative ideation
- Need a user research plan (surveys, interviews, usability tests)
- Need a prototype specification for a UI/UX flow
- Need to reframe a business problem as a user problem

## The 5 Stages Framework
```
1. EMPATHIZE → Understand the user
2. DEFINE → Frame the problem
3. IDEATE → Generate solutions
4. PROTOTYPE → Build to test
5. TEST → Learn and iterate
```

## Stage 1: Empathize

### Empathy Map Template
```
                    ┌─────────────────┐
                    │      SAYS       │
                    │  (Quotes/words) │
                    └────────┬────────┘
         ┌──────────┐        │        ┌──────────┐
         │  THINKS  │   USER │   U    │   DOES   │
         │(beliefs/ ◄────────┼────────►(actions/ │
         │ worries) │        │        │behaviors)│
         └──────────┘        │        └──────────┘
                    ┌────────┴────────┐
                    │     FEELS       │
                    │  (emotions)     │
                    └─────────────────┘

PAINS (frustrations):          GAINS (goals/wants):
• [Pain 1]                     • [Goal 1]
• [Pain 2]                     • [Goal 2]
```

### User Interview Guide
```
WARM UP (5 min)
Q: Tell me about your typical workday.
Q: How do you handle [relevant task]?

DEEP DIVE (20 min)
Q: Walk me through the last time you [task].
Q: What was the most frustrating part?
Q: What workarounds do you use?
Q: If you had a magic wand, how would this work?

WRAP UP (5 min)
Q: Is there anything I didn't ask that you think is important?
Q: Who else should I talk to about this?
```

## Stage 2: Define — Problem Statement (HMW)

### "How Might We" Framework
```
HMW + [verb] + [object] + [context/constraint]

Example: 
"How might we help Indian students access 
professional-grade tools without paying subscriptions?"
```

### Point of View (POV) Statement
```
[USER] needs [NEED] because [INSIGHT]

Example:
"An Indian engineering student needs a reliable PDF compression tool
because university portals have 5MB upload limits but textbooks are 50MB+"
```

## Stage 3: Ideate

### Brainstorming Techniques
| Technique | Rules |
|-----------|-------|
| Brainwriting 6-3-5 | 6 people, 3 ideas each, 5 minutes |
| SCAMPER | Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse |
| Crazy 8s | 8 ideas in 8 minutes — quantity over quality |
| Worst Possible Idea | Invert bad ideas into good ones |
| Analogies | "How would Apple/Google solve this?" |

### Idea Evaluation Matrix
```
Idea          Impact (1-5)  Feasibility (1-5)  Score
[Idea 1]         4              3               12
[Idea 2]         3              5               15  ← Best
[Idea 3]         5              2               10
```

## Stage 4: Prototype

### Prototype Fidelity Spectrum
| Fidelity | When | Tools |
|----------|------|-------|
| Paper sketches | Early ideation | Pen + paper |
| Wireframes | Structure + flow | Figma, Balsamiq |
| Low-fi clickable | Validate flow | Figma, Marvel |
| High-fi mockup | Validate UI | Figma, Framer |
| Coded prototype | Validate tech | React, HTML/CSS |

### ISHU TOOLS Prototype Spec Example
```
TOOL: PDF Compressor
Flow:
1. Landing: Drag & drop or click to upload
2. Processing: Progress bar with percentage + "Analyzing..." message
3. Result: Before/after size, download button, share button
4. Options: Quality slider (High/Medium/Small)
Mobile: Same flow, thumb-friendly tap targets (min 44px)
```

## Stage 5: Test

### Usability Test Protocol
```
Task: "Compress this PDF file and download the result"
Success Criteria: Complete task in <90 seconds, no external help needed

Observe: Where do users hesitate? What do they expect to happen?
Measure: Task completion rate, time-on-task, error count, SUS score
Ask: "What were you expecting here?" "What's confusing?"
```

### System Usability Scale (SUS) — 10 Questions
Each rated 1-5 (Strongly Disagree → Strongly Agree)
Score 0-100. Above 68 = good. Above 80 = excellent.

## Related Skills
- `frontend-design` — visual implementation
- `brainstorming` — creative ideation sessions
- `product-manager` — product roadmap from user research
- `ui-ux-pro-max` — detailed UI/UX implementation
