// src/components/NodeInspectorModal.tsx
import React, { useMemo } from 'react';
import { GraphNode, GraphEdge } from '../types/graph';

interface NodeInspectorModalProps {
  node: GraphNode | null;
  edges: GraphEdge[];
  nodesMap: Map<string, GraphNode>;
  onClose: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  edges,
  nodesMap,
  onClose,
  onSelectNode
}) => {
  if (!node) return null;

  // Find parent node
  const parentNode = useMemo(() => {
    if (!node.parentId) return null;
    return nodesMap.get(node.parentId) || null;
  }, [node.parentId, nodesMap]);

  // Find child subtopics
  const childNodes = useMemo(() => {
    const list: GraphNode[] = [];
    nodesMap.forEach(n => {
      if (n.parentId === node.id) {
        list.push(n);
      }
    });
    return list;
  }, [node.id, nodesMap]);

  // Find connected semantic cross-cut links
  const connectedEdges = useMemo(() => {
    return edges.filter(e => {
      const sId = typeof e.source === 'object' && e.source !== null ? (e.source as { id: string }).id : String(e.source);
      const tId = typeof e.target === 'object' && e.target !== null ? (e.target as { id: string }).id : String(e.target);
      return sId === node.id || tId === node.id;
    });
  }, [edges, node.id]);

  const semanticNeighbors = useMemo(() => {
    return connectedEdges
      .map(edge => {
        const sId = typeof edge.source === 'object' && edge.source !== null ? (edge.source as { id: string }).id : String(edge.source);
        const tId = typeof edge.target === 'object' && edge.target !== null ? (edge.target as { id: string }).id : String(edge.target);
        const isSource = sId === node.id;
        const targetId = isSource ? tId : sId;
        const neighbor = nodesMap.get(targetId);
        return {
          neighbor,
          edgeLabel: edge.label,
          direction: isSource ? 'outgoing' : 'incoming'
        };
      })
      .filter(item => Boolean(item.neighbor));
  }, [connectedEdges, node.id, nodesMap]);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#1c2128]/95 backdrop-blur-2xl border-l border-white/12 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#14181d]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color || '#e5c158' }} />
          <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
            Node Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-[#242a33] hover:bg-[#2e3642] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition text-xs"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs text-slate-200">
        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-white break-words">
            {node.label}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-[#242a33] text-amber-300 border border-white/10 text-[10px] font-semibold uppercase">
              {node.type}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#242a33] text-slate-300 border border-white/10 text-[10px]">
              Level {node.level}
            </span>
            {node.count !== undefined && node.count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-mono">
                {node.count} subtopics
              </span>
            )}
            {node.stratum && (
              <span className="px-2 py-0.5 rounded-full bg-[#14181d] text-teal-300 text-[10px] font-mono border border-teal-500/30">
                {node.stratum}
              </span>
            )}
            {node.stance && (
              <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 text-[10px] font-mono border border-sky-500/30">
                Stance: {node.stance}
              </span>
            )}
            {node.nothingnessSense && (
              <span className="px-2 py-0.5 rounded-full bg-[#14181d] text-slate-200 text-[10px] font-mono border border-white/10">
                {node.nothingnessSense}
              </span>
            )}
            {node.provenance?.documentId && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-500/30">
                Ingested Node
              </span>
            )}
          </div>
        </div>

        {/* ROAE 2.0 Epistemic Classification & Warrant */}
        {node.roaeProvenance && (
          <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-teal-500/30 space-y-1.5">
            <div className="font-semibold text-teal-300 flex items-center justify-between">
              <span>⚖️ ROAE 2.0 Invariant Audit</span>
              <span className="text-[10px] font-mono text-slate-400">{node.roaeProvenance.engineVersion}</span>
            </div>
            {node.roaeProvenance.warrant && (
              <div className="text-[11px] text-slate-200 bg-[#1c2128] p-2 rounded border border-white/10 font-serif">
                <span className="text-teal-300 font-sans font-semibold">Epistemic Warrant:</span> {node.roaeProvenance.warrant}
              </div>
            )}
            <div className="text-[10px] text-slate-400 font-mono">
              Diff ID: {node.roaeProvenance.diffId} • Run: {node.roaeProvenance.runId}
            </div>
          </div>
        )}

        {/* Provenance Metadata */}
        {node.provenance && (
          <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-white/10 space-y-2">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span>📄 Source Provenance</span>
            </div>
            {node.provenance.sourceFile && (
              <div className="text-[11px]">
                <span className="text-slate-400">File: </span>
                <span className="text-emerald-300 font-medium">{node.provenance.sourceFile}</span>
              </div>
            )}
            {node.provenance.fileHash && (
              <div className="text-[10px] text-slate-400 font-mono truncate" title={node.provenance.fileHash}>
                Hash: {node.provenance.fileHash}
              </div>
            )}
            {node.provenance.extractedAt && (
              <div className="text-[10px] text-slate-400">
                Time: {new Date(node.provenance.extractedAt).toLocaleString()}
              </div>
            )}
            {node.provenance.snippet && (
              <div className="p-2 rounded bg-[#1c2128] text-slate-300 text-[11px] italic font-serif border border-white/10">
                "{node.provenance.snippet}"
              </div>
            )}
          </div>
        )}

        {/* Parent Node */}
        {parentNode && (
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-400 text-[11px]">Parent Concept:</div>
            <button
              onClick={() => onSelectNode(parentNode)}
              className="w-full text-left p-2 rounded-lg bg-[#14181d]/80 hover:bg-[#242a33] border border-white/10 text-slate-200 truncate transition flex items-center gap-2"
            >
              <span className="text-amber-300">↖</span>
              <span className="truncate">{parentNode.label}</span>
            </button>
          </div>
        )}

        {/* Children Subtopics */}
        {childNodes.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-400 text-[11px] flex items-center justify-between">
              <span>Subtopics & Children ({childNodes.length})</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {childNodes.map(child => (
                <button
                  key={child.id}
                  onClick={() => onSelectNode(child)}
                  className="w-full text-left p-2 rounded-lg bg-[#14181d]/80 hover:bg-[#242a33] border border-white/10 text-slate-200 truncate transition flex items-center gap-2 text-[11px]"
                >
                  <span className="text-sky-300">↘</span>
                  <span className="truncate">{child.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Cross-Cut Links */}
        {semanticNeighbors.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-400 text-[11px]">
              Semantic Cross-Cuts & Relations ({semanticNeighbors.length})
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              {semanticNeighbors.map(({ neighbor, edgeLabel, direction }, idx) => (
                <button
                  key={idx}
                  onClick={() => neighbor && onSelectNode(neighbor)}
                  className="w-full text-left p-2 rounded-lg bg-[#14181d]/80 hover:bg-[#242a33] border border-white/10 text-slate-200 truncate transition flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="truncate">{neighbor?.label}</span>
                  <span className="text-[10px] text-sky-400 uppercase font-mono shrink-0">
                    {edgeLabel || direction}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
