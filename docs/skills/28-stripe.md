# Stripe Skill

## What It Does
Provides comprehensive guidance for integrating Stripe payments into web applications. Covers payment intents, subscriptions, webhooks, customer portal, and all Stripe CRUD operations.

## When to Use
- Adding payment processing to the app
- Setting up subscription plans
- Creating checkout flows
- Managing customer billing
- Handling payment webhooks
- ISHU TOOLS premium features (if added)

## Key Integration Steps
1. **Check Integrations First** — Replit has a Stripe connector
2. **Install SDK**: `pip install stripe` or `npm install stripe`
3. **Set Keys**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` via environment-secrets
4. **Set up webhook endpoint** for payment events

## Core Operations
```python
# Backend (Python/FastAPI)
import stripe
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

# Create payment intent
intent = stripe.PaymentIntent.create(
    amount=999,  # cents
    currency="inr",  # Indian Rupee for ISHU TOOLS
    metadata={"user_id": user_id}
)

# Create subscription
subscription = stripe.Subscription.create(
    customer=customer_id,
    items=[{"price": "price_xxxx"}]
)
```

```typescript
// Frontend
import { loadStripe } from '@stripe/stripe-js'
const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK)
await stripe.redirectToCheckout({ sessionId })
```

## Webhook Setup
```python
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    event = stripe.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)
    
    if event.type == "payment_intent.succeeded":
        # Handle successful payment
        pass
```

## Indian Market Notes
- Use `currency: "inr"` for Indian Rupee
- Minimum charge: ₹50 (5000 paise)
- Consider UPI/netbanking via Stripe India

## Related Skills
- `integrations` — Stripe Replit connector
- `environment-secrets` — Storing API keys
- `revenuecat` — Alternative for mobile payments
