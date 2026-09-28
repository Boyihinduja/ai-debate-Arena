import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  TrendingUp,
  Brain,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const { user, history, setCurrentView } = useDebate();
  const [activeTab, setActiveTab] = useState<'trends' | 'radar'>('trends');

  // Competency metrics
  const competencies = [
    { name: 'Logic Improvement', score: 86, change: '+12%', color: 'from-cyan-500 to-blue-500' },
    { name: 'Argument Clarity', score: 88, change: '+9%', color: 'from-blue-500 to-indigo-500' },
    { name: 'Evidence Usage', score: 69, change: '+4%', color: 'from-amber-500 to-orange-500' },
    { name: 'Rebuttal Ability', score: 82, change: '+15%', color: 'from-violet-500 to-purple-500' },
    { name: 'Critical Thinking', score: 85, change: '+11%', color: 'from-emerald-500 to-teal-500' },
    { name: 'Consistency', score: 79, change: '+7%', color: 'from-rose-500 to-pink-500' },
  ];

  // 10 debates history points
  const debateScores = [68, 71, 74, 76, 75, 79, 82, 84, 83, 88];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>COGNITIVE ANALYTICS ENGINE</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Dialectic Performance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quantified reasoning progress, rhetoric mastery, and fallacy mitigation.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentView('start');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>New Sparring Match</span>
        </button>
      </div>

      {/* 6 Core Competency Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>Core Forensics Competencies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {competencies.map((comp) => (
            <div
              key={comp.name}
              className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-cyan-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-white">
                  {comp.name}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {comp.change}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-3xl text-white">
                  {comp.score}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100 benchmark</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${comp.score}%` }}
                  className={`h-full bg-gradient-to-r ${comp.color} rounded-full transition-all duration-1000`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Score Progression Chart */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
              Historical Score Trajectory
            </div>
            <h3 className="font-heading font-bold text-xl text-white mt-1">
              Logic Score Progression Across Last 10 Debates
            </h3>
          </div>

          <div className="text-right text-xs font-mono">
            <span className="text-slate-400">Net Improvement: </span>
            <span className="text-emerald-400 font-bold">+20 Points</span>
          </div>
        </div>

        {/* SVG Area / Bar Chart */}
        <div className="relative pt-6">
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-800">
            {debateScores.map((score, i) => {
              const height = ((score - 50) / 50) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-cyan-500/40 text-[11px] font-mono px-2 py-0.5 rounded text-cyan-300 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    Match #{i + 1}: {score}/100
                  </div>
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      i === debateScores.length - 1
                        ? 'bg-gradient-to-t from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-700/60 hover:bg-cyan-500/60'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    #{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-3">
            <span>Earliest Recorded Sparring</span>
            <span>Median Point</span>
            <span>Most Recent Clash</span>
          </div>
        </div>
      </div>

      {/* Two Highlight Cards: YOUR PROGRESS & AREAS TO IMPROVE (Explicitly Requested) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: YOUR PROGRESS */}
        <div className="p-6 sm:p-7 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>YOUR PROGRESS</span>
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-white">
            “Your logic score has improved across your last 10 debates.”
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            You have transitioned from surface-level rhetorical appeals to structured deductive reasoning. Your ability to anticipate adversarial counterarguments in Round 2 has sharply reduced the AI opponent's cross-examination leverage.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-900/40 space-y-1.5 text-xs">
            <div className="font-semibold text-emerald-300">Key Milestone:</div>
            <div className="text-slate-300">
              Eliminated 80% of Circular Reasoning fallacies since entering Challenger difficulty.
            </div>
          </div>
        </div>

        {/* Card 2: AREAS TO IMPROVE */}
        <div className="p-6 sm:p-7 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>AREAS TO IMPROVE</span>
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-white">
            Targeted Forensics Focus
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-900/40 text-xs space-y-1">
              <span className="font-bold text-amber-300">1. Supporting claims with evidence</span>
              <p className="text-slate-300 leading-snug">
                You frequently make valid theoretical claims without citing verifiable empirical studies, historical precedents, or quantitative models.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-900/40 text-xs space-y-1">
              <span className="font-bold text-amber-300">2. Addressing counterarguments</span>
              <p className="text-slate-300 leading-snug">
                When pressed by Cross-Examination, avoid pivoting to new subtopics. Confront the opponent's strongest point directly before advancing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-900/40 text-xs space-y-1">
              <span className="font-bold text-amber-300">3. Avoiding overgeneralization</span>
              <p className="text-slate-300 leading-snug">
                Substitute absolute terms like "invariably", "everyone", and "always" with calibrated conditional probabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
