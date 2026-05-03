class AUJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "hecs_help": {
                "description": "Australia HECS-HELP system. Repayments based on taxable income.",
                "indexation_date": "June 1st",
                "voluntary_payment_benefit": "Timing optimization before June indexation."
            }
        }

    @staticmethod
    def calculate_indexation(balance: float, cpi_rate: float):
        return balance * cpi_rate
