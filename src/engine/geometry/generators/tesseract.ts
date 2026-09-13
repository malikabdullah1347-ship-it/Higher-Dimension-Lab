import { Vector4 } from '../../math/Vector4';
import { Geometry4D, Vertex4D, Edge4D, Face4D, Cell4D } from '../types';

/**
 * Procedural Generator for the Tesseract (Regular 8-cell / Hypercube in ℝ⁴).
 * Schläfli symbol: {4, 3, 3}
 * Topologically exact:
 * - 16 vertices
 * - 32 edges
 * - 24 2D square faces
 * - 8 3D cubic cells
 */
export function generateTesseract(sideLength = 2): Geometry4D {
  const half = sideLength / 2;
  const vertices: Vertex4D[] = [];

  // Generate 16 vertices: all combinations of (±half, ±half, ±half, ±half)
  for (let i = 0; i < 16; i++) {
    const x = (i & 1 ? 1 : -1) * half;
    const y = (i & 2 ? 1 : -1) * half;
    const z = (i & 4 ? 1 : -1) * half;
    const w = (i & 8 ? 1 : -1) * half;

    const pos = new Vector4(x, y, z, w);
    vertices.push({
      id: i,
      position: pos.clone(),
      originalPosition: pos.clone(),
      wNormal: w / half,
    });
  }

  // Generate 32 edges: connect vertices differing in exactly one bit (Hamming distance = 1)
  const edges: Edge4D[] = [];
  let edgeId = 0;

  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const neighbor = i ^ (1 << bit);
      if (i < neighbor) {
        edges.push({
          id: edgeId++,
          v1: i,
          v2: neighbor,
        });
      }
    }
  }

  // Generate 24 square faces:
  // In 4D hypercube, fixing 2 coordinates and varying the other 2 yields 24 squares:
  // C(4, 2) * 2^(4-2) = 6 * 4 = 24 square faces.
  const faces: Face4D[] = [];
  let faceId = 0;

  for (let d1 = 0; d1 < 4; d1++) {
    for (let d2 = d1 + 1; d2 < 4; d2++) {
      // Dimensions d1 and d2 vary, the other two dimensions remain fixed
      const fixedDims = [0, 1, 2, 3].filter((d) => d !== d1 && d !== d2);
      const fd1 = fixedDims[0];
      const fd2 = fixedDims[1];

      for (let s1 = 0; s1 <= 1; s1++) {
        for (let s2 = 0; s2 <= 1; s2++) {
          const base = (s1 << fd1) | (s2 << fd2);
          const v0 = base;
          const v1 = base | (1 << d1);
          const v2 = base | (1 << d1) | (1 << d2);
          const v3 = base | (1 << d2);

          faces.push({
            id: faceId++,
            vertexIndices: [v0, v1, v2, v3],
          });
        }
      }
    }
  }

  // Generate 8 cubic cells:
  // Fixing 1 coordinate (d ∈ {0,1,2,3}) to either -half or +half (sign ∈ {0, 1})
  // yields 4 * 2 = 8 cubes.
  const cells: Cell4D[] = [];
  const cellNames = ['-X', '+X', '-Y', '+Y', '-Z', '+Z', '-W (Past)', '+W (Future)'];

  for (let d = 0; d < 4; d++) {
    for (let sign = 0; sign <= 1; sign++) {
      const cellVertices: number[] = [];
      for (let i = 0; i < 16; i++) {
        if (((i >> d) & 1) === sign) {
          cellVertices.push(i);
        }
      }

      // Find all faces contained inside this cube cell
      const cellFaces: number[] = [];
      for (let f = 0; f < faces.length; f++) {
        const face = faces[f];
        if (face.vertexIndices.every((vi) => cellVertices.includes(vi))) {
          cellFaces.push(f);
        }
      }

      const cellIndex = d * 2 + sign;
      cells.push({
        id: cellIndex,
        name: cellNames[cellIndex] || `Cell ${cellIndex}`,
        vertexIndices: cellVertices,
        faceIndices: cellFaces,
        cellType: 'CUBE',
      });
    }
  }

  const radius = Math.sqrt(4 * half * half); // Distance from center to vertex = sqrt(x²+y²+z²+w²)

  return {
    id: 'tesseract',
    name: 'Tesseract (8-Cell Hypercube)',
    schläfliSymbol: '{4, 3, 3}',
    coxeterDiagram: 'o4o3o3o',
    vertices,
    edges,
    faces,
    cells,
    bounds: {
      radius,
      wMin: -half,
      wMax: half,
    },
    epistemicStatus: 'MATHEMATICAL',
    description: 'The four-dimensional analogue of the 3D cube and 2D square. Formed by 8 cubic cells meeting at 24 square faces, with 32 edges and 16 vertices.',
  };
}
