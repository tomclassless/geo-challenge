import { useState } from 'react'
import { ChevronLeft, Save, Users } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { Button, Badge } from '../ds'

/** 參與者名單輸入頁 — teacher types one name per line; saved locally. */
export function RosterScreen() {
  const { roster, players, setRoster, goTeacher } = useGame()
  const [text, setText] = useState(roster.join('\n'))

  const names = text.split('\n').map((n) => n.trim()).filter(Boolean)

  const save = async () => {
    await setRoster(names)
    goTeacher()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Button variant="ghost" iconLeft={<ChevronLeft size={20} />} onClick={goTeacher}>返回</Button>
        <span style={{ fontWeight: 900, fontSize: 'var(--fs-title)' }}>參與者名單</span>
        <Badge tone="brand" soft style={{ marginLeft: 'auto' }}>{names.length} 人</Badge>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, padding: 28, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
            一行一個名字（建議 20 人以上，這樣才湊得滿 60 個特產通關）
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'小明\n小華\n阿志\n…'}
            style={{
              flex: 1, resize: 'none', fontSize: 'var(--fs-body)', lineHeight: 1.7,
              padding: 16, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-md)',
              fontFamily: 'var(--font-sans)', minHeight: 0
            }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" size="lg" iconLeft={<Save size={20} />} onClick={() => void save()} disabled={!names.length}>
              儲存名單
            </Button>
            {players.length > 0 && (
              <Button variant="ghost" size="lg" iconLeft={<Users size={20} />} onClick={() => setText(players.join('\n'))}>
                帶入雲端名單（{players.length} 人）
              </Button>
            )}
          </div>
        </div>

        <div style={{ overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--surface)', padding: 16 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginBottom: 10 }}>預覽</div>
          {names.length === 0 ? (
            <div style={{ color: 'var(--text-subtle)' }}>尚未輸入名字。</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {names.map((n, i) => (
                <span key={i} style={{ padding: '6px 14px', borderRadius: 'var(--r-pill)', background: 'var(--brand-soft)', color: 'var(--brand-strong)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
