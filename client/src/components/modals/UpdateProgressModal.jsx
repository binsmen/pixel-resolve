import React, { useState } from 'react';
import { X, Plus, Minus, Edit3, ArrowRight } from 'lucide-react';
import PixelProgressBar from '../PixelProgressBar';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pixel-dark/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-pixel-dark w-full max-w-sm p-6 shadow-[6px_6px_0_0_#18181B] relative animate-pixel-pop">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-zinc-100 border border-pixel-dark"
          title="Close"
        >
          <X className="w-4 h-4 text-pixel-dark" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="font-pixel text-[9px] text-zinc-500 uppercase tracking-tight block mb-1">
            Update Progress
          </span>
          <h3 className="font-bold text-base text-pixel-dark leading-tight">
            {resolution.title}
          </h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Current: <strong>{resolution.current_value} / {goal} {unit}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-3 bg-red-50 border border-red-500 p-2 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper Controls */}
          <div className="bg-zinc-50 border-2 border-pixel-dark p-3 shadow-[2px_2px_0_0_#18181B] flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              className="pixel-btn bg-white w-9 h-9 flex items-center justify-center text-lg font-bold text-zinc-800"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="font-mono text-xl font-extrabold text-pixel-dark block">
                {value}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">{unit}</span>
            </div>
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="pixel-btn bg-white w-9 h-9 flex items-center justify-center text-lg font-bold text-zinc-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-600 mb-1 font-mono">
              Or set exact value:
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pixel-input w-full px-3 py-2 text-sm text-zinc-900 font-mono"
            />
          </div>

          {/* Live Progress Preview */}
          <div className="bg-zinc-50 border border-zinc-200 p-2.5">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-zinc-600">New Progress:</span>
              <span className="font-mono text-pixel-green">{previewPercentage}%</span>
            </div>
            <PixelProgressBar
              value={Number(value)}
              max={goal}
              showLabel={false}
              height="h-4"
              colorScheme="auto"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 border-t-2 border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2 px-3.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="pixel-btn bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-2 px-4 shadow-[3px_3px_0_0_#18181B] disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'SAVE PROGRESS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
