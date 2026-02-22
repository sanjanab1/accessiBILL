from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import PersonalizationRequest
from gemini_service import generate_personalized_impact


#debugging
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app = FastAPI()

model = genai.GenerativeModel("gemini-2.5-flash-lite")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}

'''
@app.post("/personalize")
def personalize(data: dict):
    print("Received from frontend:", data)

    return {
        "personalized_impact": "This is a TEST response. Frontend and backend are connected.",
        "impact_tags": {
            "financial": "low",
            "housing": "none",
            "transportation": "low",
            "education": "none",
            "employment": "none"
        }
    }
'''

@app.post("/personalize")
def personalize_policy(request: PersonalizationRequest):

    result = generate_personalized_impact(
        bill_summary=request.bill_summary,
        user_context=request.user_context.dict()
    )

    return result

#debugging
'''
@app.get("/test-gemini")
def test_gemini():
    try:
        response = model.generate_content(
            "Explain in one sentence how a 1% property tax increase affects renters."
        )
        return {"result": response.text}
    except Exception as e:
        print("Test Gemini Error:", e)  # Log the error details
        return {"error": "Failed to connect to Gemini API", "details": str(e)}


'''