import React from 'react';
import { User, CheckSquare, MessageSquare, ArrowRight, Sparkles, Trophy, Flame } from 'lucide-react';

export default function DashboardView({ user, resolutions = [], onNavigate, onNewQuest }) {
  const activeCount = resolutions.filter(r => r.status === 'active').length;
  const completedCount = resolutions.filter(r => r.status === 'completed').length;
  const skillsCount = (user?.skills || []).length;

  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Welcome Banner */}
      <div className="hud-card p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl metallic-badge text-3xl flex items-center justify-center select-none shadow-md">
              {user?.avatar || '🧙‍♂️'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-pixel text-xs text-[var(--accent-green)]">
                  PLAYER STATUS: READY
                </span>
                <span className="bg-emerald-500/10 text-[var(--accent-green)] text-[9px] font-pixel px-2 py-0.5 rounded border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <h1 className="font-pixel text-base sm:text-xl text-[var(--text-heading)]">
                Welcome back, {user?.name || 'Adventurer'}
              </h1>
              <p className="font-mono text-xs text-[var(--text-dim)]">
                @{user?.username || 'player'} • Level {user?.level || 1} Hero • {user?.xp || 0} Total XP
              </p>
            </div>
          </div>

          {/* Quick CTA to start a quest */}
          <button
            onClick={onNewQuest}
            className="pixel-btn-primary px-5 py-3 text-[10px] sm:text-xs self-start sm:self-center flex items-center gap-2"
          >
            <span>+ NEW QUEST</span>
          </button>
        </div>
      </div>

      {/* The 3 Primary Cards Specification per update.md */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: PROFILE */}
        <div
          onClick={() => onNavigate('profile')}
          className="hud-card hud-card-interactive p-6 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 metallic-badge rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <span className="font-pixel text-[9px] text-[var(--text-dim)] uppercase">
                Card 01
              </span>
            </div>

            <h2 className="font-pixel text-sm sm:text-base text-[var(--text-heading)] mb-2 group-hover:text-[var(--accent-green)] transition-colors">
              Profile
            </h2>
            <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
              Manage your hero identity, update your bio, institution, skill tags, and real-life achievements.
            </p>

            {/* Micro Stats Preview */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg text-xs font-mono mb-4">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">Level:</span>
                <span className="font-bold text-[var(--accent-green)]">LVL {user?.level || 1}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">XP:</span>
                <span className="font-bold text-[var(--text-heading)]">{user?.xp || 0} XP</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-dim)]">Skills:</span>
                <span className="font-bold text-[var(--text-heading)]">{skillsCount} tagged</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <span className="font-pixel text-[10px] text-[var(--text-heading)] group-hover:text-[var(--accent-green)] transition-colors">
              Open Profile
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--text-heading)] group-hover:text-[var(--accent-green)] group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* CARD 2: RESOLUTIONS */}
        <div
          onClick={() => onNavigate('resolutions')}
          className="hud-card hud-card-interactive p-6 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 metallic-badge rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6" />
              </div>
              <span className="font-pixel text-[9px] text-[var(--text-dim)] uppercase">
                Card 02
              </span>
            </div>

            <h2 className="font-pixel text-sm sm:text-base text-[var(--text-heading)] mb-2 group-hover:text-[var(--accent-green)] transition-colors">
              Resolutions
            </h2>
            <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
              Track your active quests, step forward with quick progress updates, and earn XP on completions.
            </p>

            {/* Micro Stats Preview */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg text-xs font-mono mb-4">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">Active Quests:</span>
                <span className="font-bold text-[var(--accent-green)]">{activeCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">Completed:</span>
                <span className="font-bold text-[var(--text-heading)]">{completedCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-dim)]">Total Tracked:</span>
                <span className="font-bold text-[var(--text-heading)]">{resolutions.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <span className="font-pixel text-[10px] text-[var(--text-heading)] group-hover:text-[var(--accent-green)] transition-colors">
              Enter Quest Hub
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--text-heading)] group-hover:text-[var(--accent-green)] group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* CARD 3: CONTACT US */}
        <div
          onClick={() => onNavigate('contact')}
          className="hud-card hud-card-interactive p-6 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 metallic-badge rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="font-pixel text-[9px] text-[var(--text-dim)] uppercase">
                Card 03
              </span>
            </div>

            <h2 className="font-pixel text-sm sm:text-base text-[var(--text-heading)] mb-2 group-hover:text-[var(--accent-green)] transition-colors">
              Contact Us
            </h2>
            <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
              Send bug reports, feature requests, or suggestions directly to the PixelResolve dev team.
            </p>

            {/* Micro Info Preview */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg text-xs font-mono mb-4">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">Support:</span>
                <span className="font-bold text-[var(--accent-green)]">Direct Dispatch</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-dim)]">Priority:</span>
                <span className="font-bold text-[var(--text-heading)]">VIP Feedback</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-dim)]">Channel:</span>
                <span className="font-bold text-[var(--text-heading)]">In-App HUD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <span className="font-pixel text-[10px] text-[var(--text-heading)] group-hover:text-[var(--accent-green)] transition-colors">
              Send Feedback
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--text-heading)] group-hover:text-[var(--accent-green)] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
