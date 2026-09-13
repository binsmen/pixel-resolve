const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Enforce auth on all resolution endpoints
router.use(authenticateToken);

// Helper to compute level from XP (100 XP per level)
function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

// GET /api/resolutions - List all resolutions for the authenticated user
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM resolutions 
      WHERE user_id = ? 
      ORDER BY 
        CASE WHEN status = 'active' THEN 0 ELSE 1 END,
        created_at DESC
    `);
    const resolutions = stmt.all(req.user.id);
    return res.json({ resolutions });
  } catch (err) {
    console.error('Fetch resolutions error:', err);
    return res.status(500).json({ error: 'Failed to fetch resolutions' });
  }
});

// GET /api/resolutions/:id - Get a specific resolution
router.get('/:id', (req, res) => {
  try {
    const resolutionId = Number(req.params.id);
    const stmt = db.prepare('SELECT * FROM resolutions WHERE id = ? AND user_id = ?');
    const resolution = stmt.get(resolutionId, req.user.id);

    if (!resolution) {
      return res.status(404).json({ error: 'Resolution not found' });
    }

    return res.json({ resolution });
  } catch (err) {
    console.error('Fetch single resolution error:', err);
    return res.status(500).json({ error: 'Failed to fetch resolution' });
  }
});

// POST /api/resolutions - Create a new resolution
router.post('/', (req, res) => {
  try {
    const { title, description, goal_value, current_value = 0, unit = '%' } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Please enter a resolution title' });
    }

    const numericGoal = Number(goal_value);
    if (isNaN(numericGoal) || numericGoal <= 0) {
      return res.status(400).json({ error: 'Goal target must be a positive number' });
    }

    const numericCurrent = Number(current_value) || 0;
    if (numericCurrent < 0) {
      return res.status(400).json({ error: 'Starting progress cannot be negative' });
    }

    const isCompleted = numericCurrent >= numericGoal;
    const status = isCompleted ? 'completed' : 'active';
    const completedAt = isCompleted ? new Date().toISOString() : null;

    const stmt = db.prepare(`
      INSERT INTO resolutions (user_id, title, description, goal_value, current_value, unit, status, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      title.trim(),
      description ? description.trim() : '',
      numericGoal,
      numericCurrent,
      unit.trim() || '%',
      status,
      completedAt
    );

    const newId = Number(result.lastInsertRowid);
    const newResolution = db.prepare('SELECT * FROM resolutions WHERE id = ?').get(newId);

    // If already complete at creation (rare), award completion XP, else award creation XP bonus (e.g. +10 XP for embarking on a quest!)
    let xpAward = 10;
    if (isCompleted) {
      xpAward += 100;
    }

    const userStmt = db.prepare('SELECT xp FROM users WHERE id = ?');
    const currentUser = userStmt.get(req.user.id);
    const newXp = (currentUser ? currentUser.xp : 0) + xpAward;
    const newLevel = calculateLevel(newXp);

    db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, req.user.id);

    return res.status(201).json({
      resolution: newResolution,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        xp: newXp,
        level: newLevel
      },
      xpGained: xpAward,
      questCompleted: isCompleted
    });
  } catch (err) {
    console.error('Create resolution error:', err);
    return res.status(500).json({ error: 'Failed to create resolution' });
  }
});

// PUT /api/resolutions/:id - Update progress or resolution details
router.put('/:id', (req, res) => {
  try {
    const resolutionId = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM resolutions WHERE id = ? AND user_id = ?').get(resolutionId, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Resolution not found' });
    }

    const {
      title = existing.title,
      description = existing.description,
      goal_value = existing.goal_value,
      current_value = existing.current_value,
      unit = existing.unit
    } = req.body;

    const numericGoal = Number(goal_value);
    const numericCurrent = Math.max(0, Number(current_value));

    if (isNaN(numericGoal) || numericGoal <= 0) {
      return res.status(400).json({ error: 'Goal value must be a positive number' });
    }

    if (isNaN(numericCurrent)) {
      return res.status(400).json({ error: 'Progress value must be a number' });
    }

    const isNewlyCompleted = numericCurrent >= numericGoal && existing.status !== 'completed';
    const isDemoted = numericCurrent < numericGoal && existing.status === 'completed';

    let newStatus = existing.status;
    let completedAt = existing.completed_at;

    if (numericCurrent >= numericGoal) {
      newStatus = 'completed';
      if (!completedAt) {
        completedAt = new Date().toISOString();
      }
    } else {
      newStatus = 'active';
      completedAt = null;
    }

    // Determine XP reward
    let xpGained = 0;
    if (isNewlyCompleted) {
      xpGained = 100; // Quest complete bonus
    } else if (numericCurrent !== existing.current_value && !isDemoted) {
      xpGained = 5; // Progress update bonus
    }

    // Update resolution in database
    const updateStmt = db.prepare(`
      UPDATE resolutions
      SET title = ?, description = ?, goal_value = ?, current_value = ?, unit = ?, status = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    updateStmt.run(
      title.trim(),
      description ? description.trim() : '',
      numericGoal,
      numericCurrent,
      unit.trim() || '%',
      newStatus,
      completedAt,
      resolutionId,
      req.user.id
    );

    // Update user XP & Level if XP was gained
    let updatedUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      xp: req.user.xp,
      level: req.user.level
    };

    if (xpGained > 0) {
      const userRecord = db.prepare('SELECT xp FROM users WHERE id = ?').get(req.user.id);
      const newXp = (userRecord ? userRecord.xp : 0) + xpGained;
      const newLevel = calculateLevel(newXp);
      db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, req.user.id);
      updatedUser.xp = newXp;
      updatedUser.level = newLevel;
    }

    const updatedResolution = db.prepare('SELECT * FROM resolutions WHERE id = ?').get(resolutionId);

    return res.json({
      resolution: updatedResolution,
      user: updatedUser,
      xpGained,
      questCompleted: isNewlyCompleted
    });
  } catch (err) {
    console.error('Update resolution error:', err);
    return res.status(500).json({ error: 'Failed to update resolution' });
  }
});

// DELETE /api/resolutions/:id - Delete a resolution
router.delete('/:id', (req, res) => {
  try {
    const resolutionId = Number(req.params.id);
    const existing = db.prepare('SELECT id, title FROM resolutions WHERE id = ? AND user_id = ?').get(resolutionId, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Resolution not found' });
    }

    db.prepare('DELETE FROM resolutions WHERE id = ? AND user_id = ?').run(resolutionId, req.user.id);

    return res.json({ message: 'Resolution deleted successfully', id: resolutionId });
  } catch (err) {
    console.error('Delete resolution error:', err);
    return res.status(500).json({ error: 'Failed to delete resolution' });
  }
});

module.exports = router;
