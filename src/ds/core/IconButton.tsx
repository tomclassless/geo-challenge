import type { CSSProperties, ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  variant?: 'solid' | 'soft' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  style?: CSSProperties
}

/**
 * Square icon-only button. Variants: solid | soft | ghost. For toolbar / nav
 * actions (sync, back, sound, settings). Pass a Lucide (or any) icon node.
 */
export function IconButton({
  icon,
  label,
  variant = 'soft',
  size = 'md',
  disabled = false,
  onClick,
  style,
}: Props) {
  const dim = { sm: 40, md: 48, lg: 58 }[size]

  const skins = {
    solid: { background: 'var(--brand)', color: '#fff', boxShadow: 'var(--shadow-sm)' },
    soft: { background: 'var(--brand-soft)', color: 'var(--brand-strong)', boxShadow: 'none' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', boxShadow: 'none' },
  }[variant]

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        border: 'none',
        borderRadius: 'var(--r-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition:
          'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...skins,
        ...style,
      }}
    >
      {icon}
    </button>
  )
}
