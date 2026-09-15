import React from 'react';
import { Target, CheckCircle2, Flame, Award } from 'lucide-react';
import PixelProgressBar from './PixelProgressBar';

export default function StatsOverview({ resolutions = [], user }) {
  const total = resolutions.length;
  const activeCount = resolutions.filter(r => r.status === 'active').length;
  const completedCount = resolutions.filter(r => r.status === 'completed').length;

  // Calculate overall progress across all resolutions
  const overallPercentage = total === 0
    ? 0
    : Math.round(
        resolutions.reduce((acc, r) => {
          const ratio = Math.min(1, Math.max(0, (r.current_value || 0) / (r.goal_value || 1)));
          return acc + ratio;
        }, 0) / total * 100
      );

  return (
    <div className="bg-white border-2 border-pixel-dark p-4 sm:p-5 shadow-[4px_4px_0_0_#18181B] mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-zinc-200">
        <div>
          <h2 className="font-pixel text-xs sm:text-sm text-pixel-dark tracking-wide uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-pixel-green" />
            YOUR PROGRESS
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            Keep embarking on quests to level up your character
          </p>
        </div>

        {/* Quick Counters */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-amber-50 border border-pixel-dark px-2.5 py-1.5 shadow-[2px_2px_0_0_#18181B]">
            <Flame className="w-4 h-4 text-amber-600" />
            <div>
              <span className="font-pixel text-[11px] text-amber-900 block">{activeCount}</span>
              <span className="text-[9px] font-bold uppercase text-amber-700">Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-pixel-dark px-2.5 py-1.5 shadow-[2px_2px_0_0_#18181B]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-pixel text-[11px] text-emerald-900 block">{completedCount}</span>
              <span className="text-[9px] font-bold uppercase text-emerald-700">Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 border border-pixel-dark px-2.5 py-1.5 shadow-[2px_2px_0_0_#18181B]">
            <Award className="w-4 h-4 text-purple-600" />
            <div>
              <span className="font-pixel text-[11px] text-purple-900 block">{user?.xp || 0}</span>
              <span className="text-[9px] font-bold uppercase text-purple-700">Total XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Gauge */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="font-pixel text-[10px] text-zinc-700 uppercase tracking-tight">
            Overall Completion
          </span>
          <span className="font-mono text-xs text-zinc-800 font-extrabold">
            {overallPercentage}%
          </span>
        </div>
        <PixelProgressBar
          value={overallPercentage}
          max={100}
          showLabel={false}
          height="h-5"
          colorScheme="auto"
        />
      </div>
    </div>
  );
}
