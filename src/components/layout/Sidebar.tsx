import { useState } from 'react';
import { ModuleId } from '../../types';
import { 
  Terminal, 
  Layers, 
  Clock, 
  BookOpen, 
  FlaskConical, 
  Rocket, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Atom,
  Binary
} from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  onOpenEpistemicLegend: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ 
  currentModule, 
  onSelectModule, 
  onOpenEpistemicLegend,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const [hoveredModule, setHoveredModule] = useState<ModuleId | null>(null);

  const modules = [
    {
      id: 'overview' as ModuleId,
      label: 'Mission Overview',
      shortLabel: 'Overview',
      desc: 'Observatory & continuum',
      icon: Terminal,
      badge: 'Hub',
    },
    {
      id: 'dimension-lab' as ModuleId,
      label: 'Dimension Lab',
      shortLabel: 'Dimensions',
      desc: '1D → 2D → 3D → 4D → 5D',
      icon: Layers,
      badge: '4D Engine',
    },
    {
      id: 'time-lab' as ModuleId,
      label: 'Time & Spacetime',
      shortLabel: 'Spacetime',
      desc: 'Minkowski (3+1)D light cones',
      icon: Clock,
      badge: 'Relativity',
    },
    {
      id: 'codex' as ModuleId,
      label: "Explorer's Codex",
      shortLabel: 'Codex',
      desc: '300+ entry catalog',
      icon: BookOpen,
      badge: 'Archive',
    },
    {
      id: 'experiments' as ModuleId,
      label: 'Experiments',
      shortLabel: 'Experiments',
      desc: 'Hypotheses & Analogies',
      icon: FlaskConical,
      badge: 'Lab Bench',
    },
    {
      id: 'frontier' as ModuleId,
      label: 'Frontier',
      shortLabel: 'Frontier',
      desc: '5D Kaluza-Klein bounds',
      icon: Rocket,
      badge: 'Theory',
    },
  ];

  return (
    <aside 
      className={`relative shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-sm transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-[72px] p-3' : 'w-[268px] p-4'
      }`}
      aria-label="Laboratory Navigation"
    >
      <div className="space-y-6">
        {/* Header / Collapse Toggle Section */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-850">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider uppercase block truncate">
                  OBSERVATORY
                </span>
                <span className="text-[11px] text-cyan-400/80 font-mono block truncate">
                  v2.0 // Active
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            id="sidebar-collapse-toggle-btn"
            onClick={onToggleCollapse}
            className={`p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-slate-800 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Modules">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = currentModule === m.id;
            return (
              <div 
                key={m.id} 
                className="relative group"
                onMouseEnter={() => setHoveredModule(m.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <button
                  type="button"
                  id={`sidebar-nav-${m.id}`}
                  onClick={() => onSelectModule(m.id)}
                  className={`w-full flex items-center rounded-xl text-left transition-all ${
                    isCollapsed 
                      ? 'justify-center p-3' 
                      : 'gap-3 p-2.5'
                  } ${
                    isActive
                      ? 'bg-cyan-950/40 border border-cyan-500/50 text-white shadow-sm shadow-cyan-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <span 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-cyan-400 shadow-sm shadow-cyan-400 ${
                        isCollapsed ? 'h-6' : 'h-7'
                      }`} 
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-900/90 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Expanded text info */}
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-sm font-semibold tracking-wide truncate ${
                            isActive ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {m.label}
                        </span>
                        {m.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none shrink-0 ${
                            isActive 
                              ? 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60' 
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{m.desc}</div>
                    </div>
                  )}
                </button>

                {/* Collapsed Tooltip (accessible on hover) */}
                {isCollapsed && (
                  <div 
                    role="tooltip"
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-x-1 group-hover:translate-x-0"
                  >
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 shadow-xl text-xs whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center justify-between gap-2 font-semibold font-display text-cyan-300">
                        <span>{m.label}</span>
                        {m.badge && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Scientific Context Widget (Expanded only) */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-850 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" />
                <span>RIGOR STANDARD</span>
              </span>
              <span className="text-[10px] text-emerald-400">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empirical physics (3+1)D strictly demarcated from pure geometry ℝ⁴ & ℝ⁵.
            </p>
          </div>
        )}
      </div>

      {/* Epistemic Protocol Trigger (Both states) */}
      <div className="pt-3 border-t border-slate-850">
        <div className="relative group">
          <button
            type="button"
            id="sidebar-demarcation-btn"
            onClick={onOpenEpistemicLegend}
            className={`w-full flex items-center rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors ${
              isCollapsed ? 'justify-center p-3' : 'gap-2.5 p-2.5'
            }`}
            title="Epistemic Demarcation Protocol"
            aria-label="Epistemic Demarcation Protocol"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0 text-left">
                <div className="font-mono text-xs text-slate-200 font-medium truncate">
                  Epistemic Protocol
                </div>
                <div className="text-[11px] text-slate-400 truncate">5-tier status demarcation</div>
              </div>
            )}
          </button>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div 
              role="tooltip"
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-x-1 group-hover:translate-x-0"
            >
              <div className="bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 shadow-xl text-xs whitespace-nowrap">
                <div className="font-semibold text-amber-300">Epistemic Protocol</div>
                <div className="text-[11px] text-slate-400">5-tier scientific demarcation</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
