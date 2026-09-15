import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';

export default function UpdateProgressModal({ resolution, onClose, onSave }) {
  const [value, setValue] = useState(resolution.current_value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goal = resolution.goal_value;
  const unit = resolution.unit;

  const handleStep = (delta) => {
    const nextVal = Math.max(0, Math.round((Number(value) + delta) * 10) / 10);
    setValue(nextVal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal < 0) {
      setError('Please enter a valid progress number');
      return;
    }

    setLoading(true);
    try {
      await onSave(resolution.id, numVal);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const previewPercentage = Math.min(100, Math.max(0, Math.round((Number(value) / (goal || 1)) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-sm p-6 relative animate-pixel-pop">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[var(--text-dim)] hover:text-[var(--text-heading)]"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
            ADVANCE QUEST PROGRESS
          </span>
          <h3 className="font-pixel text-sm text-[var(--text-heading)] leading-snug">
            {resolution.title}
          </h3>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            Current: <strong>{resolution.current_value} / {goal} {unit}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-3 bg-red-500/10 border border-red-500/40 p-2.5 rounded text-xs text-red-400 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper Controls */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              className="w-9 h-9 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--text-heading)] hover:border-[var(--border-bright)]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="font-mono text-2xl font-bold text-[var(--text-heading)] block">
                {value}
              </span>
              <span className="text-[10px] text-[var(--text-dim)] font-mono uppercase">{unit}</span>
            </div>
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="w-9 h-9 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--text-heading)] hover:border-[var(--border-bright)]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Input */}
          <div>
            <label className="block text-[10px] font-pixel uppercase text-[var(--text-dim)] mb-1">
              Exact number:
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="hud-input w-full px-3 py-2 text-sm rounded font-mono"
            />
          </div>

          {/* Live Progress Preview */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[var(--text-dim)]">Target: {goal} {unit}</span>
              <span className="font-bold text-[var(--accent-green)]">{previewPercentage}%</span>
            </div>
            <div className="w-full bg-[var(--surface-card)] h-3 rounded overflow-hidden p-0.5">
              <div
                className="h-full bg-[var(--accent-green)] rounded transition-all duration-200"
                style={{ width: `${previewPercentage}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn-secondary py-2 px-3.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="pixel-btn-green py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'SAVING...' : 'SAVE (+5 XP)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
