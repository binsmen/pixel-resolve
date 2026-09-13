const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize database
require('./db');

const authRoutes = require('./routes/auth');
const resolutionRoutes = require('./routes/resolutions');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resolutions', resolutionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend build if available (production mode / Replit single-process)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    // Exclude API routes from index.html fallback
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PixelResolve] Backend server running on port ${PORT}`);
  });
}

module.exports = app;
