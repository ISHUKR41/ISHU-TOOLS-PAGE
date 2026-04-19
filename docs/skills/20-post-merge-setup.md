# Post Merge Setup Skill

## What It Does
Maintains a setup script (`post_merge_setup.sh`) that runs automatically after task agents merge their code into the main branch. This ensures the environment is correctly configured after merges — including installing new dependencies, running migrations, and restarting workflows.

## When to Use
- After a task agent completes work and it's merged
- If the post-merge script fails after a merge
- Adding new setup steps for future merges
- Ensuring environment consistency after code merges

## The Setup Script
Located at: `.local/scripts/post_merge_setup.sh`

This script runs automatically after each approved task merge and should:
1. Install any new npm or pip packages added by the task
2. Run database migrations if schema changed
3. Restart relevant workflows
4. Verify the app starts correctly

## Script Template
```bash
#!/bin/bash
set -e

echo "Running post-merge setup..."

# Install new npm packages
cd frontend && npm install && cd ..

# Install new Python packages
pip install -r backend/requirements.txt

# Run any migrations
# python backend/scripts/migrate.py

# Restart workflows
echo "Post-merge setup complete"
```

## Common Failure Scenarios
- **New package not installed**: Add `pip install` or `npm install` to the script
- **Migration not run**: Add migration command
- **Environment variable missing**: Note that prod needs the var too

## Related Skills
- `project_tasks` — Task agents that trigger this script
- `package-management` — Understanding how packages are installed
- `database` — Running database migrations
- `workflows` — Workflow restart after merge
