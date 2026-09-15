import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export default function QuestCompleteModal({ quest, onClose }) {
  useEffect(() => {
    // Fire pixelated / retro multi-burst confetti
    try {
      const end = Date.now() + 1400;
      const colors = ['#22c55e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: colors,
          shapes: ['square'],
          scalar: 1.2
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: colors,
          shapes: ['square'],
          scalar: 1.2
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.error('Confetti trigger error:', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-sm p-6 sm:p-8 relative animate-pixel-pop text-center">
        {/* Stars Header */}
        <div className="flex items-center justify-center gap-2 mb-3 text-amber-400">
          <Star className="w-5 h-5 fill-amber-400" />
          <Star className="w-7 h-7 fill-amber-400 scale-110" />
          <Star className="w-5 h-5 fill-amber-400" />
        </div>

        {/* Title */}
        <h2 className="font-pixel text-sm sm:text-base text-[var(--accent-green)] uppercase tracking-wider mb-2 leading-snug">
          QUEST CLEARED!
        </h2>

        {/* Quest Title */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border-bright)] p-4 rounded-xl mb-4">
          <p className="font-pixel text-sm text-[var(--text-heading)] mb-1">
            {quest?.title || 'Victory!'}
          </p>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            {quest?.goal_value} / {quest?.goal_value} {quest?.unit || '%'}
          </span>
        </div>

        {/* 100% Progress Bar */}
        <div className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] h-4 rounded overflow-hidden p-0.5 mb-5">
          <div className="h-full bg-[var(--accent-green)] rounded w-full" />
        </div>

        {/* XP Bonus Badge */}
        <div className="inline-flex items-center gap-2 metallic-badge px-4 py-2 rounded-lg text-xs mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>+100 XP REWARD!</span>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onClose}
            className="pixel-btn-green w-full py-3 text-xs"
          >
            CLAIM REWARD & CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
