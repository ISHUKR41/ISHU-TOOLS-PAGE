# Database Skill — Ultra-Detailed Reference

## What It Does
Provides access to Replit's built-in managed **PostgreSQL 15** database. The database is provisioned automatically when the skill is used. Connection credentials are injected as `DATABASE_URL` in environment variables. The skill gives you both a high-level `executeSql` callback (in the JS code execution sandbox) and raw connection string access for application-level use.

For ISHU TOOLS, the database is used to store:
- Tool usage analytics (optional)
- User feedback / tool ratings
- Session data (if auth is added)
- Any persistent tool output cache

---

## Environments
| Environment | Access Level | Use Case |
|---|---|---|
| `development` | Full read/write | Local dev, schema migrations, testing |
| `production` | Read-only (by default) | Debugging live data, investigating issues |

Production write operations require explicit confirmation — this prevents accidental data corruption on the live site.

---

## When to Use This Skill
- Setting up tables for the first time (`CREATE TABLE`)
- Debugging: "why is tool X showing wrong data?"
- User asks "what's in the live database?"
- Running migrations (add column, rename table, etc.)
- Checking analytics data or user activity
- Verifying production data after deployment
- Backing up data before a destructive change

## When NOT to Use
- For environment variable management → use `environment-secrets` skill
- For file-based storage (JSON, SQLite) → just use the filesystem
- For caching tool results in-memory → use Python `functools.lru_cache`

---

## Using `executeSql` in Code Execution

The `executeSql` callback is pre-registered in the JS notebook environment:

```javascript
// Basic query
const result = await executeSql({
  sqlQuery: "SELECT COUNT(*) FROM tool_usage",
  environment: "development"  // "development" | "production"
});
console.log(result.output);

// With production (read-only)
const prodData = await executeSql({
  sqlQuery: "SELECT slug, COUNT(*) as uses FROM tool_usage GROUP BY slug ORDER BY uses DESC LIMIT 20",
  environment: "production"
});
```

**Return shape:**
```json
{
  "output": "slug          | uses\n--------------+------\nmerge-pdf     | 4521\n..."
}
```

---

## Schema for ISHU TOOLS (Reference)

```sql
-- Tool usage tracking
CREATE TABLE IF NOT EXISTS tool_usage (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL,
  category VARCHAR(60),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  processing_ms INTEGER,
  ip_hash VARCHAR(64)   -- hashed for privacy
);

-- User feedback
CREATE TABLE IF NOT EXISTS tool_feedback (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tool_usage_slug ON tool_usage(slug);
CREATE INDEX idx_tool_usage_used_at ON tool_usage(used_at DESC);
```

---

## Common SQL Patterns

```sql
-- Most-used tools today
SELECT slug, COUNT(*) as uses
FROM tool_usage
WHERE used_at >= CURRENT_DATE
GROUP BY slug
ORDER BY uses DESC
LIMIT 10;

-- Error rate by tool
SELECT slug, 
       COUNT(*) as total,
       SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as errors,
       ROUND(AVG(processing_ms)) as avg_ms
FROM tool_usage
GROUP BY slug
HAVING COUNT(*) > 10
ORDER BY errors DESC;

-- Average rating per tool
SELECT slug, ROUND(AVG(rating)::NUMERIC, 2) as avg_rating, COUNT(*) as ratings
FROM tool_feedback
GROUP BY slug
ORDER BY avg_rating DESC;

-- Recent feedback
SELECT slug, rating, comment, submitted_at
FROM tool_feedback
ORDER BY submitted_at DESC
LIMIT 20;
```

---

## Connecting from FastAPI (Backend)

The `DATABASE_URL` environment variable is automatically set by Replit when a database is provisioned:

```python
# backend/app/database.py
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "")
# Replit's DATABASE_URL uses `postgres://` prefix — SQLAlchemy needs `postgresql://`
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=10)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Async with asyncpg:**
```python
import asyncpg

async def get_pool():
    return await asyncpg.create_pool(os.environ["DATABASE_URL"])
```

---

## Migration Pattern (Safe)

```sql
-- Always use IF NOT EXISTS / IF EXISTS for idempotent migrations
ALTER TABLE tool_usage ADD COLUMN IF NOT EXISTS user_agent TEXT;
CREATE INDEX IF NOT EXISTS idx_tool_usage_category ON tool_usage(category);
DROP INDEX IF EXISTS idx_old_name;
```

---

## Safety Rules
1. **Never run `DROP TABLE` or `TRUNCATE` without confirming with the user first**
2. **Production writes** → always call `confirm_connector_operation` first
3. **Long queries** → add `LIMIT` to prevent runaway reads
4. **Sensitive data** → never log full rows that might contain PII
5. **Schema changes** → test on development first, then apply to production

---

## Database Status Check

```javascript
// Quick health check
const health = await executeSql({
  sqlQuery: "SELECT version(), current_database(), pg_size_pretty(pg_database_size(current_database())) as db_size",
  environment: "development"
});
console.log(health.output);
```

---

## Related Skills
- `environment-secrets` — `DATABASE_URL` is stored as a secret
- `deployment` — Production database is separate from development
- `supabase-postgres-best-practices` — Postgres query optimization patterns
