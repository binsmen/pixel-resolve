import React, { useState } from 'react';
import { Check, Edit3, Trash2, Plus, Minus, Trophy, Sparkles, BookOpen, Dumbbell, Code, CheckCircle, Flame } from 'lucide-react';
import PixelProgressBar from './PixelProgressBar';

// Unit icon helper
function getQuestIcon(unit, title) {
  const text = (unit + ' ' + title).toLowerCase();
  if (text.includes('book') || text.includes('read') || text.includes('page')) {
    return '📚';
  }
  if (text.includes('run') || text.includes('gym') || text.includes('exercise') || text.includes('workout')) {
    return '⚡';
  }
  if (text.includes('code') || text.includes('dev') || text.includes('project') || text.includes('program')) {
    return '💻';
  }
  if (text.includes('day') || text.includes('habit') || text.includes('streak')) {
    return '🔥';
  }
  return '⚔️';
}

export default function ResolutionCard({
  resolution,
  onOpenUpdate,
  onOpenDelete,
  onQuickAdjust
}) {
  const { id, title, description, goal_value, current_value, unit, status } = resolution;
  const isCompleted = status === 'completed' || current_value >= goal_value;
  const percentage = Math.min(100, Math.max(0, Math.round((current_value / (goal_value || 1)) * 100)));
  const icon = getQuestIcon(unit, title);

  const [adjusting, setAdjusting] = useState(false);

  const handleQuickStep = async (delta) => {
    if (adjusting) return;
    const targetVal = Math.max(0, current_value + delta);
    if (targetVal === current_value) return;
    setAdjusting(true);
    try {
      await onQuickAdjust(resolution, targetVal);
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div
      className={`bg-white border-2 border-pixel-dark p-4 sm:p-5 transition-all flex flex-col justify-between ${
        isCompleted
          ? 'shadow-[4px_4px_0_0_#10B981] bg-gradient-to-br from-white via-white to-emerald-50/40'
          : 'shadow-[4px_4px_0_0_#18181B] hover:shadow-[5px_5px_0_0_#18181B]'
      }`}
    >
      <div>
        {/* Card Header: Icon, Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2.5">
            <span className="text-xl select-none leading-none pt-0.5">{icon}</span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-pixel-dark tracking-tight leading-snug">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                  {description}
                </p>
              )}
            </div>
          </div>

          {isCompleted && (
            <span className="shrink-0 font-pixel text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-600 px-2 py-0.5 flex items-center gap-1 shadow-[1px_1px_0_0_#059669]">
              ★ DONE
            </span>
          )}
        </div>

        {/* Progress Display */}
        <div className="mt-3 mb-2">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-xs font-bold text-zinc-700">
              {current_value} / {goal_value} {unit}
            </span>
            <span className={`font-pixel text-[11px] ${isCompleted ? 'text-emerald-700 font-bold' : 'text-zinc-700'}`}>
              {percentage}%
            </span>
          </div>
          <PixelProgressBar
            value={current_value}
            max={goal_value}
            showLabel={false}
            height="h-5"
            colorScheme={isCompleted ? 'emerald' : 'auto'}
          />
        </div>
      </div>

      {/* Controls & Action Row */}
      <div className="pt-3 border-t-2 border-zinc-100 mt-2 flex items-center justify-between gap-2">
        {/* Quick Stepper */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleQuickStep(-1)}
            disabled={adjusting || current_value <= 0}
            className="pixel-btn bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed w-7 h-7 flex items-center justify-center font-bold text-sm text-zinc-700"
            title="Step -1"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-bold text-zinc-800 px-1.5 min-w-[2rem] text-center">
            {current_value}
          </span>
          <button
            onClick={() => handleQuickStep(1)}
            disabled={adjusting}
            className="pixel-btn bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed w-7 h-7 flex items-center justify-center font-bold text-sm text-zinc-700"
            title="Step +1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenUpdate(resolution)}
            className="pixel-btn bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-800 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3 text-zinc-600" />
            Update
          </button>
          <button
            onClick={() => onOpenDelete(resolution)}
            className="pixel-btn bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-600 px-2 py-1 text-xs font-semibold text-zinc-500 transition-colors"
            title="Delete Quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
