import { useState } from 'react'
import type { NavTab } from './types'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { LoginPage } from './components/LoginPage'
import { useSteamAuth } from './hooks/useSteamAuth'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Home')
  const { user, login, logout, loading, demoLogin } = useSteamAuth()

  if (!user) {
    return <LoginPage onLogin={login} onDemoLogin={demoLogin} loading={loading} />
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={logout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent activeTab={activeTab} steamId={user.steamId} />
      </div>
    </div>
  )
}
