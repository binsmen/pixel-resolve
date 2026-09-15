const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Optional auth helper: if auth header exists, populates req.user, else continues
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next();
  }
  return authenticateToken(req, res, next);
}

// POST /api/feedback - Submit feedback (authenticated or guest)
router.post('/', optionalAuth, (req, res) => {
  try {
    const { type, subject, message, rating = 5 } = req.body;

    if (!type || !type.trim()) {
      return res.status(400).json({ error: 'Please select a feedback type' });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Please enter a subject' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please enter your feedback message' });
    }

    const userId = req.user ? req.user.id : null;
    const username = req.user ? (req.user.username || req.user.name) : 'Anonymous Adventurer';
    const email = req.user ? req.user.email : (req.body.email || '');

    const stmt = db.prepare(`
      INSERT INTO feedback (user_id, username, email, type, subject, message, rating, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'New', 'Medium')
    `);

    const result = stmt.run(
      userId,
      username,
      email,
      type.trim(),
      subject.trim(),
      message.trim(),
      Number(rating) || 5
    );

    const feedbackId = Number(result.lastInsertRowid);
    const feedbackItem = db.prepare('SELECT * FROM feedback WHERE id = ?').get(feedbackId);

    return res.status(201).json({
      message: 'Feedback submitted successfully! Thank you for helping improve PixelResolve.',
      feedback: feedbackItem
    });
  } catch (err) {
    console.error('Submit feedback error:', err);
    return res.status(500).json({ error: 'Failed to submit feedback. Please try again.' });
  }
});

// GET /api/feedback/my - Get user's submitted feedback
router.get('/my', authenticateToken, (req, res) => {
  try {
    const items = db.prepare(`
      SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id);

    return res.json({ feedback: items });
  } catch (err) {
    console.error('Fetch user feedback error:', err);
    return res.status(500).json({ error: 'Failed to fetch your feedback' });
  }
});

// GET /api/feedback/admin - Admin list and metrics
router.get('/admin', authenticateToken, (req, res) => {
  try {
    const items = db.prepare(`
      SELECT * FROM feedback ORDER BY created_at DESC
    `).all();

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as count_new,
        SUM(CASE WHEN status = 'Reviewing' THEN 1 ELSE 0 END) as count_reviewing,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as count_in_progress,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as count_resolved
      FROM feedback
    `).get();

    return res.json({
      feedback: items,
      metrics: {
        total: stats.total || 0,
        new: stats.count_new || 0,
        reviewing: stats.count_reviewing || 0,
        inProgress: stats.count_in_progress || 0,
        resolved: stats.count_resolved || 0
      }
    });
  } catch (err) {
    console.error('Admin feedback list error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin feedback' });
  }
});

// PATCH /api/feedback/admin/:id - Update status, priority, or internal note
router.patch('/admin/:id', authenticateToken, (req, res) => {
  try {
    const feedbackId = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM feedback WHERE id = ?').get(feedbackId);

    if (!existing) {
      return res.status(404).json({ error: 'Feedback item not found' });
    }

    const { status = existing.status, priority = existing.priority, internal_note = existing.internal_note } = req.body;

    const validStatuses = ['New', 'Reviewing', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare(`
      UPDATE feedback
      SET status = ?, priority = ?, internal_note = ?
      WHERE id = ?
    `).run(status, priority, internal_note || '', feedbackId);

    const updated = db.prepare('SELECT * FROM feedback WHERE id = ?').get(feedbackId);
    return res.json({ feedback: updated });
  } catch (err) {
    console.error('Update feedback error:', err);
    return res.status(500).json({ error: 'Failed to update feedback item' });
  }
});

module.exports = router;
