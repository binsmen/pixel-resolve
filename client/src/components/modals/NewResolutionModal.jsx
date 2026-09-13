import React, { useState } from 'react';
import { X, Plus, Sparkles, Target } from 'lucide-react';

const UNIT_SUGGESTIONS = ['%', 'Books', 'Days', 'Sessions', 'Projects', 'Hours'];

export default function NewResolutionModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalValue, setGoalValue] = useState('100');
  const [unit, setUnit] = useState('%');
  const [currentValue, setCurrentValue] = useState('0');
  const [customUnit, setCustomUnit] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a resolution title');
      return;
    }

    const numGoal = parseFloat(goalValue);
    if (isNaN(numGoal) || numGoal <= 0) {
      setError('Target goal must be a positive number');
      return;
    }

    const numCurrent = parseFloat(currentValue) || 0;
    if (numCurrent < 0) {
      setError('Starting progress cannot be negative');
      return;
    }

    const resolvedUnit = isCustom ? (customUnit.trim() || 'Units') : unit;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        goal_value: numGoal,
        current_value: numCurrent,
        unit: resolvedUnit
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create resolution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pixel-dark/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-pixel-dark w-full max-w-lg p-6 shadow-[6px_6px_0_0_#18181B] relative animate-pixel-pop max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-zinc-100 border border-pixel-dark"
          title="Close"
        >
          <X className="w-4 h-4 text-pixel-dark" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-pixel-green border-2 border-pixel-dark flex items-center justify-center shadow-[2px_2px_0_0_#18181B]">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-pixel text-xs sm:text-sm text-pixel-dark tracking-tight uppercase">
              NEW RESOLUTION QUEST
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              Define your target and embark on your journey
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-500 p-2 text-xs text-red-700 font-semibold shadow-[2px_2px_0_0_#EF4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono">
              Resolution Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 12 Books, Learn JavaScript, Exercise"
              required
              className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono">
              Description <span className="text-zinc-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Complete online courses and build 3 showcase projects"
              rows="2"
              className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
            />
          </div>

          {/* Target Goal & Unit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono">
                Goal Target *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                required
                className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono">
                Starting Progress
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
              />
            </div>
          </div>

          {/* Unit Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
              Unit of Measurement
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {UNIT_SUGGESTIONS.map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => { setUnit(u); setIsCustom(false); }}
                  className={`px-2.5 py-1 text-xs font-semibold border-2 border-pixel-dark transition-all ${
                    !isCustom && unit === u
                      ? 'bg-pixel-amber text-pixel-dark shadow-[2px_2px_0_0_#18181B] font-bold'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {u}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`px-2.5 py-1 text-xs font-semibold border-2 border-pixel-dark transition-all ${
                  isCustom
                    ? 'bg-pixel-amber text-pixel-dark shadow-[2px_2px_0_0_#18181B] font-bold'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                Custom...
              </button>
            </div>

            {isCustom && (
              <input
                type="text"
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                placeholder="Enter custom unit (e.g. Km, Reps, Chapters)"
                className="pixel-input w-full px-3 py-1.5 text-xs text-zinc-900 mt-1"
                autoFocus
              />
            )}
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="pt-3 border-t-2 border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="pixel-btn bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-2.5 px-5 shadow-[3px_3px_0_0_#18181B] disabled:opacity-50"
            >
              {loading ? 'CREATING...' : '+ CREATE QUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
