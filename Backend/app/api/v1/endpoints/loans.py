from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.db.session import get_db
from app.models.models import Loan, User
from app.tasks.pipeline import process_loan_upload
import uuid
import os

router = APIRouter()

@router.post("/upload")
async def upload_loan(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload loan document, trigger OCR/AI pipeline, and return task_id.
    """
    file_id = str(uuid.uuid4())
    # Save file locally (Simplified for hackathon)
    upload_dir = "/tmp/lendwise_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    upload_path = os.path.join(upload_dir, f"{file_id}_{file.filename}")
    
    with open(upload_path, "wb") as f:
        f.write(await file.read())
    
    # Create loan record in PENDING state
    loan = Loan(
        user_id=current_user.id,
        name=file.filename,
        upload_path=upload_path,
        status="PENDING",
        loan_jurisdiction=current_user.jurisdiction # Default from user
    )
    db.add(loan)
    await db.commit()
    await db.refresh(loan)

    # Trigger Celery pipeline
    task = process_loan_upload.delay(loan.id)
    
    return {"loan_id": loan.id, "task_id": task.id, "status": "PROCESSING"}

@router.get("/", response_model=List[dict])
async def list_loans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    List all loans for the current user.
    """
    result = await db.execute(select(Loan).filter(Loan.user_id == current_user.id))
    return result.scalars().all()

@router.get("/{loan_id}")
async def get_loan(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get detailed loan data and AI insights.
    """
    result = await db.execute(select(Loan).filter(Loan.id == loan_id, Loan.user_id == current_user.id))
    loan = result.scalars().first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan
