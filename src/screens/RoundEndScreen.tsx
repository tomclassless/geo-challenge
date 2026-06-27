import { Home, Save } from 'lucide-react'
import { useGame, selectActiveCity } from '../state/gameStore'
import { Button, Badge, WukongMeter } from '../ds'

/** Shown after every round; the game auto-saved. Returns to the teacher page. */
export function RoundEndScreen() {
  const { goTeacher } = useGame()
  const active = useGame(selectActiveCity)
  if (!active) return null
  const { meta, collected, target, round } = active
  const justPlayed = Math.max(1, round - 1)
  const need = Math.max(0, target - collected)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, background: 'var(--bg)', padding: 40, textAlign: 'center' }}>
      <Badge tone="brand" soft>{meta.region} · 第 {justPlayed} 局結束</Badge>
      <div style={{ fontSize: 72 }}>{meta.general.emoji}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--correct)', fontWeight: 700 }}>
        <Save size={20} /> 本局已自動存檔
      </div>

      <div style={{ width: 380 }}>
        <WukongMeter collected={collected} target={target} specialtyEmoji={meta.specialty.emoji} />
      </div>

      <p style={{ margin: 0, fontSize: 'var(--fs-title)', color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.5 }}>
        還差 <b style={{ color: 'var(--text)' }}>{need}</b> 個 {meta.specialty.name} 就能逃離 {meta.general.name}！
        下一局只會重考大家答錯的題目，答對才會再掉特產。
      </p>

      <Button variant="primary" size="xl" iconLeft={<Home size={24} />} onClick={goTeacher}>
        回到老師頁
      </Button>
    </div>
  )
}
