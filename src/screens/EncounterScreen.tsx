import { Sword } from 'lucide-react'
import { useGame, selectActiveCity } from '../state/gameStore'
import { Button, Badge, GeneralSprite, SpecialtyIcon, WukongMeter } from '../ds'

/** A 天兵 appears bearing the current player's name, its specialties, and an
 *  attack button. Tapping 攻擊 reveals the first question. */
export function EncounterScreen() {
  const { currentPlayer, turnQuestions, attack } = useGame()
  const active = useGame(selectActiveCity)
  if (!active) return null
  const { meta, collected, target } = active
  const carried = turnQuestions.length // specialties this soldier carries this turn

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40, textAlign: 'center', background: `linear-gradient(160deg, ${meta.general.color}26, var(--bg))` }}>
      <div style={{ position: 'absolute', top: 18, right: 24 }}>
        <WukongMeter collected={collected} target={target} specialtyEmoji={meta.specialty.emoji} compact />
      </div>

      <Badge tone="accent">{meta.general.name} 出現了！</Badge>

      <div style={{ animation: 'rpgEnter .6s ease' }}>
        <GeneralSprite meta={meta} playerName={currentPlayer} size={170} />
      </div>

      {/* specialties on the soldier's body */}
      <div style={{ display: 'flex', gap: 12 }}>
        {Array.from({ length: carried }).map((_, i) => (
          <SpecialtyIcon key={i} emoji={meta.specialty.emoji} size={46} />
        ))}
      </div>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--fs-body)' }}>
        身上帶著 {carried} 個 {meta.specialty.name}，答對就能打下來！
      </p>

      <Button variant="primary" size="xl" iconLeft={<Sword size={24} />} onClick={attack}>
        ⚔️ 攻擊（開始答題）
      </Button>
    </div>
  )
}
