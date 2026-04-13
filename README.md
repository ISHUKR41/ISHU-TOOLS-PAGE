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

## Vercel Notes

- Frontend includes `frontend/vercel.json` rewrite rules for SPA routes.
- Set `VITE_API_BASE_URL` in Vercel Environment Variables to your deployed backend API URL.

## Current Coverage

- 22 categories
- 127 working tools registered
- Includes core and advanced groups: PDF workflows and insights, office conversion, OCR/vision, image editing/layout/enhancement, metadata and security, export/data tools, text operations and cleanup, and batch archive automation tools.

## Python 3.14 Note

- `rembg` is optional on Python 3.14+ due upstream Pillow constraints.
- `remove-background` tool still works with an automatic local fallback if `rembg` is unavailable.
