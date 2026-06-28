import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '../core/Button'
import { PinInput } from './PinInput'
import { Modal } from '../shell/Modal'

interface Props {
  /** 正確的老師 PIN（呼叫端傳 config.teacherPin）。 */
  pin: string
  /** 閘門標題，例如「老師報表」「設定」。 */
  title: string
  /** modal：包在 Modal 內（設定／媒體管理）；fullscreen：整頁置中（老師報表）。 */
  variant?: 'modal' | 'fullscreen'
  /** 輸入正確時呼叫，由呼叫端把自己的 authed 設為 true。 */
  onPass: () => void
  /** 按「返回」時呼叫（關閉 Modal 或回首頁）。 */
  onCancel: () => void
}

/**
 * 老師 PIN 驗證閘。輸入正確 → onPass；錯誤 → 閃紅 600ms 後清空重來。
 * 自管輸入與錯誤狀態；呼叫端只需保留 `authed`（初值 `!config.teacherPin`，
 * 沒設 PIN 時自動放行）來決定是否顯示本閘。
 */
export function PinGate({ pin, title, variant = 'modal', onPass, onCancel }: Props) {
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)

  const complete = (v: string) => {
    if (v === pin) { setError(false); onPass() }
    else { setError(true); setTimeout(() => { setEntry(''); setError(false) }, 600) }
  }

  const body = (
    <>
      <div style={{ width: 64, height: 64, borderRadius: 'var(--r-lg)', background: 'var(--brand-soft)', display: 'grid', placeItems: 'center', color: 'var(--brand-strong)' }}>
        <Lock size={30} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>{title}</h2>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>請輸入老師 PIN</p>
      </div>
      <PinInput value={entry} error={error} onChange={setEntry} onComplete={complete} />
      <Button variant="ghost" onClick={onCancel}>返回</Button>
    </>
  )

  if (variant === 'fullscreen') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: 'var(--bg)' }}>
        {body}
      </div>
    )
  }
  return (
    <Modal onClose={onCancel} width={420}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '8px 0' }}>
        {body}
      </div>
    </Modal>
  )
}
