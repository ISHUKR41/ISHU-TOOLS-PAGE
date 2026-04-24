from pathlib import Path
import sys

import uvicorn

if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[1]
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))

    # reload=False on Replit: Replit's workflow watcher already restarts on
    # source changes, and uvicorn's WatchFiles double-restart kills in-flight
    # requests during testing. Disabling reload makes the backend stable.
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)
