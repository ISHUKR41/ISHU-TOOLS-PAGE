# Media Generation Skill — Ultra-Detailed Reference

## What It Does
Generates AI-powered media — images (FLUX, DALL-E, Stable Diffusion), videos (text-to-video, image animation), and retrieves stock photos. Provides everything needed to add high-quality visual content to ISHU TOOLS — tool icons, hero images, OG images for social sharing, category illustrations, and more.

---

## When to Use

| Request | Action |
|---|---|
| "Generate a logo for ISHU TOOLS" | AI image generation |
| "Create an icon for the PDF merger tool" | AI image generation (small, transparent) |
| "Add a hero background image" | AI image or stock photo |
| "Create an OG image for social sharing" | AI image (1200×630px) |
| "Find a stock photo of students studying" | Stock image search |
| "Generate a short animated promo video" | Video generation |
| "Create category illustrations" | AI image generation per category |

---

## Available Functions

### Image Generation
```javascript
// Generate an image from a text prompt
const result = await generateImage({
  prompt: "Dark themed UI icon for PDF merge tool, minimalist design, blue gradient, 128x128, transparent background, professional",
  model: "flux",        // "flux" | "dall-e-3" | "stable-diffusion"
  width: 512,
  height: 512,
  quality: "high",
});
// Returns: { imageUrl: "https://...", base64: "..." }
```

### Stock Image Search
```javascript
const photos = await searchStockImages({
  query: "students studying with laptop India",
  orientation: "landscape",  // "landscape" | "portrait" | "square"
  color: "dark",
});
// Returns: list of { url, credit, downloadUrl }
```

### Video Generation
```javascript
const video = await generateVideo({
  prompt: "Animated logo reveal for ISHU TOOLS, dark background, blue particles converging",
  duration: 5,  // seconds
  style: "tech",
});
// Returns: { videoUrl: "https://..." }
```

---

## Saving Generated Assets

Generated images should be saved to the project for use in the app:

```bash
# Save to public directory (accessible from Vite)
curl -o frontend/public/og-image.jpg "https://generated-image-url..."

# Save to attached_assets for project reference
curl -o attached_assets/images/hero-bg.jpg "https://..."
```

Or in code:
```javascript
const result = await generateImage({ prompt: "..." });
// Save the base64 to disk
const imageData = result.base64.replace('data:image/png;base64,', '');
const fs = await import('fs');
fs.writeFileSync('frontend/public/og-image.png', Buffer.from(imageData, 'base64'));
```

---

## ISHU TOOLS Image Assets Needed

### OG / Social Sharing Images
```
Size: 1200×630px
Purpose: When shared on Twitter/WhatsApp/LinkedIn
Style: Dark blue background, ISHU TOOLS logo, tagline "700+ Free Online Tools"
File: frontend/public/og-image.jpg
```

### Tool Category Icons
```
Size: 64×64px or SVG preferred
Purpose: Category cards on homepage and category pages
Colors: Per-category accent (red for PDF, purple for image, etc.)
Format: SVG embedded in React components (lucide-react icons work great)
```

### Hero Section Background
```
Size: 1920×1080px (or gradient CSS — preferred)
Purpose: Landing page atmospheric background
Style: Deep navy/black with subtle mesh gradient or particle effect
Note: CSS mesh gradient is better (zero loading time) — use image only if CSS can't achieve it
```

### PWA Splash Screen
```
Sizes: 512×512, 192×192, 180×180 (iOS)
Purpose: PWA install icon and splash
Style: ISHU TOOLS logo on dark background
File: frontend/public/icons/
```

---

## Prompt Engineering for Best Results

### For tool icons (small, clear)
```
"Minimal flat icon for [tool name], [primary color] gradient, clean geometric shape,
SVG-style, white background, 64x64, no text, professional UI icon style"
```

### For hero/background images
```
"Abstract dark technology background, deep navy blue and black gradient,
subtle geometric mesh pattern, floating translucent shapes, professional,
widescreen 16:9, no text, atmospheric, futuristic"
```

### For OG images (must include branding)
```
"Social media banner for ISHU TOOLS online tools website, dark blue background,
ISHU TOOLS text large and clear, '700+ Free Online Tools' subtitle,
professional, tech aesthetic, 1200x630 pixels"
```

### For Indian student audience
```
"Young Indian student using laptop, modern minimal style, warm lighting,
studying concept, tech background, professional stock photo style"
```

---

## Saving to PWA Manifest

After generating icons:
```json
// frontend/public/manifest.json
{
  "name": "ISHU TOOLS",
  "short_name": "ISHU TOOLS",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#007aff",
  "background_color": "#000000",
  "display": "standalone",
  "start_url": "/"
}
```

---

## Model Selection Guide

| Model | Best For | Speed | Quality | Cost |
|---|---|---|---|---|
| FLUX.1 | Photorealistic, detailed | Medium | Excellent | Medium |
| DALL-E 3 | Clean, conceptual, text in image | Fast | Very Good | Medium |
| Stable Diffusion | Icons, illustrations, art | Fast | Good | Low |

**Recommendation for ISHU TOOLS:**
- FLUX for hero images and OG images
- DALL-E 3 for anything needing text or UI mockups
- SD for bulk icon generation

---

## Related Skills
- `agent-tools` — User-provided skill with 250+ AI models including FLUX, Veo, Grok
- `web-search` — For finding existing images online (stock photos, reference)
- `video-js` — For creating programmatic animated videos in React (better for UI demos)
