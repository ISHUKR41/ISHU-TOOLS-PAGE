# Web Design Guidelines Skill (User-Provided)

## What It Does
Reviews UI code for Web Interface Guidelines compliance. Checks accessibility (WCAG), usability, visual design best practices, responsive design, and performance-related CSS patterns.

## Activation Triggers
- "Review my UI", "check accessibility", "audit design"
- "Review UX", "check my site against best practices"
- "Is this accessible?", "WCAG compliance check"
- After building a new component or page

## Audit Categories

### Accessibility (WCAG 2.1)
- **Color Contrast**: 4.5:1 for body text, 3:1 for large text
- **Focus Indicators**: Visible keyboard focus on all interactive elements
- **Alt Text**: All images have descriptive alt attributes
- **ARIA Labels**: Buttons/icons without text have aria-label
- **Form Labels**: All inputs have associated labels
- **Semantic HTML**: Using correct heading hierarchy, landmarks

### Interactive Elements
```html
<!-- Bad: div as button (not keyboard accessible) -->
<div onclick="submit()">Submit</div>

<!-- Good: proper button element -->
<button type="submit" aria-label="Submit form">Submit</button>
```

### Touch Targets (Mobile)
```css
/* Minimum 44x44px touch target */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation; /* Removes 300ms tap delay */
}
```

### Performance-Impacting CSS
```css
/* Good: GPU-composited animations */
.card { transition: transform 0.2s, opacity 0.2s; }

/* Bad: triggers layout/paint */
.card { transition: width 0.2s, height 0.2s, margin 0.2s; }
```

## ISHU TOOLS Compliance Status
- ✅ Touch action: manipulation on buttons/links
- ✅ System fonts (no web font loading delay)
- ✅ Reduced motion media query respected
- ✅ GPU-composited transitions (transform/opacity)
- ❓ Color contrast ratios (verify with audit tool)
- ❌ Some buttons may lack aria-labels (check ToolCard icons)

## Quick Fixes
```tsx
// Add aria-label to icon buttons
<button aria-label="Copy to clipboard"><Copy size={16} /></button>

// Ensure focus is visible
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

## Related Skills
- `ui-ux-pro-max` — Comprehensive UX principles
- `frontend-design` — Practical design implementation
- `seo-audit` — Related to accessibility (accessibility helps SEO)
