import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw } from 'lucide-react'

type Game = 'CS2' | 'Apex'

interface StatRow {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  bar?: number  // 0–100
}

interface CS2Stats {
  kd_ratio: number
  win_rate: number
  headshot_pct: number
  accuracy: number
  total_wins: number
  total_kills: number
  total_deaths: number
}

interface ApexStats {
  kd_ratio: number
  win_rate: number
  total_kills: number
  total_wins: number
  games_played: number
  damage_done: number
  revives: number
}

const GAME_CONFIG: Record<Game, { appId: string; color: string; endpoint: string }> = {
  CS2:  { appId: '730',     color: '#3b82f6', endpoint: 'cs2'  },
  Apex: { appId: '1172470', color: '#cc3333', endpoint: 'apex' },
}

const trendColor = { up: '#1ed760', down: '#e83c3c', neutral: '#52526a' }

function cs2ToRows(s: CS2Stats): StatRow[] {
  const kd = s.kd_ratio
  return [
    { label: 'K/D arány',      value: kd.toFixed(2),         trend: kd >= 1.5 ? 'up' : kd >= 1.0 ? 'neutral' : 'down', bar: Math.min(kd * 40, 100) },
    { label: 'Győzelmi arány', value: `${s.win_rate}%`,      trend: s.win_rate >= 55 ? 'up' : s.win_rate >= 45 ? 'neutral' : 'down', bar: s.win_rate },
    { label: 'Headshot %',     value: `${s.headshot_pct}%`,  trend: s.headshot_pct >= 40 ? 'up' : s.headshot_pct >= 25 ? 'neutral' : 'down', bar: Math.min(s.headshot_pct, 100) },
    { label: 'Pontosság',      value: `${s.accuracy}%`,      trend: s.accuracy >= 20 ? 'up' : 'neutral', bar: Math.min(s.accuracy * 2, 100) },
    { label: 'Győzelmek',      value: s.total_wins.toLocaleString(), trend: 'neutral', bar: Math.min((s.total_wins / 5000) * 100, 100) },
  ]
}

function apexToRows(s: ApexStats): StatRow[] {
  return [
    { label: 'Ölések',         value: s.total_kills.toLocaleString(),  trend: 'up',      bar: Math.min((s.total_kills / 50000) * 100, 100) },
    { label: 'Győzelmi arány', value: `${s.win_rate}%`,                trend: s.win_rate >= 10 ? 'up' : 'neutral', bar: Math.min(s.win_rate * 5, 100) },
    { label: 'Győzelmek',      value: s.total_wins.toLocaleString(),   trend: 'neutral', bar: Math.min((s.total_wins / 500) * 100, 100) },
    { label: 'Meccsek',        value: s.games_played.toLocaleString(), trend: 'neutral', bar: Math.min((s.games_played / 3000) * 100, 100) },
    { label: 'Mentések',       value: s.revives.toLocaleString(),      trend: 'neutral', bar: Math.min((s.revives / 5000) * 100, 100) },
  ]
}

function StatRowView({ s }: { s: StatRow }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px]" style={{ color: '#52526a' }}>{s.label}</span>
        <div className="flex items-center gap-1">
          {s.trend === 'up'      && <TrendingUp   size={10} style={{ color: trendColor.up }} />}
          {s.trend === 'down'    && <TrendingDown size={10} style={{ color: trendColor.down }} />}
          {s.trend === 'neutral' && <Minus        size={10} style={{ color: trendColor.neutral }} />}
          <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#c8c8dc' }}>
            {s.value}
          </span>
        </div>
      </div>
      {s.bar !== undefined && (
        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: '#1e1e2c' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${s.bar}%`,
              background: trendColor[s.trend],
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </div>
  )
}

export function StatsPanel({ steamId }: { steamId: string }) {
  const [selectedGame, setSelectedGame] = useState<Game>('CS2')
  const [rows,         setRows]         = useState<StatRow[] | null>(null)
  const [status,       setStatus]       = useState<'loading' | 'ok' | 'no_key' | 'private' | 'error'>('loading')

  useEffect(() => {
    if (!steamId) return
    setRows(null)
    setStatus('loading')

    const endpoint = GAME_CONFIG[selectedGame].endpoint
    fetch(`/api/steam-stats/${endpoint}/${steamId}`)
      .then(async (res) => {
        if (res.status === 503) { setStatus('no_key'); return }
        if (!res.ok)            { setStatus('error');  return }
        const data = await res.json()

        if (selectedGame === 'CS2')  setRows(cs2ToRows(data as CS2Stats))
        if (selectedGame === 'Apex') setRows(apexToRows(data as ApexStats))
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [steamId, selectedGame])

  const gameColor = GAME_CONFIG[selectedGame].color

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e2c' }}>
        <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Statisztikák</span>
        <div className="flex items-center gap-1.5">
          {(['CS2', 'Apex'] as Game[]).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded transition-all"
              style={selectedGame === g
                ? { background: `${GAME_CONFIG[g].color}18`, color: GAME_CONFIG[g].color, border: `1px solid ${GAME_CONFIG[g].color}30` }
                : { background: 'transparent', color: '#3e3e56', border: '1px solid transparent' }
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3.5" style={{ minHeight: '148px' }}>
        {status === 'loading' && (
          <div className="flex items-center justify-center h-24">
            <RefreshCw size={16} className="animate-spin" style={{ color: '#3e3e56' }} />
          </div>
        )}

        {status === 'no_key' && (
          <div className="space-y-1.5 py-2">
            <p className="text-[12px]" style={{ color: '#8a8aa0' }}>Steam API kulcs szükséges.</p>
            <p className="text-[11px]" style={{ color: '#52526a' }}>
              Állítsd be a <span style={{ color: '#c8c8dc' }}>STEAM_API_KEY</span> környezeti változót a szerveren, majd indítsd újra.
            </p>
            <a
              href="https://steamcommunity.com/dev/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px]"
              style={{ color: gameColor }}
            >
              API kulcs igénylése →
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-1 py-2">
            <p className="text-[12px]" style={{ color: '#8a8aa0' }}>Nem sikerült betölteni.</p>
            <p className="text-[11px]" style={{ color: '#52526a' }}>
              A Steam profil lehet privát, vagy a játék statisztikái nem elérhetők.
            </p>
          </div>
        )}

        {status === 'ok' && rows && rows.map((s) => (
          <StatRowView key={s.label} s={s} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <button
          className="flex items-center gap-1 text-[12px] font-medium transition-colors"
          style={{ color: '#3e3e56' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#3e3e56')}
        >
          Összes megtekintése <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
