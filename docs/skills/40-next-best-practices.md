# Next.js Best Practices Skill (User-Provided)

## What It Does
Provides Next.js best practices for file conventions, React Server Components (RSC) boundaries, data fetching patterns, async APIs, metadata, error handling, route handlers, image/font optimization, and bundling.

## When to Use
- Writing, reviewing, or refactoring Next.js code
- Setting up a new Next.js project
- Optimizing an existing Next.js app for performance
- Migrating from React SPA to Next.js for SEO benefits

## Note for ISHU TOOLS
ISHU TOOLS currently uses **React + Vite** (not Next.js). If migrating to Next.js for SSR/SEO benefits, use this skill.

## Key Patterns

### File Conventions (App Router)
```
app/
├── layout.tsx          # Root layout (persistent shell)
├── page.tsx            # Home page (/ route)
├── tools/
│   ├── page.tsx        # /tools page
│   └── [slug]/
│       └── page.tsx    # /tools/[slug] page
├── category/
│   └── [id]/page.tsx
└── api/
    └── tools/route.ts  # API Route handler
```

### RSC vs Client Components
```typescript
// Server Component (default) — runs on server, no useState/useEffect
async function ToolsPage() {
  const tools = await fetchTools() // direct DB/API call
  return <ToolList tools={tools} />
}

// Client Component — needs interactivity
'use client'
function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('')
  // ...
}
```

### Metadata API (Better than client-side meta injection)
```typescript
// Much better for SEO than dynamically setting meta tags in useEffect
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = await fetchTool(params.slug)
  return {
    title: `${tool.title} | ISHU TOOLS`,
    description: tool.description,
    openGraph: { title: tool.title, images: ['/og.png'] }
  }
}
```

## Migration Benefits for ISHU TOOLS
- Server-side rendered meta tags = better SEO (no JS needed for crawlers)
- Faster initial page load (SSR)
- Better Core Web Vitals
- Static generation for tool pages at build time

## Related Skills
- `react-vite` — Current React + Vite setup
- `seo-audit` — Measuring SEO improvement after migration
- `vercel-react-best-practices` — Performance optimization
