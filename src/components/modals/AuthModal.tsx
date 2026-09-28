import React, { useState } from 'react';
import { useDebate } from '../../context/DebateContext';
import { soundFx } from '../../utils/audio';
import { X, Lock, Mail, User, Shield, Sparkles, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginAsGuest,
    loginAsUser,
  } = useDebate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (authMode === 'login') {
      loginAsUser(username || 'Alex Vance', email || 'alex.vance@arena.intellect');
    } else {
      loginAsUser(username || 'New Debater', email || 'debater@arena.intellect');
    }
  };

  const handleGuest = () => {
    soundFx.playClick();
    loginAsGuest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#090d1a] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setIsAuthModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-white">
            {authMode === 'login' ? 'Enter the Arena' : 'Forge Your Arena Identity'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login'
              ? 'Access your debate history, logic analytics, and rank.'
              : 'Join competitive intellectual sparring with adaptive AI.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username / Call-sign
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SocraticBlade"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="debater@arena.intellect"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{authMode === 'login' ? 'Continue' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
            }}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {authMode === 'login'
              ? "Don't have an account? Create an account"
              : 'Already have an identity? Continue with Login'}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-[#090d1a] px-3 text-slate-500 font-mono tracking-wider">
              OR TEST INSTANTLY
            </span>
          </div>
        </div>

        {/* Continue as Guest */}
        <button
          onClick={handleGuest}
          className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/40 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Continue as Guest</span>
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-2">
          Guests can experience complete debate rounds without signing up.
        </p>
      </div>
    </div>
  );
};
