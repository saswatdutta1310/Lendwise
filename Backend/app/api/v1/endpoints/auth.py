from datetime import timedelta
from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User
from app.schemas.auth import Token, UserCreate, UserLogin, UserResponse

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    db: Annotated[AsyncSession, Depends(get_db)],
    user_in: UserCreate
) -> Any:
    """
    Register a new user.
    """
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Check for parental consent if under 18 (simplified logic)
    # In a real app, calculate age from date_of_birth
    
    db_user = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        name=user_in.name,
        jurisdiction=user_in.jurisdiction,
        language=user_in.language,
        date_of_birth=user_in.date_of_birth,
        parental_consent_email=user_in.parental_consent_email
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(
    db: Annotated[AsyncSession, Depends(get_db)],
    user_in: UserLogin
) -> Any:
    """
    Get an access token for a future requests.
    """
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not security.verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(user.id),
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(deps.get_current_user)]
) -> Any:
    """
    Get current user.
    """
    return current_user
