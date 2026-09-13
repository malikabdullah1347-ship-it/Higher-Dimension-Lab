import { CodexEntry } from '../types';

export const CODEX_FOUNDATION_ENTRIES: CodexEntry[] = [
  {
    id: 'cdx-001',
    title: 'The Dimensional Analogy (From Point to Hypercube)',
    category: 'GEOMETRY',
    dimension: 'ALL',
    epistemicStatus: 'MATHEMATICAL',
    summary: 'The recursive generation algorithm where each n-dimensional hypercube is formed by duplicating an (n-1)-cube and sweeping its vertices along a new orthogonal axis.',
    mathematicalFormalism: 'V(n) = 2ⁿ, E(n) = n · 2ⁿ⁻¹, F(n) = (n choose 2) · 2ⁿ⁻², C(n) = (n choose 3) · 2ⁿ⁻³',
    empiricalStatus: 'Directly verified for n = 1, 2, 3. Mathematical formalism for n ≥ 4.',
    tags: ['Hypercube', 'Recursion', 'Coxeter', 'Combinatorics']
  },
  {
    id: 'cdx-002',
    title: 'Minkowski Spacetime Metric & Light Cones',
    category: 'PHYSICS',
    dimension: 'SPACETIME',
    epistemicStatus: 'ESTABLISHED',
    summary: 'The pseudo-Riemannian 4-manifold unifying 3 spatial dimensions with 1 temporal dimension under the invariant interval ds² = -c²dt² + dx² + dy² + dz².',
    mathematicalFormalism: 'g_μν = diag(-1, +1, +1, +1), SO(3,1) Lorentz Group',
    empiricalStatus: 'Experimentally verified with parts-per-billion precision (GPS relativistic corrections, muon decay dilation, gravitational waves).',
    tags: ['Spacetime', 'Lorentz Group', 'Light Cone', 'Special Relativity']
  },
  {
    id: 'cdx-003',
    title: 'Schlegel & Stereographic Projections of the Tesseract',
    category: 'GEOMETRY',
    dimension: '4D',
    epistemicStatus: 'MATHEMATICAL',
    summary: 'Techniques for mapping 4-dimensional polytopes into 3D and 2D spaces while preserving topological connectivity and incidence relationships.',
    mathematicalFormalism: 'Projection P: ℝ⁴ → ℝ³, (x, y, z, w) ↦ (x/(d - w), y/(d - w), z/(d - w)) where d > 1',
    empiricalStatus: 'Mathematical and computer graphics visualization technique. Not a claim of physical 4D space.',
    tags: ['Tesseract', 'Schlegel', 'Stereographic', 'Perspective']
  },
  {
    id: 'cdx-004',
    title: 'Kaluza-Klein 5D Unified Theory (1919/1926)',
    category: 'PHYSICS',
    dimension: '5D',
    epistemicStatus: 'HYPOTHETICAL',
    summary: 'The proposal that an extra compactified spatial circle S¹ produces both Einsteinian general relativity and Maxwellian electromagnetism from a single 5D vacuum metric.',
    mathematicalFormalism: 'ds² = g_μν dx^μ dx^ν + φ² (dx⁵ + A_μ dx^μ)²',
    empiricalStatus: 'Hypothetical. High-energy collider tests (LHC at CERN) establish that extra dimensions must have radius r < 10⁻¹⁹ m if non-warped.',
    tags: ['Kaluza-Klein', 'Compactification', 'Electromagnetism', 'Gauge Theory']
  },
  {
    id: 'cdx-005',
    title: 'Cross-Sectional Tomography (The Flatland Slicing Principle)',
    category: 'TOPOLOGY',
    dimension: '4D',
    epistemicStatus: 'MATHEMATICAL',
    summary: 'Understanding higher-dimensional shapes through continuous 3D slice intersections as the object traverses a hyper-plane perpendicular to the extra axis.',
    mathematicalFormalism: 'Section S(w₀) = { (x, y, z) ∈ ℝ³ | (x, y, z, w₀) ∈ Polytope ⊂ ℝ⁴ }',
    empiricalStatus: 'Standard mathematical technique identical to medical MRI CT scans slicing 3D organs into 2D display frames.',
    tags: ['Tomography', 'Slicing', 'Flatland', 'Intersections']
  },
  {
    id: 'cdx-006',
    title: 'Sub-Millimeter Gravity Constraints on Extra Dimensions',
    category: 'PHYSICS',
    dimension: '5D',
    epistemicStatus: 'ESTABLISHED',
    summary: 'Precision torsion-balance tests of Newton’s inverse-square law searching for deviation F ∝ 1/r^(2+d). Validated standard 1/r² down to ~50 micrometers.',
    mathematicalFormalism: 'V(r) = -G_N (m₁ m₂ / r) [1 + α e^(-r / λ)]',
    empiricalStatus: 'Empirical physical measurements setting stringent upper bounds on macroscopic extra spatial dimensions.',
    tags: ['Torsion Balance', 'Inverse Square Law', 'Gravitational Bounds', 'Eötvös']
  },
  {
    id: 'cdx-007',
    title: 'Rotations in High Dimensions: Simple vs Double Rotations',
    category: 'GEOMETRY',
    dimension: '4D',
    epistemicStatus: 'MATHEMATICAL',
    summary: 'Unlike 3D rotations which occur around an axis line, 4D rotations occur around planes. 4D allows double-rotations: simultaneous independent rotations in two orthogonal planes.',
    mathematicalFormalism: 'SO(4) ≅ (SU(2) × SU(2)) / ℤ₂, R(θ₁, θ₂) rotating in xy and zw planes simultaneously',
    empiricalStatus: 'Pure mathematical theorem of Lie group theory and linear algebra.',
    tags: ['SO(4)', 'Isoclinic', 'Double Rotation', 'Lie Groups']
  },
  {
    id: 'cdx-008',
    title: 'Popular Fictional Tropes vs Scientific Epistemology',
    category: 'EPISTEMOLOGY',
    dimension: 'ALL',
    epistemicStatus: 'FICTIONAL',
    summary: 'Critical analysis of science-fiction concepts such as "entering the 4th dimension", "higher dimensional spirits", or "folding dimensions for warp drive".',
    mathematicalFormalism: 'N/A (Metaphorical / Storytelling)',
    empiricalStatus: 'Purely fictional. Higher spatial dimensions are spatial coordinates, not realms of consciousness, time travel devices, or paranormal domains.',
    tags: ['Sci-Fi', 'Mythbusting', 'Scientific Method', 'Flatland']
  }
];
