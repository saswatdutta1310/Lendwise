class UKJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "plan_1": {"threshold": 22015, "rate": 0.09},
            "plan_2": {"threshold": 27295, "rate": 0.09},
            "plan_5": {"threshold": 25000, "rate": 0.09},
            "description": "Repayments are threshold-based and taken via payroll (PAYE)."
        }

    @staticmethod
    def calculate_repayment(annual_income: float, plan: str):
        # Implementation of UK Plan threshold logic
        thresholds = {"plan_1": 22015, "plan_2": 27295, "plan_5": 25000}
        threshold = thresholds.get(plan, 27295)
        if annual_income <= threshold:
            return 0
        return (annual_income - threshold) * 0.09
