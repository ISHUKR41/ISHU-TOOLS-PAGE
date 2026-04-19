# Vercel Composition Patterns Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Provides React component composition patterns for building scalable, flexible component APIs that avoid the "boolean prop hell" anti-pattern. Based on Vercel Engineering's component architecture guidelines. Essential when ISHU TOOLS components grow complex — ToolCard with many variants, ToolPage with different layouts, SearchBar with customizable behavior.

---

## When to Activate

Activate when you see:
- Components with 5+ boolean props
- Props like `showIcon`, `showBadge`, `isCompact`, `isGrid`, `hasFooter`
- "This component is getting messy and hard to use"
- Building a reusable component library
- Component variants diverging into copied code
- React 19 API questions (use(), useOptimistic, useFormStatus)

---

## The Problem: Boolean Prop Proliferation

```typescript
// ❌ This is what we're AVOIDING — unpredictable, hard to extend
<ToolCard
  showIcon={true}
  showBadge={false}
  showDescription={true}
  showTags={false}
  isCompact={false}
  isLoading={false}
  isSelected={false}
  hasHoverEffect={true}
  hasBorderAccent={true}
  darkMode={true}
/>
```

The problem: 10 boolean props = 2^10 = 1024 possible combinations, most of which are meaningless or visually broken.

---

## Pattern 1: Compound Components

Compound components are a family of sub-components that work together. Each part is optional — callers choose what to include.

```typescript
// The parent provides context + container
function ToolCard({ tool, children, onClick }: ToolCardProps) {
  return (
    <ToolCardContext.Provider value={{ tool }}>
      <motion.div
        className="tool-card"
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
    </ToolCardContext.Provider>
  )
}

// Sub-components access context for data
function ToolCardIcon() {
  const { tool } = useToolCardContext()
  return <span className="tool-icon">{tool.icon}</span>
}

function ToolCardTitle() {
  const { tool } = useToolCardContext()
  return <h3 className="tool-title">{tool.title}</h3>
}

function ToolCardDescription() {
  const { tool } = useToolCardContext()
  return <p className="tool-desc">{tool.description}</p>
}

function ToolCardBadge() {
  const { tool } = useToolCardContext()
  return <span className="category-badge">{tool.categoryLabel}</span>
}

// Attach sub-components to parent for clean API
ToolCard.Icon = ToolCardIcon
ToolCard.Title = ToolCardTitle
ToolCard.Description = ToolCardDescription
ToolCard.Badge = ToolCardBadge

// Usage: caller decides exactly what to render
<ToolCard tool={tool} onClick={navigate}>
  <ToolCard.Icon />
  <ToolCard.Title />
  <ToolCard.Description />
  <ToolCard.Badge />
</ToolCard>

// Compact variant — just icon + title
<ToolCard tool={tool} onClick={navigate}>
  <ToolCard.Icon />
  <ToolCard.Title />
</ToolCard>

// No description in grid view
<ToolCard tool={tool} onClick={navigate}>
  <ToolCard.Icon />
  <ToolCard.Title />
  <ToolCard.Badge />
</ToolCard>
```

---

## Pattern 2: Context for Compound Components

```typescript
// Create typed context
interface ToolCardContextValue {
  tool: Tool
  accent: string
}

const ToolCardContext = createContext<ToolCardContextValue | null>(null)

function useToolCardContext() {
  const ctx = useContext(ToolCardContext)
  if (!ctx) throw new Error('Must be used inside <ToolCard>')
  return ctx
}

// Context automatically threads data to sub-components without props
function ToolCard({ tool, children }: { tool: Tool; children: ReactNode }) {
  const accent = CATEGORY_THEME_MAP[tool.category]?.color || '#007aff'
  
  return (
    <ToolCardContext.Provider value={{ tool, accent }}>
      <div 
        className="tool-card"
        style={{ '--accent': accent } as React.CSSProperties}
      >
        {children}
      </div>
    </ToolCardContext.Provider>
  )
}
```

---

## Pattern 3: Render Props for Flexible Logic

```typescript
// ToolSearch controls the filtering logic, caller controls the display
function ToolSearch({ 
  children 
}: { 
  children: (result: { tools: Tool[]; query: string; setQuery: (q: string) => void }) => ReactNode 
}) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 180)
  
  const filteredTools = useMemo(
    () => TOOLS.filter(t => t.title.toLowerCase().includes(debouncedQuery)),
    [debouncedQuery]
  )
  
  return children({ tools: filteredTools, query, setQuery })
}

// Usage: different layouts using the same search logic
// Grid layout
<ToolSearch>
  {({ tools, setQuery }) => (
    <div>
      <input onChange={e => setQuery(e.target.value)} />
      <ToolGrid tools={tools} />
    </div>
  )}
</ToolSearch>

// List layout — same logic, different view
<ToolSearch>
  {({ tools, setQuery }) => (
    <div>
      <SearchBar onSearch={setQuery} />
      <ToolList tools={tools} />
    </div>
  )}
</ToolSearch>
```

---

## Pattern 4: Flexible Slot System (Children as Slots)

```typescript
// Accept specific named children as props
interface ToolPageLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  main: ReactNode
  footer?: ReactNode  // Optional slot
}

function ToolPageLayout({ header, sidebar, main, footer }: ToolPageLayoutProps) {
  return (
    <div className="tool-layout">
      <header className="tool-header">{header}</header>
      <div className="tool-body">
        <aside className="tool-sidebar">{sidebar}</aside>
        <main className="tool-main">{main}</main>
      </div>
      {footer && <footer className="tool-footer">{footer}</footer>}
    </div>
  )
}

// Usage: clean, intentional layout
<ToolPageLayout
  header={<ToolHeader tool={tool} />}
  sidebar={<RelatedTools category={tool.category} />}
  main={<ToolForm tool={tool} />}
  footer={<ToolFAQ tool={tool} />}
/>
```

---

## React 19 New Composition APIs

### `use()` — Unwrap promises and context in render
```typescript
'use client'
import { use } from 'react'

// Can use context without useContext
function ToolTitle() {
  const { tool } = use(ToolCardContext)!  // Same as useContext but more flexible
  return <h3>{tool.title}</h3>
}

// Can unwrap a promise (suspends while loading)
function ToolDetails({ promise }: { promise: Promise<Tool> }) {
  const tool = use(promise)  // Suspends until promise resolves
  return <div>{tool.description}</div>
}
```

### `useOptimistic` — Optimistic UI updates
```typescript
'use client'
import { useOptimistic } from 'react'

function FavoriteButton({ tool }: { tool: Tool }) {
  const [optimisticFav, setOptimisticFav] = useOptimistic(
    tool.isFavorited,
    (_, newValue: boolean) => newValue
  )
  
  const handleToggle = async () => {
    setOptimisticFav(!optimisticFav)  // Update UI immediately
    await toggleFavorite(tool.slug)    // API call happens in background
  }
  
  return (
    <button onClick={handleToggle}>
      {optimisticFav ? '★ Saved' : '☆ Save'}
    </button>
  )
}
```

### `useFormStatus` — Form state in child components
```typescript
'use client'
import { useFormStatus } from 'react-dom'

// Child component knows about parent form's submission state
function SubmitButton() {
  const { pending } = useFormStatus()  // No prop drilling needed!
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Processing...' : 'Run Tool'}
    </button>
  )
}
```

---

## ISHU TOOLS Refactoring Candidates

| Component | Current Issues | Pattern to Apply |
|---|---|---|
| `ToolCard` | Grid/list/compact variants with booleans | Compound components |
| `ToolPage` | Layout hardcoded, hard to add sidebars | Slot-based layout |
| `CategorySection` | Header/grid/footer mixed together | Compound components |
| `SearchBar` | Logic and display coupled | Render props |

---

## Related Skills
- `vercel-react-best-practices` — Performance optimization (complements architecture)
- `react-vite` — Current project setup where these patterns are applied
