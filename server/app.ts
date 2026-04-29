import { readFileSync } from 'fs'
import { resolve } from 'path'
import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users.ts'
import friendsRouter from './routes/friends.ts'
import postsRouter from './routes/posts.ts'
import statsRouter from './routes/stats.ts'
import notificationsRouter from './routes/notifications.ts'
import groupsRouter from './routes/groups.ts'
import activitiesRouter from './routes/activities.ts'
import steamStatsRouter from './routes/steamStats.ts'
import csgoNewsRouter from './routes/csgoNews.ts'

// Load .env manually (no extra dependency needed)
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
} catch {
  /* .env is optional */
}

const app = express()
const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : true
app.use(cors({ origin }))
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/friends', friendsRouter)
app.use('/api/posts', postsRouter)
app.use('/api/stats', statsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/steam-stats', steamStatsRouter)
app.use('/api/csgo-news', csgoNewsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }))

export default app
