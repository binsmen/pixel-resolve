import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Swords, Flame, Trophy } from 'lucide-react';

export default function LandingHero({ onOpenAuth }) {
  // Animated progress state for the demo HUD card
  const [progressPercent, setProgressPercent] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    // 350ms delay, then animate 0% -> 67% over 1400ms with cubic ease-out
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1400;
      const targetPercent = 67;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out: 1 - Math.pow(1 - progress, 3)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(eased * targetPercent);
        setProgressPercent(currentVal);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation finished: pulse glow & fade in XP reward
          setGlowPulse(true);
          setShowXp(true);
          setTimeout(() => setGlowPulse(false), 1200);
        }
      };

      requestAnimationFrame(animate);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. Main Glass Hero Panel */}
      <div className="glass-hero-panel p-8 sm:p-14 text-center mb-12 sm:mb-16">
        {/* Eyebrow System Indicator */}
        <div className="inline-flex items-center gap-2 bg-[var(--surface-raised)] border border-[var(--border-subtle)] px-3.5 py-1 rounded-full mb-6 shadow-sm">
          <span className="text-[var(--accent-green)] text-xs">◆</span>
          <span className="font-pixel text-[9px] sm:text-[10px] text-[var(--text-heading)] tracking-wider uppercase">
            A tiny RPG for your real-life goals
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl text-[var(--text-heading)] leading-snug sm:leading-tight tracking-tight uppercase max-w-3xl mx-auto mb-6">
          Turn your <br className="hidden sm:inline" />
          resolutions into <br className="hidden sm:inline" />
          <span className="text-[var(--accent-green)]">Quests.</span>
        </h1>

        {/* Description in readable monospace */}
        <p className="font-mono text-sm sm:text-base text-[var(--text-body)] max-w-xl mx-auto mb-9 font-normal leading-relaxed">
          Track your goals, build momentum, and level up as you make progress.
          No overwhelming spreadsheets — just simple, rewarding pixel gamification.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="pixel-btn-primary py-4 px-8 text-xs sm:text-sm flex items-center gap-2.5 group"
          >
            <span>Start Your Quest</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="pixel-btn-secondary py-4 px-8 text-xs sm:text-sm"
          >
            Log In
          </button>
        </div>
      </div>

      {/* 2. Interactive Demo Quest HUD Window (per Ui.md section 12-17) */}
      <div className="max-w-[620px] mx-auto mb-16 relative">
        {/* Floating Level Badge overlapping top right */}
        <div className="absolute -top-3.5 right-6 z-20 metallic-badge px-3 py-1 text-[9px] sm:text-[10px] rounded border-2 border-[var(--border-bright)] shadow-md">
          <span className="text-[var(--accent-green)] mr-1">★</span> LVL 4 HERO
        </div>

        {/* HUD Window Card */}
        <div
          className={`hud-card overflow-hidden transition-all duration-300 ${
            glowPulse ? 'pulse-glow-animation' : ''
          }`}
        >
          {/* Terminal Title Bar */}
          <div className="bg-[var(--surface-raised)] border-b border-[var(--border-subtle)] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="font-pixel text-[9px] text-[var(--text-dim)] tracking-wider">
              QUEST_LOG.EXE
            </span>
          </div>

          {/* Window Body */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl select-none">📚</span>
              <div>
                <h3 className="font-pixel text-sm sm:text-base text-[var(--text-heading)]">
                  Read 12 Books
                </h3>
              </div>
            </div>

            <p className="font-mono text-xs text-[var(--text-body)] mb-4">
              Expand the mind with sci-fi novels and tech books
            </p>

            {/* Target and Percentage */}
            <div className="mb-2">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-mono text-xs font-semibold text-[var(--text-heading)]">
                  8 / 12 Books
                </span>
                <span className="font-pixel text-[11px] text-[var(--accent-green)]">
                  {progressPercent}%
                </span>
              </div>

              {/* Animated Progress Track */}
              <div className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] h-4 rounded overflow-hidden p-0.5">
                <div
                  className="h-full rounded bg-[var(--accent-green)] transition-all duration-75 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Footer: XP Reveal and Status Pill */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs mt-4">
              <div className="h-5 flex items-center">
                <span
                  className={`font-mono text-xs font-bold text-[var(--accent-green)] transition-opacity duration-500 ${
                    showXp ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  +5 XP on update
                </span>
              </div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                QUEST ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three-Step Product Loop (CREATE -> PROGRESS -> LEVEL UP) */}
      <div>
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] text-[var(--text-dim)] uppercase tracking-wider block mb-2">
            The PixelResolve Loop
          </span>
          <h2 className="font-pixel text-base sm:text-lg text-[var(--text-heading)]">
            Simple. Rewarding. Addictive.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Create */}
          <div className="hud-card p-6">
            <div className="w-11 h-11 metallic-badge rounded-lg flex items-center justify-center mb-4">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-[var(--text-heading)] mb-2.5">
              1. Create
            </h3>
            <p className="font-mono text-xs text-[var(--text-body)] leading-relaxed">
              Turn your personal goals and resolutions into trackable, bite-sized quests with targets and units.
            </p>
          </div>

          {/* Step 2: Progress */}
          <div className="hud-card p-6">
            <div className="w-11 h-11 metallic-badge rounded-lg flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-[var(--text-heading)] mb-2.5">
              2. Progress
            </h3>
            <p className="font-mono text-xs text-[var(--text-body)] leading-relaxed">
              Update your numbers with single clicks whenever you take a step forward. Watch your progress bars fill up.
            </p>
          </div>

          {/* Step 3: Level Up */}
          <div className="hud-card p-6">
            <div className="w-11 h-11 metallic-badge rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-[var(--text-heading)] mb-2.5">
              3. Level Up
            </h3>
            <p className="font-mono text-xs text-[var(--text-body)] leading-relaxed">
              Earn XP for every step and enjoy pixel confetti and level promotions when your quests are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
