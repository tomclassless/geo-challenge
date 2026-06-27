import { useState, type CSSProperties, type ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  children?: ReactNode
  variant?: Variant
  size?: Size
  block?: boolean
  disabled?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  style?: CSSProperties
}

/**
 * Roam primary action button. Tactile "pop" resting on a solid colored drop
 * shadow that presses down on :active. Variants: primary | accent | secondary
 * | ghost | danger. Sizes: sm | md | lg | xl (xl for kid-facing CTAs).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false)

  const sizes = {
    sm: { fs: 'var(--fs-sm)', pad: '8px 14px', h: 38, gap: 6, radius: 'var(--r-sm)' },
    md: { fs: 'var(--fs-body)', pad: '12px 22px', h: 48, gap: 8, radius: 'var(--r-md)' },
    lg: { fs: 'var(--fs-title)', pad: '16px 30px', h: 58, gap: 10, radius: 'var(--r-md)' },
    xl: { fs: 'var(--fs-h3)', pad: '20px 40px', h: 72, gap: 12, radius: 'var(--r-lg)' },
  }[size]

  const palette = {
    primary: { bg: 'var(--brand)', fg: 'var(--text-on-brand)', pop: 'var(--teal-700)' },
    accent: { bg: 'var(--accent)', fg: 'var(--text-on-accent)', pop: 'var(--amber-600)' },
    danger: { bg: 'var(--wrong)', fg: '#fff', pop: 'var(--red-700)' },
  }[variant as 'primary' | 'accent' | 'danger']

  const base: CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.gap,
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--w-bold)' as unknown as number,
    fontSize: sizes.fs,
    lineHeight: 1,
    minHeight: sizes.h,
    padding: sizes.pad,
    border: 'none',
    borderRadius: sizes.radius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition:
      'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  let skin: CSSProperties
  if (variant === 'secondary') {
    skin = {
      background: 'var(--surface)',
      color: 'var(--brand-strong)',
      boxShadow: 'inset 0 0 0 2px var(--brand-tint)',
    }
  } else if (variant === 'ghost') {
    skin = { background: 'transparent', color: 'var(--text)', boxShadow: 'none' }
  } else {
    skin = {
      background: palette.bg,
      color: palette.fg,
      boxShadow: disabled ? 'none' : pressed ? `0 1px 0 ${palette.pop}` : `0 5px 0 ${palette.pop}`,
      transform: pressed && !disabled ? 'translateY(4px)' : 'translateY(0)',
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ ...base, ...skin, ...style }}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
