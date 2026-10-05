// src/components/NodeInspectorModal.tsx
import React from 'react';
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

  // Find connected neighbors
  const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
  const parentNode = node.parentId ? nodesMap.get(node.parentId) : null;
  const childNodes = edges
    .filter(e => e.source === node.id && e.type === 'hierarchical')
    .map(e => nodesMap.get(e.target))
    .filter((n): n is GraphNode => Boolean(n));

  const semanticNeighbors = connectedEdges
    .filter(e => e.type !== 'hierarchical')
    .map(e => {
      const neighborId = e.source === node.id ? e.target : e.source;
      return {
        neighbor: nodesMap.get(neighborId),
        edgeLabel: e.label,
        direction: e.source === node.id ? 'outgoing' : 'incoming'
      };
    })
    .filter(item => Boolean(item.neighbor));

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#11112a]/95 backdrop-blur-xl border-l border-indigo-500/30 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color || '#6366f1' }} />
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
            Node Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-indigo-900/40 hover:bg-indigo-800 text-indigo-300 flex items-center justify-center transition text-xs"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs text-indigo-100">
        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-white break-words">
            {node.label}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 text-[10px] font-semibold uppercase">
              {node.type}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-900/40 text-gray-300 text-[10px]">
              Level {node.level}
            </span>
            {node.count !== undefined && node.count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[10px]">
                {node.count} subtopics
              </span>
            )}
            {node.stratum && (
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                {node.stratum}
              </span>
            )}
            {node.stance && (
              <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-500/30">
                Stance: {node.stance}
              </span>
            )}
            {node.nothingnessSense && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-200 text-[10px] font-mono border border-slate-700">
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
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
            <div className="font-semibold text-purple-300 flex items-center justify-between">
              <span>⚖️ ROAE 2.0 Invariant Audit</span>
              <span className="text-[10px] font-mono text-purple-400">{node.roaeProvenance.engineVersion}</span>
            </div>
            {node.roaeProvenance.warrant && (
              <div className="text-[11px] text-gray-200 bg-black/40 p-2 rounded border border-purple-500/20 font-serif">
                <span className="text-purple-400 font-sans font-semibold">Epistemic Warrant:</span> {node.roaeProvenance.warrant}
              </div>
            )}
            <div className="text-[10px] text-gray-400 font-mono">
              Diff ID: {node.roaeProvenance.diffId} • Run: {node.roaeProvenance.runId}
            </div>
          </div>
        )}

        {/* Provenance Metadata */}
        {node.provenance && (
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <span>📄 Source Provenance</span>
            </div>
            {node.provenance.sourceFile && (
              <div className="text-[11px]">
                <span className="text-gray-400">File: </span>
                <span className="text-emerald-300 font-medium">{node.provenance.sourceFile}</span>
              </div>
            )}
            {node.provenance.fileHash && (
              <div className="text-[10px] text-gray-400 font-mono truncate" title={node.provenance.fileHash}>
                Hash: {node.provenance.fileHash}
              </div>
            )}
            {node.provenance.extractedAt && (
              <div className="text-[10px] text-gray-400">
                Time: {new Date(node.provenance.extractedAt).toLocaleString()}
              </div>
            )}
            {node.provenance.snippet && (
              <div className="p-2 rounded bg-black/40 text-gray-300 text-[11px] italic font-serif">
                "{node.provenance.snippet}"
              </div>
            )}
          </div>
        )}

        {/* Parent Node */}
        {parentNode && (
          <div className="space-y-1.5">
            <div className="font-semibold text-gray-400 text-[11px]">Parent Concept:</div>
            <button
              onClick={() => onSelectNode(parentNode)}
              className="w-full text-left p-2 rounded-lg bg-[#16162e] hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-200 truncate transition flex items-center gap-2"
            >
              <span className="text-indigo-400">↖</span>
              <span className="truncate">{parentNode.label}</span>
            </button>
          </div>
        )}

        {/* Children Subtopics */}
        {childNodes.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-semibold text-gray-400 text-[11px] flex items-center justify-between">
              <span>Subtopics & Children ({childNodes.length})</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {childNodes.map(child => (
                <button
                  key={child.id}
                  onClick={() => onSelectNode(child)}
                  className="w-full text-left p-2 rounded-lg bg-[#16162e] hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-200 truncate transition flex items-center gap-2 text-[11px]"
                >
                  <span className="text-indigo-400">↘</span>
                  <span className="truncate">{child.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Cross-Cut Links */}
        {semanticNeighbors.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-semibold text-gray-400 text-[11px]">
              Semantic Cross-Cuts & Relations ({semanticNeighbors.length})
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              {semanticNeighbors.map(({ neighbor, edgeLabel, direction }, idx) => (
                <button
                  key={idx}
                  onClick={() => neighbor && onSelectNode(neighbor)}
                  className="w-full text-left p-2 rounded-lg bg-[#16162e] hover:bg-indigo-900/40 border border-cyan-500/20 text-indigo-200 truncate transition flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="truncate">{neighbor?.label}</span>
                  <span className="text-[10px] text-cyan-400 uppercase font-mono shrink-0">
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
