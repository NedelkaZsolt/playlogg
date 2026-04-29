export type NavTab = 'Stats' | 'Home' | 'News' | 'Explore' | 'Profile' | 'Games'

export interface Friend {
  id: number
  name: string
  status: string
  statusColor?: 'orange' | 'muted'
  avatarGradient: [string, string]
  ringColor: string
  initial: string
  avatar?: string
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
  kickChannel?: string
  twitchChannel?: string
  screenshot?: string
  feedback?: string
}
