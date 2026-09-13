import { useRef } from 'react';
import { DimensionId, ModuleId } from '../types';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { DimensionalObservatoryHero } from '../components/visualization/DimensionalObservatoryHero';
import { TwoDimensionLiveWorld } from '../components/visualization/TwoDimensionLiveWorld';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { 
  Layers, 
  Clock, 
  BookOpen, 
  FlaskConical, 
  Rocket, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  Atom,
  Sliders,
  Compass
} from 'lucide-react';

interface DashboardViewProps {
  onSelectModule: (module: ModuleId) => void;
  activeDimension: DimensionId;
  onSelectDimension: (dim: DimensionId) => void;
  onOpenEpistemicLegend: () => void;
}

export function DashboardView({
  onSelectModule,
  activeDimension,
  onSelectDimension,
  onOpenEpistemicLegend,
}: DashboardViewProps) {
  const twoDWorldRef = useRef<HTMLDivElement | null>(null);

  const scrollTo2DWorld = () => {
    twoDWorldRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentDimData = DIMENSIONS_DATA.find((d) => d.id === activeDimension) || DIMENSIONS_DATA[3];

  const coreModules = [
    {
      id: 'dimension-lab' as ModuleId,
      title: 'Dimension Lab',
      subtitle: 'Geometric Continuum 1D → 5D',
      desc: 'Interactive 4D computational engine with SO(4) rotations, perspective projections, and real hyperplane slicing.',
      icon: Layers,
      status: 'MATHEMATICAL',
      highlight: 'Interactive 4D Engine',
    },
    {
      id: 'time-lab' as ModuleId,
      title: 'Time & Spacetime Lab',
      subtitle: 'Relativistic 4D (3+1)D vs 4D Spatial',
      desc: 'Minkowski metric, light cones, and why time is not simply an orthogonal 4th spatial direction.',
      icon: Clock,
      status: 'ESTABLISHED',
      highlight: 'Empirical Physics',
    },
    {
      id: 'codex' as ModuleId,
      title: "Explorer's Codex",
      subtitle: '300+ Dimension Encyclopedia',
      desc: 'Peer-reviewed mathematical treatises, historical Abbott/Hinton analogies, and topological definitions.',
      icon: BookOpen,
      status: 'MATHEMATICAL',
      highlight: 'Archive',
    },
    {
      id: 'experiments' as ModuleId,
      title: 'Experiments Lab',
      subtitle: 'Thought Experiments & Tests',
      desc: 'Flatland analogies, 4D knot trivialization tests, shadow projections, and sub-millimeter gravity limits.',
      icon: FlaskConical,
      status: 'HYPOTHETICAL',
      highlight: 'Hypothesis Bench',
    },
    {
      id: 'frontier' as ModuleId,
      title: 'Frontier 5D Physics',
      subtitle: 'Kaluza-Klein & Compactification',
      desc: 'Theoretical models of curled-up spatial dimensions, string dualities, and LHC empirical energy bounds.',
      icon: Rocket,
      status: 'HYPOTHETICAL',
      highlight: 'Theoretical',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* 1. TOP HERO: Dimensional Observatory Centerpiece */}
      <section aria-label="Dimensional Observatory">
        <DimensionalObservatoryHero
          activeDimension={activeDimension}
          onSelectDimension={onSelectDimension}
          onSelectModule={onSelectModule}
          onOpenEpistemicLegend={onOpenEpistemicLegend}
          onJumpTo2DWorld={scrollTo2DWorld}
        />
      </section>

      {/* 2. UNDER HERO: Compact Current Exploration State Bar */}
      <section 
        aria-label="Exploration Status"
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-md"
      >
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">CURRENT EXPLORATION</span>
            <span className="text-cyan-300 font-bold text-sm">{activeDimension} CONTINUUM</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div>
            <span className="text-slate-500 text-[10px] uppercase block">ACTIVE OBJECT</span>
            <span className="text-slate-200 font-bold text-sm">
              {activeDimension === '4D' ? 'Tesseract (8-Cell)' : currentDimData.name}
            </span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div>
            <span className="text-slate-500 text-[10px] uppercase block">EXPLORATION MODE</span>
            <span className="text-slate-200 font-medium text-sm">Perspective Shadow & 3D Slice</span>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-800" />

          <div className="hidden md:block">
            <span className="text-slate-500 text-[10px] uppercase block">SCIENTIFIC STATUS</span>
            <span className="text-purple-300 font-medium text-sm">
              {currentDimData.epistemicStatus} (ISO-EP Class)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectModule('dimension-lab')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-display tracking-wider transition-all flex items-center gap-2"
          >
            <span>Open Dimension Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. NEW INTERACTIVE 2D LIVE DIMENSIONAL WORLD */}
      <section ref={twoDWorldRef} aria-label="Interactive 2D World">
        <TwoDimensionLiveWorld />
      </section>

      {/* 4. LOWER SECTION: Explore Dimensions Progression (1D -> 2D -> 3D -> 4D -> 5D) */}
      <section aria-label="Dimensional Progression" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              DIMENSIONAL PROGRESSION
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              The 1D → 5D Mathematical Hierarchy
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectModule('dimension-lab')}
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <span>Launch Complete Workstation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DIMENSIONS_DATA.map((dim) => {
            const isSelected = activeDimension === dim.id;
            return (
              <div
                key={dim.id}
                id={`dashboard-dim-card-${dim.id}`}
                onClick={() => {
                  onSelectDimension(dim.id);
                  onSelectModule('dimension-lab');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold font-display text-white">
                      {dim.id}
                    </span>
                    <EpistemicBadge status={dim.epistemicStatus} size="sm" />
                  </div>

                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    {dim.name}
                  </div>

                  <div className="text-xs font-mono text-cyan-400/90 mb-3">
                    {dim.algebraicStructure}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between font-mono">
                      <span>Coordinates:</span>
                      <span className="text-slate-200">{dim.coordinateNotation}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Vertices (2ⁿ):</span>
                      <span className="text-cyan-300">{dim.vertices}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Edges (n·2ⁿ⁻¹):</span>
                      <span className="text-slate-200">{dim.edges}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-cyan-300">
                  <span>Enter {dim.id}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SCIENTIFIC RESTRAINT & RIGOR FRAMEWORK */}
      <section 
        aria-label="Epistemic Rigor Standards"
        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-display text-white">
              Strict Epistemic Demarcation Protocol
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenEpistemicLegend}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View 5-Tier Scientific Criteria</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Higher Dimension Lab enforces an objective demarcation standard between established physical reality (3D space, relativistic spacetime), consistent mathematical geometry (4D & 5D manifolds), and speculative hypotheses. No macroscopic 4th or 5th physical spatial dimension has been empirically verified.
        </p>
      </section>

      {/* 6. LABORATORY MODULES DIRECTORY */}
      <section aria-label="Laboratory Modules" className="space-y-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
            LABORATORY ARCHITECTURE
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Specialized Scientific Workstations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreModules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                id={`dashboard-module-${m.id}`}
                onClick={() => onSelectModule(m.id)}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 p-5 transition-all hover:border-slate-700 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <EpistemicBadge status={m.status as any} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                      {m.title}
                    </h3>
                    <div className="text-xs font-mono text-cyan-400/80 mt-0.5">
                      {m.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                  <span>{m.highlight}</span>
                  <div className="flex items-center gap-1">
                    <span>Enter</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
