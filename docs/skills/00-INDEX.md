# ISHU TOOLS — Skills Documentation Index

Complete documentation for all 55+ available agent skills.

## Replit-Provided Skills (35 total)

| # | Skill | Description |
|---|---|---|
| 01 | [agent-inbox](./01-agent-inbox.md) | Manage user feedback items and inbox |
| 02 | [artifacts](./02-artifacts.md) | Create sandbox artifacts for UI previews |
| 03 | [canvas](./03-canvas.md) | Read and modify shapes on the visual board |
| 04 | [database](./04-database.md) | PostgreSQL database management and queries |
| 05 | [delegation](./05-delegation.md) | Delegate tasks to specialized subagents |
| 06 | [deployment](./06-deployment.md) | Deploy app and debug production issues |
| 07 | [design](./07-design.md) | DESIGN subagent for UI/frontend work |
| 08 | [design-exploration](./08-design-exploration.md) | Generate multiple design variants |
| 09 | [diagnostics](./09-diagnostics.md) | LSP diagnostics and project rollback |
| 10 | [environment-secrets](./10-environment-secrets.md) | Manage API keys and environment variables |
| 11 | [expo](./11-expo.md) | Mobile app development with Expo/React Native |
| 12 | [external_apis](./12-external-apis.md) | Access external APIs via Replit billing |
| 13 | [follow-up-tasks](./13-follow-up-tasks.md) | Suggest follow-up improvements after tasks |
| 14 | [integrations](./14-integrations.md) | Third-party service integrations |
| 15 | [media-generation](./15-media-generation.md) | AI image, video, and stock media generation |
| 16 | [mockup-extract](./16-mockup-extract.md) | Extract app components onto canvas |
| 17 | [mockup-graduate](./17-mockup-graduate.md) | Integrate approved mockups into main app |
| 18 | [mockup-sandbox](./18-mockup-sandbox.md) | Isolated component preview environment |
| 19 | [package-management](./19-package-management.md) | Install packages and system dependencies |
| 20 | [post_merge_setup](./20-post-merge-setup.md) | Script that runs after task merges |
| 21 | [project_tasks](./21-project-tasks.md) | Create and manage formal project tasks |
| 22 | [react-vite](./22-react-vite.md) | React + Vite best practices |
| 23 | [repl_setup](./23-repl-setup.md) | Replit environment configuration |
| 24 | [security_scan](./24-security-scan.md) | Vulnerability scanning (SAST, deps, secrets) |
| 25 | [workflows](./25-workflows.md) | Manage app workflows (start/stop/configure) |
| 26 | [web-search](./26-web-search.md) | Web search, fetch, screenshot, branding |
| 27 | [video-js](./27-video-js.md) | Programmatic video creation in React |
| 28 | [stripe](./28-stripe.md) | Stripe payment integration |
| 29 | [threat_modeling](./29-threat-modeling.md) | Security threat analysis |
| 30 | [validation](./30-validation.md) | Run CI-like validation checks |
| 31 | [skill-authoring](./31-skill-authoring.md) | Create new reusable skills |
| 32 | [replit-docs](./32-replit-docs.md) | Search Replit documentation |
| 33 | [revenuecat](./33-revenuecat.md) | Mobile in-app purchases |
| 34 | [slides](./34-slides.md) | Create and edit slide presentations |

## User-Provided Skills (14 primary)

| # | Skill | Description |
|---|---|---|
| 35 | [agent-tools](./35-agent-tools.md) | 250+ AI apps via inference.sh CLI |
| 36 | [brainstorming](./36-brainstorming.md) | Explore intent before building |
| 37 | [frontend-design](./37-frontend-design.md) | High-quality frontend design |
| 38 | [seo-audit](./38-seo-audit.md) | Comprehensive SEO auditing |
| 39 | [ui-ux-pro-max](./39-ui-ux-pro-max.md) | 50+ styles, 161 palettes, 99 UX guidelines |
| 40 | [next-best-practices](./40-next-best-practices.md) | Next.js patterns and conventions |
| 41 | [vercel-react-best-practices](./41-vercel-react-best-practices.md) | React performance from Vercel |
| 42 | [supabase-postgres-best-practices](./42-supabase-postgres-best-practices.md) | Postgres optimization |
| 43 | [web-design-guidelines](./43-web-design-guidelines.md) | WCAG accessibility review |
| 44 | [vercel-composition-patterns](./44-vercel-composition-patterns.md) | React component architecture |
| 45 | [better-auth-best-practices](./45-better-auth-best-practices.md) | TypeScript authentication |
| 46 | [vercel-react-native-skills](./46-vercel-react-native-skills.md) | React Native performance |
| 47 | [audit-website](./47-audit-website.md) | Full website audit with squirrelscan |
| 48 | [secondary-skills-overview](./48-secondary-skills-overview.md) | All 40+ secondary skills quick reference |
| 49 | [query-integration-data](./49-query-integration-data.md) | Query Linear/GitHub/HubSpot/BigQuery integrations |
| 50 | [browser-use](./50-browser-use.md) | Browser automation — navigate, click, fill forms, screenshot |
| 51 | [copywriting](./51-copywriting.md) | Marketing copy for landing pages, CTAs, headlines |
| 52 | [find-skills](./52-find-skills.md) | Discover and search available agent skills |
| 53 | [pdf](./53-pdf.md) | PDF processing — merge, split, OCR, create, protect |
| 54 | [pptx](./54-pptx.md) | PowerPoint creation, reading, and editing |
| 55 | [remotion-best-practices](./55-remotion-best-practices.md) | Programmatic video creation with React + Remotion |
| 56 | [skill-creator](./56-skill-creator.md) | Create, improve, and benchmark agent skills |
| 57 | [all-secondary-skills-detailed](./57-all-secondary-skills-detailed.md) | Detailed reference for all 40 secondary skills |

## Quick Reference: Which Skill to Use?

| Task | Use This Skill |
|---|---|
| Install npm/pip package | `package-management` |
| Add API key or secret | `environment-secrets` |
| Build a UI component | `design` or `frontend-design` |
| Design multiple variants | `design-exploration` |
| SEO improvement | `seo-audit` + existing SEO system |
| Deploy to production | `deployment` |
| Debug prod errors | `deployment` + `fetch_deployment_logs` |
| Check prod database | `database` (environment: production) |
| Add payment processing | `stripe` (web) or `revenuecat` (mobile) |
| Find a third-party service | `integrations` (check first!) |
| Start/restart the app | `workflows` |
| TypeScript errors | `diagnostics` |
| Security vulnerabilities | `security_scan` |
| Generate images/media | `agent-tools` or `media-generation` |
| Web/competitor research | `web-search` |
| Mobile app features | `expo` + `vercel-react-native-skills` |
| React performance | `vercel-react-best-practices` |
| Component architecture | `vercel-composition-patterns` |
| Accessibility review | `web-design-guidelines` |
| Query external data | `query-integration-data` |
| Automate browser | `browser-use` |
| Write marketing copy | `copywriting` |
| PDF operations | `pdf` |
| PowerPoint operations | `pptx` |
| Create animated videos | `remotion-best-practices` + `video-js` |
| Create/improve a skill | `skill-creator` + `skill-authoring` |
| Find a skill | `find-skills` |
| Resume/CV | secondary skill: `resume-maker` |
| Meal planning | secondary skill: `meal-planner` |
| Stock analysis | secondary skill: `stock-analyzer` |
| Travel planning | secondary skill: `travel-assistant` |
| Tax planning (India) | secondary skill: `tax-reviewer` |
| Invoice / bill | secondary skill: `invoice-generator` |
| Competitive research | secondary skill: `competitive-analysis` |
| Branding | secondary skill: `branding-generator` |

---
*Generated for ISHU TOOLS — Indian Student Hub University Tools*
*736+ tool handlers · ishutools.com · Created by Ishu Kumar (IIT Patna)*
*Skills: 57 documented (34 Replit + 14 primary user + 9 additional + 40 secondary)*
