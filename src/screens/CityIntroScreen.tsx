import { ChevronLeft, Sword } from 'lucide-react'
import { useGame, selectActiveCity } from '../state/gameStore'
import { Button, Badge, GeneralSprite, WukongMeter } from '../ds'
import { WUKONG_EMOJI } from '../lib/cities'

/** Story card shown when entering (or re-entering) a city before a round. */
export function CityIntroScreen() {
  const { beginRound, goTeacher } = useGame()
  const active = useGame(selectActiveCity)
  if (!active) return null
  const { meta, collected, target, round } = active

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 40, textAlign: 'center', background: `linear-gradient(160deg, ${meta.general.color}22, var(--bg))` }}>
      <button onClick={goTeacher} style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)' }}>
        <ChevronLeft size={18} /> 回老師頁
      </button>

      <Badge tone="brand" soft>第 {round} 局 · {WUKONG_EMOJI} 孫悟空 vs {meta.general.name}</Badge>

      <GeneralSprite meta={meta} size={170} />

      <h1 style={{ margin: 0, fontWeight: 900, fontSize: 34, maxWidth: 760, lineHeight: 1.3 }}>{meta.intro}</h1>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--fs-title)' }}>
        答對 {meta.region} 的地理題，打下天兵身上的 {meta.specialty.emoji}{meta.specialty.name}！
      </p>

      <div style={{ width: 360 }}>
        <WukongMeter collected={collected} target={target} specialtyEmoji={meta.specialty.emoji} />
      </div>

      <Button variant="primary" size="xl" iconLeft={<Sword size={24} />} onClick={beginRound}>
        開始這一局
      </Button>
    </div>
  )
}
