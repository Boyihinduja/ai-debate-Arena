import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Clock,
  Shield,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { soundEnabled, setSoundEnabled, showToast, user } = useDebate();
  const [defaultDifficulty, setDefaultDifficulty] = useState('Challenger');
  const [defaultTimer, setDefaultTimer] = useState(90);

  const handleResetData = () => {
    soundFx.playClick();
    if (confirm('Are you sure you want to reset your arena history and stats?')) {
      localStorage.clear();
      showToast({
        type: 'warning',
        title: 'Data Reset',
        message: 'Local session storage reset. Reloading defaults.',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>CONFIGURATION</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Arena Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize sensory sound effects, default match constraints, and model responsiveness.
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio Toggle */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base text-white">
              Arena Audio & Sound Synthesizer
            </h3>
            <p className="text-xs text-slate-400">
              Plays synthesized futuristic audio cues for clash starts, round turns, and debate completion.
            </p>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              soundFx.playClick();
            }}
            className={`p-3 rounded-xl border transition-all ${
              soundEnabled
                ? 'border-cyan-500 bg-cyan-950/60 text-cyan-400 shadow-md shadow-cyan-950/50'
                : 'border-slate-700 bg-slate-900 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Default Match Presets */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-5">
          <h3 className="font-heading font-bold text-base text-white">
            Default Match Presets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Default Difficulty
              </label>
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Challenger">Challenger</option>
                <option value="Cross Examination">Cross Examination</option>
                <option value="Expert">Expert</option>
                <option value="Devil's Advocate">Devil's Advocate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Default Round Timer
              </label>
              <select
                value={defaultTimer}
                onChange={(e) => setDefaultTimer(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={0}>No Timer (Relaxed)</option>
                <option value={60}>60 Seconds (Blitz)</option>
                <option value={90}>90 Seconds (Tournament)</option>
                <option value={120}>2 Minutes (Deep Argument)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm text-rose-300">
              Reset Arena Cache & History
            </h4>
            <p className="text-xs text-slate-400">
              Clear your stored session records, custom topics, and scores on this device.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl border border-rose-500/40 hover:bg-rose-950/60 text-rose-300 text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
