# Security Scan Skill

## What It Does
Runs comprehensive security scans on the codebase, identifying vulnerabilities in dependencies, static analysis issues (SAST), and sensitive data exposures. Produces prioritized security reports with critical/high findings first.

## When to Use
- Before deploying to production
- After adding new packages (dependency audit)
- User asks "is my code secure?" or "scan for vulnerabilities"
- Regularly as part of security-conscious development
- After a security incident or concern

## Three Types of Scans

### 1. Dependency Audit (`runDependencyAudit`)
Checks for known CVEs in installed packages:
```javascript
const result = await runDependencyAudit();
// Returns: list of vulnerable packages, severity, CVE IDs, fix versions
```

### 2. SAST Scan (`runSastScan`)
Static code analysis for security patterns:
- SQL injection vulnerabilities
- XSS potential
- Hardcoded secrets
- Insecure random number generation
- Path traversal vulnerabilities
```javascript
const result = await runSastScan();
```

### 3. HoundDog Scan (`runHoundDogScan`)
Detects exposed secrets and credentials:
- API keys accidentally committed
- Database passwords in code
- Auth tokens in source files
```javascript
const result = await runHoundDogScan();
```

## Report Format
Results are prioritized: **CRITICAL → HIGH → MEDIUM → LOW → INFO**

```
CRITICAL: 0
HIGH: 2 findings
  - [package]: [CVE-XXXX-YYYY] — Upgrade to X.X.X
  - [file:line]: Hardcoded API key detected
MEDIUM: 5 findings
...
```

## Common Issues for ISHU TOOLS
- File upload validation (ensure only allowed file types)
- Path traversal in file processing (`../../etc/passwd`)
- Rate limiting on API endpoints
- Temporary file cleanup after processing

## Related Skills
- `environment-secrets` — Ensuring secrets aren't hardcoded
- `diagnostics` — TypeScript/code quality checks
- `threat_modeling` — Structured threat analysis
