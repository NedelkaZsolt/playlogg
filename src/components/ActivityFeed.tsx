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
  { id: 1, user: 'David',  initial: 'D', avatarColor: '#6644cc', action: 'csatlakozott a meccshez',      game: 'Counter-Strike 2',  gameColor: '#ff6b00', time: '2p' },
  { id: 2, user: 'Adam',   initial: 'A', avatarColor: '#e84a10', action: 'nyerte a mérkőzést',           game: 'Counter-Strike 2',  gameColor: '#ff6b00', time: '8p' },
  { id: 3, user: 'Peter',  initial: 'P', avatarColor: '#228855', action: 'belépett a szerverre',         game: 'Dhayan Vampyr',     gameColor: '#7755dd', time: '15p' },
  { id: 4, user: 'Joni1',  initial: 'J', avatarColor: '#cc4400', action: 'elért egy új rangot',          game: 'Counter-Strike 2',  gameColor: '#ff6b00', time: '24p' },
  { id: 5, user: 'Ferenc', initial: 'F', avatarColor: '#2255bb', action: 'kilépett',                     game: 'Apex Legends',      gameColor: '#f59e0b', time: '1ó' },
]

export function ActivityFeed() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: '#141419',
        border: '1px solid #1e1e2a',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid #1e1e2a' }}
      >
        <span className="text-[13px] font-semibold" style={{ color: '#d8d8e8' }}>
          Aktivitás
        </span>
      </div>

      <div className="px-3 py-2 space-y-0.5">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-100"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = '#1a1a22')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = 'transparent')
            }
          >
            {/* Mini avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 38% 32%, ${item.avatarColor}cc, ${item.avatarColor}77)`,
                boxShadow: `0 0 0 1.5px ${item.avatarColor}44`,
              }}
            >
              {item.initial}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] leading-tight truncate">
                <span className="font-semibold" style={{ color: '#d8d8e8' }}>
                  {item.user}
                </span>
                <span style={{ color: '#56566e' }}> {item.action} </span>
                <span className="font-medium" style={{ color: item.gameColor }}>
                  {item.game}
                </span>
              </p>
            </div>

            <span className="text-[11px] flex-shrink-0" style={{ color: '#3a3a50' }}>
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
