import { Play, Trash2 } from 'lucide-react'
import type { CampaignState } from '../lib/types'
import type { CityMeta } from '../lib/cities'
import { WUKONG_EMOJI } from '../lib/cities'
import { Button } from '../ds'

/** 首頁存檔列：點資訊區看正確率，右側可繼續／刪除。 */
export function SaveRow({
  save, cities, onContinue, onReport, onDelete
}: {
  save: CampaignState
  cities: CityMeta[]
  onContinue: () => void
  onReport: () => void
  onDelete: () => void
}) {
  const meta = cities[Math.min(save.cityIndex, cities.length - 1)]
  const cs = meta ? save.cities[meta.region] : undefined
  const cleared = cs?.cleared
  const status = cleared
    ? '✓ 已通關'
    : `第 ${cs?.round ?? 1} 局・${meta?.specialty.emoji ?? ''}${cs?.collected ?? 0}/${save.target}`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* tap the info area to view this save's accuracy report */}
      <button
        onClick={onReport}
        title="查看此存檔的答題正確率"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'var(--font-sans)' }}
      >
        <span style={{ fontSize: 32 }}>{cleared ? WUKONG_EMOJI : meta?.general.emoji}</span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontWeight: 800, color: 'var(--text)' }}>{save.name}</span>
          <span style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
            {meta?.region ?? '—'}・{status}・{save.roster.length} 人 · 📊 看正確率
          </span>
        </span>
      </button>
      <Button variant="primary" iconLeft={<Play size={18} />} onClick={onContinue}>繼續</Button>
      <Button variant="ghost" iconLeft={<Trash2 size={18} />} onClick={onDelete} style={{ color: 'var(--wrong)' }}>刪除</Button>
    </div>
  )
}
