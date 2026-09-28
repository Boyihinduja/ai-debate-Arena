import React from 'react';
import { useDebate, AppView } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  Swords,
  LayoutDashboard,
  Compass,
  History,
  TrendingUp,
  User,
  Volume2,
  VolumeX,
  PlusCircle,
  LogIn,
  LogOut,
  Flame,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    soundEnabled,
    setSoundEnabled,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
  } = useDebate();

  const handleNav = (view: AppView) => {
    soundFx.playClick();
    setCurrentView(view);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      setTimeout(() => soundFx.playClick(), 50);
    }
  };

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { view: 'topics', label: 'Topics', icon: <Compass className="w-4 h-4" /> },
    { view: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { view: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#05070e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-3 group text-left transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/25 transition-all">
            <div className="w-full h-full bg-[#070b18] rounded-[11px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                AI DEBATE ARENA
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 font-semibold tracking-wider">
                V2.4
              </span>
            </div>
          </div>
        </button>

        {/* Center Navigation Links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 shadow-sm shadow-cyan-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Arena SFX' : 'Enable Arena SFX'}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Start Debate Fast CTA */}
          <button
            onClick={() => handleNav('start')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Debate</span>
          </button>

          {/* User Profile or Guest Pill */}
          {user.isGuest ? (
            <button
              onClick={() => {
                soundFx.playClick();
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:border-slate-500 text-xs text-slate-300 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-lg border border-white/5 hover:border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/80 transition-all text-left"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-7 h-7 rounded-full object-cover border border-cyan-500/40"
                />
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {user.username}
                  </div>
                  <div className="text-[10px] text-cyan-400/80 font-mono flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-amber-400" />
                    {user.currentStreak} Streak
                  </div>
                </div>
              </button>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
