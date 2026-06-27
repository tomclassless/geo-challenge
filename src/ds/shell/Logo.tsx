interface Props {
  size?: number
  light?: boolean
}

/**
 * Roam wordmark: a rounded "map-pin" squircle mark + "Roam 週遊" lockup.
 * `light` renders the reverse (white) version for use on the teal hero band.
 */
export function Logo({ size = 38, light = false }: Props) {
  const mark = size
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: mark,
          height: mark,
          borderRadius: '50% 50% 50% 4px',
          background: light ? '#fff' : 'var(--brand)',
          display: 'grid',
          placeItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: mark * 0.31,
            height: mark * 0.31,
            borderRadius: '50%',
            background: 'var(--accent)',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: size * 0.66,
          lineHeight: 1,
          color: light ? '#fff' : 'var(--brand-strong)',
        }}
      >
        Roam
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 900,
            fontSize: size * 0.3,
            letterSpacing: '0.28em',
            color: light ? 'var(--teal-100)' : 'var(--text-muted)',
            marginLeft: 8,
          }}
        >
          週遊
        </span>
      </div>
    </div>
  )
}
