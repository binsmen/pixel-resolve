import React from 'react';
import { Plus, Sparkles, Scroll } from 'lucide-react';

export default function EmptyState({ onOpenNew }) {
  return (
    <div className="bg-white border-2 border-pixel-dark p-8 sm:p-12 text-center shadow-[6px_6px_0_0_#18181B] max-w-lg mx-auto my-6">
      {/* 8-bit star / sparkle icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 border-2 border-pixel-dark shadow-[3px_3px_0_0_#18181B] mb-5 text-2xl">
        ⚔️
      </div>

      <div className="text-amber-500 font-pixel text-xs mb-2 tracking-wider">
        ✦ ✦ ✦
      </div>

      <h2 className="font-pixel text-sm sm:text-base text-pixel-dark tracking-wide uppercase mb-3">
        YOUR QUEST BOARD IS EMPTY
      </h2>

      <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-2 leading-relaxed">
        You haven't created any resolutions yet.
      </p>

      <p className="text-zinc-500 text-xs max-w-xs mx-auto mb-7">
        Turn your personal goals into bite-sized quests and start earning XP today!
      </p>

      <button
        onClick={onOpenNew}
        className="pixel-btn bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-3 px-6 inline-flex items-center gap-2 shadow-[4px_4px_0_0_#18181B]"
      >
        <Plus className="w-4 h-4" />
        + CREATE RESOLUTION
      </button>
    </div>
  );
}
