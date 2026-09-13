import { EpistemicStatus, EpistemicMeta } from '../types';

export const EPISTEMIC_REGISTRY: Record<EpistemicStatus, EpistemicMeta> = {
  ESTABLISHED: {
    status: 'ESTABLISHED',
    label: 'Established Science',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    shortDefinition: 'Empirically verified and reproducibly measured in physical reality.',
    epistemicCriteria: 'Requires empirical observation, experimental confirmation (e.g. particle detectors, interferometry, atomic clocks), and falsifiable predictions confirmed by peer-reviewed physics.',
    example: '3D Euclidean space, Einsteinian 4D spacetime (3 space + 1 time), gravitational lensing, relativistic time dilation.'
  },
  MATHEMATICAL: {
    status: 'MATHEMATICAL',
    label: 'Mathematical Truth',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    dotColor: 'bg-cyan-400',
    shortDefinition: 'Rigorous formal proofs in axiomatic mathematics (independent of physical existence).',
    epistemicCriteria: 'Requires deductive proofs within standard axioms (ZFC, differential geometry, topology, Clifford algebras). Does NOT imply physical spatial dimensions exist.',
    example: 'n-dimensional Euclidean spaces R^n, Coxeter groups, 4D hypercube/tesseract topology, 5D simplex, Euler characteristic.'
  },
  HYPOTHETICAL: {
    status: 'HYPOTHETICAL',
    label: 'Hypothetical Model',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    dotColor: 'bg-amber-400',
    shortDefinition: 'Mathematically consistent physical hypotheses with testable constraints, but unobserved.',
    epistemicCriteria: 'Formulated as theoretical physics models to explain unexplained phenomena (e.g. unifying electromagnetism with gravity). Constrained by experimental upper bounds (e.g. LHC collision data, sub-mm gravity tests).',
    example: 'Kaluza-Klein 5D compactified cylindrical model, Randall-Sundrum warped dimensions, ADD large extra dimensions.'
  },
  SPECULATIVE: {
    status: 'SPECULATIVE',
    label: 'Theoretical Speculation',
    badgeBg: 'bg-purple-950/60',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    dotColor: 'bg-purple-400',
    shortDefinition: 'Conceptual conjecture without empirical confirmation or clear experimental testability.',
    epistemicCriteria: 'Theoretical ideas or thought experiments exploring "what if" scenarios that lack empirical support and currently lack decisive experimental verification pathways.',
    example: 'Macroscopic extra physical dimensions, entities freely traversing the 4D spatial bulk, traversable higher-dimensional wormhole tunnels.'
  },
  FICTIONAL: {
    status: 'FICTIONAL',
    label: 'Fictional / Pedagogical',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    dotColor: 'bg-rose-400',
    shortDefinition: 'Metaphors, didactic allegories, and science-fiction conceptual tropes.',
    epistemicCriteria: 'Constructed purely for narrative storytelling or educational analogies (e.g. Edwin Abbott’s Flatland) to aid human intuition. Must never be mistaken for physical reality.',
    example: 'Flatland sentient polygons, sci-fi hyperspace faster-than-light jumps, pop-culture "entering the 4th dimension".'
  }
};

export const SCIENTIFIC_DISCLAIMER = {
  title: 'Epistemological Demarcation Directive',
  notice: 'Higher Dimension Lab strictly separates pure mathematical formalism from physical reality.',
  rules: [
    'No 4th or 5th macroscopic spatial dimension has ever been physically discovered or measured.',
    'Spacetime in General Relativity is (3+1)D: three spatial dimensions and one time coordinate with Minkowski signature, NOT four spatial dimensions.',
    'Extra spatial dimensions in theoretical physics (such as Kaluza-Klein 5D) are hypothetical constructs constrained by particle accelerator bounds to sub-nuclear scales (r < 10⁻¹⁹ m).'
  ]
};
