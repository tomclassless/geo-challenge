// Theme metadata for the adventure. Every question-bank tab (region) becomes a
// selectable challenge; its 天兵 / 特產 / colour are resolved from the templates
// below by matching keywords in the tab name. This means a teacher can add NEW
// themes simply by adding a new tab in the Google Sheet (e.g. 「玉山國家公園」、
// 「阿里山國家森林」) — no code change needed. The six 都 and the national-park /
// national-forest themes have bespoke styling; anything else gets a generic
// guardian. Swap the emoji here for <img>/SVG when real art is ready.

export interface CityMeta {
  /** The question-bank tab name — the theme's unique id. */
  region: string
  /** Template key (used to pick the pixel sprite); '' for the generic guardian. */
  short: string
  /** Play / list order. */
  order: number
  general: {
    name: string
    emoji: string
    /** Theme colour. */
    color: string
  }
  specialty: {
    name: string
    emoji: string
  }
  /** One-line story shown when entering the theme. */
  intro: string
}

export const WUKONG_EMOJI = '🐵'
export const BUDDHA_EMOJI = '🖐️'

interface Template {
  key: string
  /** matched as a substring of the tab name; [] means "fallback / matches nothing automatically". */
  keywords: string[]
  order: number
  general: { name: string; emoji: string; color: string }
  specialty: { name: string; emoji: string }
  intro: (region: string) => string
}

const TEMPLATES: Template[] = [
  { key: '桃園', keywords: ['桃園'], order: 0,
    general: { name: '海龍王', emoji: '🐉', color: '#1C7ED6' }, specialty: { name: '壽桃', emoji: '🍑' },
    intro: () => '孫悟空一個筋斗來到桃園，海龍王翻江倒海擋住去路！' },
  { key: '台北', keywords: ['台北', '臺北'], order: 1,
    general: { name: '托塔李天王', emoji: '🗼', color: '#B8860B' }, specialty: { name: '鳳梨酥', emoji: '🍍' },
    intro: () => '進入台北，托塔李天王高舉寶塔，要把大聖收進塔中！' },
  { key: '新北', keywords: ['新北'], order: 2,
    general: { name: '哪吒', emoji: '🔥', color: '#E8590C' }, specialty: { name: '金牛角', emoji: '🥐' },
    intro: () => '來到新北，三太子哪吒踩著風火輪殺了過來！' },
  { key: '台中', keywords: ['台中', '臺中'], order: 3,
    general: { name: '二郎神', emoji: '👁️', color: '#2F9E44' }, specialty: { name: '太陽餅', emoji: '🥮' },
    intro: () => '抵達台中，二郎神睜開天眼，要看穿大聖的七十二變！' },
  { key: '台南', keywords: ['台南', '臺南'], order: 4,
    general: { name: '閻羅王', emoji: '⚖️', color: '#495057' }, specialty: { name: '棺材板', emoji: '🍞' },
    intro: () => '走進台南，閻羅王翻開生死簿，攔下這隻頑皮的猴子！' },
  { key: '高雄', keywords: ['高雄'], order: 5,
    general: { name: '太上老君', emoji: '☯️', color: '#7048E8' }, specialty: { name: '牛肉麵', emoji: '🍜' },
    intro: () => '最後一站高雄，太上老君祭出八卦爐，這是逃離掌心的最後關卡！' },
  { key: '國家公園', keywords: ['國家公園'], order: 6,
    general: { name: '山神', emoji: '⛰️', color: '#2F8F6B' }, specialty: { name: '神木毬果', emoji: '🌰' },
    intro: (r) => `孫悟空闖進 ${r}，鎮守山林的山神現身阻擋！` },
  { key: '國家森林', keywords: ['國家森林', '森林'], order: 7,
    general: { name: '樹精', emoji: '🌳', color: '#2F9E44' }, specialty: { name: '山林野莓', emoji: '🫐' },
    intro: (r) => `深入 ${r}，千年樹精伸出枝枒，要把大聖困在林中！` }
]

const GENERIC: Template = {
  key: '', keywords: [], order: 99,
  general: { name: '守關天兵', emoji: '🛡️', color: '#5B72C4' }, specialty: { name: '特產', emoji: '🎁' },
  intro: (r) => `孫悟空來到 ${r}，守關天兵擋住了去路！`
}

/** Resolve a theme for a given question-bank tab name. */
export function themeFor(region: string): CityMeta {
  const t = TEMPLATES.find((tpl) => tpl.keywords.some((k) => region.includes(k))) ?? GENERIC
  return {
    region,
    short: t.key,
    order: t.order,
    general: t.general,
    specialty: t.specialty,
    intro: t.intro(region)
  }
}

/** Build the ordered list of playable themes from the question-bank tab names. */
export function themesFromRegions(regionNames: string[]): CityMeta[] {
  return regionNames
    .map((name, i) => {
      const m = themeFor(name)
      return { ...m, order: m.order * 1000 + i } // group by template, keep stable within group
    })
    .sort((a, b) => a.order - b.order)
}
