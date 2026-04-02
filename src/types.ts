export type NavTab = 'Stats' | 'Kezdőoldal' | 'Hírek' | 'Profil' | 'Games'

export interface Friend {
  id: number
  name: string
  status: string
  statusColor?: 'orange' | 'muted'
  avatarGradient: [string, string]
  ringColor: string
  initial: string
  rightIcon?: 'check' | 'square' | 'minus' | 'pause'
  isOnline?: boolean
}

export interface GameTab {
  id: string
  label: string
  color: string
  bgFrom: string
  bgTo: string
}

export interface Post {
  id: number
  game: string
  gameColor: string
  author: string
  title: string
  description: string
  isLive?: boolean
  stat?: string
  timestamp: string
}
