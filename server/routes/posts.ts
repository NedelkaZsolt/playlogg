import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Get posts (feed) — optionally filtered by game
router.get('/', (req, res) => {
  const { game, steam_id } = req.query
  let query = `
    SELECT p.*, u.persona_name, u.avatar_url, u.avatar_color
    FROM posts p
    JOIN users u ON u.steam_id = p.author_steam_id
  `
  const params: string[] = []
  const where: string[] = []

  if (game)     { where.push('p.game = ?');             params.push(game as string) }
  if (steam_id) { where.push('p.author_steam_id = ?');  params.push(steam_id as string) }

  if (where.length) query += ' WHERE ' + where.join(' AND ')
  query += ' ORDER BY p.created_at DESC LIMIT 50'

  res.json(db.prepare(query).all(...params))
})

// Create post
router.post('/', (req, res) => {
  const { author_steam_id, game, game_color, title, description, is_live, kick_channel, stat } = req.body
  if (!author_steam_id || !game || !title) return res.status(400).json({ error: 'Missing required fields' })

  const result = db.prepare(`
    INSERT INTO posts (author_steam_id, game, game_color, title, description, is_live, kick_channel, stat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(author_steam_id, game, game_color ?? '#f55500', title, description ?? '', is_live ? 1 : 0, kick_channel ?? '', stat ?? '')

  // Log activity
  db.prepare(`
    INSERT INTO activities (user_steam_id, action, game, game_color)
    VALUES (?, 'posztolt', ?, ?)
  `).run(author_steam_id, game, game_color ?? '#f55500')

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(post)
})

// Delete post
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
