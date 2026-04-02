import { Search, Clock, AlignJustify } from 'lucide-react'
import type { NavTab } from '../types'

interface HeaderProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

const NAV_TABS: NavTab[] = ['Stats', 'Kezdőoldal', 'Hírek', 'Profil', 'Games']

function FlameIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" fill="#16161e" />
      {/* Outer flame */}
      <path
        d="M15 4 C15 4 21.5 10.5 21.5 17 C21.5 20.6 18.6 23.5 15 23.5 C11.4 23.5 8.5 20.6 8.5 17 C8.5 14.2 10.2 12 10.2 12 C10.2 12 9.2 15.5 12.5 16.8 C12.5 16.8 11.5 13.2 15 11 C15 11 13.8 14.5 16.5 15.5 C16.5 15.5 18.5 13.5 18.5 17.5 C18.5 19.4 16.9 21 15 21 C13.1 21 11.5 19.4 11.5 17.5 C11.5 15.8 12.8 14.6 14 14.2"
        fill="#ff6b00"
        stroke="none"
      />
      {/* Inner brighter flame core */}
      <path
        d="M15 12 C15 12 17.5 14.5 17.5 17 C17.5 18.4 16.4 19.5 15 19.5 C13.6 19.5 12.5 18.4 12.5 17 C12.5 15.8 13.5 14.8 14.2 14.2"
        fill="#ffaa44"
        stroke="none"
      />
    </svg>
  )
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0 z-20"
      style={{
        height: '56px',
        background: '#0f0f15',
        borderBottom: '1px solid #1e1e2a',
      }}
    >
      {/* ── Logo ─────────────────────────────────── */}
      <div className="flex items-center gap-2.5 select-none" style={{ minWidth: 160 }}>
        <FlameIcon />
        <span className="text-[17px] font-bold tracking-tight">
          <span className="text-white">Play</span>
          <span style={{ color: '#ff6b00' }}>Logg</span>
        </span>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <nav className="flex items-center gap-8">
        {NAV_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="relative text-sm font-medium transition-colors duration-150 pb-0.5"
            style={{
              color: activeTab === tab ? '#eaeaf2' : '#56566e',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab)
                (e.currentTarget as HTMLButtonElement).style.color = '#8888a8'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab)
                (e.currentTarget as HTMLButtonElement).style.color = '#56566e'
            }}
          >
            {tab}
            {activeTab === tab && (
              <span
                className="absolute left-0 right-0 -bottom-px rounded-full"
                style={{ height: '2px', background: '#ff6b00' }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* ── Actions ──────────────────────────────── */}
      <div
        className="flex items-center gap-4"
        style={{ minWidth: 160, justifyContent: 'flex-end' }}
      >
        {[Search, Clock, AlignJustify].map((Icon, i) => (
          <button
            key={i}
            className="transition-colors duration-150"
            style={{ color: '#56566e' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#8888a8')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#56566e')
            }
          >
            <Icon size={17} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </header>
  )
}
