from datetime import datetime, timedelta

class LifeImpactSimulator:
    @staticmethod
    def project_payoff(
        principal: float, 
        interest_rate: float, 
        current_emi: float, 
        extra_monthly: float = 0,
        interest_type: str = "reducing"
    ):
        """
        Projects loan payoff timeline with extra monthly payments.
        """
        balance = principal
        monthly_rate = (interest_rate / 100) / 12
        months = 0
        total_interest = 0
        
        while balance > 0 and months < 600: # 50 years max
            interest_charge = balance * monthly_rate
            total_interest += interest_charge
            
            payment = current_emi + extra_monthly
            principal_payment = payment - interest_charge
            
            if principal_payment <= 0:
                return {"error": "Payment too low to cover interest"}
            
            balance -= principal_payment
            months += 1
            
        return {
            "months_to_payoff": months,
            "total_interest": round(total_interest, 2),
            "payoff_date": (datetime.now() + timedelta(days=months*30)).strftime("%Y-%m-%d"),
            "savings": 0 # Logic to compare with baseline
        }

simulator = LifeImpactSimulator()
