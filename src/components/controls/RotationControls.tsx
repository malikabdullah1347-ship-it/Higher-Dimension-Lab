import { RotationPlane4D } from '../../engine/math/Matrix4D';
import { RotationState, Preset4DRotation } from '../../engine/transforms/TransformationPipeline4D';
import { Play, Pause, RotateCcw, Compass, Zap } from 'lucide-react';

interface RotationControlsProps {
  state: RotationState;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onAngleChange: (plane: RotationPlane4D, angleRad: number) => void;
  onVelocityChange: (plane: RotationPlane4D, vel: number) => void;
  onTogglePlane: (plane: RotationPlane4D) => void;
  onSelectPreset: (preset: Preset4DRotation) => void;
}

const PLANES_METADATA: {
  plane: RotationPlane4D;
  label: string;
  type: 'SPATIAL' | 'HYPER_DEPTH';
  desc: string;
}[] = [
  { plane: 'XW', label: 'XW Plane', type: 'HYPER_DEPTH', desc: 'Rotates X into 4th axis W (Inside-Out Inversion)' },
  { plane: 'YW', label: 'YW Plane', type: 'HYPER_DEPTH', desc: 'Rotates Y into 4th axis W (Vertical Hyper-tilt)' },
  { plane: 'ZW', label: 'ZW Plane', type: 'HYPER_DEPTH', desc: 'Rotates Z into 4th axis W (Depth Hyper-tilt)' },
  { plane: 'XY', label: 'XY Plane', type: 'SPATIAL', desc: 'Standard 3D in-plane rotation (Roll)' },
  { plane: 'XZ', label: 'XZ Plane', type: 'SPATIAL', desc: 'Standard 3D horizontal rotation (Yaw)' },
  { plane: 'YZ', label: 'YZ Plane', type: 'SPATIAL', desc: 'Standard 3D vertical rotation (Pitch)' },
];

export function RotationControls({
  state,
  isPaused,
  onTogglePause,
  onReset,
  onAngleChange,
  onVelocityChange,
  onTogglePlane,
  onSelectPreset,
}: RotationControlsProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
      {/* Header & Global Transport */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-white tracking-wide">
            4D ROTATION ENGINE (SO(4))
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePause}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              isPaused
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reset all rotation angles to zero"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Rotation Presets */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Rotation Experiments / Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onSelectPreset('SIMPLE_XW')}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-left transition-all"
          >
            <div className="font-bold text-cyan-400">Simple XW</div>
            <div className="text-[9px] text-slate-500">Inside-Out Inversion</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('DOUBLE_ORTHOGONAL')}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-slate-300 text-left transition-all"
          >
            <div className="font-bold text-purple-400">Double (XW+YZ)</div>
            <div className="text-[9px] text-slate-500">Orthogonal 2-Planes</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('CLIFFORD_ISOCLINIC')}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-left transition-all"
          >
            <div className="font-bold text-emerald-400">Clifford Isoclinic</div>
            <div className="text-[9px] text-slate-500">Equal Angular Speeds</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('SPATIAL_3D')}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-left transition-all"
          >
            <div className="font-bold text-amber-400">3D Spatial (XY)</div>
            <div className="text-[9px] text-slate-500">W Fixed Invariant</div>
          </button>
        </div>
      </div>

      {/* 6 Independent Rotation Planes Grid */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Six Fundamental 4D Rotation Planes (Select & Adjust)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PLANES_METADATA.map(({ plane, label, type, desc }) => {
            const isActive = state.activePlanes[plane];
            const angle = state.angles[plane];
            const vel = state.velocities[plane];
            const angleDeg = Math.round((angle * 180) / Math.PI) % 360;

            return (
              <div
                key={plane}
                className={`p-2.5 rounded-lg border transition-all ${
                  isActive
                    ? type === 'HYPER_DEPTH'
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-sm shadow-cyan-950/50'
                      : 'bg-purple-950/30 border-purple-500/50 shadow-sm shadow-purple-950/50'
                    : 'bg-slate-950 border-slate-800/80 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onTogglePlane(plane)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                        isActive
                          ? type === 'HYPER_DEPTH'
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-purple-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {plane}
                    </button>
                    <span className="text-[11px] text-slate-200 font-medium">{label}</span>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-300">
                    {angleDeg >= 0 ? `+${angleDeg}°` : `${angleDeg}°`}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400 mb-2 truncate" title={desc}>
                  {desc}
                </div>

                {/* Angle Scrubber */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Angle</span>
                    <span>{(angle / Math.PI).toFixed(2)}π</span>
                  </div>
                  <input
                    type="range"
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.02}
                    value={angle}
                    onChange={(e) => onAngleChange(plane, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Velocity Scrubber */}
                <div className="space-y-1 mt-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Angular Velocity</span>
                    <span>{vel.toFixed(2)} rad/s</span>
                  </div>
                  <input
                    type="range"
                    min={-2.0}
                    max={2.0}
                    step={0.05}
                    value={vel}
                    onChange={(e) => onVelocityChange(plane, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
