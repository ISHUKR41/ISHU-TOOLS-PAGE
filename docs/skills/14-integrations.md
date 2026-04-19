# Integrations Skill — Ultra-Detailed Reference

## What It Does
Searches for, configures, and manages Replit's built-in integration system. Integrations are pre-built connectors for popular third-party services — they handle OAuth, credential injection, and SDK setup automatically. **This must be checked BEFORE asking any user for an API key or credential.**

---

## CRITICAL RULE
**Before asking a user to provide any API key, OAuth token, or credential for ANY service, check if a Replit integration exists.** If one exists:
1. Use the integration → user doesn't need to manage keys manually
2. Credentials are injected automatically into the environment
3. No risk of keys being pasted in chat or stored insecurely

---

## Types of Integrations

### Blueprints
Pre-configured full-stack templates that set up everything:
- Auth systems (Replit Auth, Google OAuth, GitHub OAuth)
- Payment flows (Stripe checkout)
- Database-backed apps

### Connectors
First-class integrations with individual services. Available connectors include:

**Authentication & Identity:**
- Replit Auth (built-in, no setup)
- Google OAuth
- GitHub OAuth

**Databases & Storage:**
- PostgreSQL (Replit built-in — free)
- Supabase (Postgres + Auth + Storage)
- Firebase / Firestore
- Redis

**Payments:**
- Stripe (web payments)
- RevenueCat (mobile in-app purchases)

**Communication & Notifications:**
- Slack
- SendGrid (email)
- Twilio (SMS)

**Data & Productivity:**
- Google Sheets
- Notion
- HubSpot (CRM)
- Airtable

**Developer Tools:**
- GitHub (repos, PRs, issues)
- Linear (project management)
- Jira

**AI:**
- OpenAI (GPT API)

### Connections
Specific configured instances of a connector with credentials. A project can have multiple connections to the same connector (e.g., dev Stripe + prod Stripe).

---

## Available Functions (code_execution sandbox)

### Search for integrations
```javascript
// Find if a Replit integration exists for a service
const results = await searchIntegrations({ query: "stripe" });
console.log(results);
// Returns: list of available integrations with names, descriptions
```

### List configured connections
```javascript
// Check what's already connected to this project
const connections = await listConnections("stripe");
// Returns: [] if not connected, or array of connection objects
```

### Use connection credentials
```javascript
const connections = await listConnections("openai");
if (connections.length > 0) {
  const { settings } = connections[0];
  // settings contains API keys, tokens — use them, don't log them
  const client = new OpenAI({ apiKey: settings.api_key });
}
```

---

## Decision Flow: Adding a Third-Party Service

```
User wants to add [Service]
          │
          ▼
Search integrations: searchIntegrations({ query: "[Service]" })
          │
    ┌─────┴──────┐
    │            │
  Found        Not found
    │            │
    ▼            ▼
Connect via   Check external_apis skill
Replit UI     (Replit-billed API access)
    │            │
    ▼        Not available
listConnections()   │
 to get creds  ▼
    │       Request API key from user
    │       via requestSecret()
    ▼       Store in environment-secrets
Use credentials
in code
```

---

## Common Integration Scenarios for ISHU TOOLS

### Adding OpenAI for AI-powered tools
```javascript
// Check if OpenAI integration exists
const results = await searchIntegrations({ query: "openai" });
// If available → connect via UI, credentials injected automatically

// Use in backend:
const connections = await listConnections("openai");
const apiKey = connections[0]?.settings?.api_key
  || process.env.OPENAI_API_KEY;  // Fallback to manual secret
```

### Adding analytics (Google Analytics)
```javascript
// Check for analytics integration
const analytics = await searchIntegrations({ query: "google analytics" });
// If not available as Replit integration → use GA4 script tag directly
// No API key needed for GA4 — just a measurement ID
```

### Adding email notifications
```javascript
const email = await searchIntegrations({ query: "sendgrid" });
// If found → connect, use credentials
// VITE_ prefix for any config exposed to frontend
```

### Replit Auth (Built-in)
```javascript
// No search needed — Replit Auth is always available
// Just use the @replit/auth-client package:
const { user } = useReplitAuth();
// Gives you: user.id, user.name, user.profileImage
```

---

## Integration Connection Object Shape

```typescript
interface Connection {
  id: string;
  connectorConfigId: string;
  status: "active" | "inactive";
  displayName: string;
  metadata: Record<string, unknown>;
  environment: "development" | "production";
  settings: Record<string, string>;  // API keys, tokens — SENSITIVE
  toonSchema: string;                // Schema description
  getClient(): Record<string, string>;  // Returns settings object
}
```

---

## Free Tier Limitations (Important for ISHU TOOLS)
On Replit free tier:
- **Available:** Replit Auth, PostgreSQL database, built-in AI features
- **Not available:** Stripe connector, Slack connector, Google Sheets, Linear, etc.
- **Workaround:** Request API keys manually from user via `requestSecret()`

---

## When No Integration Exists

1. Check `external_apis` skill — Replit may provide billed access to some APIs
2. Ask user to create their own account and provide the API key
3. Store the key using `environment-secrets` skill: `requestSecret()`
4. Use the key in backend code only (never expose in frontend)

---

## Related Skills
- `environment-secrets` — For manually managing API keys when no integration exists
- `external_apis` — Replit-billed access to external APIs
- `stripe` — Detailed Stripe payment integration walkthrough
- `revenuecat` — Mobile in-app purchase integration
- `database` — Built-in PostgreSQL (always available, no integration search needed)
