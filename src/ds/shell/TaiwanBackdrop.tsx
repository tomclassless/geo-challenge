/**
 * Original, copyright-free decorative backdrop in the soft "travel poster" style:
 * a pink sky with clouds + sky lanterns and a stylised white Taiwan silhouette
 * with the six playable cities marked. Purely decorative (pointer-events: none),
 * sits behind the teacher-page content.
 */
export function TaiwanBackdrop() {
  return (
    <svg
      viewBox="0 0 1100 780"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCE6EF" />
          <stop offset="100%" stopColor="#F6D6E4" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#C98BA8" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* sky */}
      <rect width="1100" height="780" fill="url(#sky)" />

      {/* clouds */}
      <g fill="#FFFFFF" opacity="0.55">
        <ellipse cx="170" cy="120" rx="60" ry="20" />
        <ellipse cx="210" cy="130" rx="40" ry="16" />
        <ellipse cx="930" cy="180" rx="70" ry="22" />
        <ellipse cx="980" cy="190" rx="44" ry="16" />
        <ellipse cx="120" cy="520" rx="55" ry="18" />
        <ellipse cx="1000" cy="560" rx="60" ry="20" />
      </g>

      {/* warm sun */}
      <circle cx="1010" cy="90" r="34" fill="#F6A06A" opacity="0.55" />

      {/* sky lanterns (echoing Pingxi) */}
      <g opacity="0.5">
        <Lantern x={905} y={300} />
        <Lantern x={960} y={360} />
        <Lantern x={150} y={300} />
      </g>

      {/* stylised Taiwan island, centred */}
      <g transform="translate(360 70)" filter="url(#soft)">
        <path
          d="M250,10
             C300,26 322,88 332,150
             C347,232 362,302 351,372
             C341,444 300,524 232,604
             C216,620 194,615 189,594
             C178,522 150,470 140,400
             C124,320 120,232 150,150
             C170,88 200,30 250,10 Z"
          fill="#FFFFFF"
          opacity="0.82"
        />
        {/* eastern mountain ridge */}
        <g fill="#9B6B86" opacity="0.35">
          <path d="M300,150 l34,52 -68,0 Z" />
          <path d="M322,210 l40,60 -80,0 Z" />
          <path d="M318,286 l34,52 -68,0 Z" />
        </g>

        {/* six city markers (north → south) */}
        <City x={244} y={120} color="#1C7ED6" label="桃園" />
        <City x={276} y={92}  color="#B8860B" label="台北" />
        <City x={300} y={150} color="#E8590C" label="新北" />
        <City x={232} y={300} color="#2F9E44" label="台中" />
        <City x={224} y={430} color="#495057" label="台南" />
        <City x={236} y={520} color="#7048E8" label="高雄" />
      </g>
    </svg>
  )
}

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0,0 h26 v22 q-13,12 -26,0 Z" fill="#E8B98C" />
      <rect x="6" y="-5" width="14" height="6" rx="2" fill="#C98F63" />
      <line x1="13" y1="34" x2="13" y2="42" stroke="#E8B98C" strokeWidth="1.5" />
    </g>
  )
}

function City({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" fill={color} opacity="0.9" />
      <circle r="3" fill="#FFFFFF" />
      <text x="11" y="4" fontSize="13" fontWeight="700" fill="#5A4A55" opacity="0.8">{label}</text>
    </g>
  )
}
