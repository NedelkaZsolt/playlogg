const BASE = '/api'

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`API ${method} ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

const get  = <T>(path: string)                    => req<T>('GET',    path)
const post = <T>(path: string, body: unknown)     => req<T>('POST',   path, body)
const put  = <T>(path: string, body: unknown)     => req<T>('PUT',    path, body)
const del  = <T>(path: string, body?: unknown)    => req<T>('DELETE', path, body)
const patch= <T>(path: string, body?: unknown)    => req<T>('PATCH',  path, body)

/* ── Users ── */
export const upsertUser = (data: {
  steam_id: string; persona_name: string; avatar_url: string; avatar_color: string
}) => post('/users/upsert', data)

export const getUser = (steamId: string) => get(`/users/${steamId}`)

/* ── Friends ── */
export const getFriends        = (steamId: string) => get(`/friends/${steamId}`)
export const getPendingRequests= (steamId: string) => get(`/friends/${steamId}/pending`)
export const sendFriendRequest = (from: string, to: string) =>
  post('/friends/request', { from_steam_id: from, to_steam_id: to })
export const acceptFriend      = (user: string, friend: string) =>
  post('/friends/accept', { user_steam_id: user, friend_steam_id: friend })
export const removeFriend      = (user: string, friend: string) =>
  del('/friends', { user_steam_id: user, friend_steam_id: friend })

/* ── Posts ── */
export const getPosts = (filters?: { game?: string; steam_id?: string }) => {
  const q = new URLSearchParams(filters as Record<string, string>).toString()
  return get(`/posts${q ? `?${q}` : ''}`)
}
export const createPost = (data: {
  author_steam_id: string; game: string; game_color: string
  title: string; description: string; is_live: boolean; kick_channel?: string; stat?: string
}) => post('/posts', data)
export const deletePost = (id: number) => del(`/posts/${id}`)

/* ── Stats ── */
export const getStats   = (steamId: string, game?: string) =>
  get(`/stats/${steamId}${game ? `?game=${encodeURIComponent(game)}` : ''}`)
export const updateStats = (steamId: string, data: {
  game: string; kd_ratio?: number; win_rate?: number
  points_per_match?: number; matches_played?: number; headshot_pct?: number
}) => put(`/stats/${steamId}`, data)

/* ── Notifications ── */
export const getNotifications = (steamId: string) => get(`/notifications/${steamId}`)
export const markNotifRead    = (id: number)       => patch(`/notifications/${id}/read`)
export const markAllRead      = (steamId: string)  => patch(`/notifications/${steamId}/read-all`)

export const getCsgoNews = (count = 6) => get<{ title: string; source: string; time: string; tag: string; tagColor: string; hot?: boolean; url: string }[]>(`/csgo-news?count=${count}`)

/* ── Groups ── */
export const getGroups   = (steamId: string) => get(`/groups/${steamId}`)
export const createGroup = (data: {
  user_steam_id: string; group_id: string; name: string
  color: string; bg_from?: string; bg_to?: string
}) => post('/groups', data)
export const deleteGroup = (steamId: string, groupId: string) =>
  del(`/groups/${steamId}/${groupId}`)

/* ── Activities ── */
export const getActivities  = ()                                  => get('/activities')
export const logActivity    = (user_steam_id: string, action: string, game?: string, game_color?: string) =>
  post('/activities', { user_steam_id, action, game, game_color })
