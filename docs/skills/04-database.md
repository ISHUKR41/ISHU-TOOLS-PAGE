# Database Skill

## What It Does
Creates and manages Replit's built-in PostgreSQL database. Provides tools to check database status, run SQL queries (both in development and production), create tables, and manage schema migrations.

## When to Use
- Setting up a new database for the project
- Running SQL queries to check data
- Debugging database issues in production ("what's in the prod DB?")
- Schema migrations and table management
- User asks "check the live database" or "query production"

## Key Capabilities
- Create and connect to PostgreSQL databases
- Execute SQL queries with safety checks (read-only mode for production)
- Run migrations and schema updates
- Check database connection status
- Query production database (read-only by default for safety)

## Environments
- **Development**: Full read/write access
- **Production**: Read-only queries by default — prevents accidental data changes

## Safety Rules
1. Always use `environment: "production"` parameter for prod queries
2. Production queries are read-only by default — destructive operations require confirmation
3. Prefer `SELECT` statements when investigating issues
4. Always backup data before running destructive migrations

## Usage Notes
- Available via `executeSql({ sqlQuery: "...", environment: "development" | "production" })`
- Returns structured output with rows and column names
- For large result sets, use `LIMIT` clauses

## Common Use Cases
```sql
-- Check users table
SELECT * FROM users LIMIT 10;

-- Count records
SELECT COUNT(*) FROM tools;

-- Check recent activity
SELECT * FROM sessions ORDER BY created_at DESC LIMIT 20;
```

## Related Skills
- `environment-secrets` — For database connection strings (DATABASE_URL)
- `deployment` — Production database lives in the deployed environment
