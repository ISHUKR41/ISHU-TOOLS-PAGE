# Integrations Skill

## What It Does
Searches for, manages, and configures Replit's built-in integrations system. Covers blueprints, connectors, and connections for third-party services. **Must be checked before asking users for any API key or credential.**

## CRITICAL RULE
**Before asking a user for any API key, OAuth token, or credential, check this skill to see if a Replit integration exists for that service.** This saves users from needing to manage keys manually.

## When to Use
- Before adding any third-party service to the project
- Setting up authentication, payments, databases
- Connecting to Google, Stripe, GitHub, Linear, OpenAI, etc.
- User says "add payment processing" or "connect to Google Sheets"

## Available Integration Types

### Blueprints
Pre-configured full-stack templates (authentication, payments, etc.)

### Connectors
First-class integrations with key services:
- **Authentication**: Replit Auth, Google OAuth, GitHub OAuth
- **Databases**: PostgreSQL (built-in), Supabase, Firebase
- **Payments**: Stripe (via connector or RevenueCat for mobile)
- **Communication**: Slack, SendGrid
- **Data**: Google Sheets, Notion, HubSpot
- **Dev**: GitHub, Linear, Jira

### Connections
Individual configured instances of connectors with credentials.

## Workflow
```javascript
// Search for available integrations
const results = await searchIntegrations({ query: "stripe" });

// List configured connections
const connections = await listConnections("stripe");

// Use connection credentials
const { settings } = connections[0];
```

## When No Integration Exists
If no integration is available for a service:
1. Check `external_apis` skill for managed API access
2. Ask user to provide their own API key
3. Store it securely with `environment-secrets` skill

## Related Skills
- `environment-secrets` — For manual API key management
- `external_apis` — For Replit-billed API access
- `stripe` — Detailed Stripe payment integration guide
- `revenuecat` — Mobile payment integration
