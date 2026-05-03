from fastapi import APIRouter
from app.api.v1.endpoints import auth, loans, insights, consent, whatsapp, notifications

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(loans.router, prefix="/loans", tags=["loans"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
api_router.include_router(consent.router, prefix="/consent", tags=["consent"])
api_router.include_router(whatsapp.router, prefix="/whatsapp", tags=["whatsapp"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
