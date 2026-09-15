const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'pixelresolve.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.exec('PRAGMA foreign_keys = ON;');
if (dbPath !== ':memory:') {
  try {
    db.exec('PRAGMA journal_mode = WAL;');
  } catch (err) {
    // In-memory or certain setups may ignore journal_mode
  }
}

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT,
    bio TEXT DEFAULT '',
    education TEXT DEFAULT '',
    skills TEXT DEFAULT '[]',
    achievements TEXT DEFAULT '[]',
    avatar TEXT DEFAULT '🧙‍♂️',
    email_verification_status TEXT DEFAULT 'unverified',
    role TEXT DEFAULT 'user',
    profile_completed INTEGER DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resolutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    why TEXT DEFAULT '',
    category TEXT DEFAULT 'Personal',
    goal_value REAL NOT NULL,
    current_value REAL NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT '%',
    deadline TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    email TEXT,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Medium',
    internal_note TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_resolutions_user ON resolutions(user_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
`);

// Safe migrations helper to add columns if upgrading existing database
function addColumnIfNotExists(table, column, typeDef) {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeDef}`);
  } catch (err) {
    // Column already exists or table does not support it
  }
}

addColumnIfNotExists('users', 'username', 'TEXT');
addColumnIfNotExists('users', 'bio', "TEXT DEFAULT ''");
addColumnIfNotExists('users', 'education', "TEXT DEFAULT ''");
addColumnIfNotExists('users', 'skills', "TEXT DEFAULT '[]'");
addColumnIfNotExists('users', 'achievements', "TEXT DEFAULT '[]'");
addColumnIfNotExists('users', 'avatar', "TEXT DEFAULT '🧙‍♂️'");
addColumnIfNotExists('users', 'email_verification_status', "TEXT DEFAULT 'unverified'");
addColumnIfNotExists('users', 'role', "TEXT DEFAULT 'user'");
addColumnIfNotExists('users', 'profile_completed', 'INTEGER DEFAULT 0');

addColumnIfNotExists('resolutions', 'why', "TEXT DEFAULT ''");
addColumnIfNotExists('resolutions', 'category', "TEXT DEFAULT 'Personal'");
addColumnIfNotExists('resolutions', 'deadline', "TEXT DEFAULT ''");

module.exports = db;
