class AUJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "hecs_help": {
                "description": "Compulsory repayments via tax system when income exceeds threshold.",
                "repayment_thresholds_2023": [
                    {"min": 51550, "rate": 0.01},
                    {"min": 59519, "rate": 0.02},
                    {"min": 63090, "rate": 0.025},
                    {"min": 66876, "rate": 0.03},
                    {"min": 70889, "rate": 0.035},
                    {"min": 75141, "rate": 0.04},
                    {"min": 79651, "rate": 0.045},
                    {"min": 84430, "rate": 0.05}
                ]
            },
            "indexation": {
                "description": "Debt is indexed to CPI annually on June 1st.",
            }
        }

    @staticmethod
    def calculate_compulsory_repayment(annual_income: float):
        thresholds = AUJurisdiction.get_tax_rules()["hecs_help"]["repayment_thresholds_2023"]
        applicable_rate = 0
        for t in thresholds:
            if annual_income >= t["min"]:
                applicable_rate = t["rate"]
            else:
                break
        return annual_income * applicable_rate
