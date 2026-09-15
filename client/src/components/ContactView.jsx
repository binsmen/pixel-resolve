import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MessageSquare, Send, CheckCircle2, Star, Clock, AlertCircle } from 'lucide-react';

const FEEDBACK_TYPES = [
  'Bug',
  'Feature Request',
  'Improvement',
  'General Feedback',
  'Other'
];

export default function ContactView() {
  const { user } = useAuth();

  const [type, setType] = useState('Feature Request');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [myFeedbackList, setMyFeedbackList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchMyFeedback = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const data = await api.feedback.getMy();
      setMyFeedbackList(data.feedback || []);
    } catch (err) {
      console.error('Failed to load my feedback:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!subject.trim()) {
      setErrorMsg('Please enter a subject');
      return;
    }

    if (!message.trim()) {
      setErrorMsg('Please enter your feedback message');
      return;
    }

    setLoading(true);
    try {
      const res = await api.feedback.submit({
        type,
        subject: subject.trim(),
        message: message.trim(),
        rating
      });

      setSuccessMsg(res.message || 'Feedback submitted successfully! Thank you for helping build PixelResolve.');
      setSubject('');
      setMessage('');
      setRating(5);
      fetchMyFeedback();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="hud-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--accent-green)] text-xs">◆</span>
              <span className="font-pixel text-[9px] text-[var(--accent-green)] uppercase tracking-wider">
                TRANSMISSION CHANNEL
              </span>
            </div>

            <h1 className="font-pixel text-base sm:text-lg text-[var(--text-heading)] mb-2">
              Contact Us & Feedback
            </h1>
            <p className="font-mono text-xs text-[var(--text-body)] mb-6 leading-relaxed">
              Have a bug to report, a feature request, or an idea to level up PixelResolve? Send a dispatch directly to our development team.
            </p>

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feedback Type Selection */}
              <div>
                <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-2 uppercase">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-2 px-2.5 rounded-md text-[11px] font-mono border transition-all text-left ${
                        type === t
                          ? 'metallic-badge border-[var(--accent-green)] font-bold'
                          : 'bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[var(--border-bright)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Add weekly recurring habit reminders"
                  className="hud-input w-full px-3.5 py-2.5 rounded-lg text-xs"
                  required
                />
              </div>

              {/* Rating (1 to 5 Stars) */}
              <div>
                <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                  App Satisfaction Rating
                </label>
                <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-2 rounded-lg w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 text-base transition-transform hover:scale-110 ${
                        star <= rating ? 'text-amber-400' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="font-mono text-xs text-[var(--text-dim)] ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-pixel text-[9px] text-[var(--text-heading)] mb-1 uppercase">
                  Message Details
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Explain what happened, what you'd love to see, or any thoughts..."
                  className="hud-input w-full px-3.5 py-2.5 rounded-lg text-xs"
                  required
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="pixel-btn-green w-full py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'SENDING TRANSMISSION...' : 'SUBMIT FEEDBACK DISPATCH'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: User's Past Submissions History */}
        <div className="lg:col-span-5">
          <div className="hud-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-dim)]" />
                <h3 className="font-pixel text-xs text-[var(--text-heading)] uppercase">
                  Your Past Dispatches
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--text-dim)]">
                {myFeedbackList.length} items
              </span>
            </div>

            {loadingHistory ? (
              <div className="text-center py-8 text-xs font-mono text-[var(--text-dim)]">
                Loading dispatches...
              </div>
            ) : myFeedbackList.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myFeedbackList.map((item) => {
                  let statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (item.status === 'Resolved') statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  if (item.status === 'In Progress') statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-pixel text-[9px] text-[var(--text-heading)] truncate">
                          {item.type}
                        </span>
                        <span className={`font-pixel text-[8px] px-2 py-0.5 rounded border ${statusColor}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="font-mono font-bold text-[var(--text-heading)] mb-1">
                        {item.subject}
                      </h4>
                      <p className="font-mono text-xs text-[var(--text-body)] line-clamp-2 mb-2">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-dim)] pt-2 border-t border-[var(--border-subtle)]">
                        <span>Submitted {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}</span>
                        <span>Priority: {item.priority || 'Medium'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-[var(--border-subtle)] rounded-lg">
                <MessageSquare className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-2 opacity-50" />
                <p className="font-mono text-xs text-[var(--text-dim)]">
                  No feedback submitted yet. Your voice shapes future upgrades!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
