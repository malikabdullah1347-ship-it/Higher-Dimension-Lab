import { DimensionId, ModuleId } from '../../types';
import { ShieldCheck, Activity, Terminal, ExternalLink } from 'lucide-react';

interface StatusBarProps {
  currentDimension: DimensionId;
  currentModule: ModuleId;
  onOpenEpistemicLegend: () => void;
}

export function StatusBar({ currentDimension, currentModule, onOpenEpistemicLegend }: StatusBarProps) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-xs font-mono text-slate-400 px-4 sm:px-6 py-2.5 select-none">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold">LAB ENGINE: ONLINE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-[11px] text-slate-400">
            DIMENSION: <span className="text-cyan-300 font-bold">{currentDimension}</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="text-[11px] text-slate-400 hidden sm:inline">
            MODULE: <span className="text-slate-200 uppercase">{currentModule}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenEpistemicLegend}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Epistemological Standards (5 Classes)</span>
          </button>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            BUILD: 2026.1-FOUNDATION
          </span>
        </div>
      </div>
    </footer>
  );
}
