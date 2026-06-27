/**
 * Original pixel-art backdrop for the teacher page:
 *  - a soft pixel sky with drifting clouds (fills the page, behind the UI)
 *  - 孫悟空 on his golden somersault cloud (筋斗雲) as a small, crisp mascot that
 *    zig-zags around the page (亂飛) and waves his 金箍棒.
 * Fully hand-drawn from a pixel grid (no copyrighted art). Decorative only
 * (pointer-events: none).
 */

const U = 7 // pixel size

// 15×15 sprite grid. '.' = transparent.
const SPRITE = [
  '...P.......P...',
  '...PP.....PP...',
  '...PP.....PP...',
  '....PP...PP....',
  '....RRRRRRR....',
  '...GGGGGGGGG...',
  '..KSSSSSSSSSK..',
  '..KSSEESEESSK..',
  '..KSSSSSSSSSK..',
  '..KSSSMMMSSSK..',
  '...KSSSSSSSK...',
  '....KKKKKKK....',
  '...AYYYYYYYA...',
  '..AAYYYYYYYAA..',
  '...YYYYYYYYY...'
]

const PAL: Record<string, string> = {
  P: '#E8893B', // 雉雞翎 feathers
  R: '#E0524D', // red headband
  G: '#F7C948', // gold circlet
  K: '#3A2A1E', // outline
  S: '#F2C18A', // skin
  E: '#2A2A2A', // eyes
  M: '#B23A36', // mouth
  A: '#C23B37', // cape
  Y: '#F7C948' // golden armour
}

function SpritePixels() {
  return (
    <g shapeRendering="crispEdges">
      {SPRITE.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const c = PAL[ch]
          return c ? <rect key={`${x}-${y}`} x={x * U} y={y * U} width={U} height={U} fill={c} /> : null
        })
      )}
    </g>
  )
}

function PxCloud({ scale = 1, color = '#FFFFFF' }: { scale?: number; color?: string }) {
  const s = 8 * scale
  return (
    <g shapeRendering="crispEdges" fill={color}>
      <rect x={2 * s} y={0} width={3 * s} height={s} />
      <rect x={s} y={s} width={5 * s} height={s} />
      <rect x={0} y={2 * s} width={7 * s} height={s} />
    </g>
  )
}

export function WukongCloudBackdrop() {
  return (
    <>
      {/* sky + drifting clouds — fills the page, behind everything */}
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BFE6F7" />
            <stop offset="100%" stopColor="#EAF6FD" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#wsky)" />
        <g shapeRendering="crispEdges">
          <rect x="282" y="16" width="22" height="22" fill="#FBD24B" />
          <rect x="278" y="21" width="30" height="12" fill="#FBD24B" />
          <rect x="286" y="20" width="14" height="14" fill="#FFE99B" />
        </g>
        <g opacity="0.85"><PxCloud scale={0.8} />
          <animateTransform attributeName="transform" type="translate" values="340 26; -120 26" dur="24s" repeatCount="indefinite" />
        </g>
        <g opacity="0.7"><PxCloud scale={1.1} />
          <animateTransform attributeName="transform" type="translate" values="360 150; -160 150" dur="32s" repeatCount="indefinite" />
        </g>
        <g opacity="0.6"><PxCloud scale={0.6} />
          <animateTransform attributeName="transform" type="translate" values="320 92; -100 92" dur="19s" repeatCount="indefinite" />
        </g>
      </svg>

      {/* the flying 孫悟空 mascot — small & crisp, zig-zags around the page */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          zIndex: 2,
          width: 132,
          pointerEvents: 'none',
          animation: 'wkFly 18s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 6px rgba(60,60,90,0.22))'
        }}
      >
        <svg
          viewBox="-21 -8 147 156"
          width="132"
          style={{ display: 'block', imageRendering: 'pixelated' }}
        >
          {/* golden somersault cloud (筋斗雲) */}
          <g shapeRendering="crispEdges">
            <rect x={-3 * U} y={14 * U} width={21 * U} height={3 * U} fill="#F4DC82" />
            <rect x={-2 * U} y={13 * U} width={5 * U} height={U} fill="#F4DC82" />
            <rect x={6 * U} y={12 * U} width={5 * U} height={2 * U} fill="#F4DC82" />
            <rect x={12 * U} y={13 * U} width={5 * U} height={U} fill="#F4DC82" />
            <rect x={-3 * U} y={14 * U} width={21 * U} height={U} fill="#FFF3C4" />
            <rect x={-3 * U} y={17 * U} width={21 * U} height={U} fill="#E6C766" />
          </g>

          <SpritePixels />

          {/* staff 金箍棒 — waves up and down */}
          <g transform={`translate(${10 * U} ${10 * U})`}>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-55;-8;-55"
                keyTimes="0;0.5;1"
                calcMode="spline"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                dur="1.2s"
                repeatCount="indefinite"
              />
              <g shapeRendering="crispEdges">
                <rect x={-0.5 * U} y={-0.5 * U} width={7 * U} height={U} fill="#E8C24B" />
                <rect x={-0.7 * U} y={-0.8 * U} width={0.7 * U} height={1.6 * U} fill="#8B5A2B" />
                <rect x={5.8 * U} y={-0.8 * U} width={0.7 * U} height={1.6 * U} fill="#8B5A2B" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </>
  )
}
