import { Matrix4D, RotationPlane4D } from '../math/Matrix4D';
import { Vector4 } from '../math/Vector4';
import { Vertex4D } from '../geometry/types';

/**
 * Options for transforming collections of Vertex4D points.
 */
export interface VertexTransformOptions {
  /**
   * If true, mutates the existing Vertex4D object and its position vector in place.
   * If false (default), creates and returns a shallow copy of Vertex4D with a new position Vector4.
   */
  inPlace?: boolean;

  /**
   * If true, applies the transformation matrix to `vertex.originalPosition` instead of current `vertex.position`.
   * Useful when angles are absolute rather than incremental deltas. Defaults to false.
   */
  fromOriginal?: boolean;

  /**
   * If true, recalculates the normalized wNormal (-1 to +1) based on maxW. Defaults to true.
   */
  updateNormalW?: boolean;

  /**
   * Absolute bound for normalizing w coordinate into wNormal [-1, 1]. Defaults to 2.0.
   */
  maxW?: number;
}

// ============================================================================
// Canonical 4D Rotation Matrix Factories
// ============================================================================

/**
 * Generates a 4D rotation matrix in the XY plane by angle θ (radians).
 * Coordinates affected: X, Y. Invariant plane: ZW.
 */
export function createRotationXY(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('XY', angleRad);
}

/**
 * Generates a 4D rotation matrix in the XZ plane by angle θ (radians).
 * Coordinates affected: X, Z. Invariant plane: YW.
 */
export function createRotationXZ(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('XZ', angleRad);
}

/**
 * Generates a 4D rotation matrix in the XW plane by angle θ (radians).
 * Hyper-depth rotation: Coordinates affected: X, W. Invariant plane: YZ.
 * Causes coordinates to trade places with the 4th axis W (inside-out inversion).
 */
export function createRotationXW(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('XW', angleRad);
}

/**
 * Generates a 4D rotation matrix in the YZ plane by angle θ (radians).
 * Coordinates affected: Y, Z. Invariant plane: XW.
 */
export function createRotationYZ(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('YZ', angleRad);
}

/**
 * Generates a 4D rotation matrix in the YW plane by angle θ (radians).
 * Hyper-depth rotation: Coordinates affected: Y, W. Invariant plane: XZ.
 */
export function createRotationYW(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('YW', angleRad);
}

/**
 * Generates a 4D rotation matrix in the ZW plane by angle θ (radians).
 * Hyper-depth rotation: Coordinates affected: Z, W. Invariant plane: XY.
 */
export function createRotationZW(angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane('ZW', angleRad);
}

/**
 * Factory for any of the 6 canonical 4D rotation planes.
 */
export function createPlaneRotation(plane: RotationPlane4D, angleRad: number): Matrix4D {
  return Matrix4D.rotationPlane(plane, angleRad);
}

/**
 * Generates a double rotation matrix in SO(4) with simultaneous rotations
 * in two orthogonal 2-planes (e.g. XW and YZ).
 */
export function createDoubleRotation(
  plane1: RotationPlane4D,
  angle1: number,
  plane2: RotationPlane4D,
  angle2: number
): Matrix4D {
  return Matrix4D.doubleRotation(plane1, angle1, plane2, angle2);
}

/**
 * Generates an isoclinic (Clifford) rotation matrix in SO(4).
 * In an isoclinic rotation, both orthogonal planes rotate with equal magnitude |angle|.
 * If chiral is 'left', both planes rotate in positive orientation; if 'right', one is reversed.
 */
export function createIsoclinicRotation(
  plane1: RotationPlane4D = 'XW',
  plane2: RotationPlane4D = 'YZ',
  angle: number,
  chiral: 'left' | 'right' = 'left'
): Matrix4D {
  const angle2 = chiral === 'left' ? angle : -angle;
  return Matrix4D.doubleRotation(plane1, angle, plane2, angle2);
}

/**
 * Composes a single SO(4) transformation matrix from a dictionary of angles
 * across all six canonical rotation planes.
 */
export function createCompoundRotation(
  angles: Partial<Record<RotationPlane4D, number>>
): Matrix4D {
  const fullAngles: Record<RotationPlane4D, number> = {
    XY: angles.XY ?? 0,
    XZ: angles.XZ ?? 0,
    XW: angles.XW ?? 0,
    YZ: angles.YZ ?? 0,
    YW: angles.YW ?? 0,
    ZW: angles.ZW ?? 0,
  };
  return Matrix4D.fromAngles(fullAngles);
}

// ============================================================================
// Vertex4D Transformation Operations
// ============================================================================

/**
 * Applies a 4x4 transformation matrix to a single Vertex4D.
 */
export function rotateVertex4D(
  vertex: Vertex4D,
  matrix: Matrix4D,
  options?: VertexTransformOptions
): Vertex4D {
  const inPlace = options?.inPlace ?? false;
  const fromOriginal = options?.fromOriginal ?? false;
  const updateNormalW = options?.updateNormalW ?? true;
  const maxW = options?.maxW ?? 2.0;

  const sourceVec = fromOriginal ? vertex.originalPosition : vertex.position;
  const transformedPos = matrix.transformVector(sourceVec, inPlace ? vertex.position : undefined);

  const wNormal = updateNormalW
    ? Math.max(-1, Math.min(1, transformedPos.w / (maxW || 1.0)))
    : vertex.wNormal;

  if (inPlace) {
    vertex.position = transformedPos;
    if (updateNormalW) vertex.wNormal = wNormal;
    return vertex;
  }

  return {
    ...vertex,
    position: transformedPos,
    wNormal,
  };
}

/**
 * Transforms an array/collection of Vertex4D points using a 4x4 matrix.
 * Supports both immutable return (new array with new positions) and in-place mutation.
 */
export function rotateVertices4D(
  vertices: readonly Vertex4D[] | Vertex4D[],
  matrix: Matrix4D,
  options?: VertexTransformOptions
): Vertex4D[] {
  const inPlace = options?.inPlace ?? false;
  const len = vertices.length;

  if (inPlace) {
    for (let i = 0; i < len; i++) {
      rotateVertex4D(vertices[i], matrix, options);
    }
    return vertices as Vertex4D[];
  }

  const result: Vertex4D[] = new Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = rotateVertex4D(vertices[i], matrix, options);
  }
  return result;
}

/**
 * Rotates a collection of Vertex4D points in a specific canonical 4D rotation plane.
 */
export function rotateVerticesInPlane(
  vertices: readonly Vertex4D[] | Vertex4D[],
  plane: RotationPlane4D,
  angleRad: number,
  options?: VertexTransformOptions
): Vertex4D[] {
  const matrix = Matrix4D.rotationPlane(plane, angleRad);
  return rotateVertices4D(vertices, matrix, options);
}

/**
 * Applies compound rotations across multiple planes to a collection of Vertex4D points.
 */
export function applyCompoundRotation(
  vertices: readonly Vertex4D[] | Vertex4D[],
  angles: Partial<Record<RotationPlane4D, number>>,
  options?: VertexTransformOptions
): Vertex4D[] {
  const matrix = createCompoundRotation(angles);
  return rotateVertices4D(vertices, matrix, options);
}
