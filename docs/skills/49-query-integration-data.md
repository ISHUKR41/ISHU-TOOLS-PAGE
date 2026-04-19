# Query Integration Data Skill — Ultra-Detailed Reference

## What It Does
Connects to any Replit-supported integration (Linear, GitHub, HubSpot, Slack, Google Sheets/Drive/Calendar, Stripe, Jira, Notion, Airtable, etc.) or data warehouse (Databricks, Snowflake, BigQuery) to read or write data. All code runs in the `code_execution` sandbox — no separate script files needed.

---

## Activation Triggers
- "Query data from Linear / GitHub / HubSpot / Slack"
- "How many issues were created this week?" (needs external data)
- "Export all users to CSV"
- "Create a ticket in Jira"
- "Update a record in Airtable"
- "Query BigQuery / Snowflake / Databricks"
- Any read/write operation against a connected integration

---

## When to Use

| Scenario | Use This Skill |
|---|---|
| Answer a question from integration data | YES |
| Export data to CSV/JSON | YES |
| Create/update/delete records | YES |
| Ad-hoc data lookups | YES |
| Build a dashboard UI | NO — use `design` skill |
| Add an integration to the app | NO — use `integrations` skill |
| Check deployment logs | NO — use `deployment` skill |

---

## Core Workflow

```javascript
// Step 1: List available connections
const conns = await listConnections('linear');
console.log(conns.length, conns[0]?.displayName);

// Step 2: Get credentials
const { access_token } = conns[0].getClient();

// Step 3: Call the API
const { LinearClient } = await import('@linear/sdk');
const linear = new LinearClient({ accessToken: access_token });
const issues = await linear.issues({ first: 10 });
```

---

## Supported Integration Categories

### Project Management
- **Linear** — Issues, projects, cycles, teams, comments
- **Jira** — Issues, boards, sprints, projects
- **Asana** — Tasks, projects, teams, workspaces
- **GitHub** — Repos, issues, PRs, commits, actions
- **GitLab** — Issues, MRs, pipelines, projects

### CRM & Marketing
- **HubSpot** — Contacts, deals, companies, tickets
- **Salesforce** — Objects (leads, accounts, opportunities)
- **Mailchimp** — Lists, campaigns, subscribers

### Communication
- **Slack** — Messages, channels, users, webhooks
- **Discord** — Messages, guilds, channels

### Productivity
- **Notion** — Pages, databases, blocks
- **Airtable** — Bases, tables, records, views
- **Google Sheets** — Read/write cell data, append rows
- **Google Drive** — Files, folders, permissions
- **Google Calendar** — Events, calendars

### Data Warehouses
- **BigQuery** — SQL queries, dataset management
- **Snowflake** — Query execution, warehouse management
- **Databricks** — Spark jobs, notebooks, clusters

---

## Write Operation Safety

**Always** call `confirm_connector_operation` before write/delete/update operations:

```javascript
// Before creating, updating, or deleting:
await confirm_connector_operation({
  connector: 'linear',
  connectionId: conns[0].id,
  summary: 'Create new Linear issue for bug report',
  operation_type: 'create'
});
// Then execute if approved
```

---

## Example: Query GitHub Issues

```javascript
const conns = await listConnections('github');
const { access_token } = conns[0].getClient();

const resp = await fetch('https://api.github.com/repos/OWNER/REPO/issues?state=open&per_page=10', {
  headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'ReeplitAgent' }
});
const issues = await resp.json();
console.log(issues.map(i => `#${i.number}: ${i.title}`).join('\n'));
```

---

## Example: Query BigQuery

```javascript
const conns = await listConnections('bigquery');
const creds = conns[0].getClient();
// Use googleapis with credentials
const { BigQuery } = await import('@google-cloud/bigquery');
const bq = new BigQuery({ credentials: creds, projectId: creds.project_id });
const [rows] = await bq.query('SELECT * FROM `project.dataset.table` LIMIT 10');
console.log(JSON.stringify(rows, null, 2));
```

---

## Tips & Best Practices
- Variables persist across `code_execution` calls — no need to re-fetch credentials
- Never print credentials to console (they get redacted)
- Use `head_limit` in `grep` tool to preview large data before processing
- For large exports, write to a file and use `present_asset` to deliver it
- Always check `conns.length > 0` before using `conns[0]`
