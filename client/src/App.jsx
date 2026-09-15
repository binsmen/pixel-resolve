import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import MatrixBackground from './components/MatrixBackground';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import ResolutionsView from './components/ResolutionsView';
import ContactView from './components/ContactView';
import AdminFeedbackView from './components/AdminFeedbackView';

import AuthModal from './components/modals/AuthModal';
import ProfileSetupModal from './components/modals/ProfileSetupModal';
import NewResolutionModal from './components/modals/NewResolutionModal';
import UpdateProgressModal from './components/modals/UpdateProgressModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import QuestCompleteModal from './components/modals/QuestCompleteModal';

import { Sparkles, Swords, Trophy } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, updateUserStats, refreshProfile } = useAuth();

  // Active view tab for authenticated users: 'dashboard' | 'profile' | 'resolutions' | 'contact' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resolutions, setResolutions] = useState([]);
  const [loadingResolutions, setLoadingResolutions] = useState(false);

  // Modals state
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [showNewModal, setShowNewModal] = useState(false);
  const [updatingResolution, setUpdatingResolution] = useState(null);
  const [deletingResolution, setDeletingResolution] = useState(null);
  const [completedQuest, setCompletedQuest] = useState(null);

  // Level Up celebratory popup
  const [levelUpModal, setLevelUpModal] = useState(null); // { oldLevel, newLevel }
  const prevLevelRef = useRef(user?.level || 1);

  // Floating XP toast notification
  const [xpToast, setXpToast] = useState(null);

  const triggerXpToast = (xp) => {
    if (!xp) return;
    setXpToast(`+${xp} XP!`);
    setTimeout(() => {
      setXpToast(null);
    }, 2500);
  };

  // Check for level ups
  useEffect(() => {
    if (user?.level && prevLevelRef.current && user.level > prevLevelRef.current) {
      setLevelUpModal({
        oldLevel: prevLevelRef.current,
        newLevel: user.level
      });
    }
    if (user?.level) {
      prevLevelRef.current = user.level;
    }
  }, [user?.level]);

  // Fetch resolutions whenever user changes
  const fetchResolutions = async () => {
    if (!user) return;
    setLoadingResolutions(true);
    try {
      const data = await api.resolutions.getAll();
      setResolutions(data.resolutions || []);
    } catch (err) {
      console.error('Failed to load resolutions:', err);
    } finally {
      setLoadingResolutions(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResolutions();
    } else {
      setResolutions([]);
      setActiveTab('dashboard');
    }
  }, [user]);

  // Create Resolution Handler
  const handleCreateResolution = async (newQuestData) => {
    const data = await api.resolutions.create(newQuestData);
    if (data.resolution) {
      setResolutions((prev) => [data.resolution, ...prev]);
    }
    if (data.user) {
      updateUserStats(data.user);
    }
    if (data.xpGained) {
      triggerXpToast(data.xpGained);
    }
    if (data.questCompleted) {
      setCompletedQuest(data.resolution);
    }
  };

  // Update Progress Handler
  const handleUpdateProgress = async (id, currentValue) => {
    const data = await api.resolutions.update(id, { current_value: currentValue });
    if (data.resolution) {
      setResolutions((prev) =>
        prev.map((r) => (r.id === id ? data.resolution : r))
      );
    }
    if (data.user) {
      updateUserStats(data.user);
    }
    if (data.xpGained) {
      triggerXpToast(data.xpGained);
    }
    if (data.questCompleted) {
      setCompletedQuest(data.resolution);
    }
  };

  // Quick Step Handler (direct +/- stepper on card)
  const handleQuickAdjust = async (resolution, targetValue) => {
    await handleUpdateProgress(resolution.id, targetValue);
  };

  // Delete Resolution Handler
  const handleDeleteResolution = async (id) => {
    await api.resolutions.delete(id);
    setResolutions((prev) => prev.filter((r) => r.id !== id));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-page)] text-[var(--text-heading)] font-mono">
        <MatrixBackground />
        <div className="w-12 h-12 metallic-badge rounded-xl flex items-center justify-center shadow-lg mb-4 animate-pulse z-10">
          <Swords className="w-6 h-6" />
        </div>
        <p className="font-pixel text-[10px] text-[var(--accent-green)] z-10 uppercase tracking-wider">
          CALIBRATING PIXEL REALM...
        </p>
      </div>
    );
  }

  // Determine if mandatory initial profile setup is required
  const needsProfileSetup = user && user.profile_completed === 0;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-heading)] transition-colors duration-200 relative flex flex-col justify-between">
      {/* 1. Matrix Katakana Background Canvas (Ui.md Section 5) */}
      <MatrixBackground />

      {/* 2. Floating XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-20 right-6 z-50 metallic-badge px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 border-2 border-[var(--accent-green)] animate-pixel-pop">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-[var(--accent-green)]">{xpToast}</span>
        </div>
      )}

      {/* 3. Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* 4. Main Views Router */}
      <main className="flex-1 relative z-10">
        {!user ? (
          /* Visitor Landing Page */
          <LandingHero
            onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
          />
        ) : (
          /* Authenticated Pages */
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                resolutions={resolutions}
                onNavigate={(tab) => setActiveTab(tab)}
                onNewQuest={() => setShowNewModal(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                resolutions={resolutions}
                onNavigateToQuests={() => setActiveTab('resolutions')}
              />
            )}

            {activeTab === 'resolutions' && (
              <ResolutionsView
                resolutions={resolutions}
                loading={loadingResolutions}
                onOpenNew={() => setShowNewModal(true)}
                onOpenUpdate={(res) => setUpdatingResolution(res)}
                onOpenDelete={(res) => setDeletingResolution(res)}
                onQuickAdjust={handleQuickAdjust}
              />
            )}

            {activeTab === 'contact' && (
              <ContactView />
            )}

            {activeTab === 'admin' && (
              <AdminFeedbackView />
            )}
          </>
        )}
      </main>

      {/* 5. Minimal Cinematic Footer */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-6 text-center text-xs font-mono text-[var(--text-dim)]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-[var(--text-heading)]">PIXELRESOLVE</span>
            <span>•</span>
            <span>Turn Resolutions Into Quests</span>
          </div>
          <div className="text-[11px]">
            Designed for Personal Mastery • No Spreadsheets • RPG Progression
          </div>
        </div>
      </footer>

      {/* --- MODALS & DIALOGS --- */}

      {/* Auth Modal (Login / Sign Up) */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
        />
      )}

      {/* Mandatory Profile Setup Modal for new accounts */}
      <ProfileSetupModal
        isOpen={needsProfileSetup}
        onComplete={() => {
          refreshProfile();
          setActiveTab('dashboard');
        }}
      />

      {/* 6-Step Resolution Creator Modal */}
      {showNewModal && (
        <NewResolutionModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreateResolution}
        />
      )}

      {/* Update Progress Modal */}
      {updatingResolution && (
        <UpdateProgressModal
          resolution={updatingResolution}
          onClose={() => setUpdatingResolution(null)}
          onSave={handleUpdateProgress}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingResolution && (
        <DeleteConfirmModal
          resolution={deletingResolution}
          onClose={() => setDeletingResolution(null)}
          onConfirm={handleDeleteResolution}
        />
      )}

      {/* Quest Cleared Celebration Modal */}
      {completedQuest && (
        <QuestCompleteModal
          quest={completedQuest}
          onClose={() => setCompletedQuest(null)}
        />
      )}

      {/* Level Up Promotion Modal */}
      {levelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="hud-card w-full max-w-sm p-6 sm:p-8 relative animate-pixel-pop text-center">
            <div className="w-14 h-14 metallic-badge rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>

            <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider block mb-1">
              LEVEL PROMOTION UNLOCKED
            </span>

            <h2 className="font-pixel text-base text-[var(--text-heading)] mb-2">
              LEVEL UP!
            </h2>

            <p className="font-mono text-xs text-[var(--text-body)] mb-4 leading-relaxed">
              Your dedication upgraded your character from Level {levelUpModal.oldLevel} to Level {levelUpModal.newLevel}.
            </p>

            <div className="bg-[var(--surface-raised)] border border-[var(--border-bright)] p-3 rounded-lg font-pixel text-xs text-[var(--accent-green)] mb-5">
              +1 PROFILE LEVEL ACHIEVED
            </div>

            <button
              onClick={() => setLevelUpModal(null)}
              className="pixel-btn-green w-full py-3 text-xs font-pixel"
            >
              KEEP UPGRADING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
