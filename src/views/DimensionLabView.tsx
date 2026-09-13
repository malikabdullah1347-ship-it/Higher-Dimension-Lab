import { useState } from 'react';
import { DimensionId } from '../types';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { DimensionCanvasPreview } from '../components/visualization/DimensionCanvasPreview';
import { FourDimensionWorkstation } from '../components/visualization/FourDimensionWorkstation';
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
  Maximize2,
  Atom,
  Scissors
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
  const [subView4D, setSubView4D] = useState<'ENGINE' | 'COMBINATORICS'>('ENGINE');

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
            {activeDimension === '4D' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                PHASE 2 4D ENGINE ACTIVE
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Dimension Lab: <span className="text-cyan-400">{currentDim.id} — {currentDim.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {activeDimension === '4D'
              ? 'Real 4D computational visualization engine: perspective projection, SO(4) double rotation planes, and hyperplane slicing (w = w₀).'
              : 'Explore dimensional degrees of freedom, coordinate mappings, hypercube combinatorics, and orthogonal projection geometry.'}
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
              {d.id === '4D' && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4D-SPECIFIC WORKSTATION */}
      {activeDimension === '4D' ? (
        <div className="space-y-6">
          {/* Sub-view switcher for 4D */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">4D View Mode:</span>
              <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSubView4D('ENGINE')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    subView4D === 'ENGINE'
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>Real 4D Visualization Engine</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubView4D('COMBINATORICS')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    subView4D === 'COMBINATORICS'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sigma className="w-3.5 h-3.5" />
                  <span>Combinatorics & Epistemology</span>
                </button>
              </div>
            </div>
          </div>

          {subView4D === 'ENGINE' ? (
            <FourDimensionWorkstation onOpenEpistemicLegend={onOpenEpistemicLegend} />
          ) : (
            /* Combinatorics & Topology Specs for 4D */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <DimensionCanvasPreview
                  dimension="4D"
                  onDimensionChange={onSelectDimension}
                  interactive={true}
                />
              </div>

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
                      4D Hypercube Topology (n = 4)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Tesseract (8-cell)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">COORDINATES</div>
                      <div className="text-cyan-300 font-bold mt-0.5">(x, y, z, w)</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">DEGREES OF FREEDOM</div>
                      <div className="text-white font-bold mt-0.5">4 Spatial</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">ROTATION PLANES</div>
                      <div className="text-purple-400 font-bold mt-0.5">6 Planes</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">VERTICES (2⁴)</div>
                      <div className="text-white font-bold mt-0.5">16</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">EDGES (4·2³)</div>
                      <div className="text-white font-bold mt-0.5">32</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">2D FACES</div>
                      <div className="text-white font-bold mt-0.5">24</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">3D CELLS</div>
                      <div className="text-white font-bold mt-0.5">8 Cubes</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 col-span-2">
                      <div className="text-[10px] text-slate-500">4D HYPERCELLS</div>
                      <div className="text-white font-bold mt-0.5">1 Tesseract</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* OTHER DIMENSIONS (1D, 2D, 3D, 5D) */
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
            {/* Jump to 4D Real Engine Promotion Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                  EXPERIENCE 4D COMPUTATIONAL ENGINE
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              </div>
              <p className="text-xs text-slate-300">
                Explore our fully developed 4D geometric laboratory with real hyperplane slicing, SO(4) rotation planes, and perspective shadow projection.
              </p>
              <button
                type="button"
                onClick={() => onSelectDimension('4D')}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 mt-1"
              >
                <span>Launch 4D Engine Workstation</span>
                <MoveRight className="w-3.5 h-3.5" />
              </button>
            </div>

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
          </div>
        </div>
      )}

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
