import { useState } from 'react';
import { X, HelpCircle, Lightbulb, BookOpen, ChevronDown, ChevronUp, Bot, Sparkles } from 'lucide-react';

interface TutorHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeObject: string;
}

const FAQS = [
  {
    q: 'How can a 4th spatial dimension exist if we cannot see it?',
    a: 'Human retinas and brains evolved in a 3D environment. We can only project 2D retinal images and infer 3D depth. However, mathematics is not constrained by human biology. In linear algebra, ℝ⁴ is just as well-defined as ℝ² or ℝ³. We explore higher dimensions using rigorous projections, slices, and coordinate algebra.',
  },
  {
    q: 'Why does the tesseract look like a cube inside another cube?',
    a: 'Think of Abbott’s Flatland: when a 3D wireframe cube casts a shadow onto a 2D table, it looks like a smaller square inside a larger square, with angled lines connecting their corners. In 4D, the same perspective effect occurs: the tesseract casts a 3D shadow where the "inner cube" is actually identical in size to the outer cube, but sits further away along the 4th spatial axis W.',
  },
  {
    q: 'Why does rotating in XW turn the cube "inside out"?',
    a: 'In the XW plane, the X coordinate and the W coordinate swap places. The inner cube (which was far away along W) moves to W = 0 and expands, while the outer cube is pushed back along W and shrinks. Nothing is physically tearing or turning inside out—it is simply a rigid rotation in 4-dimensional Euclidean space!',
  },
  {
    q: 'What is the Flatland analogy for 4D slicing?',
    a: 'Imagine a 2D Flatlander living on a tabletop. If a 3D apple passes through the tabletop from top to bottom, the Flatlander does not see an apple. They see a tiny dot appear from nowhere, grow into an expanding disk, change shape, shrink, and suddenly vanish into thin air. When a 4D hypersphere passes through our 3D space, we experience the exact same thing: a point appears, expands into a 3D sphere, reaches peak radius, shrinks, and vanishes!',
  },
  {
    q: 'Is the 4th dimension the same thing as Time?',
    a: 'No! In Albert Einstein’s Special and General Relativity, spacetime is a pseudo-Riemannian manifold with metric signature (-c²dt² + dx² + dy² + dz²). Time has a negative metric sign and a causal light-cone structure. In this Dimension Lab, we are studying Euclidean 4-space ℝ⁴, where all four axes (x, y, z, w) are identical spatial dimensions with positive metric (+dx² + dy² + dz² + dw²). Check out the "Time & Spacetime Lab" module to explore the physics of Minkowski spacetime.',
  },
];

export function TutorHelpModal({
  isOpen,
  onClose,
  activeObject,
}: TutorHelpModalProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  DIMENSIONAL TUTOR & CONCEPT GUIDE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                  PHASE 2 WORKSTATION
                </span>
              </div>
              <h3 className="text-base font-bold font-display text-white">
                &quot;I Don&apos;t Understand Higher Dimensions&quot;
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

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 font-display text-cyan-300">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Dimensional Intuition Checklist</span>
            </div>
            <p className="text-xs text-slate-300">
              It is completely normal that your brain cannot visualize 4D space directly. Nobody can. Physicists and mathematicians understand 4D through:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                1. <strong>Slicing:</strong> Looking at 3D cross-sections as W changes.
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                2. <strong>Projection:</strong> Casting 3D perspective shadows.
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                3. <strong>Analogy:</strong> Extrapolating from 2D → 3D up to 3D → 4D.
              </div>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Frequently Asked Conceptual Questions</span>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-white hover:bg-slate-900 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900 bg-slate-900/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Future AI Guide Hook Note */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Phase 3 AI Tutor Integration Note:</strong>
              <p className="mt-0.5 text-[11px]">
                In upcoming phases, this workstation will connect to an interactive conversational AI tutor with adaptive mathematical dialogue grounded in the Gemini API.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
