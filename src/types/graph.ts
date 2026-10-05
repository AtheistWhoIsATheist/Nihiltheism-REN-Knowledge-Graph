// src/types/graph.ts

import { EpistemicStratum, PhilosophicalStance, DialecticalRelation, NothingnessType, CandidateGraphDiff, ResidueItem, FormalContradiction, NegativeKnowledgeItem, VoidOperatorExperiment } from './roae';

export type NodeCategory =
  | 'root'
  | 'category'
  | 'concept'
  | 'figure'
  | 'quote'
  | 'document'
  | 'entity'
  | 'theme'
  | 'aporia'
  | 'negative_knowledge';

export interface GraphNode {
  id: string;
  label: string;
  level: number;
  count?: number;
  type: NodeCategory;
  isLeaf?: boolean;
  parentId?: string | null;
  // ROAE 2.0 Epistemic Classifications
  stratum?: EpistemicStratum;
  stance?: PhilosophicalStance;
  nothingnessSense?: NothingnessType;
  roaeProvenance?: {
    diffId: string;
    runId: string;
    engineVersion: string;
    warrant?: string;
  };
  // Dynamic / Ingested properties
  provenance?: {
    documentId?: string;
    sourceFile?: string;
    fileHash?: string;
    extractedAt?: string;
    snippet?: string;
  };
  // Visualization coordinates & velocity (optional simulation state)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string; // node ID
  target: string; // node ID
  type: 'hierarchical' | 'semantic' | 'provenance' | 'cross-cut' | 'dialectical';
  dialecticalRelation?: DialecticalRelation;
  label?: string;
  strength?: number;
  warrant?: string;
}

export interface IngestedDocumentRecord {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  contentHash: string;
  ingestedAt: string;
  nodeCount: number;
  edgeCount: number;
  status: 'success' | 'partial' | 'failed' | 'duplicate';
  statusMessage?: string;
  summary?: string;
}

export interface GraphStorageSchema {
  version: number;
  lastUpdated: string;
  documents: IngestedDocumentRecord[];
  dynamicNodes: GraphNode[];
  dynamicEdges: GraphEdge[];
  candidateDiffs?: CandidateGraphDiff[];
  residueItems?: ResidueItem[];
  contradictions?: FormalContradiction[];
  negativeKnowledge?: NegativeKnowledgeItem[];
  voidExperiments?: VoidOperatorExperiment[];
}

export interface IngestionBatchItem {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'success' | 'duplicate' | 'error';
  progress: number;
  errorMessage?: string;
  extractedNodes?: GraphNode[];
  extractedEdges?: GraphEdge[];
  contentHash?: string;
  summary?: string;
}
