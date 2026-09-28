import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  User,
  Flame,
  Award,
  Brain,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Zap,
  Repeat,
  Sword,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser, showToast } = useDebate();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.username);

  const handleSaveProfile = () => {
    soundFx.playClick();
    setUser((prev) => ({
      ...prev,
      username: nameInput.trim() || prev.username,
    }));
    setIsEditing(false);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: `Your call-sign is now ${nameInput.trim() || user.username}.`,
    });
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sword':
        return <Sword className="w-5 h-5 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-rose-400" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-violet-400" />;
      default:
        return <Award className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-10">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 radial-glow-cyan pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-950/50"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 text-black">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 bg-slate-900 border border-cyan-500 rounded-lg text-white font-heading font-bold text-xl"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="p-1.5 rounded-lg bg-cyan-500 text-black"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                      {user.username}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-slate-500 hover:text-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs font-mono text-cyan-300 font-semibold tracking-wide">
                {user.rank}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {user.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Streak</div>
              <div className="font-heading font-extrabold text-xl text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{user.currentStreak}d</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Debates</div>
              <div className="font-heading font-extrabold text-xl text-white">
                {user.debatesCompleted}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Avg Logic</div>
              <div className="font-heading font-extrabold text-xl text-cyan-400">
                {user.averageLogicScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Profile & Favorite Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest & Weakest Reasoning Skill */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>Forensic Reasoning Assessment</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                Strongest Reasoning Skill
              </div>
              <div className="font-heading font-bold text-base text-white mt-1">
                {user.strongestSkill}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Demonstrated high structural deconstruction of opposing arguments with minimal formal fallacies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                Weakest Reasoning Skill
              </div>
              <div className="font-heading font-bold text-base text-white mt-1">
                {user.weakestSkill}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Tends to state theoretical conclusions without quoting empirical metrics or verified citations.
              </p>
            </div>
          </div>
        </div>

        {/* Favorite Topics */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-violet-400 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Favorite Disciplines & Tags</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your most frequently contested categories in the AI arena:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {user.favoriteTopics.map((fav) => (
              <div
                key={fav}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{fav}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-slate-400 leading-snug">
            Engaging across diverse disciplines increases your critical thinking adaptability when debating unforeseen resolutions.
          </div>
        </div>
      </div>

      {/* Achievement Badges Gallery (Requested) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Honors & Achievement Badges</span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {user.badges.filter((b) => b.isUnlocked).length} / {user.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                badge.isUnlocked
                  ? 'bg-slate-900/60 border-cyan-500/30 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-950/40 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 shrink-0">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-white">
                      {badge.title}
                    </h4>
                    {badge.isUnlocked && (
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <div className="text-[10px] font-mono text-cyan-400 pt-1">
                      Unlocked: {badge.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
