# LendWise Global Backend v4.0 — DESIGN.md

## 1. Architecture Overview
The LendWise backend is an asynchronous Python API built with **FastAPI**, designed for high performance and scalability. It orchestrates complex workflows involving OCR, multi-language LLMs, global jurisdiction logic, and blockchain integration.

### Core Components:
- **API Framework**: FastAPI (Async-first)
- **Database**: PostgreSQL with `pgvector` for RAG capabilities.
- **Task Queue**: Celery with Redis for background processing (OCR, AI, Notifications).
- **AI Engine**: LangChain with Google Gemini 1.5 Pro (Primary) and GPT-4o (Fallback).
- **OCR**: AWS Textract with Tesseract local fallback for Indian scripts.
- **Blockchain**: Web3.py for Polygon hashing to ensure data integrity.

## 2. Service Modules

### 2.1 OCR Service (`app/services/ocr.py`)
- Handles document uploads.
- Uses AWS Textract for high-accuracy form and table extraction.
- Falls back to Tesseract 5.3 with OpenCV for localized script support.

### 2.2 AI Engine (`app/services/ai_engine.py`)
- **Parsing Chain**: Extracts structured loan data from raw text.
- **Optimization Engine**: Generates 3 strategies (Snowball, Avalanche, etc.) based on jurisdiction.
- **RAG Copilot**: Provides streaming chat responses with jurisdiction-specific knowledge.

### 2.3 Jurisdiction Engine (`app/services/jurisdictions/`)
- Country-specific logic for India (Section 80E), USA (IDR/PSLF), UK (Plan 1/2/5), and Australia (HECS).
- Handles tax savings, subsidies, and repayment write-offs.

### 2.4 Notification Service (`app/services/notifications.py`)
- Multi-channel reminders via Email (SendGrid), SMS (MSG91/Twilio), and WhatsApp (Meta API).

## 3. Database Schema
- **`users`**: Core profile, language, and jurisdiction.
- **`loans`**: Loan metadata and parsed JSON (encrypted).
- **`repayments`**: Payment history with blockchain sync status.
- **`insights`**: AI-generated optimization strategies.
- **`consent_records`**: DPDP/GDPR compliant consent logs.

## 4. Security & Compliance
- **Authentication**: JWT HS256 with 2FA (TOTP).
- **Encryption**: AES-256-GCM for sensitive data at rest.
- **DPDP/GDPR**: Right to erasure, data export, and purpose-based consent gating.

## 5. Implementation Status
- [x] Project Structure Initialized
- [x] Requirements defined
- [x] Core Config & DB Session
- [x] Database Models (SQLAlchemy 2.0)
- [x] Service Skeletal Implementation (OCR, AI Engine, Jurisdiction)
- [x] Celery Worker & Pipeline Task setup
- [ ] Authentication Endpoints
- [ ] Loan Upload Endpoints
- [ ] WhatsApp Webhook implementation
- [ ] Blockchain Hashing logic
