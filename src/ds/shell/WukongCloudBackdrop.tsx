import { PixelWukong } from '../game/PixelSprites'

/**
 * Teacher-page backdrop: a soft pixel sky with drifting clouds, plus 孫悟空 on his
 * 筋斗雲 zig-zagging around the page (亂飛). Decorative only (pointer-events: none).
 */

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

      {/* the flying 孫悟空 mascot — zig-zags around the page */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          zIndex: 2,
          pointerEvents: 'none',
          animation: 'wkFly 18s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 6px rgba(60,60,90,0.22))'
        }}
      >
        <PixelWukong size={132} />
      </div>
    </>
  )
}
