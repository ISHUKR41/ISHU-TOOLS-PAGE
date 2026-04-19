# External APIs Skill

## What It Does
Provides access to external APIs through Replit-managed billing. Instead of requiring users to supply their own API keys for common services, this skill enables direct API access that Replit bills for on the user's behalf.

## When to Use
- Calling AI models (OpenAI, Anthropic, etc.) without a user API key
- Using external services when no Replit integration exists
- When a service is needed for a specific tool function
- Image generation, text processing, or AI-powered features

## Key Capabilities
- Access AI models via managed credentials
- HTTP calls to external APIs with Replit's billing layer
- Supported: OpenAI, Anthropic Claude, image generation services, and more
- No API key required from the user for supported services

## How It Works
1. Replit manages API credentials for supported services
2. Your code makes API calls through the managed layer
3. Usage is billed to the user's Replit account
4. No need to ask users for API keys for supported services

## Important Notes
- Check the `integrations` skill first — some services have free tiers via integrations
- Verify service is supported before relying on this skill
- Cost tracking is handled by Replit automatically
- For non-supported services, you still need the user to provide keys

## Common Use Cases for ISHU TOOLS
- AI-powered summarization (PDF/text summarizer)
- Translation services
- OCR enhancement
- Grammar checking
- Content paraphrasing

## Related Skills
- `integrations` — First check for free integrations before using paid external APIs
- `environment-secrets` — For API keys the user provides themselves
