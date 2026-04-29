import { useState, useRef } from 'react'
import { Search, CheckCircle2, Square, Minus, PauseCircle, UserPlus, X, Send, PhoneCall } from 'lucide-react'
import type { Friend } from '../types'
import { friends } from '../data/mockData'

function ChatPopup({ friend, messages, onSendMessage, onClose }: {
  friend: Friend
  messages: {text: string, timestamp: string}[]
  onSendMessage: (text: string) => void
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const text = inputRef.current?.value?.trim()
    if (text) {
      onSendMessage(text)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      style={{ width: '320px', maxHeight: '400px' }}
    >
      <div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{ background: '#15151d', border: '1px solid #27273a' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <div className="flex items-center gap-2">
            <Avatar friend={friend} />
            <span className="text-[13px] font-semibold" style={{ color: '#e4e4ef' }}>{friend.name}</span>
          </div>
          <button onClick={onClose} className="text-[#52526a] hover:text-[#e4e4ef]">
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="px-4 py-3 max-h-64 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-[12px] text-center" style={{ color: '#52526a' }}>No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="flex flex-col">
                <p className="text-[12px]" style={{ color: '#c8c8dc' }}>{msg.text}</p>
                <p className="text-[10px]" style={{ color: '#52526a' }}>{msg.timestamp}</p>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #1e1e2c' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Write a message..."
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 rounded-md text-[12px] outline-none"
            style={{ background: '#1a1a26', border: '1px solid #27273a', color: '#e4e4ef' }}
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-md transition-colors"
            style={{ background: '#3b82f6', color: '#fff' }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function CallPopup({
  callId,
  participants,
  availableFriends,
  onAddParticipant,
  onRemoveParticipant,
  onClose,
}: {
  callId: string
  participants: Friend[]
  availableFriends: Friend[]
  onAddParticipant: (callId: string, friendId: number) => void
  onRemoveParticipant: (callId: string, friendId: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ width: '320px', maxHeight: '420px' }}>
      <div className="rounded-lg overflow-hidden shadow-2xl" style={{ background: '#15151d', border: '1px solid #27273a' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#e4e4ef' }}>Call</p>
            <p className="text-[11px]" style={{ color: '#52526a' }}>{participants.length} participant{participants.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} className="text-[#52526a] hover:text-[#e4e4ef]">
            <X size={14} />
          </button>
        </div>

        <div className="px-4 py-3 max-h-64 overflow-y-auto space-y-3">
          {participants.length === 0 ? (
            <p className="text-[12px] text-center" style={{ color: '#52526a' }}>Add friends to start the call.</p>
          ) : (
            participants.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 px-2 py-2 rounded-md" style={{ background: '#1a1a26' }}>
                <Avatar friend={friend} />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: '#e4e4ef' }}>{friend.name}</p>
                  <p className="text-[10px] truncate" style={{ color: '#8a8aa0' }}>{friend.status}</p>
                </div>
                <button
                  onClick={() => onRemoveParticipant(callId, friend.id)}
                  className="text-[#52526a] hover:text-[#f87171]"
                >
                  ✕
                </button>
              </div>
            ))
          )}

          <div className="pt-3 border-t border-[#1e1e2c]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8aa0] mb-2">Add participant</p>
            <div className="space-y-2">
              {availableFriends.length === 0 ? (
                <p className="text-[12px]" style={{ color: '#52526a' }}>No more friends available.</p>
              ) : (
                availableFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => onAddParticipant(callId, friend.id)}
                    className="w-full text-left rounded-md px-3 py-2 text-[12px]"
                    style={{ background: '#1a1a26', color: '#e4e4ef' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#23232f')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#1a1a26')}
                  >
                    {friend.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <span className="text-[15px] font-bold" style={{ color: '#e4e4ef' }}>Add Friend</span>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#1e1e2c', color: '#52526a' }}
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-[12px]" style={{ color: '#52526a' }}>
          Enter the username of the friend you want to add.
        </p>

        <input
          autoFocus
          type="text"
          placeholder="Username"
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
          {sent ? 'Request sent!' : 'Send friend request'}
        </button>
      </div>
    </div>
  )
}

function Avatar({ friend }: { friend: Friend }) {
  const [from] = friend.avatarGradient
  
  if (friend.avatar) {
    return (
      <div className="relative flex-shrink-0">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        {friend.isOnline && (
          <span
            className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2"
            style={{ background: '#1ed760', borderColor: '#111119' }}
          />
        )}
      </div>
    )
  }
  
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

function FriendRow({ friend, onMouseEnter, onMouseLeave, onClick }: { 
  friend: Friend; 
  onMouseEnter: () => void; 
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer"
      style={{ transition: 'background 0.1s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = '#16161f'
        onMouseEnter()
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent'
        onMouseLeave()
      }}
      onClick={onClick}
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
  const [chats, setChats] = useState<Record<string, {text: string, timestamp: string}[]>>({})
  const [openChats, setOpenChats] = useState<string[]>([])
  const [calls, setCalls] = useState<Record<string, { participants: Friend[] }>>({})
  const [openCalls, setOpenCalls] = useState<string[]>([])

  const online  = friends.filter((f) => f.isOnline)
  const offline = friends.filter((f) => !f.isOnline)

  const handleSendMessage = (friendId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setChats(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), { text, timestamp }]
    }))
  }

  const toggleChat = (friendId: string) => {
    setOpenChats(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const closeChat = (friendId: string) => {
    setOpenChats(prev => prev.filter(id => id !== friendId))
  }

  const startCall = () => {
    const id = Date.now().toString()
    setCalls(prev => ({ ...prev, [id]: { participants: [] } }))
    setOpenCalls(prev => [...prev, id])
  }

  const addParticipantToCall = (callId: string, friendId: number) => {
    setCalls(prev => {
      const current = prev[callId]
      if (!current) return prev
      const friend = friends.find((f) => f.id === friendId)
      if (!friend) return prev
      if (current.participants.some((p) => p.id === friendId)) return prev
      return {
        ...prev,
        [callId]: { participants: [...current.participants, friend] }
      }
    })
  }

  const removeParticipantFromCall = (callId: string, friendId: number) => {
    setCalls(prev => {
      const current = prev[callId]
      if (!current) return prev
      return {
        ...prev,
        [callId]: { participants: current.participants.filter((p) => p.id !== friendId) }
      }
    })
  }

  const closeCall = (callId: string) => {
    setOpenCalls(prev => prev.filter((id) => id !== callId))
  }

  return (
    <>
      <aside
        className="flex flex-col flex-shrink-0 overflow-hidden"
        style={{ width: '248px', background: '#111119 url(/hatter.png) no-repeat center center / cover', borderRight: '1px solid #1e1e2c' }}
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
              placeholder="Search friends"
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
              {online.map((f) => <FriendRow key={f.id} friend={f} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => toggleChat(f.id.toString())} />)}
            </>
          )}
          {offline.length > 0 && (
            <>
              <SectionLabel label="Offline" count={offline.length} />
              {offline.map((f) => <FriendRow key={f.id} friend={f} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => toggleChat(f.id.toString())} />)}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid #1e1e2c' }}>
          <div className="grid gap-2">
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
            Add Friend
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-colors"
            style={{ color: '#7dd3fc', background: 'transparent' }}
            onClick={startCall}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#16161f'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#e4e4ef'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#7dd3fc'
            }}
          >
            <PhoneCall size={14} strokeWidth={1.8} />
            Start Call
          </button>
        </div>
        </div>
      </aside>

      {openChats.map((friendId, index) => {
        const friend = friends.find(f => f.id.toString() === friendId)!
        return (
          <div
            key={friendId}
            className="fixed bottom-4 z-50"
            style={{ 
              right: `${16 + index * 336}px`, 
              width: '320px', 
              maxHeight: '400px' 
            }}
          >
            <ChatPopup
              friend={friend}
              messages={chats[friendId] || []}
              onSendMessage={(text) => handleSendMessage(friendId, text)}
              onClose={() => closeChat(friendId)}
            />
          </div>
        )
      })}

      {openCalls.map((callId, index) => {
        const call = calls[callId]
        if (!call) return null
        const availableFriends = friends.filter((friend) => !call.participants.some((p) => p.id === friend.id))

        return (
          <div
            key={callId}
            className="fixed bottom-4 z-50"
            style={{
              right: `${16 + index * 336}px`,
              width: '320px',
              maxHeight: '420px',
            }}
          >
            <CallPopup
              callId={callId}
              participants={call.participants}
              availableFriends={availableFriends}
              onAddParticipant={addParticipantToCall}
              onRemoveParticipant={removeParticipantFromCall}
              onClose={() => closeCall(callId)}
            />
          </div>
        )
      })}
    </>
  )
}
