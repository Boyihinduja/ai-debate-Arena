import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import { DebateSession, Difficulty, TopicCategory } from '../types';
import { TOPIC_CATEGORIES } from '../data/topics';
import {
  History,
  Search,
  Filter,
  ExternalLink,
  Swords,
  Calendar,
  Clock,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

export const DebateHistory: React.FC = () => {
  const { history, setCurrentView, setViewingEvaluationSession, startNewDebate } = useDebate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.topic.title.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.topic.category === selectedCategory;
    const matchesDiff =
      selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const itemScore = item.evaluation?.logicScore || 70;
    const matchesScore = itemScore >= minScore;
    return matchesSearch && matchesCategory && matchesDiff && matchesScore;
  });

  filteredHistory.sort((a, b) => {
    if (sortBy === 'score') {
      return (b.evaluation?.logicScore || 0) - (a.evaluation?.logicScore || 0);
    }
    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  });

  const handleViewAnalysis = (session: DebateSession) => {
    soundFx.playClick();
    setViewingEvaluationSession(session);
    setCurrentView('analysis');
  };

  const handleRematch = (session: DebateSession) => {
    soundFx.playRoundStart();
    startNewDebate({
      topic: session.topic,
      userSide: session.userSide,
      difficulty: session.difficulty,
      mode: session.mode,
      timerOption: session.timerOption,
    });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <History className="w-4 h-4" />
            <span>ARCHIVE RECORD</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Debate History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, and review forensic performance analysis from past clashes.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentView('start');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <Swords className="w-4 h-4" />
          <span>New Debate</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, resolution keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Categories</option>
              {TOPIC_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Challenger">Challenger</option>
              <option value="Cross Examination">Cross Examination</option>
              <option value="Expert">Expert</option>
              <option value="Devil's Advocate">Devil's Advocate</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="date">Sort by Most Recent</option>
              <option value="score">Sort by Highest Score</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <span>
            Showing <strong className="text-white">{filteredHistory.length}</strong> recorded debates
          </span>
          {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || search) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearch('');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-sans"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* History Cards List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel text-center space-y-4 border border-white/5">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Debates Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No past debates matched your filter criteria. Try adjusting your search query or start a new clash.
          </p>
          <button
            onClick={() => setCurrentView('start')}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs"
          >
            Start a Debate
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((session) => {
            const score = session.evaluation?.logicScore || 78;
            return (
              <div
                key={session.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {session.topic.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold ${
                        session.userSide === 'FOR'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      POSITION: {session.userSide}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-semibold">{session.difficulty}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{session.totalRounds} Rounds</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.startedAt)}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {session.topic.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {session.evaluation?.detailedFeedback || session.topic.description}
                  </p>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5 lg:border-l lg:border-white/5 lg:pl-6">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Logic Score
                    </div>
                    <div className="font-heading font-extrabold text-3xl text-cyan-400">
                      {score}
                      <span className="text-sm text-slate-500 font-normal">/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRematch(session)}
                      title="Rematch on this topic"
                      className="p-2.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleViewAnalysis(session)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <span>View Analysis</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
