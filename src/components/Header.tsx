import { useState, useRef, useEffect } from 'react'
import { Search, Bell, User, Settings, LogOut, Trophy, MessageSquare, X } from 'lucide-react'
import type { NavTab } from '../types'
import type { SteamUser } from '../hooks/useSteamAuth'

interface HeaderProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  user: SteamUser
  onLogout: () => void
}

const NAV_TABS: NavTab[] = ['Stats', 'Home', 'News', 'Explore', 'Profile', 'Games']
const ACCENT_COLOR = '#3b82f6'

const NOTIFICATIONS = [
  { id: 1, icon: Trophy,        color: ACCENT_COLOR, text: 'Adam won a match in Counter-Strike 2',              time: '2m',  read: false },
  { id: 2, icon: User,          color: '#3b82f6', text: 'Peter sent you a friend request',                   time: '15m', read: false },
  { id: 3, icon: MessageSquare, color: '#1ed760', text: 'David commented: "great game"',                    time: '1h',  read: true  },
  { id: 4, icon: Trophy,        color: '#a855f7', text: 'New rank: Silver II — Counter-Strike 2',           time: '3h',  read: true  },
]

const SEARCH_SUGGESTIONS = ['Counter-Strike 2', 'Apex Legends', 'Dhayan Vampyr', 'Adam', 'David', 'Joni1']

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

export function Header({ activeTab, onTabChange, user, onLogout }: HeaderProps) {
  const [openPanel, setOpenPanel] = useState<'search' | 'notif' | 'profile' | null>(null)
  const [searchVal, setSearchVal] = useState('')
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const panelRef = useRef<HTMLDivElement>(null)
  useOutsideClick(panelRef, () => setOpenPanel(null))

  const toggle = (panel: 'search' | 'notif' | 'profile') =>
    setOpenPanel((p) => (p === panel ? null : panel))

  const unread = notifications.filter((n) => !n.read).length

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))

  const filtered = searchVal.trim()
    ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(searchVal.toLowerCase()))
    : SEARCH_SUGGESTIONS

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0 z-20 gap-8 relative"
      style={{ height: '52px', background: '#111119', borderBottom: '1px solid #1e1e2c' }}
    >
          {/* Logo */}
      <div className="flex items-center gap-2 select-none flex-shrink-0" style={{ minWidth: 140 }}>
        <img src="/logo.png" alt="PlayLogg Logo" width="150" height="48" style={{ objectFit: 'contain' }} />
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1 justify-center">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-100"
              style={{
                color: isActive ? '#e4e4ef' : '#52526a',
                background: isActive ? '#1a1a26' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#52526a'
              }}
            >
              {tab}
              {isActive && (
                <span
                  className="absolute bottom-0 left-4 right-4 rounded-t-full"
                  style={{ height: '2px', background: ACCENT_COLOR }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Actions + dropdowns wrapper */}
      <div ref={panelRef} className="flex items-center gap-3 flex-shrink-0 relative" style={{ minWidth: 140, justifyContent: 'flex-end' }}>

        {/* Search button */}
        <button
          onClick={() => toggle('search')}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{
            color: openPanel === 'search' ? '#e4e4ef' : '#52526a',
            background: openPanel === 'search' ? '#1a1a26' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (openPanel !== 'search') {
              (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#1a1a26'
            }
          }}
          onMouseLeave={(e) => {
            if (openPanel !== 'search') {
              (e.currentTarget as HTMLButtonElement).style.color = '#52526a'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }
          }}
        >
          <Search size={16} strokeWidth={1.8} />
        </button>

        {/* Bell button */}
        <button
          onClick={() => toggle('notif')}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors relative"
          style={{
            color: openPanel === 'notif' ? '#e4e4ef' : '#52526a',
            background: openPanel === 'notif' ? '#1a1a26' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (openPanel !== 'notif') {
              (e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#1a1a26'
            }
          }}
          onMouseLeave={(e) => {
            if (openPanel !== 'notif') {
              (e.currentTarget as HTMLButtonElement).style.color = '#52526a'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }
          }}
        >
          <Bell size={16} strokeWidth={1.8} />
          {unread > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: ACCENT_COLOR }}
            />
          )}
        </button>

        {/* Avatar button */}
        <button
          onClick={() => toggle('profile')}
          className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden transition-opacity"
          style={{
            outline: openPanel === 'profile' ? `2px solid ${user.avatarColor}60` : 'none',
            outlineOffset: '2px',
          }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.personaName} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: user.avatarColor, color: '#fff' }}
            >
              {user.personaName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* ── Search dropdown ── */}
        {openPanel === 'search' && (
          <div
            className="absolute top-full right-0 mt-2 rounded-lg overflow-hidden"
            style={{
              width: '300px',
              background: '#15151d',
              border: '1px solid #27273a',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              zIndex: 50,
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <Search size={13} strokeWidth={1.8} style={{ color: '#3e3e56', flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#3e3e56]"
                style={{ color: '#e4e4ef' }}
              />
              {searchVal && (
                <button onClick={() => setSearchVal('')}>
                  <X size={12} style={{ color: '#3e3e56' }} />
                </button>
              )}
            </div>
            <div className="py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-[12px]" style={{ color: '#3e3e56' }}>No results</p>
              ) : filtered.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
                  style={{ transition: 'background 0.1s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a26')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
                  onClick={() => { setSearchVal(s); setOpenPanel(null) }}
                >
                  <Search size={11} style={{ color: '#3e3e56', flexShrink: 0 }} />
                  <span className="text-[13px]" style={{ color: '#c8c8dc' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Notifications dropdown ── */}
        {openPanel === 'notif' && (
          <div
            className="absolute top-full right-0 mt-2 rounded-lg overflow-hidden"
            style={{
              width: '320px',
              background: '#15151d',
              border: '1px solid #27273a',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              zIndex: 50,
            }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Notifications</span>
              {unread > 0 && (
                <button
                  className="text-[11px] font-medium transition-colors"
                  style={{ color: '#52526a' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#52526a')}
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="py-1">
              {notifications.map((n) => {
                const Icon = n.icon
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                    style={{
                      background: n.read ? 'transparent' : '#1a1a26',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1e1e2c')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = n.read ? 'transparent' : '#1a1a26')}
                    onClick={() => setNotifications((ns) => ns.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: n.color + '22' }}
                    >
                      <Icon size={13} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-snug" style={{ color: n.read ? '#52526a' : '#c8c8dc' }}>
                        {n.text}
                      </p>
                      <span className="text-[10px]" style={{ color: '#3e3e56' }}>{n.time}</span>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: ACCENT_COLOR }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Profile dropdown ── */}
        {openPanel === 'profile' && (
          <div
            className="absolute top-full right-0 mt-2 rounded-lg overflow-hidden"
            style={{
              width: '200px',
              background: '#15151d',
              border: '1px solid #27273a',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              zIndex: 50,
            }}
          >
            {/* User info */}
            <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: '1px solid #1e1e2c' }}>
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.personaName} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[13px] font-bold"
                    style={{ background: user.avatarColor, color: '#fff' }}
                  >
                    {user.personaName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold truncate" style={{ color: '#e4e4ef' }}>{user.personaName}</p>
                <p className="text-[10px]" style={{ color: '#3e3e56' }}>Steam ID: {user.steamId}</p>
              </div>
            </div>

            {/* Menu items */}
            {[
              { icon: User,     label: 'My profile',    action: () => { onTabChange('Profile'); setOpenPanel(null) } },
              { icon: Settings, label: 'Settings',      action: () => setOpenPanel(null) },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors"
                style={{ color: '#8a8aa0', background: 'transparent' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1a1a26'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#e4e4ef'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0'
                }}
              >
                <Icon size={14} strokeWidth={1.8} />
                {label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid #1e1e2c' }}>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors"
                style={{ color: '#3cb2e8', background: 'transparent' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#1a1a26')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                onClick={() => { setOpenPanel(null); onLogout() }}
              >
                <LogOut size={14} strokeWidth={1.8} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
