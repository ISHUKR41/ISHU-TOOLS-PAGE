# React + Vite Skill — Ultra-Detailed Reference

## What It Does
Provides the architectural guidelines, performance patterns, and conventions for the ISHU TOOLS React 19 + Vite frontend. This is the primary frontend skill — covering everything from file structure to bundle optimization to FAANG-level performance techniques.

---

## ISHU TOOLS Tech Stack
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Library | React | 19 | Component rendering, concurrent mode |
| Build Tool | Vite | 5.x | Dev server (HMR), production bundling |
| Language | TypeScript | 5.x | Type safety across all .tsx/.ts files |
| Routing | React Router | 7 | Client-side routing, nested routes |
| Styling | CSS + Tailwind | 3.x | Utility classes + custom CSS variables |
| Animations | Framer Motion | 11.x | Page transitions, micro-interactions |
| Icons | Lucide React | Latest | Consistent icon system |
| File Upload | React Dropzone | Latest | PDF/image drag-and-drop inputs |
| State | Built-in (useState, useReducer, Context) | React 19 | No Redux needed |

---

## Project File Structure

```
frontend/
├── src/
│   ├── main.tsx               ← App bootstrap, resize handler (.resizing class)
│   ├── App.tsx                ← Root component, router setup
│   ├── index.css              ← Global CSS, custom properties, animations
│   │
│   ├── features/              ← Feature-based code splitting
│   │   ├── home/              ← Landing page, category grid
│   │   │   ├── HomePage.tsx
│   │   │   └── components/
│   │   │       ├── HeroSection.tsx
│   │   │       ├── ToolCategorySection.tsx
│   │   │       └── ToolCard.tsx
│   │   │
│   │   └── tool/              ← Per-tool dynamic page
│   │       ├── ToolPage.tsx   ← Main tool page (SEO + form + result)
│   │       ├── toolFields.ts  ← Form field definitions for all tools
│   │       └── components/
│   │           ├── ToolForm.tsx
│   │           ├── ToolResult.tsx
│   │           └── FileUploadZone.tsx
│   │
│   ├── lib/                   ← Shared utilities
│   │   ├── toolPresentation.ts ← Category colors, icons, labels
│   │   ├── seoData.ts         ← SEO metadata, JSON-LD generators
│   │   └── api.ts             ← Fetch wrapper for backend API
│   │
│   ├── components/            ← Shared UI components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Badge.tsx
│   │
│   └── types/                 ← TypeScript types
│       └── tools.ts
│
├── public/
│   ├── manifest.json          ← PWA manifest
│   ├── robots.txt             ← SEO: crawl rules
│   └── sitemap.xml            ← SEO: all 700+ tool URLs
│
└── vite.config.ts             ← Vite configuration (proxy, chunks)
```

---

## Vite Configuration (Full)

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0',       // Required for Replit — allows external connections
    port: 5000,             // Must match workflow waitForPort
    allowedHosts: true,     // Required for Replit proxy (iframe embedding)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  build: {
    outDir: 'dist',
    target: 'es2020',
    minify: 'esbuild',       // 10x faster than terser, similar output
    sourcemap: false,         // Don't expose source in production
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
})
```

---

## FAANG-Level Performance Patterns

### 1. Route-Level Code Splitting (Lazy Loading)
```typescript
// App.tsx — lazy load ALL route components
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./features/home/HomePage'))
const ToolPage = lazy(() => import('./features/tool/ToolPage'))

// Wrap in Suspense with a skeleton fallback
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/tools/:slug" element={<ToolPage />} />
  </Routes>
</Suspense>
```

### 2. useMemo for Expensive Computations
```typescript
// Filtering 700+ tools is expensive without memoization
const filteredTools = useMemo(() => {
  if (!query) return tools
  const q = query.toLowerCase()
  return tools.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.includes(q))
  )
}, [tools, query])
```

### 3. useCallback for Stable Function References
```typescript
const handleSubmit = useCallback(async (formData: FormData) => {
  setLoading(true)
  try {
    const result = await callTool(slug, formData)
    setResult(result)
  } finally {
    setLoading(false)
  }
}, [slug])  // Only recreate if slug changes
```

### 4. startTransition for Non-Urgent Updates
```typescript
import { startTransition } from 'react'

// Category switching — not urgent, let urgent updates (typing) go first
const handleCategoryChange = (cat: string) => {
  startTransition(() => {
    setActiveCategory(cat)
  })
}
```

### 5. Instant Resize (No Transition Lag) — ISHU TOOLS Specific
```typescript
// main.tsx — disable all CSS transitions during window resize
let resizeTimer: ReturnType<typeof setTimeout>

window.addEventListener('resize', () => {
  document.body.classList.add('resizing')
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resizing')
  }, 150)
}, { passive: true })
```

```css
/* index.css — kill all animations during resize */
.resizing * {
  transition: none !important;
  animation: none !important;
}
```

### 6. Content Visibility for Long Lists
```css
/* Off-screen tool cards — defer rendering */
.tool-card {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}
```

### 7. Debounced Search
```typescript
import { useDebounce } from './hooks/useDebounce'

const debouncedQuery = useDebounce(rawQuery, 180)  // 180ms — feels instant, saves renders
```

---

## Routing Structure

```typescript
// App.tsx routes
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/tools/:slug" element={<ToolPage />} />  
  <Route path="/category/:categoryId" element={<CategoryPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Key:** Every tool has its own URL at `/tools/[slug]`. This is critical for:
- SEO (individual pages get indexed with unique meta)
- Deep linking (users can bookmark specific tools)
- Social sharing (tool-specific OG cards)

---

## CSS Architecture

```css
/* index.css — custom properties (theming) */
:root {
  --accent: #007aff;
  --surface: rgba(10, 10, 30, 0.86);
  --glow: rgba(0, 122, 255, 0.24);
  --radius: 16px;
  --blur: blur(20px);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Per-category theming — set by toolPresentation.ts at runtime */
[data-category="science-tools"] { --accent: #38bdf8; }
[data-category="cooking-tools"] { --accent: #fb923c; }
```

---

## TypeScript Conventions

```typescript
// types/tools.ts — core types
export interface Tool {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  inputKind: 'text' | 'files' | 'none'
}

export interface ToolResult {
  type: 'text' | 'json' | 'file' | 'image' | 'table'
  payload: string | Record<string, unknown>
  downloadUrl?: string
}

// Always type API responses
const response: ToolResult = await callTool(slug, params)
```

---

## Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG — inline object creates new reference every render
<ToolCard style={{ margin: 8 }} />

// ✓ CORRECT — stable reference
const CARD_STYLE = { margin: 8 }
<ToolCard style={CARD_STYLE} />

// ❌ WRONG — missing key on list items
{tools.map(t => <ToolCard tool={t} />)}

// ✓ CORRECT — stable unique key
{tools.map(t => <ToolCard key={t.slug} tool={t} />)}

// ❌ WRONG — useEffect for derived state
const [filtered, setFiltered] = useState(tools)
useEffect(() => setFiltered(tools.filter(...)), [tools, query])

// ✓ CORRECT — compute during render with useMemo
const filtered = useMemo(() => tools.filter(...), [tools, query])
```

---

## Design Subagent Delegation

For significant UI work (new page design, component redesign, animation system), delegate to the DESIGN subagent:
```
See: delegation skill + design skill
Pattern: pass file paths, design brief, and reference inspirations (Apple/Stripe/Awwwards)
```

---

## Related Skills
- `design` — DESIGN subagent for UI/UX component work
- `package-management` — Installing npm packages (then restart workflow)
- `repl_setup` — Vite host/port config for Replit proxy environment
- `vercel-react-best-practices` — Additional React performance patterns
- `frontend-design` — High-quality visual design principles
