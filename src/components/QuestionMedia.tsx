import { useEffect, useState } from 'react'
import { resolveMediaSrc, youTubeId } from '../lib/media'
import type { QuestionType } from '../lib/types'

interface Props {
  type: QuestionType
  media: string
}

const frame: React.CSSProperties = {
  borderRadius: 'var(--r-md)',
  overflow: 'hidden',
  border: '1px solid var(--border)',
  background: 'var(--surface-sunken)',
  boxShadow: 'var(--shadow-sm)',
  flexShrink: 0,
}

/** Resolve a media value to a displayable src, preferring the offline cache.
 *  Revokes the object URL on unmount / media change (only blob: URLs need it). */
function useMediaSrc(media: string): string | null {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    let revoked = false
    let current = ''
    setSrc(null)
    resolveMediaSrc(media).then((s) => {
      if (revoked) {
        if (s.startsWith('blob:')) URL.revokeObjectURL(s)
        return
      }
      current = s
      setSrc(s)
    })
    return () => {
      revoked = true
      if (current.startsWith('blob:')) URL.revokeObjectURL(current)
    }
  }, [media])
  return src
}

/** Renders the question's image or video in a Roam rounded frame. */
export function QuestionMedia({ type, media }: Props) {
  // YouTube links are always http URLs — no cache lookup needed, resolve synchronously.
  const yt = type === 'video' ? youTubeId(media) : ''
  const src = useMediaSrc(media)

  if (!media.trim()) return null

  if (type === 'video') {
    return (
      <div style={{ ...frame, width: 360, aspectRatio: '16 / 9' }}>
        {yt ? (
          <iframe
            style={{ width: '100%', height: '100%', border: 0 }}
            src={'https://www.youtube.com/embed/' + yt}
            title="影片"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : src ? (
          <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={src} controls playsInline />
        ) : null}
      </div>
    )
  }

  return (
    <div style={{ ...frame, maxWidth: 360 }}>
      {src ? (
        <img style={{ display: 'block', maxWidth: '100%', maxHeight: 260 }} src={src} alt="" />
      ) : (
        <div style={{ width: 360, maxWidth: '100%', height: 200 }} />
      )}
    </div>
  )
}
