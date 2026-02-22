import google.generativeai as genai
from config import GEMINI_API_KEY
import json

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    "gemini-2.5-flash-lite",
    generation_config={
        "temperature": 0.4 #more consistent JSON
    }
)

def generate_personalized_impact(bill_summary: str, user_context: dict):
    
    prompt = f"""
You are a civic policy analyst.

Below is a plain-language summary of a public policy:

--- POLICY SUMMARY ---
{bill_summary}
----------------------

Below is the profile of a specific individual:

--- USER PROFILE ---
{json.dumps(user_context, indent=2)}
---------------------

Your task:
1. Explain clearly how this policy would affect this person specifically. Take into account their social, economic, and personal background.
2. Consider financial, housing, transportation, education, and employment effects.
3. Be practical and realistic.
4. Use clear, non-technical language.
5. Do NOT be political or persuasive.

Return ONLY valid JSON in this format:

{{
  "personalized_impact": "...",
  "impact_tags": {{
      "financial": "low | medium | high | none",
      "housing": "low | medium | high | none",
      "transportation": "low | medium | high | none",
      "education": "low | medium | high | none",
      "employment": "low | medium | high | none"
  }}
}}
"""

    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print("Gemini API Error:", e)  # Log the error details
        raise ValueError("Gemini returned invalid JSON.")


