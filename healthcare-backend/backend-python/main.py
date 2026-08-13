import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import gemini_service
import file_utils

app = FastAPI(title="Healthcare AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TermRequest(BaseModel):
    term: str


class SymptomRequest(BaseModel):
    symptoms: str


class ChatRequest(BaseModel):
    message: str
    history: str = ""


@app.post("/analyze-document")
async def analyze_document(file: UploadFile = File(...), document_type: str = Form(...)):
    file_bytes = await file.read()
    image_parts = file_utils.file_to_gemini_parts(file_bytes, file.filename)

    result = gemini_service.analyze_document_image(image_parts, document_type)

    return {
        "extractedText": result.get("extracted_text", ""),
        "aiSummary": result.get("ai_summary", ""),
        "documentType": document_type,
        "doctor": result.get("doctor", None)
    }


@app.post("/explain-term")
def explain_term(req: TermRequest):
    explanation = gemini_service.explain_medical_term(req.term)
    return {"explanation": explanation}


@app.post("/symptom-checker")
def symptom_checker(req: SymptomRequest):
    return gemini_service.check_symptoms(req.symptoms)


@app.post("/chat")
def chat(req: ChatRequest):
    reply = gemini_service.chat_reply(req.message, req.history)
    return {"reply": reply}


@app.post("/risk-assessment")
def risk_assessment(data: dict):
    return gemini_service.assess_health_risk(data)


@app.post("/diet-planner")
def diet_planner(data: dict):
    return gemini_service.generate_diet_plan(data)


@app.get("/health")
def health():
    return {"status": "ok"}
