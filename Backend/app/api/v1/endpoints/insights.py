from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.db.session import get_db
from app.models.models import Loan, User
from app.services.simulator import simulator

router = APIRouter()

@router.get("/summary")
async def get_financial_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Returns aggregated financial insights (Total Debt, Avg Interest, Tax Savings).
    """
    result = await db.execute(select(Loan).filter(Loan.user_id == current_user.id))
    loans = result.scalars().all()
    
    total_principal = sum([l.parsed_json.get('principal', 0) if l.parsed_json else 0 for l in loans])
    
    return {
        "total_loans": len(loans),
        "total_principal": total_principal,
        "tax_savings_estimate": 45000, # Mocked for India 80E
        "repayment_health": "ON_TRACK"
    }

@router.post("/simulate")
async def simulate_impact(
    loan_id: int,
    extra_monthly: float,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Life Impact Simulator — { loan_id, extra_monthly } → payoff projections.
    """
    result = await db.execute(select(Loan).filter(Loan.id == loan_id, Loan.user_id == current_user.id))
    loan = result.scalars().first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if not loan.parsed_json:
        raise HTTPException(status_code=400, detail="Loan not yet processed")
    
    p = loan.parsed_json.get("principal", 0)
    r = loan.parsed_json.get("interest_rate", 0)
    emi = loan.parsed_json.get("emi", 0)
    
    projection = simulator.project_payoff(p, r, emi, extra_monthly)
    return projection
