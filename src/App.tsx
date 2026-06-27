import { useEffect } from 'react'
import { useGame } from './state/gameStore'
import { HomeScreen } from './screens/HomeScreen'
import { RosterScreen } from './screens/RosterScreen'
import { CityIntroScreen } from './screens/CityIntroScreen'
import { EncounterScreen } from './screens/EncounterScreen'
import { QuizScreen } from './screens/QuizScreen'
import { TurnResultScreen } from './screens/TurnResultScreen'
import { RoundEndScreen } from './screens/RoundEndScreen'
import { CityClearedScreen } from './screens/CityClearedScreen'
import { GameWonScreen } from './screens/GameWonScreen'
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
    case 'teacher':
      return <HomeScreen />
    case 'roster':
      return <RosterScreen />
    case 'cityIntro':
      return <CityIntroScreen />
    case 'encounter':
      return <EncounterScreen />
    case 'quiz':
      return <QuizScreen />
    case 'turnResult':
      return <TurnResultScreen />
    case 'roundEnd':
      return <RoundEndScreen />
    case 'cityCleared':
      return <CityClearedScreen />
    case 'gameWon':
      return <GameWonScreen />
    case 'report':
      return <AccuracyReportScreen />
    case 'history':
      return <HistoryScreen />
  }
}
