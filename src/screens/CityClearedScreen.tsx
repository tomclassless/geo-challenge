import { Home } from 'lucide-react'
import { useGame, selectActiveCity } from '../state/gameStore'
import { Button, Badge } from '../ds'
import { WUKONG_EMOJI } from '../lib/cities'

/** Single-city victory — Wukong collected enough specialties to escape this 天兵. */
export function CityClearedScreen() {
  const { finishCity } = useGame()
  const active = useGame(selectActiveCity)
  if (!active) return null
  const { meta, target } = active

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40, textAlign: 'center', background: `linear-gradient(160deg, ${meta.general.color}33, var(--bg))` }}>
      <Badge tone="accent">{meta.region} 通關！</Badge>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 76, animation: 'rpgPop .5s ease' }}>
        <span>{WUKONG_EMOJI}</span>
        <span style={{ fontSize: 40 }}>💨</span>
        <span style={{ opacity: 0.45, filter: 'grayscale(1)' }}>{meta.general.emoji}</span>
      </div>

      <h1 style={{ margin: 0, fontWeight: 900, fontSize: 34, maxWidth: 720, lineHeight: 1.3 }}>
        孫悟空蒐集滿 {target} 個 {meta.specialty.emoji}{meta.specialty.name}，掙脫了 {meta.general.name}，逃出 {meta.region}！
      </h1>

      <Button variant="primary" size="xl" iconLeft={<Home size={26} />} onClick={finishCity}>
        完成，回老師頁
      </Button>
    </div>
  )
}
