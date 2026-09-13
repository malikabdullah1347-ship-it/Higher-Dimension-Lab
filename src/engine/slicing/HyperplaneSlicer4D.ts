import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { Geometry4D, Mesh3D, CrossSectionTelemetry } from '../geometry/types';

export interface SliceConfig {
  w: number; // Position w₀ of the slicing hyperplane
  thickness: number; // Visual slab thickness (if rendering a thin slice)
  tolerance: number;
}

/**
 * Real 4D Hyperplane Slicing Engine.
 * Computes the exact mathematical 3D intersection between
 * a 4-dimensional object and the hyperplane w = w₀.
 */
export class HyperplaneSlicer4D {
  config: SliceConfig;

  constructor(config?: Partial<SliceConfig>) {
    this.config = {
      w: 0.0,
      thickness: 0.05,
      tolerance: 1e-4,
      ...config,
    };
  }

  setW(w: number): void {
    this.config.w = w;
  }

  /**
   * Computes the 3D cross-section geometry and telemetry
   * for the given transformed 4D vertices.
   */
  sliceGeometry(
    geometry: Geometry4D,
    transformedVertices: Vector4[]
  ): { mesh: Mesh3D; telemetry: CrossSectionTelemetry } {
    const w0 = this.config.w;
    const tol = this.config.tolerance;

    // Special exact case: Analytical Hypersphere
    if (geometry.isAnalyticalHypersphere) {
      return this.sliceHypersphere(geometry, w0);
    }

    // 1. Edge-Hyperplane Intersections
    // Map edge index -> intersection vertex in 3D
    const edgeIntersectionMap = new Map<number, { point3D: Vector3; index3D: number }>();
    const intersectionVertices3D: Vector3[] = [];

    // Also track vertices that lie directly on the hyperplane
    const onPlaneVertices = new Map<number, number>();

    for (let i = 0; i < transformedVertices.length; i++) {
      if (Math.abs(transformedVertices[i].w - w0) < tol) {
        const v = transformedVertices[i];
        const p3 = new Vector3(v.x, v.y, v.z);
        const idx = intersectionVertices3D.length;
        intersectionVertices3D.push(p3);
        onPlaneVertices.set(i, idx);
      }
    }

    for (let i = 0; i < geometry.edges.length; i++) {
      const edge = geometry.edges[i];
      const v1 = transformedVertices[edge.v1];
      const v2 = transformedVertices[edge.v2];

      const d1 = v1.w - w0;
      const d2 = v2.w - w0;

      // Check if edge strictly crosses the hyperplane
      if ((d1 < -tol && d2 > tol) || (d1 > tol && d2 < -tol)) {
        const t = (w0 - v1.w) / (v2.w - v1.w);
        const inter4D = Vector4.lerp(v1, v2, t);
        const point3D = new Vector3(inter4D.x, inter4D.y, inter4D.z);
        const index3D = intersectionVertices3D.length;
        intersectionVertices3D.push(point3D);
        edgeIntersectionMap.set(i, { point3D, index3D });
      }
    }

    // 2. Face-Hyperplane Intersections => Edges of the 3D cross-section
    // In ℝ⁴, the intersection of a 2D polygonal face with a 3D hyperplane is a 1D line segment.
    const intersectionEdges3D: [number, number][] = [];
    const edgeSet = new Set<string>();

    const add3DEdge = (a: number, b: number) => {
      if (a === b) return;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        intersectionEdges3D.push([a, b]);
      }
    };

    // Pre-build face-to-edge index for fast lookup
    for (let f = 0; f < geometry.faces.length; f++) {
      const face = geometry.faces[f];
      const faceVertices = face.vertexIndices;
      const faceIntersectionIndices: number[] = [];

      // Check each edge around the face perimeter
      for (let k = 0; k < faceVertices.length; k++) {
        const vi1 = faceVertices[k];
        const vi2 = faceVertices[(k + 1) % faceVertices.length];

        // Find edge in geometry
        const edgeIdx = geometry.edges.findIndex(
          (e) => (e.v1 === vi1 && e.v2 === vi2) || (e.v1 === vi2 && e.v2 === vi1)
        );

        if (edgeIdx !== -1 && edgeIntersectionMap.has(edgeIdx)) {
          faceIntersectionIndices.push(edgeIntersectionMap.get(edgeIdx)!.index3D);
        } else if (onPlaneVertices.has(vi1)) {
          const idx = onPlaneVertices.get(vi1)!;
          if (!faceIntersectionIndices.includes(idx)) {
            faceIntersectionIndices.push(idx);
          }
        }
      }

      // If exactly 2 intersection points exist on the face boundary, connect them
      if (faceIntersectionIndices.length >= 2) {
        for (let i = 0; i < faceIntersectionIndices.length - 1; i++) {
          add3DEdge(faceIntersectionIndices[i], faceIntersectionIndices[i + 1]);
        }
        if (faceIntersectionIndices.length > 2) {
          add3DEdge(faceIntersectionIndices[faceIntersectionIndices.length - 1], faceIntersectionIndices[0]);
        }
      }
    }

    // 3. Reconstruct 3D solid faces (Polygon cross-sections of 4D cells)
    // For each cell in geometry, its intersection with w = w₀ is a 2D polygon in ℝ³
    const intersectionFaces3D: number[][] = [];

    if (geometry.cells && geometry.cells.length > 0) {
      for (const cell of geometry.cells) {
        const cellIntersectionIndices: number[] = [];

        // Collect all intersection vertices on edges belonging to this cell
        for (const [edgeIdx, data] of edgeIntersectionMap.entries()) {
          const edge = geometry.edges[edgeIdx];
          if (cell.vertexIndices.includes(edge.v1) && cell.vertexIndices.includes(edge.v2)) {
            if (!cellIntersectionIndices.includes(data.index3D)) {
              cellIntersectionIndices.push(data.index3D);
            }
          }
        }

        // Also add on-plane vertices in this cell
        for (const vi of cell.vertexIndices) {
          if (onPlaneVertices.has(vi)) {
            const idx = onPlaneVertices.get(vi)!;
            if (!cellIntersectionIndices.includes(idx)) {
              cellIntersectionIndices.push(idx);
            }
          }
        }

        // If at least 3 vertices, order them into a polygon around their centroid
        if (cellIntersectionIndices.length >= 3) {
          const ordered = this.orderPlanarPolygon(cellIntersectionIndices, intersectionVertices3D);
          if (ordered.length >= 3) {
            intersectionFaces3D.push(ordered);
          }
        }
      }
    }

    // 4. Calculate Cross-Section Bounding Box, Volume, and Status
    let minW = Infinity, maxW = -Infinity;
    for (let i = 0; i < transformedVertices.length; i++) {
      const w = transformedVertices[i].w;
      if (w < minW) minW = w;
      if (w > maxW) maxW = w;
    }

    let status: 'EMPTY' | 'TANGENT' | 'INTERSECTING' = 'EMPTY';
    if (w0 < minW - tol || w0 > maxW + tol) {
      status = 'EMPTY';
    } else if (Math.abs(w0 - minW) <= tol || Math.abs(w0 - maxW) <= tol) {
      status = 'TANGENT';
    } else if (intersectionVertices3D.length > 0) {
      status = 'INTERSECTING';
    }

    // Estimate volume of the 3D cross-section
    const estimatedVolume = this.estimatePolyhedronVolume(intersectionVertices3D, intersectionFaces3D);
    const shapeClassification = this.classifyShape(
      geometry.id,
      intersectionVertices3D.length,
      intersectionEdges3D.length,
      intersectionFaces3D.length,
      w0
    );

    const telemetry: CrossSectionTelemetry = {
      w: w0,
      activeVertices: intersectionVertices3D.length,
      activeEdges: intersectionEdges3D.length,
      activeFaces: intersectionFaces3D.length,
      estimatedVolume,
      intersectionStatus: status,
      shapeClassification,
      crossSectionAreaApprox: intersectionVertices3D.length > 0 ? (estimatedVolume ? Math.pow(estimatedVolume, 2 / 3) * 6 : null) : 0,
      wBounds: [minW, maxW],
    };

    return {
      mesh: {
        vertices: intersectionVertices3D,
        edges: intersectionEdges3D,
        faces: intersectionFaces3D,
        isAnalytical: false,
      },
      telemetry,
    };
  }

  /**
   * Exact analytical cross-section calculation for the 4D Hypersphere S³.
   * x² + y² + z² + w² = R²  ==>  x² + y² + z² = R² - w₀²
   */
  private sliceHypersphere(geometry: Geometry4D, w0: number): { mesh: Mesh3D; telemetry: CrossSectionTelemetry } {
    const R = geometry.bounds.radius;
    const rSq = R * R - w0 * w0;

    if (rSq <= 0) {
      const status: 'EMPTY' | 'TANGENT' = Math.abs(Math.abs(w0) - R) < 0.05 ? 'TANGENT' : 'EMPTY';
      return {
        mesh: { vertices: [], edges: [], faces: [], isAnalytical: true, analyticalRadius: 0 },
        telemetry: {
          w: w0,
          activeVertices: 0,
          activeEdges: 0,
          activeFaces: 0,
          estimatedVolume: 0,
          intersectionStatus: status,
          shapeClassification: status === 'TANGENT' ? '0D Point Contact' : 'Empty (Outside S³)',
          crossSectionAreaApprox: 0,
          wBounds: [-R, R],
        },
      };
    }

    const r3 = Math.sqrt(rSq);
    const volume = (4 / 3) * Math.PI * Math.pow(r3, 3);
    const area = 4 * Math.PI * rSq;

    // Discretize the 3D sphere into a smooth visual mesh
    const latSegments = 14;
    const lonSegments = 20;
    const vertices: Vector3[] = [];
    const edges: [number, number][] = [];
    const faces: number[][] = [];

    for (let lat = 0; lat <= latSegments; lat++) {
      const theta = (lat / latSegments) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonSegments; lon++) {
        const phi = (lon / lonSegments) * 2 * Math.PI;
        const x = r3 * sinTheta * Math.cos(phi);
        const y = r3 * cosTheta;
        const z = r3 * sinTheta * Math.sin(phi);

        vertices.push(new Vector3(x, y, z));
      }
    }

    // Connect wireframe rings & faces
    for (let lat = 0; lat < latSegments; lat++) {
      for (let lon = 0; lon < lonSegments; lon++) {
        const first = lat * (lonSegments + 1) + lon;
        const second = first + lonSegments + 1;

        edges.push([first, first + 1]);
        edges.push([first, second]);

        faces.push([first, second, second + 1, first + 1]);
      }
    }

    return {
      mesh: {
        vertices,
        edges,
        faces,
        isAnalytical: true,
        analyticalRadius: r3,
      },
      telemetry: {
        w: w0,
        activeVertices: vertices.length,
        activeEdges: edges.length,
        activeFaces: faces.length,
        estimatedVolume: volume,
        intersectionStatus: 'INTERSECTING',
        shapeClassification: `3D Sphere (r = ${r3.toFixed(2)})`,
        crossSectionAreaApprox: area,
        wBounds: [-R, R],
      },
    };
  }

  /**
   * Sorts coplanar 3D vertices cyclically around their common centroid to form a convex/planar polygon.
   */
  private orderPlanarPolygon(indices: number[], allVertices: Vector3[]): number[] {
    if (indices.length <= 3) return indices;

    // Compute centroid
    const centroid = new Vector3(0, 0, 0);
    for (const idx of indices) {
      centroid.add(allVertices[idx]);
    }
    centroid.multiplyScalar(1 / indices.length);

    // Compute plane normal using first two non-collinear vectors
    const v0 = allVertices[indices[0]].clone().sub(centroid);
    let normal = new Vector3(0, 0, 1);
    let u = v0.clone().normalize();

    for (let i = 1; i < indices.length; i++) {
      const vi = allVertices[indices[i]].clone().sub(centroid);
      const cross = v0.clone().cross(vi);
      if (cross.lengthSq() > 1e-5) {
        normal = cross.normalize();
        break;
      }
    }

    const v = normal.clone().cross(u).normalize();

    // Sort by 2D polar angle in the plane (u, v)
    const withAngles = indices.map((idx) => {
      const diff = allVertices[idx].clone().sub(centroid);
      const x = diff.dot(u);
      const y = diff.dot(v);
      const angle = Math.atan2(y, x);
      return { idx, angle };
    });

    withAngles.sort((a, b) => a.angle - b.angle);
    return withAngles.map((a) => a.idx);
  }

  /**
   * Estimates the volume of a 3D polyhedron from its vertices and faces.
   */
  private estimatePolyhedronVolume(vertices: Vector3[], faces: number[][]): number | null {
    if (vertices.length < 4 || faces.length < 4) return null;

    // Center point
    const center = new Vector3();
    for (const v of vertices) center.add(v);
    center.multiplyScalar(1 / vertices.length);

    let totalVolume = 0;

    // Sum signed volumes of tetrahedra formed by (center, face_v0, face_v1, face_v2)
    for (const face of faces) {
      if (face.length < 3) continue;
      const v0 = vertices[face[0]];

      for (let i = 1; i < face.length - 1; i++) {
        const v1 = vertices[face[i]];
        const v2 = vertices[face[i + 1]];

        const a = v0.clone().sub(center);
        const b = v1.clone().sub(center);
        const c = v2.clone().sub(center);

        const tetVolume = Math.abs(a.dot(b.cross(c))) / 6.0;
        totalVolume += tetVolume;
      }
    }

    return totalVolume > 1e-4 ? totalVolume : null;
  }

  private classifyShape(
    geomId: string,
    vCount: number,
    eCount: number,
    fCount: number,
    w: number
  ): string {
    if (vCount === 0) return 'None (Outside Object)';
    if (vCount === 1) return 'Point Contact (Tangent)';
    if (vCount === 2) return 'Line Segment';
    if (vCount === 3) return 'Planar Triangle';

    if (geomId === 'tesseract') {
      if (vCount === 8 && eCount === 12 && fCount === 6) return 'Regular 3D Cube (Axis-Aligned)';
      if (vCount === 4 && fCount === 4) return 'Tetrahedron';
      if (vCount === 6 && fCount === 8) return 'Regular Octahedron';
      if (vCount === 12) return 'Truncated Octahedron / Hexagonal Prism';
      if (vCount > 8) return `Polyhedral Cross-Section (${vCount} vertices)`;
      return `3D Polyhedron (${vCount}V / ${eCount}E)`;
    }

    if (geomId === 'sixteen-cell') {
      if (vCount === 6) return 'Regular Octahedron';
      if (vCount === 4) return 'Tetrahedron';
      return `Cross-Section (${vCount} vertices)`;
    }

    if (geomId === 'twenty-four-cell') {
      return `24-Cell Slice (${vCount} vertices, ${fCount} faces)`;
    }

    return `3D Solid (${vCount} vertices)`;
  }
}
