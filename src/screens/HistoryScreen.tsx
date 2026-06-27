import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { buildReport, listSessions, type ReportData, type SessionInfo } from '../lib/report'
import { Card, Badge, Button, AccuracyBar } from '../ds'
import { Modal } from '../ds/shell/Modal'

export function HistoryScreen() {
  const { regions, goHome } = useGame()
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [open, setOpen] = useState<SessionInfo | null>(null)
  const [detail, setDetail] = useState<ReportData | null>(null)

  useEffect(() => {
    void listSessions().then(setSessions)
  }, [])

  useEffect(() => {
    if (!open) { setDetail(null); return }
    void buildReport(regions, open.region, open.sessionId).then(setDetail)
  }, [open, regions])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Button variant="ghost" iconLeft={<ChevronLeft size={20} />} onClick={goHome}>首頁</Button>
        <span style={{ fontWeight: 900, fontSize: 'var(--fs-title)' }}>歷史紀錄</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {sessions.length === 0 ? (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
            這台平板上還沒有任何成績紀錄。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880 }}>
            {sessions.map((s) => (
              <Card key={s.sessionId} tone="plain" pad="md" interactive onClick={() => setOpen(s)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>{s.region}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(s.date).toLocaleString()}
                  </div>
                </div>
                <Badge tone="neutral" soft>{s.players} 人</Badge>
                <Badge tone={s.avgRate >= 0.5 ? 'correct' : 'wrong'} soft>平均 {Math.round(s.avgRate * 100)}%</Badge>
                <span style={{ color: 'var(--brand-strong)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>看這局 →</span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {open && (
        <Modal onClose={() => setOpen(null)} width={620}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h3)' }}>
            {open.region}（{new Date(open.date).toLocaleDateString()}）
          </h2>
          {detail && detail.stats.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {detail.stats.map((s, qi) => (
                <AccuracyBar key={s.questionId} label={`第 ${qi + 1} 題`} correct={s.correct} answered={s.total} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>載入中…</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => setOpen(null)}>關閉</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
