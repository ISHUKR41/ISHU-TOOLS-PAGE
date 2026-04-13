from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
STORAGE_DIR = BASE_DIR / "storage"
JOBS_DIR = STORAGE_DIR / "jobs"
MAX_UPLOAD_MB = 150

for path in (STORAGE_DIR, JOBS_DIR):
    path.mkdir(parents=True, exist_ok=True)
