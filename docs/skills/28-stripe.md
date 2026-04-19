# Stripe Skill — Ultra-Detailed Reference

## What It Does
Provides comprehensive guidance for integrating Stripe payment processing into ISHU TOOLS. Covers the full payment lifecycle: checkout sessions, payment intents, subscriptions, customer portal, webhooks, and Indian market specifics (INR, UPI). Stripe is the right choice for web-based payments.

---

## ISHU TOOLS Monetization Context

Currently ISHU TOOLS is free. If premium features are added (e.g., more storage, faster processing, ad-free, API access), Stripe would power:

| Feature | Stripe Product |
|---|---|
| Monthly/Annual subscription | Stripe Subscriptions |
| One-time premium tool unlock | Payment Intent |
| Credits system (pay-per-use) | Stripe Meters |
| Student discount code | Stripe Coupon |

---

## Setup Checklist

### 1. Check integrations first
```javascript
const conn = await searchIntegrations({ query: "stripe" });
// If Stripe connector available → connect via UI (auto-injects keys)
```

### 2. Install SDK
```javascript
await installLanguagePackages({ language: "python", packages: ["stripe"] });
await installLanguagePackages({ language: "nodejs", packages: ["@stripe/stripe-js"] });
```

### 3. Set environment variables
```javascript
// These go in Replit secrets — never hardcode
// STRIPE_SECRET_KEY = sk_live_... or sk_test_...
// STRIPE_PUBLISHABLE_KEY = pk_live_... or pk_test_...
// STRIPE_WEBHOOK_SECRET = whsec_...
await setEnvVar({ key: "STRIPE_SECRET_KEY", value: "sk_test_..." });
await setEnvVar({ key: "VITE_STRIPE_PK", value: "pk_test_..." });
```

---

## Backend (FastAPI + Python)

### Complete Checkout Session
```python
import stripe
import os

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

@app.post("/api/payments/create-checkout")
async def create_checkout(plan: str = "monthly"):
    prices = {
        "monthly": "price_monthly_id_from_stripe_dashboard",
        "yearly": "price_yearly_id_from_stripe_dashboard",
    }
    
    session = stripe.checkout.Session.create(
        payment_method_types=["card", "upi"],  # UPI for Indian users
        line_items=[{
            "price": prices[plan],
            "quantity": 1,
        }],
        mode="subscription",
        success_url="https://ishutools.com/payment/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="https://ishutools.com/pricing",
        currency="inr",  # Indian Rupee
        # Pre-fill if user is logged in:
        # customer_email=user.email,
    )
    
    return {"checkout_url": session.url}
```

### Customer Portal (Manage Subscription)
```python
@app.post("/api/payments/portal")
async def customer_portal(customer_id: str):
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url="https://ishutools.com/account",
    )
    return {"portal_url": session.url}
```

### Webhook Handler
```python
@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ["STRIPE_WEBHOOK_SECRET"]
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid webhook signature")
    
    # Handle events
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session["customer"]
        # Grant access to premium features
        await grant_premium_access(customer_id)
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        # Revoke premium access
        await revoke_premium_access(subscription["customer"])
    
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        # Notify user: payment failed
        await notify_payment_failed(invoice["customer"])
    
    return {"received": True}
```

---

## Frontend (React + TypeScript)

```typescript
// PricingPage.tsx
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

function PricingCard({ plan }: { plan: 'monthly' | 'yearly' }) {
  const [loading, setLoading] = useState(false)
  
  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const { checkout_url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = checkout_url
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="pricing-card">
      <h3>{plan === 'monthly' ? '₹99/month' : '₹799/year (save 33%)'}</h3>
      <ul>
        <li>✓ Ad-free experience</li>
        <li>✓ Larger file uploads (500MB)</li>
        <li>✓ Priority processing</li>
        <li>✓ API access</li>
      </ul>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Loading...' : 'Get Started'}
      </button>
    </div>
  )
}
```

---

## Indian Market Specifics

### INR Amounts
```python
# Stripe amounts are in smallest currency unit
# For INR: 1 paisa = ₹0.01
# So ₹99 = 9900 paise
amount_inr_paisa = 9900  # ₹99

stripe.PaymentIntent.create(
    amount=amount_inr_paisa,
    currency="inr",
)
```

### UPI + NetBanking Support
```python
# Stripe India supports UPI, netbanking, wallets
payment_method_types=["card", "upi", "netbanking"]
```

### Stripe India Requirements
- Registered Indian business OR use Stripe Atlas
- PAN/GSTIN may be required for Indian business verification
- Minimum charge: ₹50 (5000 paise)

---

## Testing

```python
# Test card numbers (India focus):
# Visa: 4000 0035 6000 0008 (Indian card)
# UPI: success@razorpay (test UPI ID)
# 3DS Auth Required: 4000 0027 6000 3184

# Test webhook locally:
# stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

---

## Revenue Model Suggestions for ISHU TOOLS

| Model | Price | What's Included |
|---|---|---|
| Free | ₹0 | 50+ tools, 25MB limit, ads |
| Student | ₹49/month | 200+ tools, 100MB, no ads |
| Pro | ₹99/month | All 700+ tools, 500MB, API access |
| Team | ₹499/month | 5 seats, 2GB, team API key |

---

## Related Skills
- `integrations` — Check Stripe Replit connector first
- `environment-secrets` — Storing Stripe keys (CRITICAL — never hardcode)
- `revenuecat` — Alternative for mobile app payments
- `deployment` — Webhooks need production URL (localhost won't work for webhooks)
