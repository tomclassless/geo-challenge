import { resolveMedia, youTubeId } from '../lib/media'
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

/** Renders the question's image or video in a Roam rounded frame. */
export function QuestionMedia({ type, media }: Props) {
  const src = resolveMedia(media)
  if (!src) return null

  if (type === 'video') {
    const yt = youTubeId(src)
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
        ) : (
          <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={src} controls playsInline />
        )}
      </div>
    )
  }

  return (
    <div style={{ ...frame, maxWidth: 360 }}>
      <img style={{ display: 'block', maxWidth: '100%', maxHeight: 260 }} src={src} alt="" />
    </div>
  )
}
