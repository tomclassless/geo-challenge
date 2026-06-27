import { useState } from 'react'
import { useGame } from '../state/gameStore'
import { Badge, NameCard, Button, Logo } from '../ds'
import { PinInput } from '../ds/report/PinInput'
import { Modal } from '../ds/shell/Modal'

export function NameEntryScreen() {
  const { players, regions, region, config, beginPlayer, goReport, goHome } = useGame()
  const [selected, setSelected] = useState<string | null>(null)
  const [manual, setManual] = useState('')
  const [pinHome, setPinHome] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const current = regions.find((r) => r.name === region)

  const pick = (name: string) => {
    setSelected(name)
    setTimeout(() => beginPlayer(name), 240)
  }

  const tryHome = () => {
    if (!config.teacherPin) return goHome()
    setPin('')
    setPinError(false)
    setPinHome(true)
  }

  const completeHome = (v: string) => {
    if (v === config.teacherPin) goHome()
    else { setPinError(true); setTimeout(() => { setPin(''); setPinError(false) }, 600) }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--brand)' }}>
      {/* hero band */}
      <div style={{ padding: '30px 40px 24px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo light />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {current && <Badge tone="accent">{current.name} · {current.questions.length} 題</Badge>}
            <button onClick={goReport} style={heroLink}>結束本局 · 看報表</button>
            <button onClick={tryHome} style={heroLink}>回首頁</button>
          </div>
        </div>
        <h1 style={{ margin: '16px 0 0', fontWeight: 900, fontSize: 46, lineHeight: 1.1 }}>
          請把平板交給下一位 👋
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-title)', color: 'var(--teal-100)' }}>
          點選你的名字，就可以開始作答。
        </p>
      </div>

      {/* roster sheet */}
      <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0', padding: '26px 36px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>本班名單（{players.length} 人）</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>找不到名字？請老師確認同步名單</span>
        </div>

        {players.length > 0 ? (
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignContent: 'start' }}>
            {players.map((name) => (
              <NameCard key={name} name={name} selected={selected === name} onClick={() => pick(name)} />
            ))}
          </div>
        ) : (
          <p style={{ flex: 1, color: 'var(--text-muted)' }}>
            名單還沒同步。可在 Google 試算表的 Players 分頁建立，或在下方輸入名字。
          </p>
        )}

        {/* manual entry fallback */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            placeholder="或輸入名字"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && manual.trim() && beginPlayer(manual.trim())}
            style={{ flex: 1, fontSize: 'var(--fs-body)', padding: 14, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-md)', fontFamily: 'var(--font-sans)' }}
          />
          <Button variant="primary" size="lg" disabled={!manual.trim()} onClick={() => beginPlayer(manual.trim())}>
            開始我的回合
          </Button>
        </div>
      </div>

      {pinHome && (
        <Modal onClose={() => setPinHome(false)} width={360}>
          <h2 style={{ margin: 0, textAlign: 'center', fontWeight: 900, fontSize: 'var(--fs-h3)' }}>老師 PIN</h2>
          <PinInput value={pin} error={pinError} onChange={setPin} onComplete={completeHome} />
          <Button variant="ghost" onClick={() => setPinHome(false)} style={{ alignSelf: 'center' }}>取消</Button>
        </Modal>
      )}
    </div>
  )
}

const heroLink: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--teal-100)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'var(--fs-sm)',
  cursor: 'pointer',
  padding: '6px 4px',
}
