from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings

class AIEngineService:
    def __init__(self):
        # Using Google Gemini as the single AI provider
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=settings.GOOGLE_API_KEY.get_secret_value() if settings.GOOGLE_API_KEY else None
        )

    async def parse_loan_data(self, raw_text: str, document_language: str):
        """
        Parses raw text into structured JSON using Gemini.
        """
        system_prompt = (
            "You are a loan document parser. The document language is {document_language}. "
            "Extract loan data. Return ONLY a valid JSON object. "
            "JSON fields: principal, interest_rate (float), tenure_months (int), emi (float), "
            "lender_name, loan_type, currency (3-letter code), start_date (ISO)."
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "Extract data from this text: {text}")
        ])
        
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"document_language": document_language, "text": raw_text})
            return response.content
        except Exception as e:
            return str(e)

    async def generate_insights(self, loan_data: dict, jurisdiction: str, language: str):
        """
        Generates optimization strategies using Gemini.
        """
        system_prompt = (
            "You are a financial advisor specializing in {jurisdiction} student loans. "
            "Language: {language}. Provide 3 strategies (Snowball, Avalanche, Refinance) "
            "and a detailed rationale."
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "Analyze this loan: {loan_data}")
        ])
        
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"jurisdiction": jurisdiction, "language": language, "loan_data": str(loan_data)})
            # In production, parse JSON here
            return {
                "strategies": [{"name": "Avalanche", "impact": "High"}], # Mocked structure
                "recommended_strategy": "Avalanche",
                "rationale": response.content
            }
        except Exception:
            return {"error": "Insights failed"}

ai_engine = AIEngineService()
