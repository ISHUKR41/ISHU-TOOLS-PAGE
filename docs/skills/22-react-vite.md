# React + Vite Skill

## What It Does
Provides guidelines and best practices for building React + Vite web applications in the Replit pnpm monorepo format. Includes patterns for design subagent delegation, component architecture, and performance optimization.

## Tech Stack (ISHU TOOLS)
- **React 19** + TypeScript
- **Vite** build tool
- **Tailwind CSS** (utility classes)
- **Framer Motion** for animations
- **React Router 7** for routing
- **Lucide React** for icons
- **React Dropzone** for file uploads

## Key Guidelines

### Component Architecture
- Feature-based folder structure: `features/[feature]/`
- Shared components in `components/[type]/`
- Custom hooks in `hooks/`
- API calls in `api/`
- Type definitions in `types/`

### Performance Patterns (FAANG-Level)
```typescript
// 1. Lazy loading for routes
const ToolPage = lazy(() => import('./features/tool/ToolPage'))

// 2. useMemo for expensive computations
const filteredTools = useMemo(() => {
  return tools.filter(t => t.category === activeCategory)
}, [tools, activeCategory])

// 3. useCallback for stable function references
const handleDrop = useCallback((files) => { ... }, [deps])

// 4. startTransition for non-urgent updates
startTransition(() => setActiveCategory(value))

// 5. Debounce search input
const debouncedQuery = useDebounce(query, 180)
```

### Vite Config for Performance
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,  // Required for Replit proxy
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        }
      }
    }
  }
})
```

### CSS Best Practices (This Project)
- CSS custom properties (variables) for theming
- No CSS modules — global CSS file with BEM-like classes
- `content-visibility: auto` for off-screen optimization
- `will-change: transform` for animated elements

## Design Subagent Delegation
```typescript
// When significant UI work is needed, delegate to DESIGN subagent
// See delegation skill for the pattern
```

## Related Skills
- `design` — DESIGN subagent for UI components
- `package-management` — Installing npm packages
- `repl_setup` — Vite + Replit configuration
