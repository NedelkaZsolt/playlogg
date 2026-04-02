import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Get game groups for a user
router.get('/:steamId', (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM game_groups WHERE user_steam_id = ? ORDER BY created_at ASC
  `).all(req.params.steamId)
  res.json(rows)
})

// Create group
router.post('/', (req, res) => {
  const { user_steam_id, group_id, name, color, bg_from, bg_to } = req.body
  if (!user_steam_id || !group_id || !name || !color) return res.status(400).json({ error: 'Missing required fields' })

  try {
    db.prepare(`
      INSERT INTO game_groups (user_steam_id, group_id, name, color, bg_from, bg_to)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user_steam_id, group_id, name, color, bg_from ?? '', bg_to ?? '')
    res.status(201).json({ ok: true })
  } catch {
    res.status(409).json({ error: 'Group already exists' })
  }
})

// Delete group
router.delete('/:steamId/:groupId', (req, res) => {
  db.prepare('DELETE FROM game_groups WHERE user_steam_id = ? AND group_id = ?')
    .run(req.params.steamId, req.params.groupId)
  res.json({ ok: true })
})

export default router
