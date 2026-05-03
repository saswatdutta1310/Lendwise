from app.worker import celery_app
from app.services.ocr import ocr_service
from app.services.ai_engine import ai_engine
from app.db.session import SessionLocal
from app.models.models import Loan, Insight
from app.services.jurisdictions.india import IndiaJurisdiction
from app.services.jurisdictions.usa import USAJurisdiction
from app.services.jurisdictions.uk import UKJurisdiction
from app.services.jurisdictions.au import AUJurisdiction
import asyncio
import structlog
import json

logger = structlog.get_logger()

@celery_app.task(name="app.tasks.pipeline.process_loan_upload")
def process_loan_upload(loan_id: int):
    """
    Celery task to run the full processing pipeline.
    """
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_run_pipeline(loan_id))

async def _run_pipeline(loan_id: int):
    async with SessionLocal() as db:
        # Load loan with user relationship
        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(Loan).options(selectinload(Loan.user)).filter(Loan.id == loan_id)
        )
        loan = result.scalars().first()
        
        if not loan:
            return "Loan not found"

        try:
            # 0. Update Status
            loan.status = "ocr_processing"
            await db.commit()

            # 1. Load File Content
            # In production, this would be S3. For local dev, read from upload_path.
            import os
            if os.path.exists(loan.upload_path):
                with open(loan.upload_path, "rb") as f:
                    file_content = f.read()
            else:
                file_content = b"Fallback mock content"

            # 2. OCR
            ocr_result = await ocr_service.process_document(file_content, loan.name)
            loan.raw_text = ocr_result["raw_text"]
            loan.document_language = ocr_result["document_language"]
            loan.status = "parsing"
            await db.commit()

            # 3. AI Parsing
            parsed_data_str = await ai_engine.parse_loan_data(loan.raw_text, loan.document_language)
            try:
                parsed_data = json.loads(parsed_data_str)
                loan.parsed_json = parsed_data
                loan.currency = parsed_data.get("currency", "INR")
                loan.loan_jurisdiction = parsed_data.get("loan_jurisdiction", loan.loan_jurisdiction)
            except Exception as e:
                logger.error("parse_json_failed", error=str(e), loan_id=loan_id)
                loan.status = "error_parsing"
                await db.commit()
                return

            # 4. Jurisdiction Logic & Insights
            # Determine which jurisdiction to apply
            jurisdiction_applied = loan.loan_jurisdiction.lower()
            
            insights_data = await ai_engine.generate_insights(
                loan.parsed_json, 
                jurisdiction_applied, 
                loan.user.language if loan.user else "en"
            )

            new_insight = Insight(
                loan_id=loan.id,
                strategies_json=insights_data["strategies"],
                simple_mode_json=insights_data.get("simple_mode_json"),
                recommended_strategy=insights_data["recommended_strategy"],
                rationale=insights_data["rationale"],
                rationale_language=loan.user.language if loan.user else "en",
                jurisdiction_applied=jurisdiction_applied
            )
            db.add(new_insight)
            
            # 5. Finalize
            loan.status = "ready"
            await db.commit()
            
            logger.info("pipeline_complete", loan_id=loan_id)
            return "Success"

        except Exception as e:
            logger.exception("pipeline_failed", loan_id=loan_id, error=str(e))
            loan.status = "error"
            await db.commit()
            return f"Error: {str(e)}"
