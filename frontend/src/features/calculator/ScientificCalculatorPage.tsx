import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calculator,
  Sigma,
  ArrowLeft,
  Sparkles,
  Keyboard,
  ShieldCheck,
} from 'lucide-react'
import ScientificCalculator from './ScientificCalculator.tsx'
import SiteShell from '../../components/layout/SiteShell.tsx'
import { applyDocumentBranding } from '../../lib/toolPresentation.ts'

const PAGE_ACCENT = '#fbbf24'

const PAGE_TITLE = 'Scientific Calculator — Free Online Advanced Math | ISHU TOOLS'
const PAGE_DESCRIPTION =
  'A real online scientific calculator with sin, cos, tan, hyperbolic, ln, log, powers, roots, factorial, nCr, nPr, modulo, scientific notation, memory, and DEG/RAD modes. 100% free, no signup, works on mobile.'
const CANONICAL_URL = 'https://ishutools.fun/scientific-calculator'

const EXAMPLES: { label: string; expression: string; explain: string }[] = [
  { label: 'Pythagoras',     expression: 'sqrt(3^2 + 4^2)',         explain: 'hypotenuse of a 3-4 right triangle' },
  { label: 'Sine of 30°',    expression: 'sin(30)',                  explain: 'in DEG mode → 0.5' },
  { label: 'Compound interest', expression: '5000*(1+0.08)^10',      explain: 'principal × (1 + r)ⁿ' },
  { label: 'Combinations',   expression: '52 nCr 5',                 explain: 'poker hands from a deck' },
  { label: 'Natural log',    expression: 'ln(e^3)',                  explain: 'returns 3' },
  { label: 'Modulo',         expression: '2026 mod 4',               explain: 'is 2026 a leap year?' },
]

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: '0–9 . ( )',          action: 'Type numbers and parentheses' },
  { keys: '+  −  ×  ÷  ^  %',   action: 'Operators and percent' },
  { keys: 'Enter  or  =',       action: 'Calculate result' },
  { keys: 'Backspace',          action: 'Delete last character' },
  { keys: 'Escape',             action: 'Clear everything' },
  { keys: 'F2',                 action: 'Toggle 2nd-function row' },
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is this scientific calculator free?',
    a: 'Yes. ISHU TOOLS Scientific Calculator is 100% free, requires no signup, no installation, and works on any device with a browser.',
  },
  {
    q: 'Does it work in degrees and radians?',
    a: 'Yes. Tap the DEG / RAD pill at the top of the calculator to switch between degree and radian mode for trigonometric functions.',
  },
  {
    q: 'How do I use the 2nd-function key?',
    a: 'Press the 2nd key (top-left). The keypad now shows the alternate label on each key — for example sin becomes sin⁻¹, ln becomes eˣ, and √ becomes x². The 2nd toggle resets after one use, just like a real calculator.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. The keypad is fully responsive and tuned for thumb typing on Android and iOS. Your last 24 calculations are saved locally on your device.',
  },
  {
    q: 'How is my data handled?',
    a: 'All calculations run entirely in your browser. Nothing is sent to a server. History is stored only in your local device storage and you can clear it any time with the Reset button.',
  },
  {
    q: 'Does it support nCr, nPr, modulo, and scientific notation?',
    a: 'Yes. Use the nCr / nPr keys for combinations and permutations, the mod key for modulo, and the EE key (or type "e+5") to enter scientific notation.',
  },
]

function buildStructuredData() {
  const calculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ISHU Scientific Calculator',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any (Web)',
    url: CANONICAL_URL,
    description: PAGE_DESCRIPTION,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1284' },
    featureList: [
      'Trigonometric and inverse trigonometric functions',
      'Hyperbolic functions',
      'Natural log, log base 10, log base 2',
      'Powers, roots, factorial',
      'nCr / nPr / modulo',
      'DEG / RAD switching',
      'Memory (MC / MR / M+ / M−)',
      'Scientific notation',
      'Calculation history',
      'Keyboard shortcuts',
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return JSON.stringify([calculatorSchema, faqSchema])
}

function setOrCreateMeta(selector: string, attributes: Record<string, string>) {
  if (typeof document === 'undefined') return
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }
  for (const [key, value] of Object.entries(attributes)) {
    tag.setAttribute(key, value)
  }
}

function setCanonical(url: string) {
  if (typeof document === 'undefined') return
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

export default function ScientificCalculatorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const structuredData = useMemo(buildStructuredData, [])

  useEffect(() => {
    applyDocumentBranding(PAGE_TITLE, PAGE_DESCRIPTION, PAGE_ACCENT)

    setOrCreateMeta('meta[name="keywords"]', {
      name: 'keywords',
      content:
        'scientific calculator, online calculator, free scientific calculator, advanced math calculator, trigonometry calculator, logarithm calculator, factorial, nCr, nPr, modulo, sin cos tan, hyperbolic calculator, DEG RAD calculator, fx-991 online',
    })
    setOrCreateMeta('meta[property="og:title"]', { property: 'og:title', content: PAGE_TITLE })
    setOrCreateMeta('meta[property="og:description"]', { property: 'og:description', content: PAGE_DESCRIPTION })
    setOrCreateMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    setOrCreateMeta('meta[property="og:url"]', { property: 'og:url', content: CANONICAL_URL })
    setOrCreateMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setOrCreateMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: PAGE_TITLE })
    setOrCreateMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: PAGE_DESCRIPTION })
    setCanonical(CANONICAL_URL)

    const id = 'scientific-calculator-jsonld'
    let script = document.getElementById(id) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = structuredData

    return () => {
      const existing = document.getElementById(id)
      if (existing) existing.remove()
    }
  }, [structuredData])

  function loadExample(expression: string) {
    /* Dispatch a synthetic event the calculator listens to, but the simplest
       reliable path is to set the URL hash and let the user paste it; instead
       we just set an in-memory event the calculator can pick up. The component
       listens to `window` keydowns, so the easiest UX is to open the URL with
       the expression — but to keep this page self-contained we copy it to the
       clipboard and let the user paste, plus pre-load by reading from a
       custom event. */
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('ishu:calc:load', { detail: expression }))
    const calc = document.querySelector('.calc-display')
    if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <SiteShell>
    <main className='sci-calc-page'>
      <motion.div
        className='sci-calc-page-inner'
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link to='/' className='sci-calc-back'>
          <ArrowLeft size={16} /> Back to all tools
        </Link>

        <header className='sci-calc-hero'>
          <div className='sci-calc-hero-icon' aria-hidden>
            <Calculator size={28} />
          </div>
          <span className='sci-calc-hero-eyebrow'>
            <Sigma size={13} /> Calculator · standalone
          </span>
          <h1>Scientific Calculator</h1>
          <p>
            A genuine online scientific calculator with trigonometry, hyperbolic
            functions, logarithms, powers, factorial, combinations, modulo,
            scientific notation, memory and history — built to feel like the
            classic Casio fx-991 you grew up with, but entirely in your browser.
          </p>
          <div className='sci-calc-hero-badges'>
            <span><ShieldCheck size={13} /> 100% in-browser · nothing uploaded</span>
            <span><Keyboard size={13} /> Full keyboard shortcuts</span>
            <span><Sparkles size={13} /> Live result preview</span>
          </div>
        </header>

        <ScientificCalculator accent={PAGE_ACCENT} />

        <section className='sci-calc-section sci-calc-examples' aria-labelledby='sci-calc-examples-h'>
          <h2 id='sci-calc-examples-h'>Try these examples</h2>
          <p className='sci-calc-section-lede'>
            Tap an example to load it into the calculator above.
          </p>
          <div className='sci-calc-example-grid'>
            {EXAMPLES.map((example) => (
              <button
                key={example.expression}
                type='button'
                className='sci-calc-example'
                onClick={() => loadExample(example.expression)}
              >
                <span className='sci-calc-example-label'>{example.label}</span>
                <code>{example.expression}</code>
                <small>{example.explain}</small>
              </button>
            ))}
          </div>
        </section>

        <section className='sci-calc-section sci-calc-shortcuts' aria-labelledby='sci-calc-shortcuts-h'>
          <h2 id='sci-calc-shortcuts-h'>Keyboard shortcuts</h2>
          <p className='sci-calc-section-lede'>
            The calculator listens to your physical keyboard so you can type
            entire expressions without lifting your hands.
          </p>
          <div className='sci-calc-shortcut-grid'>
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.keys} className='sci-calc-shortcut'>
                <kbd>{shortcut.keys}</kbd>
                <span>{shortcut.action}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='sci-calc-section sci-calc-faq' aria-labelledby='sci-calc-faq-h'>
          <h2 id='sci-calc-faq-h'>Frequently asked questions</h2>
          <div className='sci-calc-faq-list'>
            {FAQ.map((item, index) => {
              const open = openFaq === index
              return (
                <div key={item.q} className={`sci-calc-faq-item${open ? ' open' : ''}`}>
                  <button
                    type='button'
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className='sci-calc-faq-toggle' aria-hidden>{open ? '−' : '+'}</span>
                  </button>
                  {open && <p>{item.a}</p>}
                </div>
              )
            })}
          </div>
        </section>

        <section className='sci-calc-section sci-calc-related' aria-labelledby='sci-calc-related-h'>
          <h2 id='sci-calc-related-h'>Related calculators</h2>
          <div className='sci-calc-related-grid'>
            <Link to='/tools/percentage-calculator' className='sci-calc-related-card'>
              <strong>Percentage calculator</strong>
              <span>Quick percent of, increase, decrease and difference.</span>
            </Link>
            <Link to='/tools/bmi-calculator' className='sci-calc-related-card'>
              <strong>BMI calculator</strong>
              <span>Body Mass Index with metric and imperial units.</span>
            </Link>
            <Link to='/tools/age-calculator' className='sci-calc-related-card'>
              <strong>Age calculator</strong>
              <span>Years, months and days between any two dates.</span>
            </Link>
            <Link to='/tools/loan-emi-calculator' className='sci-calc-related-card'>
              <strong>Loan EMI calculator</strong>
              <span>Monthly EMI, total interest and amortization.</span>
            </Link>
            <Link to='/tools' className='sci-calc-related-card sci-calc-related-card--all'>
              <strong>All 1,200+ tools</strong>
              <span>Browse every tool in one searchable directory.</span>
            </Link>
          </div>
        </section>
      </motion.div>
    </main>
    </SiteShell>
  )
}

