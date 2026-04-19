# Next.js Best Practices Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Provides Next.js (App Router) best practices for file conventions, React Server Components (RSC) boundaries, data fetching patterns, metadata API, error handling, image/font optimization, and bundling. **Critical for ISHU TOOLS** if migrating from React + Vite to Next.js for better SEO and server-side rendering.

---

## ISHU TOOLS Context

**Current stack:** React 19 + Vite (CSR — Client-Side Rendering)

**The problem:** Search engines get blank HTML with `<div id="root"></div>` and must execute JavaScript to see content. This hurts SEO because:
1. Googlebot may not execute JS (or does it slowly)
2. Meta tags are injected via JS — not in initial HTML
3. Social crawlers (Twitter, WhatsApp) don't execute JS at all → blank OG previews

**Next.js solution:**
- Server-side rendered HTML with actual content
- Metadata API generates meta tags in HTML (no JS needed)
- Static generation for tool pages at build time → fast + indexable
- Same React component code, different execution model

---

## When to Use This Skill

- Planning or executing a migration from Vite to Next.js
- Reviewing a Next.js implementation for correctness
- Understanding RSC boundaries in component design
- Setting up proper metadata for SEO
- Optimizing images with `next/image`

---

## App Router File Conventions

```
app/
├── layout.tsx              ← Root layout (header, footer, providers)
├── page.tsx                ← Home page route "/"
├── globals.css
│
├── tools/
│   └── [slug]/
│       ├── page.tsx        ← Tool page "/tools/compress-pdf"
│       └── loading.tsx     ← Streaming skeleton while page loads
│
├── category/
│   └── [id]/
│       └── page.tsx        ← Category page "/category/pdf-core"
│
├── about/
│   └── page.tsx
│
└── api/                    ← Route Handlers (API endpoints)
    └── tools/
        └── [slug]/
            └── run/
                └── route.ts  ← POST /api/tools/[slug]/run
```

---

## Server Components vs Client Components

```typescript
// Server Component (DEFAULT in App Router)
// - Runs on server
// - Can access DB directly (no useEffect needed)
// - No useState, useEffect, event listeners
// - Better SEO, faster initial load
// - Reduces JS bundle size

async function ToolPage({ params }: { params: { slug: string } }) {
  // Direct data fetch — no useEffect, no loading state needed
  const tool = await fetchToolFromRegistry(params.slug)
  
  return (
    <main>
      <h1>{tool.title}</h1>
      <p>{tool.description}</p>
      <ToolFormClient tool={tool} />  {/* Client component for interactivity */}
    </main>
  )
}
```

```typescript
// Client Component (add 'use client' directive)
// - Runs in browser (and server for initial HTML)
// - Can use useState, useEffect, event handlers
// - Required for: file upload, form submission, animations

'use client'

function ToolFormClient({ tool }: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  
  const handleSubmit = async () => {
    // API call to FastAPI backend
    const form = new FormData()
    if (file) form.append('file', file)
    
    const res = await fetch(`/api/tools/${tool.slug}/run`, { method: 'POST', body: form })
    setResult(await res.json())
  }
  
  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleSubmit}>Process</button>
      {result && <ToolResult result={result} />}
    </div>
  )
}
```

---

## Metadata API (Critical for ISHU TOOLS SEO)

```typescript
// app/tools/[slug]/page.tsx
import type { Metadata } from 'next'

// Replaces react-helmet, dynamically setting <head> tags
// This runs on SERVER — meta tags are in the HTML response
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const tool = await fetchTool(params.slug)
  
  return {
    title: `${tool.title} | ISHU TOOLS — Free Online Tools`,
    description: tool.description,
    keywords: tool.tags.join(', '),
    
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `https://ishutools.com/tools/${params.slug}`,
      siteName: 'ISHU TOOLS',
      images: [{ url: `/og/${tool.category}.jpg`, width: 1200, height: 630 }],
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
      images: [`/og/${tool.category}.jpg`],
      site: '@ISHU_IITP',
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    
    alternates: {
      canonical: `https://ishutools.com/tools/${params.slug}`,
    },
  }
}
```

---

## Static Site Generation for Tool Pages

```typescript
// Pre-render all 700+ tool pages at build time
export async function generateStaticParams() {
  const tools = await fetchAllTools()  // From registry
  
  return tools.map(tool => ({ slug: tool.slug }))
}

// With revalidation (ISR — update without full rebuild)
export const revalidate = 86400  // Re-generate every 24 hours
```

---

## Image Optimization

```typescript
import Image from 'next/image'

// Next.js automatically:
// - Resizes to correct dimensions
// - Converts to WebP/AVIF
// - Lazy loads off-screen images
// - Prevents CLS with reserved space

function CategoryCard({ category }) {
  return (
    <Image
      src={`/og/${category.id}.jpg`}
      alt={`${category.label} tools icon`}
      width={64}
      height={64}
      loading="lazy"
      // For LCP images:
      // priority  ← tells Next.js to preload (no lazy)
    />
  )
}
```

---

## Migration Path for ISHU TOOLS

```
Phase 1: Setup
  - Initialize Next.js app alongside existing Vite app
  - Move FastAPI backend to /api route handlers or keep separate

Phase 2: Core Pages (SSR gains)
  - / (homepage) — Server component, static generation
  - /tools/[slug] — Server component for SEO critical data

Phase 3: Interactive Clients
  - Wrap form, file upload, result display in 'use client' boundaries
  - Keep animation-heavy components as client components

Phase 4: SEO Boost
  - generateMetadata for all tool pages
  - generateStaticParams for static pre-rendering
  - JSON-LD via script tags in page.tsx

Phase 5: Deploy
  - Next.js on Vercel for best integration
  - Or self-host on Replit with next start
```

**Estimated SEO improvement after migration:** 30-50% more organic traffic within 3-6 months (meta tags visible to all crawlers).

---

## Related Skills
- `react-vite` — Current React + Vite setup
- `seo-audit` — Measuring SEO improvement
- `vercel-react-best-practices` — Performance within the React ecosystem
- `deployment` — Deploying Next.js on Replit
