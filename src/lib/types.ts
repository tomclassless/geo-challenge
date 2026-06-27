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

/** Payload returned by the Apps Script GET endpoint. */
export interface BanksPayload {
  regions: Region[]
  players: string[]
  config: AppConfig
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
}
