import React, { useState } from 'react';
import ResolutionCard from './ResolutionCard';
import { Plus, Filter, Swords, CheckCircle2, Flame, Search } from 'lucide-react';

export default function ResolutionsView({
  resolutions = [],
  loading,
  onOpenNew,
  onOpenUpdate,
  onOpenDelete,
  onQuickAdjust
}) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResolutions = resolutions.filter(res => {
    if (statusFilter === 'active' && res.status !== 'active') return false;
    if (statusFilter === 'completed' && res.status !== 'completed') return false;
    if (categoryFilter !== 'all' && (res.category || 'Personal').toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title?.toLowerCase().includes(q);
      const matchWhy = res.why?.toLowerCase().includes(q);
      const matchDesc = res.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchWhy && !matchDesc) return false;
    }
    return true;
  });

  const activeCount = resolutions.filter(r => r.status === 'active').length;
  const completedCount = resolutions.filter(r => r.status === 'completed').length;

  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[var(--accent-green)] text-xs">◆</span>
            <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider">
              QUEST LOG
            </span>
          </div>
          <h1 className="font-pixel text-base sm:text-xl text-[var(--text-heading)]">
            Resolutions & Quests
          </h1>
          <p className="font-mono text-xs text-[var(--text-dim)]">
            {activeCount} active • {completedCount} cleared • {resolutions.length} total
          </p>
        </div>

        <button
          onClick={onOpenNew}
          className="pixel-btn-green px-5 py-3 text-xs flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEW RESOLUTION</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="hud-card p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${resolutions.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'completed', label: `Cleared (${completedCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'metallic-badge border-[var(--border-bright)]'
                  : 'bg-[var(--surface-raised)] text-[var(--text-dim)] hover:text-[var(--text-heading)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category & Search Input */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="hud-input px-2.5 py-1.5 text-xs rounded bg-[var(--surface-raised)] font-mono"
          >
            <option value="all">All Categories</option>
            <option value="Learning">Learning</option>
            <option value="Health">Health</option>
            <option value="Fitness">Fitness</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="hud-input w-full pl-8 pr-3 py-1.5 text-xs rounded"
            />
          </div>
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[var(--text-dim)]">
          Scanning quest logs...
        </div>
      ) : filteredResolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResolutions.map((res) => (
            <ResolutionCard
              key={res.id}
              resolution={res}
              onOpenUpdate={onOpenUpdate}
              onOpenDelete={onOpenDelete}
              onQuickAdjust={onQuickAdjust}
            />
          ))}
        </div>
      ) : (
        /* Empty State per Ui.md section 29 */
        <div className="hud-card p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 metallic-badge rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚔️
          </div>
          <h3 className="font-pixel text-sm text-[var(--text-heading)] mb-2 uppercase">
            {resolutions.length === 0 ? 'NO ACTIVE QUESTS' : 'NO MATCHING QUESTS'}
          </h3>
          <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
            {resolutions.length === 0
              ? 'Your next upgrade starts with one resolution. Break it down into bites, track your progress, and earn XP.'
              : 'Try changing your filter settings or search terms.'}
          </p>
          <button
            onClick={onOpenNew}
            className="pixel-btn-green py-3 px-6 text-xs flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE YOUR FIRST QUEST</span>
          </button>
        </div>
      )}
    </div>
  );
}
