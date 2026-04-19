# Package Management Skill

## What It Does
Installs and manages language packages (npm, pip, cargo), system dependencies (via Nix), and programming language runtimes. This is the only correct way to install packages in the Replit NixOS environment — never use `apt`, `brew`, or raw `pip install`.

## When to Use
- Installing new npm packages for the frontend
- Installing new Python packages for the backend
- Installing system-level tools (ffmpeg, imagemagick, etc.)
- Checking available language versions
- Removing packages that are no longer needed

## Installation Priority
1. **Language packages** (preferred) — tracked in package.json / requirements.txt
2. **System dependencies (Nix)** — for OS-level binaries and libraries
3. **Language runtimes** — installing Python 3.12, Node.js 20, etc.

## Available Functions
```javascript
// Install npm packages
await installLanguagePackages({
    language: "nodejs",  // NOT "node", "js", or "javascript"
    packages: ["axios", "framer-motion"]
});

// Install pip packages
await installLanguagePackages({
    language: "python",  // NOT "py" or "pip"
    packages: ["fastapi", "pillow", "yt-dlp"]
});

// Install system dependencies
await installSystemDependencies({
    packages: ["ffmpeg", "imagemagick", "ghostscript"]
});

// Install a language runtime
await installProgrammingLanguage({ language: "python-3.12" });

// List available modules
await listAvailableModules({ langName: "python" });
```

## Critical Rules
- Language: use `"nodejs"` for JS/TS — NEVER `"node"`, `"js"`, `"javascript"`
- Language: use `"python"` for Python — NEVER `"py"`, `"pip"`
- `packages` must be an **array of strings**: `["express"]` not `"express"`
- For X11 libraries use `xorg.` prefix: `xorg.libxcb`
- `ca-certificates` = `cacert` in Nix

## After Installing
- Package installations automatically reboot all workflows
- `package.json` / `requirements.txt` are updated automatically
- Check workflow logs after restart to confirm packages load

## Related Skills
- `workflows` — Restarting workflows after package changes
- `repl_setup` — Framework-specific configuration
