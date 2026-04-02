import { useState } from 'react'
import type { NavTab } from '../types'
import { GameTabBar } from './GameTabBar'
import { PostCard } from './PostCard'
import { StatsPanel } from './StatsPanel'
import { ActivityFeed } from './ActivityFeed'
import { posts, gameTabs as initialGameTabs } from '../data/mockData'
import type { GameTab } from '../types'
import {
  BarChart2, Trophy, Target, Crosshair, Shield, Zap,
  Newspaper, Clock, ExternalLink, Edit3,
  Plus, Star, TrendingUp, X
} from 'lucide-react'

interface MainContentProps {
  activeTab: NavTab
  steamId: string
}

/* ─────────────────────────────────────────────
   ÚJ CSOPORT MODAL
───────────────────────────────────────────── */
const GROUP_COLORS = [
  { label: 'Narancs', color: '#f55500', bgFrom: '#cc4400', bgTo: '#7a2800' },
  { label: 'Sárga',   color: '#f59e0b', bgFrom: '#cc8800', bgTo: '#7a5000' },
  { label: 'Piros',   color: '#e83c3c', bgFrom: '#cc2222', bgTo: '#7a1010' },
  { label: 'Kék',     color: '#3b82f6', bgFrom: '#2266cc', bgTo: '#113388' },
  { label: 'Lila',    color: '#a855f7', bgFrom: '#7733cc', bgTo: '#441188' },
  { label: 'Zöld',    color: '#1ed760', bgFrom: '#189944', bgTo: '#0a5528' },
  { label: 'Cián',    color: '#06b6d4', bgFrom: '#0588aa', bgTo: '#034466' },
  { label: 'Rózsaszín', color: '#ec4899', bgFrom: '#bb2277', bgTo: '#771144' },
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
          <span className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>Új csoport létrehozása</span>
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
              {name.trim() || 'Csoport neve'}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#52526a' }}>Előnézet</p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#52526a' }}>
            Csoport neve
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="pl. Counter-Strike 2"
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
            Rövid jelölő (max 3 karakter)
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.toUpperCase().slice(0, 3))}
            placeholder="pl. CS2"
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
            Szín
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
            Mégse
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
            Létrehozás
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   KEZDŐOLDAL
───────────────────────────────────────────── */
function HomeTab({ steamId }: { steamId: string }) {
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="space-y-4">
            <StatsPanel steamId={steamId} />
            <ActivityFeed />
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
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="K/D arány"      value="1.84"  sub="Top 15%"      color="#f55500" icon={Crosshair} />
        <StatCard label="Győzelmi arány" value="62%"   sub="124 meccs"    color="#1ed760" icon={Trophy} />
        <StatCard label="Headshot"        value="41%"   sub="Átlag felett" color="#f59e0b" icon={Target} />
        <StatCard label="Rating"          value="1.21"  sub="Premier"      color="#7755dd" icon={BarChart2} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e2c' }}>
            <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Legutóbbi meccsek</span>
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

        <div className="space-y-3">
          {[
            { label: 'ADR',           value: '82.4',  color: '#f55500' },
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
   HÍREK
───────────────────────────────────────────── */
function NewsCard({ title, source, time, tag, tagColor, hot }: {
  title: string; source: string; time: string; tag: string; tagColor: string; hot?: boolean
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
        <div className="w-full h-full flex items-center justify-center">
          <Newspaper size={20} style={{ color: `${tagColor}88` }} />
        </div>
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
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
      <div className="space-y-3">
        {[
          { title: 'CS2 frissítés: új Premier térképek és rangsor változások', source: 'HLTV', time: '1 órája', tag: 'CS2', tagColor: '#f55500', hot: true },
          { title: 'Major selejtező: NaVi és Vitality továbbjutottak a döntőbe', source: 'HLTV', time: '3 órája', tag: 'Esport', tagColor: '#1ed760' },
          { title: 'Apex Legends szezon 23 patch notes — Legend és fegyver változások', source: 'EA Play', time: '5 órája', tag: 'Apex', tagColor: '#f59e0b' },
          { title: 'Valorant Champions Tour EMEA: Grand Final eredmények', source: 'Dot Esports', time: '8 órája', tag: 'Valorant', tagColor: '#e83c3c', hot: true },
          { title: 'World of Warcraft The War Within 11.1 patch: új dungeon és raid', source: 'Wowhead', time: '12 órája', tag: 'WoW', tagColor: '#d97706' },
          { title: 'Steam játékstatisztika: CS2 all-time csúcs online játékosszámmal', source: 'Steam', time: '1 napja', tag: 'Gaming', tagColor: '#3b82f6' },
        ].map((n, i) => <NewsCard key={i} {...n} />)}
      </div>
      <div className="space-y-3">
        <div className="rounded-lg p-4" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#52526a' }}>TRENDING TÉMÁK</p>
          {['CS2 Major', 'Valorant Champions', 'Apex szezon 23', 'WoW TWW', 'FPS tippek'].map((t, i) => (
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
   PROFIL
───────────────────────────────────────────── */
const BANNER_COLORS = [
  { label: 'Narancs', from: '#1a0a00', mid: '#2a1000', to: '#150818', glow: '#f55500' },
  { label: 'Lila',    from: '#0e0818', mid: '#1a1030', to: '#0a0812', glow: '#7755dd' },
  { label: 'Kék',     from: '#080e1a', mid: '#0a1828', to: '#060a14', glow: '#3b82f6' },
  { label: 'Zöld',    from: '#060e08', mid: '#0a1a0c', to: '#050c06', glow: '#1ed760' },
  { label: 'Piros',   from: '#140808', mid: '#221010', to: '#100606', glow: '#e83c3c' },
]

const AVATAR_COLORS = [
  { from: '#f55500', to: '#7a2800' },
  { from: '#7755dd', to: '#3322aa' },
  { from: '#3b82f6', to: '#1e4099' },
  { from: '#1ed760', to: '#116633' },
  { from: '#e83c3c', to: '#881111' },
  { from: '#f59e0b', to: '#7a5000' },
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
      <div className="w-[460px] rounded-2xl overflow-hidden"
        style={{ background: '#15151d', border: '1px solid #27273a', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <span className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Profil szerkesztése</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-colors"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e4e4ef')}
            onMouseLeave={e => (e.currentTarget.style.color = '#52526a')}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Banner preview + picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#52526a' }}>BANNER SZÍN</label>
            <div className="h-14 rounded-lg mb-2 overflow-hidden relative"
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

          {/* Avatar picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#52526a' }}>AVATAR SZÍN</label>
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
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>MEGJELENÍTETT NÉV</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2c', color: '#e4e4ef' }}
              onFocus={e => (e.target.style.borderColor = '#f5550066')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2c')} />
          </div>

          {/* Username */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#52526a' }}>FELHASZNÁLÓNÉV</label>
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
              rows={2} placeholder="Írj valamit magadról..."
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none resize-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2c', color: '#e4e4ef' }}
              onFocus={e => (e.target.style.borderColor = '#f5550066')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2c')} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{ background: '#1e1e2c', color: '#8a8aa0', border: '1px solid #27273a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#27273a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e1e2c')}>
              Mégse
            </button>
            <button onClick={() => { onSave(form); onClose() }}
              className="flex-1 py-2 rounded-lg text-[13px] font-bold"
              style={{ background: '#f55500', color: '#fff', boxShadow: '0 0 16px #f5550044' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e05e00')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f55500')}>
              Mentés
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

  const banner = BANNER_COLORS[profile.bannerIdx]
  const avatar = AVATAR_COLORS[profile.avatarIdx]

  return (
    <div className="space-y-4 max-w-3xl">
      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={setProfile}
        />
      )}

      {/* Profile header */}
      <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
        {/* Banner */}
        <div className="h-28 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.mid}, ${banner.to})` }}>
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 80% at 70% 40%, ${banner.glow}33 0%, transparent 60%)`
          }} />
          <button onClick={() => setEditing(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8a8aa0', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#e4e4ef' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0' }}>
            <Edit3 size={11} /> Szerkesztés
          </button>
        </div>

        {/* Avatar + info */}
        <div className="px-5 pb-4">
          <div className="flex items-end gap-4 -mt-8 mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: `radial-gradient(circle at 38% 32%, ${avatar.from}, ${avatar.to})`, border: '3px solid #15151d', boxShadow: `0 0 0 2px ${avatar.from}55` }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <p className="text-[16px] font-bold" style={{ color: '#e4e4ef' }}>{profile.name}</p>
              <p className="text-[12px]" style={{ color: '#52526a' }}>@{profile.username} · Csatlakozva 2023</p>
              {profile.bio && <p className="text-[12px] mt-1" style={{ color: '#8a8aa0' }}>{profile.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[{ v: '124', l: 'Meccs' }, { v: '62%', l: 'Win rate' }, { v: '1.84', l: 'K/D' }, { v: '6', l: 'Barát' }].map(s => (
              <div key={s.l}>
                <p className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>{s.v}</p>
                <p className="text-[11px]" style={{ color: '#52526a' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Eredmények</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { icon: Trophy,    label: 'First Win',    color: '#f59e0b', done: true },
            { icon: Crosshair, label: '100 Kill',     color: '#e83c3c', done: true },
            { icon: Shield,    label: 'Flawless',     color: '#1ed760', done: true },
            { icon: Zap,       label: 'Ace',          color: '#f55500', done: true },
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
    </div>
  )
}

/* ─────────────────────────────────────────────
   GAMES
───────────────────────────────────────────── */
function GameCard({ name, hours, rank, color, abbr }: {
  name: string; hours: string; rank: string; color: string; abbr: string
}) {
  return (
    <div className="rounded-lg overflow-hidden cursor-pointer group"
      style={{ background: '#15151d', border: '1px solid #1e1e2c', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color + '55')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2c')}>
      <div className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}22 0%, #0a0a0f 70%)` }}>
        <span className="text-3xl font-black" style={{ color: `${color}cc` }}>{abbr}</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-[13px] font-semibold truncate" style={{ color: '#c8c8dc' }}>{name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px]" style={{ color: '#52526a' }}>{hours} óra</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>{rank}</span>
        </div>
      </div>
    </div>
  )
}

const AVAILABLE_GAMES = [
  { name: 'Counter-Strike 2', abbr: 'CS2', color: '#f55500' },
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
          <span className="text-[15px] font-semibold" style={{ color: '#e4e4ef' }}>Játék hozzáadása</span>
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
              placeholder="Játék keresése..."
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
                Jelenlegi rang (opcionális)
              </label>
              <input
                type="text"
                placeholder={`pl. Gold 2, Platinum, B Rangsor...`}
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
              Mégse
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
              Hozzáadás
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_GAMES = [
  { name: 'Counter-Strike 2',  hours: '284', rank: 'B Rangsor', color: '#f55500', abbr: 'CS2' },
  { name: 'Apex Legends',      hours: '142', rank: 'Platinum',  color: '#f59e0b', abbr: 'AX'  },
  { name: 'Valorant',          hours: '98',  rank: 'Gold 2',    color: '#e83c3c', abbr: 'VL'  },
  { name: 'World of Warcraft', hours: '421', rank: 'Mythic+',   color: '#d97706', abbr: 'WoW' },
]

function GamesTab({ steamId }: { steamId: string }) {
  const storageKey = `playlogg_games_${steamId}`
  const [showModal, setShowModal] = useState(false)
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

  return (
    <div className="space-y-6">
      {showModal && (
        <AddGameModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      <div className="grid grid-cols-4 gap-3">
        {games.map(g => (
          <GameCard key={g.name} {...g} />
        ))}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
        style={{ background: '#15151d', border: '1px dashed #27273a', color: '#52526a' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3e3e56'; (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#27273a'; (e.currentTarget as HTMLButtonElement).style.color = '#52526a' }}>
        <Plus size={15} />
        Játék hozzáadása
      </button>
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

      {activeTab === 'Kezdőoldal' && <HomeTab steamId={steamId} />}
      {activeTab === 'Stats'      && <StatsTab />}
      {activeTab === 'Hírek'      && <NewsTab />}
      {activeTab === 'Profil'     && <ProfileTab />}
      {activeTab === 'Games'      && <GamesTab steamId={steamId} />}
    </main>
  )
}
