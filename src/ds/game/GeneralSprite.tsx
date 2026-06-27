import type { CityMeta } from '../../lib/cities'

/** The city's guardian 天兵 — big emoji with a themed glow and a name banner.
 *  Swap the emoji in cities.ts for an <img>/SVG when real art is ready. */
export function GeneralSprite({
  meta,
  playerName,
  size = 150,
  hit = false
}: {
  meta: CityMeta
  /** the player this soldier is challenging */
  playerName?: string | null
  size?: number
  /** brief shake when struck */
  hit?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          fontSize: Math.round(size * 0.5),
          lineHeight: 1,
          background: `${meta.general.color}1A`,
          border: `4px solid ${meta.general.color}`,
          // glow uses the general's theme colour
          ['--glow' as string]: `${meta.general.color}66`,
          animation: hit ? 'rpgHit .4s ease' : 'rpgFloat 3s ease-in-out infinite, rpgGlow 2.6s ease-in-out infinite'
        }}
      >
        {meta.general.emoji}
      </div>

      <div
        style={{
          padding: '8px 22px',
          borderRadius: 'var(--r-pill)',
          background: meta.general.color,
          color: '#fff',
          fontWeight: 900,
          fontSize: 'var(--fs-title)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {meta.general.name}
      </div>

      {playerName && (
        <div style={{ fontSize: 'var(--fs-body)', color: 'var(--text-muted)', fontWeight: 700 }}>
          ⚔️ 對手：<span style={{ color: 'var(--text)' }}>{playerName}</span>
        </div>
      )}
    </div>
  )
}
