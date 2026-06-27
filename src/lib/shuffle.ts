import type { PlayableQuestion, Question } from './types'

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a per-player playable set: question order shuffled AND each question's
 * options shuffled. The original question id and correct answer are preserved
 * via `id` and a recomputed `correctIndex`, so accuracy still aggregates by id.
 */
export function makePlayable(questions: Question[]): PlayableQuestion[] {
  return shuffle(questions).map((q) => {
    const order = shuffle(q.options.map((opt, i) => ({ opt, i })))
    return {
      id: q.id,
      type: q.type,
      question: q.question,
      media: q.media,
      explain: q.explain,
      options: order.map((o) => o.opt),
      correctIndex: order.findIndex((o) => o.i === q.answerIndex)
    }
  })
}
