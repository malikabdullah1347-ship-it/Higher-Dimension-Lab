import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Eye, Scissors, Layers, HelpCircle } from 'lucide-react';

interface GuidedExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (step: number) => void;
}

const STEPS = [
  {
    step: 1,
    title: '1. The 4D Polytope in ℝ⁴',
    subtitle: '16 vertices and 8 cubic cells in Euclidean 4-space',
    icon: Layers,
    accent: 'text-cyan-400',
    content: (
      <div className="space-y-3">
        <p>
          A tesseract is constructed in 4-dimensional Euclidean space ℝ⁴ with coordinates <code className="text-cyan-300 font-mono">(x, y, z, w)</code>.
        </p>
        <p>
          Just as a 3D cube is bounded by 6 square 2D faces, a 4D tesseract is bounded by <strong>8 cubic 3D cells</strong>. All 8 cubes are identical in size, orthogonal to one another, and meet at 24 square faces.
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <strong>Key insight:</strong> You cannot physically walk around a 4D object with 3D human eyes, but its mathematics is rigorous and exact.
        </div>
      </div>
    ),
  },
  {
    step: 2,
    title: '2. The Slicing Hyperplane (w = w₀)',
    subtitle: 'A 3-dimensional "knife" traversing the 4th spatial axis',
    icon: Scissors,
    accent: 'text-purple-400',
    content: (
      <div className="space-y-3">
        <p>
          Imagine slicing a 3D apple with a 2D plane (a flat blade). At each height <code className="text-purple-300 font-mono">z</code>, you get a 2D slice (a disk).
        </p>
        <p>
          In 4D, our slicing knife is not a 2D plane—it is an entire <strong>3-dimensional hyperplane</strong> defined by fixing <code className="text-purple-300 font-mono">w = w₀</code>.
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <strong>Key insight:</strong> As we slide <code className="text-purple-300 font-mono">w₀</code> from -2 to +2, the hyperplane intersects the 4D object at different 4D depths.
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: '3. The Resulting 3D Cross-Section',
    subtitle: 'True solid intersections computed mathematically in real time',
    icon: Sparkles,
    accent: 'text-emerald-400',
    content: (
      <div className="space-y-3">
        <p>
          When the 3D hyperplane cuts across the 4D tesseract, any 4D edge crossing <code className="text-emerald-300 font-mono">w = w₀</code> generates an <strong>intersection vertex in ℝ³</strong>.
        </p>
        <p>
          Any 2D face crossing the hyperplane generates a <strong>3D edge</strong>, and any 3D cubic cell crossing generates a <strong>2D polygon face</strong>!
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <strong>Observed phenomenon:</strong> If the tesseract is tilted in 4D, slicing yields a point → growing tetrahedron → truncated tetrahedron → regular octahedron → shrinking tetrahedron → vanishing point!
        </div>
      </div>
    ),
  },
  {
    step: 4,
    title: '4. The 4D Perspective Projection',
    subtitle: 'Casting a 3D shadow from a 4D light source onto our space',
    icon: Eye,
    accent: 'text-cyan-400',
    content: (
      <div className="space-y-3">
        <p>
          Projection is fundamentally different from slicing: it casts all 16 vertices and 32 edges of the 4D object into our 3D space at once.
        </p>
        <p>
          The formula <code className="text-cyan-300 font-mono">s = d₄ / (d₄ - w)</code> scales coordinates based on how far away they are along the 4th axis <code className="text-cyan-300 font-mono">W</code>.
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <strong>Visual effect:</strong> The &quot;inner cube&quot; appears smaller not because it is smaller in 4D, but because it sits deeper along the W axis.
        </div>
      </div>
    ),
  },
  {
    step: 5,
    title: '5. Slicing ≠ Projection',
    subtitle: 'The fundamental epistemological distinction in dimensional science',
    icon: HelpCircle,
    accent: 'text-amber-400',
    content: (
      <div className="space-y-3">
        <p>
          Never confuse a <strong>shadow</strong> with a <strong>cross-section</strong>:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <li><strong>Projection (Shadow):</strong> Preserves overall connectivity and vertex count, but distorts angles, lengths, and overlays multiple 4D depths on top of each other.</li>
          <li><strong>Slice (Cross-section):</strong> Preserves true local angles and true Euclidean geometry at that exact hyperplane, but discards everything outside <code className="text-purple-300 font-mono">w = w₀</code>.</li>
        </ul>
        <p className="text-xs text-slate-400">
          Toggle into <strong>Compare Mode</strong> in the Dimension Lab to view both simultaneously!
        </p>
      </div>
    ),
  },
];

export function GuidedExplanationDrawer({
  isOpen,
  onClose,
  onJumpToStep,
}: GuidedExplanationDrawerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[currentStepIndex];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      onJumpToStep(next + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      onJumpToStep(prev + 1);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Guided Scientific Walkthrough
            </div>
            <h3 className="text-sm font-bold font-display text-white">
              Show Me What Is Happening
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

      {/* Step Indicators */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-1">
        {STEPS.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              setCurrentStepIndex(idx);
              onJumpToStep(idx + 1);
            }}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                : idx < currentStepIndex
                ? 'bg-cyan-900'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Active Step Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${current.accent}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold font-display text-white">
              {current.title}
            </h4>
            <div className="text-xs text-slate-400 mt-0.5">
              {current.subtitle}
            </div>
          </div>
        </div>

        <div className="text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/80 pt-4">
          {current.content}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStepIndex === 0}
          onClick={handlePrev}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center gap-1 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-mono text-slate-500">
          Step {currentStepIndex + 1} of {STEPS.length}
        </span>

        {currentStepIndex < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1 transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Got It</span>
          </button>
        )}
      </div>
    </div>
  );
}
