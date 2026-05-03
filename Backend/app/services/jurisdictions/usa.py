class USAJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "interest_deduction": {
                "max_amount": 2500,
                "description": "Student loan interest deduction from taxable income.",
            },
            "idr_plans": ["SAVE", "PAYE", "IBR", "ICR"],
            "pslf": {
                "required_payments": 120,
                "description": "Public Service Loan Forgiveness for non-profit/gov employees."
            }
        }

    @staticmethod
    def calculate_save_payment(discretionary_income: float):
        """
        Calculates payment for the SAVE plan (10% or 5% of discretionary income).
        """
        return discretionary_income * 0.10 # Example placeholder
