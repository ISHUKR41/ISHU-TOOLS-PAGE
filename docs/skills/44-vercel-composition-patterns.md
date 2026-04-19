# Vercel Composition Patterns Skill (User-Provided)

## What It Does
React composition patterns for building scalable, flexible component libraries. Addresses boolean prop proliferation, compound components, render props, context providers, and component architecture.

## When to Use
- Refactoring components with too many boolean props
- Building flexible, reusable component APIs
- Designing component libraries
- When components are getting complex and hard to maintain
- Any task involving compound components, render props, or context patterns

## Key Patterns

### 1. Compound Components (replaces boolean prop hell)
```typescript
// Bad: boolean prop proliferation
<ToolCard 
  showIcon={true}
  showBadge={true}
  showDescription={true}
  showTags={false}
  compact={false}
/>

// Good: compound components
<ToolCard>
  <ToolCard.Icon />
  <ToolCard.Header>
    <ToolCard.Title />
    <ToolCard.Badge />
  </ToolCard.Header>
  <ToolCard.Description />
</ToolCard>
```

### 2. Context Providers for Compound Components
```typescript
const ToolCardContext = createContext<{ tool: Tool } | null>(null)

function ToolCard({ tool, children }: { tool: Tool; children: ReactNode }) {
  return (
    <ToolCardContext.Provider value={{ tool }}>
      <div className="tool-card">{children}</div>
    </ToolCardContext.Provider>
  )
}

function ToolCardTitle() {
  const { tool } = useContext(ToolCardContext)!
  return <h3>{tool.title}</h3>
}

ToolCard.Title = ToolCardTitle
// Usage: <ToolCard.Title />
```

### 3. Render Props for Flexible Logic
```typescript
function ToolSearch({ children }: { children: (tools: Tool[]) => ReactNode }) {
  const [query, setQuery] = useState('')
  const filtered = useFilteredTools(query)
  
  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      {children(filtered)}
    </div>
  )
}

// Usage:
<ToolSearch>
  {(tools) => <ToolGrid tools={tools} />}
</ToolSearch>
```

### 4. React 19 API Changes
- `useFormStatus` — for form state in children without prop drilling
- `useOptimistic` — optimistic UI updates
- `use()` — unwrap promises and context in render

## When to Apply in ISHU TOOLS
- `ToolCard` — could use compound pattern for different display modes
- `ToolPage` — the form fields section could use composition
- Category sections — compound pattern for section/header/grid

## Related Skills
- `vercel-react-best-practices` — Performance patterns
- `react-vite` — Current project architecture
