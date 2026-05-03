from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
import structlog

logger = structlog.get_logger()

class PDFService:
    @staticmethod
    def generate_loan_certificate(loan_data: dict, user_data: dict):
        """
        Generates a PDF certificate for tax deduction (e.g., Section 80E in India).
        """
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width/2, height - 50, "LendWise Global — Loan Interest Certificate")
        
        # User Info
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 100, f"Name: {user_data.get('name')}")
        p.drawString(50, height - 120, f"Jurisdiction: {user_data.get('jurisdiction')}")
        
        # Loan Info
        p.drawString(50, height - 160, f"Loan Name: {loan_data.get('name')}")
        p.drawString(50, height - 180, f"Principal Amount: {loan_data.get('currency')} {loan_data.get('principal')}")
        
        # Repayment Summary
        p.drawString(50, height - 220, "Interest Paid in FY 2023-24:")
        p.setFont("Helvetica-Bold", 12)
        p.drawString(250, height - 220, f"{loan_data.get('currency')} 45,000") # Mock data

        p.showPage()
        p.save()
        
        buffer.seek(0)
        return buffer.getvalue()

pdf_service = PDFService()
