# Vercel React Best Practices Skill (User-Provided)

## What It Does
React and Next.js performance optimization guidelines from Vercel Engineering. Essential for writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns.

## Activation Triggers
- React components, Next.js pages, data fetching
- Bundle optimization, performance improvements
- Large component trees, unnecessary re-renders
- "Why is my app slow?" or "optimize this component"

## Key Patterns

### 1. Avoid Prop Drilling — Use Context Wisely
```typescript
// Bad: drilling props through 5 levels
// Good: Context for truly shared state
const ToolContext = createContext<ToolContextType>(null!)

function ToolProvider({ children }) {
  const [tool, setTool] = useState<Tool | null>(null)
  return <ToolContext.Provider value={{ tool, setTool }}>{children}</ToolContext.Provider>
}
```

### 2. Memoize Expensive Computations
```typescript
// Bad: recomputes on every render
const filtered = tools.filter(t => t.category === activeCategory)

// Good: only recomputes when deps change
const filtered = useMemo(
  () => tools.filter(t => t.category === activeCategory),
  [tools, activeCategory]
)
```

### 3. Stable Callbacks with useCallback
```typescript
// Bad: new function reference on every render — breaks child memoization
const handleDrop = (files) => { processFiles(files) }

// Good: stable reference
const handleDrop = useCallback((files: File[]) => {
  processFiles(files)
}, [processFiles])
```

### 4. Code Splitting & Lazy Loading
```typescript
// Route-level splitting
const ToolPage = lazy(() => import('./features/tool/ToolPage'))

// Component-level for heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'))
```

### 5. Virtualization for Long Lists
```typescript
// For 100+ tools, use virtualization
import { FixedSizeList } from 'react-window'
// Render only visible items
```

### 6. Image Optimization
```typescript
// Use proper loading attributes
<img loading="lazy" decoding="async" fetchpriority="high" />
```

## React 19 Specific
- `use()` hook for promise unwrapping
- Server Actions for form handling
- Document Metadata API (no more react-helmet)
- Asset Loading APIs for preloading

## Related Skills
- `vercel-composition-patterns` — Component architecture patterns
- `react-vite` — Current project setup
- `next-best-practices` — For Next.js migration
