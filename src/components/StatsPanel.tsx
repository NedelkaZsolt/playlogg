import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatRow {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
}

const stats: StatRow[] = [
  { label: 'K/D arány',        value: '1.84',  trend: 'up' },
  { label: 'Győzelmi arány',   value: '62%',   trend: 'up' },
  { label: 'Pontszám/meccs',   value: '78.4',  trend: 'down' },
  { label: 'Meccsek száma',    value: '124',   trend: 'neutral' },
  { label: 'Headshot arány',   value: '41%',   trend: 'up' },
]

const trendColors = {
  up:      '#22c55e',
  down:    '#ef4444',
  neutral: '#56566e',
}

const TrendIcon = ({ trend }: { trend: StatRow['trend'] }) => {
  const size = 11
  const color = trendColors[trend]
  if (trend === 'up')      return <TrendingUp size={size} style={{ color }} />
  if (trend === 'down')    return <TrendingDown size={size} style={{ color }} />
  return <Minus size={size} style={{ color }} />
}

export function StatsPanel() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: '#141419',
        border: '1px solid #1e1e2a',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e1e2a' }}
      >
        <span className="text-[13px] font-semibold" style={{ color: '#d8d8e8' }}>
          Legutóbbi meccsek
        </span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: '#ff6b0015',
            color: '#ff6b00',
            border: '1px solid #ff6b0030',
          }}
        >
          CS2
        </span>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: '#56566e' }}>
              {stat.label}
            </span>
            <div className="flex items-center gap-1.5">
              <TrendIcon trend={stat.trend} />
              <span
                className="text-[12px] font-bold tabular-nums"
                style={{ color: trendColors[stat.trend] }}
              >
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1e1e2a' }}>
        <button
          className="w-full text-[12px] font-medium py-2 rounded-lg transition-colors duration-150"
          style={{
            background: '#1e1e2a',
            color: '#8888a8',
            border: '1px solid #282835',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = '#282835'
            el.style.color = '#eaeaf2'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = '#1e1e2a'
            el.style.color = '#8888a8'
          }}
        >
          Összes stat megtekintése →
        </button>
      </div>
    </div>
  )
}
