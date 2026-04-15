# ISHU TOOLS

Full-stack tools platform with:

- Python FastAPI backend for PDF, image, and text processing
- React + TypeScript frontend with animated dark UI and lazy-loaded pages
- Dedicated route per tool (`/tools/:slug`)
- Category + search based tool discovery

## Project Structure

- `backend/` Python API and tool handlers
- `frontend/` React client app

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# Optional: install extended converters for rare formats
# pip install -r requirements-optional.txt
python run.py
```

Backend runs on: `http://localhost:8000`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Build Checks

```bash
cd frontend
npm run build
npm run lint
```

## Storage and Git

- Runtime outputs in `backend/storage` are generated artifacts and are ignored by default.
- Only folder placeholders are tracked (`backend/storage/.gitkeep`, `backend/storage/smoke-fixtures/.gitkeep`).
- If you want to push a specific generated file, use `git add -f <path>` intentionally.

## Vercel Notes

- Frontend includes `frontend/vercel.json` rewrite rules for SPA routes.
- Set `VITE_API_BASE_URL` in Vercel Environment Variables to your deployed backend API URL.

## Current Coverage

- 22 categories
- 266 tools registered
- Includes core and advanced groups: PDF workflows and insights, office conversion, OCR/vision, image editing/layout/enhancement, metadata and security, export/data tools, text operations and cleanup, and batch archive automation tools.

## Backend Smoke Validation

Run an automated smoke matrix against representative PDF, image, text, and conversion tools:

```bash
cd backend
python scripts/smoke_tool_matrix.py
```

## Python 3.14 Note

- `rembg` is optional on Python 3.14+ due upstream Pillow constraints.
- `remove-background` tool still works with an automatic local fallback if `rembg` is unavailable.

## Authentication Note

- The current app has no login/auth module. If the browser shows auto-login prompts,
  they come from the browser password manager, not from this codebase.
