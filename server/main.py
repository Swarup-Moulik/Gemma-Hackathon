import os

from dotenv import load_dotenv

load_dotenv()

from database import close_mongo_connection, connect_to_mongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import analyze_router, report_router

app = FastAPI(
    title="AgriRescue AI Backend",
    description="Gemma 4 Multimodal Offline API Engine",
    version="1.0.0",
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static uploads directory for images
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Lifespan Database Connection Events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


# Health Check Route
@app.get("/api/health")
def health_check():
    return {
        "status": "OK",
        "engine": "Gemma 4 Multimodal Engine",
        "database": "MongoDB Motor Connected",
    }


# Register Routers
app.include_router(analyze_router.router, prefix="/api", tags=["Analysis"])
app.include_router(report_router.router, prefix="/api", tags=["Reports"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
