import type { CSSProperties } from 'react'

interface Props {
  remaining: number
  total: number
  dangerAt?: number
  showSeconds?: boolean
  height?: number
  style?: CSSProperties
}

/**
 * Per-question countdown bar. Drives off `remaining`/`total` seconds.
 * Amber fill that shrinks; flips to danger red under `dangerAt` seconds.
 * Purely presentational — parent owns the tick.
 */
export function TimerBar({
  remaining,
  total,
  dangerAt = 5,
  showSeconds = true,
  height = 14,
  style,
}: Props) {
  const pct = Math.max(0, Math.min(1, total ? remaining / total : 0))
  const danger = remaining <= dangerAt
  const fill = danger ? 'var(--timer-danger)' : 'var(--timer-fill)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <div
        style={{
          position: 'relative',
          flex: 1,
          height,
          background: 'var(--timer-track)',
          borderRadius: 'var(--r-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct * 100}%`,
            background: fill,
            borderRadius: 'var(--r-pill)',
            transition: 'width 1s linear, background var(--dur-med) var(--ease-out)',
          }}
        />
      </div>
      {showSeconds && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-h3)',
            fontVariantNumeric: 'tabular-nums',
            color: danger ? 'var(--timer-danger)' : 'var(--text-muted)',
            minWidth: '2ch',
            textAlign: 'right',
          }}
        >
          {Math.max(0, Math.ceil(remaining))}
        </span>
      )}
    </div>
  )
}
