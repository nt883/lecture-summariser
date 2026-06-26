# 📚 BrieflyAI

> An AI-powered web app that transforms lecture PDFs into clean, structured summaries — built for students, by students.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Language-Python-3776AB?style=flat&logo=python)
![Groq](https://img.shields.io/badge/AI-Groq-FF6B35?style=flat)

---

## What It Does

Upload any lecture PDF and get back:

- 📝 **A concise AI-generated summary** of the lecture content
- 💡 **Key concepts** extracted and highlighted
- 🔢 **Formulas** identified and listed separately
- 📄 **A downloadable, styled PDF** — formatted with headings, sections, and page numbers

No sign-up required. No data stored. Upload, summarise, download, and go.

---

## Why We Built It

As Computer Science students at the University of the Witwatersrand, we know what it's like to have 10 lectures worth of notes the night before an exam. We built BrieflyAI to cut through the noise and get straight to what matters — fast.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (JavaScript) | UI and user interaction |
| Backend | FastAPI (Python) | API server and request handling |
| AI | Groq API | Fast, high-quality text summarisation |
| File Parsing | PyMuPDF | Extracting text from PDFs |
| Styling | CSS3 | Custom component design |

---

## Features

- ⚡ **Fast** — summaries generated in seconds via Groq's inference API
- 🎯 **Structured output** — summary, key concepts, and formulas returned as separate sections
- 📥 **Styled PDF download** — green-branded, paginated, with bold headings
- 🛡️ **Input validation** — rejects non-PDF files with a clear error message
- 📱 **Clean, welcoming UI** — designed with students in mind, no friction to get started
- 🔒 **Privacy-first** — nothing is stored, nothing is saved

---

## Known Limitations

- Works best with text-based PDFs — scanned image PDFs cannot be processed
- Mathematical symbols may not render correctly depending on how they are encoded in the source PDF
- File size limit: 10MB

---

## Team

| Name | Role | GitHub |
|---|---|---|
| Ntando | Backend + AI | [@nt883](https://github.com/nt883) |
| Ndivhuwo | Frontend + UI | [@Ndivhuwo2](https://github.com/Ndivhuwo2) |

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.10+
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`: