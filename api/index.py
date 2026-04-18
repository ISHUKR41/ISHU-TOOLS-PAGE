import sys
import os

# Add project root to path so backend module can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

# Vercel expects a callable named 'app' or 'handler'
# FastAPI's app is an ASGI app which Vercel supports natively

