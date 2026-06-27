import type { CSSProperties, ReactNode } from 'react'

type Tone = 'neutral' | 'brand' | 'correct' | 'wrong' | 'unanswered' | 'accent'

interface Props {
  children?: ReactNode
  tone?: Tone
  soft?: boolean
  style?: CSSProperties
}

/**
 * Small status / label pill. tone: neutral | brand | correct | wrong |
 * unanswered | accent. Solid (filled) by default; soft for low emphasis.
 */
export function Badge({ children, tone = 'neutral', soft = false, style }: Props) {
  const map: Record<Tone, { solid: [string, string]; soft: [string, string] }> = {
    neutral: { solid: ['var(--gray-600)', '#fff'], soft: ['var(--gray-100)', 'var(--gray-700)'] },
    brand: { solid: ['var(--brand)', '#fff'], soft: ['var(--brand-soft)', 'var(--brand-strong)'] },
    accent: { solid: ['var(--accent)', 'var(--text-on-accent)'], soft: ['var(--accent-soft)', 'var(--amber-600)'] },
    correct: { solid: ['var(--correct)', '#fff'], soft: ['var(--correct-bg)', 'var(--green-700)'] },
    wrong: { solid: ['var(--wrong)', '#fff'], soft: ['var(--wrong-bg)', 'var(--red-700)'] },
    unanswered: { solid: ['var(--unanswered)', '#fff'], soft: ['var(--unanswered-bg)', 'var(--gray-600)'] },
  }

  const [bg, fg] = soft ? map[tone].soft : map[tone].solid

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--w-bold)' as unknown as number,
        fontSize: 'var(--fs-xs)',
        lineHeight: 1,
        letterSpacing: 'var(--ls-wide)',
        padding: '6px 12px',
        borderRadius: 'var(--r-pill)',
        background: bg,
        color: fg,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
