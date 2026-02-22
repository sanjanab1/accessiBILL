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


# def generate_personalized_impact(raw_input: str):
#     # Parse the raw input into bill summary and user context
#     try:
#         parsed_input = json.loads(raw_input)
#         bill_summary = parsed_input.get("bill_summary", "No summary provided.")
#         user_context = parsed_input.get("user_context", "No context provided.")
#     except json.JSONDecodeError:
#         bill_summary = raw_input  # Treat the entire input as the bill summary if parsing fails
#         user_context = "No context provided."

#     prompt = f"""
# You are a civic policy analyst.

# Below is a plain-language summary of a public policy:

# --- POLICY SUMMARY ---
# {bill_summary}
# ----------------------

# Below is the profile of a specific individual:

# --- USER PROFILE ---
# {user_context}
# ---------------------

# Your task:
# 1. Explain clearly how this policy would affect this person specifically. Take into account their social, economic, and personal background. If no context is provided, just explain the bill or policy at a general level.
# 2. Consider financial, housing, transportation, education, and employment effects.
# 3. Be practical and realistic.
# 4. Use clear, non-technical language.
# 5. Do NOT be political or persuasive.

# Return ONLY valid JSON in this format:

# {{
#   "personalized_impact": "...",
#   "impact_tags": {{
#       "financial": "low | medium | high | none",
#       "housing": "low | medium | high | none",
#       "transportation": "low | medium | high | none",
#       "education": "low | medium | high | none",
#       "employment": "low | medium | high | none"
#   }}
# }}
# """

#     print("Generated Prompt:", prompt)  # Log the prompt for debugging

#     try:
#         response = model.generate_content(prompt)
#         print("Raw Response:", response.text)  # Log the raw response for debugging
#         return json.loads(response.text)
#     except Exception as e:
#         print("Gemini API Error:", e)  # Log the error details
#         raise ValueError("Gemini returned invalid JSON.")


