import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your player name');
        if (!email.trim()) throw new Error('Please enter your email');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signup(name, email, password);
      } else {
        if (!email.trim() || !password) throw new Error('Please enter your email and password');
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pixel-dark/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-pixel-dark w-full max-w-md p-6 shadow-[6px_6px_0_0_#18181B] relative animate-pixel-pop">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-zinc-100 border border-pixel-dark"
          title="Close"
        >
          <X className="w-4 h-4 text-pixel-dark" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b-2 border-pixel-dark mb-6 -mx-6 px-6 pt-1">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`font-pixel text-xs pb-3 mr-6 tracking-tight ${
              mode === 'login'
                ? 'text-pixel-dark border-b-4 border-pixel-green -mb-[2px] font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            LOG IN
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`font-pixel text-xs pb-3 tracking-tight ${
              mode === 'signup'
                ? 'text-pixel-dark border-b-4 border-pixel-green -mb-[2px] font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-500 p-2.5 flex items-start gap-2 shadow-[2px_2px_0_0_#EF4444]">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                Player Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PixelHero"
                required
                className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@example.com"
              required
              className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="pixel-input w-full px-3 py-2 text-sm text-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pixel-btn w-full bg-pixel-green hover:bg-emerald-400 text-white font-pixel text-xs py-3 px-4 shadow-[4px_4px_0_0_#18181B] mt-2 disabled:opacity-50"
          >
            {loading ? 'PLEASE WAIT...' : mode === 'signup' ? 'CREATE ACCOUNT' : 'ENTER REALM'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-4">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="font-bold underline text-pixel-dark"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Need a quest log?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="font-bold underline text-pixel-dark"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
