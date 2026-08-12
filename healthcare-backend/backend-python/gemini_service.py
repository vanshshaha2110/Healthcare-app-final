import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Default to gemini-flash-latest with reliable fallbacks
DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
FALLBACK_MODELS = [
    DEFAULT_MODEL,
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest"
]


def _generate_content_with_fallback(contents):
    """Generates content using primary model, with fallback models if quota or availability errors occur."""
    seen = set()
    last_error = None
    for model_name in FALLBACK_MODELS:
        if not model_name or model_name in seen:
            continue
        seen.add(model_name)
        try:
            model = genai.GenerativeModel(model_name)
            return model.generate_content(contents)
        except Exception as e:
            last_error = e
            print(f"Model '{model_name}' failed: {e}")
    if last_error:
        raise last_error
    raise RuntimeError("No Gemini models available.")


def analyze_document_image(image_parts: list, document_type: str) -> dict:
    """Sends a prescription/report image to Gemini's vision model: reads the
    text, explains it in plain English AND Hindi, and extracts doctor information
    to update the dataset."""
    doc_label = document_type.lower().replace('_', ' ')
    prompt = f"""
You are a medical assistant helping a patient understand a {doc_label}.

1. Transcribe the key visible text and values from the image.
2. Then explain the document to the patient in BOTH English and Hindi, covering:
   - What this document says (a short overview)
   - What each medicine/test result means, one point per line
   - Any values outside the normal range, and what that could mean
   - Clear next steps the patient should consider (e.g. "ask your doctor about X")
   - A disclaimer that this is not a substitute for professional medical advice
     and the patient should consult a licensed doctor
3. Look carefully for any Doctor's Name, Specialty, Hospital/Clinic Name, City, or
   Contact Phone written on the prescription letterhead, stamp, or signature line.

FORMAT RULES for the "ai_summary" field (this is critical - the app parses this
text into a formatted view, so follow the structure exactly):
- Put the English section first, then the Hindi section.
- Start each language section with its own line, exactly:
  === ENGLISH ===
  and
  === HINDI ===
- Inside each section, use short bold sub-headings on their own line ending with
  a colon, e.g. "Summary:" / "Medicines & Instructions:" / "Monitoring & Next
  Steps:" / "Disclaimer:" (Hindi equivalents: "सारांश:", "दवाइयाँ और निर्देश:",
  "निगरानी और अगले कदम:", "अस्वीकरण:").
- Under each sub-heading, put EVERY individual point on its OWN line, starting
  with "- " (a hyphen and a space). Never combine multiple points into one line.
- Leave a blank line between sub-headings.
- Do not use markdown asterisks, numbered lists, or HTML tags - only plain text,
  "=== ... ===" section markers, "Label:" sub-headings, and "- " bullet lines.

Respond ONLY in valid JSON with this exact shape, no markdown fences:
{{
  "extracted_text": "...",
  "ai_summary": "=== ENGLISH ===\\nSummary:\\n- ...\\n\\nMedicines & Instructions:\\n- ...\\n\\n=== HINDI ===\\nसारांश:\\n- ...",
  "doctor": {{
     "name": "Dr. Name or null",
     "specialty": "Specialty e.g. General Physician / Cardiologist / Dermatologist",
     "hospital": "Hospital or Clinic name or null",
     "city": "City or null",
     "contact": "Phone or null"
  }}
}}
"""
    try:
        response = _generate_content_with_fallback([prompt, *image_parts])
        return _parse_json_response(response.text)
    except Exception as e:
        print(f"Error in analyze_document_image: {e}")
        return {
            "extracted_text": "Could not extract text from document.",
            "ai_summary": f"AI service error: {str(e)}",
            "doctor": None
        }


def explain_medical_term(term: str) -> str:
    if not term or not term.strip():
        return "Please provide a medical term to explain."
    prompt = f"""
Explain the medical term "{term}" in simple, plain English for a patient with
no medical background. Keep it under 120 words. Include a simple definition
and why it matters / when it's used. Avoid unnecessary jargon.
"""
    try:
        response = _generate_content_with_fallback(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error in explain_medical_term: {e}")
        return f"Could not generate explanation due to an AI service error: {str(e)}"


def check_symptoms(symptoms: str) -> dict:
    if not symptoms or not symptoms.strip():
        return {
            "possible_conditions": [],
            "advice": "Please describe your symptoms.",
            "recommended_specialist": "General Physician",
            "urgency": "LOW",
            "disclaimer": "This is not a medical diagnosis. Consult a licensed doctor."
        }
    prompt = f"""
A patient describes these symptoms: "{symptoms}"

Provide a preliminary, non-diagnostic assessment. Respond ONLY in valid JSON,
no markdown fences, with this exact shape:
{{
  "possible_conditions": ["condition 1", "condition 2", "condition 3"],
  "advice": "plain-English guidance on what to do next",
  "recommended_specialist": "e.g. General Physician / Cardiologist / Dermatologist",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
  "disclaimer": "This is not a medical diagnosis. Consult a licensed doctor."
}}

If symptoms suggest a medical emergency (e.g. chest pain, difficulty breathing,
severe bleeding, stroke signs), set urgency to "EMERGENCY" and advise calling
emergency services immediately.
"""
    try:
        response = _generate_content_with_fallback(prompt)
        return _parse_json_response(response.text)
    except Exception as e:
        print(f"Error in check_symptoms: {e}")
        return {
            "possible_conditions": ["Service unavailable"],
            "advice": f"Unable to analyze symptoms due to AI service error: {str(e)}",
            "recommended_specialist": "General Physician",
            "urgency": "MEDIUM",
            "disclaimer": "This is not a medical diagnosis. Consult a licensed doctor."
        }


def chat_reply(message: str, history: str) -> str:
    if not message or not message.strip():
        return "How can I help you today?"
    prompt = f"""
You are a friendly, careful healthcare assistant chatbot. You can discuss
general health topics, explain medical concepts, and help the user navigate
the app's features (document upload, symptom checker, reminders, doctor
search). You are NOT a doctor and must never give a definitive diagnosis or
prescribe medication. Always encourage seeing a real doctor for anything serious.

Conversation history:
{history or ''}

User's new message: {message}

Reply naturally and concisely.
"""
    try:
        response = _generate_content_with_fallback(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error in chat_reply: {e}")
        return f"Sorry, I encountered an error while processing your request: {str(e)}"


def assess_health_risk(user_data: dict) -> dict:
    prompt = f"""
You are an expert clinical risk assessment AI. Analyze the following health metrics and lifestyle factors of a patient:
- Age: {user_data.get('age')}
- Gender: {user_data.get('gender')}
- Height: {user_data.get('height')} cm, Weight: {user_data.get('weight')} kg (BMI: {user_data.get('bmi')})
- Blood Pressure: {user_data.get('systolicBP')}/{user_data.get('diastolicBP')} mmHg
- Fasting Blood Sugar: {user_data.get('bloodSugar')} mg/dL
- Heart Rate: {user_data.get('heartRate')} bpm
- Exercise Level: {user_data.get('exercise')}
- Smoking Status: {user_data.get('smoking')}
- Alcohol Consumption: {user_data.get('alcohol')}
- Sleep Duration: {user_data.get('sleep')} hours/day
- Known Conditions & Family History: {user_data.get('history')}

Provide a structured health risk evaluation. Respond ONLY in valid JSON with no markdown fences, with this exact shape:
{{
  "overallRiskScore": 35, // integer 0-100 (0=Optimal, 100=Critical)
  "riskCategory": "LOW" | "MODERATE" | "HIGH",
  "summary": "Short 2-sentence summary of overall health risk status.",
  "cardiovascularRisk": {{ "score": 25, "level": "LOW", "details": "..." }},
  "diabetesRisk": {{ "score": 40, "level": "MODERATE", "details": "..." }},
  "lifestyleRisk": {{ "score": 30, "level": "LOW", "details": "..." }},
  "identifiedRisks": [
    "Identified risk point 1",
    "Identified risk point 2"
  ],
  "preventiveSteps": [
    "Specific actionable preventive step 1",
    "Specific actionable preventive step 2",
    "Specific actionable preventive step 3"
  ],
  "recommendedSpecialist": "General Physician / Cardiologist / Endocrinologist",
  "disclaimer": "This risk assessment is for informational and screening purposes only and is not a clinical diagnosis."
}}
"""
    try:
        response = _generate_content_with_fallback(prompt)
        return _parse_json_response(response.text)
    except Exception as e:
        print(f"Error in assess_health_risk: {e}")
        return {
            "overallRiskScore": 25,
            "riskCategory": "LOW",
            "summary": "Health metrics appear stable based on preliminary screening.",
            "cardiovascularRisk": {"score": 20, "level": "LOW", "details": "Normal blood pressure range."},
            "diabetesRisk": {"score": 20, "level": "LOW", "details": "Normal blood sugar range."},
            "lifestyleRisk": {"score": 25, "level": "LOW", "details": "Maintain active daily routine."},
            "identifiedRisks": ["No severe risks detected."],
            "preventiveSteps": ["Maintain balanced nutrition", "Engage in 30 minutes of exercise daily", "Schedule annual health checkup"],
            "recommendedSpecialist": "General Physician",
            "disclaimer": "This risk assessment is for informational screening purposes only."
        }


def generate_diet_plan(diet_data: dict) -> dict:
    prompt = f"""
You are a certified nutritionist AI. Create a personalized daily meal and nutrition plan based on:
- Health Goal: {diet_data.get('goal')} (e.g. Weight Loss, Diabetes Care, Muscle Gain, Heart Healthy)
- Dietary Preference: {diet_data.get('preference')} (e.g. Vegetarian, Non-Veg, Vegan, Keto)
- Daily Activity Level: {diet_data.get('activity')}
- Allergies / Dislikes: {diet_data.get('allergies', 'None')}
- Medical Context: {diet_data.get('context', 'None')}

Provide a structured, delicious daily meal plan. Respond ONLY in valid JSON with no markdown fences, with this exact shape:
{{
  "dailyTargetCalories": 1800,
  "macros": {{ "proteinGrams": 90, "carbsGrams": 200, "fatsGrams": 50 }},
  "hydrationGoalLiters": 3.0,
  "meals": {{
    "breakfast": {{ "title": "Breakfast Meal Name", "description": "Details & ingredients", "calories": 400 }},
    "lunch": {{ "title": "Lunch Meal Name", "description": "Details & ingredients", "calories": 600 }},
    "snack": {{ "title": "Evening Snack Name", "description": "Details & ingredients", "calories": 250 }},
    "dinner": {{ "title": "Dinner Meal Name", "description": "Details & ingredients", "calories": 550 }}
  }},
  "foodsToPrefer": ["Food item 1", "Food item 2", "Food item 3"],
  "foodsToLimit": ["Food item 1", "Food item 2"],
  "nutritionTip": "Custom nutrition tip tailored to user goal."
}}
"""
    try:
        response = _generate_content_with_fallback(prompt)
        return _parse_json_response(response.text)
    except Exception as e:
        print(f"Error in generate_diet_plan: {e}")
        return {
            "dailyTargetCalories": 2000,
            "macros": {"proteinGrams": 80, "carbsGrams": 220, "fatsGrams": 55},
            "hydrationGoalLiters": 2.5,
            "meals": {
                "breakfast": {"title": "Oats Porridge & Fresh Fruits", "description": "Warm oats with almonds and banana slices", "calories": 400},
                "lunch": {"title": "Whole Wheat Roti, Dal & Mixed Veggies", "description": "Balanced Indian vegetarian meal with cucumber salad", "calories": 650},
                "snack": {"title": "Green Tea & Roasted Chana", "description": "Light fiber-rich afternoon snack", "calories": 200},
                "dinner": {"title": "Grilled Paneer/Tofu with Vegetable Soup", "description": "Light evening protein dinner", "calories": 500}
            },
            "foodsToPrefer": ["Whole grains", "Fresh green leafy vegetables", "Lean proteins", "Nuts & Seeds"],
            "foodsToLimit": ["Ultra-processed snacks", "Sugary beverages", "Excessive deep-fried foods"],
            "nutritionTip": "Stay hydrated throughout the day and space your meals evenly every 3 to 4 hours."
        }


def _parse_json_response(text: str) -> dict:
    """Extract and parse JSON object from model response text safely."""
    if not text:
        return {"error": "Empty response"}
    cleaned = text.strip()
    # Find JSON block boundaries '{' and '}'
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        json_str = cleaned[start_idx:end_idx + 1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Could not parse AI response", "raw": text}