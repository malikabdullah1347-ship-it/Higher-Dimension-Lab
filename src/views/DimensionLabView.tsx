import { useState } from 'react';
import { DimensionId } from '../types';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { DimensionCanvasPreview } from '../components/visualization/DimensionCanvasPreview';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { 
  Box, 
  Orbit, 
  Sparkles, 
  Layers, 
  MoveRight, 
  Cpu, 
  CheckCircle2, 
  Info, 
  Compass, 
  Sigma,
  Split,
  Maximize2
} from 'lucide-react';

interface DimensionLabViewProps {
  activeDimension: DimensionId;
  onSelectDimension: (dim: DimensionId) => void;
  onOpenEpistemicLegend: () => void;
}

export function DimensionLabView({
  activeDimension,
  onSelectDimension,
  onOpenEpistemicLegend,
}: DimensionLabViewProps) {
  const currentDim = DIMENSIONS_DATA.find((d) => d.id === activeDimension) || DIMENSIONS_DATA[3];
  const [activeTab, setActiveTab] = useState<'PROJECTION' | 'PROPERTIES' | 'ANALOGY' | 'ROADMAP'>('PROJECTION');

  // Combinatorics calculations for hypercubes
  const n = currentDim.order;
  const rotationPlanes = (n * (n - 1)) / 2;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Dimensional Continuum Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
              MODULE 01
            </span>
            <span className="text-xs font-mono text-slate-400">GEOMETRIC CONTINUUM WORKSTATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Dimension Lab: <span className="text-cyan-400">{currentDim.id} — {currentDim.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore dimensional degrees of freedom, coordinate mappings, hypercube combinatorics, and orthogonal projection geometry.
          </p>
        </div>

        {/* Dimension Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {DIMENSIONS_DATA.map((d) => (
            <button
              key={d.id}
              type="button"
              id={`dim-lab-tab-${d.id}`}
              onClick={() => onSelectDimension(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeDimension === d.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{d.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Projection Viewport & Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Projection Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <DimensionCanvasPreview
            dimension={activeDimension}
            onDimensionChange={onSelectDimension}
            interactive={true}
          />

          {/* Slicing / Cross-Section Analogy Preview Banner */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <Split className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-purple-300 font-display">
                Cross-Section Principle for {currentDim.id}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentDim.crossSectionAnalogy}
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Shadow Projection: {currentDim.projectionAnalogy}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Specs & Epistemic Demarcation */}
        <div className="lg:col-span-5 space-y-4">
          {/* Epistemic Status Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">EPISTEMOLOGICAL STATUS</span>
              <EpistemicBadge
                status={currentDim.epistemicStatus}
                size="md"
                interactive={true}
                onInspect={onOpenEpistemicLegend}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentDim.statusNote}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">PHYSICAL REALITY STATUS:</span>
                <span className="text-slate-300">{currentDim.physicalStatus}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">MATHEMATICAL STATUS:</span>
                <span className="text-slate-300">{currentDim.mathematicalStatus}</span>
              </div>
            </div>
          </div>

          {/* Geometric Combinatorics Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                {currentDim.id} Hypercube Topology (n = {n})
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Archetype: {currentDim.geometricArchetype.split('/')[0]}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">COORDINATES</div>
                <div className="text-cyan-300 font-bold mt-0.5">{currentDim.coordinateNotation}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">DEGREES OF FREEDOM</div>
                <div className="text-white font-bold mt-0.5">{currentDim.degreesOfFreedom}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">ROTATION PLANES</div>
                <div className="text-purple-400 font-bold mt-0.5">{rotationPlanes}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">VERTICES (2ⁿ)</div>
                <div className="text-white font-bold mt-0.5">{currentDim.vertices}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">EDGES (n·2ⁿ⁻¹)</div>
                <div className="text-white font-bold mt-0.5">{currentDim.edges}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">FACES (C(n,2)·2ⁿ⁻²)</div>
                <div className="text-white font-bold mt-0.5">{currentDim.faces}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">3D CELLS</div>
                <div className="text-white font-bold mt-0.5">{currentDim.cells}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 col-span-2">
                <div className="text-[10px] text-slate-500">4D HYPERCELLS</div>
                <div className="text-white font-bold mt-0.5">{currentDim.hypercells}</div>
              </div>
            </div>

            {/* Formula Reference */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-cyan-400 font-semibold">GENERAL RECURSION FORMULA:</div>
              <div>Vertices: V(n) = 2ⁿ</div>
              <div>Edges: E(n) = n · 2ⁿ⁻¹</div>
              <div>Hyper-Volume: V_n = Lⁿ</div>
            </div>
          </div>

          {/* Future Modules Planned For This Dimension */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>PHASE 2 & 3 EXPANSION ROADMAP</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Planned for {currentDim.id}:</strong> {currentDim.futureModulePlanned}
            </p>
          </div>
        </div>
      </div>

      {/* Dimensional Analogy Walkthrough (Recursive generation) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold font-display text-white">
            The Dimensional Analogy: Constructing Higher Spaces
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Higher dimensions cannot be visualized directly with human 3D retinas. Instead, we use the rigorous method of dimensional analogy pioneered by Abbott, Hinton, and Coxeter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-cyan-400 font-mono font-bold">0D → 1D</div>
            <div className="font-semibold text-white">Point to Line</div>
            <p className="text-slate-400 text-[11px]">
              Take a single 0D point. Drag it 1 unit along a new perpendicular axis. You obtain a 1D line segment with 2 vertices.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-cyan-400 font-mono font-bold">1D → 2D</div>
            <div className="font-semibold text-white">Line to Square</div>
            <p className="text-slate-400 text-[11px]">
              Take the 1D segment. Drag it perpendicularly along a second axis. You obtain a 2D square with 4 vertices and 4 edges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-cyan-400 font-mono font-bold">2D → 3D</div>
            <div className="font-semibold text-white">Square to Cube</div>
            <p className="text-slate-400 text-[11px]">
              Take the 2D square. Drag it along an axis perpendicular to both. You obtain a 3D cube with 8 vertices and 6 square faces.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-cyan-400 font-mono font-bold">3D → 4D</div>
            <div className="font-semibold text-white">Cube to Tesseract</div>
            <p className="text-slate-400 text-[11px]">
              Take the 3D cube. Drag it along an orthogonal axis w perpendicular to all three. You obtain an 8-cell tesseract with 16 vertices.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-cyan-400 font-mono font-bold">4D → 5D</div>
            <div className="font-semibold text-white">Tesseract to Penteract</div>
            <p className="text-slate-400 text-[11px]">
              Take the 4D tesseract. Drag it along an orthogonal 5th axis v. You obtain a 5D penteract with 32 vertices and 10 cubic hypercells.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
