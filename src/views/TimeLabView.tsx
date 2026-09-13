import { useState } from 'react';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { Clock, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Split, Compass } from 'lucide-react';

interface TimeLabViewProps {
  onOpenEpistemicLegend: () => void;
}

export function TimeLabView({ onOpenEpistemicLegend }: TimeLabViewProps) {
  const [activeTab, setActiveTab] = useState<'METRIC' | 'LIGHTCONE' | 'MULTI_TIME'>('METRIC');
  const [observerVelocity, setObserverVelocity] = useState<number>(0.6); // fraction of c

  const gamma = 1 / Math.sqrt(1 - observerVelocity * observerVelocity);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
              MODULE 02
            </span>
            <span className="text-xs font-mono text-slate-400">TEMPORAL & RELATIVISTIC LABORATORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Time & Spacetime Lab: <span className="text-emerald-400">4D (3+1) Continuum</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Demarcating physical 4-dimensional spacetime from abstract 4D spatial Euclidean geometry.
          </p>
        </div>

        <EpistemicBadge
          status="ESTABLISHED"
          size="md"
          interactive={true}
          onInspect={onOpenEpistemicLegend}
        />
      </div>

      {/* Critical Epistemological Demarcation Note */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 flex gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-display">
            Epistemic Distinction: 4D Spacetime vs 4D Spatial Geometry
          </strong>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed">
            In everyday language, people often say &quot;time is the fourth dimension.&quot; In physics, spacetime is a 4-dimensional pseudo-Riemannian manifold with metric signature <code className="font-mono text-cyan-300">(-, +, +, +)</code>. The minus sign gives time a completely different causal structure than space—you cannot rotate spatial coordinates into temporal coordinates like you rotate x into y.
          </p>
        </div>
      </div>

      {/* Metric Comparison & Interactive Light-Cone Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Minkowski Light-Cone Interactive Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-white uppercase">
                  Minkowski Spacetime Light-Cone (c · t vs x)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ESTABLISHED PHYSICS
              </span>
            </div>

            {/* SVG Light-Cone Diagram */}
            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              <svg className="w-full h-full" viewBox="-200 -200 400 400">
                {/* Background Grid */}
                <line x1="-200" y1="0" x2="200" y2="0" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1.5" />
                <line x1="0" y1="-200" x2="0" y2="200" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1.5" />

                {/* Light Cones (45 degree lines where ds² = 0) */}
                <polygon points="0,0 -160,-160 160,-160" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" strokeDasharray="4 4" />
                <polygon points="0,0 -160,160 160,160" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" strokeDasharray="4 4" />

                {/* Spacelike elsewhere regions */}
                <text x="120" y="-20" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">SPACELIKE</text>
                <text x="-180" y="-20" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">SPACELIKE</text>

                {/* Future and Past Labels */}
                <text x="-35" y="-120" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">FUTURE</text>
                <text x="-70" y="-105" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">(Timelike ds² &lt; 0)</text>

                <text x="-25" y="130" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">PAST</text>
                <text x="-70" y="145" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">(Timelike ds² &lt; 0)</text>

                {/* Worldline of Moving Observer */}
                {(() => {
                  const slope = 1 / Math.max(0.1, observerVelocity);
                  const endY = -140;
                  const endX = endY / -slope;
                  return (
                    <g>
                      <line x1="0" y1="0" x2={endX} y2={endY} stroke="#f59e0b" strokeWidth="3" />
                      <circle cx={endX} cy={endY} r="4" fill="#f59e0b" />
                      <text x={endX + 8} y={endY} fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono">
                        Worldline (v = {observerVelocity}c)
                      </text>
                    </g>
                  );
                })()}

                {/* Light Ray Photon Trajectory */}
                <text x="110" y="-145" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono">
                  Photon (v = c, ds² = 0)
                </text>

                {/* Present (Here and Now) */}
                <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
                <text x="8" y="14" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
                  (0, 0) HERE & NOW
                </text>

                {/* Axis Labels */}
                <text x="160" y="16" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">Space (x)</text>
                <text x="8" y="-180" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">Time (c · t)</text>
              </svg>
            </div>

            {/* Velocity Scrubber */}
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Observer Velocity (fraction of c):</span>
                <span className="text-amber-400 font-bold">{observerVelocity.toFixed(2)} c</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={observerVelocity}
                onChange={(e) => setObserverVelocity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Lorentz Factor γ: <strong className="text-cyan-400">{gamma.toFixed(3)}</strong></span>
                <span>Time Dilation: <strong className="text-emerald-400">Δt&apos; = γ Δt</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Spacetime Mathematics vs Spatial 4D */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold font-display text-white">
              Mathematical Metric Comparison
            </h3>

            <div className="space-y-3 text-xs">
              {/* Euclidean 4D */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold">EUCLIDEAN 4-SPACE (ℝ⁴)</span>
                  <EpistemicBadge status="MATHEMATICAL" size="sm" />
                </div>
                <div className="text-slate-300 text-sm py-1 font-semibold">
                  ds² = dx² + dy² + dz² + dw²
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Metric is positive-definite. Rotations form the compact Lie group <code className="text-cyan-300 font-mono">SO(4)</code>. Distance is invariant under arbitrary 4-dimensional rotations.
                </p>
              </div>

              {/* Minkowski 4D */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-bold">MINKOWSKI SPACETIME (ℝ³,¹)</span>
                  <EpistemicBadge status="ESTABLISHED" size="sm" />
                </div>
                <div className="text-slate-300 text-sm py-1 font-semibold">
                  ds² = -c²dt² + dx² + dy² + dz²
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Metric has indefinite signature <code className="text-emerald-300 font-mono">(-,+,+,+)</code>. Symmetry group is the non-compact Lorentz group <code className="text-emerald-300 font-mono">SO(3,1)</code>. Enforces universal speed limit c and strict causal cones.
                </p>
              </div>
            </div>
          </div>

          {/* Multiple Time Dimensions: Scientific Analysis */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-300 font-display">
                What About 2+ Time Dimensions? (e.g. 3+2 D)
              </span>
              <EpistemicBadge status="SPECULATIVE" size="sm" />
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Theoretical models with more than one temporal dimension (such as Itzhak Bars’ 2T-physics) have been explored mathematically, but are generally disfavored in fundamental physics because multiple time dimensions typically introduce:
            </p>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li>Loss of causal predictability (hyperbolic PDEs become ultrahyperbolic)</li>
              <li>Negative-norm quantum states (&quot;ghosts&quot;) violating unitarity</li>
              <li>Closed timelike curves (CTC) creating physical paradoxes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
