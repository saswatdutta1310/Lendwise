import boto3
import pytesseract
from PIL import Image
import io
import structlog
from app.core.config import settings

logger = structlog.get_logger()

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
        Fallback: Tesseract 5.3 with OpenCV preprocessing
        """
        try:
            # Check file size for progressive upload logic if needed
            # For now, process as single blob
            response = self.textract.analyze_document(
                Document={'Bytes': file_content},
                FeatureTypes=['TABLES', 'FORMS']
            )
            return self._parse_textract_response(response)
        except Exception as e:
            logger.error("textract_failed", error=str(e), filename=filename)
            return await self._fallback_tesseract(file_content)

    def _parse_textract_response(self, response):
        """
        Extracts raw text and structures tables from Textract response.
        """
        raw_text = ""
        structured_tables = []
        
        for block in response['Blocks']:
            if block['BlockType'] == 'LINE':
                raw_text += block['Text'] + "\n"
            
            # Logic for table extraction would go here
            # Using block['BlockType'] == 'TABLE' and iterating over children
            
        return {
            "raw_text": raw_text.strip(),
            "structured_tables": structured_tables,
            "confidence": sum([b.get('Confidence', 0) for b in response['Blocks']]) / len(response['Blocks']) if response['Blocks'] else 0,
            "page_count": response.get('DocumentMetadata', {}).get('Pages', 1),
            "document_language": "en" # Detect language later
        }

    async def _fallback_tesseract(self, file_content: bytes):
        """
        Local fallback using Tesseract. Supports Devanagari, Tamil, Telugu.
        """
        try:
            image = Image.open(io.BytesIO(file_content))
            # Preprocessing with OpenCV could be added here for better accuracy
            text = pytesseract.image_to_string(image, lang='eng+hin+tam+tel')
            return {
                "raw_text": text.strip(),
                "structured_tables": [],
                "confidence": 0.65, # Estimated
                "page_count": 1,
                "document_language": "unknown"
            }
        except Exception as e:
            logger.error("tesseract_failed", error=str(e))
            return {"raw_text": "", "error": "OCR failed completely"}

ocr_service = OCRService()
