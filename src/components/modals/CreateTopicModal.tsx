import React, { useState } from 'react';
import { useDebate } from '../../context/DebateContext';
import { soundFx } from '../../utils/audio';
import { TOPIC_CATEGORIES } from '../../data/topics';
import { TopicCategory, Difficulty } from '../../types';
import { X, Sparkles, Plus, AlertCircle } from 'lucide-react';

export const CreateTopicModal: React.FC = () => {
  const {
    isCreateTopicModalOpen,
    setIsCreateTopicModalOpen,
    addCustomTopic,
    setSelectedTopicForStart,
    setCurrentView,
  } = useDebate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TopicCategory>('AI & Society');
  const [difficulty, setDifficulty] = useState<Difficulty>('Challenger');
  const [description, setDescription] = useState('');
  const [forPerspective, setForPerspective] = useState('');
  const [againstPerspective, setAgainstPerspective] = useState('');
  const [tagInput, setTagInput] = useState('');

  if (!isCreateTopicModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playClick();
    const tags = tagInput
      ? tagInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Custom Topic', category];

    const created = addCustomTopic({
      title: title.trim(),
      category,
      difficulty,
      description: description.trim() || `Dialectic debate examining the resolution: "${title.trim()}".`,
      forPerspective:
        forPerspective.trim() ||
        'Advocates argue that this intervention optimizes equity, progress, and systemic efficiency.',
      againstPerspective:
        againstPerspective.trim() ||
        'Opponents caution that structural externalities, unintended consequences, and risks outweigh benefits.',
      tags,
    });

    setIsCreateTopicModalOpen(false);
    setSelectedTopicForStart(created);
    setCurrentView('start');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#090d1a] border border-cyan-500/25 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            setIsCreateTopicModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arena Resolution Generator</span>
        </div>
        <h3 className="font-heading font-bold text-2xl text-white mb-1">
          Create Your Own Topic
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Propose any controversial thesis or philosophical dilemma for the AI to deconstruct.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Debate Question / Resolution *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Should space exploration take precedence over climate mitigation?"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TopicCategory)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {TOPIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Challenger">Challenger</option>
                <option value="Cross Examination">Cross Examination</option>
                <option value="Expert">Expert</option>
                <option value="Devil's Advocate">Devil's Advocate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Core Conflict / Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief background on why this resolution matters..."
              className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>OPTIONAL: Seed Opposing Arguments</span>
            </div>
            <div>
              <input
                type="text"
                value={forPerspective}
                onChange={(e) => setForPerspective(e.target.value)}
                placeholder="Key argument FOR the resolution..."
                className="w-full px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={againstPerspective}
                onChange={(e) => setAgainstPerspective(e.target.value)}
                placeholder="Key argument AGAINST the resolution..."
                className="w-full px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Policy, Bioethics, Future"
              className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Spawn Topic & Enter Setup</span>
          </button>
        </form>
      </div>
    </div>
  );
};
