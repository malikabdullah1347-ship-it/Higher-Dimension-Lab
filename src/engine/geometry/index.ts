import { Geometry4D } from './types';
import { generateTesseract } from './generators/tesseract';
import { generateHypersphere } from './generators/hypersphere';
import { generate16Cell } from './generators/sixteenCell';
import { generate24Cell } from './generators/twentyFourCell';

export * from './types';
export * from './generators/tesseract';
export * from './generators/hypersphere';
export * from './generators/sixteenCell';
export * from './generators/twentyFourCell';

export interface Object4DDefinition {
  id: string;
  name: string;
  shortName: string;
  schläfliSymbol: string;
  polytopeType: 'HYPERCUBE' | 'CROSS_POLYTOPE' | 'SPECIAL_REGULAR' | 'HYPERSURFACE';
  verticesCount: number;
  edgesCount: number;
  facesCount: number;
  cellsCount: number | string;
  generator: () => Geometry4D;
  description: string;
  sliceInsight: string;
}

export const OBJECTS_4D_CATALOG: Object4DDefinition[] = [
  {
    id: 'tesseract',
    name: 'Tesseract (8-Cell Hypercube)',
    shortName: 'Tesseract',
    schläfliSymbol: '{4, 3, 3}',
    polytopeType: 'HYPERCUBE',
    verticesCount: 16,
    edgesCount: 32,
    facesCount: 24,
    cellsCount: 8,
    generator: () => generateTesseract(2.0),
    description: 'The 4D analogue of the cube. Consists of 8 cubic bounding cells meeting at 24 square faces.',
    sliceInsight: 'Slicing aligned along W produces a constant cube. When rotated in 4D, the slice morphs from a point to a tetrahedron, truncated tetrahedron, regular octahedron, and back.',
  },
  {
    id: 'hypersphere',
    name: 'Hypersphere (3-Sphere S³)',
    shortName: 'Hypersphere',
    schläfliSymbol: '—',
    polytopeType: 'HYPERSURFACE',
    verticesCount: 500,
    edgesCount: 800,
    facesCount: 400,
    cellsCount: 'Continuous',
    generator: () => generateHypersphere(1.3),
    description: 'The set of all points equidistant from the origin in 4D: x² + y² + z² + w² = R².',
    sliceInsight: 'Slicing with hyperplane w = w₀ yields a 3D sphere of radius r = √(R² - w₀²). As w sweeps from -R to +R, a point appears, expands into a sphere, reaches maximum radius R at w=0, then shrinks to a point and disappears.',
  },
  {
    id: 'sixteen-cell',
    name: '16-Cell (Hexadecachoron)',
    shortName: '16-Cell',
    schläfliSymbol: '{3, 3, 4}',
    polytopeType: 'CROSS_POLYTOPE',
    verticesCount: 8,
    edgesCount: 24,
    facesCount: 32,
    cellsCount: 16,
    generator: () => generate16Cell(1.4),
    description: 'The 4D cross-polytope, dual to the tesseract. Formed by 16 regular tetrahedral cells meeting at 32 triangular faces.',
    sliceInsight: 'Slicing through an axis yields regular octahedra and truncated polyhedra as the hyperplane traverses between dual coordinate vertices.',
  },
  {
    id: 'twenty-four-cell',
    name: '24-Cell (Icositetrachoron)',
    shortName: '24-Cell',
    schläfliSymbol: '{3, 4, 3}',
    polytopeType: 'SPECIAL_REGULAR',
    verticesCount: 24,
    edgesCount: 96,
    facesCount: 96,
    cellsCount: 24,
    generator: () => generate24Cell(1.3),
    description: 'Unique to 4D space with no 3D analogue. Self-dual regular polychoron bounded by 24 regular octahedra.',
    sliceInsight: 'Slicing yields multifaceted symmetric solids reflecting the exceptional F₄ Lie group symmetry of the 24-cell.',
  },
];

export function getObject4DById(id: string): Geometry4D {
  const def = OBJECTS_4D_CATALOG.find((o) => o.id === id) || OBJECTS_4D_CATALOG[0];
  return def.generator();
}
