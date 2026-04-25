import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Copy, RotateCcw, History as HistoryIcon } from 'lucide-react'

type AngleMode = 'DEG' | 'RAD'
type CalcHistoryItem = {
  expression: string
  result: string
}

type ScientificCalculatorProps = {
  accent?: string
  storageKey?: string
}

type Operator = {
  precedence: number
  associativity: 'left' | 'right'
  arity: 1 | 2
  postfix?: boolean
  apply: (a: number, b?: number) => number
}

const MAX_HISTORY = 24
const MAX_FACTORIAL = 170

function safeDiv(a: number, b: number) {
  if (b === 0) throw new Error('Cannot divide by zero')
  return a / b
}

function safeMod(a: number, b: number) {
  if (b === 0) throw new Error('Cannot mod by zero')
  return a - Math.floor(a / b) * b
}

function nPr(n: number, r: number) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error('nPr needs whole numbers with n ≥ r ≥ 0')
  }
  let result = 1
  for (let i = 0; i < r; i++) result *= n - i
  return result
}

function nCr(n: number, r: number) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error('nCr needs whole numbers with n ≥ r ≥ 0')
  }
  const k = Math.min(r, n - r)
  let num = 1
  let den = 1
  for (let i = 0; i < k; i++) {
    num *= n - i
    den *= i + 1
  }
  return num / den
}

const OPERATORS: Record<string, Operator> = {
  '+':   { precedence: 2, associativity: 'left',  arity: 2, apply: (a, b = 0) => a + b },
  '-':   { precedence: 2, associativity: 'left',  arity: 2, apply: (a, b = 0) => a - b },
  '*':   { precedence: 3, associativity: 'left',  arity: 2, apply: (a, b = 0) => a * b },
  '/':   { precedence: 3, associativity: 'left',  arity: 2, apply: (a, b = 0) => safeDiv(a, b) },
  'mod': { precedence: 3, associativity: 'left',  arity: 2, apply: (a, b = 0) => safeMod(a, b) },
  'nPr': { precedence: 4, associativity: 'left',  arity: 2, apply: (a, b = 0) => nPr(a, b) },
  'nCr': { precedence: 4, associativity: 'left',  arity: 2, apply: (a, b = 0) => nCr(a, b) },
  '^':   { precedence: 5, associativity: 'right', arity: 2, apply: (a, b = 0) => Math.pow(a, b) },
  'root':{ precedence: 5, associativity: 'right', arity: 2, apply: (a, b = 0) => {
    if (b === 0) throw new Error('Root degree cannot be zero')
    if (b < 0 && a === 0) throw new Error('0 to a negative power is undefined')
    if (a < 0 && Number.isInteger(b) && b % 2 !== 0) return -Math.pow(-a, 1 / b)
    if (a < 0) throw new Error('Even root of a negative number is not real')
    return Math.pow(a, 1 / b)
  } },
  'u-':  { precedence: 6, associativity: 'right', arity: 1, apply: (a) => -a },
  'u+':  { precedence: 6, associativity: 'right', arity: 1, apply: (a) => a },
  '%':   { precedence: 7, associativity: 'left',  arity: 1, postfix: true, apply: (a) => a / 100 },
  '!':   { precedence: 7, associativity: 'left',  arity: 1, postfix: true, apply: factorial },
}

const FUNCTIONS: Record<string, (value: number, angleMode: AngleMode) => number> = {
  sin:   (v, m) => Math.sin(toRadians(v, m)),
  cos:   (v, m) => Math.cos(toRadians(v, m)),
  tan:   (v, m) => Math.tan(toRadians(v, m)),
  asin:  (v, m) => fromRadians(Math.asin(v), m),
  acos:  (v, m) => fromRadians(Math.acos(v), m),
  atan:  (v, m) => fromRadians(Math.atan(v), m),
  sinh:  (v) => Math.sinh(v),
  cosh:  (v) => Math.cosh(v),
  tanh:  (v) => Math.tanh(v),
  asinh: (v) => Math.asinh(v),
  acosh: (v) => Math.acosh(v),
  atanh: (v) => Math.atanh(v),
  sqrt:  (v) => {
    if (v < 0) throw new Error('√ needs a non-negative number')
    return Math.sqrt(v)
  },
  cbrt:  (v) => Math.cbrt(v),
  ln:    (v) => {
    if (v <= 0) throw new Error('ln needs a positive number')
    return Math.log(v)
  },
  log:   (v) => {
    if (v <= 0) throw new Error('log needs a positive number')
    return Math.log10(v)
  },
  log2:  (v) => {
    if (v <= 0) throw new Error('log₂ needs a positive number')
    return Math.log2(v)
  },
  exp:   (v) => Math.exp(v),
  abs:   (v) => Math.abs(v),
  floor: (v) => Math.floor(v),
  ceil:  (v) => Math.ceil(v),
  round: (v) => Math.round(v),
}

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

type KeyKind = 'memory' | 'function' | 'operator' | 'number' | 'control' | 'equals' | 'shift'
type KeyTone = 'primary' | 'accent' | 'muted' | 'danger' | 'shift' | 'shift-active'

type KeyDef = {
  label: string
  secondLabel?: string
  kind?: KeyKind
  value?: string
  secondValue?: string
  span?: number
  tone?: KeyTone
  hint?: string
}

/* ── Keypad layout: 6 columns × 9 rows = 54 keys.
   Designed to mirror Casio fx-991 ergonomics: 2nd toggle top-left,
   trig + log row, hyperbolic + power row, parens + memory row,
   then the standard numeric keypad with operators on the right. */
const KEYS: KeyDef[] = [
  /* Row 1 — modifiers + memory */
  { label: '2nd',    kind: 'shift',   value: 'second',     tone: 'shift',   hint: 'Toggle alternate functions' },
  { label: 'DEG',    kind: 'control', value: 'angle',      tone: 'accent',  hint: 'Switch DEG / RAD' },
  { label: 'MC',     kind: 'memory',  value: 'mc',         hint: 'Memory clear' },
  { label: 'MR',     kind: 'memory',  value: 'mr',         hint: 'Memory recall' },
  { label: 'M+',     kind: 'memory',  value: 'm+',         hint: 'Memory add' },
  { label: 'M−',     kind: 'memory',  value: 'm-',         hint: 'Memory subtract' },

  /* Row 2 — trig (with 2nd → inverse trig) */
  { label: 'sin',    secondLabel: 'sin⁻¹',  kind: 'function', value: 'sin(',  secondValue: 'asin(' },
  { label: 'cos',    secondLabel: 'cos⁻¹',  kind: 'function', value: 'cos(',  secondValue: 'acos(' },
  { label: 'tan',    secondLabel: 'tan⁻¹',  kind: 'function', value: 'tan(',  secondValue: 'atan(' },
  { label: 'ln',     secondLabel: 'eˣ',     kind: 'function', value: 'ln(',   secondValue: 'exp(' },
  { label: 'log',    secondLabel: '10ˣ',    kind: 'function', value: 'log(',  secondValue: '10^' },
  { label: 'log₂',   secondLabel: '2ˣ',     kind: 'function', value: 'log2(', secondValue: '2^' },

  /* Row 3 — hyperbolic + powers */
  { label: 'sinh',   secondLabel: 'sinh⁻¹', kind: 'function', value: 'sinh(', secondValue: 'asinh(' },
  { label: 'cosh',   secondLabel: 'cosh⁻¹', kind: 'function', value: 'cosh(', secondValue: 'acosh(' },
  { label: 'tanh',   secondLabel: 'tanh⁻¹', kind: 'function', value: 'tanh(', secondValue: 'atanh(' },
  { label: '√',      secondLabel: 'x²',     kind: 'function', value: 'sqrt(', secondValue: '^2' },
  { label: '∛',      secondLabel: 'x³',     kind: 'function', value: 'cbrt(', secondValue: '^3' },
  { label: 'xʸ',     secondLabel: 'ʸ√x',    kind: 'operator', value: '^',     secondValue: 'root' },

  /* Row 4 — parens, constants, modifiers */
  { label: '(',      kind: 'operator', value: '(' },
  { label: ')',      kind: 'operator', value: ')' },
  { label: 'π',      kind: 'number',   value: 'pi' },
  { label: 'e',      kind: 'number',   value: 'e' },
  { label: '!',      kind: 'operator', value: '!' },
  { label: '%',      kind: 'operator', value: '%' },

  /* Row 5 — combinations + EE + extras + clear */
  { label: 'nCr',    secondLabel: 'nPr',    kind: 'operator', value: 'nCr', secondValue: 'nPr' },
  { label: 'mod',    kind: 'operator', value: 'mod' },
  { label: 'EE',     kind: 'number',   value: 'e+',  hint: '×10ˣ exponent entry' },
  { label: '|x|',    kind: 'function', value: 'abs(' },
  { label: '1/x',    kind: 'function', value: 'reciprocal' },
  { label: 'AC',     kind: 'control',  value: 'clearAll', tone: 'danger',  hint: 'Clear everything' },

  /* Row 6 */
  { label: '7', kind: 'number',   value: '7' },
  { label: '8', kind: 'number',   value: '8' },
  { label: '9', kind: 'number',   value: '9' },
  { label: 'DEL', kind: 'control', value: 'backspace', tone: 'muted', hint: 'Delete last character' },
  { label: '÷', kind: 'operator', value: '/' },
  { label: '×', kind: 'operator', value: '*' },

  /* Row 7 */
  { label: '4', kind: 'number',   value: '4' },
  { label: '5', kind: 'number',   value: '5' },
  { label: '6', kind: 'number',   value: '6' },
  { label: 'Ans', kind: 'number', value: 'Ans', hint: 'Last answer' },
  { label: '−', kind: 'operator', value: '-' },
  { label: '+/−', kind: 'control', value: 'negate', tone: 'muted' },

  /* Row 8 */
  { label: '1', kind: 'number',   value: '1' },
  { label: '2', kind: 'number',   value: '2' },
  { label: '3', kind: 'number',   value: '3' },
  { label: 'CE', kind: 'control', value: 'clearEntry', tone: 'muted', hint: 'Clear current entry' },
  { label: '+', kind: 'operator', value: '+' },
  { label: '=', kind: 'equals',   value: '=', tone: 'primary', hint: 'Calculate' },

  /* Row 9 — wide zero */
  { label: '0',  kind: 'number', value: '0', span: 2 },
  { label: '00', kind: 'number', value: '00' },
  { label: '.',  kind: 'number', value: '.' },
  { label: 'Hist', kind: 'control', value: 'toggleHistory', tone: 'muted', hint: 'Show / hide history' },
  { label: '=', kind: 'equals',  value: '=', tone: 'primary' },
]

function toRadians(value: number, angleMode: AngleMode) {
  return angleMode === 'DEG' ? value * Math.PI / 180 : value
}

function fromRadians(value: number, angleMode: AngleMode) {
  return angleMode === 'DEG' ? value * 180 / Math.PI : value
}

function factorial(value: number) {
  if (!Number.isInteger(value) || value < 0) throw new Error('Factorial needs a whole number')
  if (value > MAX_FACTORIAL) throw new Error(`Factorial supports up to ${MAX_FACTORIAL}`)
  let result = 1
  for (let i = 2; i <= value; i++) result *= i
  return result
}

function formatValue(value: number) {
  if (!Number.isFinite(value)) throw new Error('Result is not finite')
  if (Object.is(value, -0)) value = 0
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(10).replace(/\.?0+e/, 'e')
  }
  return Number(value.toPrecision(12)).toString()
}

function normalizeExpression(input: string, answer: number) {
  return input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/\bAns\b/g, `(${answer})`)
    .trim()
}

function tokenize(expression: string) {
  const tokens: string[] = []
  let i = 0

  while (i < expression.length) {
    const char = expression[i]
    if (/\s/.test(char)) {
      i += 1
      continue
    }

    if (/\d|\./.test(char)) {
      let value = char
      i += 1
      while (i < expression.length && /[\d.]/.test(expression[i])) {
        value += expression[i]
        i += 1
      }
      // Scientific notation entry (1.5e3, 2e-5)
      if (i < expression.length && (expression[i] === 'e' || expression[i] === 'E')) {
        const ahead = expression[i + 1]
        const aheadIsSign = ahead === '+' || ahead === '-'
        const aheadIsDigit = ahead && /\d/.test(ahead)
        if (aheadIsDigit || (aheadIsSign && /\d/.test(expression[i + 2] || ''))) {
          value += 'e'
          i += 1
          if (aheadIsSign) {
            value += expression[i]
            i += 1
          }
          while (i < expression.length && /\d/.test(expression[i])) {
            value += expression[i]
            i += 1
          }
        }
      }
      if (Number.isNaN(Number(value))) throw new Error(`Invalid number "${value}"`)
      tokens.push(value)
      continue
    }

    if (/[a-zA-Z_]/.test(char)) {
      let ident = char
      i += 1
      while (i < expression.length && /[a-zA-Z_0-9]/.test(expression[i])) {
        ident += expression[i]
        i += 1
      }
      tokens.push(ident)
      continue
    }

    if ('+-*/^()%!'.includes(char)) {
      tokens.push(char)
      i += 1
      continue
    }

    throw new Error(`Invalid character "${char}"`)
  }

  return tokens
}

function tokenIsNumber(token: string) {
  return token !== '' && !Number.isNaN(Number(token))
}

function tokenStartsValue(token: string) {
  const lower = token.toLowerCase()
  return tokenIsNumber(token) || token === '(' || CONSTANTS[lower] !== undefined || FUNCTIONS[lower] !== undefined
}

function tokenEndsValue(token: string) {
  const lower = token.toLowerCase()
  return tokenIsNumber(token) || token === ')' || token === '%' || token === '!' || CONSTANTS[lower] !== undefined
}

function insertImplicitMultiplication(tokens: string[]) {
  const expanded: string[] = []
  for (const token of tokens) {
    const previous = expanded[expanded.length - 1]
    if (previous && tokenStartsValue(token) && tokenEndsValue(previous)) {
      expanded.push('*')
    }
    expanded.push(token)
  }
  return expanded
}

function toRpn(tokens: string[]) {
  const output: string[] = []
  const stack: string[] = []
  let previous: string | null = null

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    const lower = token.toLowerCase()
    const next = tokens[i + 1]

    if (tokenIsNumber(token)) {
      output.push(token)
      previous = 'value'
      continue
    }

    if (CONSTANTS[lower] !== undefined) {
      output.push(lower)
      previous = 'value'
      continue
    }

    if (FUNCTIONS[lower]) {
      if (next !== '(') throw new Error(`${token} needs parentheses`)
      stack.push(lower)
      previous = 'function'
      continue
    }

    if (token === '(') {
      stack.push(token)
      previous = '('
      continue
    }

    if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop() as string)
      }
      if (!stack.length) throw new Error('Mismatched parentheses')
      stack.pop()
      if (stack.length && FUNCTIONS[stack[stack.length - 1]]) output.push(stack.pop() as string)
      previous = 'value'
      continue
    }

    if (token === '+' || token === '-') {
      const unary = previous === null || previous === 'operator' || previous === '(' || previous === 'function'
      if (unary) token = token === '-' ? 'u-' : 'u+'
    }

    const operator = OPERATORS[token]
    if (!operator) throw new Error(`Unknown token "${token}"`)

    if (operator.postfix) {
      output.push(token)
      previous = 'value'
      continue
    }

    while (stack.length) {
      const top = stack[stack.length - 1]
      const topOperator = OPERATORS[top]
      if (!topOperator) break
      const shouldPop =
        (operator.associativity === 'left' && operator.precedence <= topOperator.precedence) ||
        (operator.associativity === 'right' && operator.precedence < topOperator.precedence)
      if (!shouldPop) break
      output.push(stack.pop() as string)
    }

    stack.push(token)
    previous = 'operator'
  }

  while (stack.length) {
    const token = stack.pop() as string
    if (token === '(' || token === ')') throw new Error('Mismatched parentheses')
    output.push(token)
  }

  return output
}

function evalRpn(rpn: string[], angleMode: AngleMode) {
  const stack: number[] = []

  for (const token of rpn) {
    if (tokenIsNumber(token)) {
      stack.push(Number(token))
      continue
    }
    if (CONSTANTS[token] !== undefined) {
      stack.push(CONSTANTS[token])
      continue
    }
    if (FUNCTIONS[token]) {
      const value = stack.pop()
      if (value === undefined) throw new Error(`${token} needs a value`)
      stack.push(FUNCTIONS[token](value, angleMode))
      continue
    }
    const operator = OPERATORS[token]
    if (!operator) throw new Error(`Unknown operator "${token}"`)
    if (operator.arity === 1) {
      const value = stack.pop()
      if (value === undefined) throw new Error(`${token} needs a value`)
      stack.push(operator.apply(value))
    } else {
      const b = stack.pop()
      const a = stack.pop()
      if (a === undefined || b === undefined) throw new Error(`${token} needs two values`)
      stack.push(operator.apply(a, b))
    }
  }

  if (stack.length !== 1) throw new Error('Incomplete expression')
  return stack[0]
}

function evaluateScientificExpression(expression: string, angleMode: AngleMode, answer: number) {
  const normalized = normalizeExpression(expression, answer)
  if (!normalized) throw new Error('Enter an expression')
  const tokens = insertImplicitMultiplication(tokenize(normalized))
  const rpn = toRpn(tokens)
  return evalRpn(rpn, angleMode)
}

function displayExpression(expression: string) {
  return expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\bpi\b/g, 'π')
    .replace(/\bsqrt\b/g, '√')
    .replace(/\bcbrt\b/g, '∛')
    .replace(/\bnCr\b/g, ' nCr ')
    .replace(/\bnPr\b/g, ' nPr ')
    .replace(/\bmod\b/g, ' mod ')
    .replace(/\broot\b/g, ' root ')
}

const HISTORY_STORAGE_KEY_DEFAULT = 'ishu:scientific-calc:history'

function loadHistory(key: string): CalcHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item.expression === 'string' && typeof item.result === 'string')
      .slice(0, MAX_HISTORY)
  } catch {
    return []
  }
}

function saveHistory(key: string, history: CalcHistoryItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {
    /* storage may be unavailable (private mode, quota); ignore */
  }
}

export default function ScientificCalculator({
  accent = '#f59e0b',
  storageKey = HISTORY_STORAGE_KEY_DEFAULT,
}: ScientificCalculatorProps) {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG')
  const [answer, setAnswer] = useState(0)
  const [memory, setMemory] = useState(0)
  const [secondShift, setSecondShift] = useState(false)
  const [history, setHistory] = useState<CalcHistoryItem[]>(() => loadHistory(storageKey))
  const [error, setError] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(true)
  const justEvaluatedRef = useRef(false)

  const hasMemory = Math.abs(memory) > Number.EPSILON

  /* Persist history whenever it changes */
  useEffect(() => {
    saveHistory(storageKey, history)
  }, [history, storageKey])

  /* Live result preview — quietly evaluate while typing.
     Only updates the result if the expression parses cleanly,
     so partial input never throws a visible error. */
  const livePreview = useMemo(() => {
    const trimmed = expression.trim()
    if (!trimmed) return null
    try {
      const value = evaluateScientificExpression(trimmed, angleMode, answer)
      return formatValue(value)
    } catch {
      return null
    }
  }, [expression, angleMode, answer])

  const calculate = useCallback((source = expression) => {
    try {
      const value = evaluateScientificExpression(source, angleMode, answer)
      const formatted = formatValue(value)
      setResult(formatted)
      setAnswer(value)
      setError(null)
      setHistory((prev) => [
        { expression: source, result: formatted },
        ...prev.filter((item) => item.expression !== source),
      ].slice(0, MAX_HISTORY))
      justEvaluatedRef.current = true
      return value
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid expression'
      setError(message)
      return null
    }
  }, [angleMode, answer, expression])

  const append = useCallback((value: string) => {
    setError(null)
    setExpression((prev) => {
      // After "=", the next number-like input replaces the expression
      // (matches how a real calculator behaves), but operators chain onto Ans.
      if (justEvaluatedRef.current) {
        justEvaluatedRef.current = false
        const startsValue = /^[\d.]|^[a-zA-Z_(]/.test(value)
        if (startsValue) return value
        return `Ans${value}`
      }
      return `${prev}${value}`
    })
  }, [])

  const currentValue = useCallback(() => {
    if (livePreview !== null) {
      const num = Number(livePreview)
      if (Number.isFinite(num)) return num
    }
    const evaluated = calculate()
    if (evaluated !== null) return evaluated
    const parsed = Number(result)
    return Number.isFinite(parsed) ? parsed : 0
  }, [calculate, result, livePreview])

  const handleKey = useCallback((key: KeyDef) => {
    const useSecond = secondShift && key.secondValue !== undefined
    const value = (useSecond ? key.secondValue : key.value) || key.label
    if (useSecond) setSecondShift(false)

    if (key.kind === 'shift') {
      setSecondShift((v) => !v)
      return
    }
    if (key.kind === 'equals') {
      calculate()
      return
    }
    if (key.kind === 'memory') {
      const valueNow = currentValue()
      if (value === 'mc') setMemory(0)
      if (value === 'mr') append(formatValue(memory))
      if (value === 'm+') setMemory((prev) => prev + valueNow)
      if (value === 'm-') setMemory((prev) => prev - valueNow)
      return
    }
    if (key.kind === 'control') {
      if (value === 'clearAll') {
        setExpression('')
        setResult('0')
        setError(null)
        setSecondShift(false)
        return
      }
      if (value === 'clearEntry') {
        setExpression('')
        setError(null)
        return
      }
      if (value === 'backspace') {
        setExpression((prev) => prev.slice(0, -1))
        setError(null)
        return
      }
      if (value === 'angle') {
        setAngleMode((prev) => prev === 'DEG' ? 'RAD' : 'DEG')
        setError(null)
        return
      }
      if (value === 'negate') {
        setExpression((prev) => prev ? `-(${prev})` : '-')
        setError(null)
      }
      if (value === 'toggleHistory') {
        setHistoryOpen((v) => !v)
      }
      return
    }
    if (value === 'reciprocal') {
      setExpression((prev) => `1/(${prev || result || '1'})`)
      setError(null)
      return
    }

    /* Binary operators (mod, nCr, nPr, root) need spacing so the tokenizer
       can parse them correctly between two values. */
    if (value === 'mod' || value === 'nCr' || value === 'nPr' || value === 'root') {
      append(` ${value} `)
      return
    }

    append(value)
  }, [append, calculate, currentValue, memory, result, secondShift])

  /* Programmatic expression loader — listens for `ishu:calc:load`
     events (used by the standalone page's example tiles) and feeds
     the expression in directly so function names like sqrt(...) work. */
  useEffect(() => {
    function onLoad(event: Event) {
      const detail = (event as CustomEvent<string>).detail
      if (typeof detail !== 'string') return
      setExpression(detail)
      setError(null)
      justEvaluatedRef.current = false
      try {
        const value = evaluateScientificExpression(detail, angleMode, answer)
        setResult(formatValue(value))
        setAnswer(value)
        setHistory((prev) => [
          { expression: detail, result: formatValue(value) },
          ...prev.filter((item) => item.expression !== detail),
        ].slice(0, MAX_HISTORY))
        justEvaluatedRef.current = true
      } catch {
        /* leave the expression visible without overwriting the previous result */
      }
    }
    window.addEventListener('ishu:calc:load', onLoad)
    return () => window.removeEventListener('ishu:calc:load', onLoad)
  }, [angleMode, answer])

  /* Physical keyboard support — types digits/operators directly,
     Enter/= evaluates, Backspace/Esc clears, F2 toggles 2nd. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return

      if (/^[0-9.]$/.test(event.key)) {
        event.preventDefault()
        append(event.key)
      } else if (['+', '-', '*', '/', '^', '(', ')', '%'].includes(event.key)) {
        event.preventDefault()
        append(event.key)
      } else if (event.key === '!') {
        event.preventDefault()
        append('!')
      } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault()
        calculate()
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        setExpression((prev) => prev.slice(0, -1))
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setExpression('')
        setResult('0')
        setError(null)
      } else if (event.key === 'F2') {
        event.preventDefault()
        setSecondShift((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [append, calculate])

  const helperText = useMemo(() => {
    const parts: string[] = []
    parts.push(`${angleMode} mode`)
    parts.push(hasMemory ? `M = ${formatValue(memory)}` : 'M empty')
    if (secondShift) parts.push('2nd active')
    if (livePreview !== null && livePreview !== result) parts.push(`= ${livePreview}`)
    return parts.join(' · ')
  }, [angleMode, hasMemory, memory, secondShift, livePreview, result])

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result)
    } catch {
      setError('Clipboard permission blocked. Select the result and copy manually.')
    }
  }

  return (
    <section
      className='scientific-calculator-shell'
      style={{ '--calc-accent': accent } as CSSProperties}
    >
      <div className='calc-device' aria-label='Scientific calculator'>
        <div className='calc-topbar'>
          <div>
            <span className='calc-brand'>ISHU SCIENTIFIC</span>
            <strong>fx-1200 Pro</strong>
          </div>
          <div className='calc-status'>
            {secondShift && <span className='calc-pill calc-pill-shift'>2nd</span>}
            {hasMemory && <span className='calc-pill calc-pill-mem'>M</span>}
            <span className='calc-mode'>{angleMode}</span>
          </div>
        </div>

        <div className='calc-display' aria-live='polite'>
          <div className='calc-expression'>{displayExpression(expression) || ' '}</div>
          <div className={`calc-result${error ? ' is-error' : ''}`}>
            {error ? error : displayExpression(result)}
          </div>
          <p>{helperText}</p>
        </div>

        <div className={`calc-keypad${secondShift ? ' is-shifted' : ''}`}>
          {KEYS.map((key, index) => {
            const isShiftKey = key.kind === 'shift'
            const showSecond = secondShift && key.secondLabel
            const tone = isShiftKey
              ? (secondShift ? 'shift-active' : 'shift')
              : (key.tone || '')
            const displayLabel = showSecond ? key.secondLabel : key.label
            return (
              <button
                key={`${key.label}-${index}`}
                type='button'
                className={`calc-key ${key.kind || ''} ${tone}`.trim()}
                style={{ gridColumn: key.span ? `span ${key.span}` : undefined }}
                onClick={() => handleKey(key)}
                title={key.hint || displayLabel}
                aria-label={displayLabel}
                aria-pressed={isShiftKey ? secondShift : undefined}
              >
                {key.secondLabel && (
                  <span className={`calc-key-second${secondShift ? ' active' : ''}`}>
                    {key.secondLabel}
                  </span>
                )}
                <span className='calc-key-main'>{displayLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      <aside className='calc-side-panel'>
        <div className='calc-actions-row'>
          <button type='button' onClick={copyResult} className='calc-mini-action'>
            <Copy size={14} />
            Copy result
          </button>
          <button
            type='button'
            onClick={() => {
              setHistory([])
              setExpression('')
              setResult('0')
              setError(null)
              setSecondShift(false)
            }}
            className='calc-mini-action'
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className={`calc-history${historyOpen ? '' : ' collapsed'}`}>
          <h2>
            <HistoryIcon size={14} />
            <span className='calc-history-title'>History</span>
            <button
              type='button'
              className='calc-history-toggle'
              onClick={() => setHistoryOpen((v) => !v)}
              aria-label={historyOpen ? 'Hide history' : 'Show history'}
            >
              {historyOpen ? 'Hide' : 'Show'}
            </button>
          </h2>
          {historyOpen && (
            history.length === 0 ? (
              <p>Your last {MAX_HISTORY} calculations will be saved here.</p>
            ) : (
              history.map((item, index) => (
                <button
                  key={`${item.expression}-${item.result}-${index}`}
                  type='button'
                  onClick={() => {
                    setExpression(item.expression)
                    setResult(item.result)
                    setAnswer(Number(item.result) || 0)
                    setError(null)
                    justEvaluatedRef.current = false
                  }}
                >
                  <span>{displayExpression(item.expression)}</span>
                  <strong>= {displayExpression(item.result)}</strong>
                </button>
              ))
            )
          )}
        </div>

        <div className='calc-reference'>
          <h2>Quick reference</h2>
          <div><span>Power</span><code>2^10</code></div>
          <div><span>Square root</span><code>√(144)</code></div>
          <div><span>Trigonometry</span><code>sin(90)</code></div>
          <div><span>Inverse trig</span><code>asin(0.5)</code></div>
          <div><span>Logarithm</span><code>log(1000)</code></div>
          <div><span>Natural log</span><code>ln(e)</code></div>
          <div><span>Combinations</span><code>5 nCr 2</code></div>
          <div><span>Modulo</span><code>17 mod 5</code></div>
          <div><span>Scientific</span><code>1.5e3</code></div>
          <div><span>Use last answer</span><code>Ans + 1</code></div>
        </div>
      </aside>
    </section>
  )
}
