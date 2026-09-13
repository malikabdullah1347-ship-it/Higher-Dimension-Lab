import { ModuleId, DimensionId } from '../../types';
import { DimensionIndicator } from '../common/DimensionIndicator';
import { Orbit, ShieldCheck, Menu, X, Terminal, BookOpen, Layers, Clock, FlaskConical, Rocket } from 'lucide-react';

interface NavbarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  currentDimension: DimensionId;
  onSelectDimension: (dim: DimensionId) => void;
  onOpenEpistemicLegend: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Navbar({
  currentModule,
  onSelectModule,
  currentDimension,
  onSelectDimension,
  onOpenEpistemicLegend,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarProps) {
  const navItems = [
    { id: 'overview' as ModuleId, label: 'Overview', icon: Terminal },
    { id: 'dimension-lab' as ModuleId, label: 'Dimension Lab', icon: Layers, badge: '1D-5D' },
    { id: 'time-lab' as ModuleId, label: 'Time Lab', icon: Clock, badge: '4D (3+1)' },
    { id: 'codex' as ModuleId, label: "Explorer's Codex", icon: BookOpen, badge: 'Archive' },
    { id: 'experiments' as ModuleId, label: 'Experiments', icon: FlaskConical },
    { id: 'frontier' as ModuleId, label: 'Frontier 5D', icon: Rocket, badge: 'Theory' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-[1720px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="nav-logo-btn"
            onClick={() => onSelectModule('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Orbit className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold font-display tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                HIGHER DIMENSION LAB
              </div>
              <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
                FOUNDATION PHASE 1.0
              </div>
            </div>
          </button>
        </div>

        {/* Center: Continuum Selector */}
        <div className="hidden lg:flex items-center">
          <DimensionIndicator
            currentDimension={currentDimension}
            onSelectDimension={onSelectDimension}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Epistemic Demarcation Trigger */}
          <button
            type="button"
            id="open-epistemic-legend-btn"
            onClick={onOpenEpistemicLegend}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 text-xs font-mono text-cyan-300 transition-all shadow-sm"
            title="View Epistemological Demarcation Protocol"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Epistemic Status</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
              ISO-EP
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase px-2 mb-1">
              Dimensional Continuum
            </div>
            <DimensionIndicator
              currentDimension={currentDimension}
              onSelectDimension={(dim) => {
                onSelectDimension(dim);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase px-2 mb-1">
              Laboratory Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onSelectModule(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
