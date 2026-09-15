import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ resolution, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(resolution.id);
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-sm p-6 relative animate-pixel-pop text-center">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/40 rounded-xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <h3 className="font-pixel text-xs text-red-400 uppercase tracking-wider mb-2">
          ABANDON QUEST?
        </h3>

        <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
          Are you sure you want to abandon and delete <strong className="text-[var(--text-heading)]">"{resolution.title}"</strong>?
          This quest and its record will be permanently removed.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn-secondary py-2 px-4 text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-pixel text-xs rounded border border-red-700 shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'ABANDONING...' : 'CONFIRM DELETE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
