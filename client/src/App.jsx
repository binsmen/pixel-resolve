import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import StatsOverview from './components/StatsOverview';
import ResolutionCard from './components/ResolutionCard';
import EmptyState from './components/EmptyState';
import AuthModal from './components/modals/AuthModal';
import NewResolutionModal from './components/modals/NewResolutionModal';
import UpdateProgressModal from './components/modals/UpdateProgressModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import QuestCompleteModal from './components/modals/QuestCompleteModal';
import { Plus, Filter, Sparkles, Swords } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, updateUserStats } = useAuth();

  const [resolutions, setResolutions] = useState([]);
  const [loadingResolutions, setLoadingResolutions] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Modals state
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [showNewModal, setShowNewModal] = useState(false);
  const [updatingResolution, setUpdatingResolution] = useState(null);
  const [deletingResolution, setDeletingResolution] = useState(null);
  const [completedQuest, setCompletedQuest] = useState(null);

  // Floating XP toast notification
  const [xpToast, setXpToast] = useState(null);

  const triggerXpToast = (xp) => {
    if (!xp) return;
    setXpToast(`+${xp} XP!`);
    setTimeout(() => {
      setXpToast(null);
    }, 2500);
  };

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

  // Filtered list
  const filteredResolutions = resolutions.filter((r) => {
    if (filter === 'active') return r.status === 'active';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pixel-bg">
        <div className="w-10 h-10 bg-pixel-amber border-2 border-pixel-dark flex items-center justify-center shadow-[3px_3px_0_0_#18181B] mb-4 animate-bounce">
          <Swords className="w-5 h-5 text-pixel-dark" />
        </div>
        <p className="font-pixel text-xs text-pixel-dark tracking-wider uppercase">
          LOADING QUEST LOG...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!user ? (
          /* Public Landing Page */
          <LandingHero
            onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
          />
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Stats Header */}
            <StatsOverview resolutions={resolutions} user={user} />

            {/* Quests Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-pixel text-sm sm:text-base text-pixel-dark tracking-tight uppercase flex items-center gap-2">
                  <Swords className="w-4 h-4 text-pixel-dark" />
                  MY RESOLUTIONS
                </h1>
                <span className="font-mono text-xs text-zinc-500">
                  {resolutions.length} active quests in progress
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Filter Pills */}
                <div className="flex items-center bg-zinc-100 p-1 border border-pixel-dark shadow-[2px_2px_0_0_#18181B]">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 text-xs font-semibold ${
                      filter === 'all'
                        ? 'bg-white text-pixel-dark border border-pixel-dark shadow-[1px_1px_0_0_#18181B] font-bold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    All ({resolutions.length})
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-2.5 py-1 text-xs font-semibold ${
                      filter === 'active'
                        ? 'bg-white text-pixel-dark border border-pixel-dark shadow-[1px_1px_0_0_#18181B] font-bold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Active ({resolutions.filter((r) => r.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-2.5 py-1 text-xs font-semibold ${
                      filter === 'completed'
                        ? 'bg-white text-pixel-dark border border-pixel-dark shadow-[1px_1px_0_0_#18181B] font-bold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Done ({resolutions.filter((r) => r.status === 'completed').length})
                  </button>
                </div>

                {/* New Resolution CTA */}
                <button
                  onClick={() => setShowNewModal(true)}
                  className="pixel-btn bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-2 px-3.5 shadow-[3px_3px_0_0_#18181B] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + NEW RESOLUTION
                </button>
              </div>
            </div>

            {/* Quests Content */}
            {loadingResolutions ? (
              <div className="text-center py-16">
                <p className="font-pixel text-xs text-zinc-500 tracking-wider">
                  CHECKING QUEST BOARD...
                </p>
              </div>
            ) : resolutions.length === 0 ? (
              <EmptyState onOpenNew={() => setShowNewModal(true)} />
            ) : filteredResolutions.length === 0 ? (
              <div className="bg-white border-2 border-pixel-dark p-8 text-center shadow-[4px_4px_0_0_#18181B] max-w-md mx-auto my-8">
                <p className="font-pixel text-xs text-zinc-600 uppercase mb-2">
                  No {filter} resolutions found
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="pixel-btn bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700"
                >
                  Show All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredResolutions.map((res) => (
                  <ResolutionCard
                    key={res.id}
                    resolution={res}
                    onOpenUpdate={(r) => setUpdatingResolution(r)}
                    onOpenDelete={(r) => setDeletingResolution(r)}
                    onQuickAdjust={handleQuickAdjust}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-pixel-dark bg-white py-4 px-4 text-center mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-pixel-dark">PIXELRESOLVE</span>
            <span>•</span>
            <span>Personal Goal RPG Tracker</span>
          </div>
          <div className="font-mono text-[11px]">
            Keep leveling up every day ⚔️
          </div>
        </div>
      </footer>

      {/* XP Floating Toast */}
      {xpToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className="bg-pixel-purple text-white font-pixel text-xs px-4 py-2 border-2 border-pixel-dark shadow-[4px_4px_0_0_#18181B] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {xpToast}
          </div>
        </div>
      )}

      {/* Modals */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
        />
      )}

      {showNewModal && (
        <NewResolutionModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreateResolution}
        />
      )}

      {updatingResolution && (
        <UpdateProgressModal
          resolution={updatingResolution}
          onClose={() => setUpdatingResolution(null)}
          onSave={handleUpdateProgress}
        />
      )}

      {deletingResolution && (
        <DeleteConfirmModal
          resolution={deletingResolution}
          onClose={() => setDeletingResolution(null)}
          onConfirm={handleDeleteResolution}
        />
      )}

      {completedQuest && (
        <QuestCompleteModal
          quest={completedQuest}
          onClose={() => setCompletedQuest(null)}
        />
      )}
    </div>
  );
}
