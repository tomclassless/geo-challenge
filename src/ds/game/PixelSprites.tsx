import type { CityMeta } from '../../lib/cities'
import { SpecialtyIcon } from './SpecialtyIcon'

/**
 * Hand-drawn pixel-art sprites (no copyrighted art):
 *  - PixelWukong: 孫悟空 on his golden 筋斗雲, feathers + hair, waving his 金箍棒
 *    from his raised hand.
 *  - PixelGeneral: a generic 天兵 tinted with the city's theme colour, holding a spear.
 *  - PixelBattle: the quiz-page clash banner (孫悟空 vs 天兵 + the specialties at stake).
 */

const U = 7

const WK_SPRITE = [
  '.....KKKK.....',
  '...KKHHHHKK...',
  '..KHHHHHHHHK..',
  '..KHHHHHHHHK..',
  '..KRRRRRRRRK..',
  '..KGGGGGGGGK..',
  '.HKSSSSSSSSKH.',
  '.HKSEESSEESKH.',
  '.HKSSSSSSSSKH.',
  '.HKSSMMMMSSKH.',
  '..KSSSSSSSSK..',
  '...KKKKKKKK...',
  '...AYYYYYYA...',
  '..AAYYYYYYAA..',
  '...YYYYYYYY...'
]

const WK_PAL: Record<string, string> = {
  H: '#6B4A2B', K: '#3A2A1E', R: '#E0524D', G: '#F7C948',
  S: '#F2C18A', E: '#2A2A2A', M: '#B23A36', A: '#C23B37', Y: '#F7C948'
}

const GEN_SPRITE = [
  '......KK......',
  '.....KCCK.....',
  '....KCCCCK....',
  '...KCCCCCCK...',
  '...KCCCCCCK...',
  '...KSSSSSSK...',
  '...KSEESEEK...',
  '...KSSSSSSK...',
  '...KDDDDDDK...',
  '..KCCCCCCCCK..',
  '..KCCCCCCCCK..',
  '..KCCCCCCCCK..',
  '...KCCCCCCK...',
  '...CCC..CCC...'
]

function renderGrid(grid: string[], pal: Record<string, string>) {
  return grid.flatMap((row, y) =>
    [...row].map((ch, x) => {
      const c = pal[ch]
      return c ? <rect key={`${x}-${y}`} x={x * U} y={y * U} width={U} height={U} fill={c} /> : null
    })
  )
}

function Feather({ baseX, baseY, dir }: { baseX: number; baseY: number; dir: number }) {
  const segs = []
  for (let i = 0; i < 8; i++) {
    const x = baseX + dir * Math.round(i * 0.6) * U
    const y = baseY - i * U
    const tip = i >= 6
    segs.push(<rect key={i} x={dir < 0 ? x - U : x} y={y} width={(tip ? 1 : 2) * U} height={U} fill={tip ? '#F6C667' : '#E8893B'} />)
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x={baseX - U} y={baseY} width={2 * U} height={U} fill="#C23B37" />
      {segs}
    </g>
  )
}

export function PixelWukong({ size = 140, idle = false }: { size?: number; idle?: boolean }) {
  return (
    <svg viewBox="-49 -63 210 224" width={size} style={{ display: 'block', imageRendering: 'pixelated' }} aria-hidden>
      <g style={idle ? { animation: 'rpgFloat 2.8s ease-in-out infinite' } : undefined}>
        {/* golden somersault cloud — lumpy & puffy */}
        <g shapeRendering="crispEdges">
          <rect x={0} y={13 * U} width={12 * U} height={4 * U} fill="#F4DC82" />
          <rect x={-4 * U} y={14.5 * U} width={8 * U} height={3 * U} fill="#F4DC82" />
          <rect x={9 * U} y={14 * U} width={9 * U} height={3 * U} fill="#F4DC82" />
          <rect x={2 * U} y={11.5 * U} width={5 * U} height={3 * U} fill="#F4DC82" />
          <rect x={7 * U} y={12 * U} width={5 * U} height={3 * U} fill="#F4DC82" />
          <rect x={13 * U} y={13 * U} width={4 * U} height={2 * U} fill="#F4DC82" />
          {/* highlights */}
          <rect x={1 * U} y={12 * U} width={9 * U} height={U} fill="#FFF3C4" />
          <rect x={-3 * U} y={15 * U} width={6 * U} height={U} fill="#FFF3C4" />
          {/* lumpy bottom */}
          <rect x={-2 * U} y={17 * U} width={3 * U} height={U} fill="#F4DC82" />
          <rect x={3 * U} y={17.5 * U} width={3 * U} height={U} fill="#F4DC82" />
          <rect x={8 * U} y={17 * U} width={3 * U} height={U} fill="#F4DC82" />
          <rect x={12 * U} y={17.5 * U} width={3 * U} height={U} fill="#F4DC82" />
          <rect x={-4 * U} y={16.5 * U} width={22 * U} height={U} fill="#E6C766" />
        </g>

        {/* feathers behind the head */}
        <Feather baseX={5 * U} baseY={1 * U} dir={-1} />
        <Feather baseX={8 * U} baseY={1 * U} dir={1} />

        {/* monkey */}
        {renderGrid(WK_SPRITE, WK_PAL)}

        {/* raised right arm */}
        <g shapeRendering="crispEdges" fill="#F2C18A">
          <rect x={9.5 * U} y={11 * U} width={2 * U} height={2 * U} />
          <rect x={10.8 * U} y={9 * U} width={2 * U} height={2 * U} />
          <rect x={11.8 * U} y={7 * U} width={2 * U} height={2 * U} />
          <rect x={12 * U} y={5.2 * U} width={2.4 * U} height={2.4 * U} />
        </g>

        {/* 金箍棒 — waved by the hand */}
        <g transform={`translate(${13 * U} ${6.3 * U})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-62;-20;-62" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" dur="1.1s" repeatCount="indefinite" />
            <g shapeRendering="crispEdges">
              <rect x={-4 * U} y={-0.5 * U} width={8 * U} height={U} fill="#E8C24B" />
              <rect x={-4.3 * U} y={-0.9 * U} width={0.8 * U} height={1.8 * U} fill="#8B5A2B" />
              <rect x={3.5 * U} y={-0.9 * U} width={0.8 * U} height={1.8 * U} fill="#8B5A2B" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export function PixelGeneral({ color, size = 140, idle = false, hit = false }: { color: string; size?: number; idle?: boolean; hit?: boolean }) {
  const pal: Record<string, string> = { C: color, K: '#2E2A33', S: '#F0C9A0', E: '#2A2A2A', D: '#6B6660' }
  return (
    <svg viewBox="-14 -28 130 168" width={size} style={{ display: 'block', imageRendering: 'pixelated' }} aria-hidden>
      <g style={hit ? { animation: 'rpgHit .4s ease' } : idle ? { animation: 'rpgFloat 3.2s ease-in-out infinite' } : undefined}>
        {/* spear */}
        <g shapeRendering="crispEdges">
          <polygon points={`${0.7 * U},${-3.4 * U} ${1.7 * U},${-1.6 * U} ${-0.3 * U},${-1.6 * U}`} fill="#C0C6CC" />
          <rect x={0.4 * U} y={-1.8 * U} width={0.8 * U} height={16 * U} fill="#9AA0A6" />
        </g>
        {renderGrid(GEN_SPRITE, pal)}
      </g>
    </svg>
  )
}

export function PixelBattle({ meta, total, dropped, hit = false }: { meta: CityMeta; total: number; dropped: number; hit?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 22px', borderRadius: 'var(--r-lg)', background: `linear-gradient(90deg, var(--brand-soft), ${meta.general.color}22)`, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PixelWukong size={76} idle />
        <span style={{ fontWeight: 800 }}>孫悟空</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <SpecialtyIcon key={i} emoji={meta.specialty.emoji} size={24} dimmed={i < dropped} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-title)', color: 'var(--wrong)' }}>VS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 800 }}>{meta.general.name}</span>
        <div style={{ transform: 'scaleX(-1)' }}>
          <PixelGeneral color={meta.general.color} size={76} idle hit={hit} />
        </div>
      </div>
    </div>
  )
}
