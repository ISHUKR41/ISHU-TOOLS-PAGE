# Threat Modeling Skill — Ultra-Detailed Reference

## What It Does
Performs structured security threat analysis using the STRIDE methodology and creates a comprehensive `threat_model.md` document. Identifies attack vectors specific to ISHU TOOLS' architecture (file uploads, URL processing, PDF generation, video downloading) and produces a prioritized risk matrix with concrete mitigations.

---

## When to Use

- Before the first production deployment
- After adding a major new attack surface (file uploads, URL input, user accounts)
- User asks "how secure is this?" or "what are the security risks?"
- Preparing for a compliance review (GDPR, ISO 27001)
- After a security incident — what else might be vulnerable?
- Quarterly security review

---

## STRIDE Framework for ISHU TOOLS

| Threat | Description | ISHU TOOLS Example |
|---|---|---|
| **S**poofing | Pretending to be someone else | Fake admin session cookie |
| **T**ampering | Modifying data in transit or storage | Modified PDF mid-download |
| **R**epudiation | Denying performing an action | No audit trail for tool usage |
| **I**nformation Disclosure | Exposing private data | Temp file accessible to other users |
| **D**enial of Service | Crashing or overloading the service | 500MB PDF upload bomb |
| **E**levation of Privilege | Accessing unauthorized resources | Path traversal to `/etc/passwd` |

---

## ISHU TOOLS Attack Surface Inventory

### 1. File Upload Endpoints (HIGHEST RISK)
```
Route: POST /api/tools/{slug}/run (with file input)
Accepts: PDF, PNG, JPG, JPEG, WEBP, GIF, DOCX, XLSX, PPTX
Risk: Malicious file content, path traversal, zip bombs, polyglot files
```

### 2. URL Input Handlers (HIGH RISK)
```
Tools: stream-downloader, video-thumbnail-downloader, url-to-pdf
Risk: SSRF (Server-Side Request Forgery) — fetching internal metadata
Risk: URL schemes: file://, gopher://, dict://, ftp://
```

### 3. Text Input Handlers (MEDIUM RISK)
```
Tools: json-formatter, base64-tool, number-to-words
Risk: ReDoS — malicious regex-triggering input
Risk: Very long strings causing memory exhaustion
```

### 4. Code/Formula Input (MEDIUM RISK)
```
Tools: equation-solver, matrix-calculator, statistics-calculator
Risk: Arbitrary code execution if eval() is used unsafely
```

### 5. External Process Invocations (HIGH RISK)
```
Tools: compress-pdf (ghostscript), convert-image (imagemagick), audio-extractor (yt-dlp)
Risk: Command injection if user input reaches subprocess args
```

---

## High Priority Threats & Mitigations

### Path Traversal
```python
# Threat: User uploads file named "../../etc/passwd" or "../../secret.txt"

# ❌ VULNERABLE:
save_path = f"/tmp/uploads/{user_filename}"

# ✓ SECURE:
import os
from pathlib import Path

safe_filename = Path(user_filename).name  # Strips directory components
save_path = Path("/tmp/uploads") / safe_filename

# Extra check: verify path is within allowed directory
assert str(save_path).startswith("/tmp/uploads/"), "Path traversal detected"
```

### SSRF via URL Input
```python
# Threat: User submits https://169.254.169.254/latest/meta-data/ (AWS metadata)
# or http://localhost:8000/admin, or file:///etc/passwd

# ✓ SECURE:
import re
from urllib.parse import urlparse

BLOCKED_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "metadata.google.internal"}
ALLOWED_SCHEMES = {"http", "https"}

def validate_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ALLOWED_SCHEMES:
            return False  # Block file://, ftp://, gopher://, etc.
        if parsed.hostname in BLOCKED_HOSTS:
            return False  # Block internal hosts
        if parsed.hostname and (parsed.hostname.startswith("10.") 
                                or parsed.hostname.startswith("192.168.")
                                or parsed.hostname.startswith("172.")):
            return False  # Block RFC1918 private ranges
        return True
    except Exception:
        return False
```

### Command Injection in Subprocess Calls
```python
# Threat: User input appears in shell command

# ❌ VULNERABLE:
os.system(f"gs -o output.pdf {user_filename}")  # Shell injection!

# ✓ SECURE: Use list form — no shell, no injection
subprocess.run(
    ["gs", "-o", output_path, input_path],  # List form — shell=False by default
    check=True,
    capture_output=True,
    timeout=60,
)
```

### DoS via Upload Size
```python
# ✓ SECURE: Enforce size limit before processing
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

@app.post("/api/tools/{slug}/run")
async def run_tool(
    slug: str,
    file: UploadFile = File(None),
):
    if file:
        content = await file.read(MAX_FILE_SIZE + 1)
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(413, f"File too large. Maximum: {MAX_FILE_SIZE // (1024*1024)}MB")
```

### ReDoS in Text Tools
```python
# Threat: Catastrophic regex backtracking on crafted input
# Example vulnerable: re.match(r"(a+)+$", "a" * 100 + "!")  # Exponential

# ✓ SECURE:
import re

# Set timeouts on regex operations
import signal

def timeout_regex(pattern, text, timeout=2):
    def handler(signum, frame):
        raise TimeoutError("Regex timed out")
    
    signal.signal(signal.SIGALRM, handler)
    signal.alarm(timeout)
    try:
        return re.match(pattern, text)
    finally:
        signal.alarm(0)
```

---

## Output: threat_model.md Structure

The skill creates `threat_model.md` with:

```markdown
# ISHU TOOLS — Threat Model (April 2026)

## 1. Executive Summary
[3-5 sentences: overall risk level, key threats, mitigations status]

## 2. Architecture Overview
[Diagram of system components and trust boundaries]

## 3. Asset Inventory
| Asset | Sensitivity | Location |
|---|---|---|
| User-uploaded files | HIGH — may contain personal data | /tmp/uploads/ |
| Backend API | HIGH | FastAPI port 8000 |

## 4. Threat Enumeration (STRIDE)
[For each threat: description, attack scenario, likelihood, impact, mitigation]

## 5. Risk Matrix
[2D grid: Impact (Low→Critical) × Likelihood (Rare→Certain)]

## 6. Implemented Mitigations
[What's already done]

## 7. Recommended Next Steps (Prioritized)
[What should be done, in order of risk]
```

---

## Related Skills
- `security_scan` — Automated vulnerability scanning (run before manual threat modeling)
- `environment-secrets` — Ensure secrets aren't exposed
- `diagnostics` — Code quality checks that overlap with security
