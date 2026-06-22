import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarise_text(text: str) -> str:
    # Trim to avoid token limits
    trimmed = text[:6000]
    
    chat_completion = client.chat.completions.create(
        messages=[
    {
        "role": "system",
        "content": """You are an expert academic assistant that creates detailed study summaries. 
When given lecture notes, you must:
1. Write a structured summary with clear headings for each main topic
2. Explain each concept properly in 2-3 sentences, not just name it
3. Include important definitions, formulas, and examples mentioned
4. Highlight relationships between concepts
5. End with a 'Key Takeaways' section of the most important points
Write in a way that a student could study from this summary without needing the original slides."""
    },
    {
        "role": "user",
        "content": f"Create a detailed study summary of these lecture notes:\n\n{trimmed}"
    }
],
        model="llama-3.3-70b-versatile",
    )
    
    return chat_completion.choices[0].message.content

def extract_formulas(text: str) -> str:
    trimmed = text[:6000]
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are an expert academic assistant.
Extract ALL formulas, equations, mathematical expressions, and key mathematical concepts from the lecture notes.
Even if formulas are written in text form (e.g. 'cov(X,Y) = ...'), extract them.
For each formula:
1. Give it a clear name/title
2. Write the formula as clearly as possible
3. Explain what each variable means
4. Give a one sentence explanation of what it is used for
If no formulas are found, list the key mathematical concepts mentioned instead.
Format each as a separate section with a heading."""
            },
            {
                "role": "user",
                "content": f"Extract all formulas and equations from these lecture notes:\n\n{trimmed}"
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    return chat_completion.choices[0].message.content

def extract_key_concepts(text: str) -> str:
    trimmed = text[:6000]
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are an expert academic assistant.
Extract the key concepts from these lecture notes.
For each concept:
1. Give it a clear name as a heading
2. Write a clear 2-3 sentence explanation
3. Mention why it's important or how it connects to other concepts
Format as a structured list with headings. Be concise but informative.
Rules:
- Do NOT include introductions, overviews, or section headings as concepts
- Only extract actual technical terms, algorithms, methods, and definitions
- Format as bullet points: **Concept Name** — one clear sentence explaining it
- Maximum 10 concepts
- Be concise, no long paragraphs"""
            },
            {
                "role": "user",
                "content": f"Extract the key concepts from these lecture notes:\n\n{trimmed}"
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    return chat_completion.choices[0].message.content