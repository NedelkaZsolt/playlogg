import { useState, useEffect } from 'react'

export interface SteamUser {
  steamId: string
  personaName: string
  avatarUrl: string
  avatarColor: string  // fallback if avatar img fails
}

const STORAGE_KEY = 'playlogg_steam_user'

const AVATAR_COLORS = [
  '#3b82f6', '#3b82f6', '#a855f7', '#1ed760',
  '#e83c3c', '#f59e0b', '#06b6d4', '#ec4899',
]

function colorFromId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

async function fetchSteamProfile(steamId: string): Promise<{ personaName: string; avatarUrl: string }> {
  try {
    const res = await fetch(`/steam-profile/${steamId}?xml=1`)
    const xml = await res.text()

    const nameMatch   = xml.match(/<steamID><!\[CDATA\[(.+?)\]\]><\/steamID>/)
    const avatarMatch = xml.match(/<avatarFull><!\[CDATA\[(.+?)\]\]><\/avatarFull>/)

    return {
      personaName: nameMatch?.[1]   ?? `Steam #${steamId.slice(-5)}`,
      avatarUrl:   avatarMatch?.[1] ?? '',
    }
  } catch {
    return { personaName: `Steam #${steamId.slice(-5)}`, avatarUrl: '' }
  }
}

function parseSteamCallback(): string | null {
  const params  = new URLSearchParams(window.location.search)
  const mode    = params.get('openid.mode')
  const claimed = params.get('openid.claimed_id')
  if (mode !== 'id_res' || !claimed) return null

  const match = claimed.match(/\/openid\/id\/(\d+)$/)
  if (!match) return null

  window.history.replaceState({}, '', window.location.pathname)
  return match[1]
}

export function useSteamAuth() {
  const [user, setUser]       = useState<SteamUser | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (!s) return null
      const parsed = JSON.parse(s) as SteamUser
      // Invalidate old format that had avatarInitial instead of avatarUrl
      if (!('avatarUrl' in parsed)) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      return parsed
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const steamId = parseSteamCallback()
    if (!steamId) return

    setLoading(true)
    fetchSteamProfile(steamId).then(async ({ personaName, avatarUrl }) => {
      const avatarColor = colorFromId(steamId)
      const u: SteamUser = { steamId, personaName, avatarUrl, avatarColor }

      // Persist to database
      try {
        await fetch('/api/users/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steam_id: steamId, persona_name: personaName, avatar_url: avatarUrl, avatar_color: avatarColor }),
        })
      } catch { /* server might not be running */ }

      setUser(u)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
      setLoading(false)
    })
  }, [])

  const login = () => {
    const returnTo = `${window.location.origin}${window.location.pathname}`
    const params   = new URLSearchParams({
      'openid.ns':         'http://specs.openid.net/auth/2.0',
      'openid.mode':       'checkid_setup',
      'openid.return_to':  returnTo,
      'openid.realm':      window.location.origin,
      'openid.identity':   'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    })
    window.location.href = `https://steamcommunity.com/openid/login?${params.toString()}`
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return { user, login, logout, loading }
}
