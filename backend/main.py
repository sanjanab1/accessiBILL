import json
import os
import cv2
import numpy as np
import torch
import pytesseract
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import fitz
from docx import Document as DocxDocument
import io

from plots import plot_impact_dashboard, plot_impact_dashboard2
from gemini_service import generate_personalized_impact

device = "cuda" if torch.cuda.is_available() else "cpu"

model_name = "vnarasiman/led-billsum-civic"
tokenizer = AutoTokenizer.from_pretrained(model_name)
summarizer_model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    text = pytesseract.image_to_string(gray, config=r'--oem 3 --psm 6')
    lines = text.strip().splitlines()
    lines = [l for l in lines if l.strip()]
    if len(lines) > 3:
        lines = lines[2:]
    return '\n'.join(lines) if lines else "No text detected."

def generate_summary(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=4096).to(device)
    global_attention_mask = torch.zeros_like(inputs.input_ids)
    global_attention_mask[:, 0] = 1

    with torch.no_grad():
        summary_ids = summarizer_model.generate(
            inputs.input_ids,
            global_attention_mask=global_attention_mask,
            max_length=512,
            min_length=100,
            num_beams=4,
            no_repeat_ngram_size=3,
            length_penalty=2.0,
            early_stopping=False,
        )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        pdf = fitz.open(stream=contents, filetype="pdf")
        raw_text = "".join(page.get_text() for page in pdf).strip()
        raw_text = raw_text if raw_text else "No text detected."

    elif filename.endswith(".docx"):
        doc = DocxDocument(io.BytesIO(contents))
        raw_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        raw_text = raw_text if raw_text else "No text detected."

    elif filename.endswith(".txt"):
        raw_text = contents.decode("utf-8", errors="ignore").strip()

    else:
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            return {"summary": "Could not read image. Try a different file."}
        raw_text = process_image(image)

    if raw_text == "No text detected.":
        return {"summary": "No text detected."}

    bill_summary = generate_summary(raw_text)
    return {"summary": bill_summary}

@app.post("/plot")
def plot(data: dict):
    state_name = data.get("state_name", "Texas")
    bill_summary = data.get("bill_summary", "Standard summary if none provided.")
    crime_json = plot_impact_dashboard(state_name, bill_summary)
    tax_json = plot_impact_dashboard2(state_name, bill_summary)
    return {
        "crime_plot": json.loads(crime_json),
        "tax_plot": json.loads(tax_json)
    }

@app.post("/personalize")
def personalize_policy():
    result = generate_personalized_impact()
    return result