# Agent Tools Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Provides access to 250+ AI-powered applications through the `inference.sh` CLI tool (`infsh`). Covers image generation, video creation, large language models, web search, 3D generation, Twitter automation, and dozens of specialized AI tools. The key advantage: no API keys needed for most services — inference.sh handles billing.

---

## Activation Triggers
- `inference.sh`, `infsh`, `ai model`, `run ai`, `serverless ai`
- `flux`, `veo`, `claude api`, `grok`, `gemini`, `openrouter`
- `image generation`, `video generation`, `ai video`
- `tavily`, `exa search`, `neural search`
- `twitter api`, `tweet automation`
- Anything requiring AI model API calls without a user key

---

## Available Model Categories

### Image Generation
| Model | Command | Best For |
|---|---|---|
| FLUX.1 | `infsh flux "prompt"` | Photorealistic, detailed images |
| DALL-E 3 | `infsh dalle3 "prompt"` | Clean illustrations, text in images |
| Stable Diffusion XL | `infsh sdxl "prompt"` | Artistic, illustration styles |
| Midjourney-style | `infsh mj "prompt"` | Aesthetic, artistic output |

### Video Generation
| Model | Command | Best For |
|---|---|---|
| Google Veo | `infsh veo "prompt"` | Realistic video from text |
| Seedance | `infsh seedance "prompt"` | Animation and motion graphics |
| OmniHuman | `infsh omnihuman "prompt"` | Human video synthesis |

### Large Language Models
| Model | Command | Best For |
|---|---|---|
| Claude Sonnet | `infsh claude "prompt"` | Complex reasoning, coding |
| Claude Haiku | `infsh claude-haiku "prompt"` | Fast, efficient tasks |
| Gemini Pro | `infsh gemini "prompt"` | Google's multimodal model |
| Grok | `infsh grok "prompt"` | Real-time info, witty responses |
| OpenRouter | `infsh openrouter --model [name] "prompt"` | Access any model |

### Web Search
| Service | Command | Best For |
|---|---|---|
| Tavily | `infsh tavily "query"` | AI-summarized search results |
| Exa | `infsh exa "query"` | Neural semantic search |

---

## CLI Usage Examples

```bash
# Generate OG image for compress-pdf tool
infsh flux "Dark professional thumbnail for online PDF compression tool, blue accent, minimal UI style, 1200x630" \
  --width 1200 \
  --height 630 \
  --output attached_assets/og-compress-pdf.jpg

# Short promo video for ISHU TOOLS
infsh veo "Tech explainer showing PDF tools interface, dark theme, 15 seconds, professional" \
  --duration 15 \
  --output attached_assets/promo.mp4

# Generate multiple tool descriptions with AI
infsh claude "Write 10 unique meta descriptions (150-160 chars each) for these PDF tools: compress, merge, split, convert, protect, unlock, rotate, edit, sign, watermark. Format as JSON array." \
  --output docs/seo/pdf-descriptions.json

# Research competitors
infsh tavily "iLovePDF smallpdf online PDF tools India market analysis 2024"
infsh exa "free online tools student India site:producthunt.com OR site:reddit.com"

# Generate category icons
infsh flux "Minimal flat icon for science tools, sky blue #38bdf8, atom/molecule design, transparent background, 128x128" \
  --width 128 --height 128 --output attached_assets/icons/science.png

# Summarize user feedback
infsh claude "Categorize and prioritize these bug reports for an online tools website: [paste feedback]"

# Generate tool titles and descriptions in Hindi
infsh claude "Write 5 Hindi meta descriptions for PDF compress tool. Mix Hindi+English (Hinglish). Keep 150-160 chars."
```

---

## ISHU TOOLS Specific Use Cases

### 1. Batch Generate OG Images
```bash
# Create OG images for all 15 categories
CATEGORIES=("pdf-core" "image-tools" "developer-tools" "science-tools" "cooking-tools")
for cat in "${CATEGORIES[@]}"; do
  infsh flux "Professional dark thumbnail for ${cat} online tools website, minimal design" \
    --width 1200 --height 630 \
    --output "frontend/public/og/${cat}.jpg"
done
```

### 2. AI-Powered Tool Descriptions
```bash
# Generate SEO-optimized descriptions for new tools
infsh claude "
Write SEO meta descriptions (155 chars) for these tools:
1. element-lookup: Chemical element properties from periodic table
2. molecular-weight: Calculate molecular weight of chemical formulas
3. recipe-scaler: Scale recipe ingredients up/down

Format: JSON array with keys: slug, description, title (60 chars)
" --output docs/seo/new-tool-descriptions.json
```

### 3. Competitive Research
```bash
# Find what keywords competitors rank for
infsh exa "site:smallpdf.com OR site:ilovepdf.com tool descriptions"
infsh tavily "best free online tools website India students 2024 comparison"
```

### 4. Content Generation for Blog/SEO
```bash
# Generate educational content for tool pages
infsh claude "Write a 300-word educational article about PDF compression for an Indian student audience. Mention ISHU TOOLS. Include keywords: compress PDF, reduce PDF size, free PDF compressor."
```

### 5. Twitter/Social Automation
```bash
# Draft tweets about new features
infsh grok "Write 5 tweets announcing 700+ free online tools for students. Mention ishutools.com. Use relevant hashtags. Friendly, helpful tone."
```

---

## Output Handling

```bash
# Save text output to file
infsh claude "Generate sitemap entries for 50 PDF tools" > frontend/public/sitemap-pdf.xml

# Save image to project
infsh flux "ISHU TOOLS hero image" --output attached_assets/hero.jpg

# Pipe to next command
infsh tavily "top PDF tools India" | infsh claude "Summarize competitor features from this research:"
```

---

## When to Use vs Other Skills

| Need | Use |
|---|---|
| Generate image (quick, reliable) | `media-generation` skill |
| Generate image (specific model, advanced) | `agent-tools` (infsh) |
| Web search (standard) | `web-search` skill |
| Web search (AI-summarized, semantic) | `agent-tools` (infsh tavily/exa) |
| Call GPT in backend code | `external_apis` skill |
| Generate video | `agent-tools` (infsh veo) |

---

## Related Skills
- `media-generation` — Replit's built-in media generation (simpler, integrated)
- `web-search` — Replit's web search (different backend, more integrated)
- `external_apis` — For calling AI APIs from within application code
