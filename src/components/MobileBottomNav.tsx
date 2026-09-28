import React from 'react';
import { useDebate, AppView } from '../context/DebateContext';
import { LayoutDashboard, Compass, Swords, History, User } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useDebate();

  const handleNav = (view: AppView) => {
    soundFx.playClick();
    setCurrentView(view);
  };

  const navItems = [
    { view: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { view: 'topics' as AppView, label: 'Topics', icon: Compass },
    { view: 'start' as AppView, label: 'Arena', icon: Swords, highlight: true },
    { view: 'history' as AppView, label: 'History', icon: History },
    { view: 'profile' as AppView, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070a14]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;
        if (item.highlight) {
          return (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white active:scale-95 transition-transform">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-cyan-400 mt-1">Clash</span>
            </button>
          );
        }

        return (
          <button
            key={item.view}
            onClick={() => handleNav(item.view)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
