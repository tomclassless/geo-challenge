import { useEffect, useMemo, useState } from 'react'
import { Lock, ChevronLeft, Clock, Home, RotateCcw } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { buildReport, type Cell, type ReportData } from '../lib/report'
import { Stat, AccuracyBar, MatrixCell, Button } from '../ds'
import { PinInput } from '../ds/report/PinInput'

type MatrixState = 'correct' | 'wrong' | 'unanswered'
const CELL_STATE: Record<Cell, MatrixState> = {
  correct: 'correct',
  wrong: 'wrong',
  blank: 'unanswered',
  absent: 'unanswered',
}

export function AccuracyReportScreen() {
  const { regions, region, sessionId, config, reportCampaignId, resetStats, goHistory, goHome } = useGame()
  const [scope, setScope] = useState<'session' | 'all'>('session')
  const [view, setView] = useState<'class' | 'matrix'>('class')
  const [data, setData] = useState<ReportData | null>(null)
  const [refresh, setRefresh] = useState(0)

  // built-in PIN gate (replaces the old PinGate modal)
  const [authed, setAuthed] = useState(!config.teacherPin)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!region) return
    const session = reportCampaignId ? null : scope === 'session' ? sessionId : null
    void buildReport(regions, region, session, reportCampaignId).then(setData)
  }, [regions, region, sessionId, scope, reportCampaignId, refresh])

  const onReset = async () => {
    if (!window.confirm('確定要把所有答題統計「全部歸零」嗎？此動作會清除本機所有正確率/錯誤率紀錄，無法復原。')) return
    await resetStats()
    setRefresh((n) => n + 1)
  }

  const summary = useMemo(() => {
    if (!data || data.stats.length === 0) return null
    const totalCorrect = data.stats.reduce((a, s) => a + s.correct, 0)
    const totalAns = data.stats.reduce((a, s) => a + s.total, 0)
    const avg = totalAns ? Math.round((totalCorrect / totalAns) * 100) : 0
    let weakIdx = 0
    data.stats.forEach((s, i) => { if (s.rate < data.stats[weakIdx].rate) weakIdx = i })
    return { avg, weakIdx, players: data.matrix.length, questions: data.stats.length }
  }, [data])

  if (!authed) {
    const complete = (v: string) => {
      if (v === config.teacherPin) { setAuthed(true); setError(false) }
      else { setError(true); setTimeout(() => { setPin(''); setError(false) }, 600) }
    }
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: 'var(--bg)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 'var(--r-lg)', background: 'var(--brand-soft)', display: 'grid', placeItems: 'center', color: 'var(--brand-strong)' }}>
          <Lock size={30} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>老師報表</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>請輸入老師 PIN</p>
        </div>
        <PinInput value={pin} error={error} onChange={setPin} onComplete={complete} />
        <Button variant="ghost" onClick={goHome}>返回</Button>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <Button variant="ghost" iconLeft={<ChevronLeft size={20} />} onClick={goHome}>首頁</Button>
        <span style={{ fontWeight: 900, fontSize: 'var(--fs-title)' }}>
          {region} · 報表{reportCampaignId ? '（此存檔）' : ''}
        </span>
        {!reportCampaignId && (
          <div style={{ display: 'flex', gap: 8, background: 'var(--surface-sunken)', padding: 4, borderRadius: 'var(--r-pill)' }}>
            {([['session', '本局'], ['all', '全部']] as const).map(([k, label]) => (
              <Pill key={k} active={scope === k} onClick={() => setScope(k)}>{label}</Pill>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, background: 'var(--surface-sunken)', padding: 4, borderRadius: 'var(--r-pill)' }}>
          {([['class', '全班正確率'], ['matrix', '對錯對照表']] as const).map(([k, label]) => (
            <Pill key={k} active={view === k} onClick={() => setView(k)}>{label}</Pill>
          ))}
        </div>
      </div>

      {!data || data.stats.length === 0 ? (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>這個範圍還沒有成績。</div>
      ) : (
        <>
          {/* stat strip */}
          <div style={{ display: 'flex', gap: 40, padding: '18px 32px', borderBottom: '1px solid var(--border)' }}>
            <Stat caption="全班平均正確率" value={summary!.avg} unit="%" tone="brand" />
            <Stat caption="全班平均錯誤率" value={100 - summary!.avg} unit="%" tone="wrong" />
            <Stat caption="作答人數" value={summary!.players} unit="人" />
            <Stat caption="題數" value={summary!.questions} unit="題" />
            <Stat caption="最弱題" value={`第 ${summary!.weakIdx + 1}`} unit="題" tone="wrong" />
          </div>

          {/* body */}
          <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
            {view === 'class' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
                {data.stats.map((s, qi) => (
                  <div key={s.questionId}>
                    <AccuracyBar label={`第 ${qi + 1} 題`} correct={s.correct} answered={s.total} />
                    <div style={{ marginLeft: 108, marginTop: 2, fontSize: 'var(--fs-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      正確率 {Math.round(s.rate * 100)}%・錯誤率 {Math.round((1 - s.rate) * 100)}%（作答 {s.total} 次）
                    </div>
                    {qi === summary!.weakIdx && (
                      <div style={{ marginTop: 4, marginLeft: 108, fontSize: 'var(--fs-xs)', color: 'var(--wrong)', fontWeight: 700 }}>
                        ⚠ 全班最弱 · 建議課堂檢討：{s.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', left: 0, background: 'var(--bg)', textAlign: 'left', padding: '0 12px', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>學生 \ 題</th>
                      {data.stats.map((s, qi) => (
                        <th key={s.questionId} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: qi === summary!.weakIdx ? 'var(--wrong)' : 'var(--text-muted)', fontWeight: 700, paddingBottom: 4 }}>
                          {qi + 1}
                        </th>
                      ))}
                      <th style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 700, padding: '0 8px' }}>分數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.matrix.map((row) => (
                      <tr key={row.player}>
                        <td style={{ position: 'sticky', left: 0, background: 'var(--bg)', padding: '0 12px', fontSize: 'var(--fs-sm)', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.player}</td>
                        {row.cells.map((c, i) => (
                          <td key={i}><MatrixCell state={CELL_STATE[c]} compact /></td>
                        ))}
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, textAlign: 'center', padding: '0 8px' }}>{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MatrixCell state="correct" compact /> 答對</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MatrixCell state="wrong" compact /> 答錯</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MatrixCell state="unanswered" compact /> 沒選／沒玩到</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* actions */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 32px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Button variant="primary" iconLeft={<Home size={20} />} onClick={goHome}>回老師頁</Button>
        <Button variant="ghost" iconLeft={<Clock size={20} />} onClick={goHistory}>看歷史</Button>
        <Button variant="ghost" iconLeft={<RotateCcw size={20} />} onClick={() => void onReset()} style={{ marginLeft: 'auto', color: 'var(--wrong)' }}>
          全部歸零重新計算
        </Button>
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none', cursor: 'pointer', padding: '8px 18px', borderRadius: 'var(--r-pill)',
        fontWeight: 700, fontSize: 'var(--fs-sm)', fontFamily: 'var(--font-sans)',
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--brand-strong)' : 'var(--text-muted)',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
