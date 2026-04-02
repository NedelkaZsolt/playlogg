import { Search, GripVertical, ChevronDown, CheckCircle2, Square, Minus, PauseCircle } from 'lucide-react'
import type { Friend } from '../types'
import { friends } from '../data/mockData'

function Avatar({ friend }: { friend: Friend }) {
  const [from, to] = friend.avatarGradient
  return (
    <div
      className="relative flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white select-none"
      style={{
        background: `radial-gradient(circle at 38% 32%, ${from}, ${to})`,
        boxShadow: `0 0 0 2px ${friend.ringColor}55, 0 2px 8px rgba(0,0,0,0.5)`,
      }}
    >
      {friend.initial}
      {friend.isOnline && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{
            background: '#22c55e',
            borderColor: '#0f0f15',
            boxShadow: '0 0 6px rgba(34,197,94,0.6)',
          }}
        />
      )}
    </div>
  )
}

function RightIcon({ type }: { type: NonNullable<Friend['rightIcon']> }) {
  const cls = 'flex-shrink-0 opacity-50 group-hover:opacity-80 transition-opacity'
  switch (type) {
    case 'check':
      return <CheckCircle2 size={15} className={cls} style={{ color: '#22c55e' }} />
    case 'square':
      return <Square size={13} className={cls} style={{ color: '#56566e' }} />
    case 'minus':
      return <Minus size={13} className={cls} style={{ color: '#56566e' }} />
    case 'pause':
      return <PauseCircle size={14} className={cls} style={{ color: '#56566e' }} />
  }
}

function FriendRow({ friend }: { friend: Friend }) {
  return (
    <div
      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-100"
      style={{ '--hover-bg': '#141419' } as React.CSSProperties}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = '#141419')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = 'transparent')
      }
    >
      <Avatar friend={friend} />
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-semibold truncate leading-tight"
          style={{ color: '#d8d8e8' }}
        >
          {friend.name}
        </p>
        <p
          className="text-[11px] truncate leading-tight mt-[2px]"
          style={{
            color: friend.statusColor === 'orange' ? '#ff6b00' : '#56566e',
          }}
        >
          {friend.status}
        </p>
      </div>
      {friend.rightIcon && <RightIcon type={friend.rightIcon} />}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        width: '280px',
        background: '#0f0f15',
        borderRight: '1px solid #1e1e2a',
      }}
    >
      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#141419', border: '1px solid #1e1e2a' }}
        >
          <Search size={13} style={{ color: '#56566e' }} className="flex-shrink-0" />
          <input
            type="text"
            placeholder="Barátok"
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: '#eaeaf2' }}
          />
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[13px] font-semibold" style={{ color: '#d8d8e8' }}>
          Barátok
        </span>
        <GripVertical size={15} style={{ color: '#56566e' }} />
      </div>

      {/* Friend list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {friends.map((friend) => (
          <FriendRow key={friend.id} friend={friend} />
        ))}
      </div>

      {/* Groups */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid #1e1e2a' }}
      >
        <button
          className="flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150"
          style={{ color: '#56566e' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = '#8888a8')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = '#56566e')
          }
        >
          Csoportok
          <ChevronDown size={13} />
        </button>
      </div>
    </aside>
  )
}
