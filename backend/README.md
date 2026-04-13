# ISHU TOOLS Backend

FastAPI backend with Python-based PDF, image, and text processing tools.

## Run locally

1. Create and activate a Python environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Start API:

   python run.py

Backend URL: http://localhost:8000

## Compatibility

- On Python 3.14+, `rembg` is skipped automatically because of upstream Pillow constraints.
- The `remove-background` API endpoint keeps working through a built-in Pillow fallback.
