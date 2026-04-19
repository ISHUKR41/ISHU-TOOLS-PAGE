# Package Management Skill — Ultra-Detailed Reference

## What It Does
Installs and manages language packages (npm, pip), system-level dependencies (via Nix), and programming language runtimes. This is the ONLY correct method for installing anything in the Replit NixOS environment — never use `apt-get`, `brew`, `dnf`, or raw `pip install` without the skill callbacks.

---

## Installation Priority Order
1. **Language packages** — `npm install` / `pip install` — tracked in `package.json` / `requirements.txt`
2. **System dependencies (Nix)** — for OS-level binaries: `ffmpeg`, `imagemagick`, `ghostscript`
3. **Language runtimes** — installing Python 3.12, Node.js 20 if not available

---

## ISHU TOOLS: Key Installed Packages

### Backend (Python)
```
fastapi          — Web framework
uvicorn          — ASGI server
python-multipart — Form/file upload support
pillow           — Image processing
pypdf2 / pypdf   — PDF operations
python-docx      — Word document processing
yt-dlp           — Video downloading (YouTube, Instagram, etc.)
ghostscript      — PDF compression (system dep)
imagemagick      — Image conversion (system dep)
requests         — HTTP client
```

### Frontend (Node.js)
```
react@19         — UI library
react-dom@19     — DOM rendering
react-router-dom — Client routing
vite             — Build tool
framer-motion    — Animations
lucide-react     — Icons
react-dropzone   — File upload
tailwindcss      — Utility CSS
typescript       — Type checking
@vitejs/plugin-react — Vite React plugin
```

---

## Available Functions (code_execution sandbox)

### Install npm packages
```javascript
await installLanguagePackages({
  language: "nodejs",   // ← MUST be "nodejs" — NOT "node", "js", "javascript"
  packages: ["framer-motion", "lucide-react", "@types/node"]
});
```

### Install pip packages
```javascript
await installLanguagePackages({
  language: "python",   // ← MUST be "python" — NOT "py", "pip", "python3"
  packages: ["pillow", "yt-dlp", "python-docx", "reportlab"]
});
```

### Install system dependencies
```javascript
// For OS-level binaries and libraries
await installSystemDependencies({
  packages: ["ffmpeg", "imagemagick", "ghostscript", "poppler_utils"]
});
```

### Check available packages
```javascript
const available = await listAvailableModules({ langName: "python" });
console.log(available);  // Lists installable modules
```

### Install a language runtime
```javascript
await installProgrammingLanguage({ language: "python-3.12" });
```

---

## Critical Rules — Common Mistakes

```javascript
// ❌ WRONG language name for Node.js
await installLanguagePackages({ language: "node", packages: [...] })      // Fails
await installLanguagePackages({ language: "js", packages: [...] })        // Fails
await installLanguagePackages({ language: "javascript", packages: [...] }) // Fails

// ✓ CORRECT
await installLanguagePackages({ language: "nodejs", packages: [...] })

// ❌ WRONG — packages as string
await installLanguagePackages({ language: "python", packages: "pillow" })

// ✓ CORRECT — packages as array
await installLanguagePackages({ language: "python", packages: ["pillow"] })

// ❌ WRONG — running pip directly in bash
// pip install pillow  ← doesn't persist correctly in Nix

// ✓ CORRECT — use the skill callback
await installLanguagePackages({ language: "python", packages: ["pillow"] })
```

---

## System Dependency Name Mapping (Nix quirks)

| What you want | Nix package name |
|---|---|
| `ca-certificates` | `cacert` |
| `libssl-dev` | `openssl.dev` |
| `libpq-dev` | `postgresql.lib` |
| `libx11-dev` | `xorg.libX11` |
| `libxcb` | `xorg.libxcb` |
| `wkhtmltopdf` | `wkhtmltopdf` |
| `ghostscript` | `ghostscript` |
| `imagemagick` | `imagemagick` |
| `ffmpeg` | `ffmpeg` |
| `poppler-utils` | `poppler_utils` |

---

## After Installing Packages

Replit **automatically restarts workflows** after package installation. However, verify:

```bash
# Confirm Python package is importable
python -c "import pillow; print('ok')"

# Confirm npm package is in node_modules
ls frontend/node_modules/framer-motion/
```

If the workflow fails to restart cleanly:
```javascript
restart_workflow(name="Backend API")
restart_workflow(name="Start application")
```

---

## ISHU TOOLS Backend Dependencies Management

```python
# backend/requirements.txt — always keep this updated
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.9
pillow>=10.0.0
pypdf>=4.0.0
python-docx>=1.1.0
yt-dlp>=2024.1.0
requests>=2.31.0
aiofiles>=23.0.0
# Add new packages here after installing via skill
```

```json
// frontend/package.json — key dependencies
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0",
    "react-dropzone": "^14.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

---

## Installing yt-dlp Updates

yt-dlp releases very frequently (YouTube changes their API constantly). When video downloaders break:

```javascript
// Update yt-dlp to latest
await installLanguagePackages({
  language: "python",
  packages: ["yt-dlp --upgrade"]  // Force latest
});
```

Or via shell:
```bash
yt-dlp --update
```

---

## Troubleshooting

### Package installs but import fails
```bash
# Find where pip installed it
python -c "import site; print(site.getsitepackages())"
# Verify it's in the right site-packages
```

### npm package not found after install
```bash
# Check if it's in node_modules
ls frontend/node_modules/ | grep package-name
# If not, try clean install
cd frontend && npm install
```

### System dependency not working (e.g., ghostscript)
```bash
# Check if binary is in PATH
which gs
gs --version
# If missing, install via system deps skill
```

---

## Related Skills
- `workflows` — Restarting after package installation
- `repl_setup` — Framework setup after adding packages
- `deployment` — Production may need packages pre-installed in build step
