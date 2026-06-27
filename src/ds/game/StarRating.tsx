import type { CSSProperties } from 'react'

interface Props {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  style?: CSSProperties
}

/**
 * Encouragement stars for the summary screen. `value`/`max` filled stars in
 * amber. Optional pop-in animation gated on `animate`. Size sm | md | lg.
 */
export function StarRating({ value = 0, max = 5, size = 'md', animate = false, style }: Props) {
  const dim = { sm: 22, md: 34, lg: 52 }[size]
  const Star = ({ filled, i }: { filled: boolean; i: number }) => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      style={{
        display: 'block',
        animation:
          animate && filled
            ? `roamStarPop var(--dur-reveal) var(--ease-bounce) ${i * 90}ms both`
            : 'none',
      }}
    >
      <path
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z"
        fill={filled ? 'var(--accent)' : 'var(--surface-sunken)'}
        stroke={filled ? 'var(--accent-strong)' : 'var(--border-strong)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
  return (
    <div style={{ display: 'inline-flex', gap: 6, ...style }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} i={i} filled={i < value} />
      ))}
    </div>
  )
}
