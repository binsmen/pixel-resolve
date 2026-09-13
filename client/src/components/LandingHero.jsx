import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Swords, Flame, Trophy } from 'lucide-react';
import PixelProgressBar from './PixelProgressBar';

export default function LandingHero({ onOpenAuth }) {
  return (
    <div className="py-8 sm:py-14 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center px-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-pixel-dark px-3 py-1 shadow-[2px_2px_0_0_#18181B] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span className="font-pixel text-[9px] sm:text-[10px] text-amber-900 tracking-tight uppercase">
            A tiny RPG for your real-life goals
          </span>
        </div>

        <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl text-pixel-dark leading-tight tracking-tight uppercase max-w-2xl mx-auto mb-6">
          Turn your resolutions into quests.
        </h1>

        <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Track your goals, build momentum, and level up as you make progress. No overwhelming spreadsheets—just simple, rewarding pixel gamification.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="pixel-btn bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs sm:text-sm py-3.5 px-6 sm:px-8 shadow-[4px_4px_0_0_#18181B] flex items-center gap-2"
          >
            Start Your Quest
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="pixel-btn bg-white hover:bg-zinc-50 text-pixel-dark font-pixel text-xs sm:text-sm py-3.5 px-6 sm:px-8 shadow-[4px_4px_0_0_#18181B]"
          >
            Log In
          </button>
        </div>
      </div>

      {/* Interactive Mock Quest Card Preview */}
      <div className="max-w-md mx-auto px-4 mb-16">
        <div className="bg-white border-2 border-pixel-dark p-5 shadow-[6px_6px_0_0_#18181B] relative">
          <div className="absolute -top-3.5 right-4 bg-pixel-amber border-2 border-pixel-dark font-pixel text-[9px] px-2 py-0.5 shadow-[2px_2px_0_0_#18181B]">
            LVL 4 HERO
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📚</span>
            <h3 className="font-bold text-base text-pixel-dark">Read 12 Books</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-3 font-normal">
            Expand the mind with sci-fi novels and tech books
          </p>

          <div className="mb-2">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-mono text-xs font-bold text-zinc-700">8 / 12 Books</span>
              <span className="font-pixel text-[10px] text-emerald-600">67%</span>
            </div>
            <PixelProgressBar value={8} max={12} showLabel={false} height="h-4" colorScheme="emerald" />
          </div>

          <div className="pt-3 border-t-2 border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono text-[11px] font-bold text-pixel-green">+5 XP on update</span>
            <span className="font-pixel text-[9px] bg-zinc-100 border border-zinc-300 px-2 py-0.5">QUEST ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Three Pillars Section */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create */}
          <div className="bg-white border-2 border-pixel-dark p-5 shadow-[4px_4px_0_0_#18181B]">
            <div className="w-9 h-9 bg-emerald-100 border-2 border-pixel-dark flex items-center justify-center font-bold mb-3 shadow-[2px_2px_0_0_#18181B]">
              <Swords className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-pixel-dark mb-2">
              1. Create
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Turn your personal goals and resolutions into trackable, bite-sized quests with targets and units.
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white border-2 border-pixel-dark p-5 shadow-[4px_4px_0_0_#18181B]">
            <div className="w-9 h-9 bg-amber-100 border-2 border-pixel-dark flex items-center justify-center font-bold mb-3 shadow-[2px_2px_0_0_#18181B]">
              <Flame className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-pixel-dark mb-2">
              2. Progress
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Update your numbers with single clicks whenever you take a step forward. Watch your progress bars fill up.
            </p>
          </div>

          {/* Level Up */}
          <div className="bg-white border-2 border-pixel-dark p-5 shadow-[4px_4px_0_0_#18181B]">
            <div className="w-9 h-9 bg-purple-100 border-2 border-pixel-dark flex items-center justify-center font-bold mb-3 shadow-[2px_2px_0_0_#18181B]">
              <Trophy className="w-4 h-4 text-purple-700" />
            </div>
            <h3 className="font-pixel text-xs uppercase text-pixel-dark mb-2">
              3. Level Up
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Earn XP for every step and enjoy pixel confetti and level promotions when your quests are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
