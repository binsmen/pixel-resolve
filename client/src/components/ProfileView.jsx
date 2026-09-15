import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Edit3,
  Check,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Trophy,
  BookOpen
} from 'lucide-react';

const AVATAR_OPTIONS = ['🧙‍♂️', '⚔️', '🥷', '🏹', '🛡️', '🚀', '🤖', '🦁', '🦉', '💎'];

export default function ProfileView({ resolutions = [], onNavigateToQuests }) {
  const { user, updateProfile, verifyEmail } = useAuth();

  // Edit Profile Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editEducation, setEditEducation] = useState(user?.education || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '🧙‍♂️');
  const [editSkills, setEditSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(null); // { checking: boolean, available: boolean, error?: string }
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Real-life achievements state
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [achieveTitle, setAchieveTitle] = useState('');
  const [achieveDate, setAchieveDate] = useState('');

  // Email verification mock status
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  // Computed PixelResolve stats
  const totalQuests = resolutions.length;
  const activeQuests = resolutions.filter(r => r.status === 'active').length;
  const completedQuests = resolutions.filter(r => r.status === 'completed').length;
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const levelFloorXp = (currentLevel - 1) * 100;
  const levelCeilXp = currentLevel * 100;
  const xpInCurrentLevel = currentXp % 100;
  const xpNeeded = 100 - xpInCurrentLevel;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 100) * 100));

  // Determine earned in-app PixelResolve achievements based on real milestones
  const pixelResolveBadges = [
    {
      id: 'first_quest',
      title: 'First Resolution',
      desc: 'Created your first quest on PixelResolve',
      earned: totalQuests > 0,
      icon: '⚔️'
    },
    {
      id: 'first_complete',
      title: 'First Quest Cleared',
      desc: 'Completed your first resolution 100%',
      earned: completedQuests > 0,
      icon: '🏆'
    },
    {
      id: 'grinder',
      title: 'Level Up Hero',
      desc: 'Reached Level 2 or above',
      earned: currentLevel >= 2,
      icon: '⚡'
    },
    {
      id: 'quest_master',
      title: 'Quest Master',
      desc: 'Cleared 3 or more resolutions',
      earned: completedQuests >= 3,
      icon: '🌟'
    }
  ];

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      await verifyEmail();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleCheckUsername = async (uname) => {
    const trimmed = uname.trim();
    if (!trimmed || trimmed === user?.username) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus({ checking: true });
    try {
      const res = await api.auth.checkUsername(trimmed, user?.id);
      if (res.available) {
        setUsernameStatus({ checking: false, available: true });
      } else {
        setUsernameStatus({ checking: false, available: false, error: res.reason || 'Username is taken' });
      }
    } catch (err) {
      setUsernameStatus({ checking: false, available: false, error: err.message });
    }
  };

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditUsername(user?.username || '');
    setEditBio(user?.bio || '');
    setEditEducation(user?.education || '');
    setEditAvatar(user?.avatar || '🧙‍♂️');
    setEditSkills(user?.skills || []);
    setUsernameStatus(null);
    setSaveError('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      await updateProfile({
        name: editName.trim(),
        username: editUsername.trim(),
        bio: editBio.trim(),
        education: editEducation.trim(),
        avatar: editAvatar,
        skills: editSkills
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Add Real-Life Achievement
  const handleAddRealLifeAchievement = async (e) => {
    e.preventDefault();
    if (!achieveTitle.trim()) return;

    const newAchieve = {
      id: Date.now().toString(),
      title: achieveTitle.trim(),
      date: achieveDate || new Date().toISOString().split('T')[0]
    };

    const currentList = user?.achievements || [];
    const updated = [newAchieve, ...currentList];

    try {
      await updateProfile({ achievements: updated });
      setAchieveTitle('');
      setAchieveDate('');
      setShowAddAchievement(false);
    } catch (err) {
      console.error('Failed to add achievement:', err);
    }
  };

  const handleRemoveRealLifeAchievement = async (id) => {
    const currentList = user?.achievements || [];
    const updated = currentList.filter(a => a.id !== id);
    try {
      await updateProfile({ achievements: updated });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. Header Profile Banner (Section A & B) */}
      <div className="hud-card p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar Container */}
            <div className="w-20 h-20 rounded-2xl metallic-badge text-4xl flex items-center justify-center select-none shadow-lg">
              {user?.avatar || '🧙‍♂️'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="font-pixel text-base sm:text-xl text-[var(--text-heading)]">
                  {user?.name || 'Player'}
                </h1>
                <span className="font-mono text-xs text-[var(--accent-green)] font-bold">
                  @{user?.username || 'player'}
                </span>
                <span className="metallic-badge px-2 py-0.5 text-[9px] rounded">
                  LVL {currentLevel}
                </span>
              </div>

              {/* Bio */}
              <p className="font-mono text-xs text-[var(--text-body)] max-w-xl mb-2 leading-relaxed">
                {user?.bio || 'Adventurer on a quest for continuous self-improvement.'}
              </p>

              {/* Education / Institution (Section B) */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-dim)]">
                {user?.education && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[var(--text-heading)]" />
                    <span>{user.education}</span>
                  </div>
                )}
                {/* Email Verification Status */}
                <div className="flex items-center gap-1.5">
                  {user?.email_verification_status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Email Verified
                    </span>
                  ) : (
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Unverified Email (Mock)
                      </span>
                      <button
                        onClick={handleVerifyEmail}
                        disabled={verifyingEmail}
                        className="pixel-btn-secondary px-2 py-0.5 text-[8px] font-pixel text-emerald-400 border-emerald-500/40"
                      >
                        {verifyingEmail ? 'Verifying...' : 'VERIFY NOW'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <button
            onClick={openEditModal}
            className="pixel-btn-secondary px-4 py-2.5 text-[10px] flex items-center gap-2 self-stretch sm:self-auto justify-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT PROFILE</span>
          </button>
        </div>

        {/* Section C: Skills Chips */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-[var(--text-heading)] uppercase tracking-wider">
              Skills & Focus Areas
            </span>
            <button
              onClick={openEditModal}
              className="text-xs font-mono text-[var(--accent-green)] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Manage Skills</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(user?.skills || []).length > 0 ? (
              user.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-heading)] px-3 py-1 rounded-md text-xs font-mono"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs font-mono text-[var(--text-dim)]">
                No skills added yet. Click "Manage Skills" to add your focus areas!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. PixelResolve Progress & Stats (Section D) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Level & XP Gauge */}
        <div className="hud-card p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-green)]" />
              <h3 className="font-pixel text-xs text-[var(--text-heading)] uppercase">
                Pixel Progression Engine
              </h3>
            </div>
            <span className="font-pixel text-[10px] text-[var(--accent-green)]">
              LEVEL {currentLevel}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-xs text-[var(--text-dim)]">
                Progress to Level {currentLevel + 1}
              </span>
              <span className="font-mono text-xs font-bold text-[var(--text-heading)]">
                {xpInCurrentLevel} / 100 XP ({xpNeeded} XP needed)
              </span>
            </div>

            {/* Custom Pixel Progress Bar */}
            <div className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] h-5 rounded p-0.5 overflow-hidden">
              <div
                className="h-full rounded bg-[var(--accent-green)] transition-all duration-500 shadow-sm"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-subtle)] text-center">
            <div>
              <span className="font-pixel text-base text-[var(--text-heading)] block mb-1">
                {currentXp}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
                Total XP Earned
              </span>
            </div>
            <div>
              <span className="font-pixel text-base text-[var(--accent-green)] block mb-1">
                {activeQuests}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
                Active Quests
              </span>
            </div>
            <div>
              <span className="font-pixel text-base text-[var(--text-heading)] block mb-1">
                {completedQuests}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
                Quests Cleared
              </span>
            </div>
          </div>
        </div>

        {/* Hero Title & Rank */}
        <div className="hud-card p-6 flex flex-col justify-between">
          <div>
            <span className="font-pixel text-[9px] text-[var(--text-dim)] uppercase tracking-wider block mb-2">
              RPG Adventurer Rank
            </span>
            <h4 className="font-pixel text-sm text-[var(--text-heading)] mb-2">
              {currentLevel === 1 && 'BEGINNER BUILDER'}
              {currentLevel === 2 && 'PERSISTENT GRINDER'}
              {currentLevel === 3 && 'HABIT FORGER'}
              {currentLevel === 4 && 'QUEST VETERAN'}
              {currentLevel >= 5 && 'PIXEL RESOLVE LEGEND'}
            </h4>
            <p className="font-mono text-xs text-[var(--text-body)] leading-relaxed">
              Every completed resolution awards +100 XP. Incremental progress updates award +5 XP.
            </p>
          </div>

          <button
            onClick={onNavigateToQuests}
            className="pixel-btn-primary w-full py-2.5 text-[9px] mt-4"
          >
            VIEW QUEST LOG
          </button>
        </div>
      </div>

      {/* 3. Section E: Achievements (PixelResolve in-app vs. Real-Life achievements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* PixelResolve In-App Achievements */}
        <div className="hud-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--accent-green)]" />
              <h3 className="font-pixel text-xs text-[var(--text-heading)] uppercase">
                Platform Achievements
              </h3>
            </div>
            <span className="font-mono text-xs text-[var(--text-dim)]">
              {pixelResolveBadges.filter(b => b.earned).length} / {pixelResolveBadges.length}
            </span>
          </div>

          <div className="space-y-3">
            {pixelResolveBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                  badge.earned
                    ? 'bg-[var(--surface-raised)] border-[var(--border-bright)]'
                    : 'bg-transparent border-[var(--border-subtle)] opacity-40'
                }`}
              >
                <div className="text-2xl select-none">{badge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-pixel text-[10px] text-[var(--text-heading)]">
                      {badge.title}
                    </span>
                    {badge.earned && (
                      <span className="font-pixel text-[8px] text-[var(--accent-green)]">
                        EARNED
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[var(--text-body)]">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Life Achievements (User-Editable) */}
        <div className="hud-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="font-pixel text-xs text-[var(--text-heading)] uppercase">
                  Real-Life Milestones
                </h3>
              </div>
              <button
                onClick={() => setShowAddAchievement(!showAddAchievement)}
                className="pixel-btn-secondary px-2.5 py-1 text-[8px] font-pixel flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>ADD MILESTONE</span>
              </button>
            </div>

            {/* Quick Add Form */}
            {showAddAchievement && (
              <form onSubmit={handleAddRealLifeAchievement} className="p-3 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg mb-4">
                <input
                  type="text"
                  value={achieveTitle}
                  onChange={(e) => setAchieveTitle(e.target.value)}
                  placeholder="e.g. Read Clean Code, Ran 5k, Completed Web Bootcamp"
                  className="hud-input w-full px-2.5 py-1.5 text-xs rounded mb-2"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="date"
                    value={achieveDate}
                    onChange={(e) => setAchieveDate(e.target.value)}
                    className="hud-input px-2 py-1 text-xs rounded text-[var(--text-dim)]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAchievement(false)}
                      className="px-2 py-1 text-xs text-[var(--text-dim)] hover:text-[var(--text-heading)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="pixel-btn-green px-3 py-1 text-[9px] font-pixel"
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Real Life Achievements List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(user?.achievements || []).length > 0 ? (
                user.achievements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-pixel text-[10px] text-[var(--text-heading)] block mb-0.5">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-dim)]">
                        Logged {item.date || 'Recently'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveRealLifeAchievement(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--text-dim)] hover:text-red-400 p-1 transition-opacity"
                      title="Remove milestone"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center border border-dashed border-[var(--border-subtle)] rounded-lg">
                  <p className="font-mono text-xs text-[var(--text-dim)] mb-2">
                    Record your offline wins (courses, books, projects, competitions).
                  </p>
                  <button
                    onClick={() => setShowAddAchievement(true)}
                    className="text-xs font-mono text-[var(--accent-green)] hover:underline"
                  >
                    + Add your first milestone
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section F: Resolution Activity Summary */}
      <div className="hud-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--text-heading)]" />
            <h3 className="font-pixel text-xs text-[var(--text-heading)] uppercase">
              Recent Quest Summary
            </h3>
          </div>
          <button
            onClick={onNavigateToQuests}
            className="text-xs font-mono text-[var(--accent-green)] hover:underline"
          >
            Manage All Quests →
          </button>
        </div>

        {resolutions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resolutions.slice(0, 6).map((res) => {
              const pct = Math.min(100, Math.round(((res.current_value || 0) / (res.goal_value || 1)) * 100));
              return (
                <div
                  key={res.id}
                  className="p-3 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-pixel text-[10px] text-[var(--text-heading)] truncate max-w-[140px]">
                      {res.title}
                    </span>
                    <span
                      className={`text-[9px] font-pixel px-1.5 py-0.5 rounded ${
                        res.status === 'completed'
                          ? 'bg-emerald-500/20 text-[var(--accent-green)]'
                          : 'bg-[var(--surface-card)] text-[var(--text-dim)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--surface-card)] h-2 rounded overflow-hidden mt-2">
                    <div
                      className="h-full bg-[var(--accent-green)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-mono text-xs text-[var(--text-dim)]">
            No resolutions created yet. Start a quest to see your progress here!
          </p>
        )}
      </div>

      {/* 5. Section G: Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="hud-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-pixel-pop">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-5">
              <h3 className="font-pixel text-sm text-[var(--text-heading)]">
                EDIT HERO PROFILE
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[var(--text-dim)] hover:text-[var(--text-heading)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono rounded mb-4">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1.5 uppercase">
                  Avatar Emblem
                </label>
                <div className="flex flex-wrap gap-2 justify-center bg-[var(--surface-raised)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setEditAvatar(opt)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        editAvatar === opt
                          ? 'metallic-badge border-2 border-[var(--accent-green)] scale-105'
                          : 'hover:bg-[var(--surface-card)]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1 uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                  required
                />
              </div>

              {/* Username with Uniqueness Check */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-pixel text-[10px] text-[var(--text-heading)] uppercase">
                    Unique Username
                  </label>
                  {usernameStatus?.checking && (
                    <span className="text-[10px] font-mono text-[var(--text-dim)]">Checking...</span>
                  )}
                  {usernameStatus?.available && (
                    <span className="text-[10px] font-mono text-emerald-400">✓ Available</span>
                  )}
                  {usernameStatus?.error && (
                    <span className="text-[10px] font-mono text-red-400">✗ {usernameStatus.error}</span>
                  )}
                </div>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => {
                    setEditUsername(e.target.value);
                    handleCheckUsername(e.target.value);
                  }}
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                  required
                />
                <span className="text-[10px] font-mono text-[var(--text-dim)] mt-1 block">
                  3-20 characters, alphanumeric & underscores.
                </span>
              </div>

              {/* Education */}
              <div>
                <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1 uppercase">
                  Education / Institution
                </label>
                <input
                  type="text"
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  placeholder="Where did you study?"
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1 uppercase">
                  Bio / Philosophy
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                  placeholder="Short personal summary..."
                />
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="block font-pixel text-[10px] text-[var(--text-heading)] mb-1 uppercase">
                  Skills Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type skill and press Add"
                    className="hud-input flex-1 px-3 py-1.5 text-xs rounded"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput.trim() && !editSkills.includes(skillInput.trim())) {
                          setEditSkills([...editSkills, skillInput.trim()]);
                          setSkillInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim() && !editSkills.includes(skillInput.trim())) {
                        setEditSkills([...editSkills, skillInput.trim()]);
                        setSkillInput('');
                      }
                    }}
                    className="pixel-btn-secondary px-3 py-1.5 text-[9px]"
                  >
                    ADD
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {editSkills.map((s) => (
                    <span
                      key={s}
                      className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-heading)] px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => setEditSkills(editSkills.filter(x => x !== s))}
                        className="text-[var(--text-dim)] hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="pixel-btn-secondary px-4 py-2 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving || usernameStatus?.available === false}
                  className="pixel-btn-green px-5 py-2 text-xs"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
