# Mockup Extract Skill — Ultra-Detailed Reference

## What It Does
Copies existing components from the main ISHU TOOLS application into the isolated mockup-sandbox environment for redesign, variant exploration, or visual review. The extracted component is a faithful reproduction of the real code — not a hand-coded approximation. External dependencies (API calls, routing, auth) are stubbed so the component renders standalone.

**Cardinal Rule:** Never approximate an existing component from memory. Always extract the real code.

---

## When to Activate

Listen for these phrases:
- "Put my ToolCard on the canvas"
- "Show me my current homepage hero section on the board"
- "I want to redesign my Navbar"
- "Create variants of my existing ToolPage header"
- "Extract my ToolCategorySection to the canvas"
- "Improve my [component that exists in the app]"
- Any request to iterate on an existing visual element

---

## Full Extraction Process

### Step 1: Read the target component
```javascript
// Read the actual source file
const source = readFile("frontend/src/features/home/components/ToolCard.tsx");
```

### Step 2: Identify all imports
- Local imports (other components, hooks, utilities)
- Package imports (framer-motion, lucide-react, etc.)
- Type imports
- CSS imports

### Step 3: Copy to mockup sandbox
```
frontend/src/features/home/components/ToolCard.tsx
  ↓ copy to ↓
mockup-sandbox/src/components/ToolCard.tsx
```

### Step 4: Rewrite import paths
```typescript
// Original (main app paths)
import { CATEGORY_THEME_MAP } from '../../../lib/toolPresentation'
import { Tool } from '../../../types/tools'

// Rewritten for sandbox (relative to sandbox structure)
import { CATEGORY_THEME_MAP } from '../../lib/toolPresentation'
import { Tool } from '../../types/tools'
// OR: inline the type definition if simpler
```

### Step 5: Stub external dependencies
```typescript
// API calls → return mock data
// STUB this:
const tool = await fetch(`/api/tools/${slug}`).then(r => r.json())
// WITH this:
const tool = MOCK_TOOLS[0]  // Hardcoded realistic test data

// Router navigation → no-op
// STUB this:
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
// WITH this:
const navigate = (path: string) => console.log('Navigate to:', path)

// Toast notifications → console.log
// STUB this:
toast.success('Copied!')
// WITH this:
console.log('Toast: Copied!')
```

### Step 6: Create the preview wrapper
```typescript
// mockup-sandbox/src/previews/ToolCard.tsx
import ToolCard from '../components/ToolCard'
import { MOCK_TOOL } from '../mock-data'

export default function ToolCardPreview() {
  return (
    <div style={{ 
      padding: '3rem', 
      background: '#040813',  // Match main app background
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '320px' }}>
        <ToolCard tool={MOCK_TOOL} onClick={() => {}} />
      </div>
    </div>
  )
}
```

### Step 7: Place iframe on canvas
```javascript
const canvasState = await get_canvas_state();
// Find empty area
const shapeId = await createShape({
  type: "IFRAME",
  x: 100, y: 200,
  width: 420, height: 600,
  src: "http://sandbox-url/preview/ToolCard"
});
presentArtifact({ shapeIds: [shapeId] });
```

---

## Mock Data Template

```typescript
// mockup-sandbox/src/mock-data.ts
export const MOCK_TOOL = {
  slug: "compress-pdf",
  title: "Compress PDF — Reduce PDF File Size Free",
  description: "Compress PDF files without losing quality. Reduce PDF size instantly.",
  category: "pdf-core",
  tags: ["compress pdf", "reduce pdf size"],
  inputKind: "files" as const,
};

export const MOCK_TOOLS = [
  MOCK_TOOL,
  {
    slug: "merge-pdf",
    title: "Merge PDF Files — Combine PDFs Online",
    description: "Merge multiple PDF files into one document.",
    category: "pdf-core",
    tags: ["merge pdf", "combine pdf"],
    inputKind: "files" as const,
  },
  {
    slug: "element-lookup",
    title: "Element Lookup — Periodic Table",
    description: "Look up chemical elements from the periodic table.",
    category: "science-tools",
    tags: ["periodic table", "elements"],
    inputKind: "text" as const,
  },
];

export const MOCK_CATEGORIES = [
  { id: "pdf-core", label: "PDF Tools" },
  { id: "image-tools", label: "Image Tools" },
  { id: "science-tools", label: "Science" },
];
```

---

## Handling Complex Dependencies

### Component uses Tailwind CSS
```typescript
// Include Tailwind CDN in sandbox index.html
// Or copy the relevant CSS classes inline
```

### Component uses Context API
```typescript
// Stub the context provider with default values
const MockThemeContext = React.createContext({ theme: 'dark', accent: '#007aff' });

// Wrap in MockThemeContext.Provider in the preview wrapper
```

### Component uses animations (Framer Motion)
```typescript
// Framer Motion works fine in the sandbox
// Install it: npm install framer-motion
// Import as normal — it renders in Vite
```

### Component makes API calls
```typescript
// Replace fetch/axios calls with static data returns
// Use a setTimeout to simulate async loading state for realistic preview
const [tools, setTools] = useState<Tool[]>([]);
useEffect(() => {
  // Simulate API call
  setTimeout(() => setTools(MOCK_TOOLS), 300);
}, []);
```

---

## After Extraction: What Comes Next

1. User reviews the extracted component on canvas
2. If redesigning: use `design-exploration` skill to create variants
3. If just viewing: screenshot the canvas state
4. If graduating approved design: use `mockup-graduate` skill

---

## Related Skills
- `mockup-sandbox` — The isolated Vite server that powers previews
- `canvas` — Placing the extracted component iframe on the board
- `mockup-graduate` — Moving the approved redesign back into the main app
- `design-exploration` — Creating variants of the extracted component
- `design` — DESIGN subagent for redesigning the extracted component
