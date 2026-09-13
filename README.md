# PixelResolve ⚔️

> **Turn your New Year's resolutions and personal goals into quests.**  
> A lightweight, pixel-art inspired personal goal tracking web app built for simplicity, high performance, and minimal resource usage (100% compatible with Replit Free).

---

## ✨ Features

- 🎮 **Gamified Goals (Quests)**: Every resolution is a bite-sized quest with a numeric target, custom unit, and dynamic progress bar.
- 🛡️ **Player Level & XP System**:
  - Earn **+5 XP** on progress updates.
  - Earn **+100 XP** and level up on Quest Completion.
  - Interactive player level & XP bar in the header.
- 🎉 **Quest Complete Celebration**: Triggers animated 8-bit multi-color confetti, celebratory retro badges, and XP reward toasts.
- 🔒 **Private & Secure Authentication**:
  - Sign up, login, logout, and token session persistence.
  - Password hashing via `bcryptjs`.
  - **Strict Multi-Tenant Isolation**: Server-side scoping enforces that users can only view, update, or delete their own resolutions.
- 🎨 **Minimal Pixel-Art Aesthetic**:
  - Light, clean canvas (`#FAF8F5`) with crisp retro typography (`Press Start 2P`, `Silkscreen`, and modern readable sans).
  - 8-bit chunky buttons with responsive click feedback.
  - Segmented health/mana-style progress bars.
- ⚡ **Zero External Paid Dependencies**:
  - Uses Node's built-in `node:sqlite` for persistent zero-config storage.
  - Low memory footprint, fast cold starts, ideal for free-tier hosting like Replit Free.

---

## 🚀 Quick Start (Local)

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix client
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Start Application
```bash
npm start
```
Open **`http://localhost:3001`** in your browser!

### Running in Development Mode
To run client and server concurrently with hot reload:
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend (Vite)
npm run dev:client
```
Frontend runs at `http://localhost:5173` and proxies `/api` to `http://localhost:3001`.

---

## ☁️ Deploying to Replit Free

PixelResolve is preconfigured for Replit:
1. Import or copy this repository into a new **Node.js** Repl.
2. The included `.replit` and `replit.nix` will automatically run `npm run build && npm start`.
3. SQLite stores data locally in `server/data/pixelresolve.db`.
4. Your app is live with zero configuration!

---

## 🧪 Automated Testing

Run the included automated integration test suite:
```bash
npm test
```
Tests verify:
- User signup and duplicate prevention
- Password hashing & JWT generation
- Resolution CRUD
- Cross-user data isolation (User B blocked from User A's data)
- Gamification (+5 XP update bonus, +100 XP completion bonus)
- Resolution deletion

---

## 📂 Project Structure

```text
pixel-resolve/
├── client/                     # Vite + React + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Navbar, PixelProgressBar, ResolutionCard, StatsOverview
│   │   │   └── modals/         # Auth, NewResolution, UpdateProgress, Delete, QuestComplete
│   │   ├── context/            # AuthContext (user, level, XP state)
│   │   ├── services/           # API fetch client with JWT handling
│   │   ├── App.jsx             # Main dashboard view coordinator
│   │   └── index.css           # Pixel utility styles and animations
│   ├── index.html              # Google retro fonts & meta
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express + SQLite
│   ├── db.js                   # node:sqlite database & schema
│   ├── index.js                # Express API & static file server
│   ├── middleware/auth.js      # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js             # /api/auth (signup, login, me, logout)
│   │   └── resolutions.js      # /api/resolutions (CRUD + XP engine)
│   └── test-api.js             # Automated API integration test suite
├── .replit                     # Replit deployment configuration
├── package.json                # Root build & start scripts
└── README.md
```

---

## 📜 API Reference

### Authentication
- `POST /api/auth/signup` — Create a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in (`email`, `password`)
- `POST /api/auth/logout` — Invalidate session
- `GET  /api/auth/me` — Get current authenticated user, level, and XP

### Resolutions (Requires `Authorization: Bearer <token>`)
- `GET    /api/resolutions` — List all resolutions for the logged-in user
- `POST   /api/resolutions` — Create a new resolution
- `GET    /api/resolutions/:id` — Retrieve a single resolution
- `PUT    /api/resolutions/:id` — Update progress or details (triggers XP / Level awards)
- `DELETE /api/resolutions/:id` — Delete resolution (confirmation required)
