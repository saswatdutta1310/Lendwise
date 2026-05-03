from twilio.rest import Client
from app.core.config import settings
import structlog

logger = structlog.get_logger()

class SMSService:
    def __init__(self):
        # Using Twilio as the single provider for both SMS and WhatsApp
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(
                settings.TWILIO_ACCOUNT_SID, 
                settings.TWILIO_AUTH_TOKEN.get_secret_value()
            )
        else:
            self.client = None

    async def send_sms(self, phone_number: str, message: str):
        """
        Sends SMS via Twilio globally.
        """
        if not self.client:
            logger.warning("twilio_not_configured")
            return False
            
        try:
            self.client.messages.create(
                body=message,
                from_=settings.TWILIO_WHATSAPP_NUMBER or "+1234567890", # Replace with Twilio SMS number
                to=phone_number
            )
            return True
        except Exception as e:
            logger.error("twilio_sms_failed", error=str(e))
            return False

    async def send_whatsapp(self, phone_number: str, message: str):
        """
        Sends WhatsApp message via Twilio Sandbox or API.
        """
        if not self.client:
            return False
            
        try:
            self.client.messages.create(
                from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
                body=message,
                to=f"whatsapp:{phone_number}"
            )
            return True
        except Exception as e:
            logger.error("twilio_whatsapp_failed", error=str(e))
            return False

sms_service = SMSService()
