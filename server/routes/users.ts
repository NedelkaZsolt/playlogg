import { Router } from 'express'
import db from '../db.ts'

const router = Router()

// Upsert user on Steam login
router.post('/upsert', (req, res) => {
  const { steam_id, persona_name, avatar_url, avatar_color } = req.body
  if (!steam_id || !persona_name) return res.status(400).json({ error: 'steam_id and persona_name required' })

  db.prepare(`
    INSERT INTO users (steam_id, persona_name, avatar_url, avatar_color, last_seen)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(steam_id) DO UPDATE SET
      persona_name = excluded.persona_name,
      avatar_url   = excluded.avatar_url,
      avatar_color = excluded.avatar_color,
      last_seen    = datetime('now')
  `).run(steam_id, persona_name, avatar_url ?? '', avatar_color ?? '#f55500')

  const user = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steam_id)
  res.json(user)
})

// Get user by steam_id
router.get('/:steamId', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(req.params.steamId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

export default router
