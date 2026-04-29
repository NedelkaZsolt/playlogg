import { Router } from 'express'
import db from '../db.ts'

const router = Router()

// Get stats for a user (optionally filtered by game)
router.get('/:steamId', (req, res) => {
  const { game } = req.query
  let rows
  if (game) {
    rows = db.prepare('SELECT * FROM stats WHERE user_steam_id = ? AND game = ?').all(req.params.steamId, game)
  } else {
    rows = db.prepare('SELECT * FROM stats WHERE user_steam_id = ? ORDER BY game').all(req.params.steamId)
  }
  res.json(rows)
})

// Upsert stats
router.put('/:steamId', (req, res) => {
  const { game, kd_ratio, win_rate, points_per_match, matches_played, headshot_pct } = req.body
  if (!game) return res.status(400).json({ error: 'game required' })

  db.prepare(`
    INSERT INTO stats (user_steam_id, game, kd_ratio, win_rate, points_per_match, matches_played, headshot_pct, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_steam_id, game) DO UPDATE SET
      kd_ratio          = excluded.kd_ratio,
      win_rate          = excluded.win_rate,
      points_per_match  = excluded.points_per_match,
      matches_played    = excluded.matches_played,
      headshot_pct      = excluded.headshot_pct,
      updated_at        = datetime('now')
  `).run(req.params.steamId, game, kd_ratio ?? 0, win_rate ?? 0, points_per_match ?? 0, matches_played ?? 0, headshot_pct ?? 0)

  res.json({ ok: true })
})

export default router
