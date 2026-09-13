import { ModuleId } from '../../types';
import { Terminal, Layers, Clock, BookOpen, FlaskConical, Rocket, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  onOpenEpistemicLegend: () => void;
}

export function Sidebar({ currentModule, onSelectModule, onOpenEpistemicLegend }: SidebarProps) {
  const modules = [
    {
      id: 'overview' as ModuleId,
      label: 'Mission Overview',
      desc: 'System status & continuum',
      icon: Terminal,
      phase: 'Phase 1 Active',
    },
    {
      id: 'dimension-lab' as ModuleId,
      label: 'Dimension Lab',
      desc: '1D → 2D → 3D → 4D → 5D',
      icon: Layers,
      phase: 'Core Lab',
      badge: 'Interactive',
    },
    {
      id: 'time-lab' as ModuleId,
      label: 'Time Lab',
      desc: 'Spacetime & Light Cones',
      icon: Clock,
      phase: 'Foundation',
    },
    {
      id: 'codex' as ModuleId,
      label: "Explorer's Codex",
      desc: '300+ entry catalog',
      icon: BookOpen,
      phase: 'Archive',
    },
    {
      id: 'experiments' as ModuleId,
      label: 'Experiments Lab',
      desc: 'Hypotheses & Analogies',
      icon: FlaskConical,
      phase: 'Lab Bench',
    },
    {
      id: 'frontier' as ModuleId,
      label: 'Frontier 5D',
      desc: 'Kaluza-Klein & Bounds',
      icon: Rocket,
      phase: 'Theoretical',
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/60 p-4">
      <div className="space-y-6">
        {/* Section title */}
        <div>
          <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-2 mb-2">
            Navigation Architecture
          </div>
          <nav className="space-y-1">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = currentModule === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  id={`sidebar-nav-${m.id}`}
                  onClick={() => onSelectModule(m.id)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-white shadow-sm shadow-cyan-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold font-display tracking-wide truncate ${
                          isActive ? 'text-cyan-300' : 'text-slate-200'
                        }`}
                      >
                        {m.label}
                      </span>
                      {m.badge && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Foundation Notice Card */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>PHASE 1 FOUNDATION</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Architected for modular expansion into full WebGL 4D cross-sectioning and 300+ Codex articles.
          </p>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CORE PROTOCOL READY</span>
          </div>
        </div>
      </div>

      {/* Epistemic Protocol Trigger */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          id="sidebar-demarcation-btn"
          onClick={onOpenEpistemicLegend}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors text-xs text-slate-400 hover:text-slate-200"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-mono text-[11px] text-slate-300 font-medium">Epistemic Protocol</div>
            <div className="text-[10px] text-slate-500 truncate">5-tier status demarcation</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
