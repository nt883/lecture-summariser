from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_text_from_pdf
from summariser import summarise_text, extract_formulas, extract_key_concepts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Lecture Summariser API is running"}

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    return {"text": text}

@app.post("/summarise")
async def summarise(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    summary = summarise_text(text)
    return {"summary": summary}

@app.post("/formulas")
async def formulas(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    result = extract_formulas(text)
    return {"formulas": result} 

@app.post("/concepts")
async def concepts(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    result = extract_key_concepts(text)
    return {"concepts": result}
