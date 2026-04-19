# Better Auth Best Practices Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Configures Better Auth — a TypeScript-first, framework-agnostic authentication library — including server configuration, client setup, database adapters, session management, plugins (email/password, OAuth, magic link), and secure environment variable handling. Use when ISHU TOOLS needs user accounts.

---

## ISHU TOOLS Auth Context

**Current state:** ISHU TOOLS has NO authentication by design. The core value proposition is "no signup required" — users can immediately use any tool.

**When auth becomes needed:**
- User wants to save favorite tools
- Premium subscription tiers (Pro, Student)
- Tool usage history and analytics per user
- API access management
- Personalized homepage

**Decision:** Use Replit Auth (built-in, zero setup) first. Only reach for Better Auth if you need email/password, OAuth with specific providers, or advanced session control that Replit Auth doesn't provide.

---

## Activation Triggers
- "Add user accounts" or "add login"
- References to `better-auth`, `betterauth`, `auth.ts`
- Setting up email/password authentication
- OAuth with Google/GitHub/LinkedIn
- Magic link login
- Advanced session management

---

## Core Setup

### Step 1: Check Integrations First
```javascript
// ALWAYS check for Replit Auth before implementing custom auth
const replit = await searchIntegrations({ query: "replit auth" });
// If sufficient → use Replit Auth (simpler)
// If needs email/password or specific OAuth → proceed with Better Auth
```

### Step 2: Install
```javascript
await installLanguagePackages({ language: "nodejs", packages: ["better-auth", "pg"] });
```

### Step 3: Server Configuration
```typescript
// lib/auth.ts — Server config
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  // Database — stores users, sessions, accounts
  database: {
    type: "postgresql",
    pool: new Pool({ connectionString: process.env.DATABASE_URL })
  },
  
  // Email + password auth
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,           // Sign in after registration
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      // Send email with password reset link
      await sendEmail({ to: user.email, subject: "Reset Password", body: url })
    }
  },
  
  // OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  },
  
  // Session config
  session: {
    expiresIn: 60 * 60 * 24 * 7,       // 7 days
    updateAge: 60 * 60 * 24,             // Refresh session daily
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5                     // 5 min cookie cache
    }
  },
  
  // Plugins
  plugins: [],  // Add: twoFactor, magicLink, passkey, etc.
  
  // Security
  advanced: {
    generateId: () => crypto.randomUUID(),
    database: {
      generateId: false  // Let Postgres generate IDs
    }
  }
})
```

### Step 4: Client Configuration
```typescript
// lib/auth-client.ts — Client config (runs in browser)
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL || "http://localhost:5000"
})

// Named exports for clean usage
export const { 
  signIn,           // Sign in with email/password or OAuth
  signUp,           // Register new user
  signOut,          // Sign out
  useSession,       // React hook for session state
  getSession,       // One-time session fetch
} = authClient
```

### Step 5: Route Handler
```typescript
// FastAPI: Mount the Better Auth handler
# The auth client calls /api/auth/* routes
# Better Auth provides a ASGI handler

# For a React + FastAPI setup:
from fastapi import Request
import httpx

@app.api_route("/api/auth/{path:path}", methods=["GET", "POST"])
async def auth_proxy(request: Request, path: str):
    # Proxy to Better Auth's built-in HTTP handler
    pass
```

---

## Using Auth in Components

```typescript
// React component
'use client'
import { useSession, signIn, signOut } from "@/lib/auth-client"

function AuthStatus() {
  const { data: session, isPending } = useSession()
  
  if (isPending) return <div className="skeleton" style={{ width: 100, height: 32 }} />
  
  if (!session) {
    return (
      <div>
        <button onClick={() => signIn.social({ provider: 'google', callbackURL: '/' })}>
          Continue with Google
        </button>
        <button onClick={() => signIn.social({ provider: 'github', callbackURL: '/' })}>
          Continue with GitHub
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <img src={session.user.image} alt={session.user.name} />
      <span>Welcome, {session.user.name}!</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

---

## Premium Feature Gating

```typescript
function usePremium() {
  const { data: session } = useSession()
  return !!session?.user?.isPremium
}

function PremiumToolWrapper({ children }: { children: ReactNode }) {
  const isPremium = usePremium()
  
  if (!isPremium) {
    return (
      <div className="premium-gate">
        <p>This tool requires ISHU TOOLS Pro</p>
        <button onClick={() => signIn.social({ provider: 'google' })}>
          Get Pro — ₹99/month
        </button>
      </div>
    )
  }
  
  return children
}
```

---

## Database Schema (Auto-generated by Better Auth)

```sql
-- Tables created automatically when Better Auth migrates:
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN,
  image TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  token TEXT UNIQUE,
  expires_at TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  account_id TEXT,
  provider_id TEXT,  -- "google", "github", "credential"
  access_token TEXT,
  refresh_token TEXT
);
```

---

## Required Secrets
```javascript
// Set via environment-secrets skill
await setEnvVar({ key: "DATABASE_URL", value: "postgresql://..." })
await setEnvVar({ key: "BETTER_AUTH_SECRET", value: crypto.randomUUID() })  // Used for session signing
await setEnvVar({ key: "GOOGLE_CLIENT_ID", value: "xxx.apps.googleusercontent.com" })
await setEnvVar({ key: "GOOGLE_CLIENT_SECRET", value: "GOCSPX-..." })
await setEnvVar({ key: "GITHUB_CLIENT_ID", value: "Ov23li..." })
await setEnvVar({ key: "GITHUB_CLIENT_SECRET", value: "..." })
```

---

## Related Skills
- `integrations` — Check for Replit Auth first (may be sufficient and simpler)
- `environment-secrets` — OAuth client IDs and secrets
- `database` — PostgreSQL where Better Auth stores users and sessions
- `stripe` — Payment integration for premium user tiers
