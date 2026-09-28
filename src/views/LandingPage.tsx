import React, { useState } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  Swords,
  Brain,
  Timer,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle,
  Eye,
  Bot,
  UserCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, topics, startNewDebate, setSelectedTopicForStart } = useDebate();
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'clash' | 'analysis'>('clash');

  const handleStart = () => {
    soundFx.playClick();
    setCurrentView('start');
  };

  const handleExplore = () => {
    soundFx.playClick();
    setCurrentView('topics');
  };

  const handleQuickMatch = (topicIndex = 0) => {
    soundFx.playClick();
    const topic = topics[topicIndex] || topics[0];
    setSelectedTopicForStart(topic);
    setCurrentView('start');
  };

  return (
    <div className="relative min-h-screen bg-[#05070e] overflow-hidden">
      {/* Background Gradients & Sci-Fi Grid */}
      <div className="absolute inset-0 arena-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] radial-glow-cyan pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] radial-glow-violet pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-8 shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Competitive Dialectic Training Platform</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.08] mb-6">
            ENTER THE ARENA.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              DEFEND YOUR THINKING.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Challenge your arguments against an AI opponent designed to question, counter, and test your reasoning.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Swords className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>START A DEBATE</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-slate-900/60 hover:bg-slate-900/90 text-slate-200 hover:text-white font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>EXPLORE TOPICS</span>
            </button>
          </div>
        </div>

        {/* Futuristic Debate Arena Visual: YOU vs AI */}
        <div className="relative max-w-5xl mx-auto mt-6">
          {/* Subtle Outer Neon Frame */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/30 via-slate-800 to-violet-500/30 shadow-2xl shadow-cyan-950/60 overflow-hidden">
            <div className="bg-[#080d1e]/90 backdrop-blur-2xl rounded-[15px] p-6 sm:p-8">
              {/* Arena Header Bar */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>SIMULATION ACTIVE · ROUND 1 / 5</span>
                </div>
                <div className="text-slate-400 hidden sm:block">
                  TOPIC: SHOULD ARTIFICIAL INTELLIGENCE REPLACE HUMAN TEACHERS?
                </div>
                <div className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 font-semibold text-[11px]">
                  AI CHALLENGE LEVEL: HIGH
                </div>
              </div>

              {/* Opposing Podiums */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* YOU Side */}
                <div className="md:col-span-5 p-5 rounded-xl bg-slate-950/80 border border-blue-500/25 relative group hover:border-blue-400/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="font-heading font-bold text-sm tracking-wider text-blue-400 uppercase">
                        YOU · POSITION: AGAINST
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      Strength: 88%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
                    “Human teachers provide irreplaceable emotional attunement, moral mentorship, and relational trust. Knowledge acquisition is not mere metric optimization; pediatric neurobiology demonstrates that emotional safety underpins cognitive plasticity.”
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-blue-400">Premises:</span> Emotional Safety · Moral Mentorship
                  </div>
                </div>

                {/* Center Clash Indicator: VS */}
                <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/40">
                      <div className="w-full h-full bg-[#050914] rounded-full flex items-center justify-center font-heading font-black text-sm text-white tracking-widest">
                        VS
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-gradient-to-b from-cyan-500/30 to-transparent mt-2" />
                </div>

                {/* AI OPPONENT Side */}
                <div className="md:col-span-5 p-5 rounded-xl bg-slate-950/80 border border-violet-500/25 relative group hover:border-violet-400/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="font-heading font-bold text-sm tracking-wider text-violet-400 uppercase">
                        AI OPPONENT · COUNTERARGUMENT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      Rigor: Challenger
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    “Your argument rests on the idealization fallacy. In practice, 58% of public educators report chronic emotional exhaustion, introducing systemic grading biases and inconsistent attention. How does human presence guarantee empathy if burnout routinely undermines it?”
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-violet-400">Challenge:</span> Idealization Fallacy · Burnout Disparity
                  </div>
                </div>
              </div>

              {/* Bottom Clash Quick Launch */}
              <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interactive arena matches test your resilience across 3, 5, or 10 intense rounds.</span>
                </div>
                <button
                  onClick={() => handleQuickMatch(0)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shrink-0"
                >
                  Spar On This Topic Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (Requested: 3 Feature Cards) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            Engineered For Intellectual Rigor
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Beyond Polite Chatbots
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Generic assistants flatter your opinion. AI Debate Arena tests whether your premises survive aggressive intellectual cross-examination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Challenge Your Logic */}
          <div className="p-7 rounded-2xl glass-panel glass-card-hover relative border border-cyan-500/15 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2.5">
              1. Challenge Your Logic
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI actively identifies hidden assumptions, self-contradictions, weak reasoning, and logical fallacies like circular reasoning and overgeneralization in real time.
            </p>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Fallacy auditing active</span>
            </div>
          </div>

          {/* Card 2: Think Under Pressure */}
          <div className="p-7 rounded-2xl glass-panel glass-card-hover relative border border-blue-500/15 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2.5">
              2. Think Under Pressure
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Timed debate rounds force users to formulate clear, evidence-backed arguments quickly without meandering or hiding behind rhetoric.
            </p>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-blue-400">
              <Zap className="w-3.5 h-3.5" />
              <span>60s, 90s, and 2min timers</span>
            </div>
          </div>

          {/* Card 3: Improve With Every Debate */}
          <div className="p-7 rounded-2xl glass-panel glass-card-hover relative border border-violet-500/15 group">
            <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2.5">
              3. Improve With Every Debate
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Receive detailed post-match scorecards across Logic, Clarity, Evidence, and Rebuttal. Track your reasoning metrics and earned badges over time.
            </p>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-violet-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Quantified cognitive growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS Section (Requested: 4 Steps) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            Dialectic Protocol
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white uppercase">
            HOW IT WORKS
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Four disciplined steps from resolution to quantifiable analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all relative">
            <div className="font-mono text-3xl font-extrabold text-cyan-400/40 mb-3">01</div>
            <h4 className="font-heading font-bold text-lg text-white mb-2">
              Choose a topic
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select from curated themes in Ethics, AI, Science, and Business — or input your own contentious resolution.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all relative">
            <div className="font-mono text-3xl font-extrabold text-cyan-400/40 mb-3">02</div>
            <h4 className="font-heading font-bold text-lg text-white mb-2">
              Pick your position
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decide whether to stand <strong>FOR</strong> or <strong>AGAINST</strong>. Calibrate AI difficulty from Beginner to Devil's Advocate.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all relative">
            <div className="font-mono text-3xl font-extrabold text-cyan-400/40 mb-3">03</div>
            <h4 className="font-heading font-bold text-lg text-white mb-2">
              Debate the AI
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exchange multi-round structured arguments. The AI counters with targeted rebuttals, cross-examinations, and fallacy checks.
            </p>
          </div>

          {/* Step 04 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all relative">
            <div className="font-mono text-3xl font-extrabold text-cyan-400/40 mb-3">04</div>
            <h4 className="font-heading font-bold text-lg text-white mb-2">
              Analyze your performance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review comprehensive score breakdowns, uncover weak spots, and use <strong>Switch Sides</strong> to debate the opposing angle.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-2xl p-8 bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-violet-950/60 border border-cyan-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Ready to test your conviction against an unflinching opponent?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Join thousands of debaters honing their argumentation, critical thinking, and rhetoric.
            </p>
          </div>
          <button
            onClick={handleStart}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all shrink-0"
          >
            Enter The Arena Now
          </button>
        </div>
      </section>
    </div>
  );
};
