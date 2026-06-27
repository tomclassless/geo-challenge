import { Play, LogOut } from 'lucide-react'
import { PixelWukong } from './PixelSprites'

/** Full-cover overlay shown while停止. Completely hides the question and answers;
 *  the timer is frozen by the screen while this is up. Shows 孫悟空 napping, with
 *  a resume button and an "end this round" button. */
export function PauseOverlay({ onResume, onEnd }: { onResume: () => void; onEnd: () => void }) {
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
        gap: 18,
        color: '#fff',
        textAlign: 'center'
      }}
    >
      {/* napping 孫悟空 with floating Zzz */}
      <div style={{ position: 'relative', animation: 'rpgFloat 3.4s ease-in-out infinite' }}>
        <PixelWukong size={168} sleeping />
        <span style={{ position: 'absolute', right: 6, top: 0, fontSize: 26, animation: 'zzzFloat 2.6s ease-in-out infinite' }}>💤</span>
        <span style={{ position: 'absolute', right: 24, top: 6, fontSize: 18, animation: 'zzzFloat 2.6s ease-in-out infinite', animationDelay: '1.3s' }}>💤</span>
      </div>

      <div style={{ fontWeight: 900, fontSize: 'var(--fs-h1, 40px)' }}>遊戲暫停中</div>
      <p style={{ margin: 0, fontSize: 'var(--fs-title)', opacity: 0.85 }}>
        孫悟空先打個盹，題目與答案已隱藏、計時已暫停。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6, width: 280 }}>
        <button
          onClick={onResume}
          style={{
            padding: '14px 28px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--fs-title)',
            color: 'var(--text)', background: '#fff', boxShadow: 'var(--shadow-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          <Play size={22} /> 繼續遊戲
        </button>
        <button
          onClick={onEnd}
          style={{
            padding: '12px 28px', borderRadius: 'var(--r-pill)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--fs-body)',
            color: '#fff', background: 'transparent', border: '2px solid rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          <LogOut size={20} /> 結束此局
        </button>
      </div>
    </div>
  )
}
