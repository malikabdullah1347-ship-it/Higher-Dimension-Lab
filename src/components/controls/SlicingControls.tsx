import { CrossSectionTelemetry } from '../../engine/geometry/types';
import { 
  Scissors, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface SlicingControlsProps {
  w: number;
  onWChange: (w: number) => void;
  isSweeping: boolean;
  onToggleSweep: () => void;
  sweepSpeed: number;
  onSweepSpeedChange: (speed: number) => void;
  onStepW: (delta: number) => void;
  onResetW: () => void;
  telemetry: CrossSectionTelemetry;
  wBounds: [number, number];
  onOpenSliceVsProjection: () => void;
}

export function SlicingControls({
  w,
  onWChange,
  isSweeping,
  onToggleSweep,
  sweepSpeed,
  onSweepSpeedChange,
  onStepW,
  onResetW,
  telemetry,
  wBounds,
  onOpenSliceVsProjection,
}: SlicingControlsProps) {
  const [minW, maxW] = wBounds;
  const sliderMin = Math.min(-2.2, minW * 1.3);
  const sliderMax = Math.max(2.2, maxW * 1.3);

  const getStatusBadge = () => {
    switch (telemetry.intersectionStatus) {
      case 'INTERSECTING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 animate-pulse">
            INTERSECTING HYPERPLANE
          </span>
        );
      case 'TANGENT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
            TANGENT BOUNDARY (POINT CONTACT)
          </span>
        );
      case 'EMPTY':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
            EXTERIOR (w ∉ OBJECT BOUNDS)
          </span>
        );
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-purple-900/40 space-y-4 shadow-lg shadow-purple-950/20">
      {/* Header & Scientific Principle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                REAL 4D HYPERPLANE SLICING (w = w₀)
              </span>
              {getStatusBadge()}
            </div>
            <p className="text-[11px] text-slate-400">
              Calculates the exact ℝ³ cross-section cut by a 3D hyperplane moving along the 4th axis.
            </p>
          </div>
        </div>

        {/* Slice != Projection callout button */}
        <button
          type="button"
          onClick={onOpenSliceVsProjection}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 self-start sm:self-auto transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Slice ≠ Projection</span>
        </button>
      </div>

      {/* Primary W Coordinate Scrubber */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] uppercase">Hyperplane Coordinate:</span>
            <span className="text-base font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
              w₀ = {w >= 0 ? `+${w.toFixed(3)}` : w.toFixed(3)}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Object 4D Span: [{minW.toFixed(2)}, {maxW.toFixed(2)}]
          </div>
        </div>

        {/* Slider with ruler markers */}
        <div className="space-y-1 relative">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={0.01}
            value={w}
            onChange={(e) => onWChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />

          {/* Scale Labels */}
          <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
            <span>{sliderMin.toFixed(1)} (Past)</span>
            <span className="cursor-pointer hover:text-purple-300" onClick={onResetW}>
              w = 0.0 (Equator)
            </span>
            <span>+{sliderMax.toFixed(1)} (Future)</span>
          </div>
        </div>

        {/* Step & Sweep Transport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onStepW(-0.1)}
              title="Step -0.1 along W"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-0.5 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>-0.1</span>
            </button>

            <button
              type="button"
              onClick={() => onStepW(-0.02)}
              title="Step -0.02 along W"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-mono transition-all"
            >
              -0.02
            </button>

            <button
              type="button"
              onClick={onResetW}
              title="Center hyperplane at w = 0"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Center w=0</span>
            </button>

            <button
              type="button"
              onClick={() => onStepW(0.02)}
              title="Step +0.02 along W"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-mono transition-all"
            >
              +0.02
            </button>

            <button
              type="button"
              onClick={() => onStepW(0.1)}
              title="Step +0.1 along W"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-0.5 transition-all"
            >
              <span>+0.1</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Automated W Sweep Animation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSweep}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isSweeping
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'bg-slate-800 hover:bg-purple-950 text-purple-300 border border-purple-500/40'
              }`}
            >
              {isSweeping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSweeping ? 'Sweeping W...' : 'Auto-Sweep W'}</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <span>Speed:</span>
              <input
                type="range"
                min={0.2}
                max={2.0}
                step={0.1}
                value={sweepSpeed}
                onChange={(e) => onSweepSpeedChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Cross-Section Telemetry Readout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">3D SLICE SHAPE</div>
          <div className="text-purple-300 font-bold mt-0.5 truncate" title={telemetry.shapeClassification}>
            {telemetry.shapeClassification}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">INTERSECTION VERTICES</div>
          <div className="text-white font-bold mt-0.5">
            {telemetry.activeVertices} pts
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">INTERSECTION FACES</div>
          <div className="text-white font-bold mt-0.5">
            {telemetry.activeFaces} polygons
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">CROSS-SECTION VOLUME</div>
          <div className="text-purple-400 font-bold mt-0.5">
            {telemetry.estimatedVolume !== null ? telemetry.estimatedVolume.toFixed(3) : '—'}
          </div>
        </div>
      </div>

      {/* Scientific Principle Reminder */}
      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed flex gap-2.5">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">What you are observing:</strong> You are not seeing the complete 4D object. You are observing its instantaneous 3D intersection with the hyperplane <code className="font-mono text-purple-300">w = {w.toFixed(2)}</code>. Just as a 2D Flatlander sees a circle grow and shrink when a 3D sphere passes through their plane, a 3D observer sees 3D polyhedra morph continuously as the 4D object moves along the 4th spatial axis.
        </p>
      </div>
    </div>
  );
}
