import React from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  Trophy,
  Swords,
  Repeat,
  ArrowRight,
  Brain,
  Sparkles,
  ShieldAlert,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  LayoutDashboard,
  Share2,
} from 'lucide-react';

export const DebateAnalysis: React.FC = () => {
  const {
    viewingEvaluationSession,
    setCurrentView,
    switchSidesDebate,
    startNewDebate,
    showToast,
  } = useDebate();

  if (!viewingEvaluationSession || !viewingEvaluationSession.evaluation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Evaluation Loaded</h2>
        <p className="text-sm text-slate-400">Complete a debate or pick one from history to view analysis.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { topic, userSide, difficulty, mode, totalRounds, evaluation, timeSpentSeconds } =
    viewingEvaluationSession;

  const handleRematch = () => {
    soundFx.playRoundStart();
    startNewDebate({
      topic,
      userSide,
      difficulty,
      mode,
      timerOption: viewingEvaluationSession.timerOption,
    });
  };

  const handleSwitchSides = () => {
    soundFx.playClick();
    switchSidesDebate();
  };

  const handleShare = () => {
    soundFx.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I scored ${evaluation.overallScore}/100 defending "${userSide}" on "${topic.title}" at AI Debate Arena!`
      );
      showToast({
        type: 'success',
        title: 'Copied to Clipboard',
        message: 'Debate scorecard summary copied for sharing.',
      });
    }
  };

  const scoreMetrics = [
    {
      label: 'LOGIC',
      score: evaluation.logicScore,
      benchmark: 82,
      desc: 'Deductive consistency, premise validity, and avoidance of formal fallacies.',
      color: 'from-cyan-500 to-blue-500',
      badge: 'border-cyan-500/40 text-cyan-300',
    },
    {
      label: 'CLARITY',
      score: evaluation.clarityScore,
      benchmark: 87,
      desc: 'Precision of language, structural organization, and syntactic focus.',
      color: 'from-blue-500 to-indigo-500',
      badge: 'border-blue-500/40 text-blue-300',
    },
    {
      label: 'EVIDENCE',
      score: evaluation.evidenceScore,
      benchmark: 68,
      desc: 'Empirical citations, verifiable precedents, and operational mechanics.',
      color: 'from-indigo-500 to-violet-500',
      badge: 'border-indigo-500/40 text-indigo-300',
    },
    {
      label: 'REBUTTAL',
      score: evaluation.rebuttalScore,
      benchmark: 74,
      desc: 'Direct deconstruction of opposing claims rather than changing subjects.',
      color: 'from-violet-500 to-purple-500',
      badge: 'border-violet-500/40 text-violet-300',
    },
    {
      label: 'RELEVANCE',
      score: evaluation.relevanceScore,
      benchmark: 91,
      desc: 'Adherence to the core resolution without drifting into unrelated tangents.',
      color: 'from-emerald-500 to-teal-500',
      badge: 'border-emerald-500/40 text-emerald-300',
    },
  ];

  const formatMinutes = (seconds?: number) => {
    if (!seconds) return '7m 45s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Trophy className="w-3.5 h-3.5" />
          <span>Forensic Performance Scorecard</span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight uppercase">
          DEBATE COMPLETE
        </h1>
        <p className="text-sm text-slate-300">
          Comprehensive logic breakdown, fallacy audit, and dialectic evaluation.
        </p>

        {/* Match Attributes Pill Box */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs font-mono text-slate-300 mt-2">
          <span>Topic: <strong className="text-white">{topic.title}</strong></span>
          <span className="text-slate-600">·</span>
          <span>Position: <strong className="text-cyan-300">{userSide}</strong></span>
          <span className="text-slate-600">·</span>
          <span>Rounds: <strong className="text-white">{totalRounds} completed</strong></span>
          <span className="text-slate-600">·</span>
          <span>Time: <strong className="text-white">{formatMinutes(timeSpentSeconds)}</strong></span>
        </div>
      </div>

      {/* 5 LARGE PERFORMANCE CARDS */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>Core Reasoning Metrics (Out of 100)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {scoreMetrics.map((metric) => (
            <div
              key={metric.label}
              className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                    {metric.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Benchmark</span>
                </div>

                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white my-1">
                  {metric.score}
                  <span className="text-sm text-slate-500 font-normal">/100</span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-3">
                  <div
                    style={{ width: `${metric.score}%` }}
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                {metric.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EXPLANATIONS & DETAILED FORENSIC AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Strongest & Weakest Argument */}
        <div className="space-y-6">
          {/* STRONGEST ARGUMENT */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>STRONGEST ARGUMENT</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-900/40 text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">
              “{evaluation.strongestArgument.text}”
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              {evaluation.strongestArgument.explanation}
            </p>
          </div>

          {/* WEAKEST ARGUMENT */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>WEAKEST ARGUMENT</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-900/40 text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">
              “{evaluation.weakestArgument.text}”
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {evaluation.weakestArgument.explanation}
            </p>
          </div>
        </div>

        {/* Right: Logical Issues & AI Counterargument */}
        <div className="space-y-6">
          {/* LOGICAL ISSUES DETECTED */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>LOGICAL ISSUES DETECTED</span>
            </div>
            <div className="space-y-2.5">
              {evaluation.logicalIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-rose-900/40 text-xs"
                >
                  <div className="font-heading font-bold text-rose-300 mb-0.5">
                    • {issue.type}
                  </div>
                  <div className="text-slate-300 leading-snug">
                    {issue.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI'S STRONGEST COUNTERARGUMENT */}
          <div className="p-6 rounded-2xl bg-violet-950/20 border border-violet-500/30 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>AI'S STRONGEST COUNTERARGUMENT</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-xl border border-violet-900/40">
              “{evaluation.aiStrongestCounterargument}”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Notice how the AI exploited systemic externalities and empirical variance. In your next debate, anticipate this objection before the opponent raises it.
            </p>
          </div>
        </div>
      </div>

      {/* PROMINENT SWITCH SIDES FEATURE (Requested: Switch Sides Feature) */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-violet-600 via-cyan-500 to-blue-600 shadow-2xl shadow-cyan-950/40">
        <div className="bg-[#080d1e] rounded-[15px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-violet-950/80 border border-violet-800/40 text-violet-300 text-xs font-mono font-bold">
              <Repeat className="w-3.5 h-3.5 text-violet-400" />
              <span>INTELLECTUAL INVERSION PROTOCOL</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              SWITCH SIDES
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              “You defended one position. Now defend the opposite.”
            </p>
            <p className="text-xs text-slate-400">
              True mastery of dialectics requires defending both sides of a proposition with equal conviction and rigor.
            </p>
          </div>

          <button
            onClick={handleSwitchSides}
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5 shrink-0"
          >
            <Repeat className="w-4 h-4" />
            <span>DEFEND THE OTHER SIDE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentView('dashboard');
          }}
          className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-slate-900/60 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Scorecard</span>
          </button>

          <button
            onClick={handleRematch}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Rematch Same Stance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
