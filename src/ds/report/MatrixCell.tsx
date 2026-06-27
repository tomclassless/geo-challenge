import type { CSSProperties } from 'react'

type State = 'correct' | 'wrong' | 'unanswered'

interface Props {
  state?: State
  compact?: boolean
  glyph?: boolean
  style?: CSSProperties
}

/**
 * One cell in the teacher's per-question × per-person matrix.
 * state: correct (green) | wrong (red) | unanswered (gray). Square, scannable.
 */
export function MatrixCell({ state = 'unanswered', compact = false, glyph = true, style }: Props) {
  const map: Record<State, { bg: string; fg: string; bd: string; mark: string }> = {
    correct: { bg: 'var(--correct-bg)', fg: 'var(--green-700)', bd: 'var(--correct-line)', mark: '✓' },
    wrong: { bg: 'var(--wrong-bg)', fg: 'var(--red-700)', bd: 'var(--wrong-line)', mark: '✕' },
    unanswered: { bg: 'var(--unanswered-bg)', fg: 'var(--gray-500)', bd: 'var(--border)', mark: '–' },
  }
  const m = map[state]
  const dim = compact ? 28 : 38
  return (
    <span
      title={state}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        borderRadius: 'var(--r-xs)',
        background: m.bg,
        color: m.fg,
        border: `1px solid ${m.bd}`,
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--w-bold)' as unknown as number,
        fontSize: compact ? 13 : 16,
        ...style,
      }}
    >
      {glyph ? m.mark : ''}
    </span>
  )
}
