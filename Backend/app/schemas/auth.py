from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    jurisdiction: str
    language: str = "en"

class UserCreate(UserBase):
    password: str
    date_of_birth: Optional[datetime] = None
    parental_consent_email: Optional[EmailStr] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    simple_mode: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class Msg(BaseModel):
    message: str
