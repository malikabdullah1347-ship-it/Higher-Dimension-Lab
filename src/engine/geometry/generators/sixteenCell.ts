import { Vector4 } from '../../math/Vector4';
import { Geometry4D, Vertex4D, Edge4D, Face4D, Cell4D } from '../types';

/**
 * Generator for the 16-cell (Hexadecachoron / Regular 4D Cross-Polytope).
 * Schläfli symbol: {3, 3, 4}
 * The 4D dual of the tesseract:
 * - 8 vertices: (±1, 0, 0, 0), (0, ±1, 0, 0), (0, 0, ±1, 0), (0, 0, 0, ±1)
 * - 24 edges: pairs of vertices on different coordinate axes (distance = √2)
 * - 32 triangular faces
 * - 16 regular tetrahedral cells
 */
export function generate16Cell(radius = 1.4): Geometry4D {
  const vertices: Vertex4D[] = [];
  const coords = [
    [1, 0, 0, 0], [-1, 0, 0, 0],
    [0, 1, 0, 0], [0, -1, 0, 0],
    [0, 0, 1, 0], [0, 0, -1, 0],
    [0, 0, 0, 1], [0, 0, 0, -1],
  ];

  for (let i = 0; i < coords.length; i++) {
    const c = coords[i];
    const pos = new Vector4(c[0] * radius, c[1] * radius, c[2] * radius, c[3] * radius);
    vertices.push({
      id: i,
      position: pos.clone(),
      originalPosition: pos.clone(),
      wNormal: c[3],
    });
  }

  // Edges: All pairs of vertices EXCEPT opposite pairs (i.e. not (0,1), (2,3), (4,5), (6,7))
  // Total edges = C(8, 2) - 4 = 28 - 4 = 24 edges.
  const edges: Edge4D[] = [];
  let edgeId = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      // If i and j are opposite poles on the same axis, their XOR is 1 and i is even:
      if (Math.floor(i / 2) !== Math.floor(j / 2)) {
        edges.push({
          id: edgeId++,
          v1: i,
          v2: j,
        });
      }
    }
  }

  // 32 triangular faces: triplets of vertices that are mutually connected
  const faces: Face4D[] = [];
  let faceId = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      if (Math.floor(i / 2) === Math.floor(j / 2)) continue;
      for (let k = j + 1; k < 8; k++) {
        if (Math.floor(i / 2) === Math.floor(k / 2) || Math.floor(j / 2) === Math.floor(k / 2)) continue;
        faces.push({
          id: faceId++,
          vertexIndices: [i, j, k],
        });
      }
    }
  }

  // 16 tetrahedral cells: choose 1 vertex from each of the 4 axes: 2⁴ = 16 tetrahedra
  const cells: Cell4D[] = [];
  let cellId = 0;

  for (let s0 = 0; s0 < 2; s0++) {
    for (let s1 = 0; s1 < 2; s1++) {
      for (let s2 = 0; s2 < 2; s2++) {
        for (let s3 = 0; s3 < 2; s3++) {
          const vList = [s0, 2 + s1, 4 + s2, 6 + s3];
          cells.push({
            id: cellId++,
            name: `Tetrahedron ${cellId}`,
            vertexIndices: vList,
            faceIndices: [],
            cellType: 'TETRAHEDRON',
          });
        }
      }
    }
  }

  return {
    id: 'sixteen-cell',
    name: '16-Cell (Hexadecachoron)',
    schläfliSymbol: '{3, 3, 4}',
    coxeterDiagram: 'o3o3o4o',
    vertices,
    edges,
    faces,
    cells,
    bounds: {
      radius,
      wMin: -radius,
      wMax: radius,
    },
    epistemicStatus: 'MATHEMATICAL',
    description: 'The 4-dimensional regular cross-polytope and geometric dual of the tesseract. Composed of 16 tetrahedral cells, 32 triangular faces, 24 edges, and 8 vertices.',
  };
}
