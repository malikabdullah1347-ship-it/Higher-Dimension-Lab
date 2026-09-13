import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { EpistemicStatus } from '../../types';

export interface Vertex4D {
  id: number;
  position: Vector4;
  originalPosition: Vector4;
  color?: string;
  wNormal?: number; // Normalized W coordinate (-1 to 1) for spectral coloring
}

export interface Edge4D {
  id: number;
  v1: number; // Index into vertices
  v2: number; // Index into vertices
}

export interface Face4D {
  id: number;
  vertexIndices: number[]; // Ordered indices forming the boundary polygon (triangle or quad)
  cellNeighbors?: number[];
}

export interface Cell4D {
  id: number;
  name?: string;
  vertexIndices: number[];
  faceIndices: number[];
  cellType: 'CUBE' | 'TETRAHEDRON' | 'OCTAHEDRON' | 'POLYGON_MESH';
}

export interface Geometry4D {
  id: string;
  name: string;
  schläfliSymbol?: string;
  coxeterDiagram?: string;
  vertices: Vertex4D[];
  edges: Edge4D[];
  faces: Face4D[];
  cells: Cell4D[];
  bounds: {
    radius: number;
    wMin: number;
    wMax: number;
  };
  epistemicStatus: EpistemicStatus;
  description: string;
  isAnalyticalHypersphere?: boolean;
}

export interface Mesh3D {
  vertices: Vector3[];
  edges: [number, number][];
  faces: number[][];
  normals?: Vector3[];
  vertexColors?: string[];
  sourceW?: number[]; // W coordinates of origin points before projection
  isAnalytical?: boolean;
  analyticalRadius?: number;
}

export interface CrossSectionTelemetry {
  w: number;
  activeVertices: number;
  activeEdges: number;
  activeFaces: number;
  estimatedVolume: number | null;
  intersectionStatus: 'EMPTY' | 'TANGENT' | 'INTERSECTING';
  shapeClassification: string;
  crossSectionAreaApprox: number | null;
  wBounds: [number, number];
}

export type ObservationMode = 'PROJECTION' | 'SLICE' | 'COMPARE';
