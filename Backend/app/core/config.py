from typing import List, Optional, Union
from pydantic import AnyHttpUrl, BeforeValidator, HttpUrl, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated

def parse_cors(v: Union[str, List[str]]) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "LendWise Global"
    
    # CORS
    BACKEND_CORS_ORIGINS: Annotated[
        List[str], BeforeValidator(parse_cors)
    ] = []

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "lendwise"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], values: any) -> any:
        if isinstance(v, str):
            return v
        return f"postgresql+asyncpg://{values.data.get('POSTGRES_USER')}:{values.data.get('POSTGRES_PASSWORD')}@{values.data.get('POSTGRES_SERVER')}:{values.data.get('POSTGRES_PORT')}/{values.data.get('POSTGRES_DB')}"

    # Redis & Celery
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    @field_validator("CELERY_BROKER_URL", mode="before")
    @classmethod
    def assemble_celery_broker(cls, v: Optional[str], values: any) -> any:
        if isinstance(v, str):
            return v
        return f"redis://{values.data.get('REDIS_HOST')}:{values.data.get('REDIS_PORT')}/0"

    # Auth
    SECRET_KEY: SecretStr = SecretStr("YOUR_SECRET_KEY_HERE")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Simplified APIs
    # 1. Google Gemini (Handles OCR + AI Extraction)
    GOOGLE_API_KEY: Optional[SecretStr] = None

    # 2. Twilio (Handles SMS + WhatsApp)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[SecretStr] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None # Twilio sandbox or prod number

    # WhatsApp (Meta Webhook verification token)
    WHATSAPP_VERIFY_TOKEN: str = "LendWise_Verify_2024"
    WHATSAPP_APP_SECRET: Optional[SecretStr] = None

    # Blockchain (Optional, can be mocked)
    POLYGON_RPC_URL: str = "https://polygon-rpc.com"
    BLOCKCHAIN_PRIVATE_KEY: Optional[SecretStr] = None

settings = Settings()
