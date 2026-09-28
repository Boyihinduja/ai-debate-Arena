import React from 'react';
import { useDebate } from '../../context/DebateContext';
import { soundFx } from '../../utils/audio';
import { X, ShieldCheck, HelpCircle, FileText, Mail, HeartHandshake } from 'lucide-react';

export const InfoModal: React.FC = () => {
  const { isInfoModalOpen, setIsInfoModalOpen } = useDebate();

  if (!isInfoModalOpen) return null;

  const close = () => {
    soundFx.playClick();
    setIsInfoModalOpen(null);
  };

  const renderContent = () => {
    switch (isInfoModalOpen) {
      case 'about':
        return (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Dialectic Platform</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">About AI Debate Arena</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              AI Debate Arena is a competitive reasoning and intellectual training gym designed to challenge your arguments, eliminate cognitive biases, and refine dialectic rhetoric.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Unlike generic chatbot assistants that defer or agree, our arena AI is programmed as an intellectual adversary that audits your premises, interrogates assumptions, demands empirical evidence, and forces you to confront counter-arguments under time constraints.
            </p>
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
              <strong>Core Philosophy:</strong> "You don't truly understand an argument until you can convincingly articulate the strongest counterargument to your own position."
            </div>
          </>
        );

      case 'how-it-works':
        return (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Step-by-step Architecture</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">How It Works</h3>
            <div className="space-y-3.5 my-4">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-cyan-400 text-sm">01</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Choose a Topic & Side</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select from 9 intellectual disciplines or create your own custom thesis. Choose whether to defend FOR or AGAINST.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-cyan-400 text-sm">02</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Configure Arena Constraints</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pick your opponent difficulty (Beginner up to Devil's Advocate) and optional round timers (60s, 90s, 2min).
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-cyan-400 text-sm">03</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Clash in the Arena</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exchange speech cards. The AI responds with targeted Counterarguments, Challenges, Questions, Rebuttals, or Logic Checks.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-cyan-400 text-sm">04</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Analyze & Switch Sides</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive scorecards on Logic, Clarity, Evidence, and Rebuttal. Flip perspectives with the Switch Sides button to master both angles.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case 'privacy':
        return (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>Intellectual Confidentiality</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">Privacy Policy</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Your debate arguments and logic performance records are stored locally in your browser session and are never sold or used for model training without explicit consent.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              We uphold intellectual safety: debate any controversial resolution freely in an adversarial testing sandbox.
            </p>
          </>
        );

      case 'terms':
        return (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Code of Dialectic Conduct</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">Terms of Arena</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              AI Debate Arena is intended for intellectual growth, educational discourse, competitive forensics practice, and analytical enhancement.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Arguments generated by the AI opponent are simulated positions designed to stress-test human reasoning and do not represent personal endorsements.
            </p>
          </>
        );

      case 'contact':
        return (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Mail className="w-4 h-4" />
              <span>Arena Forensics Team</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">Contact & Feedback</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Have suggestions for new debate categories, fallacy detectors, or competitive ranking modes? Connect with our team.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div><strong>Email:</strong> arena@intellect.arena</div>
              <div><strong>Community:</strong> @AIDebateArena</div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#090d1a] border border-cyan-500/25 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/50">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {renderContent()}

        <div className="mt-6 flex justify-end">
          <button
            onClick={close}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
