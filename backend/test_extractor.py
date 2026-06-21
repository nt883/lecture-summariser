from extractor import extract_text_from_pdf

with open("test.pdf", "rb") as f:
    file_bytes = f.read()

text = extract_text_from_pdf(file_bytes)
print('Length:', len(text))
print(text[:500])  # Print first 500 characters