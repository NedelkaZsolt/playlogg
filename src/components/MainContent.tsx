import { useState, useEffect } from 'react'
import type { NavTab } from '../types'
import { GameTabBar } from './GameTabBar'
import { PostCard } from './PostCard'
import { ActivityFeed } from './ActivityFeed'
import { posts, gameTabs as initialGameTabs } from '../data/mockData'
import { getCsgoNews } from '../lib/api'
import type { GameTab } from '../types'
import {
  BarChart2, Trophy, Target, Crosshair, Shield, Zap,
  Newspaper, Clock, ExternalLink, Edit3,
  Plus, Star, TrendingUp, X, Square
} from 'lucide-react'

interface MainContentProps {
  activeTab: NavTab
  steamId: string
}

type NewsItem = {
  title: string
  source: string
  time: string
  tag: string
  tagColor: string
  hot?: boolean
  url: string
  thumbnail?: string
}

const NEWS_THUMBNAILS = [
  '/news1.png',
  '/news2.png',
  '/news3.png',
  '/news4.png',
  '/news5.png',
  '/news6.png',
]

const BANNERS = [
  '/banner1.gif',
  '/banner2.gif',
  '/banner3.gif',
  '/banner4.gif',
]

const getRandomBanner = () => BANNERS[Math.floor(Math.random() * BANNERS.length)]

const assignNewsThumbnails = (items: NewsItem[]) =>
  items.map((item, index) => ({
    ...item,
    thumbnail: item.thumbnail || NEWS_THUMBNAILS[index % NEWS_THUMBNAILS.length],
  }))

const CS_GO_NEWS_FALLBACK: NewsItem[] = [
  {
    title: 'CS:GO official update: new Dust2 seasonal event and patch notes',
    source: 'Counter-Strike Official',
    time: '1 day ago',
    tag: 'CS:GO',
    tagColor: '#3b82f6',
    hot: true,
    url: 'https://blog.counter-strike.net/',
    thumbnail: '/news1.png',
  },
  {
    title: 'Dota 2 blog: new The International preview and qualifier schedule',
    source: 'Dota 2 Official',
    time: '2 days ago',
    tag: 'Dota 2',
    tagColor: '#22c55e',
    url: 'https://www.dota2.com/news',
    thumbnail: '/news2.png',
  },
  {
    title: 'CS2 Major: wildcard teams and new qualifiers announced',
    source: 'HLTV',
    time: '4h ago',
    tag: 'CS2',
    tagColor: '#f97316',
    hot: true,
    url: 'https://www.hltv.org/news/',
    thumbnail: '/news3.png',
  },
  {
    title: 'Valve blog: new weapon balance patch and operation roadmap',
    source: 'Valve',
    time: '1 day ago',
    tag: 'Patch',
    tagColor: '#60a5fa',
    url: 'https://blog.counter-strike.net/',
    thumbnail: '/news4.png',
  },
  {
    title: 'DPC article: new teams in the Dota 2 competitive season',
    source: 'Dota 2 Official',
    time: '6h ago',
    tag: 'Esport',
    tagColor: '#8b5cf6',
    url: 'https://www.dota2.com/news',
    thumbnail: '/news5.png',
  },
  {
    title: 'Pro leaderboard: top 5 hottest players right now',
    source: 'HLTV',
    time: '5 hours ago',
    tag: 'Rank',
    tagColor: '#f97316',
    url: 'https://www.hltv.org/news/',
    thumbnail: '/news6.png',
  },
]

/* ─────────────────────────────────────────────
   NEW GROUP MODAL
───────────────────────────────────────────── */
const GROUP_COLORS = [
  { label: 'Orange', color: '#3b82f6', bgFrom: '#2266cc', bgTo: '#113388' },
  { label: 'Yellow', color: '#f59e0b', bgFrom: '#cc8800', bgTo: '#7a5000' },
  { label: 'Red',    color: '#e83c3c', bgFrom: '#cc2222', bgTo: '#7a1010' },
  { label: 'Blue',   color: '#3b82f6', bgFrom: '#2266cc', bgTo: '#113388' },
  { label: 'Purple', color: '#a855f7', bgFrom: '#7733cc', bgTo: '#441188' },
  { label: 'Green',  color: '#1ed760', bgFrom: '#189944', bgTo: '#0a5528' },
  { label: 'Cyan',   color: '#06b6d4', bgFrom: '#0588aa', bgTo: '#034466' },
  { label: 'Pink',   color: '#ec4899', bgFrom: '#bb2277', bgTo: '#771144' },
]

function AddGroupModal({ onClose, onAdd }: { onClose: () => void; onAdd: (tab: GameTab) => void }) {
  const [name, setName]       = useState('')
  const [label, setLabel]     = useState('')
  const [colorIdx, setColorIdx] = useState(0)

  const chosen = GROUP_COLORS[colorIdx]
  const previewLabel = label.trim() || (name.trim().slice(0, 3).toUpperCase()) || '??'

  const handleSave = () => {
    if (!name.trim()) return
    onAdd({
      id: Date.now().toString(),
      label: previewLabel,
      color: chosen.color,
      bgFrom: chosen.bgFrom,
      bgTo: chosen.bgTo,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[400px] rounded-2xl p-6 space-y-5"
        style={{ background: '#15151d', border: '1px solid #27273a', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>Create new group</span>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
            style={{
              background: `radial-gradient(circle at 38% 32%, ${chosen.bgFrom}, ${chosen.bgTo})`,
              boxShadow: `0 0 0 2px ${chosen.color}, 0 0 16px ${chosen.color}55`,
            }}
          >
            {previewLabel}
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#e4e4ef' }}>
              {name.trim() || 'Group name'}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#52526a' }}>Preview</p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#52526a' }}>
            Group name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Counter-Strike 2"
            className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{
              background: '#1e1e2c', border: '1px solid #27273a',
              color: '#e4e4ef', caretColor: chosen.color,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = chosen.color + '88')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#27273a')}
          />
        </div>

        {/* Short label */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#52526a' }}>
            Short label (max 3 chars)
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.toUpperCase().slice(0, 3))}
            placeholder="e.g. CS2"
            className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{
              background: '#1e1e2c', border: '1px solid #27273a',
              color: '#e4e4ef', caretColor: chosen.color,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = chosen.color + '88')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#27273a')}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#52526a' }}>
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {GROUP_COLORS.map((c, i) => (
              <button
                key={c.label}
                title={c.label}
                onClick={() => setColorIdx(i)}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 38% 32%, ${c.bgFrom}, ${c.bgTo})`,
                  boxShadow: i === colorIdx ? `0 0 0 2px ${c.color}, 0 0 8px ${c.color}66` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
            style={{ background: '#1e1e2c', color: '#8a8aa0', border: '1px solid #27273a' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#27273a' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1e1e2c' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-[13px] font-bold transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${chosen.bgFrom}, ${chosen.bgTo})`,
              color: '#fff',
              opacity: name.trim() ? 1 : 0.4,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
            onClick={handleSave}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
function HomeTab({ steamId: _steamId }: { steamId: string }) {
  const [activeGame, setActiveGame]   = useState('cs2')
  const [tabs, setTabs]               = useState(initialGameTabs)
  const [showAddGroup, setShowAddGroup] = useState(false)

  const handleAddGroup = (tab: GameTab) => {
    setTabs((prev) => [...prev, tab])
    setActiveGame(tab.id)
  }

  return (
    <>
      {showAddGroup && (
        <AddGroupModal
          onClose={() => setShowAddGroup(false)}
          onAdd={handleAddGroup}
        />
      )}
      <div className="space-y-6">
        <GameTabBar
          activeGame={activeGame}
          onSelect={setActiveGame}
          tabs={tabs}
          onAdd={() => setShowAddGroup(true)}
        />
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 300px' }}>
          <div className="col-span-2 space-y-4">
            {posts
              .filter((post) => [1, 4, 3].includes(post.id))
              .sort((a, b) => [1, 4, 3].indexOf(a.id) - [1, 4, 3].indexOf(b.id))
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
          <div className="space-y-4">
            {/* Banner ablak */}
            <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '400px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
              <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string; sub: string; color: string; icon: React.ElementType
}) {
  return (
    <div className="rounded-lg p-4 flex items-center gap-4"
      style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[22px] font-bold leading-tight" style={{ color: '#e4e4ef' }}>{value}</p>
        <p className="text-[12px] font-medium" style={{ color }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#52526a' }}>{sub}</p>
      </div>
    </div>
  )
}

function MatchRow({ rank, map, result, kd, score }: {
  rank: string; map: string; result: 'W' | 'L'; kd: string; score: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors"
      onMouseEnter={e => (e.currentTarget.style.background = '#1a1a26')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <span className="text-[11px] w-6 text-center font-bold" style={{ color: '#3e3e56' }}>{rank}</span>
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: result === 'W' ? '#1ed760' : '#e83c3c' }}
      />
      <span className="flex-1 text-[13px] font-medium" style={{ color: '#c8c8dc' }}>{map}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color: result === 'W' ? '#1ed760' : '#e83c3c' }}>{score}</span>
      <span className="text-[12px] tabular-nums w-12 text-right" style={{ color: '#8a8aa0' }}>{kd}</span>
    </div>
  )
}

function StatsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="K/D ratio"      value="1.84"  sub="Top 15%"      color="#3b82f6" icon={Crosshair} />
            <StatCard label="Win rate"       value="62%"   sub="124 matches" color="#1ed760" icon={Trophy} />
            <StatCard label="Headshot"        value="41%"   sub="Above average" color="#f59e0b" icon={Target} />
            <StatCard label="Rating"          value="1.21"  sub="Premier"      color="#7755dd" icon={BarChart2} />
          </div>

          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Recent matches</span>
              <span className="text-[11px]" style={{ color: '#52526a' }}>CS2 · Premier</span>
            </div>
            <div className="py-1">
              {[
                { rank: '1', map: 'Dust2',   result: 'W' as const, kd: '24/14', score: '13–8' },
                { rank: '2', map: 'Mirage',  result: 'W' as const, kd: '19/11', score: '13–6' },
                { rank: '3', map: 'Inferno', result: 'L' as const, kd: '16/21', score: '9–13' },
                { rank: '4', map: 'Nuke',    result: 'W' as const, kd: '22/15', score: '13–10' },
                { rank: '5', map: 'Ancient', result: 'W' as const, kd: '18/12', score: '13–7' },
              ].map((m) => (
                <MatchRow key={m.rank} {...m} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Banner */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '200px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
          </div>

          {[
            { label: 'ADR',           value: '82.4',  color: '#3b82f6' },
            { label: 'KAST%',         value: '74%',   color: '#1ed760' },
            { label: 'Utility damage',value: '38.1',  color: '#f59e0b' },
            { label: 'Entry kill%',   value: '55%',   color: '#7755dd' },
            { label: 'Clutch win%',   value: '43%',   color: '#3b82f6' },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between px-4 py-2.5 rounded-lg"
              style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
              <span className="text-[12px]" style={{ color: '#52526a' }}>{s.label}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   NEWS
───────────────────────────────────────────── */
function NewsCard({ title, source, time, tag, tagColor, hot, thumbnail }: {
  title: string; source: string; time: string; tag: string; tagColor: string; hot?: boolean; url?: string; thumbnail?: string
}) {
  return (
    <div className="flex gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors"
      style={{ background: '#15151d', border: '1px solid #1e1e2c' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#27273a'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2c'
      }}>
      {/* Thumbnail placeholder */}
      <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden"
        style={{ background: `${tagColor}18`, border: `1px solid ${tagColor}22` }}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper size={20} style={{ color: `${tagColor}88` }} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}33` }}>
            {tag}
          </span>
          {hot && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: '#e83c3c18', color: '#e83c3c', border: '1px solid #e83c3c33' }}>
              Trending
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: '#c8c8dc' }}>{title}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Clock size={10} style={{ color: '#3e3e56' }} />
          <span className="text-[11px]" style={{ color: '#3e3e56' }}>{time}</span>
          <span style={{ color: '#27273a' }}>·</span>
          <span className="text-[11px]" style={{ color: '#3e3e56' }}>{source}</span>
          <ExternalLink size={9} style={{ color: '#3e3e56' }} className="ml-auto" />
        </div>
      </div>
    </div>
  )
}

function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)

      try {
        const items = await getCsgoNews(6)
        setNews(assignNewsThumbnails(items))
      } catch (err) {
        setNews(assignNewsThumbnails(CS_GO_NEWS_FALLBACK))
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Esports news</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true)
                getCsgoNews(6)
                  .then((items) => setNews(assignNewsThumbnails(items)))
                  .catch(() => setNews(assignNewsThumbnails(CS_GO_NEWS_FALLBACK)))
                  .finally(() => setLoading(false))
              }}
              className="text-[11px] font-medium rounded-md px-2 py-1 transition-colors"
              style={{ background: '#1a1a26', color: '#8a8aa0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#23232f'; e.currentTarget.style.color = '#e4e4ef' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a26'; e.currentTarget.style.color = '#8a8aa0' }}
            >
              Refresh
            </button>
            </div>
        </div>

        {loading && (
          <div className="rounded-lg p-4" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <span className="text-[13px]" style={{ color: '#8a8aa0' }}>Loading news…</span>
          </div>
        )}


        {!loading && news.length === 0 && (
          <div className="rounded-lg p-4" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <span className="text-[13px]" style={{ color: '#8a8aa0' }}>No CS2 news available.</span>
          </div>
        )}

        {!loading && news.map((n, i) => (
          <a key={i} href={n.url} target="_blank" rel="noreferrer">
            <NewsCard {...n} />
          </a>
        ))}
      </div>
      <div className="space-y-3">
        {/* Banner */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '200px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
          <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
        </div>

        <div className="rounded-3xl p-4" style={{ background: 'linear-gradient(135deg, #071426, #102e68)', border: '1px solid #1a2749' }}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#8a8aa0' }}>Ad</span>
            <span className="text-[10px] uppercase font-semibold" style={{ color: '#7dd3fc' }}>Esports</span>
          </div>
          <p className="mt-4 text-[15px] font-bold leading-tight" style={{ color: '#f8fbff' }}>VlamAI Live Analytics</p>
          <p className="mt-2 text-[12px] leading-snug" style={{ color: '#c7d2ff' }}>
            Real-time team and match analytics for CS2 tournaments. Faster decisions, better strategies.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              className="rounded-full px-3 py-2 text-[12px] font-semibold transition-colors"
              style={{ background: '#3b82f6', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
            >
              Details
            </button>
            <span className="text-[11px]" style={{ color: '#8a8aa0' }}>Esports partner</span>
          </div>
        </div>
        <div className="rounded-lg p-4" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#52526a' }}>TRENDING TOPICS</p>
          {['CS2 Major', 'CS2 update', 'Steam ranks', 'Esports', 'Game update'].map((t, i) => (
            <div key={t} className="flex items-center gap-2 py-1.5 cursor-pointer"
              onMouseEnter={e => (e.currentTarget.style.color = '#e4e4ef')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <span className="text-[11px] font-bold tabular-nums w-4" style={{ color: '#3e3e56' }}>#{i + 1}</span>
              <span className="text-[12px] font-medium" style={{ color: '#8a8aa0' }}>{t}</span>
            </div>
          ))}
        </div>
        <ActivityFeed />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PROFILE
───────────────────────────────────────────── */
const BANNER_COLORS = [
  { label: 'Orange', from: '#08132b', mid: '#0a1a42', to: '#050b19', glow: '#3b82f6' },
  { label: 'Purple', from: '#0e0818', mid: '#1a1030', to: '#0a0812', glow: '#7755dd' },
  { label: 'Blue',   from: '#080e1a', mid: '#0a1828', to: '#060a14', glow: '#3b82f6' },
  { label: 'Green',  from: '#060e08', mid: '#0a1a0c', to: '#050c06', glow: '#1ed760' },
  { label: 'Red',    from: '#140808', mid: '#221010', to: '#100606', glow: '#e83c3c' },
]

const AVATAR_COLORS = [
  { from: '#3b82f6', to: '#1e4099' },
  { from: '#7755dd', to: '#3322aa' },
  { from: '#3b82f6', to: '#1e4099' },
  { from: '#1ed760', to: '#116633' },
  { from: '#e83c3c', to: '#881111' },
  { from: '#f59e0b', to: '#7a5000' },
]

const PROFILE_IMAGES = [
  'profile1.png',
  'profile2.png',
  'profile3.png',
  'profile4.png',
  'profile5.png',
  'profile6.png',
]

function EditProfileModal({ profile, onClose, onSave }: {
  profile: { name: string; username: string; bio: string; bannerIdx: number; avatarIdx: number }
  onClose: () => void
  onSave: (p: typeof profile) => void
}) {
  const [form, setForm] = useState({ ...profile })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-[540px] rounded-2xl overflow-hidden"
        style={{ background: '#15151d', border: '1px solid #27273a', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <span className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Edit profile</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-colors"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e4e4ef')}
            onMouseLeave={e => (e.currentTarget.style.color = '#52526a')}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Banner preview + picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#52526a' }}>PROFILE THEME / BANNER COLOR</label>
            <div className="h-16 rounded-lg mb-2 overflow-hidden relative"
              style={{ background: `linear-gradient(135deg, ${BANNER_COLORS[form.bannerIdx].from}, ${BANNER_COLORS[form.bannerIdx].mid}, ${BANNER_COLORS[form.bannerIdx].to})` }}>
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 80% at 70% 40%, ${BANNER_COLORS[form.bannerIdx].glow}33 0%, transparent 60%)` }} />
            </div>
            <div className="flex gap-2">
              {BANNER_COLORS.map((b, i) => (
                <button key={i} onClick={() => setForm(f => ({ ...f, bannerIdx: i }))}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${b.from}, ${b.mid})`,
                    boxShadow: form.bannerIdx === i ? `0 0 0 2px ${b.glow}, 0 0 8px ${b.glow}66` : `0 0 0 1px #27273a`,
                  }} />
              ))}
            </div>
          </div>

          {/* Profile image picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#52526a' }}>PROFILE PICTURE</label>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#3b82f6' }}>
                <img src={`/${PROFILE_IMAGES[form.avatarIdx]}`} alt="Selected avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[12px]" style={{ color: '#8a8aa0' }}>Upload `profile1.png`–`profile6.png` files into the public folder.</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PROFILE_IMAGES.map((image, i) => (
                <button key={image} type="button" onClick={() => setForm(f => ({ ...f, avatarIdx: i }))}
                  className="w-full aspect-square rounded-xl overflow-hidden border transition-all"
                  style={{
                    borderColor: form.avatarIdx === i ? '#3b82f6' : '#27273a',
                    boxShadow: form.avatarIdx === i ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
                  }}>
                  <img src={`/${image}`} alt={`Profile ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Avatar picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#52526a' }}>AVATAR COLOR</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                style={{ background: `radial-gradient(circle at 38% 32%, ${AVATAR_COLORS[form.avatarIdx].from}, ${AVATAR_COLORS[form.avatarIdx].to})`, boxShadow: `0 0 0 2px ${AVATAR_COLORS[form.avatarIdx].from}55` }}>
                {form.name.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="flex gap-2">
                {AVATAR_COLORS.map((c, i) => (
                  <button key={i} onClick={() => setForm(f => ({ ...f, avatarIdx: i }))}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 38% 32%, ${c.from}, ${c.to})`,
                      boxShadow: form.avatarIdx === i ? `0 0 0 2px ${c.from}, 0 0 8px ${c.from}66` : `0 0 0 1px #27273a`,
                    }} />
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>DISPLAY NAME</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2c', color: '#e4e4ef' }}
              onFocus={e => (e.target.style.borderColor = '#3b82f666')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2c')} />
          </div>

          {/* Username */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>USERNAME</label>
            <div className="flex items-center gap-0 rounded-lg overflow-hidden"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2c' }}>
              <span className="px-3 text-[13px]" style={{ color: '#52526a' }}>@</span>
              <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/\s/g, '') }))}
                className="flex-1 py-2 pr-3 text-[13px] outline-none bg-transparent"
                style={{ color: '#e4e4ef' }} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>BIO</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={2} placeholder="Write something about yourself..."
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none resize-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2c', color: '#e4e4ef' }}
              onFocus={e => (e.target.style.borderColor = '#3b82f666')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2c')} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{ background: '#1e1e2c', color: '#8a8aa0', border: '1px solid #27273a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#27273a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e1e2c')}>
              Cancel
            </button>
            <button onClick={() => { onSave(form); onClose() }}
              className="flex-1 py-2 rounded-lg text-[13px] font-bold"
              style={{ background: '#3b82f6', color: '#fff', boxShadow: '0 0 16px #3b82f644' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'PlayLogg User',
    username: 'playlogg',
    bio: '',
    bannerIdx: 0,
    avatarIdx: 0,
  })
  const [avatarImgFailed, setAvatarImgFailed] = useState(false)

  useEffect(() => {
    setAvatarImgFailed(false)
  }, [profile.avatarIdx])

  const banner = BANNER_COLORS[profile.bannerIdx]
  const avatar = AVATAR_COLORS[profile.avatarIdx]
  const profileImage = `/${PROFILE_IMAGES[profile.avatarIdx]}`

  return (
    <div className="space-y-6">
      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={setProfile}
        />
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 300px' }}>
        {/* Profile content */}
        <div className="col-span-2 space-y-4">
          {/* Profile header */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            {/* Banner */}
            <div className="h-10 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.mid}, ${banner.to})` }}>
              <div className="absolute inset-0" style={{
                background: `radial-gradient(ellipse 70% 80% at 70% 40%, ${banner.glow}33 0%, transparent 60%)`
              }} />
              <button onClick={() => setEditing(true)}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#8a8aa0', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#e4e4ef' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0' }}>
                <Edit3 size={11} /> Edit
                <Square size={4} style={{ color: '#3b82f6', marginLeft: '4px' }} />
              </button>
            </div>

            {/* Avatar + info */}
            <div className="px-5 pb-4">
              <div className="flex items-end gap-4 mt-4 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                  style={{ border: '3px solid #15151d', boxShadow: `0 0 0 2px ${avatar.from}55`, background: avatarImgFailed ? `radial-gradient(circle at 38% 32%, ${avatar.from}, ${avatar.to})` : 'transparent' }}>
                  {!avatarImgFailed ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setAvatarImgFailed(true)}
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-[16px] font-bold" style={{ color: '#e4e4ef' }}>{profile.name}</p>
                  <p className="text-[12px]" style={{ color: '#52526a' }}>@{profile.username} · Joined 2023</p>
                  {profile.bio && <p className="text-[12px] mt-1" style={{ color: '#8a8aa0' }}>{profile.bio}</p>}
                </div>
              </div>
              <div className="flex items-center gap-6">
                {[{ v: '124', l: 'Matches' }, { v: '62%', l: 'Win rate' }, { v: '1.84', l: 'K/D' }, { v: '6', l: 'Friends' }].map(s => (
                  <div key={s.l}>
                    <p className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>{s.v}</p>
                    <p className="text-[11px]" style={{ color: '#52526a' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Achievements</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {[
                { icon: Trophy,    label: 'First Win',    color: '#f59e0b', done: true },
                { icon: Crosshair, label: '100 Kill',     color: '#e83c3c', done: true },
                { icon: Shield,    label: 'Flawless',     color: '#1ed760', done: true },
                { icon: Zap,       label: 'Ace',          color: '#3b82f6', done: true },
                { icon: Star,      label: 'Rank B',       color: '#7755dd', done: false },
                { icon: TrendingUp,label: 'Win Streak 5', color: '#3b82f6', done: false },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                  style={{ background: a.done ? `${a.color}12` : '#0f0f14', border: `1px solid ${a.done ? a.color + '33' : '#1e1e2c'}`, opacity: a.done ? 1 : 0.45 }}>
                  <a.icon size={15} style={{ color: a.done ? a.color : '#3e3e56' }} />
                  <span className="text-[11px] font-medium" style={{ color: a.done ? '#c8c8dc' : '#3e3e56' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Played Games */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Recently Played Games</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'Counter-Strike 2', hours: '284 hrs', rank: 'B Rangsor', color: '#3b82f6' },
                { name: 'Apex Legends', hours: '142 hrs', rank: 'Platinum', color: '#f59e0b' },
                { name: 'Valorant', hours: '98 hrs', rank: 'Gold 2', color: '#e83c3c' },
              ].map((game) => (
                <div key={game.name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: '#0f0f14', border: '1px solid #1e1e2c' }}>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: '#e4e4ef' }}>{game.name}</p>
                    <p className="text-[11px]" style={{ color: '#52526a' }}>{game.hours}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded" style={{ background: `${game.color}18`, color: game.color, border: `1px solid ${game.color}33` }}>
                    {game.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Reviews */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Game Reviews</span>
            </div>
            <div className="p-4 space-y-4">
              {[
                { game: 'Counter-Strike 2', rating: 'Very Positive', review: 'A remek csapatjáték az új rangrendszerrel. Az frissítések folyamatosan javítják a játékélményt és a matchmaking gyors.' },
                { game: 'Valorant', rating: 'Positive', review: 'Taktikai shooter élmény nagyszerű, a fegyverek kiegyensúlyozottak és a pályák profik. Ajánlom!' },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: '#0f0f14', border: '1px solid #1e1e2c' }}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[13px] font-semibold" style={{ color: '#e4e4ef' }}>{item.game}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: '#1ed76033', color: '#1ed760' }}>
                      {item.rating}
                    </span>
                  </div>
                  <p className="text-[12px]" style={{ color: '#8a8aa0' }}>{item.review}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Screenshots</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden h-32 bg-cover bg-center hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ backgroundImage: `url(/screen${i}.png)`, border: '1px solid #1e1e2c' }}>
                  <img src={`/screen${i}.png`} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Banner */}
          <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '400px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
            <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
          </div>

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   GAMES
───────────────────────────────────────────── */
// Steam CDN header images — only for games confirmed to be on Steam
const GAME_HEADERS: Record<string, string> = {
  'Counter-Strike 2':   'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
  'Apex Legends':       'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
  'Dota 2':             'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
  'Rainbow Six Siege':  'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg',
  'Rust':               'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
  'Warframe':           'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg',
  'Destiny 2':          'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
  'PUBG':               'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
  // Non-Steam games — Wikipedia Commons (stable, public)
  'Valorant':           'https://upload.wikimedia.org/wikipedia/en/b/ba/Valorant_cover.jpg',
  'World of Warcraft':  'https://upload.wikimedia.org/wikipedia/en/6/65/World_of_Warcraft.png',
  'League of Legends':  'https://upload.wikimedia.org/wikipedia/en/1/13/League_of_Legends.jpg',
  'Fortnite':           'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/FortniteLogo.svg/250px-FortniteLogo.svg.png',
  'Overwatch 2':        'https://upload.wikimedia.org/wikipedia/en/a/a5/Overwatch_2_cover_art.jpg',
  'Escape from Tarkov': 'https://upload.wikimedia.org/wikipedia/en/f/f8/Escape_from_Tarkov_cover_art.jpg',
}

const GAME_STORE_URLS: Record<string, string> = {
  'Counter-Strike 2':  'https://store.steampowered.com/app/730/CounterStrike_2/',
  'Apex Legends':      'https://store.steampowered.com/app/1172470/Apex_Legends/',
  'Dota 2':            'https://store.steampowered.com/app/570/Dota_2/',
  'Rainbow Six Siege': 'https://store.steampowered.com/app/359550/Rainbow_Six_Siege/',
  'Valorant':          'https://playvalorant.com/',
  'World of Warcraft': 'https://worldofwarcraft.com/',
  'League of Legends': 'https://leagueoflegends.com/',
  'Fortnite':          'https://www.epicgames.com/fortnite/',
  'Overwatch 2':       'https://playoverwatch.com/',
  'Escape from Tarkov':'https://www.escapefromtarkov.com/',
}

const GAME_REVIEWS: Record<string, { id: number; user: string; avatarColor: string; rating: string; text: string; time: string }[]> = {
  'Counter-Strike 2': [
    { id: 1, user: 'SteamUser42', avatarColor: '#3b82f6', rating: 'Very Positive', text: 'A remek csapatjáték és az új rangrendszer nagyon motiváló. A matchmaking gyors és a frissítések is javítják a játékélményt.', time: '2 órája' },
    { id: 2, user: 'FragMaster', avatarColor: '#1d4ed8', rating: 'Positive', text: 'Nagyon szeretem a pályákat és a fegyverhangokat. Kicsit több új játékos érkezett mostanában, de a közösség még mindig élvezetes.', time: '5 órája' },
    { id: 3, user: 'ClutchQueen', avatarColor: '#60a5fa', rating: 'Mixed', text: 'A játék jó, de néhány szerveres probléma miatt néha összeomlik a match. Összességében mégis megéri.', time: '1 napja' },
  ],
  'Apex Legends': [
    { id: 1, user: 'ApexDaddy', avatarColor: '#f59e0b', rating: 'Positive', text: 'A character design és a tempó továbbra is fantasztikus. A patch után sokkal kiegyensúlyozottabbak a legendák.', time: '3 napja' },
    { id: 2, user: 'Wingman', avatarColor: '#d97706', rating: 'Very Positive', text: 'Szeretem, hogy folyamatosan jönnek az új tartalmak. A battle pass igazán jó ár-érték arányú.', time: '4 napja' },
  ],
  'Valorant': [
    { id: 1, user: 'SpikePlant', avatarColor: '#ef4444', rating: 'Positive', text: 'A taktikai shooter élmény nagyon jó, a fegyverek és a pályák is profik. A community néha toxikus, de maga a játék szórakoztató.', time: '6 napja' },
  ],
}

function GameCard({ name, hours, rank, color, abbr, selected, onSelect }: {
  name: string; hours: string; rank: string; color: string; abbr: string; selected: boolean; onSelect: () => void
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const headerUrl = GAME_HEADERS[name]

  return (
    <div
      className="rounded-lg overflow-hidden cursor-pointer group"
      style={{
        background: selected ? '#1f2937' : '#15151d',
        border: `1px solid ${selected ? color : '#1e1e2c'}`,
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onClick={onSelect}
      onMouseEnter={e => { if (!selected) (e.currentTarget.style.borderColor = color + '55') }}
      onMouseLeave={e => { if (!selected) (e.currentTarget.style.borderColor = '#1e1e2c') }}>
      <div className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}22 0%, #0a0a0f 70%)` }}>
        {headerUrl && !imgFailed ? (
          <>
            <img
              src={headerUrl}
              alt={name}
              onError={() => setImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #15151d 0%, transparent 60%)' }} />
          </>
        ) : (
          <span className="text-3xl font-black" style={{ color: `${color}cc` }}>{abbr}</span>
        )}
      </div>
      <div className="px-3 py-3">
        <p className="text-[13px] font-semibold truncate" style={{ color: '#c8c8dc' }}>{name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px]" style={{ color: '#52526a' }}>{hours} hrs</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>{rank}</span>
        </div>
      </div>
    </div>
  )
}

const AVAILABLE_GAMES = [
  { name: 'Counter-Strike 2', abbr: 'CS2', color: '#3b82f6' },
  { name: 'Apex Legends',     abbr: 'AX',  color: '#f59e0b' },
  { name: 'Valorant',         abbr: 'VL',  color: '#e83c3c' },
  { name: 'World of Warcraft',abbr: 'WoW', color: '#d97706' },
  { name: 'League of Legends',abbr: 'LoL', color: '#3b82f6' },
  { name: 'Fortnite',         abbr: 'FN',  color: '#1ed760' },
  { name: 'Dota 2',           abbr: 'D2',  color: '#7755dd' },
  { name: 'Overwatch 2',      abbr: 'OW',  color: '#f97316' },
  { name: 'Rainbow Six Siege',abbr: 'R6',  color: '#6366f1' },
  { name: 'Escape from Tarkov',abbr:'EFT', color: '#84cc16' },
]

function AddGameModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string, abbr: string, color: string) => void }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof AVAILABLE_GAMES[0] | null>(null)
  const [rank, setRank] = useState('')

  const filtered = AVAILABLE_GAMES.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-[420px] rounded-2xl overflow-hidden"
        style={{ background: '#15151d', border: '1px solid #27273a', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <span className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Add game</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e4e4ef')}
            onMouseLeave={e => (e.currentTarget.style.color = '#52526a')}>
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: '#0f0f14', border: '1px solid #1e1e2c' }}>
            <span style={{ color: '#52526a', fontSize: 13 }}>🔍</span>
            <input
              autoFocus
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: '#e4e4ef' }}
            />
          </div>

          {/* Game list */}
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {filtered.map(g => (
              <div key={g.name}
                onClick={() => setSelected(g)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: selected?.name === g.name ? `${g.color}18` : 'transparent',
                  border: `1px solid ${selected?.name === g.name ? g.color + '44' : 'transparent'}`,
                }}
                onMouseEnter={e => {
                  if (selected?.name !== g.name)
                    (e.currentTarget as HTMLDivElement).style.background = '#1a1a26'
                }}
                onMouseLeave={e => {
                  if (selected?.name !== g.name)
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
                  style={{ background: `${g.color}22`, color: g.color }}>
                  {g.abbr}
                </div>
                <span className="text-[13px] font-medium" style={{ color: '#c8c8dc' }}>{g.name}</span>
                {selected?.name === g.name && (
                  <span className="ml-auto text-[11px] font-bold" style={{ color: g.color }}>✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Rank input */}
          {selected && (
            <div>
              <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>
                Current rank (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Gold 2, Platinum, B Rank..."
                value={rank}
                onChange={e => setRank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: '#0f0f14', border: `1px solid ${selected.color}44`, color: '#e4e4ef' }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{ background: '#1e1e2c', color: '#8a8aa0', border: '1px solid #27273a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#27273a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e1e2c')}>
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                if (selected) { onAdd(selected.name, selected.abbr, selected.color); onClose() }
              }}
              className="flex-1 py-2 rounded-lg text-[13px] font-bold transition-all"
              style={{
                background: selected ? selected.color : '#1e1e2c',
                color: selected ? '#fff' : '#3e3e56',
                cursor: selected ? 'pointer' : 'not-allowed',
              }}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_GAMES = [
  { name: 'Counter-Strike 2',  hours: '284', rank: 'B Rangsor', color: '#3b82f6', abbr: 'CS2' },
  { name: 'Apex Legends',      hours: '142', rank: 'Platinum',  color: '#f59e0b', abbr: 'AX'  },
  { name: 'Valorant',          hours: '98',  rank: 'Gold 2',    color: '#e83c3c', abbr: 'VL'  },
  { name: 'World of Warcraft', hours: '421', rank: 'Mythic+',   color: '#d97706', abbr: 'WoW' },
]

const BETA_GAMES = [
  {
    name: 'Counter-Strike 2 Beta',
    description: 'Early access beta preview for new CS2 features and maps.',
    status: 'Steam Beta',
    color: '#3b82f6',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    url: 'https://store.steampowered.com/app/730/CounterStrike_2/',
  },
  {
    name: 'Dota 2 Beta',
    description: 'Try the next Dota 2 season in the public beta build.',
    status: 'Steam Beta',
    color: '#22c55e',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    url: 'https://store.steampowered.com/app/570/Dota_2/',
  },
  {
    name: 'Rust Experimental',
    description: 'Steam experimental branch for the latest Rust updates.',
    status: 'Steam Beta',
    color: '#f97316',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
    url: 'https://store.steampowered.com/app/252490/Rust/',
  },
]

function ExploreTab() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
      <div className="space-y-6">
        <div className="rounded-3xl p-6" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[17px] font-semibold" style={{ color: '#e4e4ef' }}>Steam Beta Explore</p>
              <p className="text-[12px] mt-1" style={{ color: '#8a8aa0' }}>Discover a selection of Steam beta titles and their store previews.</p>
            </div>
            <a
              href="https://store.steampowered.com/search/?term=beta"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
              style={{ background: '#3b82f6', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
            >
              Browse Steam Beta
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {BETA_GAMES.map((game) => (
              <a
                key={game.name}
                href={game.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl overflow-hidden block"
                style={{ background: '#0f172a', border: '1px solid #1e1e2c' }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase"
                    style={{ background: `${game.color}dd`, color: '#fff' }}
                  >
                    Beta
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>{game.name}</p>
                  <p className="text-[12px] mt-2" style={{ color: '#8a8aa0' }}>{game.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: game.color }}>{game.status}</span>
                    <span className="text-[11px] text-[#8a8aa0]">Open store</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Banner */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '400px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
          <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

function GamesTab({ steamId }: { steamId: string }) {
  const storageKey = `playlogg_games_${steamId}`
  const [showModal, setShowModal] = useState(false)
  const [selectedGame, setSelectedGame] = useState<typeof DEFAULT_GAMES[0] | null>(null)
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved) as typeof DEFAULT_GAMES
    } catch { /* ignore */ }
    return DEFAULT_GAMES
  })

  function handleAdd(name: string, abbr: string, color: string) {
    if (!games.find(g => g.name === name)) {
      setGames(prev => {
        const next = [...prev, { name, abbr, color, hours: '0', rank: '—' }]
        localStorage.setItem(storageKey, JSON.stringify(next))
        return next
      })
    }
  }

  const selectedReviews = selectedGame ? GAME_REVIEWS[selectedGame.name] ?? [] : []

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
      <div className="space-y-6">
        {showModal && (
          <AddGameModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
        )}
        <div className="grid grid-cols-4 gap-3">
          {games.map(g => (
            <GameCard
              key={g.name}
              {...g}
              selected={selectedGame?.name === g.name}
              onSelect={() => setSelectedGame(g)}
            />
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
          style={{ background: '#15151d', border: '1px dashed #27273a', color: '#52526a' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3e3e56'; (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#27273a'; (e.currentTarget as HTMLButtonElement).style.color = '#52526a' }}>
          <Plus size={15} />
          Add game
        </button>

        {selectedGame && (
          <div className="rounded-3xl p-5" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
            <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl overflow-hidden" style={{ background: '#0f172a' }}>
                <img
                  src={GAME_HEADERS[selectedGame.name] ?? 'https://via.placeholder.com/320x180?text=Game'}
                  alt={selectedGame.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-[16px] font-bold" style={{ color: '#e4e4ef' }}>{selectedGame.name}</p>
                  <p className="text-[12px] mt-2" style={{ color: '#8a8aa0' }}>Steam store reviews imported below the store link.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-1 rounded" style={{ background: `${selectedGame.color}18`, color: selectedGame.color, border: `1px solid ${selectedGame.color}33` }}>
                      {selectedGame.rank}
                    </span>
                    <span className="text-[11px] text-[#8a8aa0]">{selectedGame.hours} hrs played</span>
                  </div>
                  <a
                    href={GAME_STORE_URLS[selectedGame.name] ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center mt-4 rounded-full px-3 py-2 text-[12px] font-semibold"
                    style={{ background: selectedGame.color, color: '#fff' }}>
                    View store page
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Imported Steam reviews</p>
                    <p className="text-[11px]" style={{ color: '#8a8aa0' }}>A játék áruházai kommentjeiből összeállított feed.</p>
                  </div>
                  <button
                    onClick={() => setSelectedGame({ ...selectedGame })}
                    className="text-[11px] font-medium rounded-md px-2 py-1 transition-colors"
                    style={{ background: '#1a1a26', color: '#8a8aa0' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#23232f'; e.currentTarget.style.color = '#e4e4ef' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a26'; e.currentTarget.style.color = '#8a8aa0' }}>
                    Refresh feed
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedReviews.length === 0 ? (
                    <div className="rounded-2xl p-4" style={{ background: '#10131f', border: '1px solid #1e1e2c' }}>
                      <p className="text-[12px]" style={{ color: '#8a8aa0' }}>Nincsenek elérhető Steam vélemények ehhez a játékhoz.</p>
                    </div>
                  ) : (
                    selectedReviews.map((review) => (
                      <div key={review.id} className="rounded-2xl p-4" style={{ background: '#10131f', border: '1px solid #1e1e2c' }}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold text-white"
                              style={{ background: review.avatarColor }}>
                              {review.user.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold" style={{ color: '#e4e4ef' }}>{review.user}</p>
                              <p className="text-[11px]" style={{ color: '#8a8aa0' }}>{review.time}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold" style={{ color: review.avatarColor }}>{review.rating}</span>
                        </div>
                        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: '#c8c8dc' }}>{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Banner */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c', minHeight: '400px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
          <img src={getRandomBanner()} alt="Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export function MainContent({ activeTab, steamId }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto" style={{ background: '#0c0c11', padding: '28px 32px' }}>
      <div className="flex items-center gap-2.5 mb-6">
        <h1 className="text-[17px] font-semibold" style={{ color: '#e4e4ef' }}>{activeTab}</h1>
      </div>

      {activeTab === 'Home' && <HomeTab steamId={steamId} />}
      {activeTab === 'Stats' && <StatsTab />}
      {activeTab === 'News' && <NewsTab />}
      {activeTab === 'Explore' && <ExploreTab />}
      {activeTab === 'Profile' && <ProfileTab />}
      {activeTab === 'Games' && <GamesTab steamId={steamId} />}
    </main>
  )
}
