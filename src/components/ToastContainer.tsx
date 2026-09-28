import React from 'react';
import { useDebate } from '../context/DebateContext';
import { CheckCircle2, AlertTriangle, Info, Trophy, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDebate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
        let borderClass = 'border-cyan-500/30 bg-[#090f20]/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/30 bg-[#061912]/95';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/30 bg-[#1f1406]/95';
        } else if (toast.type === 'achievement') {
          icon = <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />;
          borderClass = 'border-yellow-500/40 bg-[#1c1606]/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xl shadow-xl flex items-start justify-between gap-3 text-white transition-all transform animate-fade-in ${borderClass}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div>
                <h5 className="text-xs font-semibold tracking-wide text-slate-100">
                  {toast.title}
                </h5>
                {toast.message && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
