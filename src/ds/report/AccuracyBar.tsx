import type { CSSProperties } from 'react'

interface Props {
  correct: number
  answered: number
  weakAt?: number
  label?: string
  style?: CSSProperties
}

/**
 * Per-question class accuracy bar: correct / answered. Auto-flags the weakest
 * questions in red when `rate` <= `weakAt`. Shows the fraction + percentage.
 */
export function AccuracyBar({ correct, answered, weakAt = 0.5, label, style }: Props) {
  const rate = answered ? correct / answered : 0
  const weak = rate <= weakAt
  const fill = weak ? 'var(--wrong)' : rate >= 0.8 ? 'var(--correct)' : 'var(--brand)'
  const pct = Math.round(rate * 100)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...style }}>
      {label != null && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-sm)',
            color: weak ? 'var(--wrong)' : 'var(--text)',
            minWidth: 92,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: 18,
          background: 'var(--surface-sunken)',
          borderRadius: 'var(--r-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: fill,
            borderRadius: 'var(--r-pill)',
            transition: 'width var(--dur-med) var(--ease-out)',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 'var(--w-bold)' as unknown as number,
          fontSize: 'var(--fs-sm)',
          color: weak ? 'var(--wrong)' : 'var(--text-muted)',
          minWidth: 86,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {correct}/{answered} · {pct}%
      </span>
    </div>
  )
}
