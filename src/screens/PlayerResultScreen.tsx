import { ArrowRight, BarChart3 } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { Badge, StarRating, Button } from '../ds'

export function PlayerResultScreen() {
  const { lastResult, backToName } = useGame()
  if (!lastResult) return null
  const { player, correct, total, progressDiff } = lastResult

  const ratio = total ? correct / total : 0
  const stars = Math.max(1, Math.round(ratio * 5))
  const praise = ratio >= 0.8 ? '太厲害了！' : ratio >= 0.5 ? '做得很好！' : '繼續加油，你可以的！'

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, background: 'var(--bg)', padding: 40, textAlign: 'center' }}>
      <Badge tone="brand" soft>{player} 的成績</Badge>

      <StarRating value={stars} max={5} size="lg" animate />

      <div>
        <div style={{ fontWeight: 700, fontSize: 'var(--fs-h3)', color: 'var(--text-muted)', marginBottom: 6 }}>你答對了</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 110, lineHeight: 1, color: 'var(--brand-strong)' }}>
            {correct}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, color: 'var(--text-subtle)' }}>
            / {total}
          </span>
        </div>
        <div style={{ fontWeight: 900, fontSize: 'var(--fs-h2)', marginTop: 8 }}>{praise}</div>
      </div>

      {progressDiff != null && progressDiff > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 'var(--r-pill)', background: 'var(--correct-bg)', border: '1px solid var(--correct-line)' }}>
          <BarChart3 size={22} style={{ color: 'var(--correct)' }} />
          <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)', color: 'var(--green-700)' }}>
            你比上一局多對 {progressDiff} 題 🎉
          </span>
        </div>
      )}

      <Button variant="accent" size="xl" iconRight={<ArrowRight size={26} />} onClick={backToName} style={{ marginTop: 8 }}>
        換下一位
      </Button>
      <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-sm)', maxWidth: 420, lineHeight: 1.5 }}>
        想知道哪幾題要再加強嗎？老師會在報表裡幫大家一起看，這裡先給你大大的鼓勵！
      </p>
    </div>
  )
}
