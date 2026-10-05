// src/types/roae.ts
import { GraphNode, GraphEdge } from './graph';

/**
 * Epistemic Stratum for the Phenomenology-Ontology Firewall (Section II)
 */
export type EpistemicStratum =
  | 'L1_REPORT'                     // Raw experiential or textual citation
  | 'L2_PHENOMENOLOGICAL_STRUCTURE' // Invariant structure of lived experience (temporality, affect, void)
  | 'L3_INTERPRETIVE_CLASSIFICATION'// Taxonomy, historical framing, conceptual comparison
  | 'L4_CAUSAL_EXPLANATION'         // Psychological, evolutionary, neurological hypothesis
  | 'L5_ONTOLOGICAL_CLAIM';         // Metaphysical assertion about reality or transcendence

/**
 * Chronological Stance for Philosophical Lineage (Section I)
 */
export type PhilosophicalStance = 'Early' | 'Intermediate' | 'Revised' | 'Current';

/**
 * Dialectical Relations for Relational Mapping (beta pass)
 */
export type DialecticalRelation =
  | 'qualifies'
  | 'contradicts'
  | 'presupposes'
  | 'inverts'
  | 'limits'
  | 'underdetermines'
  | 'grounds'
  | 'subsumes'
  | 'aporia_with';

/**
 * Information-Gain Grade for Recursive Iterative Densification (RID 2.0)
 */
export type InformationGainGrade = 'Material' | 'Useful' | 'Redundant' | 'Ornamental';

/**
 * Adversarial Integrity Protocol Physician Verdict (Section III)
 */
export type PhysicianVerdict =
  | 'Survives Unchanged'
  | 'Survives with Qualification'
  | 'Partially Abandoned'
  | 'Rejected';

/**
 * Residue Management Category (RMP 2.0 - Section V)
 */
export type ResidueCategory =
  | 'R1_MISSING_EVIDENCE'
  | 'R2_CONCEPTUAL_AMBIGUITY'
  | 'R3_METHODOLOGICAL_BARRIER'
  | 'R4_HERMENEUTICAL_FRICTION'
  | 'R5_VALUE_CONFLICT'
  | 'R6_METAPHYSICAL_APORIA'
  | 'R7_STRUCTURAL_PARADOX'
  | 'R8_INCOMMENSURABILITY'
  | 'R9_IRREDUCIBLE_MYSTERY';

/**
 * Typology of Nothingness (Section VI)
 */
export type NothingnessType =
  | 'N1_LOGICAL_NEGATION'        // not-P, property negation
  | 'N3_AXIOLOGICAL_COLLAPSE'     // loss of meaning, nihilistic value drop
  | 'N5_PHENOMENOLOGICAL_EMPTINESS' // felt void, cessation of intentionality
  | 'N7_METAPHYSICAL_ABSENCE'     // cosmic nullity, ontological groundlessness
  | 'N8_NIHILTHEISTIC_NOTHINGNESS';// kenotic transcendent silence, apophatic abyss

/**
 * Convergence Ladder (Section VI)
 */
export type ConvergenceLevel =
  | 'C1_LEXICAL_RESEMBLANCE'
  | 'C2_THEMATIC_AFFINITY'
  | 'C3_FUNCTIONAL_PARALLEL'
  | 'C4_EXPERIENTIAL_ANALOGUE'
  | 'C5_STRUCTURAL_ISOMORPHISM'
  | 'C6_AXIOMATIC_CONVERGENCE'
  | 'C7_ONTOLOGICAL_IDENTITY';

/**
 * Candidate Proposed Node within a Candidate Graph-Diff
 */
export interface CandidateNode {
  tempId: string;
  label: string;
  stratum: EpistemicStratum;
  stratumWarrant: string; // Justification for why this level of claim is earned
  stance: PhilosophicalStance;
  category: GraphNode['type'];
  description?: string;
  lineage: {
    sourcePass: 'alpha_enumeration' | 'beta_relational' | 'gamma_phenomenological';
    targetRef?: string;
  };
  firewallCheck: {
    passed: boolean;
    leapDetected?: boolean; // Flagged if jumping from L1-L4 to L5 without independent warrant
    noeticAlert?: boolean; // Flagged if treating feeling of certainty as truth warrant
  };
  nothingnessSense?: NothingnessType;
  selected?: boolean; // For human review selection
}

/**
 * Candidate Proposed Edge within a Candidate Graph-Diff
 */
export interface CandidateEdge {
  tempId: string;
  sourceTempId: string;
  targetTempId: string;
  relation: DialecticalRelation;
  warrant: string;
  convergenceLevel?: ConvergenceLevel;
  selected?: boolean;
}

/**
 * Research Contract defining bounded analysis
 */
export interface ResearchContract {
  id: string;
  targetText: string;
  primaryQuestions: string[];
  excludedNonGoals: string[];
  sourceHierarchy: string;
  candidateBudget: {
    maxNodes: number;
    maxEdges: number;
  };
}

/**
 * Adversarial Integrity Protocol Audit Report
 */
export interface AdversarialAudit {
  refereeCritique: {
    evaluator: string;
    points: string[];
    vulnerabilitiesIdentified: string[];
  };
  prosecutorCase: {
    strongestCounterThesis: string;
    unfalsifiableClaimsFlagged: string[];
    destructiveObjections: string[];
  };
  physicianVerdict: {
    status: PhysicianVerdict;
    qualificationsRequired: string[];
    rationale: string;
  };
  errorProfile: {
    presumedBias: string;
    cognitiveTrap: string;
    whyItAppearsCompelling: string;
  };
  symmetricalEvaluation: {
    nihiltheisticInterpretation: string;
    naturalisticInterpretation: string;
    traditionalTheologicalInterpretation: string;
    underdeterminationDeclared: boolean;
    underdeterminationRationale?: string;
  };
}

/**
 * Densification and Halting Metrics (RID 2.0)
 */
export interface DensificationMetrics {
  currentPass: number;
  informationGainGrade: InformationGainGrade;
  consecutiveNonMaterialPasses: number;
  halted: boolean;
  haltReason?: string;
  saturation: {
    source: number;       // 0 - 100%
    conceptual: number;   // 0 - 100%
    argumentative: number;// 0 - 100%
    residual: number;     // 0 - 100%
    saturatedWithinScope: boolean;
  };
}

/**
 * A Formal Candidate Graph Diff generated by ROAE 2.0
 */
export interface CandidateGraphDiff {
  id: string;
  runId: string;
  engineVersion: string;
  timestamp: string;
  contract: ResearchContract;
  proposedNodes: CandidateNode[];
  proposedEdges: CandidateEdge[];
  audit: AdversarialAudit;
  densification: DensificationMetrics;
  status: 'pending_review' | 'committed' | 'rejected' | 'partially_committed';
  committedAt?: string;
}

/**
 * Residue Entity (RMP 2.0)
 */
export interface ResidueItem {
  id: string;
  category: ResidueCategory;
  title: string;
  problemStatement: string;
  unanswerabilityRationale: string;
  scope: string;
  status: 'open_friction' | 'mapped_bounded';
  detectedAt: string;
  associatedNodes: string[];
}

/**
 * Formal Contradiction Entity <A, ¬A>
 */
export interface FormalContradiction {
  id: string;
  thesisA: string;
  antithesisNotA: string;
  domainScope: string;
  synthesisForbiddenReason: string;
  createdAt: string;
}

/**
 * Negative Knowledge Entity
 */
export interface NegativeKnowledgeItem {
  id: string;
  assertion: string; // e.g. "Textual silence does not establish authorial denial"
  establishedBy: string;
  createdAt: string;
}

/**
 * Void Operator Experiment Result ∅(X)
 */
export interface VoidOperatorExperiment {
  id: string;
  subtractedAssumption: string; // e.g. "Teleological purpose", "Theism", "Physicalist closure"
  targetArgumentOrDomain: string;
  survivingPhenomenology: string[];
  collapsedStructures: string[];
  survivingEpistemologyAndEthics: string[];
  apophaticResidue: string;
  createdAt: string;
}
