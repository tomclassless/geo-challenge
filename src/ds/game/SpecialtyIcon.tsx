/** A single specialty token (e.g. 🍑 壽桃) — used on the soldier's body, in the
 *  Wukong meter, and for the drop animation. */
export function SpecialtyIcon({
  emoji,
  size = 40,
  dimmed = false,
  flying = false
}: {
  emoji: string
  size?: number
  /** already collected this turn — show as faded/empty slot */
  dimmed?: boolean
  /** play the fly-to-Wukong animation */
  flying?: boolean
}) {
  return (
    <span
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: size,
        height: size,
        fontSize: Math.round(size * 0.62),
        lineHeight: 1,
        borderRadius: '50%',
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        opacity: dimmed ? 0.25 : 1,
        filter: dimmed ? 'grayscale(1)' : 'none',
        animation: flying ? 'rpgDropFly .9s ease forwards' : undefined,
        transition: 'opacity .3s ease'
      }}
    >
      {emoji}
    </span>
  )
}
