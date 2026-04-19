# Skill: supplier-research

## Purpose
Researches and evaluates suppliers, manufacturers, and vendors — comparing pricing, quality metrics, lead times, MOQ requirements, certifications, and reliability for products sourced from India and globally (China, Southeast Asia, Europe).

## When to Use
- Starting a product business and need to find manufacturers
- Need to compare supplier quotes and evaluate best option
- Need to identify reliable Indian suppliers for a product
- Need to evaluate a supplier before placing a large order
- Need to understand import/export regulations
- Need B2B vendor research for your startup

## Supplier Research Framework

### Stage 1: Market Mapping
```
1. Define product specifications (material, dimensions, certifications needed)
2. Identify source countries (India domestic / China / Taiwan / Vietnam)
3. Find supplier platforms:
   - IndiaMart.com (Indian manufacturers)
   - Alibaba.com (Global manufacturers)
   - TradeIndia.com (Indian B2B)
   - GlobalSources.com (Asian manufacturers)
   - Kompass.com (Global verified suppliers)
4. Initial screening (20-30 suppliers → shortlist 5-7)
```

### Stage 2: Supplier Evaluation Criteria
```
Factor                Weight  How to Evaluate
───────────────────────────────────────────────
Product quality        30%    Request samples, check certifications
Price competitiveness  25%    Compare quotes, calculate landed cost
Reliability            20%    Years in business, customer references
Lead time              10%    Sample: 1-2 weeks. Bulk: 4-8 weeks typical
MOQ flexibility        10%    Can they start small?
Communication          5%     Response time, language, clarity
```

### Stage 3: Due Diligence
```
For Indian Suppliers:
□ Verify GST registration number
□ Check MCA21 for company registration (CIN number)
□ Ask for MSME certificate (for SSI units)
□ Check if they have export license (if needed)
□ Visit factory if >₹10 lakh order

For Chinese/Global Suppliers:
□ Verify business license (Business License Certificate)
□ Check Alibaba Trade Assurance / Gold Supplier status
□ Request factory audit report
□ Get references from existing customers
□ Start with small test order (50-100 units)
```

## Supplier Request for Quote (RFQ) Template

```
RFQ — REQUEST FOR QUOTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: [Your Company]
Date: [Date]
RFQ Reference: RFQ-2026-001

PRODUCT SPECIFICATIONS:
Product Name: [Product]
Description: [Detailed description]
Material/Grade: [Specify material]
Dimensions: [L × W × H] or [specifications]
Weight: [Per unit]
Colour/Finish: [Options]
Packaging: [Individual / Bulk / Custom]
Certifications Required: [ISO, BIS, CE, etc.]

QUANTITY & DELIVERY:
Initial Order Quantity: [Units]
Expected Annual Volume: [Units]
Required Delivery Date: [Date]
Delivery Location: [City, State]

PRICING REQUEST:
Please quote for the following quantities:
Qty 100: ₹_____
Qty 500: ₹_____
Qty 1000: ₹_____
Qty 5000: ₹_____

Include: Unit price, packaging, freight, taxes

SAMPLE REQUEST:
Please send 2-3 samples before bulk order.
Sample cost (refundable on bulk order): ₹_____

RESPONSE DEADLINE: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact: [Name, Email, Phone]
```

## Indian Manufacturing Hubs by Product

### Product → Location Mapping
```
Electronics & Mobile Accessories: Noida (UP), Bengaluru, Chennai
Textiles & Clothing: Tirupur (TN), Surat (GJ), Ludhiana (PB)
Leather Goods: Agra (UP), Chennai, Kolkata
Auto Components: Pune, Chennai, Gurgaon
Furniture: Jodhpur (Rajasthan), Mumbai
Pharma: Hyderabad, Ahmedabad, Mumbai
IT Hardware: Bengaluru, Hyderabad, Pune
Food Processing: Punjab, Haryana, Maharashtra
Chemicals: Gujarat (Vapi, Ankleshwar)
Steel/Metal: Jharkhand, Odisha, Chhattisgarh
Ceramics: Morbi (Gujarat) — world's largest ceramic hub
Toys: Rajkot (GJ), Alibag
```

## Import Cost Calculator (India)

### Landed Cost = CIF + Customs Duty + GST + Other Charges
```python
def calculate_import_cost(
    fob_price_usd: float,
    freight_usd: float,
    insurance_pct: float,  # usually 0.5-1%
    basic_customs_duty_pct: float,  # varies by product
    igst_pct: float,  # usually 18%
    usd_inr_rate: float = 83.5,
) -> dict:
    
    cif_usd = fob_price_usd + freight_usd + (fob_price_usd * insurance_pct / 100)
    cif_inr = cif_usd * usd_inr_rate
    
    # BCD (Basic Customs Duty)
    bcd = cif_inr * basic_customs_duty_pct / 100
    
    # Social Welfare Surcharge (10% of BCD)
    sws = bcd * 0.10
    
    # IGST (on CIF + BCD + SWS)
    assessable_value = cif_inr + bcd + sws
    igst = assessable_value * igst_pct / 100
    
    total_landed = cif_inr + bcd + sws + igst
    
    return {
        "cif_inr": round(cif_inr),
        "basic_customs_duty": round(bcd),
        "social_welfare_surcharge": round(sws),
        "igst": round(igst),
        "total_landed_cost_inr": round(total_landed),
        "effective_import_duty_pct": round((total_landed - cif_inr) / cif_inr * 100, 1)
    }
```

## Supplier Red Flags
```
❌ No physical address or factory photos
❌ Prices suspiciously below market (too good to be true)
❌ Unwilling to provide samples before bulk order
❌ No export experience for international orders
❌ Poor communication response time (> 48 hours)
❌ Can't provide quality certifications
❌ Pressure tactics: "This price valid only today"
❌ Insists on 100% advance payment from new buyer
❌ No references from existing customers
❌ Factory visit not allowed
```

## Negotiation Tips
```
1. Get 3+ competing quotes before negotiating
2. Lead with volume potential, not just current order
3. Ask for payment terms: "Can we do 30% advance, 70% on delivery?"
4. Negotiate beyond price: free samples, better packaging, faster delivery
5. Lock in prices for 12 months with a framework agreement
6. Start with small order → prove relationship → scale up
```

## Related Skills
- `competitive-analysis` — supplier market mapping
- `legal-contract` — purchase agreements
- `invoice-generator` — purchase orders
- `deep-research` — in-depth supplier research
