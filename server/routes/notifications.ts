import { Router } from 'express'
import db from '../db.ts'

const router = Router()

// Get notifications for a user
router.get('/:steamId', (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM notifications
    WHERE user_steam_id = ?
    ORDER BY created_at DESC
    LIMIT 30
  `).all(req.params.steamId)
  res.json(rows)
})

// Mark single notification as read
router.patch('/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// Mark all as read for a user
router.patch('/:steamId/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_steam_id = ?').run(req.params.steamId)
  res.json({ ok: true })
})

// Create notification (internal use / testing)
router.post('/', (req, res) => {
  const { user_steam_id, type, content, icon, color, from_steam_id } = req.body
  if (!user_steam_id || !type || !content) return res.status(400).json({ error: 'Missing required fields' })

  const result = db.prepare(`
    INSERT INTO notifications (user_steam_id, type, content, icon, color, from_steam_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user_steam_id, type, content, icon ?? 'bell', color ?? '#f55500', from_steam_id ?? '')

  res.status(201).json({ id: result.lastInsertRowid })
})

export default router
