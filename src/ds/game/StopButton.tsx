import { Pause, Play } from 'lucide-react'

/** Top-right停止鍵. Toggles pause; while paused the question/answers are hidden
 *  and the timer is frozen (handled by the screen via PauseOverlay). */
export function StopButton({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={paused ? '繼續' : '停止'}
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        minHeight: 'var(--hit-min)',
        borderRadius: 'var(--r-pill)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontWeight: 800,
        fontSize: 'var(--fs-body)',
        color: '#fff',
        background: paused ? 'var(--correct)' : 'var(--wrong)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {paused ? <Play size={20} /> : <Pause size={20} />}
      {paused ? '繼續' : '停止'}
    </button>
  )
}
