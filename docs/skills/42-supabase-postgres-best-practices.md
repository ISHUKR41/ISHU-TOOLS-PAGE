# Supabase + Postgres Best Practices Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Postgres performance optimization and architectural best practices from Supabase Engineering. Essential when ISHU TOOLS adds database features (user accounts, tool history, analytics, favorites). Covers query optimization, schema design, indexing, RLS, connection pooling, and real-time subscriptions.

---

## ISHU TOOLS Database Roadmap

Currently ISHU TOOLS is stateless (no database). As features grow, a database becomes needed for:

| Feature | Tables Needed |
|---|---|
| User accounts | `users`, `sessions` |
| Tool usage history | `tool_usage` |
| Favorite tools | `user_favorites` |
| Tool analytics | `tool_analytics` |
| User-uploaded file history | `user_files` |
| Rating/feedback | `tool_ratings` |
| Premium subscriptions | `subscriptions` |

---

## Schema Design for ISHU TOOLS

```sql
-- Core tool analytics (no user account needed)
CREATE TABLE tool_usage (
  id           BIGSERIAL PRIMARY KEY,
  tool_slug    TEXT NOT NULL,
  used_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country_code CHAR(2),        -- IP geolocation
  success      BOOLEAN NOT NULL DEFAULT TRUE,
  duration_ms  INTEGER,        -- Processing time
  file_size_kb INTEGER         -- Input file size
);

-- Index for common queries (recent usage by tool)
CREATE INDEX CONCURRENTLY idx_usage_slug_time 
  ON tool_usage (tool_slug, used_at DESC);

-- Index for analytics dashboards
CREATE INDEX CONCURRENTLY idx_usage_day 
  ON tool_usage (DATE_TRUNC('day', used_at));

---

-- Users table (when auth is added)
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_premium   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX CONCURRENTLY idx_users_email ON users (email);

---

-- Favorite tools (user × tool many-to-many)
CREATE TABLE user_favorites (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tool_slug)
);

CREATE INDEX CONCURRENTLY idx_favorites_user ON user_favorites (user_id, saved_at DESC);

---

-- Premium subscriptions
CREATE TABLE subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'active',  -- active, cancelled, past_due
  plan        TEXT NOT NULL,                   -- monthly, yearly
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at     TIMESTAMPTZ,
  stripe_id   TEXT UNIQUE,                     -- Stripe subscription ID
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing'))
);
```

---

## Query Optimization Patterns

### 1. Always Use EXPLAIN ANALYZE
```sql
-- Before deploying any query, check the execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT tool_slug, COUNT(*) as uses
FROM tool_usage
WHERE used_at > NOW() - INTERVAL '7 days'
GROUP BY tool_slug
ORDER BY uses DESC
LIMIT 20;

-- Look for:
-- "Seq Scan" on large tables → needs an index
-- "Bitmap Heap Scan" → index exists, check selectivity
-- High "actual rows" vs "rows" estimate → statistics may need refresh
```

### 2. Index Everything You Filter By
```sql
-- What we filter/sort by in common queries:
-- tool_slug, used_at, user_id, status, country_code

-- Create indexes on high-selectivity filter columns
CREATE INDEX CONCURRENTLY idx_usage_slug ON tool_usage (tool_slug);
CREATE INDEX CONCURRENTLY idx_subs_user_status ON subscriptions (user_id, status);

-- Partial index — only index active subscriptions (smaller, faster)
CREATE INDEX CONCURRENTLY idx_active_subs 
  ON subscriptions (user_id) 
  WHERE status = 'active';
```

### 3. Avoid N+1 Queries
```python
# ❌ N+1: one query per tool for analytics
for slug in tool_slugs:
    count = db.execute("SELECT COUNT(*) FROM tool_usage WHERE tool_slug = $1", slug)

# ✓ One query with GROUP BY
results = db.execute("""
  SELECT tool_slug, COUNT(*) as count
  FROM tool_usage 
  WHERE used_at > NOW() - INTERVAL '30 days'
  GROUP BY tool_slug
""")
```

### 4. Cursor-Based Pagination
```sql
-- ❌ OFFSET pagination — gets slower as page number increases
SELECT * FROM tool_usage ORDER BY used_at DESC LIMIT 20 OFFSET 10000;
-- Must scan 10000 rows to skip them!

-- ✓ Cursor-based — always fast regardless of position
SELECT * FROM tool_usage 
WHERE used_at < $last_seen_timestamp  -- Cursor
ORDER BY used_at DESC 
LIMIT 20;
-- Uses the index directly — O(log n) instead of O(n)
```

### 5. Aggregation Performance
```sql
-- For dashboard analytics, pre-aggregate with a materialized view
CREATE MATERIALIZED VIEW daily_tool_stats AS
SELECT
  DATE_TRUNC('day', used_at) as day,
  tool_slug,
  COUNT(*) as usage_count,
  AVG(duration_ms) as avg_duration,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count
FROM tool_usage
GROUP BY 1, 2;

-- Refresh periodically (not real-time)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_tool_stats;

-- Dashboard query is now instant
SELECT * FROM daily_tool_stats 
WHERE day >= NOW() - INTERVAL '30 days'
ORDER BY day DESC;
```

---

## Row Level Security (RLS) — For Multi-User Data

```sql
-- Enable RLS on user-specific tables
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see/modify their own favorites
CREATE POLICY user_owns_favorites ON user_favorites
  FOR ALL                          -- SELECT, INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id)    -- Can see if row.user_id = current user
  WITH CHECK (auth.uid() = user_id); -- Can insert/update only their own rows

-- Tool analytics: anyone can INSERT (logging), only admin can SELECT all
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_can_log ON tool_usage
  FOR INSERT
  WITH CHECK (TRUE);  -- Anyone can log usage

CREATE POLICY admin_can_read ON tool_usage
  FOR SELECT
  USING (auth.role() = 'service_role');  -- Only service role can query
```

---

## FastAPI + Postgres Integration

```python
# backend/app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.environ["DATABASE_URL"].replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=False, pool_size=5, max_overflow=10)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Usage in route
@app.post("/api/tools/{slug}/run")
async def run_tool(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    # Log usage
    usage = ToolUsage(tool_slug=slug, success=True)
    db.add(usage)
    await db.commit()
```

---

## Connection Pooling for Serverless

```python
# For Autoscale deployment (many short-lived connections)
# Use pgBouncer or Replit's managed pooling

DATABASE_URL = os.environ.get(
    "DATABASE_POOL_URL",  # Pooled URL (via pgBouncer)
    os.environ["DATABASE_URL"]  # Direct URL fallback
)
```

---

## Related Skills
- `database` — Replit's managed PostgreSQL (simpler setup for dev)
- `environment-secrets` — `DATABASE_URL` must be stored as secret
- `deployment` — Production database needs separate connection string
