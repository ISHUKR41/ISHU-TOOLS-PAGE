# Post Merge Setup Skill — Ultra-Detailed Reference

## What It Does
Maintains and manages the `post_merge_setup.sh` script at `.local/scripts/post_merge_setup.sh`. This script runs **automatically** after a task agent's code is approved and merged into the main branch. It ensures the environment stays consistent after merges — installing new packages, running migrations, restarting services, and verifying the app works.

---

## When to Use
- A task agent merged code that added new Python/npm packages
- After a merge that changed database schema (needs migration)
- The post-merge script itself failed after a merge
- Adding new setup requirements for future task agents to follow
- After a merge that adds new environment variables (document what needs to be set)

---

## The Script Location and Purpose

```
.local/scripts/post_merge_setup.sh
```

This is automatically triggered by Replit's task agent system after each approved PR merge. Think of it as your CI/CD "post-deploy" hook for the development environment.

---

## Full Script Template for ISHU TOOLS

```bash
#!/bin/bash
# post_merge_setup.sh — Runs after every task agent merge
# Keep this updated as the project evolves

set -e  # Exit immediately on any error
set -u  # Treat undefined variables as errors

echo "=== ISHU TOOLS Post-Merge Setup ==="
echo "Starting at: $(date)"

# 1. Install Python dependencies
echo "→ Installing Python packages..."
pip install -r backend/requirements.txt --quiet
echo "✓ Python packages installed"

# 2. Install Node.js dependencies
echo "→ Installing Node.js packages..."
cd /home/runner/workspace/frontend
npm install --silent
cd /home/runner/workspace
echo "✓ Node.js packages installed"

# 3. Run database migrations (if any)
# Uncomment when migrations are added:
# echo "→ Running database migrations..."
# python backend/scripts/migrate.py
# echo "✓ Migrations complete"

# 4. Verify Python can import the app without errors
echo "→ Verifying backend imports..."
python -c "from backend.app.tools.handlers import HANDLERS; print(f'✓ {len(HANDLERS)} handlers loaded')"

# 5. TypeScript compilation check
echo "→ Checking TypeScript compilation..."
cd /home/runner/workspace/frontend
npx tsc --noEmit --pretty 2>&1 | tail -5
cd /home/runner/workspace

# 6. Check for required environment variables
echo "→ Checking required environment variables..."
required_vars=("DATABASE_URL" "SECRET_KEY")
for var in "${required_vars[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "⚠️  WARNING: $var is not set. Some features may not work."
  else
    echo "✓ $var is set"
  fi
done

echo ""
echo "=== Post-merge setup complete! ==="
echo "Workflows need manual restart to pick up changes."
echo "Run: restart_workflow('Backend API') and restart_workflow('Start application')"
```

---

## When the Script Fails

The most common post-merge failures and their fixes:

### New Python package added but not in requirements.txt
```bash
# Task agent forgot to update requirements.txt
# Fix: add the package and update the script
echo "new-package>=1.0.0" >> backend/requirements.txt
```

### New npm package added but not installed
```bash
# Fix: update package.json and run install
cd frontend && npm install new-package
```

### Database migration not run
```bash
# Fix: run the migration manually then add it to the script
python backend/scripts/migrate.py
# Then update post_merge_setup.sh to run this automatically
```

### Import error (handler module not found)
```bash
# Fix: install the missing dependency
pip install missing-module
```

### TypeScript errors introduced by the merge
```bash
# Fix: resolve the TypeScript errors
# Run: npx tsc --noEmit in frontend/
# Fix the errors, then confirm the merge is clean
```

---

## Keeping the Script Updated

Every time a task agent adds something that requires environment setup, update this script:

```bash
# If a new handler uses requests library:
echo "requests>=2.31.0" >> backend/requirements.txt
# Add to script: pip install -r backend/requirements.txt

# If a new feature uses React Query:
# frontend package.json already has it — script's npm install picks it up

# If a new migration needs to run:
# Add: python backend/scripts/migrate.py to the script

# If a new environment variable is needed:
# Add a check in the "required_vars" array
```

---

## Testing the Script Manually

Before trusting it for automated runs:

```bash
# Run the script manually to verify it works
bash .local/scripts/post_merge_setup.sh

# Check exit code
echo "Exit code: $?"  # Should be 0 for success
```

---

## Related Skills
- `project_tasks` — Task agents that trigger this script after merges
- `package-management` — Understanding package installation in Replit
- `database` — Running database migrations in the script
- `workflows` — Why workflow restart is still needed after the script runs
