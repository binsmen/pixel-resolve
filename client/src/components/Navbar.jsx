import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Swords, Sun, Moon, LogOut, Shield, User, CheckSquare, MessageSquare, LayoutDashboard, Crown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, isVipMode, setIsVipMode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // XP within current level (100 XP per level)
  const currentLevelXp = user ? (user.xp % 100) : 0;
  const xpNeeded = 100;

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface-card)]/90 border-b border-[var(--border-subtle)] backdrop-blur-md px-4 sm:px-8 py-3 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Emblem & Title */}
        <div
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-lg metallic-badge flex items-center justify-center transition-transform group-hover:scale-105">
            <Swords className="w-5 h-5 transition-colors" />
          </div>
          <div>
            <span className="font-pixel text-xs sm:text-sm tracking-tight text-[var(--text-heading)] uppercase block">
              PixelResolve
            </span>
            <span className="font-mono text-[10px] text-[var(--text-dim)] hidden sm:block">
              mini quests • real goals
            </span>
          </div>
        </div>

        {/* Center: Authenticated Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[var(--surface-card)] text-[var(--text-heading)] font-semibold shadow-sm border border-[var(--border-bright)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[var(--surface-card)] text-[var(--text-heading)] font-semibold shadow-sm border border-[var(--border-bright)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('resolutions')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'resolutions'
                  ? 'bg-[var(--surface-card)] text-[var(--text-heading)] font-semibold shadow-sm border border-[var(--border-bright)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Resolutions
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'contact'
                  ? 'bg-[var(--surface-card)] text-[var(--text-heading)] font-semibold shadow-sm border border-[var(--border-bright)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Us
            </button>
          </nav>
        )}

        {/* Right: Theme Toggle, Level Badge & User Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-[var(--border-bright)] flex items-center justify-center text-[var(--text-heading)] transition-all"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-900" />
            )}
          </button>

          {/* Optional VIP / Admin Toggle */}
          {user && (
            <button
              onClick={() => {
                if (activeTab === 'admin') {
                  setActiveTab('dashboard');
                } else {
                  setActiveTab('admin');
                }
              }}
              className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-pixel border transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                  : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-heading)]'
              }`}
              title="Mock VIP / Admin Portal"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP ADMIN</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Level & XP Gauge */}
              <div
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer flex items-center gap-2 bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] px-2.5 py-1 rounded-md transition-all"
              >
                <span className="text-sm">{user.avatar || '🧙‍♂️'}</span>
                <span className="font-pixel text-[9px] text-[var(--accent-green)]">
                  LVL {user.level || 1}
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-[var(--text-dim)]">
                  {user.xp || 0} XP
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-red-500/50 hover:text-red-400 flex items-center justify-center text-[var(--text-muted)] transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="pixel-btn-secondary px-3.5 py-2 text-[10px]"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="pixel-btn-green px-4 py-2 text-[10px]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      {user && (
        <div className="md:hidden flex items-center justify-around pt-2.5 mt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'dashboard' ? 'text-[var(--accent-green)] font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dash
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'profile' ? 'text-[var(--accent-green)] font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('resolutions')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'resolutions' ? 'text-[var(--accent-green)] font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Quests
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'contact' ? 'text-[var(--accent-green)] font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Contact
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-[var(--text-muted)]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            VIP
          </button>
        </div>
      )}
    </header>
  );
}
