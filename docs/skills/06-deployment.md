# Deployment Skill

## What It Does
Manages publishing, deploying, and configuring the project for production. Handles the full deployment lifecycle — from initial publishing to debugging production issues and configuring regions/settings.

## When to Use
- User says "publish my app", "deploy", "make it live"
- Deployed app is broken or showing errors
- Need to check production server logs
- Configuring deployment geography or regions
- User reports "it works locally but not in production"
- Checking production health or performance

## Key Capabilities
- Deploy/publish the project to Replit's cloud infrastructure
- Configure deployment settings (regions, scaling, env vars)
- Fetch and analyze production logs via `fetch_deployment_logs`
- Debug production-only errors
- Health check endpoints
- Custom domain configuration

## Deployment Architecture
- Production environment is **separate** from development
- Has its own isolated container, database, and environment variables
- Environment variables must be set separately for production
- Uses the workflow's start command to boot the app

## Debugging Production Issues
1. Use `fetch_deployment_logs` tool to get production logs
2. Look for error patterns: `ERROR`, `Exception`, `failed`, `timeout`
3. Check if environment variables are set in production
4. Verify the production build works correctly

## Important Notes
- Production database is separate — use `database` skill with `environment: "production"` to query it
- Environment variables need to be set in both dev AND prod
- A `suggest_deploy` call presents the user with a deploy button
- Don't use `suggest_deploy` until the app is fully verified working

## Related Skills
- `database` — Querying production database
- `environment-secrets` — Setting production environment variables
- `workflows` — Managing the workflow that runs in production
