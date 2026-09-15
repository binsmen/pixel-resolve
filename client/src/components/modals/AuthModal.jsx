import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Swords } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState(''); // for login (email or username)

  const [usernameStatus, setUsernameStatus] = useState(null); // { checking: boolean, available: boolean, error?: string }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleCheckUsername = async (val) => {
    const trimmed = val.trim();
    if (!trimmed || trimmed.length < 3) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus({ checking: true });
    try {
      const res = await api.auth.checkUsername(trimmed);
      if (res.available) {
        setUsernameStatus({ checking: false, available: true });
      } else {
        setUsernameStatus({ checking: false, available: false, error: res.reason || 'Username taken' });
      }
    } catch (err) {
      setUsernameStatus({ checking: false, available: false, error: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your player name');
        if (!email.trim()) throw new Error('Please enter your email address');

        // Check for placeholder domains
        if (email.toLowerCase().includes('@example.') || email.toLowerCase().includes('@test.')) {
          throw new Error('Please enter a real, valid email address (e.g. yourname@gmail.com). Placeholder domains are rejected.');
        }

        if (!username.trim()) throw new Error('Please choose a unique username');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        await signup(name.trim(), email.trim(), username.trim(), password);
      } else {
        const loginId = identifier || email;
        if (!loginId.trim() || !password) throw new Error('Please enter your username/email and password');
        await login(loginId.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="hud-card w-full max-w-md p-6 relative animate-pixel-pop overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--text-dim)] hover:text-[var(--text-heading)] rounded"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-[var(--border-subtle)] mb-6 -mx-6 px-6 pt-1">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`font-pixel text-xs pb-3 mr-6 tracking-tight transition-all ${
              mode === 'login'
                ? 'text-[var(--text-heading)] border-b-2 border-[var(--accent-green)] font-bold'
                : 'text-[var(--text-dim)] hover:text-[var(--text-heading)]'
            }`}
          >
            LOG IN
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`font-pixel text-xs pb-3 tracking-tight transition-all ${
              mode === 'signup'
                ? 'text-[var(--text-heading)] border-b-2 border-[var(--accent-green)] font-bold'
                : 'text-[var(--text-dim)] hover:text-[var(--text-heading)]'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 p-3 flex items-start gap-2.5 rounded">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400 font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' ? (
            <>
              {/* Display Name */}
              <div>
                <label className="block text-[9px] font-pixel text-[var(--text-heading)] mb-1 uppercase">
                  Player Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Drake"
                  required
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                />
              </div>

              {/* Unique Username */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-pixel text-[var(--text-heading)] uppercase">
                    Unique Username
                  </label>
                  {usernameStatus?.checking && (
                    <span className="text-[10px] font-mono text-[var(--text-dim)]">Checking...</span>
                  )}
                  {usernameStatus?.available && (
                    <span className="text-[10px] font-mono text-emerald-400">✓ Unique</span>
                  )}
                  {usernameStatus?.error && (
                    <span className="text-[10px] font-mono text-red-400">✗ {usernameStatus.error}</span>
                  )}
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleCheckUsername(e.target.value);
                  }}
                  placeholder="e.g. alex_questmaster"
                  required
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                />
                <span className="text-[10px] font-mono text-[var(--text-dim)] mt-0.5 block">
                  3-20 characters, lowercase letters, numbers, underscores.
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[9px] font-pixel text-[var(--text-heading)] mb-1 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="hud-input w-full px-3 py-2 text-xs rounded"
                />
                <span className="text-[10px] font-mono text-[var(--text-dim)] mt-0.5 block">
                  Please use a valid inbox. Placeholder emails are rejected.
                </span>
              </div>
            </>
          ) : (
            /* Login Identifier (Username or Email) */
            <div>
              <label className="block text-[9px] font-pixel text-[var(--text-heading)] mb-1 uppercase">
                Username or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username or email..."
                required
                className="hud-input w-full px-3 py-2 text-xs rounded"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-[9px] font-pixel text-[var(--text-heading)] mb-1 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="hud-input w-full px-3 py-2 text-xs rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (mode === 'signup' && usernameStatus?.available === false)}
            className="pixel-btn-green w-full py-3 text-xs mt-2 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : mode === 'signup' ? 'FORGE ACCOUNT & SETUP PROFILE' : 'ENTER REALM'}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-[var(--text-dim)] mt-5">
          {mode === 'signup' ? (
            <>
              Already have an adventurer account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="underline text-[var(--text-heading)] font-bold"
              >
                Log In
              </button>
            </>
          ) : (
            <>
              Need a personal quest log?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="underline text-[var(--text-heading)] font-bold"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
