import { DimensionId } from '../../types';
import { ArrowRight, Box, MoveRight, Layers, Sparkles, Orbit } from 'lucide-react';

interface DimensionIndicatorProps {
  currentDimension: DimensionId;
  onSelectDimension?: (dim: DimensionId) => void;
  compact?: boolean;
}

export function DimensionIndicator({
  currentDimension,
  onSelectDimension,
  compact = false
}: DimensionIndicatorProps) {
  const dimensions: { id: DimensionId; label: string; desc: string; icon: any }[] = [
    { id: '1D', label: '1D', desc: 'Line', icon: MoveRight },
    { id: '2D', label: '2D', desc: 'Plane', icon: Layers },
    { id: '3D', label: '3D', desc: 'Space', icon: Box },
    { id: '4D', label: '4D', desc: 'Tesseract', icon: Orbit },
    { id: '5D', label: '5D', desc: 'Penteract', icon: Sparkles },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
      {dimensions.map((d, index) => {
        const isActive = currentDimension === d.id;
        const Icon = d.icon;
        return (
          <div key={d.id} className="flex items-center">
            <button
              type="button"
              id={`dim-selector-${d.id}`}
              onClick={() => onSelectDimension?.(d.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{d.label}</span>
              {!compact && (
                <span className="hidden md:inline text-[10px] text-slate-500 font-sans">
                  {d.desc}
                </span>
              )}
            </button>
            {index < dimensions.length - 1 && (
              <span className="text-slate-700 px-0.5 select-none">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
