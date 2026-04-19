# RevenueCat Skill — Ultra-Detailed Reference

## What It Does
Provides complete guidance for integrating RevenueCat into mobile apps (Expo/React Native) for subscription management and in-app purchases. RevenueCat handles the complex parts: receipt validation, subscription state management, analytics, and cross-platform consistency. For ISHU TOOLS, this becomes relevant when building a mobile app version.

---

## When to Use

- Building a premium subscription for the ISHU TOOLS mobile app
- Adding in-app purchases to the Expo/React Native version
- Need cross-platform subscription management (iOS + Android in one SDK)
- Want purchase analytics without building custom analytics
- Need subscription webhooks for backend integration

## When NOT to Use

- Web app payments → use Stripe instead
- One-time payments on web → use Stripe Checkout
- Free app with no monetization → skip entirely

---

## RevenueCat Core Concepts

| Concept | Description |
|---|---|
| **Offering** | A collection of packages shown to users (e.g., "Default Offering") |
| **Package** | An individual product option (monthly, yearly, lifetime) |
| **Product** | The App Store / Play Store product tied to a package |
| **Entitlement** | A feature gate (e.g., "pro") that becomes active when purchased |
| **CustomerInfo** | The complete subscription state for a user |

---

## Setup Steps

### 1. Install the SDK
```bash
# For Expo managed workflow
npx expo install react-native-purchases
```

### 2. Configure in App Entry
```typescript
// app/_layout.tsx or App.tsx
import Purchases from 'react-native-purchases'
import { Platform } from 'react-native'

const REVENUECAT_API_KEYS = {
  ios: "appl_xxxxxxxxxxxxx",      // From RevenueCat dashboard
  android: "goog_xxxxxxxxxxxxx",  // From RevenueCat dashboard
}

// Initialize once at app startup
useEffect(() => {
  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG)  // Remove in production
  Purchases.configure({
    apiKey: Platform.OS === 'ios' 
      ? REVENUECAT_API_KEYS.ios 
      : REVENUECAT_API_KEYS.android,
    appUserID: userId || null,  // null = anonymous (RC generates ID)
  })
}, [])
```

### 3. Store Keys as Secrets
```javascript
// Via environment-secrets skill
await setEnvVar({ key: "RC_APPLE_API_KEY", value: "appl_xxx..." })
await setEnvVar({ key: "RC_GOOGLE_API_KEY", value: "goog_xxx..." })
// Then read in app via process.env or expo-constants
```

---

## Core Purchase Flow

```typescript
import Purchases, { PurchasesPackage } from 'react-native-purchases'

// Hook for ISHU TOOLS premium
function usePremium() {
  const [offerings, setOfferings] = useState(null)
  const [customerInfo, setCustomerInfo] = useState(null)
  const [isPro, setIsPro] = useState(false)
  
  useEffect(() => {
    // Fetch available offerings
    Purchases.getOfferings().then(o => setOfferings(o))
    
    // Get current customer info
    Purchases.getCustomerInfo().then(info => {
      setCustomerInfo(info)
      setIsPro(!!info.entitlements.active["pro"])
    })
    
    // Listen for updates
    const listener = Purchases.addCustomerInfoUpdateListener(info => {
      setIsPro(!!info.entitlements.active["pro"])
    })
    return () => listener.remove()
  }, [])
  
  const purchase = async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      setIsPro(!!customerInfo.entitlements.active["pro"])
      return true
    } catch (err: any) {
      if (err.code !== Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        Alert.alert('Purchase failed', err.message)
      }
      return false
    }
  }
  
  const restore = async () => {
    const { customerInfo } = await Purchases.restorePurchases()
    setIsPro(!!customerInfo.entitlements.active["pro"])
  }
  
  return { offerings, isPro, purchase, restore }
}
```

---

## Paywall Component

```typescript
function ISHUToolsPaywall() {
  const { offerings, purchase } = usePremium()
  const currentOffering = offerings?.current
  
  if (!currentOffering) return <LoadingSpinner />
  
  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#040813' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' }}>
        ISHU TOOLS Pro
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 8 }}>
        All 700+ tools, ad-free, priority processing
      </Text>
      
      {currentOffering.availablePackages.map(pkg => (
        <TouchableOpacity
          key={pkg.identifier}
          style={{
            backgroundColor: '#007aff',
            padding: 16,
            borderRadius: 12,
            marginTop: 12,
          }}
          onPress={() => purchase(pkg)}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            {pkg.product.title} — {pkg.product.priceString}
          </Text>
          {pkg.packageType === 'ANNUAL' && (
            <Text style={{ color: '#fff', opacity: 0.8, fontSize: 12 }}>
              Save 33% vs monthly
            </Text>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity onPress={restore} style={{ marginTop: 16 }}>
        <Text style={{ color: '#007aff', textAlign: 'center' }}>
          Restore Purchases
        </Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

## Backend Webhook Integration

```python
# FastAPI webhook to update user premium status in database
@app.post("/api/webhooks/revenuecat")
async def rc_webhook(request: Request):
    body = await request.json()
    
    event = body.get("event", {})
    event_type = event.get("type")
    app_user_id = event.get("app_user_id")
    
    if event_type in ("INITIAL_PURCHASE", "RENEWAL", "PRODUCT_CHANGE"):
        # User now has active subscription
        await db.update_user_premium(app_user_id, is_premium=True)
    
    elif event_type in ("CANCELLATION", "EXPIRATION", "BILLING_ISSUE"):
        # User's subscription ended
        await db.update_user_premium(app_user_id, is_premium=False)
    
    return {"received": True}
```

---

## Feature Gating

```typescript
// Guard premium-only features
function PremiumToolWrapper({ children }: { children: React.ReactNode }) {
  const { isPro } = usePremium()
  const router = useRouter()
  
  if (!isPro) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>This tool requires ISHU TOOLS Pro</Text>
        <Button title="Upgrade" onPress={() => router.push('/paywall')} />
      </View>
    )
  }
  
  return children
}
```

---

## Related Skills
- `stripe` — Web payment alternative (use Stripe for web, RevenueCat for mobile)
- `expo` — Mobile app framework context
- `environment-secrets` — Storing RevenueCat API keys
