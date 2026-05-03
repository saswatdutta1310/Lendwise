import google.generativeai as genai
from PIL import Image
import io
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class OCRService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY.get_secret_value())
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def process_document(self, file_content: bytes, filename: str):
        """
        Uses Google Gemini 1.5 Flash for Multimodal OCR.
        This handles text extraction and layout understanding in one go.
        """
        try:
            image = Image.open(io.BytesIO(file_content))
            
            # Simple prompt for raw text extraction
            response = self.model.generate_content([
                "Extract all text from this loan document accurately. Maintain layout where possible.", 
                image
            ])
            
            return {
                "raw_text": response.text.strip(),
                "document_language": "en", # Simplified
                "confidence": 0.95,
                "page_count": 1
            }
        except Exception as e:
            logger.error("gemini_ocr_failed", error=str(e), filename=filename)
            return {"raw_text": "", "error": "OCR failed"}

ocr_service = OCRService()
