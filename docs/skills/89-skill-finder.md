# Skill: skill-finder

## Purpose
Helps discover, evaluate, and install appropriate agent skills for specific tasks. Maintains an index of available skills, their capabilities, and suggests the best skill for any given request.

## When to Use
- User isn't sure which skill to use for a task
- User asks "is there a skill for X?"
- User wants to browse available capabilities
- User wants to know what the agent can do
- Need to find the best tool for an unexpected task
- User asks about extending agent capabilities

## Skill Discovery Method

### Using skillSearch() in Code Execution
```javascript
const results = await skillSearch("generate invoice");
// Returns: [{name, path, description}] of matching skills
```

### Available Skill Categories

#### Content & Marketing
| Skill | Use For |
|-------|---------|
| copywriting | Landing pages, sales copy, brand messaging |
| ad-creative | Google/Facebook/LinkedIn ad copy |
| content-machine | Blog posts, social calendar, video scripts |
| branding-generator | Brand identity, names, colors, voice |
| podcast-generator | Show format, scripts, episode content |
| podcast-marketing | Listener growth, promotion strategies |
| infographic-builder | Visual content structure |

#### Sales & Business
| Skill | Use For |
|-------|---------|
| ai-sdr | Cold outreach, email sequences, objection handling |
| competitive-analysis | Market research, competitor comparison |
| product-manager | PRDs, roadmaps, OKRs, user stories |
| invoice-generator | Invoices, receipts, GST billing |
| legal-contract | Contracts, NDAs, Terms of Service |

#### Career & HR
| Skill | Use For |
|-------|---------|
| resume-maker | Resume/CV creation, ATS optimization |
| interview-prep | Technical, behavioral, HR interview questions |
| ai-recruiter | Job descriptions, candidate screening |
| ai-secretary | Emails, agendas, meeting notes |

#### Technical & Development
| Skill | Use For |
|-------|---------|
| agent-tools | AI models, image/video generation via CLI |
| github-solution-finder | Library discovery, repo evaluation |
| excel-generator | Formulas, templates, VBA macros |
| file-converter | Format conversion code and guides |
| photo-editor | Image processing code (Pillow, OpenCV) |

#### Research & Analysis
| Skill | Use For |
|-------|---------|
| deep-research | Multi-source research synthesis |
| competitive-analysis | Market and competitor intelligence |
| stock-analyzer | Financial market analysis |
| real-estate-analyzer | Property investment calculations |
| insurance-optimizer | Insurance comparison and planning |

#### Education & Learning
| Skill | Use For |
|-------|---------|
| flashcard-generator | Study cards, Anki decks |
| interview-prep | Exam and interview preparation |
| meal-planner | Nutrition and meal planning |
| recipe-creator | Cooking instructions |

#### SEO & Growth
| Skill | Use For |
|-------|---------|
| seo-audit | Technical SEO audit |
| programmatic-seo | Scale SEO to hundreds of pages |
| seo-auditor | Detailed SEO analysis |

#### Design & UI
| Skill | Use For |
|-------|---------|
| frontend-design | Production-grade UI implementation |
| design-thinker | Design thinking framework |
| ui-ux-pro-max | Detailed UI/UX implementation |
| recreate-screenshot | Implementing designs from screenshots |

#### Personal Assistance
| Skill | Use For |
|-------|---------|
| travel-assistant | Trip planning, visa, itineraries |
| personal-shopper | Product recommendations, buying guides |
| tax-reviewer | Tax planning, deductions |
| real-estate-analyzer | Property buying/renting analysis |

## Skill Selection Decision Tree

```
What type of task is it?

├── WRITING task?
│   ├── Marketing/Sales → copywriting, ad-creative
│   ├── Technical docs → resume-maker, legal-contract
│   ├── Content at scale → content-machine
│   └── Business email → ai-secretary

├── RESEARCH task?
│   ├── Deep dive on topic → deep-research
│   ├── Market/competitors → competitive-analysis
│   ├── Financial data → stock-analyzer
│   └── Property → real-estate-analyzer

├── TECHNICAL task?
│   ├── Find library/repo → github-solution-finder
│   ├── File conversion → file-converter
│   ├── Image processing → photo-editor
│   ├── Spreadsheet → excel-generator
│   └── AI models → agent-tools

├── DESIGN task?
│   ├── New UI from scratch → frontend-design
│   ├── Copy from screenshot → recreate-screenshot
│   ├── Variants to compare → design-exploration
│   └── User research → design-thinker

├── BUSINESS task?
│   ├── Invoice/billing → invoice-generator
│   ├── Contract/legal → legal-contract
│   ├── HR/hiring → ai-recruiter
│   └── Sales outreach → ai-sdr

└── PERSONAL task?
    ├── Career → resume-maker, interview-prep
    ├── Finance → tax-reviewer, insurance-optimizer
    ├── Food → meal-planner, recipe-creator
    └── Shopping → personal-shopper
```

## How to Install Additional Skills
```bash
# User-provided skills via npx
npx skills add inference-sh/skills@ai-image-generation
npx skills add inference-sh/skills@ai-video-generation
npx skills add inference-sh/skills@llm-models

# Check installed skills
ls .agents/skills/
ls .local/skills/
ls .local/secondary_skills/
```

## Related Skills
- `skill-creator` — create new custom skills
- `skill-authoring` — write skill documentation
- `agent-tools` — AI-powered capabilities
