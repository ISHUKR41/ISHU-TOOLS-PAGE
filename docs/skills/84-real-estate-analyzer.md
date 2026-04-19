# Skill: real-estate-analyzer

## Purpose
Analyzes real estate investments — calculates ROI, rental yield, EMI burden, appreciation projections, and compares locations for property investment. Provides Indian market context including stamp duty, registration charges, and home loan calculations.

## When to Use
- User wants to know if a property is worth buying
- User needs EMI calculation for a home loan
- User wants to compare renting vs buying
- User needs stamp duty and registration cost estimates
- User wants rental yield analysis
- User wants appreciation estimates for different cities

## Core Calculations

### Home Loan EMI Calculator
```python
def calculate_emi(principal: float, annual_rate: float, tenure_years: int) -> dict:
    """
    EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    P = principal, r = monthly rate, n = months
    """
    r = annual_rate / 12 / 100
    n = tenure_years * 12
    emi = principal * r * (1 + r)**n / ((1 + r)**n - 1)
    total_paid = emi * n
    total_interest = total_paid - principal
    
    return {
        "emi_monthly": round(emi),
        "total_paid": round(total_paid),
        "total_interest": round(total_interest),
        "interest_percentage": round(total_interest / principal * 100, 1)
    }

# Example: ₹50 lakh loan, 8.5% rate, 20 years
# EMI: ₹43,391/month
# Total paid: ₹1,04,13,840
# Total interest: ₹54,13,840 (108.3% of principal!)
```

### Rental Yield Calculator
```python
def rental_yield(property_value: float, monthly_rent: float) -> dict:
    annual_rent = monthly_rent * 12
    gross_yield = (annual_rent / property_value) * 100
    # Adjust for vacancy (5%) and maintenance (10%)
    net_rent = annual_rent * 0.85
    net_yield = (net_rent / property_value) * 100
    
    return {
        "gross_yield_pct": round(gross_yield, 2),
        "net_yield_pct": round(net_yield, 2),
        "payback_years": round(property_value / net_rent, 1),
        "verdict": "Good" if net_yield >= 3 else "Average" if net_yield >= 2 else "Poor"
    }

# Benchmark: >3% net yield = good investment in India
```

### Rent vs Buy Analysis
```python
def rent_vs_buy(
    property_price: float,  # ₹80 lakh
    monthly_rent_equivalent: float,  # ₹20,000/month for similar property
    loan_rate: float,  # 8.5%
    tenure: int,  # 20 years
    appreciation: float,  # 5% annual
    investment_returns: float  # 10% annual (if down payment invested instead)
) -> dict:
    """Compare total cost of renting vs buying over tenure"""
    # Buy scenario
    down_payment = property_price * 0.20  # 20% down
    loan = property_price * 0.80
    emi = calculate_emi(loan, loan_rate, tenure)["emi_monthly"]
    total_buy_cost = down_payment + emi * tenure * 12
    future_value = property_price * (1 + appreciation/100) ** tenure
    
    # Rent scenario  
    total_rent = monthly_rent_equivalent * tenure * 12 * 1.05  # 5% annual rent hike
    investment_value = down_payment * (1 + investment_returns/100) ** tenure
    
    return {
        "buy_total_cost": round(total_buy_cost),
        "buy_asset_value": round(future_value),
        "buy_net_position": round(future_value - total_buy_cost),
        "rent_total_cost": round(total_rent),
        "rent_investment_value": round(investment_value),
        "rent_net_position": round(investment_value - total_rent),
        "recommendation": "BUY" if (future_value - total_buy_cost) > (investment_value - total_rent) else "RENT"
    }
```

## Stamp Duty & Registration Calculator (India)

### State-wise Rates (2026)
```python
stamp_duty_rates = {
    "Maharashtra": {"male": 6, "female": 5, "joint": 5.5},
    "Delhi": {"male": 6, "female": 4, "joint": 5},
    "Karnataka": {"male": 5.65, "female": 5.65, "joint": 5.65},
    "Tamil Nadu": {"male": 7, "female": 7, "joint": 7},
    "Uttar Pradesh": {"male": 7, "female": 6, "joint": 7},
    "Rajasthan": {"male": 6, "female": 5, "joint": 5.5},
    "Gujarat": {"male": 4.9, "female": 4.9, "joint": 4.9},
    "West Bengal": {"male": 7, "female": 7, "joint": 7},
    "Telangana": {"male": 5, "female": 5, "joint": 5},
    "Bihar": {"male": 6, "female": 5.7, "joint": 5.7},
}

# Registration charges: 1% of property value in most states (max varies)

def calculate_registration_cost(property_value: float, state: str, gender: str = "male") -> dict:
    sd_rate = stamp_duty_rates.get(state, {}).get(gender, 6)
    stamp_duty = property_value * sd_rate / 100
    registration = min(property_value * 0.01, 100000)  # Usually max 1 lakh
    
    return {
        "stamp_duty": round(stamp_duty),
        "registration_charges": round(registration),
        "total": round(stamp_duty + registration),
        "rate_applied": f"{sd_rate}%"
    }
```

## Indian Real Estate Market Context

### City-wise Rental Yields (2026)
```
City              Avg Yield    Good Location   
Mumbai            2.0-3.5%     Thane, Navi Mumbai (3%)
Delhi/NCR         2.5-4.0%     Noida, Gurgaon (3-4%)
Bengaluru         3.0-4.5%     Whitefield, Electronic City (4%)
Hyderabad         3.5-5.0%     HITEC City, Gachibowli (4-5%)
Pune              3.0-4.5%     Hinjewadi, Kharadi (3.5%)
Chennai           3.0-4.0%     OMR, Perungudi (3.5%)
Kolkata           3.0-4.5%     New Town, Rajarhat (4%)
Patna             4.0-6.0%     Exhibition Road, Bailey Road (5%)
```

### Historical Appreciation Rates (India, 15-year avg)
```
Tier 1 Cities: 8-12% annually (Mumbai, Delhi, Bengaluru)
Tier 2 Cities: 6-10% annually (Pune, Hyderabad, Jaipur)
Tier 3 Cities: 4-8% annually (Patna, Bhopal, Lucknow)
```

## Property Investment Decision Framework
```
✅ BUY if:
- Rental yield > 3% in that location
- You plan to stay 7+ years
- Property near metro/IT hub/university
- Price is stable or growing

❌ AVOID if:
- Rental yield < 2%
- Builder project with no RERA registration
- No clear title (get legal opinion first)
- Far from essential infrastructure
- Over-leveraged (EMI > 40% of monthly income)
```

## Related Skills
- `insurance-optimizer` — property insurance
- `tax-reviewer` — property tax and HRA deductions
- `legal-contract` — sale agreements
- `geo` — location analysis
