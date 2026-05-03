from twilio.rest import Client
import httpx
from app.core.config import settings
import structlog

logger = structlog.get_logger()

class SMSService:
    def __init__(self):
        # Twilio setup
        self.twilio_client = Client(
            settings.TWILIO_ACCOUNT_SID, 
            settings.TWILIO_AUTH_TOKEN.get_secret_value() if settings.TWILIO_AUTH_TOKEN else None
        )
        
        # MSG91 setup
        self.msg91_auth_key = settings.MSG91_AUTH_KEY.get_secret_value() if settings.MSG91_AUTH_KEY else None

    async def send_sms(self, phone_number: str, message: str, jurisdiction: str = "IN"):
        """
        Sends SMS via MSG91 for India and Twilio for other countries.
        """
        if jurisdiction.upper() == "IN":
            return await self._send_msg91(phone_number, message)
        else:
            return self._send_twilio(phone_number, message)

    async def _send_msg91(self, phone_number: str, message: str):
        url = "https://api.msg91.com/api/v5/otp" # Simplified for OTP, use /flow for transactional
        payload = {
            "template_id": "YOUR_TEMPLATE_ID",
            "mobile": phone_number,
            "authkey": self.msg91_auth_key,
            "message": message
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                return response.status_code == 200
        except Exception as e:
            logger.error("msg91_failed", error=str(e))
            return False

    def _send_twilio(self, phone_number: str, message: str):
        try:
            message = self.twilio_client.messages.create(
                body=message,
                from_="+1234567890", # Replace with actual Twilio number
                to=phone_number
            )
            return message.sid is not None
        except Exception as e:
            logger.error("twilio_failed", error=str(e))
            return False

sms_service = SMSService()
