import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes import router as api_router

app = FastAPI(
    title="TeaML — Indian Chai & Botanical Sommelier Platform",
    version="1.0.0",
    description="Unified Enterprise Backend & AI Recommendation Engine for TeaML",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes on both /api and /api/v1
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="/api/v1")

# Mount Static Frontend (if built)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    # Mount assets folder for static scripts and styles
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all route to serve index.html for Single Page Application routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API calls to pass through
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend build not found. Run npm run build inside frontend/"}

@app.get("/")
async def root():
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "status": "online",
        "service": "TeaML Unified AI Engine & Web Platform",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
