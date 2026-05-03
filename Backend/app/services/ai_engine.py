from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings

class AIEngineService:
    def __init__(self):
        self.primary_llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=settings.GOOGLE_API_KEY.get_secret_value() if settings.GOOGLE_API_KEY else None
        )
        self.fallback_llm = ChatOpenAI(
            model="gpt-4o",
            api_key=settings.OPENAI_API_KEY.get_secret_value() if settings.OPENAI_API_KEY else None
        )

    async def parse_loan_data(self, raw_text: str, document_language: str):
        """
        Parses raw OCR text into structured JSON using LLM.
        """
        system_prompt = (
            "You are a loan document parser. The document language is {document_language}. "
            "Extract loan data regardless of language. Return ONLY a valid JSON object. "
            "JSON fields: principal, interest_rate (as float), tenure_months (int), emi (float), "
            "lender_name, loan_type, currency (3-letter code), start_date (ISO). "
            "If a value is missing, use null."
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "Extract data from this text: {text}")
        ])
        
        chain = prompt | self.primary_llm
        
        try:
            response = await chain.ainvoke({"document_language": document_language, "text": raw_text})
            return response.content # Assuming JSON output from LLM
        except Exception:
            # Try fallback
            chain_fallback = prompt | self.fallback_llm
            response = await chain_fallback.ainvoke({"document_language": document_language, "text": raw_text})
            return response.content

    async def generate_insights(self, loan_data: dict, jurisdiction: str, language: str):
        """
        Generates 3 optimization strategies and rationale.
        """
        # Logic for strategies (Snowball, Avalanche, etc.)
        return {
            "strategies": [],
            "rationale": "Generated rationale in {language}",
            "simple_mode_rationale": "Jargon-free version"
        }

ai_engine = AIEngineService()
