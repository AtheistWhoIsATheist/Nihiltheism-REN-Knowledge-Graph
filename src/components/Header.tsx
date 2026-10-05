// src/components/Header.tsx
import React from 'react';
import { IngestedDocumentRecord } from '../types/graph';

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
  onOpenRoae: () => void;
  onOpenDiffReview: () => void;
  onOpenResidue: () => void;
  onOpenNihiltheisticSuite: () => void;
  onOpenJournal314Corpus: () => void;
  onOpenIngestion: () => void;
  onOpenLedger: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalNodes,
  totalEdges,
  canonicalNodeCount,
  documents,
  pendingDiffsCount,
  residueCount,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenRoae,
  onOpenDiffReview,
  onOpenResidue,
  onOpenNihiltheisticSuite,
  onOpenJournal314Corpus,
  onOpenIngestion,
  onOpenLedger,
  onOpenExport
}) => {
  const dynamicCount = totalNodes - canonicalNodeCount;

  return (
    <header className="sticky top-0 z-30 bg-[#070711]/90 backdrop-blur-xl border-b border-indigo-500/25 px-4 md:px-8 py-3 space-y-2.5">
      {/* Top Row: Title + Stats + Core ROAE Engine & Ingestion Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">JOURNAL314 Ω</span>
              <span className="text-gray-400 font-normal hidden sm:inline">—</span>
              <span className="text-gray-100 text-base md:text-xl font-medium">Nihiltheism Knowledge System (NKS)</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 hidden sm:inline-block">
                ROAE 2.0
              </span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-indigo-300/80 mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>{canonicalNodeCount} canonical baseline</span>
            </span>
            {dynamicCount > 0 && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>+{dynamicCount} dynamic/ingested</span>
              </span>
            )}
            <span className="text-gray-500">•</span>
            <span>{totalEdges} relationships</span>
            <span className="text-gray-500">•</span>
            <button
              onClick={onOpenLedger}
              className="text-indigo-300 hover:text-white underline underline-offset-2 transition"
            >
              Ledger P-001—P-005 (100% Intact)
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ROAE 2.0 Engine Button */}
          <button
            onClick={onOpenRoae}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 border border-indigo-400/30"
          >
            <span>🧠</span>
            <span>ROAE 2.0 Analysis</span>
          </button>

          {/* Candidate Diff Review Button with Badge */}
          <button
            onClick={onOpenDiffReview}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
              pendingDiffsCount > 0
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 animate-pulse'
                : 'bg-indigo-950/70 text-indigo-200 border-indigo-500/30 hover:bg-indigo-900/60'
            }`}
          >
            <span>⚖️</span>
            <span>Diff Review</span>
            {pendingDiffsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-purple-900 font-bold">
                {pendingDiffsCount}
              </span>
            )}
          </button>

          {/* Residue Management Panel Button */}
          <button
            onClick={onOpenResidue}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-950/70 hover:bg-indigo-900/60 text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5"
          >
            <span>🛑</span>
            <span>RMP 2.0 ({residueCount})</span>
          </button>

          {/* Nihiltheistic Suite & Void Operator Button */}
          <button
            onClick={onOpenNihiltheisticSuite}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-950/70 hover:bg-indigo-900/60 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1"
          >
            <span>∅</span>
            <span>Void Suite</span>
          </button>

          {/* Journal314 Corpus & Densification Protocol Button */}
          <button
            onClick={onOpenJournal314Corpus}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-400/40 transition flex items-center gap-1.5 shadow-md shadow-purple-950/50"
            title="Browse the 52 Figures, 22 Steps, 4 Master Theses, and Disparity Pairings"
          >
            <span className="font-mono font-bold text-amber-300">Ω</span>
            <span>Journal314 Corpus (52)</span>
          </button>

          {/* Ingest Button */}
          <button
            onClick={onOpenIngestion}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1"
          >
            <span>📥</span>
            <span>Ingest</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition"
          >
            💾
          </button>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-indigo-500/30">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'graph'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              🌌 Force
            </button>
            <button
              onClick={() => setViewMode('hypermap')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'hypermap'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              🗂️ Map
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Search & Epistemic Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search concepts, figures, L1-L5 strata, nothingness..."
            className="w-full bg-[#11112a] border border-indigo-500/30 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-indigo-400/50 outline-none focus:border-indigo-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Stratum & Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs py-0.5">
          <span className="text-gray-400 text-[11px] shrink-0 font-medium">Filter:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CANONICAL', label: 'Canonical' },
            { id: 'ROAE', label: 'ROAE Diff' },
            { id: 'L1_REPORT', label: 'L1 Report' },
            { id: 'L2_PHENOMENOLOGY', label: 'L2 Phenom' },
            { id: 'L5_ONTOLOGY', label: 'L5 Onto' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border border-indigo-400'
                  : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-500/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
