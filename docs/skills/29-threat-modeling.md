# Threat Modeling Skill

## What It Does
Performs structured threat modeling analysis for a project, identifying potential security threats, attack vectors, and mitigation strategies. Outputs a comprehensive `threat_model.md` file.

## When to Use
- Before launching a production application
- After significant architectural changes
- User asks "how secure is this app?"
- Planning security hardening
- Compliance requirements (GDPR, SOC2, etc.)

## Threat Modeling Framework (STRIDE)
| Threat | Description | Example |
|---|---|---|
| **S**poofing | Pretending to be someone else | Fake user identity |
| **T**ampering | Modifying data or code | Changing file content mid-upload |
| **R**epudiation | Denying actions | No audit log for file processing |
| **I**nformation Disclosure | Exposing private data | Leaked temp files |
| **D**enial of Service | Crashing/overloading | Upload bomb (huge file) |
| **E**levation of Privilege | Gaining unauthorized access | Path traversal to /etc/passwd |

## ISHU TOOLS Specific Threats

### High Priority
1. **Path Traversal** — Filenames like `../../etc/passwd` in upload handlers
2. **Upload Size Bomb** — Multi-GB files crashing the server
3. **Rate Limit Bypass** — Bypassing 60 req/min limit
4. **Temp File Leakage** — Files not deleted after processing
5. **SSRF** — URL-to-PDF tool fetching internal metadata endpoints

### Medium Priority
1. **ReDoS** — Regex in text tools vulnerable to catastrophic backtracking
2. **Zip Bomb** — Compressed files that expand to huge sizes
3. **XXE** — XML parsing in document converters

### Mitigations Applied
- File type validation with `python-magic` (checks MIME, not extension)
- Max file size limits (50MB per file)
- Temp file cleanup in `finally` blocks
- Rate limiting: 60 req/min per IP
- Path sanitization for all filename outputs

## Output Format
The skill creates `threat_model.md` with:
1. Executive Summary
2. Architecture Overview
3. Asset Inventory
4. Threat Enumeration (by STRIDE category)
5. Risk Matrix (impact × likelihood)
6. Mitigations Implemented
7. Recommended Next Steps

## Related Skills
- `security_scan` — Automated vulnerability scanning
- `diagnostics` — Code quality checks
- `environment-secrets` — Ensuring secrets aren't exposed
