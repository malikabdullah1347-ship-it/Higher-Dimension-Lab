import { Vector4 } from '../../math/Vector4';
import { Geometry4D, Vertex4D, Edge4D, Face4D, Cell4D } from '../types';

/**
 * Generator for the 4D Hypersphere (3-Sphere S³ embedded in ℝ⁴).
 * Equation: x² + y² + z² + w² = R²
 * Discretized into hyperspherical parallels and meridians:
 * ψ ∈ [0, π] (hyper-latitude along W axis)
 * θ ∈ [0, π] (polar angle in XYZ subspace)
 * φ ∈ [0, 2π) (azimuthal angle in XY subspace)
 */
export function generateHypersphere(
  radius = 1.3,
  psiSteps = 7,
  thetaSteps = 8,
  phiSteps = 12
): Geometry4D {
  const vertices: Vertex4D[] = [];
  const edges: Edge4D[] = [];
  const faces: Face4D[] = [];
  let vertId = 0;
  let edgeId = 0;

  // Grid indexing: [psiIdx][thetaIdx][phiIdx] -> vertexId
  const grid: number[][][] = [];

  for (let p = 0; p <= psiSteps; p++) {
    const psi = (p / psiSteps) * Math.PI;
    const sinPsi = Math.sin(psi);
    const cosPsi = Math.cos(psi);
    const w = radius * cosPsi;
    const r3 = radius * sinPsi; // Radius in 3D (x, y, z) subspace

    grid[p] = [];

    for (let t = 0; t <= thetaSteps; t++) {
      const theta = (t / thetaSteps) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const z = r3 * cosTheta;
      const r2 = r3 * sinTheta; // Radius in 2D (x, y) plane

      grid[p][t] = [];

      for (let f = 0; f < phiSteps; f++) {
        const phi = (f / phiSteps) * 2 * Math.PI;
        const x = r2 * Math.cos(phi);
        const y = r2 * Math.sin(phi);

        const pos = new Vector4(x, y, z, w);
        const id = vertId++;
        grid[p][t][f] = id;

        vertices.push({
          id,
          position: pos.clone(),
          originalPosition: pos.clone(),
          wNormal: w / radius,
        });
      }
    }
  }

  // Connect edges along φ rings
  for (let p = 0; p <= psiSteps; p++) {
    for (let t = 0; t <= thetaSteps; t++) {
      for (let f = 0; f < phiSteps; f++) {
        const nextF = (f + 1) % phiSteps;
        edges.push({
          id: edgeId++,
          v1: grid[p][t][f],
          v2: grid[p][t][nextF],
        });
      }
    }
  }

  // Connect edges along θ meridians
  for (let p = 0; p <= psiSteps; p++) {
    for (let t = 0; t < thetaSteps; t++) {
      for (let f = 0; f < phiSteps; f++) {
        edges.push({
          id: edgeId++,
          v1: grid[p][t][f],
          v2: grid[p][t + 1][f],
        });
      }
    }
  }

  // Connect edges along ψ hyper-meridians (connecting through 4D depth)
  for (let p = 0; p < psiSteps; p++) {
    for (let t = 0; t <= thetaSteps; t++) {
      for (let f = 0; f < phiSteps; f += 2) {
        edges.push({
          id: edgeId++,
          v1: grid[p][t][f],
          v2: grid[p + 1][t][f],
        });
      }
    }
  }

  const cells: Cell4D[] = [];

  return {
    id: 'hypersphere',
    name: 'Hypersphere (3-Sphere S³)',
    schläfliSymbol: '—',
    coxeterDiagram: '—',
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
    isAnalyticalHypersphere: true,
    description: 'The 3-dimensional spherical hypersurface in 4-dimensional Euclidean space. Every point satisfies x² + y² + z² + w² = R². When sliced at w = w₀, its cross-section is an exact 3D sphere of radius r = √(R² - w₀²).',
  };
}
