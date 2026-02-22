import os
from dotenv import load_dotenv
from google import genai
import json

# --- 1. CONFIGURATION ---
load_dotenv()
# Replace these with your actual keys or set them in your environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

def generate_personalized_impact():
    prompt = f"""
    You are a civic policy analyst.
    There is a bill that increases income tax for free childcare. 
    Your task:
    1. Explain clearly how this policy would affect this person specifically. Take into account their social, economic, and personal background.
    Return ONLY valid JSON in this format:

    {{
    "personalized_impact": "...",
    "impact_tags": {{
        "financial": "low | medium | high | none",
    }}
    }}
    """

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
            )
        text = response.text.strip().strip("```json").strip("```").strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini API Error:", e)  # Log the error details
        raise ValueError("Gemini returned invalid JSON.")