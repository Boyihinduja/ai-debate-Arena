import React from 'react';
import { useDebate, AppView } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  Swords,
  Flame,
  Award,
  Zap,
  TrendingUp,
  History,
  Compass,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Brain,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    setCurrentView,
    history,
    topics,
    setSelectedTopicForStart,
    setViewingEvaluationSession,
    setIsCreateTopicModalOpen,
  } = useDebate();

  const handleStartDebate = () => {
    soundFx.playClick();
    setCurrentView('start');
  };

  const handleViewAnalysis = (session: typeof history[0]) => {
    soundFx.playClick();
    setViewingEvaluationSession(session);
    setCurrentView('analysis');
  };

  const handleTopicQuickStart = (topic: typeof topics[0]) => {
    soundFx.playClick();
    setSelectedTopicForStart(topic);
    setCurrentView('start');
  };

  // Sparkline chart data for score trend
  const trendData = [68, 72, 75, 74, 80, 79, 84, 82, 86, 88];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-fade-in">
      {/* Top Greeting & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>OPERATIONAL · {user.rank.toUpperCase()}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Ready for your next argument, {user.username.split(' ')[0]}?
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your reasoning engine is primed. Choose a thesis to stress-test your logic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsCreateTopicModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Custom Topic</span>
          </button>
          <button
            onClick={handleStartDebate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Start Debate</span>
          </button>
        </div>
      </div>

      {/* Large CTA Card: START NEW DEBATE */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-violet-500/40 mb-10 overflow-hidden shadow-2xl shadow-cyan-950/40">
        <div className="bg-[#090e1f] rounded-[15px] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono font-semibold mb-3">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>FEATURED DIALECTIC MATCHUP</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-2">
              START NEW DEBATE
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Step into the high-stakes arena against an adversarial AI calibrated to dissect your assertions, detect logical fallacies, and question unproven assumptions.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-slate-300">Recommended Topic:</span>
              <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                {topics[0]?.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => handleTopicQuickStart(topics[0])}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Swords className="w-4 h-4" />
              <span>ENTER ARENA NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentView('topics');
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/10 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
            >
              Browse Library
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Stat 1: Debates Completed */}
        <div className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Debates Completed
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {user.debatesCompleted}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
            <span className="text-emerald-400 font-bold">+3</span> in past 7 days
          </div>
        </div>

        {/* Stat 2: Current Streak */}
        <div className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Current Streak
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-amber-400">
            {user.currentStreak} <span className="text-lg font-sans text-slate-400 font-medium">Days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
            <span>Keep debating to protect flame</span>
          </div>
        </div>

        {/* Stat 3: Average Logic Score */}
        <div className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Average Logic Score
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-cyan-300">
            {user.averageLogicScore}
            <span className="text-base text-slate-500 font-sans font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
            <span className="text-cyan-400 font-bold">Top 15%</span> of peer logicians
          </div>
        </div>

        {/* Stat 4: Strongest Skill */}
        <div className="p-5 rounded-2xl glass-panel relative group border border-white/5 hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Strongest Skill
            </span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-lg text-white leading-snug line-clamp-1">
            {user.strongestSkill}
          </div>
          <div className="text-[11px] text-violet-400 mt-2 flex items-center gap-1.5 font-mono">
            <span>Rebuttal effectiveness: 91%</span>
          </div>
        </div>
      </div>

      {/* Split Grid: Recent Debates & Small Performance Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Debates (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-lg text-white">Recent Debates</h3>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentView('history');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {item.topic.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        item.userSide === 'FOR'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      POSITION: {item.userSide}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{item.difficulty}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{item.mode} ({item.totalRounds} Rnds)</span>
                  </div>

                  <h4 className="font-heading font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {item.topic.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.evaluation?.detailedFeedback || item.topic.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-white/5 sm:pl-5">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Logic Score
                    </div>
                    <div className="font-heading font-extrabold text-2xl text-cyan-400">
                      {item.evaluation?.logicScore || 80}
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewAnalysis(item)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-all"
                    title="View Full Dialectic Analysis"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Small Performance Chart showing improvement over time */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <h3 className="font-heading font-bold text-lg text-white">Logic Improvement</h3>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentView('performance');
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              Full Analytics
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-3xl text-white">
                  +18%
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Growth Across 10 Debates
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Your logical coherence and rebuttal precision have consistently scaled against Challenger and Expert AI.
              </p>
            </div>

            {/* Interactive SVG Trend Chart */}
            <div className="relative pt-2">
              <div className="h-28 flex items-end justify-between gap-1.5 px-1 border-b border-slate-800">
                {trendData.map((val, idx) => {
                  const heightPercent = ((val - 60) / 40) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-cyan-500/40 text-[10px] font-mono px-1.5 py-0.5 rounded text-cyan-300 pointer-events-none whitespace-nowrap z-20">
                        {val} pts
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          idx === trendData.length - 1
                            ? 'bg-gradient-to-t from-cyan-500 to-blue-400 shadow-md shadow-cyan-500/40'
                            : 'bg-slate-700/60 group-hover:bg-cyan-500/50'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>Debate #1</span>
                <span>Debate #5</span>
                <span>Latest</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-800/30 space-y-1.5">
              <div className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Coach Recommendation:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Focus on <strong>Evidence Grounding</strong>. You excel at dissecting logical fallacies, but your claims benefit from direct numerical or precedent citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
