import { Vector4 } from './Vector4';

export type RotationPlane4D = 'XY' | 'XZ' | 'XW' | 'YZ' | 'YW' | 'ZW';

/**
 * 4x4 Transformation Matrix in Euclidean ℝ⁴.
 * Stored in row-major order: elements[row * 4 + col].
 */
export class Matrix4D {
  elements: Float64Array;

  constructor() {
    this.elements = new Float64Array(16);
    this.identity();
  }

  identity(): this {
    const e = this.elements;
    e.fill(0);
    e[0] = 1;
    e[5] = 1;
    e[10] = 1;
    e[15] = 1;
    return this;
  }

  clone(): Matrix4D {
    const m = new Matrix4D();
    m.elements.set(this.elements);
    return m;
  }

  copy(m: Matrix4D): this {
    this.elements.set(m.elements);
    return this;
  }

  /**
   * Multiplies this matrix by another: this = this * m
   */
  multiply(m: Matrix4D): this {
    const a = this.elements;
    const b = m.elements;
    const r = new Float64Array(16);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[row * 4 + k] * b[k * 4 + col];
        }
        r[row * 4 + col] = sum;
      }
    }

    this.elements.set(r);
    return this;
  }

  /**
   * Applies this 4x4 matrix to a 4D vector: out = M * v
   */
  transformVector(v: Vector4, out?: Vector4): Vector4 {
    const target = out || new Vector4();
    const e = this.elements;
    const x = v.x, y = v.y, z = v.z, w = v.w;

    target.x = e[0] * x + e[1] * y + e[2] * z + e[3] * w;
    target.y = e[4] * x + e[5] * y + e[6] * z + e[7] * w;
    target.z = e[8] * x + e[9] * y + e[10] * z + e[11] * w;
    target.w = e[12] * x + e[13] * y + e[14] * z + e[15] * w;

    return target;
  }

  /**
   * Generates a rotation matrix in one of the 6 fundamental orthogonal 4D planes.
   * In ℝ⁴, a rotation occurs in a 2D plane leaving the orthogonal 2D plane invariant.
   */
  static rotationPlane(plane: RotationPlane4D, angleRad: number): Matrix4D {
    const m = new Matrix4D();
    const c = Math.cos(angleRad);
    const s = Math.sin(angleRad);
    const e = m.elements;

    switch (plane) {
      case 'XY':
        // Rotates X and Y; Z and W invariant
        e[0] = c;  e[1] = -s;
        e[4] = s;  e[5] = c;
        break;

      case 'XZ':
        // Rotates X and Z; Y and W invariant
        e[0] = c;  e[2] = -s;
        e[8] = s;  e[10] = c;
        break;

      case 'XW':
        // Rotates X and W; Y and Z invariant (Hyper-depth rotation)
        e[0] = c;   e[3] = -s;
        e[12] = s;  e[15] = c;
        break;

      case 'YZ':
        // Rotates Y and Z; X and W invariant
        e[5] = c;  e[6] = -s;
        e[9] = s;  e[10] = c;
        break;

      case 'YW':
        // Rotates Y and W; X and Z invariant
        e[5] = c;   e[7] = -s;
        e[13] = s;  e[15] = c;
        break;

      case 'ZW':
        // Rotates Z and W; X and Y invariant
        e[10] = c;  e[11] = -s;
        e[14] = s;  e[15] = c;
        break;
    }

    return m;
  }

  /**
   * Generates a double rotation matrix (simultaneous rotations in 2 mutually orthogonal planes).
   * In 4D, two completely orthogonal planes (e.g. XW and YZ) can rotate independently.
   * When theta1 === theta2, this is an isoclinic (Clifford) rotation.
   */
  static doubleRotation(
    plane1: RotationPlane4D,
    angle1: number,
    plane2: RotationPlane4D,
    angle2: number
  ): Matrix4D {
    const m1 = Matrix4D.rotationPlane(plane1, angle1);
    const m2 = Matrix4D.rotationPlane(plane2, angle2);
    m1.multiply(m2);
    return m1;
  }

  /**
   * Compound rotation from an object of angles for all 6 planes.
   */
  static fromAngles(angles: Record<RotationPlane4D, number>): Matrix4D {
    const result = new Matrix4D();
    const planes: RotationPlane4D[] = ['XY', 'XZ', 'XW', 'YZ', 'YW', 'ZW'];

    for (const p of planes) {
      const a = angles[p];
      if (a !== undefined && Math.abs(a) > 1e-7) {
        result.multiply(Matrix4D.rotationPlane(p, a));
      }
    }

    return result;
  }

  /**
   * Transpose matrix (for orthogonal matrices, transpose === inverse).
   */
  transpose(): this {
    const e = this.elements;
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const tmp = e[i * 4 + j];
        e[i * 4 + j] = e[j * 4 + i];
        e[j * 4 + i] = tmp;
      }
    }
    return this;
  }

  /**
   * Returns a 2D 4x4 array representation for UI rendering / inspection.
   */
  toGrid(): number[][] {
    const grid: number[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: number[] = [];
      for (let c = 0; c < 4; c++) {
        row.push(this.elements[r * 4 + c]);
      }
      grid.push(row);
    }
    return grid;
  }
}
