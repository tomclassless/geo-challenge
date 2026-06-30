import { Home } from 'lucide-react'
import { useGame, selectPlayableCities } from '../state/gameStore'
import { Button, Badge, PixelWukong } from '../ds'

const CONFETTI = ['🎉', '🎊', '✨', '⭐', '🏵️', '🎉', '🎊', '✨', '⭐', '🎉', '🎊', '✨', '⭐', '🎉']

/** Grand ending — every theme (六都＋國家公園…) is cleared. */
export function GameWonScreen() {
  const { goTeacher } = useGame()
  const themes = useGame(selectPlayableCities)

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40, textAlign: 'center', background: 'linear-gradient(160deg, var(--accent-soft), var(--brand-soft))' }}>
      {/* confetti */}
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            top: -30,
            left: `${(i * 7 + 4) % 100}%`,
            fontSize: 22 + (i % 3) * 8,
            animation: `confettiFall ${3 + (i % 4) * 0.7}s linear ${(i % 5) * 0.4}s infinite`,
            pointerEvents: 'none'
          }}
        >
          {c}
        </span>
      ))}

      <Badge tone="accent">🏆 全主題通關！</Badge>

      <div style={{ position: 'relative', animation: 'rpgFloat 3s ease-in-out infinite' }}>
        <PixelWukong size={180} />
      </div>

      <h1 style={{ margin: 0, fontWeight: 900, fontSize: 36, maxWidth: 820, lineHeight: 1.25, zIndex: 1 }}>
        孫悟空打敗了六都與國家公園的所有天兵，<br />徹底翻出了如來佛祖的掌心！
      </h1>

      {/* defeated guardians */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 760, zIndex: 1 }}>
        {themes.map((t) => (
          <span key={t.region} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 'var(--fs-sm)', fontWeight: 700 }}>
            <span style={{ opacity: 0.5, filter: 'grayscale(1)' }}>{t.general.emoji}</span>
            {t.general.name} <span style={{ color: 'var(--correct)' }}>✓</span>
          </span>
        ))}
      </div>

      <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 'var(--fs-title)', zIndex: 1 }}>
        恭喜全班完成台灣地理大冒險 🎉
      </p>

      <Button variant="primary" size="xl" iconLeft={<Home size={24} />} onClick={goTeacher} style={{ zIndex: 1 }}>
        回到老師頁
      </Button>
    </div>
  )
}
