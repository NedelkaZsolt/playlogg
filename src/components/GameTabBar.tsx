import { Plus } from 'lucide-react'
import { gameTabs } from '../data/mockData'

interface GameTabBarProps {
  activeGame: string
  onSelect: (id: string) => void
}

export function GameTabBar({ activeGame, onSelect }: GameTabBarProps) {
  return (
    <div className="flex items-center gap-3 no-scrollbar overflow-x-auto pb-1">
      {gameTabs.map((tab) => {
        const isActive = tab.id === activeGame
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-black text-white transition-transform duration-150 hover:scale-110"
            style={{
              background: `radial-gradient(circle at 38% 32%, ${tab.bgFrom}, ${tab.bgTo})`,
              boxShadow: isActive
                ? `0 0 0 2px ${tab.color}, 0 0 16px ${tab.color}55`
                : `0 0 0 1px ${tab.color}33`,
            }}
            title={tab.id.toUpperCase()}
          >
            {tab.label}
          </button>
        )
      })}

      {/* Add button */}
      <button
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-150"
        style={{
          background: '#141419',
          border: '1px solid #1e1e2a',
          color: '#56566e',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = '#8888a8'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#282835'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = '#56566e'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e2a'
        }}
      >
        <Plus size={18} strokeWidth={2} />
      </button>
    </div>
  )
}
