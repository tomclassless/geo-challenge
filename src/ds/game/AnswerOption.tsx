import { useState, type CSSProperties, type ReactNode } from 'react'

interface Props {
  children?: ReactNode
  index?: number
  selected?: boolean
  disabled?: boolean
  showKey?: boolean
  onClick?: () => void
  style?: CSSProperties
}

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Big tappable single-select answer. One of the 4-option quartet (positional
 * color via `index`). NEVER signals correctness during answering — only
 * `selected` (chosen) state. A leading key chip aids scanning.
 */
export function AnswerOption({
  children,
  index = 0,
  selected = false,
  disabled = false,
  showKey = true,
  onClick,
  style,
}: Props) {
  const [press, setPress] = useState(false)
  const colors = ['var(--opt-coral)', 'var(--opt-amber)', 'var(--opt-teal)', 'var(--opt-indigo)']
  const c = colors[index % 4]
  const key = KEYS[index % KEYS.length]

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => !disabled && setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width: '100%',
        minHeight: 84,
        textAlign: 'left',
        padding: '16px 22px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--w-bold)' as unknown as number,
        fontSize: 'var(--fs-h3)',
        lineHeight: 1.3,
        color: 'var(--text)',
        background: selected ? `color-mix(in srgb, ${c} 14%, var(--surface))` : 'var(--surface)',
        border: selected ? `3px solid ${c}` : '3px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: press ? 'none' : 'var(--shadow-sm)',
        transform: press && !disabled ? 'translateY(2px)' : 'none',
        transition:
          'transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      {showKey && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 'var(--r-md)',
            background: selected ? c : `color-mix(in srgb, ${c} 16%, transparent)`,
            color: selected ? '#fff' : c,
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-title)',
          }}
        >
          {key}
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  )
}
