/**
 * 4D Vector implementation for Higher Dimension Lab.
 * Represents a point or vector in Euclidean 4-space ℝ⁴.
 */

export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  copy(v: Vector4): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  add(v: Vector4): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  sub(v: Vector4): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  multiplyScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
    return this;
  }

  dot(v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(): this {
    const l = this.length();
    if (l > 1e-8) {
      this.multiplyScalar(1 / l);
    } else {
      this.set(0, 0, 0, 0);
    }
    return this;
  }

  distanceTo(v: Vector4): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    const dw = this.w - v.w;
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }

  lerp(v: Vector4, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;
    return this;
  }

  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  static fromArray(arr: [number, number, number, number] | number[]): Vector4 {
    return new Vector4(arr[0] ?? 0, arr[1] ?? 0, arr[2] ?? 0, arr[3] ?? 0);
  }

  static lerp(v1: Vector4, v2: Vector4, alpha: number): Vector4 {
    return new Vector4(
      v1.x + (v2.x - v1.x) * alpha,
      v1.y + (v2.y - v1.y) * alpha,
      v1.z + (v2.z - v1.z) * alpha,
      v1.w + (v2.w - v1.w) * alpha
    );
  }
}
