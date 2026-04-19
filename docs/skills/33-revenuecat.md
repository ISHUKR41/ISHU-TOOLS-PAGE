# RevenueCat Skill

## What It Does
Provides guidelines for integrating RevenueCat — a subscription and in-app purchase management platform — primarily for mobile apps (iOS/Android via Expo/React Native). Covers setup, product configuration, purchases, and webhook handling.

## When to Use
- Adding paid subscriptions to a mobile app
- In-app purchases for Expo/React Native apps
- Cross-platform subscription management
- When you need purchase analytics and receipt validation

## Key Concepts
- **Offerings** — Groups of products shown to users (e.g., Monthly, Yearly)
- **Packages** — Individual product options within an offering
- **Entitlements** — Feature access tied to subscriptions
- **Customer** — RevenueCat user object synced across platforms

## Integration Steps

### 1. Install SDK
```bash
npm install react-native-purchases
# or for Expo
npx expo install react-native-purchases
```

### 2. Configure
```javascript
import Purchases from 'react-native-purchases';

Purchases.configure({
  apiKey: 'your_public_key',  // From RC dashboard
  appUserID: userId,           // Optional: sync with your user system
});
```

### 3. Fetch Offerings
```javascript
const offerings = await Purchases.getOfferings();
const currentOffering = offerings.current;
const packages = currentOffering?.availablePackages;
```

### 4. Make a Purchase
```javascript
const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
const hasProAccess = typeof customerInfo.entitlements.active["pro"] !== "undefined";
```

### 5. Check Entitlements
```javascript
const customerInfo = await Purchases.getCustomerInfo();
if (customerInfo.entitlements.active["pro"]) {
  // User has active pro subscription
}
```

## Webhooks for Backend
```python
@app.post("/webhook/revenuecat")
async def rc_webhook(request: Request):
    body = await request.json()
    event_type = body.get("event", {}).get("type")
    if event_type == "RENEWAL":
        # Handle subscription renewal
        pass
```

## Related Skills
- `stripe` — Web payment alternative
- `expo` — React Native/Expo context
- `environment-secrets` — Storing API keys
