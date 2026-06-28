export type QuestionType = 'text' | 'image' | 'video'

/** A question as stored in the bank (original, unshuffled). */
export interface Question {
  id: string
  type: QuestionType
  question: string
  media: string
  options: string[]
  /** index into `options` of the correct answer */
  answerIndex: number
  explain: string
}

export interface Region {
  name: string
  questions: Question[]
}

export interface AppConfig {
  teacherPin: string
  timerSeconds: number
}

/** One entry in the cloud media manifest (no bytes — just what exists). */
export interface MediaIndexEntry {
  name: string
  mimeType: string
  updatedAt: string
}

/** Payload returned by the Apps Script GET endpoint. */
export interface BanksPayload {
  regions: Region[]
  players: string[]
  config: AppConfig
  /** Filenames the backend has stored in Drive (for offline prefetch + upload UI). */
  mediaIndex?: MediaIndexEntry[]
}

/** A question prepared for one player: question order + option order shuffled. */
export interface PlayableQuestion {
  id: string
  type: QuestionType
  question: string
  media: string
  explain: string
  /** options in display (shuffled) order */
  options: string[]
  /** index into the shuffled `options` of the correct answer */
  correctIndex: number
}

/** One answered question — the unit we store and upload. */
export interface AnswerResult {
  timestamp: string
  region: string
  sessionId: string
  playerName: string
  questionId: string
  /** chosen option text, or '' if timed out / unanswered */
  chosen: string
  correct: boolean
  /** which save (campaign) this answer belongs to — lets the report scope to one save */
  campaignId?: string
}

// ---- RPG campaign save ----

/** Per-player progress within one city. */
export interface CampaignPlayerState {
  /** The fixed set of questions this player was dealt for the city (drawn round 1). */
  questionIds: string[]
  /** questionId -> already answered correctly (persists across rounds). */
  correct: Record<string, boolean>
  /** Whether this player has already taken their turn in the current round. */
  servedThisRound: boolean
}

/** Collective progress for one city, shared by the whole class. */
export interface CampaignCityState {
  round: number
  /** Specialties collected so far = total questions answered correctly (cap = roster*5). */
  collected: number
  cleared: boolean
  players: Record<string, CampaignPlayerState>
}

/** The whole adventure save — one game in progress. */
export interface CampaignState {
  /** Unique id for this save slot. */
  id: string
  /** Display name (auto: 建立日期時間). */
  name: string
  roster: string[]
  /** Index into CITIES (play order). */
  cityIndex: number
  cities: Record<string, CampaignCityState>
  /** Specialties needed to clear a city (default 60). */
  target: number
  /** How many questions each soldier carries per turn (default 5). */
  perTurn: number
  startedAt: string
  updatedAt: string
}
