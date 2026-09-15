const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Email validation helper
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;

  const domain = email.split('@')[1].toLowerCase();
  // Reject placeholder and fake domains
  const placeholderDomains = [
    'example.com',
    'example.org',
    'example.net',
    'test.com',
    'test.org',
    'placeholder.com',
    'fake.com',
    'fakeemail.com',
    'sample.com'
  ];
  if (placeholderDomains.includes(domain)) {
    return false;
  }
  return true;
}

// Username validator: 3-20 chars, alphanumeric + underscores only
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 20) {
    return { valid: false, error: 'Username must be between 3 and 20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true, username: trimmed };
}

// Check username availability
router.get('/check-username', (req, res) => {
  const { username, currentUserId } = req.query;
  const validation = validateUsername(username);
  if (!validation.valid) {
    return res.json({ available: false, reason: validation.error });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(validation.username);
  if (existing && (!currentUserId || existing.id !== Number(currentUserId))) {
    return res.json({ available: false, reason: 'That username is already taken.' });
  }

  return res.json({ available: true });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({
        error: 'Please enter a valid, real email address (e.g. name@gmail.com). Placeholder domains like example.com are not accepted.'
      });
    }

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) {
      return res.status(400).json({ error: usernameCheck.error });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanUsername = usernameCheck.username;

    // Check if email already exists
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Check if username already exists
    const existingUsername = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(cleanUsername);
    if (existingUsername) {
      return res.status(400).json({ error: 'That username is already taken. Please choose another.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user with initial level 1, xp 0, profile_completed 0
    const insertStmt = db.prepare(`
      INSERT INTO users (
        name, email, username, password_hash, xp, level,
        profile_completed, email_verification_status, avatar, skills, achievements
      )
      VALUES (?, ?, ?, ?, 0, 1, 0, 'unverified', '🧙‍♂️', '[]', '[]')
    `);
    const info = insertStmt.run(cleanName, cleanEmail, cleanUsername, passwordHash);
    const userId = Number(info.lastInsertRowid);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        username: cleanUsername,
        avatar: '🧙‍♂️',
        bio: '',
        education: '',
        skills: [],
        achievements: [],
        email_verification_status: 'unverified',
        role: 'user',
        profile_completed: 0,
        xp: 0,
        level: 1
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login (supports logging in with email or username)
router.post('/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginId = (identifier || email || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Please enter your username/email and password' });
    }

    const user = db.prepare(`
      SELECT * FROM users
      WHERE email = ? OR LOWER(username) = LOWER(?)
    `).get(loginId.toLowerCase(), loginId);

    if (!user) {
      return res.status(401).json({ error: 'Incorrect email/username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email/username or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    let skills = [];
    let achievements = [];
    try { skills = JSON.parse(user.skills || '[]'); } catch (e) {}
    try { achievements = JSON.parse(user.achievements || '[]'); } catch (e) {}

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, '_'),
        avatar: user.avatar || '🧙‍♂️',
        bio: user.bio || '',
        education: user.education || '',
        skills,
        achievements,
        email_verification_status: user.email_verification_status || 'unverified',
        role: user.role || 'user',
        profile_completed: user.profile_completed || 0,
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
  let skills = [];
  let achievements = [];
  try { skills = JSON.parse(req.user.skills || '[]'); } catch (e) {}
  try { achievements = JSON.parse(req.user.achievements || '[]'); } catch (e) {}

  return res.json({
    user: {
      ...req.user,
      skills,
      achievements
    }
  });
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch resolution stats for user
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_resolutions,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_resolutions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_resolutions
    FROM resolutions
    WHERE user_id = ?
  `).get(userId);

  let skills = [];
  let achievements = [];
  try { skills = JSON.parse(req.user.skills || '[]'); } catch (e) {}
  try { achievements = JSON.parse(req.user.achievements || '[]'); } catch (e) {}

  return res.json({
    profile: {
      ...req.user,
      skills,
      achievements,
      stats: {
        totalResolutions: stats.total_resolutions || 0,
        activeResolutions: stats.active_resolutions || 0,
        completedResolutions: stats.completed_resolutions || 0
      }
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio, education, skills, achievements, avatar, profile_completed } = req.body;

    let updatedName = req.user.name;
    if (name && name.trim()) {
      updatedName = name.trim();
    }

    let updatedUsername = req.user.username;
    if (username && username.trim() && username.trim() !== req.user.username) {
      const usernameCheck = validateUsername(username);
      if (!usernameCheck.valid) {
        return res.status(400).json({ error: usernameCheck.error });
      }
      const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?').get(usernameCheck.username, userId);
      if (existing) {
        return res.status(400).json({ error: 'That username is already taken. Please choose another.' });
      }
      updatedUsername = usernameCheck.username;
    }

    const updatedBio = typeof bio === 'string' ? bio.trim() : (req.user.bio || '');
    const updatedEducation = typeof education === 'string' ? education.trim() : (req.user.education || '');
    const updatedAvatar = avatar || req.user.avatar || '🧙‍♂️';
    const updatedCompleted = typeof profile_completed === 'number' ? profile_completed : (req.user.profile_completed || 1);

    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : (req.user.skills || '[]');
    const achievementsJson = Array.isArray(achievements) ? JSON.stringify(achievements) : (req.user.achievements || '[]');

    db.prepare(`
      UPDATE users
      SET name = ?, username = ?, bio = ?, education = ?, avatar = ?,
          skills = ?, achievements = ?, profile_completed = ?
      WHERE id = ?
    `).run(
      updatedName,
      updatedUsername,
      updatedBio,
      updatedEducation,
      updatedAvatar,
      skillsJson,
      achievementsJson,
      updatedCompleted,
      userId
    );

    const updatedUser = db.prepare(`
      SELECT id, name, email, username, bio, education, skills, achievements,
             avatar, email_verification_status, role, profile_completed, xp, level
      FROM users WHERE id = ?
    `).get(userId);

    let parsedSkills = [];
    let parsedAchievements = [];
    try { parsedSkills = JSON.parse(updatedUser.skills || '[]'); } catch (e) {}
    try { parsedAchievements = JSON.parse(updatedUser.achievements || '[]'); } catch (e) {}

    return res.json({
      user: {
        ...updatedUser,
        skills: parsedSkills,
        achievements: parsedAchievements
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
});

// POST /api/auth/verify-email (Mock email verification)
router.post('/verify-email', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.prepare(`
    UPDATE users SET email_verification_status = 'verified' WHERE id = ?
  `).run(userId);

  return res.json({
    message: 'Email successfully verified (Mock)!',
    email_verification_status: 'verified'
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
