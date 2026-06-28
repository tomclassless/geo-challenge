import { useEffect, useState } from 'react'
import { Upload, Check, CloudDownload, Video } from 'lucide-react'
import { useGame } from '../state/gameStore'
import { blobToBase64, compressImage, isBareFilename, normalizeMediaKey } from '../lib/media'
import { uploadQuestionMedia, setQuestionMedia as setQuestionMediaApi } from '../lib/sheetsApi'
import { listMediaNames, loadBanks, saveMedia } from '../lib/offlineStore'
import { Button, Badge, PinGate } from '../ds'
import { Modal } from '../ds/shell/Modal'

export function MediaManagerModal({ onClose }: { onClose: () => void }) {
  const config = useGame((s) => s.config)
  const regions = useGame((s) => s.regions)
  const setQMedia = useGame((s) => s.setQuestionMedia)

  // Same PIN gate as the settings modal (auto-passes before the first sync).
  const [authed, setAuthed] = useState(!config.teacherPin)

  const [localSet, setLocalSet] = useState<Set<string>>(new Set())
  const [cloudSet, setCloudSet] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<string | null>(null) // rowKey of the question being saved
  const [error, setError] = useState('')
  const [ytFor, setYtFor] = useState<string | null>(null) // rowKey whose YouTube input is open
  const [ytUrl, setYtUrl] = useState('')

  const rowKey = (region: string, id: string) => region + ' ' + id

  const refresh = async () => {
    const local = await listMediaNames()
    setLocalSet(new Set(local))
    const banks = await loadBanks()
    setCloudSet(new Set((banks?.mediaIndex ?? []).map((m) => m.name)))
  }
  useEffect(() => { void refresh() }, [])

  const onUpload = async (region: string, id: string, file: File | undefined) => {
    if (!file) return
    setError('')
    setBusy(rowKey(region, id))
    try {
      const blob = await compressImage(file)
      const base64 = await blobToBase64(blob)
      const res = await uploadQuestionMedia(region, id, 'image/jpeg', base64)
      if (!res.ok || !res.name) throw new Error(res.error || '上傳失敗')
      await saveMedia(res.name, blob, 'image/jpeg', res.updatedAt ?? '')
      await setQMedia(region, id, res.name, 'image')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗')
    } finally {
      setBusy(null)
    }
  }

  const onSetVideo = async (region: string, id: string) => {
    const url = ytUrl.trim()
    if (!url) return
    setError('')
    setBusy(rowKey(region, id))
    try {
      const res = await setQuestionMediaApi(region, id, url, 'video')
      if (!res.ok) throw new Error(res.error || '更新失敗')
      await setQMedia(region, id, url, 'video')
      setYtFor(null)
      setYtUrl('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setBusy(null)
    }
  }

  if (!authed) {
    return <PinGate pin={config.teacherPin} title="題目圖片影片管理" onPass={() => setAuthed(true)} onCancel={onClose} />
  }

  /** Status badge for one question, based on its current media/type. */
  const statusBadge = (media: string, type: string) => {
    if (type === 'video') {
      return media
        ? <Badge tone="correct" soft><Video size={14} style={{ verticalAlign: '-2px' }} /> 已設定影片</Badge>
        : <Badge tone="wrong" soft>需設定影片</Badge>
    }
    if (!media.trim()) return <Badge tone="neutral" soft>未設定</Badge>
    if (!isBareFilename(media)) return <Badge tone="neutral" soft>使用網址</Badge>
    const key = normalizeMediaKey(media)
    if (localSet.has(key)) return <Badge tone="correct" soft><Check size={14} style={{ verticalAlign: '-2px' }} /> 已可離線</Badge>
    if (cloudSet.has(key)) return <Badge tone="neutral" soft><CloudDownload size={14} style={{ verticalAlign: '-2px' }} /> 雲端有・同步即可</Badge>
    return <Badge tone="wrong" soft>需上傳</Badge>
  }

  return (
    <Modal onClose={onClose} width={680}>
      <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>題目圖片影片管理</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: '6px 0 0', lineHeight: 1.6 }}>
        直接選題目上傳圖片，App 會自動把檔名寫回 Google 試算表（不用手動填 media 欄）。
        影片請貼 YouTube 連結。上傳的圖片同步後即可離線顯示。
      </p>

      {regions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>還沒有題庫，請先「雲端同步」下載題庫。</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '14px 0', maxHeight: 440, overflowY: 'auto' }}>
          {regions.map((region) => (
            <div key={region.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{region.name}</span>
              {region.questions.map((q) => {
                const key = rowKey(region.name, q.id)
                const isBusy = busy === key
                return (
                  <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ flex: 1, minWidth: 0, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={q.question}>
                        {q.question || '（無題目文字）'}
                      </span>
                      {statusBadge(q.media, q.type)}
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <label
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-sans)', fontWeight: 'var(--w-bold)' as unknown as number,
                          fontSize: 'var(--fs-sm)', padding: '8px 14px', borderRadius: 'var(--r-sm)',
                          cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? 0.45 : 1,
                          background: 'var(--brand)', color: 'var(--text-on-brand)', boxShadow: '0 4px 0 var(--teal-700)'
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          disabled={isBusy}
                          onChange={(e) => void onUpload(region.name, q.id, e.target.files?.[0])}
                        />
                        <Upload size={16} />
                        {isBusy ? '處理中…' : '上傳圖片'}
                      </label>
                      <Button
                        variant="ghost"
                        iconLeft={<Video size={16} />}
                        disabled={isBusy}
                        onClick={() => { setYtFor(ytFor === key ? null : key); setYtUrl(q.type === 'video' ? q.media : '') }}
                      >
                        設定影片
                      </Button>
                    </div>
                    {ytFor === key && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          value={ytUrl}
                          placeholder="貼上 YouTube 連結"
                          onChange={(e) => setYtUrl(e.target.value)}
                          style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-sm)', padding: 10, border: '2px solid var(--border-strong)', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-sans)' }}
                        />
                        <Button variant="primary" disabled={isBusy} onClick={() => void onSetVideo(region.name, q.id)}>確定</Button>
                        <Button variant="ghost" onClick={() => { setYtFor(null); setYtUrl('') }}>取消</Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'var(--wrong)', fontSize: 'var(--fs-sm)', margin: 0 }}>{error}</p>}
      <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-xs)', margin: '4px 0 0', lineHeight: 1.5 }}>
        圖片會自動縮圖再上傳，並把檔名與類型寫回試算表。iPhone 拍的 HEIC 若無法上傳，請改存成 JPG/PNG。
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
        <Button variant="primary" onClick={onClose}>完成</Button>
      </div>
    </Modal>
  )
}
