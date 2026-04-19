# Skill: invoice-generator

## Purpose
Generates professional invoices, receipts, quotes/estimates, and purchase orders for freelancers, small businesses, and startups. Handles GST-compliant Indian invoices, USD/multi-currency invoices, and automated calculations.

## When to Use
- Freelancer needs to send an invoice to a client
- Need a GST-compliant invoice for Indian clients
- Need a professional quote/estimate before starting work
- Need a receipt for a cash transaction
- Need to create invoice templates for recurring use
- Need tax invoice with CGST/SGST/IGST breakdown

## Invoice Types
| Type | When to Use |
|------|-------------|
| Tax Invoice (GST) | B2B sales to GST-registered businesses |
| Bill of Supply | Sales exempt from GST |
| Export Invoice | Sales to foreign clients |
| Proforma Invoice | Before final invoice (for advance payment) |
| Credit Note | For returns or corrections |
| Receipt | Acknowledging payment received |
| Quotation/Estimate | Pre-work cost breakdown |

## Usage Examples

```
"Generate a GST invoice for ₹50,000 web design work, 18% GST, client in Maharashtra"
"Create an invoice template for my freelance content writing service"
"Generate a USD invoice for $2000 worth of software development work"
"Make a receipt for a ₹5,000 cash payment I received"
"Create a professional quotation for a mobile app development project"
```

## Invoice Structure

### GST Invoice (India)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    TAX INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELLER:                          Invoice No: INV-2026-001
Ishu Kumar                       Invoice Date: 19 April 2026
IIT Patna, Bihta, Patna         Due Date: 19 May 2026
Bihar - 801103
GSTIN: [Your GSTIN]
PAN: [Your PAN]

BILL TO:
[Client Company Name]
[Address Line 1]
[City, State - PIN]
GSTIN: [Client GSTIN]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S.No  Description           HSN   Qty  Rate    Amount
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1     Website Development   9983  1    42,373  42,373
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            Subtotal:        ₹42,373
                            CGST @9%:        ₹3,814
                            SGST @9%:        ₹3,814
                            ─────────────────────────
                            TOTAL:           ₹50,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount in words: Fifty Thousand Rupees Only

Bank Details for NEFT/RTGS/UPI:
Account Name: Ishu Kumar
Account No: XXXXXXXX
IFSC: XXXXXXXX
UPI: ishu@upi

Terms: Payment due within 30 days of invoice date.
Late payment: 2% per month after due date.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## GST Calculation Logic

### CGST + SGST (Intra-state supply)
```python
def calculate_gst(amount: float, gst_rate: float, supply_type: str) -> dict:
    """
    supply_type: 'intra' (same state) or 'inter' (different state)
    """
    if supply_type == "intra":
        cgst = amount * (gst_rate / 2) / 100
        sgst = amount * (gst_rate / 2) / 100
        igst = 0
    else:  # inter-state
        cgst = 0
        sgst = 0
        igst = amount * gst_rate / 100
    
    total = amount + cgst + sgst + igst
    return {
        "subtotal": round(amount, 2),
        "cgst": round(cgst, 2),
        "sgst": round(sgst, 2),
        "igst": round(igst, 2),
        "total": round(total, 2)
    }
```

### Common GST Rates by Service
| Service | SAC/HSN | GST Rate |
|---------|---------|----------|
| IT Services / Software Dev | 9983 | 18% |
| Web Design | 9983 | 18% |
| Content Writing | 9983 | 18% |
| Consulting | 9983 | 18% |
| Education Services | 9992 | 0% (if exempt) |
| Restaurant Services | 9963 | 5% (without ITC) / 18% (with ITC) |
| Construction | 9954 | 5%/12%/18% (varies) |
| Transport | 9965 | 5% |

## International Invoice Template
```
INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM:                   TO:
Ishu Kumar              [Client Name]
Patna, India            [City, Country]

Invoice #: INV-2026-001
Date: April 19, 2026
Currency: USD

SERVICES:
Web Application Development    $2,000.00
Testing & QA                   $500.00
                               ─────────
Subtotal:                      $2,500.00
Tax (0% - export service):     $0.00
                               ─────────
TOTAL DUE:                     $2,500.00

Payment Methods:
• Wire Transfer: [Bank details]
• PayPal: ishukumar@example.com
• Wise: [Wise account]
• Crypto (USDC): [Wallet address]

Payment Terms: Net 30
```

## ISHU TOOLS Invoice Tool Features
```
Tool: Invoice Generator
Inputs:
  - Invoice type (GST / International / Simple)
  - Your details (name, address, GSTIN)
  - Client details
  - Line items (description, quantity, rate)
  - GST rate (0/5/12/18/28%)
  - Supply type (intra/inter state)
  - Payment terms
  - Bank/UPI details

Output:
  - Formatted HTML invoice
  - Download as PDF
  - Copy invoice number
  - Share via WhatsApp
```

## Invoice Numbering System
```python
def generate_invoice_number(prefix: str = "INV", year: int = 2026) -> str:
    """
    Format: PREFIX-YEAR-SEQUENCE
    Examples: INV-2026-001, ISH-2026-042
    """
    import random
    seq = random.randint(1, 999)  # In production, use DB auto-increment
    return f"{prefix}-{year}-{seq:03d}"
```

## Related Skills
- `legal-contract` — accompanying service agreements
- `tax-reviewer` — GST filing and compliance
- `ai-secretary` — professional email with invoice
- `excel-generator` — invoice tracking spreadsheet
