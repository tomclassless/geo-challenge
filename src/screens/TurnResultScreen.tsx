import { ArrowRight } from 'lucide-react'
import { useGame, selectActiveCity } from '../state/gameStore'
import { Badge, StarRating, Button, WukongMeter, SpecialtyIcon } from '../ds'

/** Per-player turn summary: how many specialties they knocked loose. */
export function TurnResultScreen() {
  const { lastResult, turnQueue, continueAfterTurn } = useGame()
  const active = useGame(selectActiveCity)
  if (!lastResult || !active) return null
  const { player, correct, total } = lastResult
  const { meta, collected, target } = active

  const ratio = total ? correct / total : 0
  const stars = Math.max(1, Math.round(ratio * 5))
  const praise = ratio >= 0.8 ? '太厲害了！' : ratio >= 0.4 ? '做得很好！' : '繼續加油，你可以的！'
  const lastOne = turnQueue.length === 0

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: 'var(--bg)', padding: 40, textAlign: 'center' }}>
      <Badge tone="brand" soft>{player} 的回合</Badge>

      <StarRating value={stars} max={5} size="lg" animate />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SpecialtyIcon emoji={meta.specialty.emoji} size={56} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 96, lineHeight: 1, color: 'var(--accent-strong)' }}>{correct}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, color: 'var(--text-subtle)' }}>/ {total}</span>
        </div>
      </div>
      <div style={{ fontWeight: 900, fontSize: 'var(--fs-h2)' }}>{praise}</div>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>打下了 {correct} 個 {meta.specialty.name}！</p>

      <div style={{ width: 360 }}>
        <WukongMeter collected={collected} target={target} specialtyEmoji={meta.specialty.emoji} />
      </div>

      <Button variant="accent" size="xl" iconRight={<ArrowRight size={26} />} onClick={continueAfterTurn}>
        {lastOne ? '本局結束' : '換下一位'}
      </Button>
    </div>
  )
}
