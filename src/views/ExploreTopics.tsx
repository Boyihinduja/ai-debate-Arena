import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import { TOPIC_CATEGORIES } from '../data/topics';
import { DebateTopic, TopicCategory } from '../types';
import {
  Compass,
  Search,
  Swords,
  Sparkles,
  Users,
  CheckCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const ExploreTopics: React.FC = () => {
  const {
    topics,
    setSelectedTopicForStart,
    setCurrentView,
    setIsCreateTopicModalOpen,
  } = useDebate();

  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectTopic = (topic: DebateTopic) => {
    soundFx.playClick();
    setSelectedTopicForStart(topic);
    setCurrentView('start');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>TOPIC REPERTORY</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Explore Topics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover thought-provoking propositions across ethics, technology, education, and society.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsCreateTopicModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Custom Topic</span>
        </button>
      </div>

      {/* Category Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            All Disciplines
          </button>
          {TOPIC_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic title, keywords (e.g., AI, college, misinformation, vehicles)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 rounded-2xl glass-panel glass-card-hover border border-white/5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 font-semibold">
                  {topic.category}
                </span>
                <span className="text-slate-400 font-medium">{topic.difficulty}</span>
              </div>

              <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {topic.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {topic.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500/80" />
                <span>{topic.debatesCount || 420} Debates</span>
              </div>

              <button
                onClick={() => handleSelectTopic(topic)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Debate This</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
