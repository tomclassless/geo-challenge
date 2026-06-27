import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClose?: () => void
  width?: number
  style?: CSSProperties
}

/**
 * Centered dialog over a translucent ink scrim (--overlay). Click-outside
 * closes. Used for settings + history detail.
 */
export function Modal({ children, onClose, width = 420, style }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--overlay)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        zIndex: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          borderRadius: 'var(--r-xl)',
          padding: 28,
          width: '100%',
          maxWidth: width,
          maxHeight: '90%',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}
