import io
from PyPDF2 import PdfReader
import docx
import textract
from fastapi import UploadFile

# Function to extract content based on file type
async def extract_content_from_file(file: UploadFile) -> str:
    """
    Extracts content from a file (docx, pdf, txt, doc).
    """
    file_extension = file.filename.split('.')[-1].lower()

    # Read the file content into memory
    file_content = await file.read()
    file_io = io.BytesIO(file_content)

    if file_extension == 'txt':
        return file_io.read().decode('utf-8')
    
    elif file_extension == 'pdf':
        reader = PdfReader(file_io)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return text
    
    elif file_extension == 'docx':
        doc = docx.Document(file_io)
        return '\n'.join([para.text for para in doc.paragraphs])
    
    elif file_extension == 'doc':
        text = textract.process(file_io)
        return text.decode('utf-8')

    else:
        raise ValueError("Unsupported file type. Supported types are: txt, pdf, docx, doc.")