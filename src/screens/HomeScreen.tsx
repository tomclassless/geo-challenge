import { useState } from 'react'
import { BarChart3, Settings, Wifi, Clock, Upload, RefreshCw, Play, Users, Flag, Sword, Trash2 } from 'lucide-react'
import { useGame, selectActiveCity, selectPlayableCities } from '../state/gameStore'
import { getApiUrl, setApiUrl } from '../lib/config'
import { Button, IconButton, Card, Badge, Stat, Logo } from '../ds'
import { Modal } from '../ds/shell/Modal'
import { WUKONG_EMOJI, BUDDHA_EMOJI } from '../lib/cities'

/** 老師操作頁 — the hub shown before a game and after every round ends. */
export function HomeScreen() {
  const {
    regions, roster, campaign, lastSync, pending, online, syncing,
    sync, loadSample, startCampaign, continueCampaign, clearSave, goReport, goHistory, goRoster
  } = useGame()
  const active = useGame(selectActiveCity)
  const cities = useGame(selectPlayableCities)

  const [showSettings, setShowSettings] = useState(false)
  const [message, setMessage] = useState('')

  const doSync = async () => {
    setMessage('')
    const res = await sync()
    setMessage(res.ok ? '同步完成 ✓' : '同步失敗：' + (res.error ?? ''))
  }

  const onStart = () => {
    if (!roster.length) { goRoster(); return }
    if (campaign && !window.confirm('已有存檔，開始新遊戲會覆蓋目前進度，確定嗎？')) return
    void startCampaign()
  }

  const clearedCount = campaign ? cities.filter((c) => campaign.cities[c.region]?.cleared).length : 0

  const onDeleteSave = () => {
    if (window.confirm('確定要刪除目前的存檔嗎？此動作無法復原（玩家答題的雲端統計不受影響）。')) {
      void clearSave()
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Logo />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="ghost" iconLeft={<BarChart3 size={20} />} onClick={goReport}>老師報表</Button>
          <Button variant="ghost" iconLeft={<Clock size={20} />} onClick={goHistory}>歷史</Button>
          <IconButton variant="soft" icon={<Settings size={22} />} label="設定" onClick={() => setShowSettings(true)} />
        </div>
      </div>

      {regions.length === 0 ? (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 36 }}>
          <Card tone="plain" pad="lg" style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>還沒有題庫</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              請先設定後端網址再「立即同步」下載六都題庫；或先載入範例題庫試玩整個冒險。
            </p>
            <Button variant="primary" size="lg" block onClick={() => setShowSettings(true)}>設定後端網址</Button>
            <Button variant="secondary" size="lg" block onClick={() => void loadSample()}>🧪 載入範例題庫（六都）試玩</Button>
          </Card>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, padding: 28, overflow: 'hidden' }}>
          {/* left: adventure + save */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-wide)', color: 'var(--text-muted)' }}>冒險主題</span>
              <h1 style={{ margin: '4px 0 0', fontWeight: 900, fontSize: 30, lineHeight: 1.15 }}>
                {WUKONG_EMOJI} 孫悟空逃離如來佛祖掌心 {BUDDHA_EMOJI}
              </h1>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
                從桃園出發，繞台灣六都一圈，吃掉足夠特產才能逃出掌心！
              </p>
            </div>

            {/* six-city path */}
            <Card tone="plain" pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                六都進度{campaign ? `（已通關 ${clearedCount}/${cities.length}）` : ''}
              </span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {cities.map((c, i) => {
                  const cs = campaign?.cities[c.region]
                  const isCurrent = active?.meta.region === c.region
                  return (
                    <div key={c.region} style={{
                      flex: '1 1 140px', padding: '10px 12px', borderRadius: 'var(--r-md)',
                      border: isCurrent ? `3px solid ${c.general.color}` : '2px solid var(--border)',
                      background: cs?.cleared ? 'var(--correct-bg)' : 'var(--surface)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 26 }}>{c.general.emoji}</span>
                        <div style={{ lineHeight: 1.2 }}>
                          <div style={{ fontWeight: 800 }}>{i + 1}. {c.region}</div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{c.general.name} · {c.specialty.emoji}{c.specialty.name}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', fontWeight: 700, color: cs?.cleared ? 'var(--green-700)' : 'var(--text-muted)' }}>
                        {cs?.cleared ? '✓ 已通關' : cs ? `特產 ${cs.collected}/${campaign!.target}・第${cs.round}局` : '尚未開始'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* save record + start/continue */}
            <Card tone="plain" pad="lg" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {campaign && active ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 48 }}>{active.meta.general.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 'var(--fs-title)' }}>存檔：{active.meta.region}・第 {active.round} 局</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                      已蒐集 {active.collected}/{active.target} 個{active.meta.specialty.name}・參與者 {campaign.roster.length} 人
                    </div>
                  </div>
                  <Badge tone="brand" soft>{WUKONG_EMOJI} 進行中</Badge>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>還沒有存檔。先設定參與者名單，再開始新遊戲。</div>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {campaign && (
                  <Button variant="primary" size="lg" iconLeft={<Play size={22} />} onClick={continueCampaign} style={{ flex: '1 1 200px' }}>
                    繼續遊戲（讀取存檔）
                  </Button>
                )}
                <Button variant={campaign ? 'secondary' : 'primary'} size="lg" iconLeft={<Sword size={20} />} onClick={onStart} style={{ flex: '1 1 160px' }}>
                  {campaign ? '開始新遊戲' : '開始遊戲'}
                </Button>
                {campaign && (
                  <Button variant="ghost" size="lg" iconLeft={<Trash2 size={20} />} onClick={onDeleteSave} style={{ color: 'var(--wrong)' }}>
                    刪除存檔
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* right: roster + sync */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
            <Card tone="plain" pad="lg" interactive onClick={goRoster} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', background: 'var(--brand-soft)', display: 'grid', placeItems: 'center', color: 'var(--brand-strong)' }}>
                <Users size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-title)' }}>參與者名單</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>目前 {roster.length} 人（建議 ≥ 20 人）</div>
              </div>
              <Flag size={20} style={{ color: 'var(--text-subtle)' }} />
            </Card>

            <Card tone="plain" pad="lg" style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Wifi size={22} style={{ color: online ? 'var(--correct)' : 'var(--text-subtle)' }} />
                <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>雲端同步</span>
                <Badge tone={online ? 'correct' : 'neutral'} soft style={{ marginLeft: 'auto' }}>{online ? '已連網' : '離線中'}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                  <Clock size={16} /> 上次同步時間
                </span>
                <span style={{ fontWeight: 700 }}>{lastSync ? new Date(lastSync).toLocaleString() : '尚未同步'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--accent-soft)', border: '1px solid var(--amber-200)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--amber-600)' }}>
                  <Upload size={18} /> 待上傳筆數
                </span>
                <Stat value={pending} unit="筆" tone="accent" />
              </div>

              <Button variant="accent" size="lg" block disabled={syncing} iconLeft={<RefreshCw size={22} />} onClick={doSync}>
                {syncing ? '同步中…' : '雲端同步（更新題庫／上傳成績）'}
              </Button>
              {message && <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{message}</p>}
              <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-xs)', lineHeight: 1.5, marginTop: 'auto', marginBottom: 0 }}>
                正確率與錯誤率會上傳雲端，可在「老師報表」查看每位玩家、每題的統計。
              </p>
            </Card>
          </div>
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
        style={{ fontSize: 'var(--fs-body)', padding: 14, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-md)', width: '100%', fontFamily: 'var(--font-sans)' }}
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
