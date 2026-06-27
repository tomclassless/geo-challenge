import { Home } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { Button, Badge } from '../ds'
import { WUKONG_EMOJI } from '../lib/cities'

/** Ending — Wukong has escaped the Buddha's palm. */
export function GameWonScreen() {
  const { goTeacher } = useGame()
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 40, textAlign: 'center', background: 'linear-gradient(160deg, var(--accent-soft), var(--brand-soft))' }}>
      <Badge tone="accent">全破關！</Badge>
      <div style={{ fontSize: 96, animation: 'rpgFloat 3s ease-in-out infinite' }}>{WUKONG_EMOJI}☁️</div>
      <h1 style={{ margin: 0, fontWeight: 900, fontSize: 40, maxWidth: 760, lineHeight: 1.25 }}>
        孫悟空吃遍六都特產，終於翻出了如來佛祖的掌心！
      </h1>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--fs-title)' }}>
        恭喜全班完成台灣地理大冒險 🎉
      </p>
      <Button variant="primary" size="xl" iconLeft={<Home size={24} />} onClick={goTeacher}>
        回到老師頁
      </Button>
    </div>
  )
}
