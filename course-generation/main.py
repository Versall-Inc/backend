import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router
from config.settings import PORT

app = FastAPI(
    title="Course Generation API",
    description="API for generating and managing educational content",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)