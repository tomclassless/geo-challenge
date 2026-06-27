/**
 * Original pixel-art backdrop: 孫悟空 riding his golden somersault cloud (筋斗雲)
 * across a pixel sky. Fully hand-drawn from a pixel grid (no copyrighted art),
 * animated with SMIL — the hero bobs and background clouds drift. Purely
 * decorative (pointer-events: none); sits behind the teacher-page content.
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

      {/* sky */}
      <rect width="320" height="200" fill="url(#wsky)" />

      {/* pixel sun */}
      <g shapeRendering="crispEdges">
        <rect x="280" y="16" width="24" height="24" fill="#FBD24B" />
        <rect x="276" y="22" width="32" height="12" fill="#FBD24B" />
        <rect x="284" y="20" width="16" height="16" fill="#FFE99B" />
      </g>

      {/* drifting background clouds */}
      <g opacity="0.85">
        <PxCloud scale={0.8} color="#FFFFFF" />
        <animateTransform attributeName="transform" type="translate" values="340 26; -120 26" dur="24s" repeatCount="indefinite" />
      </g>
      <g opacity="0.7">
        <PxCloud scale={1.1} color="#FFFFFF" />
        <animateTransform attributeName="transform" type="translate" values="360 150; -160 150" dur="32s" repeatCount="indefinite" />
      </g>
      <g opacity="0.6">
        <PxCloud scale={0.6} color="#FFFFFF" />
        <animateTransform attributeName="transform" type="translate" values="320 86; -100 86" dur="19s" repeatCount="indefinite" />
      </g>

      {/* hero: 孫悟空 on the golden somersault cloud */}
      <g transform="translate(98 34)">
        <g>
          {/* bob up & down */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -6; 0 0"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            dur="3.2s"
            repeatCount="indefinite"
          />

          {/* golden cloud (筋斗雲) */}
          <g shapeRendering="crispEdges">
            <rect x={-3 * U} y={14 * U} width={21 * U} height={3 * U} fill="#F4DC82" />
            <rect x={-2 * U} y={13 * U} width={5 * U} height={U} fill="#F4DC82" />
            <rect x={6 * U} y={12 * U} width={5 * U} height={2 * U} fill="#F4DC82" />
            <rect x={12 * U} y={13 * U} width={5 * U} height={U} fill="#F4DC82" />
            <rect x={-3 * U} y={14 * U} width={21 * U} height={U} fill="#FFF3C4" />
            <rect x={-3 * U} y={17 * U} width={21 * U} height={U} fill="#E6C766" />
          </g>

          {/* staff 金箍棒 */}
          <g transform={`translate(${7 * U} ${10.5 * U}) rotate(-38)`} shapeRendering="crispEdges">
            <rect x={-1.4 * U} y={-0.4 * U} width={6.5 * U} height={0.8 * U} fill="#E8C24B" />
            <rect x={-1.6 * U} y={-0.6 * U} width={0.6 * U} height={1.2 * U} fill="#8B5A2B" />
            <rect x={4.5 * U} y={-0.6 * U} width={0.6 * U} height={1.2 * U} fill="#8B5A2B" />
          </g>

          <SpritePixels />
        </g>
      </g>
    </svg>
  )
}
