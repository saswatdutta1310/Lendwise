class UKJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "plan_types": {
                "Plan 1": {"threshold": 22015, "rate": 0.09},
                "Plan 2": {"threshold": 27295, "rate": 0.09},
                "Plan 4": {"threshold": 27660, "rate": 0.09},
                "Plan 5": {"threshold": 25000, "rate": 0.09},
                "Postgrad": {"threshold": 21000, "rate": 0.06}
            },
            "write_off": {
                "description": "Remaining balance written off after 25-40 years depending on plan.",
            }
        }

    @staticmethod
    def calculate_compulsory_repayment(annual_income: float, plan_type: str = "Plan 2"):
        rules = UKJurisdiction.get_tax_rules()["plan_types"]
        plan = rules.get(plan_type, rules["Plan 2"])
        
        if annual_income <= plan["threshold"]:
            return 0
        
        return (annual_income - plan["threshold"]) * plan["rate"]
