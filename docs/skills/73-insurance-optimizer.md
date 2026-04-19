# Skill: insurance-optimizer

## Purpose
Analyzes, compares, and optimizes insurance coverage — health, life, vehicle, term, ULIP, and business insurance — providing premium calculations, coverage gap analysis, claim probability estimates, and personalized recommendations for the Indian insurance market.

## When to Use
- User wants to compare health insurance plans
- User needs term life insurance premium estimates
- User wants to know if their current insurance is adequate
- User is calculating insurance for a vehicle
- User wants to understand ULIP vs. term insurance
- User needs to file a claim and wants guidance

## Core Capabilities
| Analysis Type | Output |
|---------------|--------|
| Premium Calculator | Estimated premium based on age, sum assured, tenure |
| Coverage Gap Analysis | How much more coverage you need |
| Plan Comparison | Side-by-side comparison of insurance plans |
| Claim Guide | Step-by-step claim filing process |
| Tax Benefits | Deductions under 80C, 80D for insurance |
| Nominee Planning | How to structure nominations |
| Portfolio Review | Evaluate total insurance portfolio |

## Usage Examples

```
"Calculate term life insurance premium for a 28-year-old, ₹1 crore cover, 30 years"
"Compare health insurance: Star Health vs HDFC Ergo vs Niva Bupa for family of 4"
"How much health insurance coverage does a 30-year-old with family history of diabetes need?"
"Explain ULIP vs term insurance — which is better?"
"Calculate vehicle insurance premium for a 2022 Maruti Swift in Delhi"
```

## Term Life Insurance Calculator

### Premium Estimation (Approximate)
```
Formula: Premium ≈ Sum Assured × Rate × Adjustments

Age-based rates (per ₹1 lakh sum assured, 30-year term, non-smoker male):
Age 25: ₹45-60/year
Age 30: ₹55-75/year
Age 35: ₹80-110/year
Age 40: ₹130-180/year
Age 45: ₹210-290/year

Example: 30-year-old, ₹1 crore, 30 years
Premium range: ₹550-750/month (₹6,600-9,000/year)
```

### Coverage Adequacy Formula
```
Ideal life cover = (Annual Income × 10) + Outstanding Loans + Future Goals

For annual income ₹10 LPA:
= (10,00,000 × 10) + Home loan (₹30L) + Child education (₹20L)
= ₹1 crore + ₹50 lakh = ₹1.5 crore recommended
```

## Health Insurance Guidelines

### Coverage Recommendations
| Age | Individual | Family Floater |
|-----|-----------|----------------|
| 25-35 | ₹5-10 lakh | ₹10-15 lakh |
| 35-45 | ₹10-15 lakh | ₹15-25 lakh |
| 45-55 | ₹15-25 lakh | ₹25-50 lakh |
| 55+ | ₹25-50 lakh | ₹50L+ (senior plan) |

### Key Features to Look For
```
✅ Restoration benefit (after claim, cover restored)
✅ No-claim bonus (5-50% increase in sum insured)
✅ Day 1 coverage (no waiting period for accidents)
✅ Cashless hospitals in your city (network size matters)
✅ Pre + post hospitalization coverage
✅ Annual health checkup included
✅ Mental health coverage
✅ COVID-19 and viral diseases included
❌ Avoid plans with sub-limits on room rent
❌ Avoid very low doctor fee limits
```

## Tax Benefits on Insurance (India)

### Section 80D — Health Insurance
```
Self + spouse + children:
  - Premium up to ₹25,000 deductible (self < 60)
  - Premium up to ₹50,000 deductible (self ≥ 60)

Parents:
  - Additional ₹25,000 (parents < 60)
  - Additional ₹50,000 (parents ≥ 60)

Max total deduction: ₹75,000 (if parents are senior citizens)
```

### Section 80C — Life Insurance Premium
```
Premium paid for:
- Term insurance ✅
- Endowment plans ✅
- ULIPs ✅
Limit: ₹1,50,000/year (combined with other 80C investments)
```

## ULIP vs Term Insurance Comparison
```
                    Term Insurance      ULIP
Purpose             Pure protection     Protection + Investment
Premium             Low (₹700-2000/mo)  High (₹3000-10000/mo)
Death benefit       Sum assured         Higher of sum or fund value
Returns             None                Market-linked (10-12%)
Transparency        High                Low (charges complex)
Flexibility         Low                 High (fund switching)
Surrender charges   None                High (first 5 years)
Recommended for     Those who need      Not generally recommended
                    coverage only       (better to buy term + invest separately)
```

## Vehicle Insurance Calculator

### Key Factors
```
IDV (Insured Declared Value) = 
    Current market price × (1 - depreciation rate)

Depreciation rates:
0-6 months: 5%
6-12 months: 15%
1-2 years: 20%
2-3 years: 30%
3-4 years: 40%
4-5 years: 50%

Third-party premium: Fixed by IRDAI
  Engine ≤ 1000cc: ₹2,094/year
  1000-1500cc: ₹3,416/year
  >1500cc: ₹7,897/year
```

## Insurance Tools for ISHU TOOLS Platform
1. **Term Life Premium Calculator** — age, income, cover amount → premium range
2. **Health Insurance Comparison** — filters by sum insured, city, family/individual
3. **80C/80D Tax Calculator** — how much tax you save on insurance premiums
4. **IDV Calculator** — vehicle insurance declared value
5. **Coverage Gap Analyzer** — are you underinsured?

## Related Skills
- `tax-reviewer` — tax implications of insurance
- `real-estate-analyzer` — property insurance
- `finance tools` — overall financial planning
