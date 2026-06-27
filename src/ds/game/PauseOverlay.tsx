import { Pause } from 'lucide-react'

/** Full-cover overlay shown while停止. It completely hides the question and
 *  answers behind it; the timer is frozen by the screen while this is up. */
export function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        background: 'var(--overlay)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        color: '#fff',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.16)',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <Pause size={48} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 'var(--fs-h1, 40px)' }}>遊戲暫停中</div>
      <p style={{ margin: 0, fontSize: 'var(--fs-title)', opacity: 0.85 }}>
        題目與答案已隱藏，計時已暫停。
      </p>
      <button
        onClick={onResume}
        style={{
          marginTop: 8,
          padding: '14px 36px',
          borderRadius: 'var(--r-pill)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          fontSize: 'var(--fs-title)',
          color: 'var(--text)',
          background: '#fff',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        ▶ 繼續遊戲
      </button>
    </div>
  )
}
