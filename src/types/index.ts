/**
 * Core type definitions for Higher Dimension Lab
 */

export type EpistemicStatus = 
  | 'ESTABLISHED' 
  | 'MATHEMATICAL' 
  | 'HYPOTHETICAL' 
  | 'SPECULATIVE' 
  | 'FICTIONAL';

export interface EpistemicMeta {
  status: EpistemicStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  shortDefinition: string;
  epistemicCriteria: string;
  example: string;
}

export type DimensionId = '1D' | '2D' | '3D' | '4D' | '5D';

export interface DimensionFeature {
  id: DimensionId;
  order: number;
  name: string;
  coordinateNotation: string;
  algebraicStructure: string;
  geometricArchetype: string;
  degreesOfFreedom: number;
  vertices: number;
  edges: number;
  faces: number;
  cells: number;
  hypercells: number;
  epistemicStatus: EpistemicStatus;
  statusNote: string;
  physicalStatus: string;
  mathematicalStatus: string;
  projectionAnalogy: string;
  crossSectionAnalogy: string;
  futureModulePlanned: string;
}

export type ModuleId = 
  | 'overview' 
  | 'dimension-lab' 
  | 'time-lab' 
  | 'codex' 
  | 'experiments' 
  | 'frontier';

export interface ModuleNav {
  id: ModuleId;
  title: string;
  subtitle: string;
  badge?: string;
  iconName: string;
  phase: string;
}

export interface CodexEntry {
  id: string;
  title: string;
  category: 'GEOMETRY' | 'PHYSICS' | 'TOPOLOGY' | 'EPISTEMOLOGY' | 'HISTORY';
  dimension: DimensionId | 'ALL' | 'SPACETIME';
  epistemicStatus: EpistemicStatus;
  summary: string;
  mathematicalFormalism?: string;
  empiricalStatus: string;
  tags: string[];
}

export interface ExperimentEntry {
  id: string;
  code: string;
  title: string;
  category: 'ANALOGY' | 'SLICING' | 'PROJECTION' | 'PHYSICAL_BOUND';
  dimensionTarget: DimensionId | '4D-SPACETIME';
  epistemicStatus: EpistemicStatus;
  hypothesis: string;
  methodology: string;
  mathematicalProofOrModel: string;
  physicalRealityCheck: string;
  statusPhase: 'FRAMEWORK_READY' | 'PROJECTION_PROTOTYPE' | 'PLANNED_PHASE_2';
}
