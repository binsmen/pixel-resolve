import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, ShieldAlert, Swords } from 'lucide-react';
import PixelProgressBar from './PixelProgressBar';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();

  // XP within current level (100 XP per level)
  const currentLevelXp = user ? (user.xp % 100) : 0;
  const xpNeeded = 100;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-pixel-dark px-4 sm:px-6 py-3 shadow-[0_2px_0_0_#18181B]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-8 h-8 bg-pixel-amber border-2 border-pixel-dark flex items-center justify-center shadow-[2px_2px_0_0_#18181B]">
            <Swords className="w-4 h-4 text-pixel-dark" />
          </div>
          <div>
            <span className="font-pixel text-xs sm:text-sm tracking-tight text-pixel-dark uppercase block">
              PixelResolve
            </span>
            <span className="font-mono text-[9px] text-zinc-500 hidden sm:block">
              mini quests • real goals
            </span>
          </div>
        </div>

        {/* User Info or Auth Buttons */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Player Level & XP Gauge */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-zinc-600">
                  Hi, <strong className="text-pixel-dark">{user.name}</strong> 👋
                </span>
                <span className="bg-pixel-purple/15 text-purple-800 text-[10px] font-pixel px-2 py-0.5 border border-pixel-dark shadow-[1px_1px_0_0_#18181B]">
                  LVL {user.level}
                </span>
              </div>
              <div className="flex items-center gap-2 w-36">
                <PixelProgressBar
                  value={currentLevelXp}
                  max={xpNeeded}
                  showLabel={false}
                  height="h-3.5"
                  colorScheme="purple"
                />
                <span className="font-mono text-[9px] font-bold text-zinc-600 whitespace-nowrap">
                  {currentLevelXp}/{xpNeeded} XP
                </span>
              </div>
            </div>

            {/* Mobile Level Pill */}
            <div className="sm:hidden flex items-center gap-1.5">
              <span className="bg-pixel-purple/15 text-purple-800 text-[9px] font-pixel px-1.5 py-0.5 border border-pixel-dark">
                LVL {user.level}
              </span>
              <span className="font-mono text-[10px] font-bold text-zinc-600">
                {user.xp} XP
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="pixel-btn bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold flex items-center gap-1.5 text-zinc-700"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="pixel-btn bg-white hover:bg-zinc-50 px-3 py-1.5 text-xs font-bold text-pixel-dark"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="pixel-btn bg-pixel-green hover:bg-emerald-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-[3px_3px_0_0_#18181B]"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
