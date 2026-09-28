import React, { useState, useEffect } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import { TOPIC_CATEGORIES } from '../data/topics';
import {
  DebateMode,
  DebateTopic,
  Difficulty,
  Side,
  TimerOption,
  TopicCategory,
} from '../types';
import {
  Swords,
  Shield,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Bot,
  User,
  Zap,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const StartDebatePage: React.FC = () => {
  const {
    topics,
    selectedTopicForStart,
    setSelectedTopicForStart,
    startNewDebate,
    setIsCreateTopicModalOpen,
  } = useDebate();

  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(
    selectedTopicForStart || topics[0]
  );
  const [userSide, setUserSide] = useState<Side>('FOR');
  const [difficulty, setDifficulty] = useState<Difficulty>('Challenger');
  const [mode, setMode] = useState<DebateMode>('Standard');
  const [timerOption, setTimerOption] = useState<TimerOption>(90);

  useEffect(() => {
    if (selectedTopicForStart) {
      setSelectedTopic(selectedTopicForStart);
    }
  }, [selectedTopicForStart]);

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleStart = () => {
    soundFx.playRoundStart();
    startNewDebate({
      topic: selectedTopic,
      userSide,
      difficulty,
      mode,
      timerOption,
    });
  };

  const difficultyDetails: Record<Difficulty, { label: string; desc: string; color: string; badge: string }> = {
    Beginner: {
      label: 'Beginner',
      desc: 'Gentle inquiries, accessible premises, highlights missing definitions without harsh pressure.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
      badge: 'Introductory',
    },
    Challenger: {
      label: 'Challenger',
      desc: 'Balanced forensic rigor. Identifies unstated assumptions, questions evidence links, and tests consistency.',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
      badge: 'Balanced Rigor',
    },
    'Cross Examination': {
      label: 'Cross Examination',
      desc: 'Legal trial format. Relentlessly interrogates your axioms, exploits loopholes, and demands precise thresholds.',
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
      badge: 'Interrogative',
    },
    Expert: {
      label: 'Expert',
      desc: 'Formal philosophical & academic rigor. Sets dialectic traps, audits formal fallacies, and demands empirical data.',
      color: 'border-violet-500/40 text-violet-400 bg-violet-950/30',
      badge: 'Academic Standard',
    },
    "Devil's Advocate": {
      label: "Devil's Advocate",
      desc: 'Aggressive contrarian logic. Explores extreme edge cases, provocative counter-theses, and systemic risks.',
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/30',
      badge: 'Maximum Pressure',
    },
  };

  const modeDetails: Record<DebateMode, { rounds: number; desc: string }> = {
    Quick: { rounds: 3, desc: '3 rounds · Fast sparring, perfect for quick drills' },
    Standard: { rounds: 5, desc: '5 rounds · Full opening, cross-examination, and rebuttal' },
    Deep: { rounds: 10, desc: '10 rounds · Comprehensive deep-dive dialectic battle' },
  };

  const timerOptionsList: { value: TimerOption; label: string }[] = [
    { value: 0, label: 'No Timer' },
    { value: 60, label: '60 seconds' },
    { value: 90, label: '90 seconds' },
    { value: 120, label: '2 minutes' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Match Configuration</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
          PREPARE FOR BATTLE
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          Select your resolution, define your stance, and calibrate the AI opponent's dialectic aggression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topic & Match Parameters (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Topic Selection */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Step 01
                </span>
                <h3 className="font-heading font-bold text-xl text-white">
                  Topic Selection
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsCreateTopicModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/40 text-cyan-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>CREATE YOUR OWN TOPIC</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCategory('All');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm shadow-cyan-500/50'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                All Categories
              </button>
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-black font-semibold shadow-sm shadow-cyan-500/50'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, keywords, ethics, education..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Topics List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedTopic(topic);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 shadow-md shadow-cyan-950/50'
                        : 'border-white/5 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-cyan-400 font-semibold">{topic.category}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{topic.difficulty}</span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-white leading-snug">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {topic.description}
                        </p>
                      </div>

                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500 text-black'
                              : 'border-slate-700 bg-slate-800 text-transparent'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Side Selection: FOR or AGAINST */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 02
              </span>
              <h3 className="font-heading font-bold text-xl text-white">
                Pick Your Side
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose your position. The AI will defend the exact counter-stance with maximum forensic vigor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FOR */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setUserSide('FOR');
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  userSide === 'FOR'
                    ? 'border-blue-500 bg-blue-950/50 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/50'
                    : 'border-white/5 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-black text-2xl text-blue-400">
                    FOR
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800/40 text-blue-300">
                    Affirmative
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Defend the resolution as valid and necessary.
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 italic">
                  "{selectedTopic.forPerspective.slice(0, 100)}..."
                </div>
              </button>

              {/* AGAINST */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setUserSide('AGAINST');
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  userSide === 'AGAINST'
                    ? 'border-amber-500 bg-amber-950/50 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                    : 'border-white/5 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-black text-2xl text-amber-400">
                    AGAINST
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800/40 text-amber-300">
                    Negative
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Oppose the resolution and expose its systemic flaws or risks.
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 italic">
                  "{selectedTopic.againstPerspective.slice(0, 100)}..."
                </div>
              </button>
            </div>
          </div>

          {/* 3. Difficulty Selection */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 03
              </span>
              <h3 className="font-heading font-bold text-xl text-white">
                AI Difficulty & Aggression
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  'Beginner',
                  'Challenger',
                  'Cross Examination',
                  'Expert',
                  "Devil's Advocate",
                ] as Difficulty[]
              ).map((tier) => {
                const isSelected = difficulty === tier;
                const info = difficultyDetails[tier];
                return (
                  <div
                    key={tier}
                    onClick={() => {
                      soundFx.playClick();
                      setDifficulty(tier);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? `${info.color} shadow-lg ring-1`
                        : 'border-white/5 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-bold text-sm text-white">
                        {info.label}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                        {info.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {info.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Debate Mode & Optional Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Debate Mode */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Step 04A
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  Debate Mode
                </h3>
              </div>
              <div className="space-y-2.5">
                {(['Quick', 'Standard', 'Deep'] as DebateMode[]).map((m) => {
                  const isSelected = mode === m;
                  const item = modeDetails[m];
                  return (
                    <div
                      key={m}
                      onClick={() => {
                        soundFx.playClick();
                        setMode(m);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40'
                          : 'border-white/5 bg-slate-900/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm text-white">
                          {m}
                        </span>
                        <span className="text-xs font-mono text-cyan-300 font-semibold">
                          {item.rounds} Rounds
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Timer */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Step 04B
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  Optional Timer
                </h3>
              </div>
              <div className="space-y-2.5">
                {timerOptionsList.map((opt) => {
                  const isSelected = timerOption === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        soundFx.playClick();
                        setTimerOption(opt.value);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                          : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="font-heading font-semibold text-sm">
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {opt.value === 0 ? 'Unlimited reflection' : 'Strict turn limit'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Debate Preview Card (4 Cols sticky) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/40 via-blue-600/30 to-violet-500/40 shadow-2xl shadow-cyan-950/50">
            <div className="bg-[#090e1f] rounded-[15px] p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Matchup Preview
                </span>
                <div className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 text-[10px] font-mono font-semibold">
                  DIALECTIC ARENA
                </div>
              </div>

              {/* Opponents Clash Visual */}
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-heading font-bold text-sm">
                    YOU
                  </div>
                  <span className="text-[10px] font-mono text-blue-300 font-bold mt-1">
                    {userSide}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-heading font-black text-[11px] text-cyan-300">
                    VS
                  </div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mt-1" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 font-heading font-bold text-sm">
                    AI
                  </div>
                  <span className="text-[10px] font-mono text-violet-300 font-bold mt-1">
                    {userSide === 'FOR' ? 'AGAINST' : 'FOR'}
                  </span>
                </div>
              </div>

              {/* Selected Topic */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Resolution
                </div>
                <div className="font-heading font-bold text-sm text-white">
                  {selectedTopic.title}
                </div>
              </div>

              {/* Match Specs */}
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Difficulty:</span>
                  <span className="text-cyan-300 font-bold">{difficulty}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Debate Mode:</span>
                  <span className="text-white font-bold">{mode} ({modeDetails[mode].rounds} rounds)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Turn Timer:</span>
                  <span className="text-white font-bold">
                    {timerOption === 0 ? 'No Timer' : `${timerOption}s`}
                  </span>
                </div>
              </div>

              {/* ENTER ARENA Button */}
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Swords className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>ENTER ARENA</span>
                <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
