class IndiaJurisdiction:
    @staticmethod
    def get_tax_rules():
        return {
            "section_80e": {
                "description": "Deduction on interest paid on education loans for 8 years.",
                "eligibility": "Individual, higher education",
                "max_years": 8
            },
            "pmis_subsidy": {
                "description": "Central Sector Interest Subsidy Scheme for economically weaker sections.",
            }
        }

    @staticmethod
    def calculate_tax_savings(interest_paid: float, income_slab: str):
        # Implementation of Section 80E logic
        return interest_paid * 0.30 # Example: 30% tax bracket saving
