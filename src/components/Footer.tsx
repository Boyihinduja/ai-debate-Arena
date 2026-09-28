import React from 'react';
import { useDebate } from '../context/DebateContext';
import { Swords, Shield, HeartHandshake, FileText, HelpCircle, Mail } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsInfoModalOpen } = useDebate();

  const handleLink = (modalKey: string) => {
    soundFx.playClick();
    setIsInfoModalOpen(modalKey);
  };

  return (
    <footer className="border-t border-white/5 bg-[#03050a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-violet-600 p-[1px]">
              <div className="w-full h-full bg-[#070b18] rounded-[7px] flex items-center justify-center">
                <Swords className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base tracking-wide">
                AI DEBATE ARENA
              </span>
              <p className="text-xs text-slate-400 font-sans italic mt-0.5">
                “Think clearly. Argue fairly. Challenge everything.”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => handleLink('about')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
            <button
              onClick={() => handleLink('how-it-works')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentView('topics');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              Topics
            </button>
            <button
              onClick={() => handleLink('privacy')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Privacy</span>
            </button>
            <button
              onClick={() => handleLink('terms')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>
            <button
              onClick={() => handleLink('contact')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Debate Arena. Engineered for dialectic reasoning and critical thinking.</p>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>SYSTEM STATUS: OPTIMAL</span>
            <span>·</span>
            <span>REASONING CORES: ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
