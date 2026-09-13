const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Email validation helper
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, xp, level)
      VALUES (?, ?, ?, 0, 1)
    `);
    const info = insertStmt.run(cleanName, cleanEmail, passwordHash);
    const userId = Number(info.lastInsertRowid);

    // Generate token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        xp: 0,
        level: 1
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
