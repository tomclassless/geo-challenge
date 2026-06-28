import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { getApiUrl, setApiUrl, extractApiUrl } from '../lib/config'
import { Button, PinGate } from '../ds'
import { Modal } from '../ds/shell/Modal'
import { QrScanner } from './QrScanner'

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const config = useGame((s) => s.config)
  const [url, setUrl] = useState(getApiUrl())
  const [scanning, setScanning] = useState(false)

  // Lock settings behind the teacher PIN once one exists (synced from Config),
  // so children can't change the backend URL. Before the first sync there is no
  // PIN yet, so the gate auto-passes and initial setup still works.
  const [authed, setAuthed] = useState(!config.teacherPin)

  const onScanned = (text: string) => {
    const found = extractApiUrl(text)
    if (found) setUrl(found)
    setScanning(false)
  }

  if (!authed) {
    return <PinGate pin={config.teacherPin} title="設定" onPass={() => setAuthed(true)} onCancel={onClose} />
  }

  return (
    <Modal onClose={onClose} width={560}>
      <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>設定</h2>
      <label style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
        後端網址（Apps Script /exec 結尾）
      </label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        <input
          value={url}
          placeholder="https://script.google.com/macros/s/.../exec"
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-body)', padding: 14, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-md)', fontFamily: 'var(--font-sans)' }}
        />
        <Button variant="secondary" iconLeft={<QrCode size={20} />} onClick={() => setScanning(true)}>掃描</Button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
        可手動貼上，或按「掃描」用相機讀取後端網址的 QR Code。老師 PIN 與每題秒數請在 Google 試算表的 Config 分頁設定，同步後生效。
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>取消</Button>
        <Button variant="primary" onClick={() => { setApiUrl(url); onClose() }}>儲存</Button>
      </div>
      {scanning && <QrScanner onResult={onScanned} onClose={() => setScanning(false)} />}
    </Modal>
  )
}
