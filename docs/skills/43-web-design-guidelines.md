# Web Design Guidelines Skill (User-Provided) — Ultra-Detailed Reference

## What It Does
Reviews UI code for Web Interface Guidelines compliance — checking accessibility (WCAG 2.1), usability, visual design best practices, responsive design, CSS performance, and interactive element correctness. Produces specific, actionable fixes for each violation found.

---

## Activation Triggers
- "Review my UI", "check accessibility", "audit design"
- "Review UX", "check my site against best practices"
- "Is this accessible?", "WCAG compliance check"
- After building a new page or component
- Before deployment — UI quality gate
- When user reports something "feels off" but they can't identify what

---

## WCAG 2.1 Accessibility Checklist

### Level AA (Required for Production)

#### Color Contrast
```
Normal text (< 18px or not bold): 4.5:1 minimum
Large text (≥ 18px or bold ≥ 14px): 3:1 minimum
UI components (buttons, inputs, icons): 3:1 minimum

ISHU TOOLS verification:
✅ White text #fff on #007aff → contrast ratio: 5.9:1 (passes)
✅ rgba(255,255,255,0.6) on #040813 → check: ~5.2:1 (passes)
⚠️ rgba(255,255,255,0.35) on dark backgrounds → may fail (check each case)
```

Test quickly:
```javascript
// In browser console
function getContrast(fg, bg) {
  // Use WebAIM contrast checker or:
  // https://webaim.org/resources/contrastchecker/
}
```

#### Keyboard Navigation
```typescript
// Every interactive element must be keyboard accessible
// ❌ WRONG — div click handler not keyboard accessible
<div onClick={handleClick} className="tool-card">
  <span>Compress PDF</span>
</div>

// ✓ CORRECT — button is keyboard accessible by default
<button 
  onClick={handleClick}
  className="tool-card"
  type="button"
>
  Compress PDF
</button>

// Or: add keyboard handler explicitly
<div
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
>
```

#### Focus Indicators
```css
/* ❌ Never remove focus indicators (common design mistake) */
*:focus { outline: none; }  /* BAD — blind users can't navigate */

/* ✓ CORRECT — custom focus indicator that looks good AND accessible */
:focus-visible {
  outline: 2px solid var(--accent);  /* Visible ring */
  outline-offset: 2px;               /* Don't hug the element */
  border-radius: 4px;                /* Match element shape */
}

/* Hides for mouse users (who don't need it), shows for keyboard */
/* :focus-visible is only active during keyboard navigation */
```

#### ARIA Labels for Icon-Only Elements
```tsx
// ❌ WRONG — screen reader sees nothing
<button onClick={handleCopy}><Copy size={16} /></button>

// ✓ CORRECT — screen reader announces "Copy to clipboard"
<button onClick={handleCopy} aria-label="Copy to clipboard">
  <Copy size={16} aria-hidden="true" />  {/* Hide icon from AT */}
</button>
```

#### Form Labels
```tsx
// ❌ WRONG — input not labeled
<input type="text" placeholder="Enter URL" />

// ✓ CORRECT — proper label association
<label htmlFor="url-input">Enter URL</label>
<input id="url-input" type="text" placeholder="Enter URL" />

// Or: aria-label when visible label isn't possible
<input type="text" aria-label="Enter URL to convert" placeholder="https://..." />
```

#### Heading Hierarchy
```
✓ Correct structure:
<h1>ISHU TOOLS — Free Online PDF Compress</h1>  ← One H1 per page
  <h2>How to use</h2>
    <h3>Step 1: Upload</h3>
    <h3>Step 2: Process</h3>
  <h2>Related Tools</h2>

❌ Wrong — skipping levels:
<h1>Page title</h1>
<h3>Section</h3>  ← Skips H2! Confuses screen readers
```

---

## Touch Target Requirements (Mobile)

```css
/* iOS HIG and Material Design both require 44×44px minimum */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  
  /* Remove 300ms tap delay on mobile */
  touch-action: manipulation;
}

/* For small icons with padding, the touch area can be expanded */
.icon-button {
  padding: 12px;  /* Ensures 44px if icon is 20px */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## CSS Performance Guidelines

```css
/* ✓ GPU-composited — smooth 60fps, no layout/paint triggers */
.tool-card { transition: transform 0.2s ease, opacity 0.2s ease; }

/* ❌ Layout-triggering properties — cause reflow, janky animations */
.tool-card { transition: width 0.2s, height 0.2s, margin 0.2s, top 0.2s; }
/* These force the browser to recalculate layout every frame */

/* Animations: prefer these (GPU only): */
/* transform: translate(), scale(), rotate() */
/* opacity */
/* filter (some) */

/* Avoid animating these: */
/* width, height, margin, padding, border-width, top, left, right, bottom */
```

---

## ISHU TOOLS Compliance Audit

### Current Status

```
ACCESSIBILITY:
✅ System fonts — no layout shift from font loading
✅ GPU-composited transitions (transform/opacity in CSS)
✅ touch-action: manipulation on interactive elements
✅ prefers-reduced-motion respected (via .resizing class removal)
✅ Role="button" on interactive non-button elements

⚠️ NEEDS VERIFICATION:
❓ Color contrast ratios for rgba secondary text colors
❓ All icon buttons have aria-labels
❓ Tab order logical on tool page (form → submit → result)
❓ H1 on every tool page (SEO + accessibility double benefit)

❌ KNOWN ISSUES:
❌ Some ToolCard icons may lack aria-label
❌ File upload drop zone may not be keyboard accessible
❌ Result download button needs aria-label
```

### Quick Accessibility Audit Script
```javascript
// Run in browser console on any ISHU TOOLS page
const interactive = document.querySelectorAll('button, a, [role="button"], input');
interactive.forEach(el => {
  const hasLabel = el.getAttribute('aria-label') || el.textContent?.trim() || el.getAttribute('title');
  if (!hasLabel) console.warn('No accessible label:', el);
});
```

---

## Semantic HTML Reference

```html
<!-- Navigation landmark -->
<nav aria-label="Main navigation">

<!-- Main content landmark -->  
<main>

<!-- Complementary content -->
<aside aria-label="Related tools">

<!-- Tool form region -->
<section aria-labelledby="tool-form-heading">
  <h2 id="tool-form-heading">Upload your PDF</h2>
  <form>...</form>
</section>

<!-- Tool result region -->
<output aria-label="Compression result" aria-live="polite">
  <!-- aria-live="polite" announces result to screen readers when it appears -->
</output>
```

---

## Related Skills
- `ui-ux-pro-max` — 99 UX guidelines and comprehensive design principles
- `frontend-design` — Implementing designs with quality
- `seo-audit` — Accessibility overlaps with SEO (both help with Google rankings)
- `security_scan` — Content Security Policy (CSP) headers are both security AND accessibility related
