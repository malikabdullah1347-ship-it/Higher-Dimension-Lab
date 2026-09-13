import { Projection4DConfig } from '../../engine/projections/PerspectiveProjection4Dto3D';
import { Eye, Layers, Sliders, RotateCcw, Info } from 'lucide-react';

interface ProjectionControlsProps {
  config: Projection4DConfig;
  onDistanceChange: (d: number) => void;
  onOrthographicToggle: (ortho: boolean) => void;
  onScaleChange: (s: number) => void;
  onReset: () => void;
}

export function ProjectionControls({
  config,
  onDistanceChange,
  onOrthographicToggle,
  onScaleChange,
  onReset,
}: ProjectionControlsProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-white tracking-wide">
            4D → 3D PERSPECTIVE PROJECTION
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs font-mono flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-3 text-xs font-mono">
        {/* Distance Slider */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 uppercase text-[11px]">
              4D Focal Distance (d₄):
            </span>
            <span className="text-cyan-300 font-bold">
              {config.orthographic ? '∞ (Orthographic)' : `${config.distance.toFixed(2)} units`}
            </span>
          </div>

          <input
            type="range"
            min={1.4}
            max={7.0}
            step={0.1}
            disabled={config.orthographic}
            value={config.distance}
            onChange={(e) => onDistanceChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-30"
          />

          <div className="flex justify-between text-[9px] text-slate-500">
            <span>1.4 (Strong 4D Perspective / Extreme Distortion)</span>
            <span>7.0 (Near-Orthogonal Parallel Projection)</span>
          </div>
        </div>

        {/* Mode Toggle: Perspective vs Orthographic */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOrthographicToggle(false)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              !config.orthographic
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-xs">Perspective Shadow</div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5">
              Inner cells appear smaller due to hyper-depth distance (s = d₄ / (d₄ - w)).
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOrthographicToggle(true)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              config.orthographic
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-xs">Orthographic Shadow</div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5">
              Infinite 4D focal distance. Preserves parallel lines without hyper-depth distortion.
            </div>
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed flex gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong>Perspective Insight:</strong> Just as a 3D wireframe cube casts a 2D shadow of a &quot;square inside a square&quot; onto a flat screen, a 4D tesseract casts a 3D shadow of a &quot;cube inside a cube&quot; into 3-space. All 8 cubes are geometrically identical in 4D—the inner cube only looks smaller because it is further away along the 4th spatial axis <code className="font-mono text-cyan-300">W</code>.
        </p>
      </div>
    </div>
  );
}
