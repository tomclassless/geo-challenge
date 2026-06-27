import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGame, selectActiveCity, type AnswerOutcome } from '../state/gameStore'
import { QuestionMedia } from '../components/QuestionMedia'
import {
  Avatar, TimerBar, QuestionProgress, AnswerOption, Button,
  WukongMeter, SpecialtyIcon, StopButton, PauseOverlay
} from '../ds'

export function QuizScreen() {
  const {
    turnQuestions, turnIndex, turnCorrect, config, currentPlayer, paused,
    answer, advanceTurn, togglePause
  } = useGame()
  const active = useGame(selectActiveCity)
  const q = turnQuestions[turnIndex]
  const total = turnQuestions.length

  const [remaining, setRemaining] = useState(config.timerSeconds)
  const [choice, setChoice] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<AnswerOutcome | null>(null)
  const answeredRef = useRef<number>(-1)

  // a tap and the timer must not both answer the same question
  const commit = (opt: number | null) => {
    if (answeredRef.current === turnIndex) return
    answeredRef.current = turnIndex
    void answer(opt).then((outcome) => {
      setFeedback(outcome)
      window.setTimeout(() => {
        setFeedback(null)
        advanceTurn()
      }, outcome.correct ? 1100 : 950)
    })
  }

  // reset per question
  useEffect(() => {
    setRemaining(config.timerSeconds)
    setChoice(null)
    setFeedback(null)
  }, [turnIndex, config.timerSeconds])

  // countdown — frozen while paused or after the question is answered
  useEffect(() => {
    if (paused || answeredRef.current === turnIndex) return
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t)
          commit(null)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex, paused])

  if (!q || !active || !currentPlayer) return null
  const { meta, collected, target } = active

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <StopButton paused={paused} onToggle={togglePause} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 36px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Avatar name={currentPlayer} size="md" />
        <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>{currentPlayer}</span>
        <div style={{ flex: 1, maxWidth: 260 }}>
          <QuestionProgress current={turnIndex + 1} total={total} />
        </div>
        <div style={{ marginLeft: 'auto', marginRight: 64 }}>
          <WukongMeter collected={collected} target={target} specialtyEmoji={meta.specialty.emoji} compact />
        </div>
      </div>

      {/* soldier's remaining specialties */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 36px 0' }}>
        <span style={{ fontSize: 24 }}>{meta.general.emoji}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <SpecialtyIcon key={i} emoji={meta.specialty.emoji} size={32} dimmed={i < turnCorrect} />
          ))}
        </div>
        <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
          {meta.general.name}身上的{meta.specialty.name}
        </span>
      </div>

      {/* timer */}
      <div style={{ padding: '14px 36px 0' }}>
        <TimerBar remaining={remaining} total={config.timerSeconds} />
      </div>

      {/* question */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '18px 36px 24px', maxWidth: 980, width: '100%', margin: '0 auto', boxSizing: 'border-box', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-h2)', lineHeight: 1.3, flex: 1 }}>{q.question}</h2>
          <QuestionMedia type={q.type} media={q.media} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {q.options.map((opt, i) => (
            <AnswerOption key={i} index={i} selected={choice === i} onClick={() => !feedback && setChoice(i)}>
              {opt}
            </AnswerOption>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" size="lg" disabled={choice == null || !!feedback} iconRight={<ArrowRight size={22} />} onClick={() => commit(choice)}>
            {turnIndex + 1 === total ? '送出，看結果' : '送出這一題'}
          </Button>
        </div>
      </div>

      {/* answer feedback — never reveals the correct option */}
      {feedback && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ animation: 'rpgPop .35s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '26px 40px', borderRadius: 'var(--r-xl)', background: 'var(--surface)', boxShadow: 'var(--shadow-xl)', border: `3px solid ${feedback.correct ? 'var(--correct)' : 'var(--wrong)'}` }}>
            {feedback.dropped ? (
              <>
                <SpecialtyIcon emoji={meta.specialty.emoji} size={64} />
                <div style={{ fontWeight: 900, fontSize: 'var(--fs-h3)', color: 'var(--correct)' }}>打中了！+1 {meta.specialty.name}</div>
              </>
            ) : feedback.correct ? (
              <div style={{ fontWeight: 900, fontSize: 'var(--fs-h3)', color: 'var(--correct)' }}>答對了！</div>
            ) : (
              <>
                <div style={{ fontSize: 56 }}>💨</div>
                <div style={{ fontWeight: 900, fontSize: 'var(--fs-h3)', color: 'var(--wrong)' }}>可惜，沒打中！</div>
              </>
            )}
          </div>
        </div>
      )}

      {paused && <PauseOverlay onResume={togglePause} />}
    </div>
  )
}
