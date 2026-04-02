import { useState } from 'react'
import type { NavTab } from './types'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Kezdőoldal')

  return (
    <div
      className="flex flex-col"
      style={{ height: '100vh', background: '#08080c', overflow: 'hidden' }}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  )
}
