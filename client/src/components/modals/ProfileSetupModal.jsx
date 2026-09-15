import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus, X, ArrowRight, Shield } from 'lucide-react';

const AVATAR_OPTIONS = ['🧙‍♂️', '⚔️', '🥷', '🏹', '🛡️', '🚀', '🤖', '🦁', '🦉', '💎'];

export default function ProfileSetupModal({ isOpen, onComplete }) {
  const { user, updateProfile } = useAuth();

  const [avatar, setAvatar] = useState(user?.avatar || '🧙‍♂️');
  const [bio, setBio] = useState(user?.bio || '');
  const [education, setEducation] = useState(user?.education || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills?.length ? user.skills : ['Self-Discipline', 'Goal Setting']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateProfile({
        avatar,
        bio: bio.trim(),
        education: education.trim(),
        skills,
        profile_completed: 1
      });
      onComplete();
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-lg overflow-hidden animate-pixel-pop">
        {/* Terminal Header */}
        <div className="bg-[var(--surface-raised)] border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-green)] text-xs">◆</span>
            <span className="font-pixel text-[10px] text-[var(--text-heading)] uppercase tracking-wider">
              INITIAL HERO CALIBRATION
            </span>
          </div>
          <span className="font-pixel text-[9px] text-[var(--accent-green)] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            STEP 1 OF 1
          </span>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="text-center mb-6">
            <h2 className="font-pixel text-base text-[var(--text-heading)] mb-1">
              Initialize Your Adventurer Profile
            </h2>
            <p className="font-mono text-xs text-[var(--text-body)]">
              Welcome to PixelResolve! Set up your character identity before entering your quest command center.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono rounded">
              {error}
            </div>
          )}

          {/* Avatar Selection */}
          <div className="mb-5">
            <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-2 uppercase">
              Choose Avatar Emblem
            </label>
            <div className="flex flex-wrap gap-2 justify-center bg-[var(--surface-raised)] p-3 rounded-lg border border-[var(--border-subtle)]">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setAvatar(opt)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    avatar === opt
                      ? 'metallic-badge scale-110 border-2 border-[var(--accent-green)] shadow-md'
                      : 'hover:bg-[var(--surface-card)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Education / Institution */}
          <div className="mb-4">
            <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1.5 uppercase">
              Education / Institution
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. University of California, Self-Taught, High School"
              className="hud-input w-full px-3.5 py-2.5 rounded-lg text-xs"
            />
          </div>

          {/* Short Bio */}
          <div className="mb-4">
            <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1.5 uppercase">
              Short Bio / Motto
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Dedicated to building habits one pixel at a time"
              maxLength={120}
              className="hud-input w-full px-3.5 py-2.5 rounded-lg text-xs"
            />
          </div>

          {/* Skills Tags */}
          <div className="mb-6">
            <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1.5 uppercase">
              Skills & Focus Areas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                placeholder="Add skill (e.g. Python, Running, Reading)..."
                className="hud-input flex-1 px-3 py-2 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="pixel-btn-secondary px-3 py-2 text-[9px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            </div>

            {/* Rendered Skill Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {skills.map((s) => (
                <span
                  key={s}
                  className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-heading)] px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-[var(--text-dim)] hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={saving}
            className="pixel-btn-green w-full py-3.5 text-xs flex items-center justify-center gap-2"
          >
            <span>{saving ? 'SAVING PROFILE...' : 'SAVE & ENTER COMMAND CENTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
