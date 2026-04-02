import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH   = path.join(__dirname, '..', 'playlogg.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    steam_id     TEXT PRIMARY KEY,
    persona_name TEXT NOT NULL,
    avatar_url   TEXT DEFAULT '',
    avatar_color TEXT DEFAULT '#f55500',
    created_at   TEXT DEFAULT (datetime('now')),
    last_seen    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS friends (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id    TEXT NOT NULL,
    friend_steam_id  TEXT NOT NULL,
    status           TEXT DEFAULT 'pending',
    created_at       TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_steam_id)   REFERENCES users(steam_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE,
    UNIQUE(user_steam_id, friend_steam_id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    author_steam_id TEXT NOT NULL,
    game            TEXT NOT NULL,
    game_color      TEXT DEFAULT '#f55500',
    title           TEXT NOT NULL,
    description     TEXT DEFAULT '',
    is_live         INTEGER DEFAULT 0,
    kick_channel    TEXT DEFAULT '',
    stat            TEXT DEFAULT '',
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (author_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS stats (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id      TEXT NOT NULL,
    game               TEXT NOT NULL,
    kd_ratio           REAL DEFAULT 0,
    win_rate           REAL DEFAULT 0,
    points_per_match   REAL DEFAULT 0,
    matches_played     INTEGER DEFAULT 0,
    headshot_pct       REAL DEFAULT 0,
    updated_at         TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE,
    UNIQUE(user_steam_id, game)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id TEXT NOT NULL,
    type          TEXT NOT NULL,
    content       TEXT NOT NULL,
    icon          TEXT DEFAULT 'bell',
    color         TEXT DEFAULT '#f55500',
    from_steam_id TEXT DEFAULT '',
    is_read       INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS game_groups (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id TEXT NOT NULL,
    group_id      TEXT NOT NULL,
    name          TEXT NOT NULL,
    color         TEXT NOT NULL,
    bg_from       TEXT DEFAULT '',
    bg_to         TEXT DEFAULT '',
    created_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE,
    UNIQUE(user_steam_id, group_id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id TEXT NOT NULL,
    action        TEXT NOT NULL,
    game          TEXT DEFAULT '',
    game_color    TEXT DEFAULT '#f55500',
    created_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_steam_id) REFERENCES users(steam_id) ON DELETE CASCADE
  );
`)

export default db
