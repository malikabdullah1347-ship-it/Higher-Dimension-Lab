import { X, Scissors, Eye, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SliceVsProjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCompare: () => void;
}

export function SliceVsProjectionModal({
  isOpen,
  onClose,
  onSwitchToCompare,
}: SliceVsProjectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  SCIENTIFIC COMPARISON
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  FUNDAMENTAL DISTINCTION
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Slicing ≠ Projection: The Core Demarcation
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Comparison Matrix */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p className="text-slate-400">
            A common point of confusion when learning higher dimensions is confusing a <strong>projected shadow</strong> with a <strong>hyperplane cross-section</strong>. Both are valid ways to map 4D into 3D, but they preserve completely different mathematical truths.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projection Column */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-base font-display text-cyan-300">
                  4D → 3D PROJECTION (Shadow)
                </h4>
              </div>

              <div className="text-xs text-slate-300">
                Maps every point <code className="font-mono text-cyan-300">(x, y, z, w)</code> into ℝ³ via the perspective operator <code className="font-mono text-cyan-300">s = d₄ / (d₄ - w)</code>.
              </div>

              <div className="space-y-2 pt-2 border-t border-cyan-500/20 text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>What It Preserves:</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>All 16 vertices and 32 edges are visible simultaneously</li>
                  <li>Overall topological connectivity (Euler characteristic)</li>
                  <li>Global symmetry relationships</li>
                </ul>

                <div className="text-rose-400 font-semibold flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>What It Distorts / Loses:</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>True 4D Euclidean angles (90° angles appear skewed)</li>
                  <li>True lengths (inner cube looks small, though congruent in 4D)</li>
                  <li>Depth information is compressed onto a lower-dimensional frame</li>
                </ul>
              </div>
            </div>

            {/* Slicing Column */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-base font-display text-purple-300">
                  4D HYPERPLANE SLICE (Cross-Section)
                </h4>
              </div>

              <div className="text-xs text-slate-300">
                Computes the exact intersection of the 4D object with a 3D hyperplane <code className="font-mono text-purple-300">w = w₀</code>.
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-500/20 text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>What It Preserves:</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>True Euclidean 3D geometry without any perspective distortion</li>
                  <li>Accurate volumes, angles, and surface areas within the slice</li>
                  <li>Direct physical intersection points</li>
                </ul>

                <div className="text-rose-400 font-semibold flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>What It Distorts / Loses:</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>Discards all parts of the object where w ≠ w₀</li>
                  <li>Cannot see the entire 4D polytope in a single snapshot</li>
                  <li>Requires animated sweeps across W to mentally reconstruct the whole</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Scientific Conclusion:</strong> Neither representation alone gives the full human intuitive picture. By toggling into <strong>Compare Mode</strong>, you can watch the calculated slice morph inside or beside the full projected wireframe in real time as <code className="font-mono text-purple-300">w</code> sweeps through the object.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToCompare();
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to Compare Mode Now</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
