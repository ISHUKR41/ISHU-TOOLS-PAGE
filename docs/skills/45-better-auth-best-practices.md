# Better Auth Best Practices Skill (User-Provided)

## What It Does
Configures Better Auth — a TypeScript-first authentication library — including server and client setup, database adapters, session management, plugins, and environment variables.

## Activation Triggers
- Better Auth, betterauth, auth.ts
- Setting up TypeScript authentication
- Email/password auth, OAuth, plugin configuration

## Core Setup

### 1. Install
```bash
npm install better-auth
```

### 2. Server Configuration (auth.ts)
```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: {
    type: "postgresql",
    pool: new Pool({ connectionString: process.env.DATABASE_URL })
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: { enabled: true, maxAge: 60 * 5 }
  }
})
```

### 3. Client Configuration
```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

export const { signIn, signOut, signUp, useSession } = authClient
```

### 4. Route Handler (Next.js)
```typescript
import { auth } from "@/lib/auth"
export const { GET, POST } = auth.handler
```

### 5. Session in Components
```typescript
'use client'
import { useSession } from "@/lib/auth-client"

export function UserMenu() {
  const { data: session, isPending } = useSession()
  if (isPending) return <Spinner />
  if (!session) return <SignInButton />
  return <Avatar user={session.user} />
}
```

## Database Migrations
Better Auth auto-generates tables. Run:
```bash
npx better-auth migrate
```

## Note for ISHU TOOLS
ISHU TOOLS currently has NO authentication (by design — no signup required). Only add auth if adding premium features, user preferences, or saved tools history.

## Related Skills
- `integrations` — Check for Replit Auth before implementing custom auth
- `environment-secrets` — OAuth client IDs/secrets
- `database` — Session storage
