import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { Rocket, ShieldAlert, CheckCircle2, Sigma, Lightbulb, ExternalLink } from 'lucide-react';

interface FrontierViewProps {
  onOpenEpistemicLegend: () => void;
}

export function FrontierView({ onOpenEpistemicLegend }: FrontierViewProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-rose-950 text-rose-400 border border-rose-800">
              MODULE 05
            </span>
            <span className="text-xs font-mono text-slate-400">THEORETICAL PHYSICS FRONTIER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Frontier 5D: <span className="text-rose-400">Kaluza-Klein & Compactification</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Exploring 5-dimensional classical field theories, compactified spatial topologies, and empirical boundary bounds.
          </p>
        </div>

        <EpistemicBadge
          status="HYPOTHETICAL"
          size="md"
          interactive={true}
          onInspect={onOpenEpistemicLegend}
        />
      </div>

      {/* Explicit Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs sm:text-sm flex gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-display">
            Frontier Demarcation: 5D Physical Reality is NOT Discovered
          </strong>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed">
            While 5-dimensional geometry <code className="font-mono text-cyan-300">ℝ⁵</code> is fully proven in pure mathematics, no physical 5th dimension has ever been detected in experiment. The models presented here are mathematical hypotheses designed to examine geometric unification and its rigorous experimental upper bounds.
          </p>
        </div>
      </div>

      {/* Deep-Dive Grid: Kaluza-Klein Metric vs Empirical Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Kaluza-Klein Miracle (1919) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display text-white">
                The Kaluza-Klein Classical 5D Metric
              </h3>
              <EpistemicBadge status="HYPOTHETICAL" size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In 1919, Polish mathematician Theodor Kaluza sent Albert Einstein a paper demonstrating that writing Einstein&apos;s vacuum field equations in 5 dimensions automatically produces both:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <li><strong>Einstein&apos;s 4D General Relativity</strong> (gravity)</li>
              <li><strong>Maxwell&apos;s 4D Electromagnetism</strong> (light and electric/magnetic fields)</li>
              <li>An extra scalar field known as the <em>dilaton</em> or <em>radion</em></li>
            </ul>

            {/* 5x5 Metric Matrix Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">
                The 5×5 Kaluza-Klein Metric Decomposition:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto space-y-2">
                <div>ĝ_AB =</div>
                <div className="pl-4 border-l-2 border-cyan-500/40 text-[11px] leading-relaxed">
                  [ g_μν + φ² A_μ A_ν &nbsp;&nbsp;|&nbsp;&nbsp; φ² A_μ ]<br />
                  [&nbsp;-------------------&nbsp;|&nbsp;------&nbsp;]<br />
                  [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;φ² A_ν&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;φ²&nbsp;&nbsp;&nbsp;]
                </div>
                <div className="text-[10px] text-slate-400 pt-2 font-sans">
                  Where μ, ν ∈ &#123;0, 1, 2, 3&#125; (4D spacetime), and the 5th component index A=5 generates the electromagnetic vector potential A_μ.
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              In 1926, Swedish physicist Oskar Klein proposed that the 5th dimension is curled into a compact microscopic circle <code className="font-mono text-cyan-300">S¹</code> of radius <code className="font-mono text-cyan-300">R</code>, explaining why macroscopic creatures do not experience motion along the 5th axis.
            </div>
          </div>
        </div>

        {/* Right: Empirical Upper Bounds & Detection Limits */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display text-white">
                Experimental Constraints (Empirical Bounds)
              </h3>
              <EpistemicBadge status="ESTABLISHED" size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If an extra spatial dimension existed at macroscopic scales, physical laws would deviate drastically:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-emerald-400 font-mono">1. Gravitational Inverse Square Law</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  In (3+d) spatial dimensions, gravitational force scales as <code className="font-mono text-slate-200">F ∝ 1/r^(2+d)</code>. Torsion pendulum experiments at the University of Washington (Eöt-Wash group) have tested Newton&apos;s law down to <strong className="text-white">~44 micrometers</strong>. No deviation was found.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-emerald-400 font-mono">2. High-Energy Colliders (LHC at CERN)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Collisions at 13.6 TeV test for graviton emission into extra-dimensional &quot;bulk&quot; (missing energy events). Stringent lower bounds constrain extra dimensions to radii <strong className="text-white">r &lt; 10⁻¹⁹ meters</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-emerald-400 font-mono">3. Planetary Orbital Stability (Ehrenfest)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Paul Ehrenfest proved in 1917 that stable Keplerian planetary orbits and stable Bohr atomic orbitals only exist mathematically in exactly 3 spatial dimensions (<code className="font-mono text-slate-200">d = 3</code>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
