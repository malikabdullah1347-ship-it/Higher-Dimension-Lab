import { Geometry4D, CrossSectionTelemetry, ObservationMode } from '../../engine/geometry/types';
import { RotationState } from '../../engine/transforms/TransformationPipeline4D';
import { EpistemicBadge } from '../common/EpistemicBadge';
import { Activity, ShieldCheck, Sigma, Compass, Layers, Scissors, Eye } from 'lucide-react';

interface ScientificTelemetryPanelProps {
  geometry: Geometry4D;
  mode: ObservationMode;
  w: number;
  projectionDistance: number;
  rotationState: RotationState;
  sliceTelemetry: CrossSectionTelemetry;
  onOpenEpistemicLegend: () => void;
}

export function ScientificTelemetryPanel({
  geometry,
  mode,
  w,
  projectionDistance,
  rotationState,
  sliceTelemetry,
  onOpenEpistemicLegend,
}: ScientificTelemetryPanelProps) {
  // Determine active rotating planes
  const activePlanes = Object.entries(rotationState.activePlanes)
    .filter(([_, active]) => active)
    .map(([plane]) => plane);

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-4 shadow-xl">
      {/* Instrument Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">
            LIVE 4D TELEMETRY TELEMETRICS
          </span>
        </div>

        <EpistemicBadge
          status={geometry.epistemicStatus}
          size="sm"
          interactive={true}
          onInspect={onOpenEpistemicLegend}
        />
      </div>

      {/* Primary Status Matrix */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">DIMENSION SPACE</div>
          <div className="text-white font-bold text-xs flex items-center gap-1">
            <span>ℝ⁴ (Euclidean 4-Space)</span>
          </div>
          <div className="text-[9px] text-slate-500 font-sans">SO(4) Rotation Lie Group</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">ACTIVE GEOMETRY</div>
          <div className="text-cyan-400 font-bold text-xs truncate" title={geometry.name}>
            {geometry.name}
          </div>
          <div className="text-[9px] text-slate-500 font-sans">{geometry.schläfliSymbol}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">OBSERVATION MODE</div>
          <div className="text-purple-300 font-bold text-xs flex items-center gap-1.5">
            {mode === 'PROJECTION' && <Eye className="w-3 h-3 text-cyan-400" />}
            {mode === 'SLICE' && <Scissors className="w-3 h-3 text-purple-400" />}
            {mode === 'COMPARE' && <Layers className="w-3 h-3 text-emerald-400" />}
            <span>{mode}</span>
          </div>
          <div className="text-[9px] text-slate-500 font-sans">
            {mode === 'PROJECTION' ? '4D Shadow in ℝ³' : mode === 'SLICE' ? 'ℝ³ Hyperplane Cut' : 'Side-by-Side Verification'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">ACTIVE ROTATION PLANES</div>
          <div className="text-white font-bold text-xs">
            {activePlanes.length > 0 ? activePlanes.join(' + ') : 'STATIC (NO ROTATION)'}
          </div>
          <div className="text-[9px] text-slate-500 font-sans">
            {activePlanes.length >= 2 ? 'Double Orthogonal Rotation' : 'Single Plane Rotation'}
          </div>
        </div>
      </div>

      {/* 4D Combinatorics vs 3D Cross-Section Comparison Grid */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Combinatorial Topology Invariants</span>
          <span className="text-[9px] text-slate-500">4D Polytope vs 3D Slice</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[9px] text-slate-500">VERTICES</div>
            <div className="text-white font-bold text-xs">{geometry.vertices.length}</div>
            <div className="text-[9px] text-purple-400 pt-0.5 border-t border-slate-800/60 mt-1">
              {sliceTelemetry.activeVertices} cut
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[9px] text-slate-500">EDGES</div>
            <div className="text-white font-bold text-xs">{geometry.edges.length}</div>
            <div className="text-[9px] text-purple-400 pt-0.5 border-t border-slate-800/60 mt-1">
              {sliceTelemetry.activeEdges} cut
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[9px] text-slate-500">2D FACES</div>
            <div className="text-white font-bold text-xs">{geometry.faces.length}</div>
            <div className="text-[9px] text-purple-400 pt-0.5 border-t border-slate-800/60 mt-1">
              {sliceTelemetry.activeFaces} cut
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[9px] text-slate-500">CELLS (3D)</div>
            <div className="text-white font-bold text-xs">
              {geometry.cells.length || '—'}
            </div>
            <div className="text-[9px] text-purple-400 pt-0.5 border-t border-slate-800/60 mt-1">
              1 solid
            </div>
          </div>
        </div>
      </div>

      {/* Slicing State Telemetry */}
      <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-900/30 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-purple-400 font-bold uppercase">W Hyperplane Status</span>
          <span className="font-bold text-white">w = {w >= 0 ? `+${w.toFixed(3)}` : w.toFixed(3)}</span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Cross-Section Topology:</span>
          <span className="text-purple-300 font-bold">{sliceTelemetry.shapeClassification}</span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Slice Volume:</span>
          <span className="text-white">
            {sliceTelemetry.estimatedVolume !== null ? `${sliceTelemetry.estimatedVolume.toFixed(3)} units³` : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>4D Projection Distance (d₄):</span>
          <span className="text-cyan-300">{projectionDistance.toFixed(2)} units</span>
        </div>
      </div>

      {/* Epistemic Demarcation Note */}
      <div className="text-[10px] font-sans text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
        <strong className="text-cyan-300">Epistemic Protocol:</strong> This telemetry represents proven deductive mathematics in ℝ⁴. No physical 4th macroscopic spatial dimension has been discovered experimentally.
      </div>
    </div>
  );
}
