import { getAllResults, type StoredResult } from './offlineStore'
import type { Region } from './types'

export interface QuestionStat {
  questionId: string
  label: string
  /** full question text (untruncated) */
  text: string
  /** correct answer option text, or '' if unknown */
  answer: string
  correct: number
  total: number
  rate: number // 0..1
}

export type Cell = 'correct' | 'wrong' | 'blank' | 'absent'

export interface MatrixRow {
  player: string
  cells: Cell[] // aligned with questionIds order
  score: number
}

export interface ReportData {
  questionIds: string[]
  questionLabels: string[]
  stats: QuestionStat[]
  players: string[]
  matrix: MatrixRow[]
}

export interface SessionInfo {
  sessionId: string
  region: string
  date: string
  players: number
  avgRate: number // 0..1
}

function questionFor(region: Region | undefined, qid: string) {
  return region?.questions.find((x) => x.id === qid)
}

function labelFor(region: Region | undefined, qid: string): string {
  const text = questionFor(region, qid)?.question ?? qid
  return text.length > 18 ? text.slice(0, 18) + '…' : text
}

/** Correct answer option text for a question, or '' if unknown. */
function answerFor(region: Region | undefined, qid: string): string {
  const q = questionFor(region, qid)
  if (!q) return ''
  return q.options[q.answerIndex] ?? ''
}

/** Build the teacher report for one region, optionally limited to one session
 *  or to one save (campaignId, which takes precedence over sessionId). */
export async function buildReport(
  regions: Region[],
  region: string,
  sessionId: string | null,
  campaignId?: string | null
): Promise<ReportData> {
  const all = await getAllResults()
  const rows = all.filter(
    (r) =>
      r.region === region &&
      (campaignId ? r.campaignId === campaignId : !sessionId || r.sessionId === sessionId)
  )
  const reg = regions.find((r) => r.name === region)

  // question order follows the bank if available, else first-seen order
  const order: string[] = reg
    ? reg.questions.map((q) => q.id)
    : [...new Set(rows.map((r) => r.questionId))]
  const present = new Set(rows.map((r) => r.questionId))
  const questionIds = order.filter((id) => present.has(id))

  const stats: QuestionStat[] = questionIds.map((qid) => {
    const qr = rows.filter((r) => r.questionId === qid)
    const correct = qr.filter((r) => r.correct).length
    const total = qr.length
    return {
      questionId: qid,
      label: labelFor(reg, qid),
      text: questionFor(reg, qid)?.question ?? qid,
      answer: answerFor(reg, qid),
      correct,
      total,
      rate: total ? correct / total : 0,
    }
  })

  const players = [...new Set(rows.map((r) => r.playerName))].sort()
  const matrix: MatrixRow[] = players.map((player) => {
    const pr = rows.filter((r) => r.playerName === player)
    let score = 0
    const cells: Cell[] = questionIds.map((qid) => {
      const r = pr.find((x) => x.questionId === qid)
      if (!r) return 'absent'
      if (r.correct) { score++; return 'correct' }
      return r.chosen === '' ? 'blank' : 'wrong'
    })
    return { player, cells, score }
  })

  return {
    questionIds,
    questionLabels: stats.map((s) => s.label),
    stats,
    players,
    matrix
  }
}

/** List all played sessions (newest first) for the history view. */
export async function listSessions(regionFilter?: string | null): Promise<SessionInfo[]> {
  const all = await getAllResults()
  const map = new Map<string, StoredResult[]>()
  for (const r of all) {
    if (regionFilter && r.region !== regionFilter) continue
    const arr = map.get(r.sessionId) ?? []
    arr.push(r)
    map.set(r.sessionId, arr)
  }
  const out: SessionInfo[] = []
  for (const [sessionId, rows] of map) {
    const correct = rows.filter((r) => r.correct).length
    const date = rows.reduce((m, r) => (r.timestamp > m ? r.timestamp : m), '')
    out.push({
      sessionId,
      region: rows[0].region,
      date,
      players: new Set(rows.map((r) => r.playerName)).size,
      avgRate: rows.length ? correct / rows.length : 0
    })
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1))
}
