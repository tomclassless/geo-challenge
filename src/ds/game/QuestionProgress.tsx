import type { CSSProperties } from 'react'

interface Props {
  current: number
  total: number
  style?: CSSProperties
}

/**
 * Question progress indicator — "第 n / N 題" plus a slim segment track.
 * Compact, sits in the question header. Does not imply score.
 */
export function QuestionProgress({ current, total, style }: Props) {
  const pct = total ? Math.min(1, current / total) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 'var(--w-bold)' as unknown as number,
          fontSize: 'var(--fs-sm)',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        第 <span style={{ color: 'var(--brand-strong)', fontSize: 'var(--fs-title)' }}>{current}</span> / {total} 題
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          background: 'var(--surface-sunken)',
          borderRadius: 'var(--r-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: 'var(--brand)',
            borderRadius: 'var(--r-pill)',
            transition: 'width var(--dur-med) var(--ease-out)',
          }}
        />
      </div>
    </div>
  )
}
