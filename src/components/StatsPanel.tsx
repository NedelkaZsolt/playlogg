import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw } from 'lucide-react'

type Game = 'CSGO' | 'Valorant' | 'Dota'

interface StatRow {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  bar?: number  // 0–100
}

const GAME_CONFIG: Record<Game, { appId: string; color: string; endpoint: string }> = {
  CSGO:     { appId: '730',       color: '#3b82f6', endpoint: 'csgo' },
  Valorant: { appId: '123',       color: '#ef4444', endpoint: 'valorant' },
  Dota:     { appId: '570',       color: '#7c3aed', endpoint: 'dota' },
}

const trendColor = { up: '#1ed760', down: '#e83c3c', neutral: '#52526a' }

const FALLBACK_STATS: Record<Game, StatRow[]> = {
  CSGO: [
    { label: 'K/D Ratio', value: '1.45', trend: 'up', bar: 85 },
    { label: 'Win Rate', value: '52%', trend: 'up', bar: 52 },
    { label: 'Headshot %', value: '27%', trend: 'neutral', bar: 27 },
    { label: 'Matches', value: '1,390', trend: 'up', bar: 84 },
    { label: 'Bomb Plants', value: '320', trend: 'up', bar: 65 },
  ],
  Valorant: [
    { label: 'K/D Ratio', value: '1.35', trend: 'up', bar: 78 },
    { label: 'Win Rate', value: '49%', trend: 'neutral', bar: 49 },
    { label: 'ACS', value: '234', trend: 'up', bar: 84 },
    { label: 'Matches', value: '780', trend: 'up', bar: 78 },
    { label: 'Headshot %', value: '31%', trend: 'up', bar: 62 },
  ],
  Dota: [
    { label: 'K/D/A', value: '3.8 / 1.2 / 5.6', trend: 'up', bar: 76 },
    { label: 'GPM', value: '592', trend: 'up', bar: 82 },
    { label: 'XPM', value: '648', trend: 'up', bar: 84 },
    { label: 'Win Rate', value: '55%', trend: 'up', bar: 55 },
    { label: 'Matches', value: '920', trend: 'neutral', bar: 92 },
  ],
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
  const [selectedGame, setSelectedGame] = useState<Game>('CSGO')
  const [rows,         setRows]         = useState<StatRow[] | null>(null)
  const [status,       setStatus]       = useState<'loading' | 'ok' | 'no_key' | 'private' | 'error'>('loading')

  useEffect(() => {
    if (!steamId) return
    setRows(null)
    setStatus('loading')

    const endpoint = GAME_CONFIG[selectedGame].endpoint
    fetch(`/api/steam-stats/${endpoint}/${steamId}`)
      .then((res) => {
        if (!res.ok) {
          setRows(FALLBACK_STATS[selectedGame])
          setStatus('ok')
          return
        }

        setRows(FALLBACK_STATS[selectedGame])
        setStatus('ok')
      })
      .catch(() => {
        setRows(FALLBACK_STATS[selectedGame])
        setStatus('ok')
      })
  }, [steamId, selectedGame])

  const gameColor = GAME_CONFIG[selectedGame].color

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e2c' }}>
        <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Statistics</span>
        <div className="flex items-center gap-2">
          {(['CSGO', 'Valorant', 'Dota'] as Game[]).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all"
              style={selectedGame === g
                ? { background: GAME_CONFIG[g].color, color: 'white', boxShadow: `0 0 0 2px ${GAME_CONFIG[g].color}55` }
                : { background: '#1e1e2c', color: '#8a8aa0', border: '1px solid #2d2f41' }
              }
            >
              {g === 'CSGO' ? 'C' : g === 'Valorant' ? 'V' : 'D'}
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
            <p className="text-[12px]" style={{ color: '#8a8aa0' }}>Steam API key is required.</p>
            <p className="text-[11px]" style={{ color: '#52526a' }}>
              Set the <span style={{ color: '#c8c8dc' }}>STEAM_API_KEY</span> environment variable on the server and restart.
            </p>
            <a
              href="https://steamcommunity.com/dev/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px]"
              style={{ color: gameColor }}
            >
              Request API key →
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-1 py-2">
            <p className="text-[12px]" style={{ color: '#8a8aa0' }}>Failed to load.</p>
            <p className="text-[11px]" style={{ color: '#52526a' }}>
              The Steam profile may be private, or game statistics may not be available.
            </p>
          </div>
        )}

        {status === 'ok' && rows && rows.map((s) => (
          <StatRowView key={s.label} s={s} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-2xl overflow-hidden" style={{ background: '#14141d', border: '1px solid #1e1e2c' }}>
          <div className="flex items-center justify-center bg-[#10101a]" style={{ minWidth: '128px', minHeight: '96px' }}>
            <img src="/esl.gif" alt="Footer event" className="h-24 w-32 object-contain" />
          </div>
          <div className="py-2 pr-3">
            <p className="text-[12px] font-semibold" style={{ color: '#e4e4ef' }}>Sharp event feed</p>
            <p className="text-[11px] leading-snug" style={{ color: '#8a8aa0' }}>Live highlights and match updates in the footer bar.</p>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-[12px] font-medium transition-colors"
          style={{ color: '#3e3e56' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#3e3e56')}
        >
          View all <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
