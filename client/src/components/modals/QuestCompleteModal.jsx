import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles } from 'lucide-react';
import PixelProgressBar from '../PixelProgressBar';

export default function QuestCompleteModal({ quest, onClose }) {
  useEffect(() => {
    // Fire pixelated / retro multi-burst confetti
    try {
      const end = Date.now() + 1200;
      const colors = ['#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          shapes: ['square'],
          scalar: 1.2
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          shapes: ['square'],
          scalar: 1.2
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.error('Confetti trigger error:', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pixel-dark/70 backdrop-blur-xs">
      <div className="bg-white border-3 border-pixel-dark w-full max-w-sm p-6 sm:p-8 shadow-[8px_8px_0_0_#18181B] relative animate-pixel-pop text-center">
        {/* Stars Header */}
        <div className="flex items-center justify-center gap-2 mb-3 text-amber-500">
          <Star className="w-5 h-5 fill-amber-400 text-pixel-dark" />
          <Star className="w-7 h-7 fill-amber-400 text-pixel-dark scale-110" />
          <Star className="w-5 h-5 fill-amber-400 text-pixel-dark" />
        </div>

        {/* Title */}
        <h2 className="font-pixel text-sm sm:text-base text-pixel-dark uppercase tracking-wider mb-3 leading-snug">
          QUEST COMPLETE!
        </h2>

        {/* Quest Title */}
        <div className="bg-amber-50 border-2 border-pixel-dark p-3 mb-4 shadow-[2px_2px_0_0_#18181B]">
          <p className="font-bold text-base text-pixel-dark">
            {quest?.title || 'Victory!'}
          </p>
          <span className="font-mono text-xs text-zinc-500 block mt-0.5">
            {quest?.goal_value} / {quest?.goal_value} {quest?.unit || '%'}
          </span>
        </div>

        {/* 100% Progress Bar */}
        <div className="mb-4">
          <PixelProgressBar
            value={100}
            max={100}
            showLabel={false}
            height="h-5"
            colorScheme="emerald"
          />
        </div>

        {/* XP Bonus Badge */}
        <div className="inline-flex items-center gap-1.5 bg-pixel-purple/15 text-purple-900 border-2 border-pixel-dark px-4 py-1.5 font-pixel text-xs shadow-[2px_2px_0_0_#18181B] mb-6">
          <Sparkles className="w-4 h-4 text-purple-600" />
          +100 XP GAINED!
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onClose}
            className="pixel-btn w-full bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-3 px-6 shadow-[4px_4px_0_0_#18181B]"
          >
            [ Awesome! ]
          </button>
        </div>
      </div>
    </div>
  );
}
