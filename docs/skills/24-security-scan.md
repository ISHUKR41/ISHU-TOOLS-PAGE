# Security Scan Skill — Ultra-Detailed Reference

## What It Does
Runs three types of comprehensive security scans on the ISHU TOOLS codebase: dependency vulnerability auditing (CVEs in packages), static application security testing (SAST — code-level issues), and secret detection (HoundDog — finds exposed credentials). Returns prioritized reports with CRITICAL issues first.

**Use BEFORE every production deploy and after adding new packages.**

---

## The Three Scan Types

### 1. Dependency Audit (`runDependencyAudit`)
Scans all installed packages (npm + pip) against the National Vulnerability Database (NVD) and other CVE databases. Finds:
- Known CVEs in specific package versions
- Packages with unfixed vulnerabilities
- Transitive dependency issues (your package is fine, but it uses a vulnerable package)

```javascript
const audit = await runDependencyAudit();
console.log(audit.output);
// Example output:
// HIGH: Pillow 9.x — CVE-2023-44271 — Uncontrolled resource consumption
//   → Fix: Upgrade to Pillow 10.0.1
// MEDIUM: yt-dlp 2023.x — outdated, patch recommended
```

### 2. SAST Scan (`runSastScan`)
Static code analysis — reads your source code and finds security anti-patterns:

| Pattern | Description |
|---|---|
| SQL injection | Unsanitized user input in SQL queries |
| XSS vulnerabilities | User input rendered as HTML without escaping |
| Path traversal | `../../etc/passwd` style attacks in file paths |
| Insecure randomness | `random.random()` for security tokens (use `secrets` module) |
| Hardcoded credentials | API keys or passwords in code |
| Command injection | User input in `subprocess.run()` calls |
| SSRF | User-controlled URLs fetched server-side |
| Insecure deserialization | `pickle.loads()` with user input |

```javascript
const sast = await runSastScan();
console.log(sast.output);
// Example:
// CRITICAL: backend/app/tools/handlers.py:1234 — Path traversal vulnerability
//   Code: open(user_filename) — user_filename not sanitized
//   Fix: validate filename, use os.path.basename, restrict to upload directory
```

### 3. HoundDog Scan (`runHoundDogScan`)
Detects exposed secrets and credentials in source code:
- API keys accidentally in code (AWS keys, OpenAI keys, Stripe keys)
- Database connection strings hardcoded
- JWT secrets in source
- Private keys / certificates committed to repo

```javascript
const hound = await runHoundDogScan();
console.log(hound.output);
// If clean:
// No secrets detected ✓
// If issue:
// HIGH: backend/config.py:12 — Hardcoded API key detected
//   Pattern matched: "sk-proj-..." (OpenAI key pattern)
```

---

## Running All Three (Standard Security Check)
```javascript
// Run all three scans and get a combined report
const [audit, sast, hound] = await Promise.all([
  runDependencyAudit(),
  runSastScan(),
  runHoundDogScan()
]);

// Parse and prioritize
const allFindings = [audit, sast, hound]
  .map(r => r.output)
  .join("\n\n---\n\n");
console.log(allFindings);
```

---

## ISHU TOOLS-Specific Security Risks

### 1. File Upload Vulnerabilities (HIGH RISK)
ISHU TOOLS handles PDF and image uploads from users. Critical checks:

```python
# backend/app/main.py or handlers — secure file handling

import os
import tempfile
from pathlib import Path

ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

def validate_upload(file: UploadFile) -> None:
    # 1. Check extension (case-insensitive)
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type {ext} not allowed")
    
    # 2. Check MIME type (more reliable than extension)
    # Read first few bytes for magic number validation
    
    # 3. File size limit enforced in the route decorator
    
    # 4. Save to temp dir — NEVER use user-supplied filename
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        return tmp.name  # Use this path, not the original filename
```

### 2. Path Traversal in File Operations (CRITICAL)
```python
# ❌ VULNERABLE — user controls the path
output_path = f"/tmp/output/{user_input}"
open(output_path, 'rb')  # User could do ../../etc/passwd

# ✓ SECURE — normalize and restrict
import os
safe_name = os.path.basename(user_filename)  # Strip directory components
output_path = os.path.join("/tmp/ishu_outputs", safe_name)
# Verify it's still in the allowed directory
assert output_path.startswith("/tmp/ishu_outputs/")
```

### 3. yt-dlp SSRF (Server-Side Request Forgery)
```python
# ❌ VULNERABLE — attacker fetches internal services
url = user_input  # could be http://localhost:8000/admin or file:///etc/passwd

# ✓ SECURE — validate URL scheme and host
from urllib.parse import urlparse

def validate_video_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        return False  # Block file://, ftp://, etc.
    if parsed.netloc in ('localhost', '127.0.0.1', '0.0.0.0'):
        return False  # Block internal URLs
    return True
```

### 4. Rate Limiting (REQUIRED)
Without rate limiting, anyone can spam tool requests and exhaust server resources:
```python
# FastAPI rate limiting with slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/tools/{slug}/run")
@limiter.limit("30/minute")  # 30 requests per minute per IP
async def run_tool(slug: str, request: Request, ...):
    ...
```

### 5. Temporary File Cleanup (IMPORTANT)
```python
# ❌ WRONG — temp files pile up, disk fills
def process_pdf(file_path: str) -> dict:
    output = subprocess.run(["gs", "-o", "/tmp/output.pdf", file_path])
    return output  # Temp files never cleaned

# ✓ CORRECT — always clean up
import tempfile
import contextlib

@contextlib.contextmanager
def temp_file(suffix: str):
    path = tempfile.mktemp(suffix=suffix)
    try:
        yield path
    finally:
        with contextlib.suppress(FileNotFoundError):
            os.unlink(path)

with temp_file(".pdf") as tmp:
    subprocess.run(["gs", "-o", tmp, input_pdf])
    # Process result
# File deleted automatically
```

---

## Severity Levels & Response

| Level | Action Required |
|---|---|
| **CRITICAL** | Fix immediately before deploy — stop all work |
| **HIGH** | Fix before next production deploy |
| **MEDIUM** | Fix within current sprint, track in issues |
| **LOW** | Fix in next cleanup cycle |
| **INFO** | Awareness only — no action required |

---

## Pre-Deploy Security Checklist for ISHU TOOLS
- [ ] `runDependencyAudit` — no HIGH/CRITICAL CVEs
- [ ] `runSastScan` — no CRITICAL findings
- [ ] `runHoundDogScan` — no secrets detected
- [ ] File upload validation: extension + MIME check + size limit
- [ ] Rate limiting on `/api/tools/:slug/run`
- [ ] Temp files cleaned up in all handlers
- [ ] No user-supplied filenames used directly in `open()`
- [ ] `SECRET_KEY` is set and is a secure random string
- [ ] CORS configured to only allow the production domain in production

---

## Related Skills
- `environment-secrets` — Fix hardcoded secrets found by HoundDog
- `threat_modeling` — Deeper structured threat analysis (STRIDE methodology)
- `diagnostics` — TypeScript/code quality errors
- `deployment` — Run security scan before every production deploy
