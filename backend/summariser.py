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