class USAJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "interest_deduction": {
                "description": "Student loan interest deduction up to $2,500.",
                "max_amount": 2500,
                "phase_out_start": 70000, # Single filer
                "phase_out_end": 85000
            },
            "pslf": {
                "description": "Public Service Loan Forgiveness after 120 qualifying payments.",
                "eligibility": "Non-profit or government employment",
                "payments_required": 120
            },
            "idr": {
                "description": "Income-Driven Repayment plans (SAVE, IBR, PAYE).",
                "discretionary_income_factor": 0.10 # 10% for SAVE
            }
        }

    @staticmethod
    def calculate_idr_payment(annual_income: float, family_size: int, poverty_line: float = 15060):
        # SAVE plan logic: (Income - 225% of Poverty Line) * 10% / 12
        discretionary_income = annual_income - (2.25 * poverty_line)
        if discretionary_income <= 0:
            return 0
        return (discretionary_income * 0.10) / 12
