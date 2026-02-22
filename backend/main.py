import json
import cv2
import pytesseract
import numpy as np
from fastapi import UploadFile, File

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from plots import plot_impact_dashboard, plot_impact_dashboard2

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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

@app.post("/plot")
def plot(data: dict):
    state_name = data.get("state_name", "Texas")
    bill_summary = data.get("bill_summary", "Completely get rid of violent crime. No criminals leave prison. Life sentences for all.")
    
    crime_json = plot_impact_dashboard(state_name, bill_summary)
    tax_json = plot_impact_dashboard2(state_name, bill_summary)
    
    return {
        "crime_plot": json.loads(crime_json),
        "tax_plot": json.loads(tax_json)
    }


def process_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    text = pytesseract.image_to_string(gray)
    return text.strip() if text.strip() else "No text detected."

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    text = process_image(image)
    return {"text": text}