// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { IngestedDocumentRecord } from '../types/graph';
import { SubgraphDensityMode } from '../services/storage/GraphIndex';

interface HeaderProps {
  totalNodes: number;
  totalEdges: number;
  canonicalNodeCount: number;
  documents: IngestedDocumentRecord[];
  pendingDiffsCount: number;
  residueCount: number;
  viewMode: 'graph' | 'hypermap';
  setViewMode: (mode: 'graph' | 'hypermap') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  densityMode: SubgraphDensityMode;
  setDensityMode: (mode: SubgraphDensityMode) => void;
  onOpenRoae: () => void;
  onOpenDiffReview: () => void;
  onOpenResidue: () => void;
  onOpenNihiltheisticSuite: () => void;
  onOpenJournal314Corpus: () => void;
  onOpenIngestion: () => void;
  onOpenLedger: () => void;
  onOpenExport: () => void;
  onOpenPathfinder: () => void;
  onPruneOrphans: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalNodes,
  totalEdges,
  canonicalNodeCount,
  documents: _documents,
  pendingDiffsCount,
  residueCount,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  densityMode,
  setDensityMode,
  onOpenRoae,
  onOpenDiffReview,
  onOpenResidue,
  onOpenNihiltheisticSuite,
  onOpenJournal314Corpus,
  onOpenIngestion,
  onOpenLedger,
  onOpenExport,
  onOpenPathfinder,
  onPruneOrphans
}) => {
  const dynamicCount = totalNodes - canonicalNodeCount;
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isCompact, setIsCompact] = useState(true);
  const [pruneNotice, setPruneNotice] = useState<string | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, setSearchQuery]);

  const handlePruneClick = () => {
    onPruneOrphans();
    setPruneNotice('Orphans Checked');
    setTimeout(() => setPruneNotice(null), 2500);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1c2128]/85 backdrop-blur-2xl border-b border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.55)] px-3 sm:px-6 py-2 transition-all duration-200">
      {/* COMPACT / ZEN MODE (Slim 44px Ribbon - Freeing 90%+ Viewport) */}
      {isCompact ? (
        <div className="flex items-center justify-between gap-3 h-10">
          {/* Brand + Live Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono font-bold text-sm tracking-tight text-amber-300">
              JOURNAL314 Ω
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-300 font-mono bg-[#242a33]/90 px-2 py-0.5 rounded-full border border-white/10">
              {totalNodes.toLocaleString()} nodes
            </span>
          </div>

          {/* Center Search Input */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search concepts, figures, strata..."
              className="w-full bg-[#242a33]/85 hover:bg-[#2e3642]/95 border border-white/10 focus:border-sky-400/50 rounded-xl px-3 py-1 text-xs text-slate-100 placeholder-slate-400 outline-none transition"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Density Toggle */}
          <div className="hidden md:flex items-center bg-[#14181d]/80 rounded-xl p-0.5 border border-white/10 text-[10px] font-mono">
            {(['core', 'balanced', 'unbounded'] as SubgraphDensityMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setDensityMode(mode)}
                className={`px-2 py-0.5 rounded-lg capitalize transition ${
                  densityMode === mode
                    ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Pathfinder Quick Trigger */}
          <button
            onClick={onOpenPathfinder}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#242a33]/90 hover:bg-[#2e3642] text-sky-300 border border-sky-400/35 transition flex items-center gap-1 shrink-0 shadow-sm"
            title="Open Dialectical Synthesis Pathfinder"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">Pathfinder</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex rounded-xl bg-[#14181d]/80 p-0.5 border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'graph'
                  ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Force
            </button>
            <button
              onClick={() => setViewMode('hypermap')}
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'hypermap'
                  ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Map
            </button>
          </div>

          {/* Expand Deck Toggle */}
          <button
            onClick={() => setIsCompact(false)}
            className="px-2.5 py-1 rounded-xl text-xs font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1 shrink-0"
            title="Expand Command Deck"
          >
            <span>▾ Expand Deck</span>
          </button>
        </div>
      ) : (
        /* EXPANDED COMMAND DECK (Anodized Gunmetal, Polished Titanium & Smoky Glass) */
        <div className="space-y-2">
          {/* Row 1: Brand + Topology Telemetry + Zen Mode Switch */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 truncate">
                <span className="text-amber-300 font-mono">JOURNAL314 Ω</span>
                <span className="text-slate-600 hidden sm:inline">—</span>
                <span className="text-slate-100 text-xs sm:text-base font-medium truncate">
                  Nihiltheism Knowledge System (NKS)
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#242a33]/90 text-teal-300 border border-teal-400/30 hidden md:inline-block">
                  ROAE 2.0
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Telemetry Badges */}
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#14181d]/80 px-2.5 py-1 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-200 font-mono">{canonicalNodeCount} canonical</span>
                </span>
                {dynamicCount > 0 && (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>+{dynamicCount} dynamic</span>
                  </span>
                )}
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-mono">{totalEdges.toLocaleString()} links</span>
              </div>

              {/* Ledger trigger */}
              <button
                onClick={onOpenLedger}
                className="text-xs text-slate-300 hover:text-amber-300 underline underline-offset-2 transition hidden sm:inline-block"
              >
                Ledger P-001—P-005
              </button>

              {/* Compact Mode Toggle */}
              <button
                onClick={() => setIsCompact(true)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#242a33]/90 hover:bg-[#2e3642] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition flex items-center gap-1"
                title="Collapse HUD into Zen Mode for maximum canvas viewport"
              >
                <span>▴ Compact HUD</span>
              </button>
            </div>
          </div>

          {/* Row 2: Primary Module Actions + Synthesis Engine */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* ROAE 2.0 Analysis */}
              <button
                onClick={onOpenRoae}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#242a33]/90 hover:bg-[#2e3642] text-teal-300 border border-teal-400/30 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>🧠</span>
                <span>ROAE 2.0 Analysis</span>
              </button>

              {/* Candidate Diff Review */}
              <button
                onClick={onOpenDiffReview}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                  pendingDiffsCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-950/40 animate-pulse'
                    : 'bg-[#242a33]/90 text-slate-200 border-white/10 hover:bg-[#2e3642]'
                }`}
              >
                <span>⚖️</span>
                <span>Diff Review</span>
                {pendingDiffsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                    {pendingDiffsCount}
                  </span>
                )}
              </button>

              {/* Dialectical Pathfinder */}
              <button
                onClick={onOpenPathfinder}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#242a33]/90 hover:bg-[#2e3642] text-sky-300 border border-sky-400/35 transition flex items-center gap-1.5 shadow-sm"
                title="Trace Dialectical Synthesis & Mediating Chains"
              >
                <span className="text-amber-300">⚡</span>
                <span>Dialectical Pathfinder</span>
              </button>

              {/* Residue Management */}
              <button
                onClick={onOpenResidue}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-rose-300 border border-rose-500/30 transition flex items-center gap-1"
              >
                <span>🛑</span>
                <span>RMP 2.0 ({residueCount})</span>
              </button>

              {/* Void Suite */}
              <button
                onClick={onOpenNihiltheisticSuite}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1"
              >
                <span>∅</span>
                <span>Void Suite</span>
              </button>

              {/* Journal314 Corpus */}
              <button
                onClick={onOpenJournal314Corpus}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#242a33]/90 hover:bg-[#2e3642] text-amber-300 border border-amber-400/30 transition flex items-center gap-1.5"
              >
                <span className="font-mono font-bold text-amber-400">Ω</span>
                <span>Corpus (52)</span>
              </button>
            </div>

            {/* Utility Group: Hygiene, Ingest, Export, View */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Orphan Pruning Button */}
              <button
                onClick={handlePruneClick}
                className="px-2 py-1 rounded-xl text-xs font-medium bg-[#242a33]/85 hover:bg-[#2e3642] text-slate-300 border border-white/10 transition flex items-center gap-1"
                title="Dynamic Graph Hygiene: Prune orphaned dynamic nodes (protects canonical baseline)"
              >
                <span>🧹</span>
                <span className="hidden sm:inline">{pruneNotice || 'Prune Orphans'}</span>
              </button>

              {/* Ingest */}
              <button
                onClick={onOpenIngestion}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1"
              >
                <span>📥</span>
                <span>Ingest</span>
              </button>

              {/* Export */}
              <button
                onClick={onOpenExport}
                className="px-2 py-1 rounded-xl text-xs font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-slate-300 border border-white/10 transition"
                title="Export Topology"
              >
                💾
              </button>

              {/* View Switcher */}
              <div className="flex rounded-xl bg-[#14181d]/80 p-0.5 border border-white/10">
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'graph'
                      ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Force
                </button>
                <button
                  onClick={() => setViewMode('hypermap')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'hypermap'
                      ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Search + Density Governor + Stratum Filters (Zero Scrollbar Wrap) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search concepts, figures, L1-L5 strata..."
                className="w-full bg-[#242a33]/85 hover:bg-[#2e3642]/95 border border-white/10 focus:border-sky-400/50 rounded-xl px-3 py-1 text-xs text-slate-100 placeholder-slate-400 outline-none transition"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Density Governor Selector */}
            <div className="flex items-center gap-1.5 shrink-0 bg-[#14181d]/80 px-2 py-0.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Density:
              </span>
              {(['core', 'balanced', 'unbounded'] as SubgraphDensityMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setDensityMode(mode)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono capitalize transition ${
                    densityMode === mode
                      ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={
                    mode === 'core'
                      ? 'Core: 100% Canonical (730) + Top Hubs + Context (~1,000 nodes, 60 FPS physics)'
                      : mode === 'balanced'
                      ? 'Balanced: Core + Top 2,500 Hubs (~3,200 nodes)'
                      : 'Unbounded: Full corpus & dynamic nodes'
                  }
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Stratum Filters (Zero-Scrollbar Wrap) */}
            <div className="flex flex-wrap items-center gap-1 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0 mr-1">
                Filter:
              </span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'CANONICAL', label: 'Canonical' },
                { id: 'ROAE', label: 'ROAE Diff' },
                { id: 'L1_REPORT', label: 'L1 Report' },
                { id: 'L2_PHENOMENOLOGY', label: 'L2 Phenom' },
                { id: 'L5_ONTOLOGY', label: 'L5 Onto' }
              ].map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] font-semibold'
                        : 'bg-[#242a33]/80 hover:bg-[#2e3642] text-slate-300 border border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
