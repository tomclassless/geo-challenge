// Single source of truth for the RPG theme: the six cities Sun Wukong visits,
// their guardian heavenly soldier (天兵), the local specialty he knocks loose,
// and a theme colour. Swap the emoji here for <img>/SVG when real art arrives —
// nothing else in the app hard-codes a general or a specialty.

export interface CityMeta {
  /** Canonical city name. */
  region: string
  /** Short form used to match against the question-bank region name. */
  short: string
  /** Play order, north → south around the island, starting from Taoyuan. */
  order: number
  general: {
    /** 天兵 name. */
    name: string
    emoji: string
    /** Theme colour for this city's encounter. */
    color: string
  }
  specialty: {
    name: string
    emoji: string
  }
  /** One-line story shown when entering the city. */
  intro: string
}

export const WUKONG_EMOJI = '🐵'
export const BUDDHA_EMOJI = '🖐️'

export const CITIES: CityMeta[] = [
  {
    region: '桃園市', short: '桃園', order: 0,
    general: { name: '海龍王', emoji: '🐉', color: '#1C7ED6' },
    specialty: { name: '壽桃', emoji: '🍑' },
    intro: '孫悟空一個筋斗來到桃園，海龍王翻江倒海擋住去路！'
  },
  {
    region: '台北市', short: '台北', order: 1,
    general: { name: '托塔李天王', emoji: '🗼', color: '#B8860B' },
    specialty: { name: '鳳梨酥', emoji: '🍍' },
    intro: '進入台北，托塔李天王高舉寶塔，要把大聖收進塔中！'
  },
  {
    region: '新北市', short: '新北', order: 2,
    general: { name: '哪吒', emoji: '🔥', color: '#E8590C' },
    specialty: { name: '金牛角', emoji: '🥐' },
    intro: '來到新北，三太子哪吒踩著風火輪殺了過來！'
  },
  {
    region: '台中市', short: '台中', order: 3,
    general: { name: '二郎神', emoji: '👁️', color: '#2F9E44' },
    specialty: { name: '太陽餅', emoji: '🥮' },
    intro: '抵達台中，二郎神睜開天眼，要看穿大聖的七十二變！'
  },
  {
    region: '台南市', short: '台南', order: 4,
    general: { name: '閻羅王', emoji: '⚖️', color: '#495057' },
    specialty: { name: '棺材板', emoji: '🍞' },
    intro: '走進台南，閻羅王翻開生死簿，攔下這隻頑皮的猴子！'
  },
  {
    region: '高雄市', short: '高雄', order: 5,
    general: { name: '太上老君', emoji: '☯️', color: '#7048E8' },
    specialty: { name: '牛肉麵', emoji: '🍜' },
    intro: '最後一站高雄，太上老君祭出八卦爐，這是逃離掌心的最後關卡！'
  }
]

/** Match a question-bank region name (e.g. "桃園（範例）", "桃園", "桃園市") to a city. */
export function findCity(regionName: string | null | undefined): CityMeta | undefined {
  if (!regionName) return undefined
  return CITIES.find((c) => regionName.includes(c.short))
}
