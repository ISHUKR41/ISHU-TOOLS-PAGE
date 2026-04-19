# Agent Tools Skill (User-Provided)

## What It Does
Provides access to 250+ AI-powered applications via the `inference.sh` CLI. Includes image generation (FLUX, DALL-E), video creation (Veo, Seedance), large language models (Claude, Gemini, Grok), web search (Tavily, Exa), 3D generation, Twitter automation, and much more.

## Activation Triggers
- inference.sh, infsh, ai model, run ai, serverless ai, ai api
- flux, veo, claude api, image generation, video generation
- openrouter, tavily, exa search, twitter api, grok
- Anything requiring AI model API calls without a user API key

## Available Model Categories
| Category | Models / Services |
|---|---|
| Image Gen | FLUX, DALL-E 3, Stable Diffusion XL, Midjourney-style |
| Video Gen | Google Veo, Seedance, OmniHuman |
| LLMs | Claude (Anthropic), Gemini (Google), Grok (xAI), OpenRouter |
| Search | Tavily (AI-powered), Exa (neural search) |
| 3D | 3D model generation from text or images |
| Twitter | Automation, posting, analytics |

## CLI Usage
```bash
# Image generation with FLUX
infsh flux "A professional dark UI tool card" --width 1200 --height 630

# Video generation
infsh veo "Tech tools explainer animation" --duration 5

# LLM call
infsh claude "Summarize this PDF content" --input content.txt

# Web search
infsh tavily "yt-dlp latest python API documentation"
infsh exa "iLovePDF competitor analysis SEO keywords"
```

## For ISHU TOOLS
- Generate OG images for tool pages
- Create hero animations
- AI-powered tool descriptions
- Competitive analysis via web search
- Content paraphrasing for SEO

## Related Skills
- `media-generation` — Replit's built-in media generation
- `web-search` — Replit's web search (uses different backend)
- `external_apis` — For other AI APIs
