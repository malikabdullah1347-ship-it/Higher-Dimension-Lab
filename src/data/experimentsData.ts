import { ExperimentEntry } from '../types';

export const EXPERIMENTS_FOUNDATION: ExperimentEntry[] = [
  {
    id: 'exp-01',
    code: 'HDL-EXP-01',
    title: 'Flatland Slicing: 3D Sphere Passing Through a 2D Plane',
    category: 'SLICING',
    dimensionTarget: '2D',
    epistemicStatus: 'MATHEMATICAL',
    hypothesis: 'A 2D observer confined to plane z=0 perceives a passing 3D sphere as a point growing into an expanding disk and then shrinking back to a point.',
    methodology: 'Define sphere S²: x² + y² + (z - z₀)² = R². At z=0, equation becomes x² + y² = R² - z₀², which is a circle of radius r(z₀) = √(R² - z₀²).',
    mathematicalProofOrModel: 'Cross section is non-empty for |z₀| ≤ R. Extends directly by induction to 4D hypersphere S³: x² + y² + z² = R² - w₀² intersecting 3D space.',
    physicalRealityCheck: 'Mathematically exact. Analogous to ultrasound / MRI slicing. No physical 4th dimension implied.',
    statusPhase: 'FRAMEWORK_READY'
  },
  {
    id: 'exp-02',
    code: 'HDL-EXP-02',
    title: '4D Tesseract Double-Rotation Projection',
    category: 'PROJECTION',
    dimensionTarget: '4D',
    epistemicStatus: 'MATHEMATICAL',
    hypothesis: 'A 4D tesseract undergoing simultaneous orthogonal rotations (e.g. in xw and yz planes) produces dynamic isometric perspective projections with continuous interior-exterior inversion.',
    methodology: 'Apply 4×4 orthogonal transformation matrix R = R_xw(θ₁) · R_yz(θ₂) to 16 vertices of [-1, 1]⁴, then apply 4D-to-3D perspective mapping, followed by 3D-to-2D viewport rendering.',
    mathematicalProofOrModel: 'Det(R) = +1, preserving all 32 edge lengths and 24 square face angles in 4-space. Distortions are solely artifacts of projection.',
    physicalRealityCheck: 'Rigorous geometric simulation. Vertices are mathematical coordinates in ℝ⁴.',
    statusPhase: 'PROJECTION_PROTOTYPE'
  },
  {
    id: 'exp-03',
    code: 'HDL-EXP-03',
    title: 'Knot Trivialization in 4-Dimensional Space',
    category: 'ANALOGY',
    dimensionTarget: '4D',
    epistemicStatus: 'MATHEMATICAL',
    hypothesis: 'Any knotted 1-dimensional loop (such as a trefoil knot in ℝ³) can be unknotted in ℝ⁴ without cutting by lifting crossings into the 4th spatial coordinate w.',
    methodology: 'Represent knot as embedding S¹ ↪ ℝ⁴. At crossing point where two strands overlap in ℝ³, displace one strand along w-axis: (x, y, z, 0) vs (x, y, z, ε). Strands never intersect in ℝ⁴.',
    mathematicalProofOrModel: 'Whitney embedding theorem and ambient isotopy in dimensions n ≥ 4. Every smooth 1D knot in ℝ⁴ is ambient isotopic to the unknot.',
    physicalRealityCheck: 'Pure topology theorem. Real physical ropes are constrained by 3 macroscopic spatial dimensions and cannot escape through w.',
    statusPhase: 'FRAMEWORK_READY'
  },
  {
    id: 'exp-04',
    code: 'HDL-EXP-04',
    title: 'Eötvös Sub-Millimeter Gravity Null Test for Extra Dimensions',
    category: 'PHYSICAL_BOUND',
    dimensionTarget: '5D',
    epistemicStatus: 'ESTABLISHED',
    hypothesis: 'If extra spatial dimensions exist with compactification radius R*, gravitational flux spreads into n extra dimensions, causing Newtonian 1/r² force law to transition to 1/r^(2+n) for distances r < R*.',
    methodology: 'Ultra-sensitive torsion pendulums with tungsten plates measuring gravitational attraction at micron separations down to ~40 μm. Compare with 1/r² predictions.',
    mathematicalProofOrModel: 'Gauss’s Law in (3+d) dimensions: ∮ g · dA = S_(2+d) G_(4+d) M. For r ≪ R, F(r) ∝ 1/r^(2+d). For r ≫ R, F(r) ∝ 1/r².',
    physicalRealityCheck: 'Empirical physics reality: No deviation observed down to ~44 microns. Extra flat spatial dimensions must be smaller than this bound.',
    statusPhase: 'FRAMEWORK_READY'
  }
];
