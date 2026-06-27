/** Sun Wukong's specialty progress toward escaping the city (collected / target). */
export function WukongMeter({
  collected,
  target,
  specialtyEmoji,
  compact = false
}: {
  collected: number
  target: number
  specialtyEmoji?: string
  compact?: boolean
}) {
  const pct = target ? Math.min(100, Math.round((collected / target) * 100)) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: compact ? 200 : 260 }}>
      <span style={{ fontSize: compact ? 30 : 40, lineHeight: 1 }}>🐵</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--fs-sm)',
            fontWeight: 700,
            marginBottom: 4
          }}
        >
          <span>{specialtyEmoji ? `${specialtyEmoji} 特產` : '特產'}</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{collected} / {target}</span>
        </div>
        <div
          style={{
            height: 14,
            borderRadius: 'var(--r-pill)',
            background: 'var(--surface-sunken)',
            overflow: 'hidden',
            border: '1px solid var(--border)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'var(--accent)',
              borderRadius: 'var(--r-pill)',
              transition: 'width .45s ease'
            }}
          />
        </div>
      </div>
    </div>
  )
}
