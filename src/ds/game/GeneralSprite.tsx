import type { CityMeta } from '../../lib/cities'
import { PixelGeneral } from './PixelSprites'

/** The city's guardian 天兵 — unique pixel character with a themed glow and a name banner. */
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
          background: `${meta.general.color}1A`,
          border: `4px solid ${meta.general.color}`,
          // glow uses the general's theme colour
          ['--glow' as string]: `${meta.general.color}66`,
          animation: 'rpgGlow 2.6s ease-in-out infinite'
        }}
      >
        <PixelGeneral meta={meta} size={Math.round(size * 0.82)} idle hit={hit} />
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
