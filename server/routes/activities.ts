import { Router } from 'express'
import db from '../db.ts'

const router = Router()

// Get global activity feed
router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT a.*, u.persona_name, u.avatar_url, u.avatar_color
    FROM activities a
    JOIN users u ON u.steam_id = a.user_steam_id
    ORDER BY a.created_at DESC
    LIMIT 20
  `).all()
  res.json(rows)
})

// Log activity
router.post('/', (req, res) => {
  const { user_steam_id, action, game, game_color } = req.body
  if (!user_steam_id || !action) return res.status(400).json({ error: 'Missing required fields' })

  db.prepare(`
    INSERT INTO activities (user_steam_id, action, game, game_color)
    VALUES (?, ?, ?, ?)
  `).run(user_steam_id, action, game ?? '', game_color ?? '#f55500')

  res.status(201).json({ ok: true })
})

export default router
