// src/components/DialecticalPathfinderModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { graphStorage } from '../services/storage/GraphStorage';
import { graphIndex, DialecticalPathResult } from '../services/storage/GraphIndex';
import { GraphNode } from '../types/graph';

interface DialecticalPathfinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: GraphNode | null;
  onIlluminatePath: (result: DialecticalPathResult | null) => void;
  currentHighlightedPath: DialecticalPathResult | null;
  onSelectNode: (node: GraphNode) => void;
}

const PRESET_PAIRS = [
  {
    source: 'Ecclesiastes (Qoheleth)',
    target: 'Martin Heidegger',
    label: 'Ecclesiastes ↔ Heidegger (Radical Aporia)'
  },
  {
    source: 'Arthur Schopenhauer',
    target: 'Friedrich Nietzsche',
    label: 'Schopenhauer ↔ Nietzsche (Will vs Overcoming)'
  },
  {
    source: 'Peter Wessel Zapffe',
    target: 'Emil Cioran',
    label: 'Zapffe ↔ Cioran (Cosmic Tragedy)'
  },
  {
    source: 'Nāgārjuna',
    target: 'Jacques Derrida',
    label: 'Nāgārjuna ↔ Derrida (Śūnyatā & Différance)'
  },
  {
    source: 'Blaise Pascal',
    target: 'Albert Camus',
    label: 'Pascal ↔ Camus (Infinite Silence vs Absurd)'
  }
];

export const DialecticalPathfinderModal: React.FC<DialecticalPathfinderModalProps> = ({
  isOpen,
  onClose,
  selectedNode,
  onIlluminatePath,
  currentHighlightedPath,
  onSelectNode
}) => {
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [pathResult, setPathResult] = useState<DialecticalPathResult | null>(null);

  // Auto-fill from currently selected node in graph if available
  useEffect(() => {
    if (selectedNode && !selectedSourceId) {
      setSelectedSourceId(selectedNode.id);
      setSourceSearch(selectedNode.label);
    }
  }, [selectedNode, selectedSourceId]);

  // Autocomplete suggestions
  const sourceMatches = useMemo(() => {
    if (!sourceSearch.trim() || sourceSearch.length < 2) return [];
    return graphIndex.searchNodes(sourceSearch, 6)
      .map(id => graphIndex.nodeById.get(id))
      .filter((n): n is GraphNode => !!n);
  }, [sourceSearch]);

  const targetMatches = useMemo(() => {
    if (!targetSearch.trim() || targetSearch.length < 2) return [];
    return graphIndex.searchNodes(targetSearch, 6)
      .map(id => graphIndex.nodeById.get(id))
      .filter((n): n is GraphNode => !!n);
  }, [targetSearch]);

  const handleComputePath = (srcId?: string, tgtId?: string) => {
    const sId = srcId || selectedSourceId;
    const tId = tgtId || selectedTargetId;
    if (!sId || !tId) return;

    const result = graphIndex.findDialecticalPath(sId, tId);
    setPathResult(result);
  };

  const handleSelectPreset = (preset: typeof PRESET_PAIRS[0]) => {
    const srcIds = graphIndex.searchNodes(preset.source, 1);
    const tgtIds = graphIndex.searchNodes(preset.target, 1);

    if (srcIds.length > 0 && tgtIds.length > 0) {
      const srcNode = graphIndex.nodeById.get(srcIds[0]);
      const tgtNode = graphIndex.nodeById.get(tgtIds[0]);
      if (srcNode && tgtNode) {
        setSelectedSourceId(srcNode.id);
        setSourceSearch(srcNode.label);
        setSelectedTargetId(tgtNode.id);
        setTargetSearch(tgtNode.label);
        handleComputePath(srcNode.id, tgtNode.id);
      }
    }
  };

  const handleSwap = () => {
    const prevSrcId = selectedSourceId;
    const prevSrcSearch = sourceSearch;
    setSelectedSourceId(selectedTargetId);
    setSourceSearch(targetSearch);
    setSelectedTargetId(prevSrcId);
    setTargetSearch(prevSrcSearch);
    if (selectedTargetId && prevSrcId) {
      handleComputePath(selectedTargetId, prevSrcId);
    }
  };

  const handleIlluminateOnCanvas = () => {
    if (pathResult && pathResult.pathNodes.length > 0) {
      onIlluminatePath(pathResult);
      onClose();
    }
  };

  const handleClearIllumination = () => {
    onIlluminatePath(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#1c2128]/95 border border-white/15 text-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14181d]/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#242a33] text-sky-300 text-lg border border-sky-400/30">
              ⚡
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Dialectical Bridge & Synthesis Pathfinder</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  O(1) BFS &lt;2ms
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Trace mediating concepts, dialectical tensions, and L1–L5 stratum shifts across the knowledge graph.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 [scrollbar-width:thin]">
          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Dialectical Disparity Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PAIRS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#242a33] hover:bg-[#2e3642] text-slate-200 border border-white/10 hover:border-sky-400/40 transition flex items-center gap-1.5"
                >
                  <span className="text-amber-400 text-[10px]">❖</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Pickers (Source & Target) */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-[#14181d]/70 p-3.5 rounded-xl border border-white/10">
            {/* Source */}
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Source Concept / Thinker:</span>
                </label>
                {selectedNode && (
                  <button
                    onClick={() => {
                      setSelectedSourceId(selectedNode.id);
                      setSourceSearch(selectedNode.label);
                      if (selectedTargetId) handleComputePath(selectedNode.id, selectedTargetId);
                    }}
                    className="text-[10px] text-sky-400 hover:text-sky-300 underline"
                  >
                    Use Selected Node
                  </button>
                )}
              </div>
              <input
                type="text"
                value={sourceSearch}
                onChange={e => {
                  setSourceSearch(e.target.value);
                  setSelectedSourceId('');
                }}
                placeholder="Search or enter source concept..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#14181d] border border-white/10 focus:border-sky-400/50 text-xs text-white placeholder-slate-500 outline-none transition"
              />
              {sourceMatches.length > 0 && !selectedSourceId && (
                <div className="rounded-lg bg-[#242a33] border border-white/10 p-1 space-y-0.5 max-h-32 overflow-y-auto">
                  {sourceMatches.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedSourceId(m.id);
                        setSourceSearch(m.label);
                        if (selectedTargetId) handleComputePath(m.id, selectedTargetId);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-xs hover:bg-white/10 text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate">{m.label}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">{m.stratum?.replace('_', ' ') || m.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                title="Swap source and target"
                className="p-2 rounded-xl bg-[#242a33] hover:bg-[#2e3642] text-slate-300 hover:text-white border border-white/10 transition shadow"
              >
                ⇄
              </button>
            </div>

            {/* Target */}
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Target Concept / Thinker:</span>
                </label>
                {selectedNode && (
                  <button
                    onClick={() => {
                      setSelectedTargetId(selectedNode.id);
                      setTargetSearch(selectedNode.label);
                      if (selectedSourceId) handleComputePath(selectedSourceId, selectedNode.id);
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                  >
                    Use Selected Node
                  </button>
                )}
              </div>
              <input
                type="text"
                value={targetSearch}
                onChange={e => {
                  setTargetSearch(e.target.value);
                  setSelectedTargetId('');
                }}
                placeholder="Search or enter target concept..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#14181d] border border-white/10 focus:border-amber-400/50 text-xs text-white placeholder-slate-500 outline-none transition"
              />
              {targetMatches.length > 0 && !selectedTargetId && (
                <div className="rounded-lg bg-[#242a33] border border-white/10 p-1 space-y-0.5 max-h-32 overflow-y-auto">
                  {targetMatches.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedTargetId(m.id);
                        setTargetSearch(m.label);
                        if (selectedSourceId) handleComputePath(selectedSourceId, m.id);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-xs hover:bg-white/10 text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate">{m.label}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">{m.stratum?.replace('_', ' ') || m.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compute Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              disabled={!selectedSourceId || !selectedTargetId}
              onClick={() => handleComputePath(selectedSourceId, selectedTargetId)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] disabled:opacity-40 text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition flex items-center gap-2"
            >
              <span>⚡ Compute Synthesis Path</span>
            </button>

            {pathResult && (
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                  {pathResult.executionTimeMs} ms
                </span>
                <span className="text-slate-400">
                  {pathResult.pathNodes.length > 0 ? `${pathResult.pathNodes.length - 1} hops (${pathResult.pathNodes.length} nodes)` : 'Unconnected'}
                </span>
              </div>
            )}
          </div>

          {/* Results View */}
          {pathResult && (
            <div className="mt-4 space-y-4 pt-3 border-t border-white/10">
              {/* Summary Banner */}
              <div className="p-3 rounded-xl bg-[#14181d]/80 border border-sky-400/25 text-xs">
                <div className="font-semibold text-sky-300 mb-1 flex items-center gap-1.5">
                  <span>🧠 Dialectical Synthesis:</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">{pathResult.synthesisSummary}</p>
              </div>

              {/* Stratum Shift Flow */}
              {pathResult.stratumTransitions.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Epistemic Stratum Transitions:
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {pathResult.stratumTransitions.map((tr, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <span className="px-2 py-0.5 rounded bg-[#242a33] text-sky-300 border border-sky-400/30 font-mono text-[11px]">
                          {tr.from}
                        </span>
                        <span className="text-slate-400 font-bold">→</span>
                        <span className="px-2 py-0.5 rounded bg-[#242a33] text-teal-300 border border-teal-400/30 font-mono text-[11px]">
                          {tr.to}
                        </span>
                        <span className="text-slate-400 text-[10px]">(via {tr.via})</span>
                        {idx < pathResult.stratumTransitions.length - 1 && <span className="text-slate-600 mx-1">|</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step by step chain */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Mediating Conceptual Chain:
                </h4>
                <div className="space-y-2">
                  {pathResult.steps.map((st, idx) => {
                    const isEndpoint = idx === 0 || idx === pathResult.steps.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isEndpoint
                            ? 'bg-[#242a33]/90 border-sky-400/40'
                            : 'bg-[#14181d]/80 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-[#1c2128] text-sky-300 text-[11px] font-mono flex items-center justify-center shrink-0 border border-white/10">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {st.node.label}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                              <span>{st.stratum || st.node.type}</span>
                              {st.dialecticalRelation && (
                                <span className="text-amber-300">• relation: {st.dialecticalRelation}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectNode(st.node);
                            onClose();
                          }}
                          className="px-2 py-1 rounded text-[10px] text-sky-300 hover:text-white bg-[#242a33] hover:bg-[#2e3642] border border-white/10 transition shrink-0"
                        >
                          Inspect
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#14181d]/90 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            {currentHighlightedPath ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active path illuminated on canvas ({currentHighlightedPath.pathNodes.length} nodes)</span>
              </span>
            ) : (
              <span>Illuminate path to render glowing synthesis beam in Force Graph.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentHighlightedPath && (
              <button
                onClick={handleClearIllumination}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#242a33] hover:bg-[#2e3642] text-rose-300 border border-rose-500/30 transition"
              >
                Clear Beam
              </button>
            )}
            <button
              disabled={!pathResult || pathResult.pathNodes.length === 0}
              onClick={handleIlluminateOnCanvas}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] disabled:opacity-40 text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition flex items-center gap-1.5"
            >
              <span>✨ Illuminate Beam on Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
