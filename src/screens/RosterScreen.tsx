import { useState } from 'react'
import { ChevronLeft, Save, Users, CloudUpload } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { Button, Badge } from '../ds'

/** 參與者名單輸入頁 — teacher types one name per line; saved locally and
 *  optionally written back to the cloud so every device shares it. */
export function RosterScreen() {
  const { roster, players, online, setRoster, saveRosterCloud, goTeacher } = useGame()
  const [text, setText] = useState(roster.join('\n'))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const names = text.split('\n').map((n) => n.trim()).filter(Boolean)

  const save = async () => {
    await setRoster(names)
    goTeacher()
  }

  const saveCloud = async () => {
    setBusy(true)
    setMessage('')
    const res = await saveRosterCloud(names)
    setBusy(false)
    if (res.ok) {
      setMessage('已更新雲端名單 ✓ 其他裝置同步後即可看到')
      setTimeout(goTeacher, 900)
    } else {
      setMessage('更新雲端失敗：' + (res.error ?? ''))
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* header — save actions live here so the keyboard never hides them */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <Button variant="ghost" iconLeft={<ChevronLeft size={20} />} onClick={goTeacher}>返回</Button>
        <span style={{ fontWeight: 900, fontSize: 'var(--fs-title)' }}>參與者名單</span>
        <Badge tone="brand" soft>{names.length} 人</Badge>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="primary" iconLeft={<Save size={20} />} onClick={() => void save()} disabled={!names.length || busy}>
            儲存（這台）
          </Button>
          <Button variant="accent" iconLeft={<CloudUpload size={20} />} onClick={() => void saveCloud()} disabled={!names.length || busy || !online}>
            {busy ? '更新中…' : '儲存並更新雲端'}
          </Button>
        </div>
      </div>

      {message && (
        <div style={{ padding: '8px 24px', background: 'var(--brand-soft)', color: 'var(--brand-strong)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{message}</div>
      )}

      {/* scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
            一行一個名字（建議 20 人以上）。「儲存並更新雲端」會讓所有裝置共用這份名單。
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'小明\n小華\n阿志\n…'}
            style={{
              minHeight: 300, resize: 'vertical', fontSize: 'var(--fs-body)', lineHeight: 1.7,
              padding: 16, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-md)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {players.length > 0 && (
              <Button variant="ghost" iconLeft={<Users size={20} />} onClick={() => setText(players.join('\n'))}>
                帶入雲端名單（{players.length} 人）
              </Button>
            )}
          </div>
          {!online && <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--text-subtle)' }}>（離線中，無法更新雲端；可先存這台）</p>}
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--surface)', padding: 16, minHeight: 0 }}>
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
