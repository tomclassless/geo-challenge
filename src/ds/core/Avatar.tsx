import type { CSSProperties } from 'react'

interface Props {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  style?: CSSProperties
}

/**
 * Roundel avatar built from a name — deterministic warm color + initial(s).
 * For CJK names shows the last 1 character; for Latin shows the first letter.
 * Sizes sm | md | lg | xl.
 */
export function Avatar({ name = '', size = 'md', style }: Props) {
  const dim = { sm: 36, md: 48, lg: 64, xl: 88 }[size]
  const fs = { sm: 15, md: 20, lg: 26, xl: 38 }[size]

  const palette: [string, string][] = [
    ['var(--teal-100)', 'var(--teal-700)'],
    ['var(--amber-100)', 'var(--amber-600)'],
    ['var(--green-100)', 'var(--green-700)'],
    ['var(--red-100)', 'var(--red-600)'],
    ['#DDE3F7', 'var(--opt-indigo)'],
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  const [bg, fg] = palette[h % palette.length]

  const isCJK = /[㐀-鿿]/.test(name)
  const glyph = name ? (isCJK ? name.slice(-1) : name.slice(0, 1).toUpperCase()) : '?'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        borderRadius: 'var(--r-pill)',
        background: bg,
        color: fg,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--w-bold)' as unknown as number,
        fontSize: fs,
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
    >
      {glyph}
    </span>
  )
}
