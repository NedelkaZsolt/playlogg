import { readFileSync } from 'fs'
import { resolve }     from 'path'
import express from 'express'
import cors    from 'cors'

// Load .env manually (no extra dependency needed)
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
} catch { /* .env is optional */ }
import usersRouter         from './routes/users.js'
import friendsRouter       from './routes/friends.js'
import postsRouter         from './routes/posts.js'
import statsRouter         from './routes/stats.js'
import notificationsRouter from './routes/notifications.js'
import groupsRouter        from './routes/groups.js'
import activitiesRouter    from './routes/activities.js'
import steamStatsRouter    from './routes/steamStats.js'
import csgoNewsRouter      from './routes/csgoNews.js'

const app  = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/users',         usersRouter)
app.use('/api/friends',       friendsRouter)
app.use('/api/posts',         postsRouter)
app.use('/api/stats',         statsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/groups',        groupsRouter)
app.use('/api/activities',    activitiesRouter)
app.use('/api/steam-stats',  steamStatsRouter)
app.use('/api/csgo-news',     csgoNewsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`PlayLogg API → http://localhost:${PORT}`)
})
