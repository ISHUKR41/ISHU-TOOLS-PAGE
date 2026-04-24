/**
 * SmartResultDisplay – Renders tool JSON results intelligently
 * Shows structured data beautifully for different tool types
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCopy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface SmartResultProps {
  data: Record<string, unknown>
  slug: string
  accent?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'transparent',
        color: copied ? '#3ee58f' : 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={12} /> : <ClipboardCopy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function DataCard({ label, value, accent }: { label: string; value: unknown; accent?: string }) {
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 10,
      padding: '12px 16px',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {displayLabel}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: accent || '#ecf2ff', wordBreak: 'break-all' }}>
        {displayValue}
      </span>
    </div>
  )
}

function TableRenderer({ data, accent }: { data: Record<string, unknown>[]; accent?: string }) {
  if (!data.length) return null
  const keys = Object.keys(data[0])

  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
            {keys.map(k => (
              <th key={k} style={{ padding: '10px 14px', textAlign: 'left', color: accent || '#3bd0ff', fontWeight: 700, whiteSpace: 'nowrap', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {k.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              {keys.map(k => (
                <td key={k} style={{ padding: '10px 14px', color: '#ecf2ff', verticalAlign: 'top' }}>
                  {typeof row[k] === 'boolean' ? (row[k] ? 'Yes' : 'No') : String(row[k] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ColorPaletteRenderer({ palette }: { palette: { hex: string; rgb: number[]; name?: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
      {palette.map((color, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div style={{ height: 80, background: color.hex, cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(color.hex)} title="Click to copy" />
          <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{color.hex}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>rgb({color.rgb.join(', ')})</div>
            {color.name && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{color.name}</div>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MatrixRenderer({ matrix, label, accent }: { matrix: number[][]; label: string; accent?: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                    color: accent || '#3bd0ff',
                    minWidth: 50,
                  }}>
                    {typeof cell === 'number' ? (Number.isInteger(cell) ? cell : parseFloat(cell.toFixed(4))) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AsciiArtRenderer({ ascii }: { ascii: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <CopyButton text={ascii} />
      </div>
      <pre style={{
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#3bd0ff',
        background: 'rgba(0,0,0,0.4)',
        padding: '20px 16px',
        borderRadius: 10,
        overflowX: 'auto',
        lineHeight: 1.3,
        margin: 0,
        border: '1px solid rgba(59,208,255,0.2)',
      }}>
        {ascii}
      </pre>
    </div>
  )
}

function CodeResultRenderer({ text, label }: { text: string; label: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <CopyButton text={text} />
      </div>
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
        padding: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#a5f3fc',
        wordBreak: 'break-all',
        lineHeight: 1.7,
        maxHeight: 300,
        overflowY: 'auto',
      }}>
        {text}
      </div>
    </div>
  )
}

function IssuesList({ issues }: { issues: Array<{ message: string; replacements: string[]; context: string; category: string }> }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? issues : issues.slice(0, 5)

  return (
    <div>
      {displayed.map((issue, i) => (
        <div key={i} style={{
          marginBottom: 10,
          padding: '12px 14px',
          background: 'rgba(255,100,80,0.08)',
          border: '1px solid rgba(255,100,80,0.2)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ff9580', marginBottom: 4 }}>{issue.message}</div>
          {issue.context && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: 6 }}>...{issue.context}...</div>}
          {issue.replacements?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Suggestions:</span>
              {issue.replacements.map((r, ri) => (
                <span key={ri} style={{ fontSize: 12, padding: '2px 8px', background: 'rgba(62,229,143,0.15)', color: '#3ee58f', borderRadius: 4, fontWeight: 600 }}>
                  {r}
                </span>
              ))}
            </div>
          )}
          {issue.category && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{issue.category}</div>}
        </div>
      ))}
      {issues.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAll ? 'Show less' : `Show ${issues.length - 5} more issues`}
        </button>
      )}
    </div>
  )
}

export default function SmartResultDisplay({ data, accent = '#3bd0ff' }: SmartResultProps) {
  // Color palette tool
  if (data.palette && Array.isArray(data.palette)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ColorPaletteRenderer palette={data.palette as { hex: string; rgb: number[]; name?: string }[]} />
      </div>
    )
  }

  // Matrix calculator
  if (data.result && Array.isArray(data.result) && Array.isArray((data.result as unknown[][])[0])) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {Array.isArray(data.matrix1) && (
          <MatrixRenderer matrix={data.matrix1 as number[][]} label="Matrix A" accent={accent} />
        )}
        {Array.isArray(data.matrix2) && (
          <MatrixRenderer matrix={data.matrix2 as number[][]} label="Matrix B" accent={accent} />
        )}
        <MatrixRenderer matrix={data.result as number[][]} label={`Result (${String(data.operation || 'output')})`} accent={accent} />
      </div>
    )
  }

  // ASCII art
  if (data.ascii_art && typeof data.ascii_art === 'string') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AsciiArtRenderer ascii={data.ascii_art as string} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <DataCard label="Input" value={data.input} accent={accent} />
        </div>
      </div>
    )
  }

  // Grammar checker
  if (data.issues && Array.isArray(data.issues)) {
    const issues = data.issues as Array<{ message: string; replacements: string[]; context: string; category: string }>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          <DataCard label="Total Issues" value={data.total_issues} accent={accent} />
          <DataCard label="Score" value={`${data.score}/100`} accent={accent} />
          <DataCard label="Grade" value={data.grade} accent={accent} />
          <DataCard label="Word Count" value={data.word_count} accent={accent} />
        </div>
        {issues.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Issues Found
            </div>
            <IssuesList issues={issues} />
          </div>
        )}
      </div>
    )
  }

  // Word frequency
  if (data.frequency && Array.isArray(data.frequency)) {
    const freq = data.frequency as { word: string; count: number; percent: number }[]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          <DataCard label="Total Words" value={(data.total_words as number)?.toLocaleString()} accent={accent} />
          <DataCard label="Unique Words" value={(data.unique_words as number)?.toLocaleString()} accent={accent} />
          <DataCard label="Sentences" value={data.sentences} accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Top Words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {freq.slice(0, 20).map((item, i) => (
              <div key={i} style={{
                padding: '6px 12px',
                background: `${accent}15`,
                borderRadius: 20,
                border: `1px solid ${accent}30`,
                fontSize: 13,
                fontWeight: 600,
                color: accent,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {item.word}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>×{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Statistics calculator
  if (data.mean !== undefined && data.median !== undefined) {
    const statsKeys = ['count', 'sum', 'mean', 'median', 'mode', 'min', 'max', 'range', 'std_dev_population', 'variance_population', 'q1', 'q3', 'iqr']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {statsKeys.map(k => data[k] !== undefined && (
            <DataCard key={k} label={k} value={Array.isArray(data[k]) ? (data[k] as unknown[]).join(', ') : data[k]} accent={accent} />
          ))}
        </div>
      </div>
    )
  }

  // EMI calculator with schedule
  if (data.emi !== undefined && data.first_year_schedule) {
    const schedule = data.first_year_schedule as Record<string, unknown>[]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          <DataCard label="Monthly EMI" value={`₹${(data.emi as number).toLocaleString()}`} accent={accent} />
          <DataCard label="Total Amount" value={`₹${(data.total_amount as number).toLocaleString()}`} accent={accent} />
          <DataCard label="Total Interest" value={`₹${(data.total_interest as number).toLocaleString()}`} accent={accent} />
          <DataCard label="Principal" value={`₹${(data.loan_amount as number).toLocaleString()}`} accent={accent} />
          <DataCard label="Rate" value={`${data.annual_rate}%`} accent={accent} />
          <DataCard label="Tenure" value={`${data.tenure_months} months`} accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Amortization Schedule (First 12 Months)
          </div>
          <TableRenderer data={schedule} accent={accent} />
        </div>
      </div>
    )
  }

  // DNS lookup
  if (data.records && typeof data.records === 'object' && !Array.isArray(data.records)) {
    const records = data.records as Record<string, string[]>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DataCard label="Domain" value={data.domain} accent={accent} />
        {Object.entries(records).map(([type, values]) => (
          values.length > 0 && (
            <div key={type}>
              <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 8, textTransform: 'uppercase' }}>{type} Records</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {values.map((v, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, color: '#ecf2ff', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    )
  }

  // IP lookup
  if (data.ip !== undefined && data.city !== undefined) {
    const ipKeys = ['ip', 'city', 'region', 'country', 'postal', 'latitude', 'longitude', 'timezone', 'isp', 'currency']
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {ipKeys.map(k => data[k] !== undefined && data[k] !== null && data[k] !== '' && (
          <DataCard key={k} label={k} value={data[k]} accent={accent} />
        ))}
      </div>
    )
  }

  // SSL certificate
  if (data.common_name !== undefined && data.days_remaining !== undefined) {
    const sslKeys = ['domain', 'status', 'valid_to', 'days_remaining', 'common_name', 'organization', 'issuer']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {sslKeys.map(k => data[k] !== undefined && <DataCard key={k} label={k} value={data[k]} accent={accent} />)}
        </div>
      </div>
    )
  }

  // Morse code
  if (data.output && data.mode && String(data.mode).includes('morse')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CodeResultRenderer text={String(data.output)} label={String(data.mode).includes('morse-to-text') ? 'Decoded Text' : 'Morse Code'} />
      </div>
    )
  }

  // Base64 result
  if (data.base64 && typeof data.base64 === 'string') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CodeResultRenderer text={String(data.data_uri || data.base64)} label="Base64 Output" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <DataCard label="MIME Type" value={data.mime_type} accent={accent} />
          <DataCard label="Size" value={`${(data.base64_length as number)?.toLocaleString()} chars`} accent={accent} />
        </div>
      </div>
    )
  }

  // Number to words
  if (data.in_words && data.for_cheque) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DataCard label="Number" value={(data.number as number)?.toLocaleString()} accent={accent} />
        <CodeResultRenderer text={String(data.in_words)} label="In Words (English)" />
        <CodeResultRenderer text={String(data.for_cheque)} label="For Cheque" />
      </div>
    )
  }

  // Equation solver steps
  if (data.steps && Array.isArray(data.steps)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          <DataCard label="Type" value={data.type} accent={accent} />
          <DataCard label="Solution(s)" value={Array.isArray(data.solutions) ? (data.solutions as unknown[]).join(', ') : String(data.solutions ?? '')} accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Solution Steps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(data.steps as string[]).map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${accent}20`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: accent, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ padding: '4px 0', fontSize: 14, color: '#ecf2ff', fontFamily: step.includes('=') ? 'monospace' : 'inherit' }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Sleep calculator
  if (data.wake_up_options || data.bedtime_options) {
    const options = (data.wake_up_options || data.bedtime_options) as Array<{ cycles: number; hours: number; wake_time?: string; bedtime?: string; quality: string }>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map((opt, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: opt.quality === 'Best' ? `${accent}12` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${opt.quality === 'Best' ? accent + '40' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12,
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: opt.quality === 'Best' ? accent : '#ecf2ff' }}>
                {opt.wake_time || opt.bedtime}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {opt.cycles} cycles · {opt.hours} hours
              </div>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: opt.quality === 'Best' ? `${accent}25` : 'rgba(255,255,255,0.08)',
              fontSize: 12,
              fontWeight: 700,
              color: opt.quality === 'Best' ? accent : 'rgba(255,255,255,0.5)',
            }}>
              {opt.quality}
            </div>
          </div>
        ))}
        {Boolean(data.tip) && (
          <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', borderLeft: `3px solid ${accent}` }}>
            {String(data.tip)}
          </div>
        )}
      </div>
    )
  }

  // Calorie calculator
  if (data.tdee !== undefined && data.bmr !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          <DataCard label="Daily Need (TDEE)" value={`${(data.tdee as number)?.toLocaleString()} kcal`} accent={accent} />
          <DataCard label="BMR (Base)" value={`${(data.bmr as number)?.toLocaleString()} kcal`} accent={accent} />
          <DataCard label="Weight Loss (−500)" value={`${(data.weight_loss as number)?.toLocaleString()} kcal`} accent={accent} />
          <DataCard label="Weight Gain (+500)" value={`${(data.weight_gain as number)?.toLocaleString()} kcal`} accent={accent} />
        </div>
        {typeof data.macros === 'object' && data.macros !== null && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recommended Macros</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <DataCard label="Protein (g)" value={(data.macros as Record<string, number>).protein_g} accent="#f472b6" />
              <DataCard label="Carbs (g)" value={(data.macros as Record<string, number>).carbs_g} accent="#f59e0b" />
              <DataCard label="Fat (g)" value={(data.macros as Record<string, number>).fat_g} accent="#a78bfa" />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Currency converter
  if (data.rate !== undefined && data.converted !== undefined && data.from && data.to) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          padding: '20px',
          background: `${accent}10`,
          border: `1px solid ${accent}30`,
          borderRadius: 14,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            {(data.amount as number)?.toLocaleString()} {String(data.from)} =
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: accent, marginBottom: 4 }}>
            {(data.converted as number)?.toLocaleString()} {String(data.to)}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            1 {String(data.from)} = {String(data.rate)} {String(data.to)} · 1 {String(data.to)} = {String(data.inverse_rate)} {String(data.from)}
          </div>
          {Boolean(data.note) && <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 8 }}>⚠️ {String(data.note)}</div>}
        </div>
      </div>
    )
  }

  // GST calculator
  if (data.gst_amount !== undefined && data.cgst !== undefined) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <DataCard label="Base Amount" value={`₹${(data.amount as number)?.toLocaleString()}`} accent={accent} />
        <DataCard label="GST Rate" value={`${data.gst_rate}%`} accent={accent} />
        <DataCard label="GST Amount" value={`₹${(data.gst_amount as number)?.toLocaleString()}`} accent={accent} />
        <DataCard label="CGST" value={`₹${(data.cgst as number)?.toLocaleString()}`} accent={accent} />
        <DataCard label="SGST" value={`₹${(data.sgst as number)?.toLocaleString()}`} accent={accent} />
        <DataCard label="Total" value={`₹${(data.total as number)?.toLocaleString()}`} accent={accent} />
      </div>
    )
  }

  // Fuel calculator
  if (data.fuel_required_liters !== undefined) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <DataCard label="Distance" value={`${data.distance_km} km`} accent={accent} />
        <DataCard label="Fuel Price" value={`₹${data.fuel_price_per_liter}/L`} accent={accent} />
        <DataCard label="Mileage" value={`${data.mileage_kmpl} km/L`} accent={accent} />
        <DataCard label="Fuel Required" value={`${data.fuel_required_liters} L`} accent={accent} />
        <DataCard label="Total Cost" value={`₹${(data.total_cost as number)?.toLocaleString()}`} accent={accent} />
        <DataCard label="Cost/km" value={`₹${data.cost_per_km}`} accent={accent} />
      </div>
    )
  }

  // Paraphrase tool
  if (data.paraphrased && data.original) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Original</div>
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, border: '1px solid rgba(255,255,255,0.08)' }}>
            {String(data.original)}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: 'uppercase' }}>Paraphrased</div>
            <CopyButton text={String(data.paraphrased)} />
          </div>
          <div style={{ padding: '14px', background: `${accent}10`, borderRadius: 10, fontSize: 14, color: '#ecf2ff', lineHeight: 1.7, border: `1px solid ${accent}30` }}>
            {String(data.paraphrased)}
          </div>
        </div>
      </div>
    )
  }

  // Prime number checker
  if (data.is_prime !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: data.is_prime ? `${accent}12` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${data.is_prime ? accent + '40' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: data.is_prime ? accent : '#ecf2ff', marginBottom: 4 }}>
            {(data.number as number)?.toLocaleString()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: data.is_prime ? accent : '#ff6889' }}>
            {data.is_prime ? '✅ Prime Number' : '❌ Not a Prime Number'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <DataCard label="Next Prime" value={(data.next_prime as number)?.toLocaleString()} accent={accent} />
          {Array.isArray(data.prime_factors) && (data.prime_factors as number[]).length > 0 && (
            <DataCard label="Prime Factors" value={(data.prime_factors as number[]).join(' × ')} accent={accent} />
          )}
        </div>
      </div>
    )
  }

  // Fibonacci sequence
  if (data.sequence && Array.isArray(data.sequence)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <DataCard label="Count" value={data.n} accent={accent} />
          <DataCard label="Sum" value={(data.sum as number)?.toLocaleString()} accent={accent} />
          <DataCard label="Last Term" value={(data.last as number)?.toLocaleString()} accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 10, textTransform: 'uppercase' }}>Sequence</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(data.sequence as number[]).map((num, i) => (
              <div key={i} style={{
                padding: '6px 10px',
                background: `${accent}12`,
                border: `1px solid ${accent}25`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: accent,
                minWidth: 40,
                textAlign: 'center',
              }}>
                {num.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Water intake
  if (data.recommended_liters !== undefined && data.glasses_250ml !== undefined) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <DataCard label="Daily Water" value={`${data.recommended_liters} L`} accent={accent} />
        <DataCard label="Glasses (250ml)" value={String(data.glasses_250ml)} accent={accent} />
        <DataCard label="Bottles (500ml)" value={String(data.bottles_500ml)} accent={accent} />
        <DataCard label="Bottles (1L)" value={String(data.bottles_1L)} accent={accent} />
      </div>
    )
  }

  // Bulk image compressor results table
  if (data.results && Array.isArray(data.results) && data.total_reduction_percent !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <DataCard label="Original Total" value={`${data.total_original_kb} KB`} accent={accent} />
          <DataCard label="Compressed Total" value={`${data.total_compressed_kb} KB`} accent={accent} />
          <DataCard label="Total Reduction" value={`${data.total_reduction_percent}%`} accent={accent} />
        </div>
        <TableRenderer data={data.results as Record<string, unknown>[]} accent={accent} />
      </div>
    )
  }

  // IFSC finder
  if (data.bank !== undefined && data.branch !== undefined) {
    const ifscKeys = ['ifsc', 'bank', 'branch', 'city', 'state', 'district', 'address', 'contact', 'rtgs', 'neft', 'imps']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {ifscKeys.map(k => data[k] !== undefined && <DataCard key={k} label={k} value={data[k]} accent={accent} />)}
        </div>
      </div>
    )
  }

  // ATM PIN generator
  if (data.pins && Array.isArray(data.pins)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {(data.pins as string[]).map((pin, i) => (
            <div
              key={i}
              onClick={() => navigator.clipboard.writeText(pin)}
              title="Click to copy"
              style={{
                padding: '12px 20px',
                background: `${accent}15`,
                border: `1px solid ${accent}35`,
                borderRadius: 12,
                fontSize: 22,
                fontWeight: 800,
                color: accent,
                fontFamily: 'monospace',
                cursor: 'pointer',
                letterSpacing: '0.15em',
                userSelect: 'all',
              }}
            >
              {pin}
            </div>
          ))}
        </div>
        {Boolean(data.note) && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 8, fontSize: 12, color: '#f59e0b' }}>
            ⚠️ {String(data.note)}
          </div>
        )}
      </div>
    )
  }

  // Credit card validator
  if (data.valid !== undefined && data.card_type !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: data.valid ? `${accent}10` : 'rgba(255,100,100,0.1)',
          border: `1px solid ${data.valid ? accent + '35' : 'rgba(255,100,100,0.25)'}`,
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: data.valid ? accent : '#ff6889', marginBottom: 4 }}>
            {data.valid ? '✅ Valid Card' : '❌ Invalid Card'}
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>{String(data.card_type)}</div>
          <div style={{ fontSize: 18, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: '0.15em' }}>
            {String(data.masked)}
          </div>
        </div>
        {Boolean(data.note) && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            ℹ️ {String(data.note)}
          </div>
        )}
      </div>
    )
  }

  // Roman numeral converter
  if (data.mode && String(data.mode).includes('roman')) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 14 }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{String(data.input)}</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: accent, marginBottom: 8 }}>{String(data.output)}</div>
        <CopyButton text={String(data.output)} />
      </div>
    )
  }

  // Plagiarism detector
  if (data.uniqueness_score !== undefined) {
    const score = data.uniqueness_score as number
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '20px', background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 14 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Uniqueness Score</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: score >= 80 ? '#3ee58f' : score >= 60 ? '#f59e0b' : '#ff6889' }}>
            {score}/100
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <DataCard label="Words" value={(data.word_count as number)?.toLocaleString()} accent={accent} />
          <DataCard label="Sentences" value={data.sentence_count} accent={accent} />
          <DataCard label="Characters" value={(data.text_length as number)?.toLocaleString()} accent={accent} />
        </div>
        {Boolean(data.note) && (
          <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', borderLeft: `3px solid ${accent}` }}>
            ℹ️ {String(data.note)}
          </div>
        )}
      </div>
    )
  }

  // CSS Gradient generator — live preview + code
  if (data.css_code && data.preview_style && data.gradient_type !== undefined) {
    const cssObj = data.css_code as Record<string, string>
    const presets = (data.presets || []) as Array<{ name: string; css: string }>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: '100%', height: 120, borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backgroundImage: String(data.preview_style).replace('background:', '').trim() }} />
        {Object.entries(cssObj).map(([label, css]) => (
          <div key={label}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <CodeResultRenderer text={css} label={label} />
          </div>
        ))}
        {Boolean(data.tailwind_hint) && (
          <div style={{ padding: '10px 14px', background: 'rgba(59,208,255,0.08)', border: '1px solid rgba(59,208,255,0.2)', borderRadius: 8, fontSize: 13, color: '#3bd0ff' }}>
            🎨 {String(data.tailwind_hint)}
          </div>
        )}
        {presets.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Presets</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {presets.map((p, i) => (
                <div key={i} title={p.css} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundImage: p.css.replace('background:', '').trim(), color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Box shadow generator — live preview + code
  if (data.box_shadow_css !== undefined && data.inset !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: '100%', height: 100, borderRadius: 16, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 60, borderRadius: 12, background: 'rgba(255,255,255,0.12)', boxShadow: String(data.box_shadow_css) }} />
        </div>
        <CodeResultRenderer text={`box-shadow: ${String(data.box_shadow_css)};`} label="CSS Code" />
        {Boolean(data.tailwind_hint) && (
          <div style={{ padding: '10px 14px', background: 'rgba(59,208,255,0.08)', border: '1px solid rgba(59,208,255,0.2)', borderRadius: 8, fontSize: 13, color: '#3bd0ff' }}>
            🎨 {String(data.tailwind_hint)}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {['h_offset', 'v_offset', 'blur', 'spread', 'color', 'inset'].map(k => data[k] !== undefined && (
            <DataCard key={k} label={k} value={data[k]} accent={accent} />
          ))}
        </div>
      </div>
    )
  }

  // Color blindness simulator
  if ((data.original_hex !== undefined || data.original_color !== undefined) && data.simulations !== undefined) {
    const originalColor = String(data.original_hex ?? data.original_color ?? '')
    const sims = data.simulations as Record<string, { hex: string; rgb: string; description: string }>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: originalColor, border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{originalColor.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Original Color</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {Object.entries(sims).map(([name, sim]) => (
            <div key={name} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sim.hex, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#ecf2ff', textTransform: 'capitalize' }}>{name.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{sim.hex} · {sim.rgb}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{sim.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // GSTIN/PAN validator
  if (data.is_valid !== undefined && (data.gstin !== undefined || data.pan !== undefined)) {
    const isValid = Boolean(data.is_valid)
    const displayKeys = data.gstin ? ['gstin', 'state', 'pan_number', 'entity_number', 'validation_message'] : ['pan', 'pan_type', 'pan_holder_type', 'validation_message']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ textAlign: 'center', padding: '20px', borderRadius: 16, border: `2px solid ${isValid ? '#3ee58f40' : '#ff6b6b40'}`, background: isValid ? 'rgba(62,229,143,0.06)' : 'rgba(255,107,107,0.06)' }}>
          <div style={{ fontSize: 40, lineHeight: 1 }}>{isValid ? '✅' : '❌'}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8, color: isValid ? '#3ee58f' : '#ff6b6b' }}>
            {String(data.gstin ?? data.pan ?? '')}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{String(data.validation_message || (isValid ? 'Valid' : 'Invalid'))}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {displayKeys.filter(k => data[k] !== undefined && k !== 'validation_message').map(k => (
            <DataCard key={k} label={k} value={data[k]} accent={accent} />
          ))}
        </div>
      </div>
    )
  }

  // Net worth calculator
  if (data.total_assets !== undefined && data.total_liabilities !== undefined && data.net_worth !== undefined) {
    const netWorth = Number(data.net_worth)
    const isPositive = netWorth >= 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, border: `2px solid ${isPositive ? '#3ee58f40' : '#ff6b6b40'}`, background: isPositive ? 'rgba(62,229,143,0.05)' : 'rgba(255,107,107,0.05)' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net Worth</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: isPositive ? '#3ee58f' : '#ff6b6b', marginTop: 4 }}>{String(data.formatted_net_worth || `₹${netWorth.toLocaleString()}`)}</div>
          {Boolean(data.financial_health) && <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{String(data.financial_health)}</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(62,229,143,0.06)', border: '1px solid rgba(62,229,143,0.15)' }}>
            <div style={{ fontSize: 12, color: '#3ee58f', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Total Assets</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#3ee58f' }}>{String(data.formatted_assets || `₹${Number(data.total_assets).toLocaleString()}`)}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)' }}>
            <div style={{ fontSize: 12, color: '#ff6b6b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Total Liabilities</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#ff6b6b' }}>{String(data.formatted_liabilities || `₹${Number(data.total_liabilities).toLocaleString()}`)}</div>
          </div>
        </div>
      </div>
    )
  }

  // Salary / Net salary calculator India
  if (data.monthly_net_salary !== undefined && data.annual_net_salary !== undefined) {
    const components = data.components as Record<string, number> | undefined
    const deductions = data.deductions as Record<string, number> | undefined
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly In-Hand Salary</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: accent, marginTop: 4 }}>₹{Number(data.monthly_net_salary).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Annual: ₹{Number(data.annual_net_salary).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          <DataCard label="Tax Regime" value={data.tax_regime} accent={accent} />
          <DataCard label="Effective Tax Rate" value={`${data.effective_tax_rate}%`} accent={accent} />
          <DataCard label="Monthly CTC" value={`₹${Number(data.monthly_ctc).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          {data.taxable_income !== undefined && <DataCard label="Taxable Income" value={`₹${Number(data.taxable_income).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />}
        </div>
        {components && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Salary Components</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {Object.entries(components).map(([k, v]) => <DataCard key={k} label={k} value={`₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />)}
            </div>
          </div>
        )}
        {deductions && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Deductions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {Object.entries(deductions).map(([k, v]) => <DataCard key={k} label={k} value={`₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent="#ff6b6b" />)}
            </div>
          </div>
        )}
      </div>
    )
  }

  // PPF/NPS/EPF maturity calculators
  if (data.maturity_amount !== undefined && data.total_invested !== undefined) {
    const breakdown = (data.yearly_breakdown || data.monthly_breakdown) as Record<string, unknown>[] | undefined
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Maturity Amount</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: accent, marginTop: 4 }}>₹{Number(data.maturity_amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          <DataCard label="Total Invested" value={`₹${Number(data.total_invested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          {data.total_interest_earned !== undefined && <DataCard label="Interest Earned" value={`₹${Number(data.total_interest_earned).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent="#3ee58f" />}
          {data.wealth_gained_percent !== undefined && <DataCard label="Wealth Gained" value={`${data.wealth_gained_percent}%`} accent="#3ee58f" />}
          {data.tax_status !== undefined && <DataCard label="Tax Status" value={data.tax_status} accent={accent} />}
        </div>
        {data.tax_benefit !== undefined && (
          <div style={{ padding: '10px 14px', background: 'rgba(62,229,143,0.08)', border: '1px solid rgba(62,229,143,0.2)', borderRadius: 8, fontSize: 13, color: '#3ee58f' }}>
            💰 Tax Benefit: {String(data.tax_benefit)}
          </div>
        )}
        {breakdown && breakdown.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Year-by-Year Breakdown</div>
            <TableRenderer data={breakdown.slice(0, 20)} accent={accent} />
          </div>
        )}
      </div>
    )
  }

  // Macro calculator (handles both flat and nested macros structure)
  if (data.target_calories !== undefined && data.macros !== undefined) {
    const macroData = data.macros as Record<string, { grams: number; calories: number; percent: number }>
    const protein = macroData.protein?.grams ?? (data as Record<string, number>).protein_g ?? 0
    const carbs = macroData.carbohydrates?.grams ?? (data as Record<string, number>).carbs_g ?? 0
    const fat = macroData.fats?.grams ?? (data as Record<string, number>).fat_g ?? 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Daily Target Calories</div>
          <div style={{ fontWeight: 900, fontSize: 48, color: accent, marginTop: 4 }}>{Number(data.target_calories).toLocaleString()}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>kcal/day</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(59,208,255,0.08)', border: '1px solid rgba(59,208,255,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#3bd0ff' }}>{protein}g</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Protein</div>
            {macroData.protein?.percent && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{macroData.protein.percent}% of calories</div>}
          </div>
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(249,168,37,0.08)', border: '1px solid rgba(249,168,37,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f9a825' }}>{carbs}g</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Carbs</div>
            {macroData.carbohydrates?.percent && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{macroData.carbohydrates.percent}% of calories</div>}
          </div>
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#a855f7' }}>{fat}g</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Fat</div>
            {macroData.fats?.percent && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{macroData.fats.percent}% of calories</div>}
          </div>
        </div>
        {(data.bmr !== undefined || data.tdee !== undefined) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {data.bmr !== undefined && <DataCard label="BMR (Basal)" value={`${data.bmr} kcal`} accent={accent} />}
            {data.tdee !== undefined && <DataCard label="TDEE (Maintenance)" value={`${data.tdee} kcal`} accent={accent} />}
            {data.goal !== undefined && <DataCard label="Goal" value={data.goal} accent={accent} />}
          </div>
        )}
      </div>
    )
  }

  // Investment calculator (handles final_amount or final_value; total_interest or total_return)
  if ((data.final_amount !== undefined || data.final_value !== undefined) && data.total_invested !== undefined) {
    const finalAmt = Number(data.final_amount ?? data.final_value)
    const totalReturn = Number(data.total_interest ?? data.total_return ?? (finalAmt - Number(data.total_invested)))
    const yearlyData = data.yearly_projection as Record<string, unknown>[] | undefined
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Final Value</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: accent, marginTop: 4 }}>₹{finalAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          <DataCard label="Total Invested" value={`₹${Number(data.total_invested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          <DataCard label="Interest/Return" value={`₹${totalReturn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent="#3ee58f" />
          {data.cagr !== undefined && <DataCard label="CAGR" value={`${data.cagr}%`} accent={accent} />}
          {data.interest_rate_pa !== undefined && <DataCard label="Annual Rate" value={`${data.interest_rate_pa}%`} accent={accent} />}
        </div>
        {yearlyData && yearlyData.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Yearly Projection</div>
            <TableRenderer data={yearlyData.slice(0, 20)} accent={accent} />
          </div>
        )}
      </div>
    )
  }

  // Retirement planner (corpus_required or corpus_needed fields)
  if ((data.corpus_required !== undefined || data.corpus_needed !== undefined) && data.projected_corpus !== undefined) {
    const corpusNeeded = Number(data.corpus_required ?? data.corpus_needed)
    const isOnTrack = data.is_on_track === true || Number(data.projected_corpus) >= corpusNeeded
    const shortfall = !isOnTrack ? corpusNeeded - Number(data.projected_corpus) : 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: isOnTrack ? 'rgba(62,229,143,0.06)' : 'rgba(255,107,107,0.06)', border: `2px solid ${isOnTrack ? '#3ee58f' : '#ff6b6b'}40` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: isOnTrack ? '#3ee58f' : '#ff6b6b' }}>
            {isOnTrack ? '🎉 You are on track for retirement!' : '⚠️ Retirement shortfall detected'}
          </div>
          {!isOnTrack && shortfall > 0 && (
            <div style={{ fontSize: 13, color: '#ff6b6b', marginTop: 6 }}>Shortfall: ₹{shortfall.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          <DataCard label="Corpus Required" value={`₹${corpusNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          <DataCard label="Projected Corpus" value={`₹${Number(data.projected_corpus).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={isOnTrack ? '#3ee58f' : '#ff6b6b'} />
          {data.additional_monthly_saving_needed !== undefined && !isOnTrack && (
            <DataCard label="Extra Monthly Needed" value={`₹${Number(data.additional_monthly_saving_needed).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent="#f59e0b" />
          )}
          {data.years_to_retirement !== undefined && <DataCard label="Years to Retire" value={String(data.years_to_retirement)} accent={accent} />}
          {data.future_monthly_expense_at_retirement !== undefined && (
            <DataCard label="Future Monthly Expenses" value={`₹${Number(data.future_monthly_expense_at_retirement).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          )}
        </div>
      </div>
    )
  }

  // Gratuity calculator
  if (data.gratuity_amount !== undefined && data.years_of_service !== undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Gratuity Amount</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: accent, marginTop: 4 }}>₹{Number(data.gratuity_amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{String(data.tax_status || '')}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          <DataCard label="Years of Service" value={String(data.years_of_service)} accent={accent} />
          <DataCard label="Last Basic + DA" value={`₹${Number(data.last_basic_da).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} accent={accent} />
          {data.covered !== undefined && <DataCard label="Gratuity Act Covered" value={data.covered ? 'Yes' : 'No'} accent={accent} />}
          {data.formula_used !== undefined && <DataCard label="Formula" value={data.formula_used} accent={accent} />}
        </div>
      </div>
    )
  }

  // Cron builder
  if (data.expression !== undefined && data.human_readable !== undefined) {
    const nextRuns = data.next_runs as string[] | undefined
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '18px 24px', borderRadius: 16, background: `${accent}0d`, border: `2px solid ${accent}30` }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Human Readable Schedule</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: accent }}>{String(data.human_readable)}</div>
        </div>
        <CodeResultRenderer text={String(data.expression)} label="Cron Expression" />
        {data.components !== undefined && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {Object.entries(data.components as Record<string, string>).map(([part, val]) => (
              <div key={part} style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>{part}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: accent, fontFamily: 'monospace' }}>{val}</div>
              </div>
            ))}
          </div>
        )}
        {nextRuns && nextRuns.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Next Runs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {nextRuns.map((run, i) => (
                <div key={i} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: 13, color: '#ecf2ff', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace' }}>
                  {i + 1}. {run}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Fallback: generic smart display
  const scalarKeys = Object.keys(data).filter(k => data[k] !== null && data[k] !== undefined && typeof data[k] !== 'object' && !Array.isArray(data[k]))
  const arrayKeys = Object.keys(data).filter(k => Array.isArray(data[k]) && !((data[k] as unknown[])[0] && typeof (data[k] as unknown[])[0] === 'object'))
  // Check for primary text output
  const textKeys = ['output', 'text', 'result', 'content', 'answer', 'paraphrased', 'words', 'in_words', 'ascii_art']
  const primaryText = textKeys.find(k => data[k] && typeof data[k] === 'string')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {primaryText && (
        <CodeResultRenderer text={String(data[primaryText])} label={primaryText.replace(/_/g, ' ')} />
      )}
      {scalarKeys.filter(k => k !== primaryText).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {scalarKeys.filter(k => k !== primaryText && !['error', 'note', 'tip'].includes(k)).map(k => (
            <DataCard key={k} label={k} value={data[k]} accent={accent} />
          ))}
        </div>
      )}
      {arrayKeys.map(k => (
        <div key={k}>
          <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 8, textTransform: 'uppercase' }}>{k.replace(/_/g, ' ')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(data[k] as unknown[]).slice(0, 30).map((item, i) => (
              <span key={i} style={{ padding: '4px 10px', background: `${accent}12`, border: `1px solid ${accent}25`, borderRadius: 6, fontSize: 13, color: accent }}>
                {String(item)}
              </span>
            ))}
          </div>
        </div>
      ))}
      {Boolean(data.note) && (
        <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', borderLeft: `3px solid ${accent}` }}>
          ℹ️ {String(data.note)}
        </div>
      )}
    </div>
  )
}
