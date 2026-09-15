import React, { useState } from 'react';
import { Edit3, Trash2, Plus, Minus, Calendar, Sparkles, CheckCircle } from 'lucide-react';

function getCategoryIcon(cat = '') {
  switch (cat.toLowerCase()) {
    case 'learning': return '📚';
    case 'health': return '🥗';
    case 'fitness': return '💪';
    case 'career': return '💼';
    case 'personal': return '🌱';
    default: return '⭐';
  }
}

export default function ResolutionCard({
  resolution,
  onOpenUpdate,
  onOpenDelete,
  onQuickAdjust
}) {
  const { id, title, description, why, category = 'Personal', goal_value, current_value, unit, deadline, status } = resolution;
  const isCompleted = status === 'completed' || current_value >= goal_value;
  const percentage = Math.min(100, Math.max(0, Math.round((current_value / (goal_value || 1)) * 100)));
  const catIcon = getCategoryIcon(category);

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
      className={`hud-card p-5 transition-all flex flex-col justify-between ${
        isCompleted
          ? 'border-[var(--accent-green)] shadow-[0_0_15px_var(--accent-green-glow)]'
          : 'hover:border-[var(--border-bright)]'
      }`}
    >
      <div>
        {/* Category & Status Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[10px] font-mono">
            <span>{catIcon}</span>
            <span className="text-[var(--text-dim)] uppercase font-pixel text-[8px]">{category}</span>
          </div>

          {isCompleted ? (
            <span className="font-pixel text-[8px] text-[var(--accent-green)] bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              QUEST CLEARED
            </span>
          ) : (
            <span className="font-pixel text-[8px] text-[var(--accent-green)] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          )}
        </div>

        {/* Title & Motivation */}
        <h3 className="font-pixel text-sm sm:text-base text-[var(--text-heading)] mb-1 leading-snug">
          {title}
        </h3>

        {why ? (
          <p className="font-mono text-xs text-[var(--text-dim)] italic mb-3 line-clamp-1">
            "{why}"
          </p>
        ) : description ? (
          <p className="font-mono text-xs text-[var(--text-body)] mb-3 line-clamp-2">
            {description}
          </p>
        ) : null}

        {/* Deadline if present */}
        {deadline && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-dim)] mb-3">
            <Calendar className="w-3 h-3" />
            <span>Due: {deadline}</span>
          </div>
        )}

        {/* Progress Bar & Counter */}
        <div className="my-3">
          <div className="flex items-baseline justify-between mb-1.5 text-xs font-mono">
            <span className="font-bold text-[var(--text-heading)]">
              {current_value} / {goal_value} {unit}
            </span>
            <span className={`font-pixel text-[10px] ${isCompleted ? 'text-[var(--accent-green)] font-bold' : 'text-[var(--text-heading)]'}`}>
              {percentage}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] h-3.5 rounded overflow-hidden p-0.5">
            <div
              className={`h-full rounded transition-all duration-300 ${
                isCompleted ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-green)]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Quick Adjust Stepper & Action Buttons */}
      <div className="pt-3 border-t border-[var(--border-subtle)] mt-2 flex items-center justify-between gap-2">
        {/* Quick +/- Stepper */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-1 rounded-md">
          <button
            onClick={() => handleQuickStep(-1)}
            disabled={adjusting || current_value <= 0}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--surface-card)] text-[var(--text-heading)] disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step -1"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono text-xs font-bold px-1.5 min-w-[2rem] text-center text-[var(--text-heading)]">
            {current_value}
          </span>
          <button
            onClick={() => handleQuickStep(1)}
            disabled={adjusting}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--surface-card)] text-[var(--text-heading)] disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step +1"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Edit / Details & Delete */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenUpdate(resolution)}
            className="pixel-btn-secondary px-2.5 py-1 text-[9px] flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update</span>
          </button>
          <button
            onClick={() => onOpenDelete(resolution)}
            className="w-7 h-7 rounded border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-red-500/50 hover:text-red-400 flex items-center justify-center text-[var(--text-dim)] transition-colors"
            title="Delete Quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
