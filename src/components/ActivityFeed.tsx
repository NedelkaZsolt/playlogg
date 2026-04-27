interface ActivityItem {
  id: number
  user: string
  initial: string
  avatarColor: string
  action: string
  game: string
  gameColor: string
  time: string
}

const activities: ActivityItem[] = [
  { id: 1, user: 'David',  initial: 'D', avatarColor: '#5533bb', action: 'csatlakozott',   game: 'Counter-Strike 2', gameColor: '#3b82f6', time: '2p' },
  { id: 2, user: 'Adam',   initial: 'A', avatarColor: '#c84010', action: 'nyerte',          game: 'Counter-Strike 2', gameColor: '#3b82f6', time: '8p' },
  { id: 3, user: 'Peter',  initial: 'P', avatarColor: '#1a7744', action: 'belépett',        game: 'Dhayan Vampyr',    gameColor: '#7755dd', time: '15p' },
  { id: 4, user: 'Joni1',  initial: 'J', avatarColor: '#bb3300', action: 'új rangot ért el', game: 'Counter-Strike 2', gameColor: '#3b82f6', time: '24p' },
  { id: 5, user: 'Ferenc', initial: 'F', avatarColor: '#1a44aa', action: 'kilépett',        game: 'Apex Legends',     gameColor: '#f59e0b', time: '1ó' },
]

export function ActivityFeed() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#15151d', border: '1px solid #1e1e2c' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e2c' }}>
        <span className="text-[13px] font-semibold" style={{ color: '#c8c8dc' }}>Aktivitás</span>
      </div>

      <div className="py-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 px-4 py-2 cursor-pointer"
            style={{ transition: 'background 0.1s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a26')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
              style={{ background: item.avatarColor }}
            >
              {item.initial}
            </div>
            <p className="flex-1 text-[12px] truncate leading-snug">
              <span className="font-medium" style={{ color: '#c8c8dc' }}>{item.user}</span>
              <span style={{ color: '#3e3e56' }}> {item.action} · </span>
              <span style={{ color: item.gameColor, opacity: 0.8 }}>{item.game}</span>
            </p>
            <span className="text-[10px] flex-shrink-0" style={{ color: '#3e3e56' }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
