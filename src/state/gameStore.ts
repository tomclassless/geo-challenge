import { create } from 'zustand'
import type { AnswerResult, AppConfig, PlayableQuestion, Region } from '../lib/types'
import { makePlayable } from '../lib/shuffle'
import { fetchBanks, pushResults } from '../lib/sheetsApi'
import { SAMPLE_BANKS } from '../lib/sampleData'
import {
  addResults,
  getAllResults,
  getLastSync,
  getUnsynced,
  loadBanks,
  markSynced,
  pendingCount,
  saveBanks
} from '../lib/offlineStore'

export type Phase = 'home' | 'name' | 'quiz' | 'result' | 'report' | 'history'

export interface PlayerResult {
  player: string
  correct: number
  total: number
  /** vs this player's previous session in the same region; null if none */
  progressDiff: number | null
}

interface GameState {
  loaded: boolean
  regions: Region[]
  players: string[]
  config: AppConfig
  lastSync: string | null
  pending: number
  online: boolean
  syncing: boolean

  phase: Phase
  region: string | null
  sessionId: string | null

  playable: PlayableQuestion[]
  index: number
  answers: AnswerResult[]
  lastResult: PlayerResult | null

  init: () => Promise<void>
  sync: () => Promise<{ ok: boolean; error?: string }>
  loadSample: () => Promise<void>
  startRound: (region: string) => void
  restartRound: () => void
  beginPlayer: (name: string) => void
  answer: (optionIndex: number | null) => Promise<void>
  goHome: () => void
  goReport: () => void
  goHistory: () => void
  backToName: () => void
}

function newSessionId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
}

const DEFAULT_CONFIG: AppConfig = { teacherPin: '', timerSeconds: 30 }

export const useGame = create<GameState>((set, get) => ({
  loaded: false,
  regions: [],
  players: [],
  config: DEFAULT_CONFIG,
  lastSync: null,
  pending: 0,
  online: navigator.onLine,
  syncing: false,

  phase: 'home',
  region: null,
  sessionId: null,
  playable: [],
  index: 0,
  answers: [],
  lastResult: null,

  init: async () => {
    const banks = await loadBanks()
    window.addEventListener('online', () => set({ online: true }))
    window.addEventListener('offline', () => set({ online: false }))
    set({
      loaded: true,
      regions: banks?.regions ?? [],
      players: banks?.players ?? [],
      config: banks?.config ?? DEFAULT_CONFIG,
      lastSync: await getLastSync(),
      pending: await pendingCount(),
      online: navigator.onLine
    })
  },

  sync: async () => {
    if (get().syncing) return { ok: false, error: '同步中' }
    set({ syncing: true })
    try {
      // 1) upload anything pending
      const unsynced = await getUnsynced()
      if (unsynced.length) {
        await pushResults(unsynced.map(stripStored))
        await markSynced(unsynced.map((r) => r.key))
      }
      // 2) download latest banks
      const banks = await fetchBanks()
      await saveBanks(banks)
      set({
        regions: banks.regions,
        players: banks.players,
        config: banks.config ?? DEFAULT_CONFIG,
        lastSync: await getLastSync(),
        pending: await pendingCount()
      })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : '同步失敗' }
    } finally {
      set({ syncing: false })
    }
  },

  loadSample: async () => {
    await saveBanks(SAMPLE_BANKS)
    set({
      regions: SAMPLE_BANKS.regions,
      players: SAMPLE_BANKS.players,
      config: SAMPLE_BANKS.config,
      lastSync: await getLastSync()
    })
  },

  startRound: (region) => {
    set({ region, sessionId: newSessionId(), phase: 'name', lastResult: null })
  },

  restartRound: () => {
    set({ sessionId: newSessionId(), phase: 'name', lastResult: null })
  },

  beginPlayer: (name) => {
    const region = get().regions.find((r) => r.name === get().region)
    if (!region) return
    set({
      playable: makePlayable(region.questions),
      index: 0,
      answers: [],
      phase: 'quiz',
      lastResult: { player: name, correct: 0, total: region.questions.length, progressDiff: null }
    })
  },

  answer: async (optionIndex) => {
    const { playable, index, answers, lastResult, region, sessionId } = get()
    const q = playable[index]
    if (!q || !lastResult || !region || !sessionId) return

    const correct = optionIndex !== null && optionIndex === q.correctIndex
    const row: AnswerResult = {
      timestamp: new Date().toISOString(),
      region,
      sessionId,
      playerName: lastResult.player,
      questionId: q.id,
      chosen: optionIndex !== null ? q.options[optionIndex] : '',
      correct
    }
    const nextAnswers = [...answers, row]

    if (index + 1 < playable.length) {
      set({ answers: nextAnswers, index: index + 1 })
      return
    }

    // round finished for this player
    await addResults(nextAnswers)
    const correctCount = nextAnswers.filter((a) => a.correct).length
    const progressDiff = await computeProgress(region, lastResult.player, sessionId, correctCount)

    set({
      answers: nextAnswers,
      phase: 'result',
      pending: await pendingCount(),
      lastResult: {
        player: lastResult.player,
        correct: correctCount,
        total: nextAnswers.length,
        progressDiff
      }
    })

    // opportunistic upload if we happen to be online
    if (navigator.onLine) void get().sync()
  },

  goHome: () => set({ phase: 'home' }),
  goReport: () => set({ phase: 'report' }),
  goHistory: () => set({ phase: 'history' }),
  backToName: () => set({ phase: 'name' })
}))

function stripStored(r: { synced: 0 | 1; key: number } & AnswerResult): AnswerResult {
  const { synced: _s, key: _k, ...rest } = r
  return rest
}

/** Diff vs this player's most recent *prior* session in the same region. */
async function computeProgress(
  region: string,
  player: string,
  currentSession: string,
  currentCorrect: number
): Promise<number | null> {
  const all = await getAllResults()
  const prior = all.filter(
    (r) => r.region === region && r.playerName === player && r.sessionId !== currentSession
  )
  if (!prior.length) return null

  // group by session, find the latest by max timestamp
  const bySession = new Map<string, { correct: number; ts: string }>()
  for (const r of prior) {
    const cur = bySession.get(r.sessionId) ?? { correct: 0, ts: '' }
    cur.correct += r.correct ? 1 : 0
    if (r.timestamp > cur.ts) cur.ts = r.timestamp
    bySession.set(r.sessionId, cur)
  }
  let latest: { correct: number; ts: string } | null = null
  for (const v of bySession.values()) if (!latest || v.ts > latest.ts) latest = v
  return latest ? currentCorrect - latest.correct : null
}
