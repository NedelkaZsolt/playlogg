import { useState } from 'react'
import { Search, CheckCircle2, Square, Minus, PauseCircle, UserPlus, X } from 'lucide-react'
import type { Friend } from '../types'
import { friends } from '../data/mockData'

function AddFriendModal({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSend = () => {
    if (!value.trim()) return
    setSent(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[380px] rounded-xl p-6 space-y-4"
        style={{ background: '#15151d', border: '1px solid #27273a', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>Barát hozzáadása</span>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-[12px]" style={{ color: '#52526a' }}>
          Add meg a felhasználónevet akit meg szeretnél találni.
        </p>

        <input
          autoFocus
          type="text"
          placeholder="Felhasználónév"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full px-3 py-2 rounded-md text-[13px] outline-none"
          style={{
            background: '#1a1a26',
            border: '1px solid #27273a',
            color: '#e4e4ef',
          }}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || sent}
          className="w-full py-2 rounded-md text-[13px] font-semibold transition-colors"
          style={{
            background: sent ? '#1a1a26' : '#3b82f6',
            color: sent ? '#1ed760' : '#fff',
            opacity: !value.trim() ? 0.4 : 1,
            cursor: !value.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {sent ? 'Kérés elküldve!' : 'Barát kérés küldése'}
        </button>
      </div>
    </div>
  )
}

function Avatar({ friend }: { friend: Friend }) {
  const [from] = friend.avatarGradient
  return (
    <div className="relative flex-shrink-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white select-none"
        style={{ background: from }}
      >
        {friend.initial}
      </div>
      {friend.isOnline && (
        <span
          className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2"
          style={{ background: '#1ed760', borderColor: '#111119' }}
        />
      )}
    </div>
  )
}

function RightIcon({ type }: { type: NonNullable<Friend['rightIcon']> }) {
  const style = { color: '#52526a', flexShrink: 0 }
  switch (type) {
    case 'check':  return <CheckCircle2 size={14} style={{ ...style, color: '#1ed760', opacity: 0.8 }} />
    case 'square': return <Square       size={13} style={style} />
    case 'minus':  return <Minus        size={13} style={style} />
    case 'pause':  return <PauseCircle  size={13} style={style} />
  }
}

function FriendRow({ friend }: { friend: Friend }) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer"
      style={{ transition: 'background 0.1s' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#16161f')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
    >
      <Avatar friend={friend} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate leading-snug" style={{ color: '#c8c8dc' }}>
          {friend.name}
        </p>
        <p className="text-[11px] truncate leading-snug" style={{ color: friend.statusColor === 'orange' ? '#3b82f6' : '#52526a' }}>
          {friend.status}
        </p>
      </div>
      {friend.rightIcon && <RightIcon type={friend.rightIcon} />}
    </div>
  )
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="px-3 pt-4 pb-1 flex items-center justify-between">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3e3e56' }}>
        {label} — {count}
      </span>
    </div>
  )
}

export function Sidebar() {
  const [showModal, setShowModal] = useState(false)
  const online  = friends.filter((f) => f.isOnline)
  const offline = friends.filter((f) => !f.isOnline)

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: '248px', background: '#111119', borderRight: '1px solid #1e1e2c' }}
    >
      {showModal && <AddFriendModal onClose={() => setShowModal(false)} />}
      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md"
          style={{ background: '#16161f', border: '1px solid #1e1e2c' }}
        >
          <Search size={13} strokeWidth={1.8} style={{ color: '#3e3e56', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Barátok keresése"
            className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#3e3e56]"
            style={{ color: '#c8c8dc' }}
          />
        </div>
      </div>

      {/* Friend list */}
      <div className="flex-1 overflow-y-auto px-0">
        {online.length > 0 && (
          <>
            <SectionLabel label="Online" count={online.length} />
            {online.map((f) => <FriendRow key={f.id} friend={f} />)}
          </>
        )}
        {offline.length > 0 && (
          <>
            <SectionLabel label="Offline" count={offline.length} />
            {offline.map((f) => <FriendRow key={f.id} friend={f} />)}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #1e1e2c' }}>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-colors"
          style={{ color: '#52526a', background: 'transparent' }}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#16161f'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#8a8aa0'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#52526a'
          }}
        >
          <UserPlus size={14} strokeWidth={1.8} />
          Barát hozzáadása
        </button>
      </div>
    </aside>
  )
}
