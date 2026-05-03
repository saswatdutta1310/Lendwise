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
import pyotp
from app.schemas.auth import Token, UserCreate, UserLogin, UserResponse, Msg

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
    Get an access token for a future requests. Supports 2FA redirection.
    """
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not security.verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if user.is_2fa_enabled:
        # Generate a temporary token for 2FA authentication
        temp_token = security.create_access_token(
            user.id, expires_delta=timedelta(minutes=5), is_2fa_temp=True
        )
        return {
            "status": "2FA_REQUIRED",
            "temp_token": temp_token
        }

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(user.id),
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "status": "SUCCESS"
    }

@router.post("/2fa/setup")
async def setup_2fa(
    current_user: Annotated[User, Depends(deps.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    """
    Generate 2FA secret and provisioning URI.
    """
    if current_user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled")
    
    secret = pyotp.random_base32()
    current_user.two_fa_secret = secret
    await db.commit()
    
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=current_user.email, 
        issuer_name="LendWise Global"
    )
    
    return {
        "secret": secret,
        "provisioning_uri": provisioning_uri
    }

@router.post("/2fa/verify", response_model=Msg)
async def verify_2fa(
    code: str,
    current_user: Annotated[User, Depends(deps.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    """
    Verify the first 2FA code to enable it.
    """
    if not current_user.two_fa_secret:
        raise HTTPException(status_code=400, detail="2FA setup not initiated")
    
    totp = pyotp.TOTP(current_user.two_fa_secret)
    if totp.verify(code):
        current_user.is_2fa_enabled = True
        await db.commit()
        return {"message": "2FA enabled successfully"}
    
    raise HTTPException(status_code=400, detail="Invalid 2FA code")

@router.post("/2fa/authenticate", response_model=Token)
async def authenticate_2fa(
    code: str,
    temp_token: str,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    """
    Authenticate using a 2FA code and a temporary token.
    """
    # Verify temp token and get user_id
    try:
        user_id = security.verify_2fa_temp_token(temp_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired temporary token")
    
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if not user or not user.is_2fa_enabled or not user.two_fa_secret:
        raise HTTPException(status_code=400, detail="2FA not enabled for this user")
    
    totp = pyotp.TOTP(user.two_fa_secret)
    if totp.verify(code):
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": security.create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            "refresh_token": security.create_refresh_token(user.id),
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "status": "SUCCESS"
        }
    
    raise HTTPException(status_code=400, detail="Invalid 2FA code")

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(deps.get_current_user)]
) -> Any:
    """
    Get current user.
    """
    return current_user
