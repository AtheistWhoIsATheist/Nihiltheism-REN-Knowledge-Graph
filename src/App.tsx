/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { GraphCanvas } from './components/GraphCanvas';
import { HypermapView } from './components/HypermapView';
import { IngestionModal } from './components/IngestionModal';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { PreservationLedgerModal } from './components/PreservationLedgerModal';
import { ExportModal } from './components/ExportModal';
import { RoaeWorkspaceModal } from './components/RoaeWorkspaceModal';
import { CandidateDiffReviewModal } from './components/CandidateDiffReviewModal';
import { ResidueManagementModal } from './components/ResidueManagementModal';
import { NihiltheisticSuiteModal } from './components/NihiltheisticSuiteModal';
import { Journal314CorpusModal } from './components/Journal314CorpusModal';
import { graphStorage } from './services/storage/GraphStorage';
import { GraphNode } from './types/graph';
import { CandidateGraphDiff } from './types/roae';

export default function App() {
  const [nodes, setNodes] = useState(() => graphStorage.getAllNodes());
  const [edges, setEdges] = useState(() => graphStorage.getAllEdges());
  const [documents, setDocuments] = useState(() => graphStorage.getDocuments());
  const [candidateDiffs, setCandidateDiffs] = useState(() => graphStorage.getCandidateDiffs());
  const [residueItems, setResidueItems] = useState(() => graphStorage.getResidueItems());

  const [viewMode, setViewMode] = useState<'graph' | 'hypermap'>('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Modals state
  const [isRoaeOpen, setIsRoaeOpen] = useState(false);
  const [isDiffReviewOpen, setIsDiffReviewOpen] = useState(false);
  const [isResidueOpen, setIsResidueOpen] = useState(false);
  const [isNihiltheisticSuiteOpen, setIsNihiltheisticSuiteOpen] = useState(false);
  const [isJournal314Open, setIsJournal314Open] = useState(false);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Subscribe to storage updates (survives ingestion, ROAE commits, and reload)
  useEffect(() => {
    const unsubscribe = graphStorage.subscribe(() => {
      setNodes(graphStorage.getAllNodes());
      setEdges(graphStorage.getAllEdges());
      setDocuments(graphStorage.getDocuments());
      setCandidateDiffs(graphStorage.getCandidateDiffs());
      setResidueItems(graphStorage.getResidueItems());
    });
    return unsubscribe;
  }, []);

  const canonicalNodes = useMemo(() => graphStorage.getCanonicalNodes(), []);
  const canonicalEdges = useMemo(() => graphStorage.getCanonicalEdges(), []);

  // Quick node map for neighbor lookups in inspector
  const nodesMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [nodes]);

  const handleSelectNode = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleClearDynamicData = useCallback(() => {
    graphStorage.clearDynamicData();
    setSelectedNode(null);
  }, []);

  const pendingDiffsCount = useMemo(() => {
    return candidateDiffs.filter(d => d.status === 'pending_review').length;
  }, [candidateDiffs]);

  const handleDiffGenerated = useCallback((_diff: CandidateGraphDiff) => {
    setCandidateDiffs(graphStorage.getCandidateDiffs());
    // Automatically prompt user to review the candidate diff in the audit workspace
    setIsDiffReviewOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070711] text-[#f6f7ff] font-sans select-none">
      {/* Top Application Header */}
      <Header
        totalNodes={nodes.length}
        totalEdges={edges.length}
        canonicalNodeCount={canonicalNodes.length}
        documents={documents}
        pendingDiffsCount={pendingDiffsCount}
        residueCount={residueItems.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenRoae={() => setIsRoaeOpen(true)}
        onOpenDiffReview={() => setIsDiffReviewOpen(true)}
        onOpenResidue={() => setIsResidueOpen(true)}
        onOpenNihiltheisticSuite={() => setIsNihiltheisticSuiteOpen(true)}
        onOpenJournal314Corpus={() => setIsJournal314Open(true)}
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Visualization Viewport */}
      <main className="flex-1 relative overflow-hidden">
        {viewMode === 'graph' ? (
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectNode={handleSelectNode}
            selectedNodeId={selectedNode?.id || null}
          />
        ) : (
          <HypermapView
            nodes={nodes}
            searchQuery={searchQuery}
            onSelectNode={handleSelectNode}
            selectedNodeId={selectedNode?.id || null}
          />
        )}
      </main>

      {/* Modals & Slide-out Drawers */}
      <NodeInspectorModal
        node={selectedNode}
        edges={edges}
        nodesMap={nodesMap}
        onClose={() => setSelectedNode(null)}
        onSelectNode={handleSelectNode}
      />

      <RoaeWorkspaceModal
        isOpen={isRoaeOpen}
        onClose={() => setIsRoaeOpen(false)}
        onDiffGenerated={handleDiffGenerated}
      />

      <CandidateDiffReviewModal
        isOpen={isDiffReviewOpen}
        onClose={() => setIsDiffReviewOpen(false)}
        diffs={candidateDiffs}
        onCommitSuccess={() => {
          setNodes(graphStorage.getAllNodes());
          setEdges(graphStorage.getAllEdges());
          setCandidateDiffs(graphStorage.getCandidateDiffs());
        }}
      />

      <ResidueManagementModal
        isOpen={isResidueOpen}
        onClose={() => setIsResidueOpen(false)}
        onUpdate={() => {
          setResidueItems(graphStorage.getResidueItems());
        }}
      />

      <NihiltheisticSuiteModal
        isOpen={isNihiltheisticSuiteOpen}
        onClose={() => setIsNihiltheisticSuiteOpen(false)}
      />

      <Journal314CorpusModal
        isOpen={isJournal314Open}
        onClose={() => setIsJournal314Open(false)}
        onSyncToGraph={(newNodes, newEdges) => {
          graphStorage.addDynamicEntities(newNodes, newEdges);
          setNodes(graphStorage.getAllNodes());
          setEdges(graphStorage.getAllEdges());
        }}
      />

      <IngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onIngestionComplete={() => {
          setNodes(graphStorage.getAllNodes());
          setEdges(graphStorage.getAllEdges());
          setDocuments(graphStorage.getDocuments());
        }}
      />

      <PreservationLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        canonicalNodeCount={canonicalNodes.length}
        canonicalEdgeCount={canonicalEdges.length}
        activeNodeCount={nodes.length}
        activeEdgeCount={edges.length}
        documents={documents}
        onClearDynamicData={handleClearDynamicData}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        nodes={nodes}
        edges={edges}
        documents={documents}
      />
    </div>
  );
}
