import { useState, type CSSProperties } from 'react'
import { Avatar } from '../core/Avatar'

interface Props {
  name: string
  recent?: boolean
  selected?: boolean
  onClick?: () => void
  style?: CSSProperties
}

/**
 * Pick-your-name tile used on the handoff screen. Large target, avatar +
 * name. `recent` marks the last player (helps the line move). Selectable.
 */
export function NameCard({ name, recent = false, selected = false, onClick, style }: Props) {
  const [press, setPress] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        minHeight: 76,
        width: '100%',
        padding: '12px 18px',
        background: selected ? 'var(--brand-soft)' : 'var(--surface)',
        border: selected ? '3px solid var(--brand)' : '3px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        cursor: 'pointer',
        boxShadow: press ? 'none' : 'var(--shadow-sm)',
        transform: press ? 'translateY(2px)' : 'none',
        transition:
          'transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      <Avatar name={name} size="lg" />
      <span
        style={{
          flex: 1,
          textAlign: 'left',
          fontFamily: 'var(--font-sans)',
          fontWeight: 'var(--w-bold)' as unknown as number,
          fontSize: 'var(--fs-h3)',
          color: 'var(--text)',
        }}
      >
        {name}
      </span>
      {recent && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--w-bold)' as unknown as number,
            fontSize: 'var(--fs-xs)',
            letterSpacing: 'var(--ls-wide)',
            color: 'var(--text-subtle)',
            background: 'var(--surface-sunken)',
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
          }}
        >
          剛剛
        </span>
      )}
    </button>
  )
}
