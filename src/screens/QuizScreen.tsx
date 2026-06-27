import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { QuestionMedia } from '../components/QuestionMedia'
import { Avatar, TimerBar, QuestionProgress, AnswerOption, Button } from '../ds'

export function QuizScreen() {
  const { playable, index, config, lastResult, answer } = useGame()
  const q = playable[index]
  const total = playable.length

  const [remaining, setRemaining] = useState(config.timerSeconds)
  const [choice, setChoice] = useState<number | null>(null)
  const answeredRef = useRef<number>(-1)

  // commit guard: a tap and the timer must not both answer the same question
  const commit = (opt: number | null) => {
    if (answeredRef.current === index) return
    answeredRef.current = index
    void answer(opt)
  }

  // reset per question
  useEffect(() => {
    setRemaining(config.timerSeconds)
    setChoice(null)
  }, [index, config.timerSeconds])

  // tick
  useEffect(() => {
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
  }, [index])

  if (!q || !lastResult) return null

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 36px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Avatar name={lastResult.player} size="md" />
        <span style={{ fontWeight: 700, fontSize: 'var(--fs-title)' }}>{lastResult.player}</span>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <QuestionProgress current={index + 1} total={total} />
        </div>
      </div>

      {/* timer */}
      <div style={{ padding: '18px 36px 0' }}>
        <TimerBar remaining={remaining} total={config.timerSeconds} />
      </div>

      {/* question */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22, padding: '22px 36px 28px', maxWidth: 980, width: '100%', margin: '0 auto', boxSizing: 'border-box', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-h2)', lineHeight: 1.3, flex: 1 }}>
            {q.question}
          </h2>
          <QuestionMedia type={q.type} media={q.media} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {q.options.map((opt, i) => (
            <AnswerOption key={i} index={i} selected={choice === i} onClick={() => setChoice(i)}>
              {opt}
            </AnswerOption>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" size="lg" disabled={choice == null} iconRight={<ArrowRight size={22} />} onClick={() => commit(choice)}>
            {index + 1 === total ? '送出，看結果' : '下一題'}
          </Button>
        </div>
      </div>
    </div>
  )
}
