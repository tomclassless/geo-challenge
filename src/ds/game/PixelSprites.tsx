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

// One unique sprite per 天兵, keyed by city short name.
const GENERALS: Record<string, { grid: string[]; pal: Record<string, string> }> = {
  // 海龍王 — dragon king (horns, whiskers, scales)
  '桃園': {
    pal: { K: '#16384A', B: '#1C7ED6', b: '#1559A0', G: '#3FB6A0', Y: '#F0C24B', W: '#FFFFFF', E: '#0E2733', R: '#E0524D' },
    grid: [
      '...Y......Y...',
      '...Y......Y...',
      '..KBB....BBK..',
      '..KBBBBBBBBK..',
      '..BGBBBBBBGB..',
      '.KBWEBBBBEWBK.',
      '.KBBBBBBBBBBK.',
      'WKBBBRRRRBBBKW',
      '.KBBBBBBBBBBK.',
      '..KBBBBBBBBK..',
      '...BBBBBBBB...',
      '..BGBBBBBBGB..',
      '..BBBBBBBBBB..',
      '...bb....bb...'
    ]
  },
  // 托塔李天王 — carries a pagoda on top
  '台北': {
    pal: { K: '#3A2E10', P: '#EAD9A0', c: '#C99A2E', Y: '#F0C24B', S: '#F0C9A0', E: '#22222A' },
    grid: [
      '.....PP.......',
      '....PPPP......',
      '...PPPPPP.....',
      '.....cc.......',
      '....KYYYK.....',
      '....KSSSK.....',
      '....KSEEK.....',
      '....KSSSK.....',
      '...KYYYYYK....',
      '..KYYYYYYYK...',
      '..KYcYYcYYK...',
      '..KYYYYYYYK...',
      '...KYYYYYK....',
      '...YY...YY....'
    ]
  },
  // 哪吒 — child with two buns, red, fire wheels
  '新北': {
    pal: { K: '#3A2010', D: '#2A2228', S: '#F6C7A0', E: '#22222A', M: '#B23A36', R: '#E0524D', Y: '#F7C948', o: '#F59E2B' },
    grid: [
      '..KK....KK....',
      '.KDDK..KDDK...',
      '..KK....KK....',
      '...KSSSSSSK...',
      '...KSEESEEK...',
      '...KSSSSSSK...',
      '...KSSMMSSK...',
      '....KKKKKK....',
      '...RRRRRRRR...',
      '..RRRYYYYRRR..',
      '..RRRRRRRRRR..',
      '...RRRRRRRR...',
      '...RR....RR...',
      '..oo......oo..'
    ]
  },
  // 二郎神 — third eye on the forehead, green armour
  '台中': {
    pal: { K: '#1E3A2A', C: '#2F9E44', Y: '#F0C24B', S: '#F0C9A0', E: '#22222A', T: '#FFD23B' },
    grid: [
      '....KYYYK.....',
      '...KCCCCCK....',
      '...KSSTSSK....',
      '...KSEESEEK...',
      '...KSSSSSSK...',
      '...KKSSSSKK...',
      '....KKKKKK....',
      '...CCCCCCCC...',
      '..CCCYYYYCCC..',
      '..CCCCCCCCCC..',
      '...CCCCCCCC...',
      '...CC....CC...'
    ]
  },
  // 閻羅王 — tall black hat, long beard
  '台南': {
    pal: { D: '#2A2730', K: '#15131A', S: '#E8B58C', E: '#111111', W: '#EFE9DC', Y: '#C9A24B' },
    grid: [
      '..DDDDDDDDDD..',
      '..DDDDDDDDDD..',
      '...DDDDDDDD...',
      '...KSSSSSSK...',
      '...KSEESEEK...',
      '...KSSSSSSK...',
      '...KWWWWWWK...',
      '...WWWWWWWW...',
      '....WWWWWW....',
      '..DDDDDDDDDD..',
      '..DDDYYYYDDD..',
      '..DDDDDDDDDD..',
      '...DDDDDDDD...',
      '...DD....DD...'
    ]
  },
  // 太上老君 — sage with topknot, long white beard, purple robe, gourd
  '高雄': {
    pal: { W: '#EFE9DC', K: '#2A2230', S: '#F0C9A0', E: '#222222', P: '#7048E8', Y: '#E8C24B', g: '#3FA37A' },
    grid: [
      '.....WW.......',
      '....KWWK......',
      '...KSSSSSK....',
      '...KSEESEEK...',
      '...KSSSSSSK...',
      '...KWWWWWWK...',
      '...WWWWWWWW...',
      '...WWWWWWWW...',
      '....WWWWWW....',
      '..PPPWWWWPPP..',
      '..PPPPPPPPPP..',
      '..PPPPPPPPYg..',
      '...PPPPPPPP...',
      '...PP....PP...'
    ]
  },
  // 山神 — national-park guardian (green mountain crown + long white beard)
  '國家公園': {
    pal: { K: '#2A3A2E', M: '#4E7A4E', S: '#F0C9A0', E: '#22222A', W: '#EFE9DC' },
    grid: [
      '......KK......',
      '....KKMMKK....',
      '...KMMMMMMK...',
      '...KSSSSSSK...',
      '...KSEESEEK...',
      '...KSSSSSSK...',
      '...WWWWWWWW...',
      '...WWWWWWWW...',
      '....WWWWWW....',
      '..MMMMMMMMMM..',
      '..MMMMMMMMMM..',
      '...MMMMMMMM...',
      '...MM....MM...'
    ]
  },
  // 樹精 — national-forest guardian (leafy canopy head + bark trunk)
  '國家森林': {
    pal: { K: '#3A2A1E', G: '#2F9E44', b: '#6B4A2B', E: '#13371B' },
    grid: [
      '..GGGGGGGGGG..',
      '.GGGGGGGGGGGG.',
      '..GGEGGGGEGG..',
      '..GGGGGGGGGG..',
      '...bbbbbbbb...',
      '...bKbbbbKb...',
      '...bbbbbbbb...',
      '...bbbbbbbb...',
      '...bb....bb...'
    ]
  },
  // 台灣黑熊 — 玉山 (black bear, white chest V)
  '玉山': {
    pal: { B: '#2A2730', S: '#C9A07A', W: '#FFFFFF' },
    grid: [
      '..BB......BB..',
      '.BBBB....BBBB.',
      '..BBBBBBBBBB..',
      '.BBBBBBBBBBBB.',
      '.BBWBBBBBBWBB.',
      '.BBBBBBBBBBBB.',
      '.BBBBSSSSBBBB.',
      '..BBSSSSSSBB..',
      '...BBBBBBBB...',
      '..BBWWWWWWBB..',
      '..BBBWWWWBBB..',
      '..BBBBBBBBBB..',
      '...BB....BB...'
    ]
  },
  // 台灣獼猴 — 壽山 (brown macaque, pink face)
  '壽山': {
    pal: { B: '#8A6A44', S: '#E8B58C', E: '#2A2A2A', M: '#B23A36' },
    grid: [
      '..BBBBBBBBBB..',
      '.BBBBBBBBBBBB.',
      '.BBSSSSSSSSBB.',
      '.BBSEESSEESBB.',
      '.BBSSSSSSSSBB.',
      '.BBSSSMMSSSBB.',
      '..BBSSSSSSBB..',
      '...BBBBBBBB...',
      '..BBBBBBBBBB..',
      '..BBBBBBBBBB..',
      '...BBBBBBBB...',
      '...BB....BB...'
    ]
  },
  // 台灣藍鵲 — 陽明山 (blue bird, black head, red beak, long tail)
  '陽明山': {
    pal: { D: '#1B1B22', B: '#2456C6', R: '#E0524D', W: '#FFFFFF' },
    grid: [
      '....DDDD......',
      '...DDDDDD.....',
      '...DDWDDD.....',
      '...DDDDDDR....',
      '...DDDDDD.....',
      '..BBBBBBBB....',
      '.BBBBBBBBBB...',
      '.BBWWWWBBBB...',
      '.BBBBBBBBBBB..',
      '..BBBBBBBBBBB.',
      '...BBBBBBBBBBB',
      '....RR........'
    ]
  },
  // 黑面琵鷺 — 台江 (white body, black face + spoon bill)
  '台江': {
    pal: { W: '#FFFFFF', D: '#2A2730', e: '#F0C24B', y: '#E8A23B' },
    grid: [
      '....WWWW......',
      '...WWWWWW.....',
      '...DDeWWW.....',
      'DDDDDWWWW.....',
      '...DDWWWW.....',
      '...WWWWWWW....',
      '..WWWWWWWWW...',
      '.WWWWWWWWWWW..',
      '..WWWWWWWWWW..',
      '...WWWWWWWW...',
      '....yy..yy....'
    ]
  },
  // 櫻花鉤吻鮭 — 雪霸 (side-view fish with cherry band)
  '雪霸': {
    pal: { B: '#6E93A8', b: '#3E5E73', R: '#D96A7A', E: '#10202A' },
    grid: [
      '..............',
      '....BBBBBB....',
      '..BBBBBBBBBB..',
      '.EBBBBRRBBBBb.',
      '.BBBBBRRBBBBbb',
      '..BBBBBBBBBB..',
      '....BBBBBB....',
      '......bb......'
    ]
  }
}

// Generic fallback if a city has no bespoke sprite.
const GEN_FALLBACK = [
  '......KK......',
  '.....KCCK.....',
  '....KCCCCK....',
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

export function PixelWukong({ size = 140, idle = false, sleeping = false }: { size?: number; idle?: boolean; sleeping?: boolean }) {
  const grid = sleeping ? WK_SPRITE.map((r, i) => (i === 7 ? '.HKS--SS--SKH.' : r)) : WK_SPRITE
  const pal = sleeping ? { ...WK_PAL, '-': '#3A2A1E' } : WK_PAL
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
        {renderGrid(grid, pal)}

        {/* raised right arm (lowered a bit while sleeping) */}
        <g shapeRendering="crispEdges" fill="#F2C18A">
          {sleeping ? (
            <>
              <rect x={9.5 * U} y={12 * U} width={2 * U} height={2 * U} />
              <rect x={11 * U} y={12.5 * U} width={2 * U} height={2 * U} />
            </>
          ) : (
            <>
              <rect x={9.5 * U} y={11 * U} width={2 * U} height={2 * U} />
              <rect x={10.8 * U} y={9 * U} width={2 * U} height={2 * U} />
              <rect x={11.8 * U} y={7 * U} width={2 * U} height={2 * U} />
              <rect x={12 * U} y={5.2 * U} width={2.4 * U} height={2.4 * U} />
            </>
          )}
        </g>

        {/* 金箍棒 — waved by the hand (resting while sleeping) */}
        {sleeping ? (
          <g transform={`translate(${10 * U} ${13.5 * U}) rotate(8)`} shapeRendering="crispEdges">
            <rect x={-4 * U} y={-0.5 * U} width={8 * U} height={U} fill="#E8C24B" />
            <rect x={-4.3 * U} y={-0.9 * U} width={0.8 * U} height={1.8 * U} fill="#8B5A2B" />
            <rect x={3.5 * U} y={-0.9 * U} width={0.8 * U} height={1.8 * U} fill="#8B5A2B" />
          </g>
        ) : (
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
        )}
      </g>
    </svg>
  )
}

export function PixelGeneral({ meta, size = 140, idle = false, hit = false }: { meta: CityMeta; size?: number; idle?: boolean; hit?: boolean }) {
  const def = GENERALS[meta.short]
  return (
    <svg viewBox="-7 -7 112 112" width={size} style={{ display: 'block', imageRendering: 'pixelated' }} aria-hidden>
      <g style={hit ? { animation: 'rpgHitBig .5s ease' } : idle ? { animation: 'rpgFloat 3.2s ease-in-out infinite' } : undefined}>
        {def ? (
          renderGrid(def.grid, def.pal)
        ) : (
          <>
            <g shapeRendering="crispEdges">
              <rect x={0.4 * U} y={-2 * U} width={0.8 * U} height={15 * U} fill="#9AA0A6" />
            </g>
            {renderGrid(GEN_FALLBACK, { C: meta.general.color, K: '#2E2A33', S: '#F0C9A0', E: '#2A2A2A', D: '#6B6660' })}
          </>
        )}
      </g>
    </svg>
  )
}

export function PixelBattle({ meta, total, dropped, hit = false }: { meta: CityMeta; total: number; dropped: number; hit?: boolean }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 22px', borderRadius: 'var(--r-lg)', background: `linear-gradient(90deg, var(--brand-soft), ${meta.general.color}22)`, border: '1px solid var(--border)' }}>
      {hit && <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', animation: 'rpgFlash .5s ease', pointerEvents: 'none' }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <PixelWukong size={76} idle />
        <span style={{ fontWeight: 800 }}>孫悟空</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <SpecialtyIcon key={i} emoji={meta.specialty.emoji} size={24} dimmed={i < dropped} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-title)', color: 'var(--wrong)' }}>VS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <span style={{ fontWeight: 800 }}>{meta.general.name}</span>
        <div key={hit ? 'hit' : 'idle'} style={{ animation: hit ? 'rpgHitBig .5s ease' : undefined }}>
          <div style={{ transform: 'scaleX(-1)' }}>
            <PixelGeneral meta={meta} size={76} idle={!hit} />
          </div>
        </div>
        {hit && (
          <span style={{ position: 'absolute', right: 4, top: -10, fontSize: 48, animation: 'rpgPop .5s ease', pointerEvents: 'none' }}>💥</span>
        )}
      </div>
    </div>
  )
}
