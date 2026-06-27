import { Fragment, type CSSProperties, type ReactNode } from 'react'

interface Props {
  value?: string
  length?: number
  error?: boolean
  onChange?: (next: string) => void
  onComplete?: (value: string) => void
  style?: CSSProperties
}

/**
 * Teacher PIN gate. `length` dots; controlled via `value`. Renders the dots +
 * a numeric keypad. Calls onChange(next) and onComplete when filled. `error`
 * shakes + reddens. Children-proof entry to reports.
 */
export function PinInput({ value = '', length = 4, error = false, onChange, onComplete, style }: Props) {
  const press = (d: string) => {
    if (value.length >= length) return
    const next = value + d
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }
  const back = () => onChange?.(value.slice(0, -1))

  const keyBtn = (label: ReactNode, fn: () => void) => (
    <button
      type="button"
      onClick={fn}
      style={{
        minHeight: 60,
        border: 'none',
        borderRadius: 'var(--r-md)',
        background: 'var(--surface-sunken)',
        color: 'var(--text)',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--w-bold)' as unknown as number,
        fontSize: 'var(--fs-h3)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, ...style }}>
      <div
        style={{
          display: 'flex',
          gap: 14,
          animation: error ? 'roamShake 360ms var(--ease-out)' : 'none',
        }}
      >
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length
          return (
            <span
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 'var(--r-pill)',
                background: filled ? (error ? 'var(--wrong)' : 'var(--brand)') : 'transparent',
                border: `2px solid ${error ? 'var(--wrong)' : filled ? 'var(--brand)' : 'var(--border-strong)'}`,
                transition: 'background var(--dur-fast), border-color var(--dur-fast)',
              }}
            />
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: 12 }}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <Fragment key={d}>{keyBtn(d, () => press(d))}</Fragment>
        ))}
        {keyBtn('⌫', back)}
        {keyBtn('0', () => press('0'))}
      </div>
    </div>
  )
}
