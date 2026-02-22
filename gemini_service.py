import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

def generate_personalized_impact(bill_summary: str = "", user_context: str = ""):
    prompt = f"""
    You are a civic policy analyst.
    
    Bill summary: {bill_summary}
    User context: {user_context}
    
    Your task:
    1. Explain clearly how this policy would affect this person specifically. Take into account their social, economic, and personal background.
    
    Return ONLY valid JSON in this format, no markdown, no backticks:
    {{
        "personalized_impact": "...",
        "impact_tags": {{
            "financial": "low | medium | high | none",
            "healthcare": "low | medium | high | none",
            "education": "low | medium | high | none",
            "housing": "low | medium | high | none"
        }}
    }}
    """

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        text = response.text.strip()
        # clean any markdown wrapping
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        print("Gemini API Error:", e)
        raise ValueError("Gemini returned invalid JSON.")