import { create } from 'zustand'
import type {
  AnswerResult, AppConfig, CampaignCityState, CampaignState,
  PlayableQuestion, Question, Region
} from '../lib/types'
import { makePlayable, shuffle } from '../lib/shuffle'
import { fetchBanks, pushResults, pushRoster } from '../lib/sheetsApi'
import { SAMPLE_BANKS } from '../lib/sampleData'
import { CITIES, findCity, type CityMeta } from '../lib/cities'
import { adoptApiFromUrl } from '../lib/config'
import {
  addResults, deleteCampaign, getLastSync, getUnsynced, listCampaigns, loadBanks,
  loadRoster, markSynced, pendingCount, saveBanks, saveCampaign, saveRoster, takeLegacyCampaign
} from '../lib/offlineStore'

export type Phase =
  | 'teacher' | 'roster' | 'cityIntro' | 'encounter' | 'quiz'
  | 'turnResult' | 'roundEnd' | 'cityCleared' | 'gameWon'
  | 'report' | 'history'

export interface PlayerResult {
  player: string
  correct: number
  total: number
  progressDiff: number | null
}

/** Result of answering one question, used by the quiz screen for feedback. */
export interface AnswerOutcome {
  correct: boolean
  /** a specialty was knocked loose (first-time correct) */
  dropped: boolean
}

const DEFAULT_CONFIG: AppConfig = { teacherPin: '', timerSeconds: 20 }
const PER_TURN = 5
const BASE_TARGET = 60

interface GameState {
  loaded: boolean
  regions: Region[]
  players: string[]
  roster: string[]
  config: AppConfig
  lastSync: string | null
  pending: number
  online: boolean
  syncing: boolean

  campaigns: CampaignState[]
  campaign: CampaignState | null
  phase: Phase
  region: string | null
  sessionId: string | null

  // active turn
  currentPlayer: string | null
  turnQueue: string[]
  turnQuestions: PlayableQuestion[]
  turnIndex: number
  turnCorrect: number
  paused: boolean
  lastResult: PlayerResult | null

  init: () => Promise<void>
  sync: () => Promise<{ ok: boolean; error?: string }>
  loadSample: () => Promise<void>
  setRoster: (names: string[]) => Promise<void>
  saveRosterCloud: (names: string[]) => Promise<{ ok: boolean; error?: string }>

  startCampaign: (cityIndex?: number) => Promise<void>
  continueCampaign: (id: string) => void
  deleteSave: (id: string) => Promise<void>

  beginRound: () => void
  nextTurn: () => void
  attack: () => void
  answer: (optionIndex: number | null) => Promise<AnswerOutcome>
  advanceTurn: () => void
  endTurn: () => void
  continueAfterTurn: () => void
  endRound: () => void
  advanceCity: () => void
  togglePause: () => void
  quitToTeacher: () => void

  goTeacher: () => void
  goHome: () => void
  goRoster: () => void
  goReport: () => void
  goHistory: () => void
}

// ---- helpers ----

function newSessionId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
}

function newId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/** Auto save name from creation time, e.g. 「6/27 下午3:45 存檔」. */
function formatSaveName(d: Date): string {
  const date = d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })
  const time = d.toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit' })
  return `${date} ${time} 存檔`
}

function upsertCampaign(list: CampaignState[], c: CampaignState): CampaignState[] {
  const i = list.findIndex((x) => x.id === c.id)
  if (i < 0) return [...list, c]
  const next = [...list]
  next[i] = c
  return next
}

/** Cities that have a matching question bank, in play order. */
function getPlayableCities(regions: Region[]): CityMeta[] {
  return CITIES
    .filter((c) => regions.some((r) => findCity(r.name)?.region === c.region))
    .sort((a, b) => a.order - b.order)
}

function bankRegionFor(regions: Region[], meta: CityMeta): Region | undefined {
  return regions.find((r) => findCity(r.name)?.region === meta.region)
}

/** Resolve the city currently being played: its meta + its question bank. */
function activeCity(
  regions: Region[],
  campaign: CampaignState | null
): { meta: CityMeta; region: Region } | null {
  if (!campaign) return null
  const meta = getPlayableCities(regions)[campaign.cityIndex]
  if (!meta) return null
  const region = bankRegionFor(regions, meta)
  return region ? { meta, region } : null
}

function ensureCityState(campaign: CampaignState, key: string): CampaignCityState {
  let cs = campaign.cities[key]
  if (!cs) {
    cs = { round: 1, collected: 0, cleared: false, players: {} }
    campaign.cities[key] = cs
  }
  return cs
}

export const useGame = create<GameState>((set, get) => ({
  loaded: false,
  regions: [],
  players: [],
  roster: [],
  config: DEFAULT_CONFIG,
  lastSync: null,
  pending: 0,
  online: navigator.onLine,
  syncing: false,

  campaigns: [],
  campaign: null,
  phase: 'teacher',
  region: null,
  sessionId: null,

  currentPlayer: null,
  turnQueue: [],
  turnQuestions: [],
  turnIndex: 0,
  turnCorrect: 0,
  paused: false,
  lastResult: null,

  init: async () => {
    // a ?api=... link (e.g. from the QR) configures the backend automatically
    const adoptedApi = adoptApiFromUrl()
    const banks = await loadBanks()
    let campaigns = await listCampaigns()
    // migrate a pre-multi-save single record, if present
    const legacy = await takeLegacyCampaign()
    if (legacy) {
      if (!legacy.id) legacy.id = newId()
      if (!legacy.name) legacy.name = formatSaveName(new Date(legacy.startedAt || Date.now()))
      await saveCampaign(legacy)
      campaigns = upsertCampaign(campaigns, legacy)
    }
    const savedRoster = await loadRoster()
    window.addEventListener('online', () => set({ online: true }))
    window.addEventListener('offline', () => set({ online: false }))
    set({
      loaded: true,
      regions: banks?.regions ?? [],
      players: banks?.players ?? [],
      roster: savedRoster ?? banks?.players ?? [],
      config: banks?.config ?? DEFAULT_CONFIG,
      campaigns,
      campaign: null,
      lastSync: await getLastSync(),
      pending: await pendingCount(),
      online: navigator.onLine,
      phase: 'teacher'
    })

    // freshly configured via ?api= and online → download banks automatically
    if (adoptedApi && navigator.onLine) void get().sync()
  },

  sync: async () => {
    if (get().syncing) return { ok: false, error: '同步中' }
    set({ syncing: true })
    try {
      const unsynced = await getUnsynced()
      if (unsynced.length) {
        await pushResults(unsynced.map(stripStored))
        await markSynced(unsynced.map((r) => r.key))
      }
      const banks = await fetchBanks()
      await saveBanks(banks)
      const curRoster = get().roster
      const nextRoster = curRoster.length ? curRoster : banks.players
      if (!curRoster.length && banks.players.length) await saveRoster(banks.players)
      set({
        regions: banks.regions,
        players: banks.players,
        config: banks.config ?? DEFAULT_CONFIG,
        roster: nextRoster,
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
    const { roster } = get()
    set({
      regions: SAMPLE_BANKS.regions,
      players: SAMPLE_BANKS.players,
      config: SAMPLE_BANKS.config,
      roster: roster.length ? roster : SAMPLE_BANKS.players,
      lastSync: await getLastSync()
    })
  },

  setRoster: async (names) => {
    const clean = names.map((n) => n.trim()).filter(Boolean)
    await saveRoster(clean)
    set({ roster: clean })
  },

  saveRosterCloud: async (names) => {
    const clean = names.map((n) => n.trim()).filter(Boolean)
    await saveRoster(clean)
    set({ roster: clean })
    try {
      await pushRoster(clean)
      // reflect the new list as the cloud "players" too
      set({ players: clean, lastSync: await getLastSync() })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : '更新雲端名單失敗' }
    }
  },

  startCampaign: async (cityIndex = 0) => {
    const { roster, regions, campaigns } = get()
    const list = getPlayableCities(regions)
    if (!list.length || !roster.length) return
    const idx = Math.max(0, Math.min(cityIndex, list.length - 1))
    const meta = list[idx]
    const d = new Date()
    const now = d.toISOString()
    const campaign: CampaignState = {
      id: newId(),
      name: `${meta.region}・${formatSaveName(d)}`,
      roster: [...roster],
      cityIndex: idx,
      cities: {},
      target: Math.min(BASE_TARGET, roster.length * PER_TURN),
      perTurn: PER_TURN,
      startedAt: now,
      updatedAt: now
    }
    await saveCampaign(campaign)
    const ac = activeCity(regions, campaign)
    set({ campaign, campaigns: upsertCampaign(campaigns, campaign), region: ac?.region.name ?? null, phase: 'cityIntro' })
  },

  continueCampaign: (id) => {
    const { campaigns, regions } = get()
    const campaign = campaigns.find((c) => c.id === id)
    if (!campaign) return
    const ac = activeCity(regions, campaign)
    set({ campaign, region: ac?.region.name ?? null, phase: ac ? 'cityIntro' : 'gameWon' })
  },

  deleteSave: async (id) => {
    await deleteCampaign(id)
    const { campaign, campaigns } = get()
    set({
      campaigns: campaigns.filter((c) => c.id !== id),
      campaign: campaign?.id === id ? null : campaign
    })
  },

  beginRound: () => {
    const { campaign, regions } = get()
    if (!campaign) return
    const ac = activeCity(regions, campaign)
    if (!ac) { set({ phase: 'gameWon' }); return }
    const cs = ensureCityState(campaign, ac.meta.region)
    const eligible = campaign.roster.filter((name) => {
      const ps = cs.players[name]
      if (!ps) return true
      return ps.questionIds.some((id) => !ps.correct[id])
    })
    for (const name of campaign.roster) {
      const ps = cs.players[name]
      if (ps) ps.servedThisRound = false
    }
    set({
      campaign: { ...campaign },
      sessionId: newSessionId(),
      region: ac.region.name,
      turnQueue: shuffle(eligible),
      paused: false
    })
    if (!get().turnQueue.length) { get().endRound(); return }
    get().nextTurn()
  },

  nextTurn: () => {
    const { campaign, regions, turnQueue } = get()
    if (!campaign) return
    const ac = activeCity(regions, campaign)
    if (!ac) { set({ phase: 'gameWon' }); return }
    const cs = ensureCityState(campaign, ac.meta.region)
    const queue = [...turnQueue]
    const name = queue.shift()
    if (!name) { get().endRound(); return }

    let ps = cs.players[name]
    let questions: Question[]
    if (!ps) {
      const dealt = shuffle(ac.region.questions).slice(0, campaign.perTurn)
      ps = { questionIds: dealt.map((q) => q.id), correct: {}, servedThisRound: false }
      cs.players[name] = ps
      questions = dealt
    } else {
      questions = ps.questionIds
        .filter((id) => !ps!.correct[id])
        .map((id) => ac.region.questions.find((q) => q.id === id))
        .filter((q): q is Question => !!q)
    }

    if (!questions.length) {
      ps.servedThisRound = true
      set({ campaign: { ...campaign }, turnQueue: queue })
      get().nextTurn()
      return
    }

    set({
      campaign: { ...campaign },
      turnQueue: queue,
      currentPlayer: name,
      turnQuestions: makePlayable(questions),
      turnIndex: 0,
      turnCorrect: 0,
      paused: false,
      phase: 'encounter'
    })
  },

  attack: () => set({ phase: 'quiz', paused: false }),

  answer: async (optionIndex) => {
    const { campaign, regions, turnQuestions, turnIndex, currentPlayer, sessionId } = get()
    const q = turnQuestions[turnIndex]
    const ac = activeCity(regions, campaign)
    if (!campaign || !ac || !q || !currentPlayer || !sessionId) {
      return { correct: false, dropped: false }
    }

    const correct = optionIndex !== null && optionIndex === q.correctIndex
    const row: AnswerResult = {
      timestamp: new Date().toISOString(),
      region: ac.region.name,
      sessionId,
      playerName: currentPlayer,
      questionId: q.id,
      chosen: optionIndex !== null ? q.options[optionIndex] : '',
      correct
    }
    await addResults([row])

    const cs = ensureCityState(campaign, ac.meta.region)
    const ps = cs.players[currentPlayer]!
    let dropped = false
    if (correct && !ps.correct[q.id]) {
      ps.correct[q.id] = true
      cs.collected += 1
      dropped = true
    }
    campaign.updatedAt = new Date().toISOString()
    await saveCampaign(campaign)

    set({
      campaign: { ...campaign },
      campaigns: upsertCampaign(get().campaigns, campaign),
      turnCorrect: get().turnCorrect + (dropped ? 1 : 0),
      pending: await pendingCount()
    })

    if (navigator.onLine) void get().sync()
    return { correct, dropped }
  },

  advanceTurn: () => {
    const { turnQuestions, turnIndex } = get()
    if (turnIndex + 1 < turnQuestions.length) {
      set({ turnIndex: turnIndex + 1, paused: false })
    } else {
      get().endTurn()
    }
  },

  endTurn: () => {
    const { campaign, regions, currentPlayer, turnQuestions, turnCorrect } = get()
    if (!campaign || !currentPlayer) return
    const ac = activeCity(regions, campaign)
    if (!ac) return
    const cs = ensureCityState(campaign, ac.meta.region)
    const ps = cs.players[currentPlayer]
    if (ps) ps.servedThisRound = true
    const lastResult: PlayerResult = {
      player: currentPlayer,
      correct: turnCorrect,
      total: turnQuestions.length,
      progressDiff: null
    }
    if (cs.collected >= campaign.target) cs.cleared = true
    void saveCampaign(campaign)
    set({
      campaign: { ...campaign },
      campaigns: upsertCampaign(get().campaigns, campaign),
      lastResult,
      phase: cs.cleared ? 'cityCleared' : 'turnResult'
    })
  },

  continueAfterTurn: () => {
    if (get().turnQueue.length) get().nextTurn()
    else get().endRound()
  },

  endRound: () => {
    const { campaign, regions } = get()
    if (!campaign) return
    const ac = activeCity(regions, campaign)
    if (ac) ensureCityState(campaign, ac.meta.region).round += 1
    campaign.updatedAt = new Date().toISOString()
    void saveCampaign(campaign)
    set({ campaign: { ...campaign }, campaigns: upsertCampaign(get().campaigns, campaign), currentPlayer: null, phase: 'roundEnd' })
  },

  advanceCity: () => {
    const { campaign, regions } = get()
    if (!campaign) return
    const ac = activeCity(regions, campaign)
    if (ac) ensureCityState(campaign, ac.meta.region).cleared = true
    campaign.cityIndex += 1
    campaign.updatedAt = new Date().toISOString()
    void saveCampaign(campaign)
    const campaigns = upsertCampaign(get().campaigns, campaign)
    if (campaign.cityIndex >= getPlayableCities(regions).length) {
      set({ campaign: { ...campaign }, campaigns, phase: 'gameWon' })
    } else {
      const next = activeCity(regions, campaign)
      set({ campaign: { ...campaign }, campaigns, region: next?.region.name ?? null, phase: 'cityIntro' })
    }
  },

  togglePause: () => set({ paused: !get().paused }),

  /** End the current round mid-play and return to the teacher page (progress is
   *  already auto-saved per answer). */
  quitToTeacher: () => set({ phase: 'teacher', paused: false, currentPlayer: null }),

  goTeacher: () => set({ phase: 'teacher' }),
  goHome: () => set({ phase: 'teacher' }),
  goRoster: () => set({ phase: 'roster' }),
  goReport: () => {
    const { region, regions, campaign } = get()
    const r = region ?? activeCity(regions, campaign)?.region.name ?? regions[0]?.name ?? null
    set({ region: r, phase: 'report' })
  },
  goHistory: () => set({ phase: 'history' })
}))

function stripStored(r: { synced: 0 | 1; key: number } & AnswerResult): AnswerResult {
  const { synced: _s, key: _k, ...rest } = r
  return rest
}

// ---- selectors for screens ----

export interface ActiveCityView {
  meta: CityMeta
  region: Region
  collected: number
  target: number
  round: number
  cleared: boolean
}

/** The city currently in play, with its collective progress. null if no game. */
export function selectActiveCity(s: GameState): ActiveCityView | null {
  const ac = activeCity(s.regions, s.campaign)
  if (!ac || !s.campaign) return null
  const city = s.campaign.cities[ac.meta.region]
  return {
    meta: ac.meta,
    region: ac.region,
    collected: city?.collected ?? 0,
    target: s.campaign.target,
    round: city?.round ?? 1,
    cleared: city?.cleared ?? false
  }
}

/** Ordered list of cities that have a question bank (for the map / save view). */
export function selectPlayableCities(s: GameState): CityMeta[] {
  return getPlayableCities(s.regions)
}
