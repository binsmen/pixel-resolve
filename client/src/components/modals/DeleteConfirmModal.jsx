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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pixel-dark/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-pixel-dark w-full max-w-sm p-6 shadow-[6px_6px_0_0_#18181B] relative animate-pixel-pop text-center">
        <div className="w-12 h-12 bg-red-100 border-2 border-pixel-dark flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_0_#18181B]">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <h3 className="font-pixel text-xs text-pixel-dark uppercase tracking-wide mb-2">
          ABANDON QUEST?
        </h3>

        <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
          Are you sure you want to delete <strong className="text-pixel-dark font-bold">"{resolution.title}"</strong>?
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="pixel-btn bg-red-600 hover:bg-red-500 text-white font-pixel text-xs py-2 px-4 shadow-[3px_3px_0_0_#18181B] disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {loading ? 'DELETING...' : 'DELETE'}
          </button>
        </div>
      </div>
    </div>
  );
}
