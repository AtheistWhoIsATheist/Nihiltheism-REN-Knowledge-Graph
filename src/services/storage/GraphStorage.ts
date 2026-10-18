// src/services/storage/GraphStorage.ts
import canonicalData from '../../data/canonicalGraph.json';
import { GraphNode, GraphEdge, IngestedDocumentRecord, GraphStorageSchema } from '../../types/graph';
import { CandidateGraphDiff, ResidueItem, FormalContradiction, NegativeKnowledgeItem, VoidOperatorExperiment } from '../../types/roae';
import { persistGraphSchemaToIDB, getGraphSchemaFromIDB, clearGraphSchemaFromIDB } from './IndexedDBStorage';
import { graphIndex } from './GraphIndex';

const STORAGE_KEY = 'nihiltheism_graph_storage_v1';

class GraphStorageService {
  private schema: GraphStorageSchema = {
    version: 2,
    lastUpdated: new Date().toISOString(),
    documents: [],
    dynamicNodes: [],
    dynamicEdges: [],
    candidateDiffs: [],
    residueItems: [],
    contradictions: [],
    negativeKnowledge: [],
    voidExperiments: []
  };

  private listeners: Array<() => void> = [];
  private cachedAllNodes: GraphNode[] | null = null;
  private cachedAllEdges: GraphEdge[] | null = null;

  constructor() {
    this.loadFromStorage();
    this.seedDefaultResidueAndNegativeKnowledge();
    this.rebuildIndex();
    this.initIndexedDB();
  }

  public rebuildIndex() {
    this.cachedAllNodes = null;
    this.cachedAllEdges = null;
    const allNodes = this.getAllNodes();
    const allEdges = this.getAllEdges();
    graphIndex.buildIndex(allNodes, allEdges);
  }

  private loadFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && !parsed.isIndexedDB && Array.isArray(parsed.documents)) {
          this.schema = {
            version: parsed.version || 2,
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
            documents: parsed.documents || [],
            dynamicNodes: parsed.dynamicNodes || [],
            dynamicEdges: parsed.dynamicEdges || [],
            candidateDiffs: parsed.candidateDiffs || [],
            residueItems: parsed.residueItems || [],
            contradictions: parsed.contradictions || [],
            negativeKnowledge: parsed.negativeKnowledge || [],
            voidExperiments: parsed.voidExperiments || []
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load graph persistence state from localStorage:', e);
    }
  }

  private async initIndexedDB() {
    if (typeof window === 'undefined') return;
    try {
      const idbSchema = await getGraphSchemaFromIDB();
      if (idbSchema && Array.isArray(idbSchema.documents)) {
        const inMemoryCount = (this.schema.dynamicNodes?.length || 0) + (this.schema.dynamicEdges?.length || 0);
        const idbCount = (idbSchema.dynamicNodes?.length || 0) + (idbSchema.dynamicEdges?.length || 0);
        const idbDocs = idbSchema.documents?.length || 0;
        const memDocs = this.schema.documents?.length || 0;

        // If IDB has more or newer data, update in-memory schema
        if (
          idbCount > inMemoryCount ||
          idbDocs > memDocs ||
          (idbSchema.lastUpdated && idbSchema.lastUpdated > this.schema.lastUpdated)
        ) {
          this.schema = {
            version: idbSchema.version || 2,
            lastUpdated: idbSchema.lastUpdated || new Date().toISOString(),
            documents: idbSchema.documents || [],
            dynamicNodes: idbSchema.dynamicNodes || [],
            dynamicEdges: idbSchema.dynamicEdges || [],
            candidateDiffs: idbSchema.candidateDiffs || [],
            residueItems: idbSchema.residueItems?.length ? idbSchema.residueItems : this.schema.residueItems,
            contradictions: idbSchema.contradictions?.length ? idbSchema.contradictions : this.schema.contradictions,
            negativeKnowledge: idbSchema.negativeKnowledge?.length ? idbSchema.negativeKnowledge : this.schema.negativeKnowledge,
            voidExperiments: idbSchema.voidExperiments || []
          };
          this.rebuildIndex();
          this.notifyListeners();
        }
      } else if (this.schema.dynamicNodes.length > 0 || this.schema.documents.length > 0) {
        // Seed IDB with whatever we loaded from localStorage
        await persistGraphSchemaToIDB(this.schema, true);
      }
    } catch (err) {
      console.warn('[GraphStorage] IndexedDB initialization warning:', err);
    }
  }

  private seedDefaultResidueAndNegativeKnowledge() {
    // If first load, seed canonical aporias and negative knowledge
    if (!this.schema.residueItems || this.schema.residueItems.length === 0) {
      this.schema.residueItems = [
        {
          id: 'res_1',
          category: 'R6_METAPHYSICAL_APORIA',
          title: 'The Origin of Intentional Consciousness from Groundlessness',
          problemStatement: 'How does teleological or intentional meaning emerge from an intrinsically groundless ontological substrate without smuggling in latent teleology?',
          unanswerabilityRationale: 'Explaining emergence via teleology begs the question; explaining purely via mechanistic accident leaves intentional interiority unbridged.',
          scope: 'Metaphysics / Philosophy of Mind',
          status: 'mapped_bounded',
          detectedAt: new Date().toISOString(),
          associatedNodes: ['node_1', 'node_kde']
        },
        {
          id: 'res_2',
          category: 'R7_STRUCTURAL_PARADOX',
          title: 'Kenotic Ineffability vs. Linguistic Articulation',
          problemStatement: 'The assertion that the ultimate substrate transcends all language is itself a linguistic assertion subject to semantic deconstruction.',
          unanswerabilityRationale: 'Apophatic theology must employ kataphatic propositions to deny kataphatic competence (the liar paradox of radical silence).',
          scope: 'Apophatic Epistemology',
          status: 'mapped_bounded',
          detectedAt: new Date().toISOString(),
          associatedNodes: ['node_3']
        }
      ];
    }

    if (!this.schema.contradictions || this.schema.contradictions.length === 0) {
      this.schema.contradictions = [
        {
          id: 'contra_1',
          thesisA: 'Being is radiced in absolute groundless void (Nothingness is the ultimate substrate).',
          antithesisNotA: 'Being is self-sustaining physicalist immanence with no metaphysical void behind it.',
          domainScope: 'Cosmological Foundation',
          synthesisForbiddenReason: 'Symmetrical Skepticism: synthesizing transcendent kenosis with physicalist closure produces conceptual mush that erases the genuine dialectical friction.',
          createdAt: new Date().toISOString()
        }
      ];
    }

    if (!this.schema.negativeKnowledge || this.schema.negativeKnowledge.length === 0) {
      this.schema.negativeKnowledge = [
        {
          id: 'neg_1',
          assertion: 'Textual silence in apophatic corpora does not establish empirical denial of phenomenal reality.',
          establishedBy: 'ROAE Epistemic Invariant II.4 (Kenotic & Apophatic Constraints)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'neg_2',
          assertion: 'Structural isomorphism between Eastern emptiness (Śūnyatā) and Western nihilism does not establish ontological identity (Ladder Level C7 is unproven; restricted to C5).',
          establishedBy: 'ROAE Convergence Ladder Protocol',
          createdAt: new Date().toISOString()
        },
        {
          id: 'neg_3',
          assertion: 'The profound psychological relief of embracing meaninglessness does not establish that existence is objectively meaningless (A-4 Non-Consolation symmetry).',
          establishedBy: 'Epistemic Non-Consolation Principle (A-4)',
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  public saveToStorage() {
    this.schema.lastUpdated = new Date().toISOString();
    this.rebuildIndex();

    // 1. Asynchronously persist complete schema to IndexedDB (virtually unlimited quota, zero QuotaExceededError risk)
    persistGraphSchemaToIDB(this.schema).catch(err => {
      console.warn('[GraphStorage] IndexedDB async save warning:', err);
    });

    // 2. Safe synchronous cache in localStorage with graceful quota handling
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const serialized = JSON.stringify(this.schema);
        // Only mirror to localStorage if serialized size is within conservative 2MB threshold
        if (serialized.length < 2_000_000) {
          localStorage.setItem(STORAGE_KEY, serialized);
        } else {
          // Payload is large; store lightweight metadata stub so quota is never exceeded
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: this.schema.version,
            lastUpdated: this.schema.lastUpdated,
            isIndexedDB: true,
            docCount: this.schema.documents.length,
            dynamicNodeCount: this.schema.dynamicNodes.length
          }));
        }
      } catch (e) {
        // QuotaExceededError caught gracefully without throwing or reporting fatal error
        console.warn('[GraphStorage] localStorage quota reached; schema safely stored in IndexedDB:', e);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: this.schema.version,
            lastUpdated: this.schema.lastUpdated,
            isIndexedDB: true,
            docCount: this.schema.documents.length,
            dynamicNodeCount: this.schema.dynamicNodes.length
          }));
        } catch {
          // If localStorage is completely full across origin, IndexedDB is already saved
        }
      }
    }

    // 3. Notify all subscribers (App.tsx and active views)
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.warn('Listener notification warning:', e);
      }
    }
  }

  public getCanonicalNodes(): GraphNode[] {
    return canonicalData.nodes as GraphNode[];
  }

  public getCanonicalEdges(): GraphEdge[] {
    return canonicalData.edges as GraphEdge[];
  }

  public getDocuments(): IngestedDocumentRecord[] {
    return this.schema.documents;
  }

  public getDocumentByHash(contentHash: string): IngestedDocumentRecord | undefined {
    return this.schema.documents.find(d => d.contentHash === contentHash && d.status === 'success');
  }

  public getDynamicNodes(): GraphNode[] {
    return this.schema.dynamicNodes;
  }

  public getDynamicEdges(): GraphEdge[] {
    return this.schema.dynamicEdges;
  }

  public getAllNodes(): GraphNode[] {
    if (this.cachedAllNodes) return this.cachedAllNodes;
    const canonical = this.getCanonicalNodes();
    const dynamic = this.getDynamicNodes();
    const map = new Map<string, GraphNode>();

    for (const node of canonical) {
      map.set(node.id, node);
    }
    for (const node of dynamic) {
      map.set(node.id, node);
    }
    this.cachedAllNodes = Array.from(map.values());
    return this.cachedAllNodes;
  }

  public getAllEdges(): GraphEdge[] {
    if (this.cachedAllEdges) return this.cachedAllEdges;
    const canonical = this.getCanonicalEdges();
    const dynamic = this.getDynamicEdges();
    const map = new Map<string, GraphEdge>();

    for (const edge of canonical) {
      map.set(edge.id, edge);
    }
    for (const edge of dynamic) {
      map.set(edge.id, edge);
    }
    this.cachedAllEdges = Array.from(map.values());
    return this.cachedAllEdges;
  }

  public getNodeById(id: string): GraphNode | undefined {
    return graphIndex.nodeById.get(id);
  }

  public getNeighbors(id: string, hops: 1 | 2 = 1): Set<string> {
    return graphIndex.getNeighborhood(id, hops);
  }

  public getEdgesForNode(id: string): GraphEdge[] {
    return graphIndex.edgesByNode.get(id) || [];
  }

  public getCategoryNodeIds(category: string): string[] {
    return graphIndex.categoryBuckets.get(category) || [];
  }

  public searchNodeIds(query: string, max = 500): string[] {
    return graphIndex.searchNodes(query, max);
  }

  public getIndex(): typeof graphIndex {
    return graphIndex;
  }

  public addIngestedDocument(
    doc: IngestedDocumentRecord,
    newNodes: GraphNode[],
    newEdges: GraphEdge[]
  ) {
    this.schema.documents.unshift(doc);

    const existingNodeIds = new Set(this.schema.dynamicNodes.map(n => n.id));
    for (const n of newNodes) {
      if (!existingNodeIds.has(n.id)) {
        this.schema.dynamicNodes.push(n);
        existingNodeIds.add(n.id);
      }
    }

    const existingEdgeIds = new Set(this.schema.dynamicEdges.map(e => e.id));
    for (const e of newEdges) {
      if (!existingEdgeIds.has(e.id)) {
        this.schema.dynamicEdges.push(e);
        existingEdgeIds.add(e.id);
      }
    }

    this.saveToStorage();
  }

  public addDynamicEntities(newNodes: GraphNode[], newEdges: GraphEdge[]) {
    const existingNodeIds = new Set(this.schema.dynamicNodes.map(n => n.id));
    for (const n of newNodes) {
      if (!existingNodeIds.has(n.id)) {
        this.schema.dynamicNodes.push(n);
        existingNodeIds.add(n.id);
      }
    }

    const existingEdgeIds = new Set(this.schema.dynamicEdges.map(e => e.id));
    for (const e of newEdges) {
      if (!existingEdgeIds.has(e.id)) {
        this.schema.dynamicEdges.push(e);
        existingEdgeIds.add(e.id);
      }
    }

    this.saveToStorage();
  }

  // --- CANDIDATE GRAPH-DIFF PROTOCOL (Section I) ---

  public getCandidateDiffs(): CandidateGraphDiff[] {
    return this.schema.candidateDiffs || [];
  }

  public addCandidateDiff(diff: CandidateGraphDiff) {
    if (!this.schema.candidateDiffs) this.schema.candidateDiffs = [];
    this.schema.candidateDiffs.unshift(diff);
    this.saveToStorage();
  }

  /**
   * Commits approved candidate nodes & edges into the live graph topology
   * Enforces atomic transaction: either all approved items commit, or state is untouched.
   */
  public commitCandidateDiff(
    diffId: string,
    approvedNodeTempIds: string[],
    approvedEdgeTempIds: string[]
  ) {
    if (!this.schema.candidateDiffs) return;
    const diff = this.schema.candidateDiffs.find(d => d.id === diffId);
    if (!diff) return;

    const tempToRealIdMap = new Map<string, string>();
    const newLiveNodes: GraphNode[] = [];
    const newLiveEdges: GraphEdge[] = [];

    // Map and instantiate nodes
    for (const cNode of diff.proposedNodes) {
      if (approvedNodeTempIds.includes(cNode.tempId)) {
        const permanentId = `roae_node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        tempToRealIdMap.set(cNode.tempId, permanentId);

        const liveNode: GraphNode = {
          id: permanentId,
          label: cNode.label,
          level: cNode.stratum === 'L1_REPORT' ? 1 : (cNode.stratum === 'L5_ONTOLOGICAL_CLAIM' ? 5 : 2),
          type: cNode.category,
          stratum: cNode.stratum,
          stance: cNode.stance,
          nothingnessSense: cNode.nothingnessSense,
          isLeaf: cNode.stratum === 'L1_REPORT' || cNode.stratum === 'L2_PHENOMENOLOGICAL_STRUCTURE',
          roaeProvenance: {
            diffId: diff.id,
            runId: diff.runId,
            engineVersion: diff.engineVersion,
            warrant: cNode.stratumWarrant
          }
        };
        newLiveNodes.push(liveNode);
      }
    }

    // Map and instantiate edges
    for (const cEdge of diff.proposedEdges) {
      if (approvedEdgeTempIds.includes(cEdge.tempId)) {
        const sourceReal = tempToRealIdMap.get(cEdge.sourceTempId);
        const targetReal = tempToRealIdMap.get(cEdge.targetTempId);

        if (sourceReal && targetReal) {
          const liveEdge: GraphEdge = {
            id: `roae_edge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            source: sourceReal,
            target: targetReal,
            type: 'dialectical',
            dialecticalRelation: cEdge.relation,
            label: cEdge.relation,
            warrant: cEdge.warrant
          };
          newLiveEdges.push(liveEdge);
        }
      }
    }

    // Connect to canonical root or primary topic if no parent
    if (newLiveNodes.length > 0) {
      const firstRealId = newLiveNodes[0].id;
      // Connect to root-1 (JOURNAL314 Ω) or T1 Groundlessness
      const rootEdge: GraphEdge = {
        id: `roae_conn_${Date.now()}`,
        source: 'node_1',
        target: firstRealId,
        type: 'dialectical',
        label: 'roae_analysis',
        warrant: 'Integrated from Candidate Graph-Diff via human audit'
      };
      newLiveEdges.push(rootEdge);
    }

    // Atomic insert
    this.schema.dynamicNodes.push(...newLiveNodes);
    this.schema.dynamicEdges.push(...newLiveEdges);

    // Update diff status
    diff.status = (approvedNodeTempIds.length === diff.proposedNodes.length) ? 'committed' : 'partially_committed';
    diff.committedAt = new Date().toISOString();

    this.saveToStorage();
  }

  public rejectCandidateDiff(diffId: string) {
    if (!this.schema.candidateDiffs) return;
    const diff = this.schema.candidateDiffs.find(d => d.id === diffId);
    if (diff) {
      diff.status = 'rejected';
      this.saveToStorage();
    }
  }

  // --- RESIDUE MANAGEMENT PANEL (RMP 2.0 - Section V) ---

  public getResidueItems(): ResidueItem[] {
    return this.schema.residueItems || [];
  }

  public addResidueItem(item: ResidueItem) {
    if (!this.schema.residueItems) this.schema.residueItems = [];
    this.schema.residueItems.unshift(item);
    this.saveToStorage();
  }

  public toggleResidueStatus(id: string) {
    if (!this.schema.residueItems) return;
    const item = this.schema.residueItems.find(r => r.id === id);
    if (item) {
      item.status = item.status === 'open_friction' ? 'mapped_bounded' : 'open_friction';
      this.saveToStorage();
    }
  }

  public getContradictions(): FormalContradiction[] {
    return this.schema.contradictions || [];
  }

  public addContradiction(item: FormalContradiction) {
    if (!this.schema.contradictions) this.schema.contradictions = [];
    this.schema.contradictions.unshift(item);
    this.saveToStorage();
  }

  public getNegativeKnowledge(): NegativeKnowledgeItem[] {
    return this.schema.negativeKnowledge || [];
  }

  public addNegativeKnowledge(item: NegativeKnowledgeItem) {
    if (!this.schema.negativeKnowledge) this.schema.negativeKnowledge = [];
    this.schema.negativeKnowledge.unshift(item);
    this.saveToStorage();
  }

  // --- NIHILTHEISTIC SUITE & VOID OPERATOR (Section VI) ---

  public getVoidExperiments(): VoidOperatorExperiment[] {
    return this.schema.voidExperiments || [];
  }

  public addVoidExperiment(exp: VoidOperatorExperiment) {
    if (!this.schema.voidExperiments) this.schema.voidExperiments = [];
    this.schema.voidExperiments.unshift(exp);
    this.saveToStorage();
  }

  public pruneDynamicOrphans(): number {
    const orphanIds = new Set(graphIndex.getPrunableOrphanIds());
    if (orphanIds.size === 0) return 0;

    const initialCount = this.schema.dynamicNodes.length;
    this.schema.dynamicNodes = this.schema.dynamicNodes.filter(n => !orphanIds.has(n.id));
    this.schema.dynamicEdges = this.schema.dynamicEdges.filter(e => {
      const sId = typeof e.source === 'object' && e.source !== null ? (e.source as { id: string }).id : String(e.source);
      const tId = typeof e.target === 'object' && e.target !== null ? (e.target as { id: string }).id : String(e.target);
      return !orphanIds.has(sId) && !orphanIds.has(tId);
    });

    const prunedCount = initialCount - this.schema.dynamicNodes.length;
    this.saveToStorage();
    return prunedCount;
  }

  public clearDynamicData() {
    this.schema = {
      version: 2,
      lastUpdated: new Date().toISOString(),
      documents: [],
      dynamicNodes: [],
      dynamicEdges: [],
      candidateDiffs: [],
      residueItems: [],
      contradictions: [],
      negativeKnowledge: [],
      voidExperiments: []
    };
    this.seedDefaultResidueAndNegativeKnowledge();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    clearGraphSchemaFromIDB().catch(err => {
      console.warn('[GraphStorage] Failed to clear IndexedDB:', err);
    });
    this.saveToStorage();
  }
}

export const graphStorage = new GraphStorageService();
