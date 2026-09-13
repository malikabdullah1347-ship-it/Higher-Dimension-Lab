import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { Geometry4D, Mesh3D } from '../geometry/types';

export interface Projection4DConfig {
  distance: number; // 4D focal distance d₄ (typically 2.0 to 6.0)
  orthographic: boolean; // When true, d₄ -> ∞, simply projects (x, y, z, w) -> (x, y, z)
  scale: number;
}

/**
 * Mathematically separates the 4D -> 3D projection stage.
 * Given transformed 4D vertices, computes their 3D perspective shadow:
 * s = d₄ / (d₄ - w)
 * [X, Y, Z] = s * [x, y, z]
 */
export class PerspectiveProjection4Dto3D {
  config: Projection4DConfig;

  constructor(config?: Partial<Projection4DConfig>) {
    this.config = {
      distance: 2.8,
      orthographic: false,
      scale: 1.0,
      ...config,
    };
  }

  setDistance(d: number): void {
    this.config.distance = Math.max(1.2, d);
  }

  setOrthographic(ortho: boolean): void {
    this.config.orthographic = ortho;
  }

  projectPoint(v: Vector4): { point3D: Vector3; scaleFactor: number; isClipped: boolean } {
    const { distance, orthographic, scale } = this.config;

    if (orthographic) {
      return {
        point3D: new Vector3(v.x * scale, v.y * scale, v.z * scale),
        scaleFactor: 1.0,
        isClipped: false,
      };
    }

    const denom = distance - v.w;
    if (denom <= 0.05) {
      // Point is beyond or at the 4D focal plane
      return {
        point3D: new Vector3(v.x * scale * 5, v.y * scale * 5, v.z * scale * 5),
        scaleFactor: 5.0,
        isClipped: true,
      };
    }

    const s = distance / denom;
    return {
      point3D: new Vector3(v.x * s * scale, v.y * s * scale, v.z * s * scale),
      scaleFactor: s,
      isClipped: false,
    };
  }

  /**
   * Projects an entire 4D geometry with pre-transformed vertices into a 3D mesh.
   */
  projectGeometry(geometry: Geometry4D, transformedVertices: Vector4[]): Mesh3D {
    const projectedVertices: Vector3[] = new Array(transformedVertices.length);
    const sourceW: number[] = new Array(transformedVertices.length);
    const vertexColors: string[] = new Array(transformedVertices.length);

    for (let i = 0; i < transformedVertices.length; i++) {
      const v4 = transformedVertices[i];
      const { point3D } = this.projectPoint(v4);
      projectedVertices[i] = point3D;
      sourceW[i] = v4.w;

      // Map hyper-depth w coordinate to spectral color gradient:
      // w > 0: Cyan / Emerald (closer in 4D hyper-depth)
      // w < 0: Rose / Violet / Slate (receding in 4D hyper-depth)
      const normW = Math.max(-1, Math.min(1, v4.w / (geometry.bounds.radius || 1)));
      vertexColors[i] = this.getColorForW(normW);
    }

    // Filter valid edges
    const edges3D: [number, number][] = [];
    for (let i = 0; i < geometry.edges.length; i++) {
      const edge = geometry.edges[i];
      edges3D.push([edge.v1, edge.v2]);
    }

    // Copy face topology
    const faces3D: number[][] = [];
    for (let i = 0; i < geometry.faces.length; i++) {
      faces3D.push([...geometry.faces[i].vertexIndices]);
    }

    return {
      vertices: projectedVertices,
      edges: edges3D,
      faces: faces3D,
      sourceW,
      vertexColors,
    };
  }

  getColorForW(normW: number): string {
    // Return HSL hex or rgb for rendering
    if (normW >= 0) {
      // Lerp from neutral cyan (w=0) to bright cyan-emerald (w=1)
      const t = normW;
      const r = Math.round(34 * (1 - t) + 16 * t);
      const g = Math.round(211 * (1 - t) + 245 * t);
      const b = Math.round(238 * (1 - t) + 210 * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Lerp from neutral cyan (w=0) to deep purple-rose (w=-1)
      const t = -normW;
      const r = Math.round(34 * (1 - t) + 244 * t);
      const g = Math.round(211 * (1 - t) + 63 * t);
      const b = Math.round(238 * (1 - t) + 142 * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
}
