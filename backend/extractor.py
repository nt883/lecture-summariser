import fitz  # PyMuPDF

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf") #opens the PDF from raw bytes because we will be receiving it from frontend 
    text = ""
    for page in doc: #loops through every page
        text += page.get_text() #extracts all the text from that oage
    return text.strip() #returns all the text cleaned up