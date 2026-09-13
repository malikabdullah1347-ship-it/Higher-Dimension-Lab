import { Vector4 } from '../../math/Vector4';
import { Geometry4D, Vertex4D, Edge4D, Face4D, Cell4D } from '../types';

/**
 * Generator for the 24-cell (Icositetrachoron / Octaplex).
 * Schläfli symbol: {3, 4, 3}
 * Unique to 4 dimensions (has no analogue in any other dimension!).
 * It is self-dual:
 * - 24 vertices
 * - 96 edges
 * - 96 triangular faces
 * - 24 regular octahedral cells
 */
export function generate24Cell(radius = 1.3): Geometry4D {
  const vertices: Vertex4D[] = [];

  // 1. 8 vertices from permutations of (±radius, 0, 0, 0)
  for (let d = 0; d < 4; d++) {
    for (const sign of [1, -1]) {
      const c = [0, 0, 0, 0];
      c[d] = sign * radius;
      const pos = new Vector4(c[0], c[1], c[2], c[3]);
      vertices.push({
        id: vertices.length,
        position: pos.clone(),
        originalPosition: pos.clone(),
        wNormal: pos.w / radius,
      });
    }
  }

  // 2. 16 vertices from all signs of (±half, ±half, ±half, ±half), where half = radius / 2 * (scaling)
  // Distance from origin must be equal to radius, so (4 * s²) = radius² => s = radius / 2
  const s = radius / 2;
  for (let i = 0; i < 16; i++) {
    const x = (i & 1 ? 1 : -1) * s * Math.SQRT2; // Adjust so all lie on sphere
    const y = (i & 2 ? 1 : -1) * s * Math.SQRT2;
    const z = (i & 4 ? 1 : -1) * s * Math.SQRT2;
    const w = (i & 8 ? 1 : -1) * s * Math.SQRT2;

    const pos = new Vector4(x, y, z, w);
    pos.normalize().multiplyScalar(radius); // Ensure exact spherical radius

    vertices.push({
      id: vertices.length,
      position: pos.clone(),
      originalPosition: pos.clone(),
      wNormal: pos.w / radius,
    });
  }

  // Edges: in the 24-cell, each vertex has degree 8, connecting to its nearest neighbors.
  // We can find all pairs with minimum Euclidean distance.
  const edges: Edge4D[] = [];
  let edgeId = 0;
  const edgeSet = new Set<string>();

  // Determine minimum neighbor distance
  let minDistance = Infinity;
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dist = vertices[i].originalPosition.distanceTo(vertices[j].originalPosition);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }
  }

  const threshold = minDistance * 1.08;

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dist = vertices[i].originalPosition.distanceTo(vertices[j].originalPosition);
      if (dist <= threshold) {
        const key = `${i}-${j}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({
            id: edgeId++,
            v1: i,
            v2: j,
          });
        }
      }
    }
  }

  // Faces: Triangles formed by 3 vertices with mutual edges
  const faces: Face4D[] = [];
  let faceId = 0;

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      if (!edgeSet.has(`${i}-${j}`)) continue;
      for (let k = j + 1; k < vertices.length; k++) {
        if (edgeSet.has(`${i}-${k}`) && edgeSet.has(`${j}-${k}`)) {
          faces.push({
            id: faceId++,
            vertexIndices: [i, j, k],
          });
        }
      }
    }
  }

  const cells: Cell4D[] = [];

  return {
    id: 'twenty-four-cell',
    name: '24-Cell (Icositetrachoron)',
    schläfliSymbol: '{3, 4, 3}',
    coxeterDiagram: 'o3o4o3o',
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
    description: 'A singular regular 4-polytope with no 3D analogue. Self-dual like the 4D simplex, its boundary consists of 24 regular octahedra meeting 3 at each edge.',
  };
}
