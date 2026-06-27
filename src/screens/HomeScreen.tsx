import { useState } from 'react'
import { BarChart3, Settings, MapPin, Wifi, Clock, Upload, RefreshCw, ArrowRight } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { getApiUrl, setApiUrl } from '../lib/config'
import { Button, IconButton, Card, Badge, Stat, Logo } from '../ds'
import { Modal } from '../ds/shell/Modal'

export function HomeScreen() {
  const {
    regions, region, lastSync, pending, online, syncing,
    startRound, sync, goReport, loadSample
  } = useGame()

  const [selected, setSelected] = useState(region ?? regions[0]?.name ?? '')
  const [showSettings, setShowSettings] = useState(false)
  const [message, setMessage] = useState('')

  const region0 = selected || regions[0]?.name || ''
  const current = regions.find((r) => r.name === region0)

  const doSync = async () => {
    setMessage('')
    const res = await sync()
    setMessage(res.ok ? '同步完成 ✓' : '同步失敗：' + (res.error ?? ''))
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* top bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 36px', borderBottom: '1px solid var(--border)', background: 'var(--surface)',
        }}
      >
        <Logo />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="ghost" iconLeft={<BarChart3 size={20} />} onClick={goReport}>老師報表</Button>
          <IconButton variant="soft" icon={<Settings size={22} />} label="設定" onClick={() => setShowSettings(true)} />
        </div>
      </div>

      {regions.length === 0 ? (
        /* empty state — no banks yet */
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 36 }}>
          <Card tone="plain" pad="lg" style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>還沒有題庫</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              請先設定後端網址，再按「立即同步」把題庫下載到平板；或先載入範例題庫試玩。
            </p>
            <Button variant="primary" size="lg" block onClick={() => setShowSettings(true)}>設定後端網址</Button>
            <Button variant="secondary" size="lg" block onClick={() => void loadSample()}>🧪 先載入範例題庫試玩</Button>
          </Card>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28, padding: 36, overflow: 'hidden' }}>
          {/* left: this week */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-wide)', color: 'var(--text-muted)' }}>本週主題</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                <MapPin size={40} style={{ color: 'var(--brand)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: 52, lineHeight: 1, color: 'var(--text)' }}>
                  {region0 || '—'}
                </span>
                {current && <Badge tone="brand" soft>{current.questions.length} 題</Badge>}
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>選擇地區（題庫來自已同步資料）</span>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                {regions.map((r) => {
                  const active = r.name === region0
                  return (
                    <button
                      key={r.name}
                      onClick={() => setSelected(r.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px',
                        minHeight: 'var(--hit-min)', borderRadius: 'var(--r-md)', cursor: 'pointer',
                        background: active ? 'var(--brand)' : 'var(--surface)', color: active ? '#fff' : 'var(--text)',
                        border: active ? '3px solid var(--brand)' : '3px solid var(--border)',
                        fontWeight: 700, fontSize: 'var(--fs-title)', fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {r.name}
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, color: active ? 'var(--teal-100)' : 'var(--text-subtle)' }}>
                        {r.questions.length} 題
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Button variant="primary" size="xl" block iconRight={<ArrowRight size={26} />} onClick={() => startRound(region0)} disabled={!region0}>
                開始這一局
              </Button>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginTop: 14, marginBottom: 0 }}>
                每位小朋友會答完整個地區題庫，題目與選項都會打亂。
              </p>
            </div>
          </div>

          {/* right: sync */}
          <Card tone="plain" pad="lg" style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wifi size={22} style={{ color: online ? 'var(--correct)' : 'var(--text-subtle)' }} />
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>同步狀態</span>
              <Badge tone={online ? 'correct' : 'neutral'} soft style={{ marginLeft: 'auto' }}>
                {online ? '已連網' : '離線中'}
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                <Clock size={16} /> 上次同步時間
              </span>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>
                {lastSync ? new Date(lastSync).toLocaleString() : '尚未同步'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderRadius: 'var(--r-md)', background: 'var(--accent-soft)', border: '1px solid var(--amber-200)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--amber-600)' }}>
                <Upload size={18} /> 待上傳筆數
              </span>
              <Stat value={pending} unit="筆" tone="accent" />
            </div>

            <Button variant="accent" size="lg" block disabled={syncing} iconLeft={<RefreshCw size={22} />} onClick={doSync}>
              {syncing ? '同步中…' : '立即同步（在家按）'}
            </Button>
            {message && <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{message}</p>}
            <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-xs)', lineHeight: 1.5, marginTop: 'auto', marginBottom: 0 }}>
              建議在家、有網路時同步：先把題庫與名單下載到平板，課堂上即使離線也能玩。
            </p>
          </Card>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState(getApiUrl())
  return (
    <Modal onClose={onClose} width={560}>
      <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>設定</h2>
      <label style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
        後端網址（Apps Script /exec 結尾）
      </label>
      <input
        value={url}
        placeholder="https://script.google.com/macros/s/.../exec"
        onChange={(e) => setUrl(e.target.value)}
        style={{
          fontSize: 'var(--fs-body)', padding: 14, border: '2px solid var(--border-strong)',
          borderRadius: 'var(--r-md)', width: '100%', fontFamily: 'var(--font-sans)',
        }}
      />
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
        老師 PIN 與每題秒數請在 Google 試算表的 Config 分頁設定，同步後生效。
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>取消</Button>
        <Button variant="primary" onClick={() => { setApiUrl(url); onClose() }}>儲存</Button>
      </div>
    </Modal>
  )
}
