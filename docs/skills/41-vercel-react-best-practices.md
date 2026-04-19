# Vercel React Best Practices Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
React and Next.js performance optimization guidelines from Vercel Engineering. Covers unnecessary re-render prevention, bundle optimization, code splitting, data fetching patterns, memoization, virtualization, and React 19-specific features. Apply these to keep ISHU TOOLS FAANG-quality as the tool count grows past 700.

---

## Activation Triggers
- React components, Next.js pages, data fetching
- Bundle optimization, performance improvements
- "Why is my app slow?" or "optimize this component"
- Large component trees, unnecessary re-renders
- Component re-renders on unrelated state changes

---

## Pattern 1: Avoiding Unnecessary Re-Renders

### The Problem
```typescript
// ❌ Parent re-renders → ALL children re-render
function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Every keystroke re-renders ALL tool cards
  const filteredTools = tools.filter(t => t.title.includes(searchQuery))
  
  return (
    <div>
      <SearchBar onChange={setSearchQuery} />
      {filteredTools.map(t => <ToolCard key={t.slug} tool={t} />)}
    </div>
  )
}
```

### The Solution
```typescript
// ✓ Memoized components + computed values
const ToolCard = memo(({ tool }: { tool: Tool }) => {
  // Only re-renders when tool prop changes (by reference)
  return <div className="tool-card">...</div>
})

function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Only recomputes when searchQuery changes (not on unrelated state updates)
  const filteredTools = useMemo(
    () => tools.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]  // tools is stable (from registry), no need to include
  )
  
  return (
    <div>
      <SearchBar onChange={setSearchQuery} />
      {filteredTools.map(t => <ToolCard key={t.slug} tool={t} />)}
    </div>
  )
}
```

---

## Pattern 2: Stable Function References

```typescript
// ❌ New function reference on every render — breaks React.memo
function ToolForm({ slug }: { slug: string }) {
  const handleSubmit = async (data: FormData) => {  // New ref each render!
    await callTool(slug, data)
  }
  
  return <FileUploadZone onSubmit={handleSubmit} />
}

// ✓ Stable reference with useCallback
function ToolForm({ slug }: { slug: string }) {
  const handleSubmit = useCallback(async (data: FormData) => {
    await callTool(slug, data)
  }, [slug])  // Only recreate if slug changes
  
  return <FileUploadZone onSubmit={handleSubmit} />
}
```

---

## Pattern 3: Code Splitting for ISHU TOOLS

```typescript
// App.tsx — lazy load every route
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./features/home/HomePage'))
const ToolPage = lazy(() => import('./features/tool/ToolPage'))
const CategoryPage = lazy(() => import('./features/category/CategoryPage'))

// This splits the bundle into:
// main.js + HomePage.chunk.js + ToolPage.chunk.js + CategoryPage.chunk.js
// Users only download what they need

// Page-level skeleton while chunk loads
const PageSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-content" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Routes>
    </Suspense>
  )
}
```

---

## Pattern 4: Virtualization for 700+ Tools

Without virtualization, rendering 700 ToolCards creates 700 DOM nodes immediately:
```typescript
// ❌ Renders all 700 cards = 700 DOM nodes = slow initial paint
{tools.map(t => <ToolCard key={t.slug} tool={t} />)}
```

With react-window, only ~10-15 visible cards are in DOM:
```typescript
import { FixedSizeGrid } from 'react-window'

function ToolGrid({ tools }: { tools: Tool[] }) {
  const COLUMN_COUNT = 4
  const ROW_HEIGHT = 200
  const COLUMN_WIDTH = 320
  
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const toolIndex = rowIndex * COLUMN_COUNT + columnIndex
    const tool = tools[toolIndex]
    if (!tool) return null
    
    return (
      <div style={style}>
        <ToolCard tool={tool} />
      </div>
    )
  }
  
  return (
    <FixedSizeGrid
      columnCount={COLUMN_COUNT}
      columnWidth={COLUMN_WIDTH}
      height={800}          // Viewport height
      rowCount={Math.ceil(tools.length / COLUMN_COUNT)}
      rowHeight={ROW_HEIGHT}
      width={1280}
    >
      {Cell}
    </FixedSizeGrid>
  )
}
```

**When to use:** When tool list exceeds 100 items visible on one page.
**For ISHU TOOLS:** Implement for the "All Tools" view, not for category views (< 50 per category typically).

---

## Pattern 5: Context Optimization

```typescript
// ❌ One big context causes all consumers to re-render on any change
const AppContext = createContext({ tools, user, theme, search })

// ✓ Split contexts by update frequency
const ToolsContext = createContext<Tool[]>([])    // Updates: rarely (new tools added)
const ThemeContext = createContext<Theme>('dark')  // Updates: on theme toggle
const SearchContext = createContext<string>('')    // Updates: on every keystroke

// Consumers only re-render when THEIR context changes
function ToolCard() {
  const tools = useContext(ToolsContext)   // Doesn't re-render on search change
  // ...
}
```

---

## Pattern 6: Debounced Search

```typescript
// Custom hook — 180ms debounce feels instant but prevents render spam
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
function SearchBar() {
  const [rawQuery, setRawQuery] = useState('')
  const query = useDebounce(rawQuery, 180)  // Only triggers filter after 180ms idle
  
  const filteredTools = useMemo(
    () => tools.filter(t => t.title.toLowerCase().includes(query)),
    [query]  // rawQuery NOT in deps — prevents filter on every keystroke
  )
}
```

---

## Pattern 7: React 19 Specific Features

```typescript
// New in React 19: use() hook for promises
import { use, Suspense } from 'react'

async function fetchToolData(slug: string): Promise<Tool> {
  const res = await fetch(`/api/tools/${slug}`)
  return res.json()
}

// Component can use() a promise directly
function ToolPage({ params }: { params: { slug: string } }) {
  const toolPromise = fetchToolData(params.slug)
  
  return (
    <Suspense fallback={<ToolSkeleton />}>
      <ToolContent toolPromise={toolPromise} />
    </Suspense>
  )
}

function ToolContent({ toolPromise }: { toolPromise: Promise<Tool> }) {
  const tool = use(toolPromise)  // Suspends until promise resolves
  return <div>{tool.title}</div>
}
```

---

## Bundle Size Optimization

```typescript
// vite.config.ts — manual chunk splitting for ISHU TOOLS
rollupOptions: {
  output: {
    manualChunks: {
      'vendor-react':  ['react', 'react-dom'],
      'vendor-router': ['react-router-dom'],
      'vendor-motion': ['framer-motion'],
      'vendor-icons':  ['lucide-react'],
      // 'vendor-charts': ['recharts'],  // Only if charts are added
    }
  }
}
```

Run bundle analysis:
```bash
cd frontend
npm run build -- --report  # Or use rollup-plugin-visualizer
```

Target:
- Total bundle < 400KB gzipped
- First-load JS < 150KB
- Route chunks < 50KB each

---

## Related Skills
- `react-vite` — Full React + Vite configuration
- `vercel-composition-patterns` — Component architecture patterns
- `next-best-practices` — For Next.js migration
