from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, JSON, Float, Integer, LargeBinary
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255))
    jurisdiction: Mapped[str] = mapped_column(String(50)) # IN, USA, UK, AU
    language: Mapped[str] = mapped_column(String(10), default="en")
    income_slab: Mapped[Optional[str]] = mapped_column(String(100))
    simple_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime)
    parental_consent_email: Mapped[Optional[str]] = mapped_column(String(255))
    parental_consent_approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    two_fa_secret: Mapped[Optional[str]] = mapped_column(String(100))
    
    loans: Mapped[List["Loan"]] = relationship(back_populates="user")
    consent_records: Mapped[List["ConsentRecord"]] = relationship(back_populates="user")

class ConsentRecord(Base):
    __tablename__ = "consent_records"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    purpose_code: Mapped[str] = mapped_column(String(50)) # OCR_PROCESSING, AI_ANALYSIS, etc.
    consented: Mapped[bool] = mapped_column(Boolean)
    consent_version: Mapped[str] = mapped_column(String(20))
    consented_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    withdrawn_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    
    user: Mapped["User"] = relationship(back_populates="consent_records")

class Loan(Base):
    __tablename__ = "loans"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(255))
    raw_text: Mapped[Optional[str]] = mapped_column(Text)
    parsed_json: Mapped[Optional[dict]] = mapped_column(JSON) # AES-256 encrypted in production
    status: Mapped[str] = mapped_column(String(50), default="uploading")
    currency: Mapped[str] = mapped_column(String(10))
    loan_jurisdiction: Mapped[str] = mapped_column(String(50))
    document_language: Mapped[str] = mapped_column(String(10))
    plan_type: Mapped[Optional[str]] = mapped_column(String(100)) # UK Plan 1/2/5, etc.
    upload_path: Mapped[str] = mapped_column(String(512))
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    user: Mapped["User"] = relationship(back_populates="loans")
    repayments: Mapped[List["Repayment"]] = relationship(back_populates="loan")
    insights: Mapped[List["Insight"]] = relationship(back_populates="loan")

class Repayment(Base):
    __tablename__ = "repayments"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    loan_id: Mapped[int] = mapped_column(ForeignKey("loans.id"))
    amount: Mapped[float] = mapped_column(Float)
    date: Mapped[datetime] = mapped_column(DateTime)
    type: Mapped[str] = mapped_column(String(50)) # EMI, Prepayment
    principal_component: Mapped[Optional[float]] = mapped_column(Float)
    interest_component: Mapped[Optional[float]] = mapped_column(Float)
    balance_after: Mapped[Optional[float]] = mapped_column(Float)
    synced_to_chain: Mapped[bool] = mapped_column(Boolean, default=False)
    logged_offline: Mapped[bool] = mapped_column(Boolean, default=False)
    
    loan: Mapped["Loan"] = relationship(back_populates="repayments")

class Insight(Base):
    __tablename__ = "insights"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    loan_id: Mapped[int] = mapped_column(ForeignKey("loans.id"))
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    strategies_json: Mapped[dict] = mapped_column(JSON)
    simple_mode_json: Mapped[Optional[dict]] = mapped_column(JSON)
    recommended_strategy: Mapped[str] = mapped_column(String(100))
    rationale: Mapped[str] = mapped_column(Text)
    rationale_language: Mapped[str] = mapped_column(String(10))
    jurisdiction_applied: Mapped[str] = mapped_column(String(50))
    
    loan: Mapped["Loan"] = relationship(back_populates="insights")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    loan_id: Mapped[Optional[int]] = mapped_column(ForeignKey("loans.id"))
    title: Mapped[str] = mapped_column(String(255))
    language: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_message_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("chat_sessions.id"))
    role: Mapped[str] = mapped_column(String(20)) # user, assistant
    content: Mapped[str] = mapped_column(Text)
    content_language: Mapped[str] = mapped_column(String(10))
    sources_json: Mapped[Optional[dict]] = mapped_column(JSON)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_voice_input: Mapped[bool] = mapped_column(Boolean, default=False)

class Notification(Base):
    __tablename__ = "notifications"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(10))
    channel: Mapped[str] = mapped_column(String(50)) # in_app, email, push, sms, whatsapp
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    action_url: Mapped[Optional[str]] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class WhatsAppAccount(Base):
    __tablename__ = "whatsapp_accounts"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    phone_number: Mapped[str] = mapped_column(String(20), unique=True)
    wa_id: Mapped[str] = mapped_column(String(100))
    connected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    language: Mapped[str] = mapped_column(String(10), default="en")

class AuditLog(Base):
    __tablename__ = "audit_log"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(255))
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[Optional[int]] = mapped_column(Integer)
    ip: Mapped[Optional[str]] = mapped_column(String(45))
    jurisdiction: Mapped[Optional[str]] = mapped_column(String(50))
    language: Mapped[Optional[str]] = mapped_column(String(10))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
