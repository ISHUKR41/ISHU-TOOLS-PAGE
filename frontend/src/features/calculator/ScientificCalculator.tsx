import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Copy, RotateCcw } from 'lucide-react'

type AngleMode = 'DEG' | 'RAD'
type CalcHistoryItem = {
  expression: string
  result: string
}

type ScientificCalculatorProps = {
  accent: string
}

type Operator = {
  precedence: number
  associativity: 'left' | 'right'
  arity: 1 | 2
  postfix?: boolean
  apply: (a: number, b?: number) => number
}

const MAX_HISTORY = 12
const MAX_FACTORIAL = 170

const OPERATORS: Record<string, Operator> = {
  '+': { precedence: 2, associativity: 'left', arity: 2, apply: (a, b = 0) => a + b },
  '-': { precedence: 2, associativity: 'left', arity: 2, apply: (a, b = 0) => a - b },
  '*': { precedence: 3, associativity: 'left', arity: 2, apply: (a, b = 0) => a * b },
  '/': {
    precedence: 3,
    associativity: 'left',
    arity: 2,
    apply: (a, b = 0) => {
      if (b === 0) throw new Error('Cannot divide by zero')
      return a / b
    },
  },
  '^': { precedence: 5, associativity: 'right', arity: 2, apply: (a, b = 0) => Math.pow(a, b) },
  'u-': { precedence: 4, associativity: 'right', arity: 1, apply: (a) => -a },
  'u+': { precedence: 4, associativity: 'right', arity: 1, apply: (a) => a },
  '%': { precedence: 6, associativity: 'left', arity: 1, postfix: true, apply: (a) => a / 100 },
  '!': { precedence: 6, associativity: 'left', arity: 1, postfix: true, apply: factorial },
}

const FUNCTIONS: Record<string, (value: number, angleMode: AngleMode) => number> = {
  sin: (value, angleMode) => Math.sin(toRadians(value, angleMode)),
  cos: (value, angleMode) => Math.cos(toRadians(value, angleMode)),
  tan: (value, angleMode) => Math.tan(toRadians(value, angleMode)),
  asin: (value, angleMode) => fromRadians(Math.asin(value), angleMode),
  acos: (value, angleMode) => fromRadians(Math.acos(value), angleMode),
  atan: (value, angleMode) => fromRadians(Math.atan(value), angleMode),
  sinh: (value) => Math.sinh(value),
  cosh: (value) => Math.cosh(value),
  tanh: (value) => Math.tanh(value),
  sqrt: (value) => {
    if (value < 0) throw new Error('Square root needs a non-negative number')
    return Math.sqrt(value)
  },
  cbrt: (value) => Math.cbrt(value),
  ln: (value) => {
    if (value <= 0) throw new Error('ln needs a positive number')
    return Math.log(value)
  },
  log: (value) => {
    if (value <= 0) throw new Error('log needs a positive number')
    return Math.log10(value)
  },
  log2: (value) => {
    if (value <= 0) throw new Error('log2 needs a positive number')
    return Math.log2(value)
  },
  exp: (value) => Math.exp(value),
  abs: (value) => Math.abs(value),
  floor: (value) => Math.floor(value),
  ceil: (value) => Math.ceil(value),
  round: (value) => Math.round(value),
}

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

type KeyDef = {
  label: string
  kind?: 'memory' | 'function' | 'operator' | 'number' | 'control' | 'equals'
  value?: string
  span?: number
  tone?: 'primary' | 'accent' | 'muted' | 'danger'
}

const KEYS: KeyDef[] = [
  { label: 'MC', kind: 'memory', value: 'mc' },
  { label: 'MR', kind: 'memory', value: 'mr' },
  { label: 'M+', kind: 'memory', value: 'm+' },
  { label: 'M-', kind: 'memory', value: 'm-' },
  { label: 'DEG/RAD', kind: 'control', value: 'angle', tone: 'accent' },
  { label: 'AC', kind: 'control', value: 'clearAll', tone: 'danger' },
  { label: 'sin', kind: 'function', value: 'sin(' },
  { label: 'cos', kind: 'function', value: 'cos(' },
  { label: 'tan', kind: 'function', value: 'tan(' },
  { label: 'asin', kind: 'function', value: 'asin(' },
  { label: 'acos', kind: 'function', value: 'acos(' },
  { label: 'atan', kind: 'function', value: 'atan(' },
  { label: 'ln', kind: 'function', value: 'ln(' },
  { label: 'log', kind: 'function', value: 'log(' },
  { label: 'sqrt', kind: 'function', value: 'sqrt(' },
  { label: 'x²', kind: 'operator', value: '^2' },
  { label: 'xʸ', kind: 'operator', value: '^' },
  { label: '!', kind: 'operator', value: '!' },
  { label: 'π', kind: 'number', value: 'pi' },
  { label: 'e', kind: 'number', value: 'e' },
  { label: '(', kind: 'operator', value: '(' },
  { label: ')', kind: 'operator', value: ')' },
  { label: '%', kind: 'operator', value: '%' },
  { label: '÷', kind: 'operator', value: '/' },
  { label: '7', kind: 'number', value: '7' },
  { label: '8', kind: 'number', value: '8' },
  { label: '9', kind: 'number', value: '9' },
  { label: '×', kind: 'operator', value: '*' },
  { label: 'DEL', kind: 'control', value: 'backspace' },
  { label: 'CE', kind: 'control', value: 'clearEntry' },
  { label: '4', kind: 'number', value: '4' },
  { label: '5', kind: 'number', value: '5' },
  { label: '6', kind: 'number', value: '6' },
  { label: '-', kind: 'operator', value: '-' },
  { label: 'Ans', kind: 'number', value: 'Ans' },
  { label: '+/-', kind: 'control', value: 'negate' },
  { label: '1', kind: 'number', value: '1' },
  { label: '2', kind: 'number', value: '2' },
  { label: '3', kind: 'number', value: '3' },
  { label: '+', kind: 'operator', value: '+' },
  { label: '=', kind: 'equals', value: '=', span: 2, tone: 'primary' },
  { label: '0', kind: 'number', value: '0', span: 2 },
  { label: '.', kind: 'number', value: '.' },
  { label: '00', kind: 'number', value: '00' },
  { label: '1/x', kind: 'function', value: 'reciprocal' },
  { label: 'C', kind: 'control', value: 'clearEntry' },
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
    .replace(/\bAns\b/g, String(answer))
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
      if (!/^\d*\.?\d+$/.test(value)) throw new Error(`Invalid number "${value}"`)
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
  return !Number.isNaN(Number(token))
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
}

export default function ScientificCalculator({ accent }: ScientificCalculatorProps) {
  const [expression, setExpression] = useState('sqrt(144)+2^3+sin(90)')
  const [result, setResult] = useState('21')
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG')
  const [answer, setAnswer] = useState(21)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<CalcHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const hasMemory = Math.abs(memory) > Number.EPSILON

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
      const next = prev === '0' ? '' : prev
      return `${next}${value}`
    })
  }, [])

  const currentValue = useCallback(() => {
    const evaluated = calculate()
    if (evaluated !== null) return evaluated
    const parsed = Number(result)
    return Number.isFinite(parsed) ? parsed : 0
  }, [calculate, result])

  const handleKey = useCallback((key: KeyDef) => {
    const value = key.value || key.label
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
      return
    }
    if (value === 'reciprocal') {
      setExpression((prev) => `1/(${prev || result || '1'})`)
      setError(null)
      return
    }
    append(value)
  }, [append, calculate, currentValue, memory, result])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return
      if (/^[0-9.]$/.test(event.key)) {
        event.preventDefault()
        append(event.key)
      } else if (['+', '-', '*', '/', '^', '(', ')', '%'].includes(event.key)) {
        event.preventDefault()
        append(event.key)
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
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [append, calculate])

  const helperText = useMemo(() => (
    `${angleMode} mode · ${hasMemory ? `Memory ${formatValue(memory)}` : 'Memory empty'} · supports sin, cos, tan, log, ln, sqrt, powers, factorial`
  ), [angleMode, hasMemory, memory])

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result)
    } catch {
      setError('Clipboard permission blocked. Select the result and copy manually.')
    }
  }

  return (
    <section className='scientific-calculator-shell' style={{ '--calc-accent': accent } as CSSProperties}>
      <div className='calc-device' aria-label='Scientific calculator'>
        <div className='calc-topbar'>
          <div>
            <span className='calc-brand'>ISHU SCIENTIFIC</span>
            <strong>fx-1200 Pro</strong>
          </div>
          <span className='calc-mode'>{angleMode}</span>
        </div>

        <div className='calc-display' aria-live='polite'>
          <div className='calc-expression'>{displayExpression(expression) || '0'}</div>
          <div className={`calc-result${error ? ' is-error' : ''}`}>
            {error || displayExpression(result)}
          </div>
          <p>{helperText}</p>
        </div>

        <div className='calc-keypad'>
          {KEYS.map((key, index) => (
            <button
              key={`${key.label}-${index}`}
              type='button'
              className={`calc-key ${key.kind || ''} ${key.tone || ''}`}
              style={{ gridColumn: key.span ? `span ${key.span}` : undefined }}
              onClick={() => handleKey(key)}
              aria-label={key.label === 'DEL' ? 'Delete last character' : key.label}
            >
              {key.label === 'sqrt' ? '√' : key.label}
            </button>
          ))}
        </div>
      </div>

      <aside className='calc-side-panel'>
        <div className='calc-actions-row'>
          <button type='button' onClick={copyResult} className='calc-mini-action'>
            <Copy size={14} />
            Copy
          </button>
          <button
            type='button'
            onClick={() => {
              setHistory([])
              setExpression('')
              setResult('0')
              setError(null)
            }}
            className='calc-mini-action'
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className='calc-history'>
          <h2>History</h2>
          {history.length === 0 ? (
            <p>No calculations yet.</p>
          ) : (
            history.map((item) => (
              <button
                key={`${item.expression}-${item.result}`}
                type='button'
                onClick={() => {
                  setExpression(item.expression)
                  setResult(item.result)
                  setError(null)
                }}
              >
                <span>{displayExpression(item.expression)}</span>
                <strong>{displayExpression(item.result)}</strong>
              </button>
            ))
          )}
        </div>

        <div className='calc-reference'>
          <h2>Quick Reference</h2>
          <div>
            <span>Power</span><code>2^10</code>
          </div>
          <div>
            <span>Square root</span><code>sqrt(144)</code>
          </div>
          <div>
            <span>Trigonometry</span><code>sin(90)</code>
          </div>
          <div>
            <span>Logarithm</span><code>ln(e)</code>
          </div>
        </div>
      </aside>
    </section>
  )
}
