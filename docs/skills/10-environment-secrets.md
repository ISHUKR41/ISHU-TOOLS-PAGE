# Environment Secrets Skill

## What It Does
Provides secure management of environment variables and secrets. Enables viewing, setting, and deleting environment variables without exposing sensitive values. Essential for API keys, database URLs, and other configuration values.

## CRITICAL: Always Read This Skill Before Touching Env Vars
**You MUST read this skill before performing any operation involving environment variables, secrets, API keys, tokens, or configuration values.** Failure can result in secrets being leaked.

## When to Use
- Adding API keys (OpenAI, Stripe, etc.)
- Setting database connection strings
- Configuring authentication secrets
- Viewing what environment variables are currently set
- Deleting outdated or compromised secrets
- User provides a key and asks you to save it

## Key Capabilities
- `viewEnvVars()` — List all set variable names (NOT values)
- `setEnvVar(name, value)` — Securely set a new variable
- `deleteEnvVar(name)` — Remove a variable
- Request variables from user via prompts
- Variables available as `process.env.NAME` (Node.js) or `os.environ["NAME"]` (Python)

## Security Rules
1. **NEVER print or log secret values** — they will be redacted
2. **NEVER write secrets to files** — even .env files
3. Use variable names only when referencing secrets in code
4. Development and production environments have separate variables
5. When user provides a key in chat, immediately set it and delete from context

## Variable Naming Conventions
```
DATABASE_URL          — PostgreSQL connection string
OPENAI_API_KEY        — OpenAI API key
SECRET_KEY            — Application secret key
VITE_API_BASE_URL     — Frontend environment variable (must start with VITE_)
```

## Frontend vs Backend Variables
- **Frontend (Vite)**: Must be prefixed with `VITE_` — accessible via `import.meta.env.VITE_NAME`
- **Backend (Python)**: Any name — accessible via `os.environ.get("NAME")`

## Related Skills
- `integrations` — Before requesting any third-party API key, check integrations first
- `deployment` — Production environment variables are separate
- `database` — DATABASE_URL is a secret managed here
