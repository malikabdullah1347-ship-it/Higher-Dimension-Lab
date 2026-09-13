import { Vector4 } from '../math/Vector4';
import { Matrix4D, RotationPlane4D } from '../math/Matrix4D';
import { Geometry4D, Vertex4D } from '../geometry/types';

export interface RotationState {
  angles: Record<RotationPlane4D, number>;
  velocities: Record<RotationPlane4D, number>;
  activePlanes: Record<RotationPlane4D, boolean>;
}

export type Preset4DRotation = 
  | 'SIMPLE_XW'
  | 'DOUBLE_ORTHOGONAL'
  | 'CLIFFORD_ISOCLINIC'
  | 'SPATIAL_3D'
  | 'STATIC';

export class TransformationPipeline4D {
  state: RotationState;
  currentMatrix: Matrix4D;
  isPaused: boolean;

  constructor() {
    this.state = {
      angles: {
        XY: 0,
        XZ: 0,
        XW: 0,
        YZ: 0,
        YW: 0,
        ZW: 0,
      },
      velocities: {
        XY: 0,
        XZ: 0,
        XW: 0.6, // Default gentle rotation in hyper-depth plane XW
        YZ: 0.3, // Default gentle rotation in spatial YZ plane
        YW: 0,
        ZW: 0,
      },
      activePlanes: {
        XY: false,
        XZ: false,
        XW: true,
        YZ: true,
        YW: false,
        ZW: false,
      },
    };

    this.currentMatrix = new Matrix4D();
    this.isPaused = false;
    this.recomputeMatrix();
  }

  setAngle(plane: RotationPlane4D, angleRad: number): void {
    this.state.angles[plane] = angleRad;
    this.recomputeMatrix();
  }

  setVelocity(plane: RotationPlane4D, velRadPerSec: number): void {
    this.state.velocities[plane] = velRadPerSec;
    if (Math.abs(velRadPerSec) > 1e-4) {
      this.state.activePlanes[plane] = true;
    }
  }

  togglePlane(plane: RotationPlane4D, active?: boolean): void {
    const next = active !== undefined ? active : !this.state.activePlanes[plane];
    this.state.activePlanes[plane] = next;
    if (next && Math.abs(this.state.velocities[plane]) < 1e-4) {
      this.state.velocities[plane] = 0.5;
    }
  }

  setPreset(preset: Preset4DRotation): void {
    // Reset all
    for (const p of ['XY', 'XZ', 'XW', 'YZ', 'YW', 'ZW'] as RotationPlane4D[]) {
      this.state.activePlanes[p] = false;
      this.state.velocities[p] = 0;
    }

    switch (preset) {
      case 'SIMPLE_XW':
        // Classic 4D hyper-depth rotation: inside-out inversion
        this.state.activePlanes.XW = true;
        this.state.velocities.XW = 0.7;
        break;

      case 'DOUBLE_ORTHOGONAL':
        // Rotates simultaneously in two mutually orthogonal 2-planes: XW and YZ
        this.state.activePlanes.XW = true;
        this.state.activePlanes.YZ = true;
        this.state.velocities.XW = 0.6;
        this.state.velocities.YZ = 0.45;
        break;

      case 'CLIFFORD_ISOCLINIC':
        // Isoclinic double rotation: equal speeds in orthogonal planes
        this.state.activePlanes.XW = true;
        this.state.activePlanes.YZ = true;
        this.state.velocities.XW = 0.6;
        this.state.velocities.YZ = 0.6;
        break;

      case 'SPATIAL_3D':
        // Pure 3D spatial rotation leaving W invariant
        this.state.activePlanes.XY = true;
        this.state.activePlanes.YZ = true;
        this.state.velocities.XY = 0.5;
        this.state.velocities.YZ = 0.5;
        break;

      case 'STATIC':
        // Pause all angular velocities
        break;
    }
  }

  reset(): void {
    for (const p of ['XY', 'XZ', 'XW', 'YZ', 'YW', 'ZW'] as RotationPlane4D[]) {
      this.state.angles[p] = 0;
    }
    this.recomputeMatrix();
  }

  tick(deltaSeconds: number): void {
    if (this.isPaused) return;

    let changed = false;
    for (const p of ['XY', 'XZ', 'XW', 'YZ', 'YW', 'ZW'] as RotationPlane4D[]) {
      if (this.state.activePlanes[p] && Math.abs(this.state.velocities[p]) > 1e-4) {
        this.state.angles[p] += this.state.velocities[p] * deltaSeconds;
        // Keep within [-2PI, 2PI]
        if (this.state.angles[p] > Math.PI * 2) this.state.angles[p] -= Math.PI * 2;
        if (this.state.angles[p] < -Math.PI * 2) this.state.angles[p] += Math.PI * 2;
        changed = true;
      }
    }

    if (changed) {
      this.recomputeMatrix();
    }
  }

  recomputeMatrix(): void {
    this.currentMatrix = Matrix4D.fromAngles(this.state.angles);
  }

  /**
   * Applies the current 4D rotation matrix to all vertices of the geometry.
   * Returns an array of newly transformed Vector4 objects.
   */
  transform(geometry: Geometry4D): Vector4[] {
    const transformed: Vector4[] = new Array(geometry.vertices.length);
    const m = this.currentMatrix;

    for (let i = 0; i < geometry.vertices.length; i++) {
      const orig = geometry.vertices[i].originalPosition;
      transformed[i] = m.transformVector(orig);
    }

    return transformed;
  }
}
