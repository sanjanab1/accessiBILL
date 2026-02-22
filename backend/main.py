from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/personalize")
def personalize(data: dict):
    return {
        "personalized_impact": "Test response from backend.",
        "impact_tags": {
            "financial": "medium",
            "housing": "low",
            "transportation": "high",
            "education": "none",
            "employment": "low"
        }
    }