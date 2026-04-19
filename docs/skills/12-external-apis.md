# External APIs Skill — Ultra-Detailed Reference

## What It Does
Provides managed access to external APIs through Replit's billing system. Instead of requiring users to create accounts and supply their own API keys for common AI/utility services, Replit intermediates the connection and bills the usage to the user's Replit account. This dramatically reduces friction when adding AI-powered features.

---

## Decision Flow: When to Use

```
Need external API (OpenAI, image gen, translation, etc.)
           │
           ▼
Check integrations skill first
  → searchIntegrations({ query: "[service]" })
           │
    ┌──────┴──────────┐
    │                 │
  Found            Not found
  (free or           │
   managed)          ▼
    │         Check external_apis skill
    │         → Is service supported via Replit billing?
    ▼               │
Use integration   ┌─┴──────────────┐
                  │                │
               Supported       Not supported
                  │                │
               Use external    Request API key
               APIs skill      from user via
                               requestSecret()
```

---

## Supported Services (via Replit Billing)

The exact list changes — always verify current support. Common ones include:

### AI / Language Models
- OpenAI GPT-4o, GPT-4o-mini, GPT-3.5
- Anthropic Claude Sonnet, Claude Haiku
- Google Gemini
- Open-source models via OpenRouter

### Image Generation
- DALL-E 3
- Stable Diffusion (various models)
- FLUX.1

### Utility Services
- Translation APIs
- OCR services
- Text-to-speech
- Speech-to-text

---

## How to Use in Code

The external APIs skill provides access via the code execution sandbox or via application code.

### In code_execution sandbox
```javascript
// Check if a service is available
const available = await checkExternalApiAvailability({ service: "openai" });

// Make a call to OpenAI via managed billing
const response = await callExternalApi({
  service: "openai",
  endpoint: "/chat/completions",
  payload: {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Summarize this text: ..." }],
    max_tokens: 500
  }
});
```

### In backend FastAPI code
```python
# Use the API key injected by Replit's managed system
import os
import httpx

async def call_openai(prompt: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")  # Injected by managed billing
    if not api_key:
        raise ValueError("OpenAI API key not available")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.3
            },
            timeout=30.0
        )
        data = response.json()
        return data["choices"][0]["message"]["content"]
```

---

## ISHU TOOLS AI-Powered Tool Ideas

### PDF Summarizer (AI)
```python
@HANDLERS.setdefault("summarize-pdf", None)
async def handle_summarize_pdf(params: dict) -> dict:
    # 1. Extract text from uploaded PDF
    text = extract_pdf_text(params["file_path"])[:3000]  # Limit context
    # 2. Call AI to summarize
    summary = await call_openai(f"Summarize this document concisely:\n\n{text}")
    return {"type": "text", "payload": summary}
```

### Grammar Checker
```python
async def handle_grammar_check(params: dict) -> dict:
    text = params.get("text", "")
    prompt = f"Check the grammar of this text and return a corrected version with explanation:\n\n{text}"
    result = await call_openai(prompt)
    return {"type": "text", "payload": result}
```

### Text Paraphraser
```python
async def handle_paraphrase(params: dict) -> dict:
    text = params.get("text", "")
    style = params.get("style", "formal")
    prompt = f"Paraphrase the following text in a {style} tone:\n\n{text}"
    result = await call_openai(prompt)
    return {"type": "text", "payload": result}
```

### Hindi Translation
```python
async def handle_translate(params: dict) -> dict:
    text = params.get("text", "")
    target = params.get("target_language", "Hindi")
    prompt = f"Translate to {target}: {text}"
    result = await call_openai(prompt)
    return {"type": "text", "payload": result}
```

---

## Rate Limiting & Cost Awareness

When using external APIs, be mindful of:
1. **Per-request cost** — GPT-4o costs more per token than GPT-4o-mini
2. **User billing** — these calls are billed to the user's Replit account
3. **Rate limits** — Replit's managed billing has its own rate limits
4. **Timeout** — AI calls can take 5-30 seconds; handle with async properly

```python
# Good practice: timeout + fallback
try:
    result = await asyncio.wait_for(call_openai(prompt), timeout=25.0)
except asyncio.TimeoutError:
    return {"type": "text", "payload": "AI processing timed out. Please try with shorter text."}
```

---

## Free Tier Notes

On Replit free tier:
- Access to external APIs via managed billing requires a paid Replit plan
- Workaround: ask user to provide their own API key via `requestSecret()`
- GPT-4o-mini is cheaper — prefer it over GPT-4o for simple tasks

---

## Related Skills
- `integrations` — Check FIRST for free/managed integrations before using billed APIs
- `environment-secrets` — For user-provided API keys as fallback
- `agent-tools` — User-provided skill with AI model access via inference.sh
