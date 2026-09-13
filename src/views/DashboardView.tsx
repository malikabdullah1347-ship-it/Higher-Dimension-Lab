import { DimensionId, ModuleId } from '../types';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { EPISTEMIC_REGISTRY, SCIENTIFIC_DISCLAIMER } from '../data/epistemicStatus';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { DimensionCanvasPreview } from '../components/visualization/DimensionCanvasPreview';
import { 
  Layers, 
  Clock, 
  BookOpen, 
  FlaskConical, 
  Rocket, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Sigma, 
  Sparkles, 
  Orbit,
  ExternalLink,
  ChevronRight
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
  const activeDimData = DIMENSIONS_DATA.find((d) => d.id === activeDimension) || DIMENSIONS_DATA[2];

  const moduleCards = [
    {
      id: 'dimension-lab' as ModuleId,
      title: 'Dimension Lab',
      subtitle: 'The 1D → 2D → 3D → 4D → 5D Continuum',
      desc: 'Interactive hypercube projections, coordinate degrees of freedom, vertex-edge combinatorics, and multi-plane rotations.',
      icon: Layers,
      color: 'from-cyan-500/20 to-blue-500/10',
      badge: 'Interactive Projections',
      status: 'MATHEMATICAL',
    },
    {
      id: 'time-lab' as ModuleId,
      title: 'Time & Spacetime Lab',
      subtitle: 'Einsteinian 4D (3+1) vs 4D Spatial Geometry',
      desc: 'Minkowski metric, relativistic light-cone causality, and why time is not simply a 4th spatial direction.',
      icon: Clock,
      color: 'from-emerald-500/20 to-teal-500/10',
      badge: 'Empirical Physics',
      status: 'ESTABLISHED',
    },
    {
      id: 'codex' as ModuleId,
      title: "Explorer's Codex",
      subtitle: 'Structured Encyclopedia Foundation',
      desc: 'Rigorous mathematical articles, historical perspectives, and epistemological status classifications.',
      icon: BookOpen,
      color: 'from-purple-500/20 to-indigo-500/10',
      badge: 'Archive Catalog',
      status: 'MATHEMATICAL',
    },
    {
      id: 'experiments' as ModuleId,
      title: 'Experiments & Hypotheses',
      subtitle: 'Thought Experiments & Mathematical Tests',
      desc: 'Flatland slicing, knot trivialization in ℝ⁴, shadow projections, and sub-millimeter gravity null tests.',
      icon: FlaskConical,
      color: 'from-amber-500/20 to-orange-500/10',
      badge: 'Hypothesis Engine',
      status: 'HYPOTHETICAL',
    },
    {
      id: 'frontier' as ModuleId,
      title: 'Frontier 5D Physics',
      subtitle: 'Kaluza-Klein & Compactification',
      desc: 'The theoretical frontier of 5th dimensional unified theories and empirical experimental constraints from LHC.',
      icon: Rocket,
      color: 'from-rose-500/20 to-red-500/10',
      badge: 'Theoretical Frontier',
      status: 'HYPOTHETICAL',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Banner / Lab Statement */}
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>HIGHER DIMENSION LAB // FOUNDATION PHASE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Exploring Dimensions from <span className="text-cyan-400">1D to 5D</span> with Scientific Rigor
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              An advanced educational and experimental laboratory designed to explore high-dimensional geometry, theoretical physics, and dimensional analogies.
            </p>

            {/* Scientific Rigor Directives Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-200 font-semibold font-mono">SCIENTIFIC DEMARCATION DIRECTIVE: </span>
                <span className="text-slate-400">
                  This laboratory maintains strict boundaries between established physics (3D space, 4D spacetime), pure mathematics (4D/5D geometry), and unproven physical hypotheses. No macroscopic 4th or 5th physical spatial dimension has ever been discovered.
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="hero-launch-dimension-lab-btn"
                onClick={() => onSelectModule('dimension-lab')}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm font-display tracking-wide transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Enter Dimension Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="hero-open-epistemic-btn"
                onClick={onOpenEpistemicLegend}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm font-mono border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Sigma className="w-4 h-4 text-cyan-400" />
                <span>Epistemic Classification Rules</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Teaser on Dashboard */}
          <div className="lg:col-span-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>ACTIVE PROJECTION ENGINE</span>
                <span className="text-cyan-400 font-bold">{activeDimension} CONTINUUM</span>
              </div>
              <DimensionCanvasPreview
                dimension={activeDimension}
                onDimensionChange={onSelectDimension}
                interactive={true}
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1 pt-1">
                <span>Rotate in multi-plane phase</span>
                <button
                  onClick={() => onSelectModule('dimension-lab')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Full Dimension Lab <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dimensional Continuum Roadmap (1D -> 2D -> 3D -> 4D -> 5D) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase">
              DIMENSIONAL CONTINUUM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              The 1D → 5D Mathematical Hierarchy
            </h2>
          </div>
          <button
            onClick={() => onSelectModule('dimension-lab')}
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
          >
            Explore Complete Properties <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DIMENSIONS_DATA.map((dim) => {
            const isSelected = activeDimension === dim.id;
            return (
              <div
                key={dim.id}
                id={`dim-card-${dim.id}`}
                onClick={() => onSelectDimension(dim.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold font-display text-white">
                    {dim.id}
                  </span>
                  <EpistemicBadge status={dim.epistemicStatus} size="sm" />
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-1">
                  {dim.name}
                </div>

                <div className="text-[11px] font-mono text-cyan-400/90 mb-2">
                  {dim.algebraicStructure}
                </div>

                <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Coords:</span>
                    <span className="font-mono text-slate-300">{dim.coordinateNotation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vertices (2ⁿ):</span>
                    <span className="font-mono text-slate-300">{dim.vertices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges:</span>
                    <span className="font-mono text-slate-300">{dim.edges}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[10px] text-slate-500 leading-tight">
                  {dim.statusNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Epistemological Status Framework Showcase */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono text-amber-400 tracking-wider uppercase">
              EPISTEMOLOGICAL TRUTH CRITERIA
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              The 5-Tier Status Classification Standard
            </h3>
          </div>
          <button
            onClick={onOpenEpistemicLegend}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            View Complete Methodology <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Every concept, equation, and visualization in Higher Dimension Lab is classified into one of five rigorous epistemological categories. This prevents the common conflation of mathematical consistency with physical reality.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {(Object.keys(EPISTEMIC_REGISTRY) as Array<keyof typeof EPISTEMIC_REGISTRY>).map((statusKey) => {
            const item = EPISTEMIC_REGISTRY[statusKey];
            return (
              <div
                key={statusKey}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                  <span className="text-xs font-semibold text-white font-display">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.shortDefinition}
                </p>
                <div className="text-[10px] font-mono text-slate-500 truncate pt-1 border-t border-slate-850">
                  Ex: {item.example.split(',')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Architecture Roadmap */}
      <div className="space-y-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase">
            NAVIGATION ARCHITECTURE
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Laboratory Modules & Workstations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`module-card-${card.id}`}
                onClick={() => onSelectModule(card.id)}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 p-5 transition-all hover:border-slate-700 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <EpistemicBadge status={card.status as any} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                      {card.title}
                    </h3>
                    <div className="text-xs font-mono text-cyan-400/80 mt-0.5">
                      {card.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <span>{card.badge}</span>
                  <div className="flex items-center gap-1">
                    <span>Enter Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
