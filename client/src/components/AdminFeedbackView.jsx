import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Crown, Shield, Filter, Check, Clock, AlertTriangle, MessageSquare, Edit } from 'lucide-react';

export default function AdminFeedbackView() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, new: 0, reviewing: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Edit fields for selected item
  const [editStatus, setEditStatus] = useState('New');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAdminFeedback = async () => {
    setLoading(true);
    try {
      const data = await api.feedback.getAdminList();
      setFeedbackList(data.feedback || []);
      setMetrics(data.metrics || { total: 0, new: 0, reviewing: 0, inProgress: 0, resolved: 0 });
      if (data.feedback?.length > 0 && !selectedItem) {
        setSelectedItem(data.feedback[0]);
        setEditStatus(data.feedback[0].status);
        setEditPriority(data.feedback[0].priority || 'Medium');
        setEditNote(data.feedback[0].internal_note || '');
      }
    } catch (err) {
      console.error('Failed to load admin feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminFeedback();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditPriority(item.priority || 'Medium');
    setEditNote(item.internal_note || '');
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaving(true);
    try {
      const res = await api.feedback.updateAdmin(selectedItem.id, {
        status: editStatus,
        priority: editPriority,
        internal_note: editNote
      });

      if (res.feedback) {
        setSelectedItem(res.feedback);
        setFeedbackList(prev => prev.map(f => f.id === res.feedback.id ? res.feedback : f));
        fetchAdminFeedback();
      }
    } catch (err) {
      console.error('Failed to update feedback item:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = feedbackList.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="relative z-10 py-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* VIP / Admin Banner */}
      <div className="hud-card p-6 mb-8 border-amber-500/40 bg-amber-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl metallic-badge flex items-center justify-center text-amber-400 border-2 border-amber-500/40 shadow-sm">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-pixel text-base sm:text-lg text-[var(--text-heading)]">
                  VIP / DEV DISPATCH CONSOLE
                </h1>
                <span className="font-pixel text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
                  MOCK ROLE
                </span>
              </div>
              <p className="font-mono text-xs text-[var(--text-body)]">
                Review user suggestions, update resolution triage states, and record internal developer notes.
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-[var(--text-dim)]">
            <span>Modular DB & Auth Architecture Ready</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="hud-card p-4 text-center">
          <span className="font-pixel text-xl text-[var(--text-heading)] block mb-1">
            {metrics.total}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
            Total Inquiries
          </span>
        </div>
        <div className="hud-card p-4 text-center">
          <span className="font-pixel text-xl text-blue-400 block mb-1">
            {metrics.new}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
            New Dispatches
          </span>
        </div>
        <div className="hud-card p-4 text-center">
          <span className="font-pixel text-xl text-amber-400 block mb-1">
            {metrics.inProgress + metrics.reviewing}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
            In Progress
          </span>
        </div>
        <div className="hud-card p-4 text-center">
          <span className="font-pixel text-xl text-[var(--accent-green)] block mb-1">
            {metrics.resolved}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">
            Resolved
          </span>
        </div>
      </div>

      {/* Main Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feedback List & Filter */}
        <div className="lg:col-span-5">
          <div className="hud-card p-5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-4 pb-3 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
              {['all', 'new', 'reviewing', 'in progress', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono capitalize whitespace-nowrap transition-all ${
                    filterStatus === st
                      ? 'metallic-badge border-[var(--border-bright)]'
                      : 'bg-[var(--surface-raised)] text-[var(--text-dim)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-[var(--text-dim)]">
                Loading console transmissions...
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  let stPill = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (item.status === 'Resolved') stPill = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  if (item.status === 'In Progress') stPill = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--accent-green)] bg-[var(--surface-raised)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--border-bright)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-pixel text-[9px] text-[var(--text-heading)] truncate">
                          {item.type}
                        </span>
                        <span className={`font-pixel text-[8px] px-1.5 py-0.5 rounded border ${stPill}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="font-mono font-bold text-xs text-[var(--text-heading)] mb-1 truncate">
                        {item.subject}
                      </h4>
                      <p className="font-mono text-[11px] text-[var(--text-dim)] line-clamp-1 mb-2">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-dim)]">
                        <span>@{item.username || 'user'}</span>
                        <span>Priority: {item.priority || 'Medium'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-[var(--text-dim)]">
                No items match filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Feedback Details & Actions */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="hud-card p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                <div>
                  <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase">
                    ITEM #{selectedItem.id} • {selectedItem.type}
                  </span>
                  <h3 className="font-pixel text-sm text-[var(--text-heading)] mt-0.5">
                    {selectedItem.subject}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-amber-400 block">
                    {'★'.repeat(selectedItem.rating || 5)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-dim)]">
                    {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleString() : ''}
                  </span>
                </div>
              </div>

              {/* Sender Details */}
              <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-3 rounded-lg text-xs font-mono mb-4 flex justify-between">
                <div>
                  <span className="text-[var(--text-dim)]">From: </span>
                  <strong className="text-[var(--text-heading)]">@{selectedItem.username || 'user'}</strong>
                  {selectedItem.email && <span className="text-[var(--text-dim)] ml-1">({selectedItem.email})</span>}
                </div>
                <div>
                  <span className="text-[var(--text-dim)]">Current Status: </span>
                  <strong className="text-[var(--accent-green)]">{selectedItem.status}</strong>
                </div>
              </div>

              {/* Full Message */}
              <div className="mb-6">
                <label className="block font-pixel text-[9px] text-[var(--text-dim)] mb-1 uppercase">
                  User Message
                </label>
                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-heading)] leading-relaxed whitespace-pre-wrap">
                  {selectedItem.message}
                </div>
              </div>

              {/* Admin Moderation Controls Form */}
              <form onSubmit={handleUpdateFeedback} className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                <h4 className="font-pixel text-[10px] text-[var(--text-heading)] uppercase">
                  Triage & Moderator Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                      Update Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="hud-input w-full px-3 py-2 text-xs rounded"
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div>
                    <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                      Update Priority
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="hud-input w-full px-3 py-2 text-xs rounded"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Internal Developer Note */}
                <div>
                  <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                    Internal Developer / Team Note
                  </label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={2}
                    placeholder="Add an internal note (e.g. Added to backlog sprint #4)..."
                    className="hud-input w-full px-3 py-2 text-xs rounded"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="pixel-btn-green px-5 py-2.5 text-xs flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{saving ? 'SAVING...' : 'SAVE TRIAGE UPDATE'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hud-card p-12 text-center text-xs font-mono text-[var(--text-dim)]">
              Select an inquiry on the left to view details and update triage status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
