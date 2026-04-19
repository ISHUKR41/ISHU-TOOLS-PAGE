# Skill: tax-reviewer

## Purpose
Provides Indian tax guidance — income tax calculations, deduction planning under 80C/80D/HRA, GST compliance, ITR filing guidance, capital gains tax, freelancer tax planning, and advance tax calculations.

## When to Use
- User wants to know how much income tax they'll pay
- User wants to maximize deductions (save more tax)
- User is a freelancer needing to understand GST and advance tax
- User needs to understand HRA exemption calculation
- User wants to know capital gains tax on stocks/property
- User needs to file ITR and wants a checklist

## ⚠️ Disclaimer
```
This skill provides general tax education based on Indian tax laws.
This is NOT professional tax advice.
For complex situations, consult a CA (Chartered Accountant).
Tax laws change annually with the Union Budget.
Data current as of AY 2026-27.
```

## Income Tax Calculator (AY 2026-27)

### New Tax Regime (Default from FY 2024-25)
```python
def calculate_income_tax_new_regime(gross_income: float) -> dict:
    """
    New regime tax slabs AY 2026-27:
    ₹0 - ₹3L: NIL
    ₹3L - ₹7L: 5%
    ₹7L - ₹10L: 10%
    ₹10L - ₹12L: 15%
    ₹12L - ₹15L: 20%
    Above ₹15L: 30%
    
    Standard Deduction: ₹75,000 (salaried employees)
    Rebate u/s 87A: Full rebate if income ≤ ₹7L (tax = 0)
    """
    standard_deduction = 75000  # For salaried
    taxable_income = max(0, gross_income - standard_deduction)
    
    tax = 0
    if taxable_income > 1500000:
        tax += (taxable_income - 1500000) * 0.30
        taxable_income = 1500000
    if taxable_income > 1200000:
        tax += (taxable_income - 1200000) * 0.20
        taxable_income = 1200000
    if taxable_income > 1000000:
        tax += (taxable_income - 1000000) * 0.15
        taxable_income = 1000000
    if taxable_income > 700000:
        tax += (taxable_income - 700000) * 0.10
        taxable_income = 700000
    if taxable_income > 300000:
        tax += (taxable_income - 300000) * 0.05
    
    # Rebate u/s 87A: If income ≤ ₹7L, full rebate
    if gross_income - standard_deduction <= 700000:
        tax = 0
    
    # Surcharge
    surcharge = 0
    if gross_income > 5000000:
        surcharge = tax * 0.10
    
    # Education Cess (4% on tax + surcharge)
    cess = (tax + surcharge) * 0.04
    
    total_tax = tax + surcharge + cess
    
    return {
        "gross_income": gross_income,
        "standard_deduction": standard_deduction,
        "taxable_income": max(0, gross_income - standard_deduction),
        "income_tax": round(tax),
        "surcharge": round(surcharge),
        "education_cess": round(cess),
        "total_tax": round(total_tax),
        "effective_rate_pct": round(total_tax / gross_income * 100, 2) if gross_income > 0 else 0,
        "take_home_monthly": round((gross_income - total_tax) / 12)
    }
```

### Old Tax Regime (With Deductions)
```
Tax Slabs:
₹0 - ₹2.5L: NIL
₹2.5L - ₹5L: 5%
₹5L - ₹10L: 20%
Above ₹10L: 30%

Rebate u/s 87A: If income ≤ ₹5L, full rebate

Available Deductions:
80C: Up to ₹1,50,000 (PPF, ELSS, LIC, EPF, FD, home loan principal)
80D: Health insurance premium (₹25k self + ₹25k/₹50k parents)
80CCD(2): NPS by employer (up to 10% of salary)
HRA: Exempt up to min of (actual HRA / 50%/40% of salary / rent - 10% salary)
Standard Deduction: ₹50,000
Home Loan Interest: Up to ₹2L (section 24b)
```

## HRA Exemption Calculator
```python
def hra_exemption(
    basic_salary: float,    # Annual basic salary
    hra_received: float,    # Annual HRA from employer
    rent_paid: float,       # Annual rent actually paid
    city_type: str          # "metro" or "non-metro"
) -> dict:
    """
    HRA Exempt = Minimum of:
    1. Actual HRA received
    2. 50% of basic (metro) or 40% of basic (non-metro)
    3. Rent paid - 10% of basic salary
    """
    pct = 0.50 if city_type == "metro" else 0.40
    
    limit1 = hra_received
    limit2 = basic_salary * pct
    limit3 = max(0, rent_paid - basic_salary * 0.10)
    
    exempt = min(limit1, limit2, limit3)
    taxable_hra = hra_received - exempt
    
    return {
        "hra_received": hra_received,
        "exempt_amount": round(exempt),
        "taxable_hra": round(taxable_hra),
        "binding_limit": ["HRA received", f"{int(pct*100)}% of basic", "Rent - 10% basic"][
            [limit1, limit2, limit3].index(exempt)
        ]
    }
```

## Top 10 Tax-Saving Investments (Section 80C)
```
Investment         Limit   Returns    Lock-in    Risk
─────────────────────────────────────────────────────
EPF (Salary)       1.5L    8.25%     Till retir. Very Low
PPF                1.5L    7.1%      15 years   Very Low
ELSS (Mutual Fund) 1.5L    12-15%*   3 years    Medium-High
NPS                2L      8-10%*    Till retir. Medium
Life Insurance     1.5L    4-6%      Policy term Low
Tax-saver FD       1.5L    6-7%      5 years    Very Low
NSC                1.5L    7.7%      5 years    Very Low
SCSS (Sr. Citizen) 1.5L    8.2%      5 years    Very Low
Sukanya Samriddhi  1.5L    8.2%      21 years   Very Low
Home Loan (Prin.)  1.5L    —         Till repay  None

*Market-linked, not guaranteed. Historical returns shown.
```

## Freelancer Tax Guide

### GST Registration
```
Mandatory GST if:
• Annual turnover > ₹20 lakhs (services)
• Annual turnover > ₹40 lakhs (goods)
• Providing services across state lines (regardless of turnover)
• Digital/e-commerce services

Freelancer GST Rate: 18% on services (SAC 9983)
File: GSTR-1 (monthly) + GSTR-3B (monthly) + GSTR-9 (annual)
```

### Advance Tax (Freelancers)
```
If tax liability > ₹10,000, pay advance tax in 4 installments:
Jun 15: 15% of annual tax
Sep 15: 45% of annual tax (cumulative)
Dec 15: 75% of annual tax (cumulative)  
Mar 15: 100% of annual tax (cumulative)

Penalty for non-payment: 1% per month (Section 234B/234C)
```

### Freelancer Expenses You Can Deduct
```
✅ Internet and phone bills (work portion)
✅ Home office (proportionate rent/electricity)
✅ Professional subscriptions (software, tools)
✅ Domain and hosting costs
✅ Professional development (courses, books)
✅ Equipment depreciation (laptop, camera, etc.)
✅ Accounting and professional fees
✅ Travel for client meetings
```

## ITR Filing Checklist (AY 2026-27, FY 2025-26)

```
DOCUMENTS NEEDED:
□ Form 16 (from employer)
□ Form 26AS / AIS / TIS (from Income Tax portal)
□ Bank statements (all accounts)
□ Home loan interest certificate
□ Insurance premium receipts
□ Investment proofs (PPF, ELSS, NPS, etc.)
□ Rent receipts (for HRA claim)
□ Capital gains statement (from Zerodha/Groww)
□ Form 16A (TDS from other sources)

FILING DEADLINES:
July 31: Non-audit cases (most individuals)
October 31: Audit cases
December 31: Belated return (with penalty)

WHERE TO FILE:
IT Portal: incometax.gov.in
Or through: ClearTax, TaxBuddy, myITreturn
```

## Related Skills
- `invoice-generator` — GST invoice generation
- `insurance-optimizer` — tax benefits on insurance
- `stock-analyzer` — capital gains tax planning
- `real-estate-analyzer` — property tax and HRA
