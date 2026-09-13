import React from 'react';

export default function PixelProgressBar({
  value = 0,
  max = 100,
  showLabel = true,
  height = 'h-6',
  colorScheme = 'auto', // 'auto' | 'emerald' | 'amber' | 'purple'
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  let barBg = 'bg-pixel-green';
  if (colorScheme === 'auto') {
    if (percentage >= 100) {
      barBg = 'bg-emerald-500';
    } else if (percentage >= 50) {
      barBg = 'bg-teal-500';
    } else if (percentage >= 25) {
      barBg = 'bg-amber-400';
    } else {
      barBg = 'bg-rose-400';
    }
  } else if (colorScheme === 'emerald') {
    barBg = 'bg-emerald-500';
  } else if (colorScheme === 'amber') {
    barBg = 'bg-amber-400';
  } else if (colorScheme === 'purple') {
    barBg = 'bg-purple-500';
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-zinc-100 border-2 border-pixel-dark p-[2px] relative overflow-hidden flex items-center`}>
        {/* Pixel strip background texture */}
        <div
          className={`h-full ${barBg} transition-all duration-300 relative border-r-2 border-pixel-dark`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle 8-bit highlight shine */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/40"></div>
        </div>

        {/* Center label if needed */}
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-pixel text-[10px] text-pixel-dark tracking-tighter drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] font-bold">
              {percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
