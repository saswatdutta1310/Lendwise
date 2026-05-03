from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.db.session import get_db
from app.models.models import UserConsent, User
from datetime import datetime

router = APIRouter()

@router.post("/update")
async def update_consent(
    purpose: str,
    granted: bool,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update user consent for a specific processing purpose (DPDP/GDPR).
    """
    consent = UserConsent(
        user_id=current_user.id,
        purpose=purpose,
        granted=granted,
        consent_timestamp=datetime.utcnow(),
        ip_address="0.0.0.0" # Mocked
    )
    db.add(consent)
    await db.commit()
    return {"status": "success", "purpose": purpose, "granted": granted}

@router.get("/")
async def get_consent_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all consent records for the current user.
    """
    result = await db.execute(select(UserConsent).filter(UserConsent.user_id == current_user.id))
    return result.scalars().all()
