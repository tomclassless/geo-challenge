import type { CSSProperties, ReactNode } from 'react'

type Tone = 'default' | 'brand' | 'correct' | 'wrong' | 'accent'

interface Props {
  value: ReactNode
  unit?: ReactNode
  caption?: ReactNode
  tone?: Tone
  align?: 'left' | 'center'
  style?: CSSProperties
}

/**
 * Compact labeled metric for report headers / home cards.
 * value is the hero number; `unit` and `caption` sit around it.
 */
export function Stat({ value, unit, caption, tone = 'default', align = 'left', style }: Props) {
  const color = {
    default: 'var(--text)',
    brand: 'var(--brand-strong)',
    correct: 'var(--correct)',
    wrong: 'var(--wrong)',
    accent: 'var(--accent-strong)',
  }[tone]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: align === 'center' ? 'center' : 'flex-start',
        ...style,
      }}
    >
      {caption != null && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-xs)',
            letterSpacing: 'var(--ls-wide)',
            color: 'var(--text-muted)',
          }}
        >
          {caption}
        </span>
      )}
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-h1)',
            lineHeight: 1,
            color,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit != null && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 'var(--w-bold)' as unknown as number,
              fontSize: 'var(--fs-title)',
              color: 'var(--text-muted)',
            }}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  )
}
