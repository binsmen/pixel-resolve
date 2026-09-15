import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Target, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'Learning', label: 'Learning', icon: '📚' },
  { id: 'Health', label: 'Health', icon: '🥗' },
  { id: 'Fitness', label: 'Fitness', icon: '💪' },
  { id: 'Career', label: 'Career', icon: '💼' },
  { id: 'Personal', label: 'Personal', icon: '🌱' },
  { id: 'Other', label: 'Other', icon: '⭐' },
];

const UNIT_SUGGESTIONS = ['Books', 'Workouts', 'Hours', 'Days', 'Projects', '%', 'Pages', 'Sessions'];

export default function NewResolutionModal({ onClose, onSubmit }) {
  // 6-step wizard state
  const [step, setStep] = useState(1);

  // Form fields
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [goalValue, setGoalValue] = useState('12');
  const [currentValue, setCurrentValue] = useState('0');
  const [category, setCategory] = useState('Learning');
  const [unit, setUnit] = useState('Books');
  const [deadline, setDeadline] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation before advancing step
  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!title.trim()) {
        setError('Please enter what you want to achieve');
        return;
      }
    } else if (step === 3) {
      const numGoal = parseFloat(goalValue);
      if (isNaN(numGoal) || numGoal <= 0) {
        setError('Target must be a positive number');
        return;
      }
    } else if (step === 4) {
      const numCurrent = parseFloat(currentValue) || 0;
      const numGoal = parseFloat(goalValue) || 1;
      if (numCurrent < 0) {
        setError('Starting progress cannot be negative');
        return;
      }
      if (numCurrent > numGoal) {
        setError('Starting progress cannot be greater than target');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    const numGoal = parseFloat(goalValue);
    const numCurrent = parseFloat(currentValue) || 0;

    if (!title.trim()) {
      setError('Please enter a quest title');
      setStep(1);
      return;
    }

    if (isNaN(numGoal) || numGoal <= 0) {
      setError('Target must be a positive number');
      setStep(3);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: why.trim() || `Quest: ${title.trim()}`,
        why: why.trim(),
        category,
        goal_value: numGoal,
        current_value: numCurrent,
        unit: unit.trim() || 'Units',
        deadline: deadline.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  const previewPct = Math.min(100, Math.round(((parseFloat(currentValue) || 0) / (parseFloat(goalValue) || 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-xl max-h-[92vh] overflow-y-auto overflow-x-hidden p-6 sm:p-7 animate-pixel-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)] mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-green)] text-xs">⚔️</span>
            <h2 className="font-pixel text-xs sm:text-sm text-[var(--text-heading)] uppercase">
              NEW QUEST FORGE • STEP {step} OF 6
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text-heading)] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-1 mb-6">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div
              key={s}
              onClick={() => s < step && setStep(s)}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                s === step
                  ? 'bg-[var(--accent-green)]'
                  : s < step
                  ? 'bg-[var(--border-bright)]'
                  : 'bg-[var(--border-subtle)]'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono rounded">
            {error}
          </div>
        )}

        {/* Wizard Steps */}
        <div className="min-h-[220px]">
          {/* STEP 1: WHAT DO YOU WANT TO ACHIEVE? */}
          {step === 1 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 1 — GOAL NAME
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                What do you want to achieve?
              </h3>
              <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
                Give your resolution an actionable, inspiring quest title.
              </p>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 12 Books, Run 100 Miles, Build SaaS MVP"
                className="hud-input w-full px-4 py-3 text-sm rounded-lg mb-3"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[var(--text-dim)]">
                <span>Quick ideas:</span>
                {['Read 12 Books', 'Workout 50 Times', 'Learn Next.js', 'Meditate 30 Days'].map(idea => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setTitle(idea)}
                    className="underline hover:text-[var(--text-heading)]"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: WHY? */}
          {step === 2 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 2 — THE MOTIVATION
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                Why does this matter to you? (Optional)
              </h3>
              <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
                Connecting your goal to a core purpose keeps your motivation high during tough days.
              </p>

              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                rows={3}
                placeholder="e.g. Expand my knowledge, improve cardiovascular health, become financially independent..."
                className="hud-input w-full px-4 py-3 text-xs rounded-lg mb-2"
                autoFocus
              />
            </div>
          )}

          {/* STEP 3: TARGET */}
          {step === 3 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 3 — TARGET VALUE & UNIT
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                What is your target number?
              </h3>
              <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
                A specific numeric target gives you a clear finish line to celebrate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="hud-input w-full px-3 py-2.5 text-sm rounded-lg"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Books, Hours, Workouts"
                    className="hud-input w-full px-3 py-2.5 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {UNIT_SUGGESTIONS.map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      unit === u
                        ? 'metallic-badge border-[var(--border-bright)]'
                        : 'bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--text-dim)]'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CURRENT PROGRESS */}
          {step === 4 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 4 — STARTING PROGRESS
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                Have you already made progress?
              </h3>
              <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
                If you're starting from scratch, keep this at 0. Otherwise enter what you've accomplished so far.
              </p>

              <div className="max-w-xs mb-4">
                <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                  Current Progress ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  max={goalValue || 100}
                  step="any"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="hud-input w-full px-3 py-2.5 text-sm rounded-lg"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              </div>

              <span className="font-mono text-xs text-[var(--accent-green)]">
                Starting at {currentValue} / {goalValue} {unit} ({previewPct}%)
              </span>
            </div>
          )}

          {/* STEP 5: CATEGORY */}
          {step === 5 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 5 — CATEGORY CLASSIFICATION
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                Select a Quest Category
              </h3>
              <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
                Organize your life areas to maintain balance across learning, health, and career.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                      category === cat.id
                        ? 'metallic-badge border-2 border-[var(--accent-green)] shadow-sm'
                        : 'bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[var(--border-bright)]'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-pixel text-[10px]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: DEADLINE & LIVE PREVIEW */}
          {step === 6 && (
            <div>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
                STEP 6 — TARGET DEADLINE & CONFIRMATION
              </span>
              <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
                Target Deadline (Optional)
              </h3>

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="hud-input w-full px-3 py-2 text-xs rounded-lg mb-5"
              />

              {/* Live Quest Card Preview */}
              <div className="bg-[var(--surface-raised)] border-2 border-[var(--border-bright)] p-4 rounded-xl shadow-md mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase">
                    {category} QUEST
                  </span>
                  <span className="font-pixel text-[9px] text-[var(--text-dim)]">
                    {deadline ? `DUE: ${deadline}` : 'NO DEADLINE'}
                  </span>
                </div>

                <h4 className="font-pixel text-sm text-[var(--text-heading)] mb-1">
                  {title || 'Quest Title'}
                </h4>
                {why && (
                  <p className="font-mono text-xs text-[var(--text-dim)] italic mb-2">
                    "{why}"
                  </p>
                )}

                <div className="mb-2">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>{currentValue} / {goalValue} {unit}</span>
                    <span className="font-bold text-[var(--accent-green)]">{previewPct}%</span>
                  </div>
                  <div className="w-full bg-[var(--surface-card)] h-3 rounded overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[var(--accent-green)] rounded"
                      style={{ width: `${previewPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-dim)] pt-2 border-t border-[var(--border-subtle)]">
                  <span>+5 XP on each step</span>
                  <span className="text-[var(--accent-green)] font-bold">+100 XP ON COMPLETION</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="pixel-btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="pixel-btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              <span>NEXT STEP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="pixel-btn-green px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'FORGING QUEST...' : 'CREATE QUEST'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
