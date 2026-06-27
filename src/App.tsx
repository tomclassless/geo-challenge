import { useEffect } from 'react'
import { useGame } from './state/gameStore'
import { HomeScreen } from './screens/HomeScreen'
import { NameEntryScreen } from './screens/NameEntryScreen'
import { QuizScreen } from './screens/QuizScreen'
import { PlayerResultScreen } from './screens/PlayerResultScreen'
import { AccuracyReportScreen } from './screens/AccuracyReportScreen'
import { HistoryScreen } from './screens/HistoryScreen'

export default function App() {
  const loaded = useGame((s) => s.loaded)
  const phase = useGame((s) => s.phase)
  const init = useGame((s) => s.init)

  useEffect(() => {
    void init()
  }, [init])

  if (!loaded) return <div className="center">載入中…</div>

  switch (phase) {
    case 'home':
      return <HomeScreen />
    case 'name':
      return <NameEntryScreen />
    case 'quiz':
      return <QuizScreen />
    case 'result':
      return <PlayerResultScreen />
    case 'report':
      return <AccuracyReportScreen />
    case 'history':
      return <HistoryScreen />
  }
}
