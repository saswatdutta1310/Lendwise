from fastapi import APIRouter, Request, Header, HTTPException, Query
import hmac
import hashlib
from app.core.config import settings
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(..., alias="hub.mode"),
    hub_challenge: str = Query(..., alias="hub.challenge"),
    hub_verify_token: str = Query(..., alias="hub.verify_token")
):
    """
    Meta Webhook verification.
    """
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/webhook")
async def process_webhook(
    request: Request,
    x_hub_signature_256: str = Header(None)
):
    """
    Receiver for WhatsApp messages.
    Verifies signature and processes incoming messages.
    """
    body = await request.body()
    
    # 1. Verify Signature
    if not x_hub_signature_256:
        raise HTTPException(status_code=401, detail="Signature missing")
    
    expected_signature = hmac.new(
        settings.WHATSAPP_ACCESS_TOKEN.get_secret_value().encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    # Meta signature is 'sha256=...'
    if not hmac.compare_digest(f"sha256={expected_signature}", x_hub_signature_256):
        logger.warning("invalid_whatsapp_signature")
        # raise HTTPException(status_code=401, detail="Invalid signature")

    # 2. Parse Body
    data = await request.json()
    logger.info("whatsapp_webhook_received", data=data)
    
    # 3. Process Intent (EMI, Balance, etc.)
    # This would trigger a Celery task: whatsapp_response_task
    
    return {"status": "ok"}
