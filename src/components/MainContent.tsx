import { useState } from 'react'
import type { NavTab } from '../types'
import { GameTabBar } from './GameTabBar'
import { PostCard } from './PostCard'
import { StatsPanel } from './StatsPanel'
import { ActivityFeed } from './ActivityFeed'
import { posts } from '../data/mockData'
import {
  BarChart2, Trophy, Target, Crosshair, Shield, Zap,
  Newspaper, Clock, ExternalLink, User, Edit3, Award,
  Gamepad2, Plus, Star, TrendingUp
} from 'lucide-react'

interface MainContentProps {
  activeTab: NavTab
}

/* ─────────────────────────────────────────────
   KEZDŐOLDAL
───────────────────────────────────────────── */
function HomeTab() {
  const [activeGame, setActiveGame] = useState('cs2')
  return (
    <div className="space-y-6">
      <GameTabBar activeGame={activeGame} onSelect={setActiveGame} />
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 300px' }}>
        <div className="col-span-2 space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="space-y-4">
          <StatsPanel />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string; sub: string; color: string; icon: React.ElementType
}) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-4"
      style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[22px] font-bold leading-tight" style={{ color: '#eaeaf2' }}>{value}</p>
        <p className="text-[12px] font-medium" style={{ color }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#56566e' }}>{sub}</p>
      </div>
    </div>
  )
}

function MatchRow({ rank, map, result, kd, score }: {
  rank: string; map: string; result: 'W' | 'L'; kd: string; score: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors"
      onMouseEnter={e => (e.currentTarget.style.background = '#1a1a22')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <span className="text-[11px] w-6 text-center font-bold" style={{ color: '#3a3a50' }}>{rank}</span>
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: result === 'W' ? '#22c55e' : '#ef4444' }}
      />
      <span className="flex-1 text-[13px] font-medium" style={{ color: '#d8d8e8' }}>{map}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color: result === 'W' ? '#22c55e' : '#ef4444' }}>{score}</span>
      <span className="text-[12px] tabular-nums w-12 text-right" style={{ color: '#8888a8' }}>{kd}</span>
    </div>
  )
}

function StatsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="K/D arány"      value="1.84"  sub="Top 15%"      color="#ff6b00" icon={Crosshair} />
        <StatCard label="Győzelmi arány" value="62%"   sub="124 meccs"    color="#22c55e" icon={Trophy} />
        <StatCard label="Headshot"        value="41%"   sub="Átlag felett" color="#f59e0b" icon={Target} />
        <StatCard label="Rating"          value="1.21"  sub="Premier"      color="#7755dd" icon={BarChart2} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="rounded-xl overflow-hidden" style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e2a' }}>
            <span className="text-[13px] font-semibold" style={{ color: '#d8d8e8' }}>Legutóbbi meccsek</span>
            <span className="text-[11px]" style={{ color: '#56566e' }}>CS2 · Premier</span>
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
            { label: 'ADR',           value: '82.4',  color: '#ff6b00' },
            { label: 'KAST%',         value: '74%',   color: '#22c55e' },
            { label: 'Utility damage',value: '38.1',  color: '#f59e0b' },
            { label: 'Entry kill%',   value: '55%',   color: '#7755dd' },
            { label: 'Clutch win%',   value: '43%',   color: '#3b82f6' },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between px-4 py-2.5 rounded-lg"
              style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
              <span className="text-[12px]" style={{ color: '#56566e' }}>{s.label}</span>
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
    <div className="flex gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors"
      style={{ background: '#141419', border: '1px solid #1e1e2a' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#282835'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2a'
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
              style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>
              🔥 Trending
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: '#d8d8e8' }}>{title}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Clock size={10} style={{ color: '#3a3a50' }} />
          <span className="text-[11px]" style={{ color: '#3a3a50' }}>{time}</span>
          <span style={{ color: '#282835' }}>·</span>
          <span className="text-[11px]" style={{ color: '#3a3a50' }}>{source}</span>
          <ExternalLink size={9} style={{ color: '#3a3a50' }} className="ml-auto" />
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
          { title: 'CS2 frissítés: új Premier térképek és rangsor változások', source: 'HLTV', time: '1 órája', tag: 'CS2', tagColor: '#ff6b00', hot: true },
          { title: 'Major selejtező: NaVi és Vitality továbbjutottak a döntőbe', source: 'HLTV', time: '3 órája', tag: 'Esport', tagColor: '#22c55e' },
          { title: 'Apex Legends szezon 23 patch notes — Legend és fegyver változások', source: 'EA Play', time: '5 órája', tag: 'Apex', tagColor: '#f59e0b' },
          { title: 'Valorant Champions Tour EMEA: Grand Final eredmények', source: 'Dot Esports', time: '8 órája', tag: 'Valorant', tagColor: '#ef4444', hot: true },
          { title: 'World of Warcraft The War Within 11.1 patch: új dungeon és raid', source: 'Wowhead', time: '12 órája', tag: 'WoW', tagColor: '#d97706' },
          { title: 'Steam játékstatisztika: CS2 all-time csúcs online játékosszámmal', source: 'Steam', time: '1 napja', tag: 'Gaming', tagColor: '#3b82f6' },
        ].map((n, i) => <NewsCard key={i} {...n} />)}
      </div>
      <div className="space-y-3">
        <div className="rounded-xl p-4" style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#56566e' }}>TRENDING TÉMÁK</p>
          {['CS2 Major', 'Valorant Champions', 'Apex szezon 23', 'WoW TWW', 'FPS tippek'].map((t, i) => (
            <div key={t} className="flex items-center gap-2 py-1.5 cursor-pointer"
              onMouseEnter={e => (e.currentTarget.style.color = '#eaeaf2')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <span className="text-[11px] font-bold tabular-nums w-4" style={{ color: '#3a3a50' }}>#{i + 1}</span>
              <span className="text-[12px] font-medium" style={{ color: '#8888a8' }}>{t}</span>
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
  { label: 'Narancs', from: '#1a0a00', mid: '#2a1000', to: '#150818', glow: '#ff6b00' },
  { label: 'Lila',    from: '#0e0818', mid: '#1a1030', to: '#0a0812', glow: '#7755dd' },
  { label: 'Kék',     from: '#080e1a', mid: '#0a1828', to: '#060a14', glow: '#3b82f6' },
  { label: 'Zöld',    from: '#060e08', mid: '#0a1a0c', to: '#050c06', glow: '#22c55e' },
  { label: 'Piros',   from: '#140808', mid: '#221010', to: '#100606', glow: '#ef4444' },
]

const AVATAR_COLORS = [
  { from: '#ff6b00', to: '#7a2800' },
  { from: '#7755dd', to: '#3322aa' },
  { from: '#3b82f6', to: '#1e4099' },
  { from: '#22c55e', to: '#116633' },
  { from: '#ef4444', to: '#881111' },
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
        style={{ background: '#141419', border: '1px solid #282835', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e2a' }}>
          <span className="text-[15px] font-semibold" style={{ color: '#eaeaf2' }}>Profil szerkesztése</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-colors"
            style={{ background: '#1e1e2a', color: '#56566e' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#eaeaf2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#56566e')}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Banner preview + picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#56566e' }}>BANNER SZÍN</label>
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
                    boxShadow: form.bannerIdx === i ? `0 0 0 2px ${b.glow}, 0 0 8px ${b.glow}66` : `0 0 0 1px #282835`,
                  }} />
              ))}
            </div>
          </div>

          {/* Avatar picker */}
          <div>
            <label className="text-[11px] font-medium block mb-2" style={{ color: '#56566e' }}>AVATAR SZÍN</label>
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
                      boxShadow: form.avatarIdx === i ? `0 0 0 2px ${c.from}, 0 0 8px ${c.from}66` : `0 0 0 1px #282835`,
                    }} />
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#56566e' }}>MEGJELENÍTETT NÉV</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2a', color: '#eaeaf2' }}
              onFocus={e => (e.target.style.borderColor = '#ff6b0066')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2a')} />
          </div>

          {/* Username */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#56566e' }}>FELHASZNÁLÓNÉV</label>
            <div className="flex items-center gap-0 rounded-lg overflow-hidden"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2a' }}>
              <span className="px-3 text-[13px]" style={{ color: '#56566e' }}>@</span>
              <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/\s/g, '') }))}
                className="flex-1 py-2 pr-3 text-[13px] outline-none bg-transparent"
                style={{ color: '#eaeaf2' }} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#56566e' }}>BIO</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={2} placeholder="Írj valamit magadról..."
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none resize-none"
              style={{ background: '#0f0f14', border: '1px solid #1e1e2a', color: '#eaeaf2' }}
              onFocus={e => (e.target.style.borderColor = '#ff6b0066')}
              onBlur={e => (e.target.style.borderColor = '#1e1e2a')} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{ background: '#1e1e2a', color: '#8888a8', border: '1px solid #282835' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#282835')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e1e2a')}>
              Mégse
            </button>
            <button onClick={() => { onSave(form); onClose() }}
              className="flex-1 py-2 rounded-lg text-[13px] font-bold"
              style={{ background: '#ff6b00', color: '#fff', boxShadow: '0 0 16px #ff6b0044' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e05e00')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ff6b00')}>
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
      <div className="rounded-xl overflow-hidden" style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
        {/* Banner */}
        <div className="h-28 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.mid}, ${banner.to})` }}>
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 80% at 70% 40%, ${banner.glow}33 0%, transparent 60%)`
          }} />
          <button onClick={() => setEditing(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8888a8', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#eaeaf2' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#8888a8' }}>
            <Edit3 size={11} /> Szerkesztés
          </button>
        </div>

        {/* Avatar + info */}
        <div className="px-5 pb-4">
          <div className="flex items-end gap-4 -mt-8 mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: `radial-gradient(circle at 38% 32%, ${avatar.from}, ${avatar.to})`, border: '3px solid #141419', boxShadow: `0 0 0 2px ${avatar.from}55` }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <p className="text-[16px] font-bold" style={{ color: '#eaeaf2' }}>{profile.name}</p>
              <p className="text-[12px]" style={{ color: '#56566e' }}>@{profile.username} · Csatlakozva 2023</p>
              {profile.bio && <p className="text-[12px] mt-1" style={{ color: '#8888a8' }}>{profile.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[{ v: '124', l: 'Meccs' }, { v: '62%', l: 'Win rate' }, { v: '1.84', l: 'K/D' }, { v: '6', l: 'Barát' }].map(s => (
              <div key={s.l}>
                <p className="text-[15px] font-bold" style={{ color: '#eaeaf2' }}>{s.v}</p>
                <p className="text-[11px]" style={{ color: '#56566e' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#141419', border: '1px solid #1e1e2a' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2a' }}>
          <span className="text-[13px] font-semibold" style={{ color: '#d8d8e8' }}>Eredmények</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { icon: Trophy,    label: 'First Win',    color: '#f59e0b', done: true },
            { icon: Crosshair, label: '100 Kill',     color: '#ef4444', done: true },
            { icon: Shield,    label: 'Flawless',     color: '#22c55e', done: true },
            { icon: Zap,       label: 'Ace',          color: '#ff6b00', done: true },
            { icon: Star,      label: 'Rank B',       color: '#7755dd', done: false },
            { icon: TrendingUp,label: 'Win Streak 5', color: '#3b82f6', done: false },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
              style={{ background: a.done ? `${a.color}12` : '#0f0f14', border: `1px solid ${a.done ? a.color + '33' : '#1e1e2a'}`, opacity: a.done ? 1 : 0.45 }}>
              <a.icon size={15} style={{ color: a.done ? a.color : '#3a3a50' }} />
              <span className="text-[11px] font-medium" style={{ color: a.done ? '#d8d8e8' : '#3a3a50' }}>{a.label}</span>
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
    <div className="rounded-xl overflow-hidden cursor-pointer group"
      style={{ background: '#141419', border: '1px solid #1e1e2a', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color + '55')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2a')}>
      <div className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}22 0%, #0a0a0f 70%)` }}>
        <span className="text-3xl font-black" style={{ color: `${color}cc` }}>{abbr}</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-[13px] font-semibold truncate" style={{ color: '#d8d8e8' }}>{name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px]" style={{ color: '#56566e' }}>{hours} óra</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>{rank}</span>
        </div>
      </div>
    </div>
  )
}

const AVAILABLE_GAMES = [
  { name: 'Counter-Strike 2', abbr: 'CS2', color: '#ff6b00' },
  { name: 'Apex Legends',     abbr: 'AX',  color: '#f59e0b' },
  { name: 'Valorant',         abbr: 'VL',  color: '#ef4444' },
  { name: 'World of Warcraft',abbr: 'WoW', color: '#d97706' },
  { name: 'League of Legends',abbr: 'LoL', color: '#3b82f6' },
  { name: 'Fortnite',         abbr: 'FN',  color: '#22c55e' },
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
        style={{ background: '#141419', border: '1px solid #282835', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e2a' }}>
          <span className="text-[15px] font-semibold" style={{ color: '#eaeaf2' }}>Játék hozzáadása</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#1e1e2a', color: '#56566e' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#eaeaf2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#56566e')}>
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: '#0f0f14', border: '1px solid #1e1e2a' }}>
            <span style={{ color: '#56566e', fontSize: 13 }}>🔍</span>
            <input
              autoFocus
              type="text"
              placeholder="Játék keresése..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: '#eaeaf2' }}
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
                    (e.currentTarget as HTMLDivElement).style.background = '#1a1a22'
                }}
                onMouseLeave={e => {
                  if (selected?.name !== g.name)
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
                  style={{ background: `${g.color}22`, color: g.color }}>
                  {g.abbr}
                </div>
                <span className="text-[13px] font-medium" style={{ color: '#d8d8e8' }}>{g.name}</span>
                {selected?.name === g.name && (
                  <span className="ml-auto text-[11px] font-bold" style={{ color: g.color }}>✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Rank input */}
          {selected && (
            <div>
              <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#56566e' }}>
                Jelenlegi rang (opcionális)
              </label>
              <input
                type="text"
                placeholder={`pl. Gold 2, Platinum, B Rangsor...`}
                value={rank}
                onChange={e => setRank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: '#0f0f14', border: `1px solid ${selected.color}44`, color: '#eaeaf2' }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{ background: '#1e1e2a', color: '#8888a8', border: '1px solid #282835' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#282835')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e1e2a')}>
              Mégse
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                if (selected) { onAdd(selected.name, selected.abbr, selected.color); onClose() }
              }}
              className="flex-1 py-2 rounded-lg text-[13px] font-bold transition-all"
              style={{
                background: selected ? selected.color : '#1e1e2a',
                color: selected ? '#fff' : '#3a3a50',
                cursor: selected ? 'pointer' : 'not-allowed',
                boxShadow: selected ? `0 0 16px ${selected.color}44` : 'none',
              }}>
              Hozzáadás
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GamesTab() {
  const [showModal, setShowModal] = useState(false)
  const [games, setGames] = useState([
    { name: 'Counter-Strike 2',  hours: '284', rank: 'B Rangsor', color: '#ff6b00', abbr: 'CS2' },
    { name: 'Apex Legends',      hours: '142', rank: 'Platinum',  color: '#f59e0b', abbr: 'AX'  },
    { name: 'Valorant',          hours: '98',  rank: 'Gold 2',    color: '#ef4444', abbr: 'VL'  },
    { name: 'World of Warcraft', hours: '421', rank: 'Mythic+',   color: '#d97706', abbr: 'WoW' },
  ])

  function handleAdd(name: string, abbr: string, color: string) {
    if (!games.find(g => g.name === name)) {
      setGames(prev => [...prev, { name, abbr, color, hours: '0', rank: '—' }])
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
        style={{ background: '#141419', border: '1px dashed #282835', color: '#56566e' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3a50'; (e.currentTarget as HTMLButtonElement).style.color = '#8888a8' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#282835'; (e.currentTarget as HTMLButtonElement).style.color = '#56566e' }}>
        <Plus size={15} />
        Játék hozzáadása
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export function MainContent({ activeTab }: MainContentProps) {
  const icons: Record<NavTab, React.ElementType> = {
    Stats: BarChart2, Kezdőoldal: Zap, Hírek: Newspaper, Profil: User, Games: Gamepad2
  }
  const Icon = icons[activeTab]

  return (
    <main className="flex-1 overflow-y-auto dot-grid" style={{ background: '#08080c', padding: '24px' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <Icon size={18} style={{ color: '#ff6b00' }} />
        <h1 className="text-[19px] font-bold" style={{ color: '#eaeaf2' }}>{activeTab}</h1>
      </div>

      {activeTab === 'Kezdőoldal' && <HomeTab />}
      {activeTab === 'Stats'      && <StatsTab />}
      {activeTab === 'Hírek'      && <NewsTab />}
      {activeTab === 'Profil'     && <ProfileTab />}
      {activeTab === 'Games'      && <GamesTab />}
    </main>
  )
}
