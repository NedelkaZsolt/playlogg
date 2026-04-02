import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Get friend list for a user (accepted)
router.get('/:steamId', (req, res) => {
  const rows = db.prepare(`
    SELECT u.steam_id, u.persona_name, u.avatar_url, u.avatar_color, u.last_seen, f.status
    FROM friends f
    JOIN users u ON u.steam_id = f.friend_steam_id
    WHERE f.user_steam_id = ? AND f.status = 'accepted'
    ORDER BY u.last_seen DESC
  `).all(req.params.steamId)
  res.json(rows)
})

// Get pending incoming requests
router.get('/:steamId/pending', (req, res) => {
  const rows = db.prepare(`
    SELECT u.steam_id, u.persona_name, u.avatar_url, u.avatar_color, f.created_at
    FROM friends f
    JOIN users u ON u.steam_id = f.user_steam_id
    WHERE f.friend_steam_id = ? AND f.status = 'pending'
    ORDER BY f.created_at DESC
  `).all(req.params.steamId)
  res.json(rows)
})

// Send friend request
router.post('/request', (req, res) => {
  const { from_steam_id, to_steam_id } = req.body
  if (!from_steam_id || !to_steam_id) return res.status(400).json({ error: 'from_steam_id and to_steam_id required' })
  if (from_steam_id === to_steam_id) return res.status(400).json({ error: 'Cannot add yourself' })

  try {
    db.prepare(`
      INSERT OR IGNORE INTO friends (user_steam_id, friend_steam_id, status)
      VALUES (?, ?, 'pending')
    `).run(from_steam_id, to_steam_id)

    // Create notification for recipient
    const sender = db.prepare('SELECT persona_name FROM users WHERE steam_id = ?').get(from_steam_id) as { persona_name: string } | undefined
    if (sender) {
      db.prepare(`
        INSERT INTO notifications (user_steam_id, type, content, icon, color, from_steam_id)
        VALUES (?, 'friend_request', ?, 'user', '#3b82f6', ?)
      `).run(to_steam_id, `${sender.persona_name} barát kérést küldött neked`, from_steam_id)
    }

    res.json({ ok: true })
  } catch {
    res.status(409).json({ error: 'Request already exists' })
  }
})

// Accept friend request
router.post('/accept', (req, res) => {
  const { user_steam_id, friend_steam_id } = req.body
  db.prepare(`UPDATE friends SET status = 'accepted' WHERE user_steam_id = ? AND friend_steam_id = ?`)
    .run(friend_steam_id, user_steam_id)
  // Create reverse entry
  db.prepare(`INSERT OR IGNORE INTO friends (user_steam_id, friend_steam_id, status) VALUES (?, ?, 'accepted')`)
    .run(user_steam_id, friend_steam_id)
  res.json({ ok: true })
})

// Remove friend
router.delete('/', (req, res) => {
  const { user_steam_id, friend_steam_id } = req.body
  db.prepare('DELETE FROM friends WHERE (user_steam_id = ? AND friend_steam_id = ?) OR (user_steam_id = ? AND friend_steam_id = ?)')
    .run(user_steam_id, friend_steam_id, friend_steam_id, user_steam_id)
  res.json({ ok: true })
})

export default router
