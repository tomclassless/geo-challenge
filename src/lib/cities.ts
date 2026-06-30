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
    general: { name: '二郎神', emoji: '👁️', color: '#3E6FA8' }, specialty: { name: '太陽餅', emoji: '🥮' },
    intro: () => '抵達台中，二郎神睜開天眼，要看穿大聖的七十二變！' },
  { key: '台南', keywords: ['台南', '臺南'], order: 4,
    general: { name: '閻羅王', emoji: '⚖️', color: '#495057' }, specialty: { name: '棺材板', emoji: '🍞' },
    intro: () => '走進台南，閻羅王翻開生死簿，攔下這隻頑皮的猴子！' },
  { key: '高雄', keywords: ['高雄'], order: 5,
    general: { name: '太上老君', emoji: '☯️', color: '#7048E8' }, specialty: { name: '牛肉麵', emoji: '🍜' },
    intro: () => '來到高雄，太上老君祭出八卦爐，要把大聖煉進爐中！' },

  // --- 國家公園（特定，須排在通用「國家公園」之前） ---
  { key: '雪霸', keywords: ['雪霸'], order: 6,
    general: { name: '櫻花鉤吻鮭', emoji: '🐟', color: '#3E7E9E' }, specialty: { name: '高山烏龍茶', emoji: '🍵' },
    intro: (r) => `孫悟空闖進 ${r}，國寶魚櫻花鉤吻鮭翻起清冽溪水阻擋去路！` },
  { key: '陽明山', keywords: ['陽明山'], order: 7,
    general: { name: '台灣藍鵲', emoji: '🐦', color: '#2456C6' }, specialty: { name: '箭筍', emoji: '🎋' },
    intro: (r) => `來到 ${r}，台灣藍鵲振翅長鳴，要把大聖趕出火山林！` },
  { key: '玉山', keywords: ['玉山'], order: 8,
    general: { name: '台灣黑熊', emoji: '🐻', color: '#4B4B55' }, specialty: { name: '青梅', emoji: '🍈' },
    intro: (r) => `登上 ${r}，台灣黑熊張開胸前白月牙，擋在最高峰前！` },
  { key: '台江', keywords: ['台江'], order: 9,
    general: { name: '黑面琵鷺', emoji: '🦢', color: '#3E8E9C' }, specialty: { name: '虱目魚', emoji: '🐟' },
    intro: (r) => `飛入 ${r}，越冬的黑面琵鷺成群擋住濕地！` },
  { key: '壽山', keywords: ['壽山'], order: 10,
    general: { name: '台灣獼猴', emoji: '🐒', color: '#8A6A44' }, specialty: { name: '桶仔雞', emoji: '🍗' },
    intro: (r) => `攀上 ${r}，成群台灣獼猴張牙舞爪向大聖討食！` },

  // --- 通用分類（未指定的公園/森林落在這裡） ---
  { key: '國家公園', keywords: ['國家公園'], order: 11,
    general: { name: '山神', emoji: '⛰️', color: '#2F8F6B' }, specialty: { name: '神木毬果', emoji: '🌰' },
    intro: (r) => `孫悟空闖進 ${r}，鎮守山林的山神現身阻擋！` },
  { key: '國家森林', keywords: ['國家森林', '森林'], order: 12,
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
