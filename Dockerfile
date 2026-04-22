FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# ── System dependencies required by the toolset ─────────────────────────
# FFmpeg          → audio/video tools (130+)
# poppler-utils   → PDF rendering (pdf2image, etc.)
# tesseract-ocr   → OCR tools
# libmagic1       → python-magic file detection
# libgl1, libglib → opencv-python-headless runtime
# libsndfile1     → audio file IO
# fonts-dejavu    → reportlab / matplotlib fallback fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg \
        poppler-utils \
        tesseract-ocr \
        libmagic1 \
        libgl1 \
        libglib2.0-0 \
        libsndfile1 \
        fonts-dejavu-core \
        ca-certificates \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better Docker layer caching)
COPY requirements.txt ./
RUN pip install --upgrade pip \
 && pip install -r requirements.txt

# Copy application code
COPY backend ./backend
COPY api ./api
COPY scripts ./scripts

# Render injects $PORT at runtime
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
