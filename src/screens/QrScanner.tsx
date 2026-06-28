import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Modal } from '../ds/shell/Modal'
import { Button } from '../ds'

/**
 * Camera-based QR scanner for iPad Safari. Safari has no native BarcodeDetector,
 * so we pull frames from a getUserMedia stream onto a canvas and decode them
 * with jsQR. Calls onResult with the raw decoded text on the first read.
 */
export function QrScanner({ onResult, onClose }: { onResult: (text: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream: MediaStream | null = null
    let raf = 0
    let done = false

    const tick = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!done && video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (ctx) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
          if (code && code.data) {
            done = true
            onResult(code.data)
            return
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError('此裝置或瀏覽器不支援相機（需用 https 開啟）。')
          return
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        video.setAttribute('playsinline', 'true')
        await video.play()
        raf = requestAnimationFrame(tick)
      } catch (e) {
        const name = e instanceof DOMException ? e.name : ''
        setError(
          name === 'NotAllowedError'
            ? '相機權限被拒絕，請到瀏覽器設定允許相機。'
            : '無法開啟相機：' + (e instanceof Error ? e.message : String(e)),
        )
      }
    }

    void start()
    return () => {
      done = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [onResult])

  return (
    <Modal onClose={onClose} width={460}>
      <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'var(--fs-h2)' }}>掃描 QR Code</h2>
      {error ? (
        <p style={{ margin: 0, color: 'var(--wrong)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>{error}</p>
      ) : (
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
          把後端網址的 QR Code 對準框內，讀到就會自動填入。
        </p>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#000',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
          display: error ? 'none' : 'block',
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* targeting frame */}
        <div
          style={{
            position: 'absolute',
            inset: '15%',
            border: '3px solid rgba(255,255,255,0.85)',
            borderRadius: 'var(--r-md)',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
          }}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>取消</Button>
      </div>
    </Modal>
  )
}
