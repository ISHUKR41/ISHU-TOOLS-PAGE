# Supabase + Postgres Best Practices Skill (User-Provided)

## What It Does
Postgres performance optimization and best practices adapted from Supabase Engineering. Essential for writing, reviewing, or optimizing Postgres queries, schema designs, and database configurations.

## When to Use
- Writing SQL queries that need to be performant
- Designing database schemas
- Slow queries investigation
- Adding indexes
- Row-level security (RLS) setup
- Real-time subscriptions

## Key Best Practices

### 1. Index Everything You Filter By
```sql
-- Bad: full table scan
SELECT * FROM tools WHERE category = 'pdf-core';

-- Good: create index on frequently filtered columns
CREATE INDEX CONCURRENTLY idx_tools_category ON tools(category);
CREATE INDEX CONCURRENTLY idx_tools_slug ON tools(slug);
```

### 2. Use EXPLAIN ANALYZE for Slow Queries
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM tools WHERE category = 'pdf-core' ORDER BY created_at DESC;
```

### 3. Avoid N+1 Queries
```sql
-- Bad: separate query for each tool's category info
-- Good: JOIN once
SELECT t.*, c.label as category_label, c.description as category_desc
FROM tools t
JOIN categories c ON t.category = c.id;
```

### 4. Pagination Best Practice
```sql
-- Bad: OFFSET for large tables (gets slower with high offset)
SELECT * FROM tools LIMIT 20 OFFSET 1000;

-- Good: cursor-based pagination
SELECT * FROM tools 
WHERE id > $last_id 
ORDER BY id ASC 
LIMIT 20;
```

### 5. Connection Pooling
- Use `pgBouncer` or Supabase's pooler for serverless functions
- Replit's managed PostgreSQL handles this automatically

### 6. Row-Level Security (RLS)
```sql
-- Enable RLS for user-specific data
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_owns_files ON user_files
  FOR ALL USING (auth.uid() = user_id);
```

## ISHU TOOLS Schema Design (if adding DB)
```sql
-- Tool usage analytics
CREATE TABLE tool_usage (
  id BIGSERIAL PRIMARY KEY,
  tool_slug TEXT NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  country_code CHAR(2),
  success BOOLEAN
);
CREATE INDEX idx_usage_slug_date ON tool_usage(tool_slug, used_at DESC);
```

## Related Skills
- `database` — Replit's managed PostgreSQL
- `environment-secrets` — DATABASE_URL management
