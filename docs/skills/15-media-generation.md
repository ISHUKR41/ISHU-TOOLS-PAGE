# Media Generation Skill

## What It Does
Generates and retrieves AI-powered media — images, videos, and stock photos. Provides access to image generation models (FLUX, DALL-E, etc.) and video generation tools, plus stock image search.

## When to Use
- Generating placeholder or hero images for the app
- Creating tool icons or illustrations
- Adding visual content to landing pages
- Generating preview images for social sharing (OG images)
- User requests "create an image of..." or "generate a logo"

## Key Capabilities

### Image Generation
- AI-generated images from text prompts
- Multiple models: FLUX, DALL-E, Stable Diffusion
- Various styles: photorealistic, illustration, icon, diagram
- Output sizes and formats

### Video Generation
- Short AI-generated video clips
- Animation from still images
- Text-to-video capabilities

### Stock Images
- Search and retrieve royalty-free stock photos
- Filtered by category, color, orientation
- Direct URL references for embedding

## Usage Notes
- Generated images are returned as URLs or base64 data
- Save generated assets to `attached_assets/` or `public/` for use in the app
- Always use descriptive, detailed prompts for best results
- Image generation costs may apply depending on model

## Example Prompts for ISHU TOOLS
```
"Professional dark-themed UI icon for PDF merge tool, 
minimalist, gradient blue-purple, 128x128, transparent background"

"Hero image for online tools website, dark blue gradient, 
floating geometric shapes, professional tech aesthetic, 16:9"
```

## Related Skills
- `agent-tools` — User-provided skill with 250+ AI models including image gen
- `web-search` — For finding existing images/assets online
