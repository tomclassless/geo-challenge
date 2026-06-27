import { useState, type CSSProperties, type ReactNode } from 'react'

interface Props {
  children?: ReactNode
  tone?: 'plain' | 'sunken' | 'brand' | 'accent'
  pad?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
  style?: CSSProperties
}

/**
 * Surface container. tone: plain | sunken | brand | accent. pad controls inner
 * padding; interactive lifts on hover. Composes most Roam screens.
 */
export function Card({ children, tone = 'plain', pad = 'md', interactive = false, onClick, style }: Props) {
  const [hover, setHover] = useState(false)

  const padMap = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)' }

  const tones = {
    plain: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    sunken: { background: 'var(--surface-sunken)', color: 'var(--text)', border: '1px solid var(--border)' },
    brand: { background: 'var(--brand-soft)', color: 'var(--teal-900)', border: '1px solid var(--brand-tint)' },
    accent: { background: 'var(--accent-soft)', color: 'var(--gray-900)', border: '1px solid var(--amber-200)' },
  }[tone]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--r-lg)',
        padding: padMap[pad],
        boxShadow: interactive && hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: interactive && hover ? 'translateY(-2px)' : 'none',
        transition:
          'box-shadow var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...tones,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
