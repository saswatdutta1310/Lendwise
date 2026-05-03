import boto3
import pytesseract
from PIL import Image
import io
from app.core.config import settings

class OCRService:
    def __init__(self):
        self.textract = boto3.client(
            "textract",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY.get_secret_value() if settings.AWS_SECRET_ACCESS_KEY else None,
            region_name=settings.AWS_REGION
        )

    async def process_document(self, file_content: bytes, filename: str):
        """
        Primary: AWS Textract
        Fallback: Tesseract
        """
        try:
            response = self.textract.analyze_document(
                Document={'Bytes': file_content},
                FeatureTypes=['TABLES', 'FORMS']
            )
            return self._parse_textract_response(response)
        except Exception as e:
            # Log error and fallback
            return await self._fallback_tesseract(file_content)

    def _parse_textract_response(self, response):
        # Extract blocks, tables, and forms
        # Logic to structure the output as per PRD
        return {
            "raw_text": "Extracted text from Textract",
            "structured_tables": [],
            "confidence": 0.95,
            "page_count": 1,
            "document_language": "en"
        }

    async def _fallback_tesseract(self, file_content: bytes):
        image = Image.open(io.BytesIO(file_content))
        text = pytesseract.image_to_string(image, lang='eng+hin+tam+tel')
        return {
            "raw_text": text,
            "structured_tables": [],
            "confidence": 0.70,
            "page_count": 1,
            "document_language": "unknown"
        }

ocr_service = OCRService()
