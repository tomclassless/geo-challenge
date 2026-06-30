import { useState } from 'react'
import { Button } from '../ds'
import { Modal } from '../ds/shell/Modal'

/** Share the game itself — the plain site URL WITHOUT the ?api= backend param,
 *  so the teacher's question bank / Google Sheet is never shared. */
export function ShareModal({ onClose }: { onClose: () => void }) {
  // origin + pathname strips ?api=... and #hash → no backend, no question bank
  const url = window.location.origin + window.location.pathname
  const [msg, setMsg] = useState('')
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setMsg('已複製連結 ✓')
    } catch {
      setMsg('複製失敗，請手動選取上方連結複製')
    }
  }

  const share = async () => {
    try {
      await navigator.share({ title: '孫悟空逃離如來佛祖掌心', text: '台灣六都地理大冒險', url })
    } catch {
      /* user cancelled or unsupported */
    }
  }

  return (
    <Modal onClose={onClose} width={560}>
      <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>分享此遊戲</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0, lineHeight: 1.6 }}>
        把遊戲連結分享給其他老師或裝置。這個連結<b>不包含你的題庫與 Google 試算表</b>；
        對方開啟後可先按「載入範例題庫」試玩，或設定他們自己的後端網址。
      </p>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        style={{
          fontSize: 'var(--fs-body)', padding: 14, border: '2px solid var(--border-strong)',
          borderRadius: 'var(--r-md)', width: '100%', fontFamily: 'var(--font-mono)'
        }}
      />
      {msg && <p style={{ margin: 0, color: 'var(--correct)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{msg}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Button variant="ghost" onClick={onClose}>關閉</Button>
        {canShare && <Button variant="secondary" onClick={() => void share()}>用裝置分享…</Button>}
        <Button variant="primary" onClick={() => void copy()}>複製連結</Button>
      </div>
    </Modal>
  )
}
