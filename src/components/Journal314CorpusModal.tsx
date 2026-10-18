// src/components/Journal314CorpusModal.tsx
import React, { useState, useMemo } from 'react';
import {
  JOURNAL_THESES,
  JOURNAL_PHASES,
  JOURNAL_FIGURES,
  DISPARITY_PAIRINGS,
  PARADOX_APORIA_MATRIX,
  generateJournal314GraphEntities,
  JournalFigure,
  JournalThesis,
  DisparityPairing,
  ParadoxAporia
} from '../data/journal314DensificationData';
import { GraphNode, GraphEdge } from '../types/graph';

interface Journal314CorpusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncToGraph?: (nodes: GraphNode[], edges: GraphEdge[]) => void;
}

export const Journal314CorpusModal: React.FC<Journal314CorpusModalProps> = ({
  isOpen,
  onClose,
  onSyncToGraph
}) => {
  const [activeTab, setActiveTab] = useState<'theses' | 'phases' | 'figures' | 'pairings' | 'aporias'>('theses');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedThesisFilter, setSelectedThesisFilter] = useState<string>('ALL');
  const [searchFig, setSearchFig] = useState<string>('');
  const [syncedNotice, setSyncedNotice] = useState<boolean>(false);
  const [isAlreadySynced, setIsAlreadySynced] = useState<boolean>(false);

  // Filter figures
  const filteredFigures = useMemo(() => {
    let list: JournalFigure[] = JOURNAL_FIGURES;
    if (selectedCluster !== 'ALL') {
      list = list.filter((f: JournalFigure) => f.cluster === selectedCluster);
    }
    if (selectedThesisFilter !== 'ALL') {
      list = list.filter((f: JournalFigure) => f.thesesSupported.includes(selectedThesisFilter as any));
    }
    if (searchFig.trim()) {
      const q = searchFig.toLowerCase();
      list = list.filter(
        (f: JournalFigure) =>
          f.name.toLowerCase().includes(q) ||
          f.eraAndTradition.toLowerCase().includes(q) ||
          f.quotes.some((qu: { text: string; source: string }) => qu.text.toLowerCase().includes(q) || qu.source.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCluster, selectedThesisFilter, searchFig]);

  if (!isOpen) return null;

  const handleSyncClick = () => {
    const { nodes: jNodes, edges: jEdges } = generateJournal314GraphEntities();
    if (onSyncToGraph) {
      onSyncToGraph(jNodes, jEdges);
      setSyncedNotice(true);
      setIsAlreadySynced(true);
      setTimeout(() => setSyncedNotice(false), 4000);
    }
  };

  const clusters = [
    { code: 'ALL', name: 'All 7 Clusters (52 Thinkers)' },
    { code: 'CHRISTIAN_MYSTIC', name: '1. Christian Mysticism & Negative Theology' },
    { code: 'EXISTENTIALIST', name: '2. Existential & Phenomenological Lineage' },
    { code: 'PHILOSOPHICAL_PESSIMISM', name: '3. Philosophical Pessimism' },
    { code: 'EASTERN_APOPHATIC', name: '4. Eastern Traditions & Non-Duality' },
    { code: 'ANCIENT_WISDOM', name: '5. Ancient & Wisdom Literature' },
    { code: 'MODERN_SPECULATIVE', name: '6. Modern Speculative, Realism & Acceleration' },
    { code: 'CONTEMPLATIVE_POETIC', name: '7. Contemplative & Poetic Tradition' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#1c2128]/95 border border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.55)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14181d]/80">
          <div className="flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Journal314 Invariant Corpus & Disparity Matrix</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#242a33] text-amber-300 font-mono border border-white/10">
                  52 Thinkers • 4 Theses
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Primary philosophical corpus grounding the trans-historical universality and structural reality of the nihilistic experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncClick}
              disabled={isAlreadySynced}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isAlreadySynced
                  ? 'bg-[#242a33] text-slate-500 border border-white/5 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5e] hover:to-[#303744] text-white border border-slate-300/40 shadow'
              }`}
            >
              <span>{isAlreadySynced ? '✓ Synced to Graph' : '⚡ Sync Corpus into Active Graph'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sync notification */}
        {syncedNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-2 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
            <span>✨ Journal314 Corpus (64 dynamic nodes, 139 dialectical edges) integrated into active knowledge graph!</span>
            <span className="text-[10px] text-emerald-400/80">Canonical 730 baseline remains strictly untouched.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#14181d]/60 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('theses')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'theses'
                ? 'border-amber-400 text-amber-300 font-bold bg-[#242a33]/50 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4 Master Theses (T1–T4)
          </button>
          <button
            onClick={() => setActiveTab('phases')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'phases'
                ? 'border-amber-400 text-amber-300 font-bold bg-[#242a33]/50 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5 Phenomenological Phases (22 Steps)
          </button>
          <button
            onClick={() => setActiveTab('figures')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'figures'
                ? 'border-amber-400 text-amber-300 font-bold bg-[#242a33]/50 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            52 Canonical Thinkers & Citations
          </button>
          <button
            onClick={() => setActiveTab('pairings')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'pairings'
                ? 'border-amber-400 text-amber-300 font-bold bg-[#242a33]/50 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Maximum Disparity Pairings
          </button>
          <button
            onClick={() => setActiveTab('aporias')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'aporias'
                ? 'border-amber-400 text-amber-300 font-bold bg-[#242a33]/50 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Paradox / Aporia Matrix
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-[#14181d]/60">
          {/* TAB 1: 4 MASTER THESES */}
          {activeTab === 'theses' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                The entire analytical edifice rests upon four interlocking ontological claims. T1 establishes universality; T2 establishes positive reality; T3 establishes structural necessity; T4 proposes ultimate identity. Together they constitute <strong className="text-white">Nihiltheism</strong>: nihilism as the unmediated temporal expression of transcendence.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JOURNAL_THESES.map((t: JournalThesis) => (
                  <div
                    key={t.code}
                    className="p-5 rounded-2xl bg-[#14181d]/80 border border-white/10 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-[#242a33] text-amber-300 font-mono font-bold text-xs border border-white/10">
                          {t.code}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Ontological Invariant
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-2">{t.title}</h3>
                      <p className="text-xs font-mono text-slate-200 mt-2 bg-[#1c2128] p-2.5 rounded-xl border border-white/10 leading-relaxed">
                        "{t.claim}"
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-3 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-300">Empirical & Textual Evidence:</strong>
                      <div className="mt-1 text-slate-400">{t.argumentSummary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 22 THEMATIC STEPS */}
          {activeTab === 'phases' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                The 22 Steps form a <strong className="text-white">phenomenological topology</strong> — charting the trajectory of consciousness from ordinary distraction, through the nihilistic void, to potential contemplation of the transcendent.
              </div>

              <div className="space-y-4">
                {JOURNAL_PHASES.map((p, idx: number) => (
                  <div
                    key={p.name}
                    className="p-4 rounded-2xl bg-[#14181d]/80 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#242a33] text-amber-300 flex items-center justify-center font-mono text-xs border border-white/10">
                          {idx + 1}
                        </span>
                        <span>{p.name}</span>
                      </span>
                      <div className="flex gap-1.5">
                        {p.steps.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-[#242a33] text-[11px] font-mono text-slate-300 border border-white/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 52 CANONICAL THINKERS */}
          {activeTab === 'figures' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedCluster}
                    onChange={e => setSelectedCluster(e.target.value)}
                    className="bg-[#1c2128] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400"
                  >
                    {clusters.map(c => (
                      <option key={c.code} value={c.code} className="bg-[#1c2128] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedThesisFilter}
                    onChange={e => setSelectedThesisFilter(e.target.value)}
                    className="bg-[#1c2128] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400"
                  >
                    <option value="ALL" className="bg-[#1c2128] text-white">All Theses (T1–T4)</option>
                    <option value="T1" className="bg-[#1c2128] text-white">T1: Universality</option>
                    <option value="T2" className="bg-[#1c2128] text-white">T2: Positive Reality</option>
                    <option value="T3" className="bg-[#1c2128] text-white">T3: Structural Inevitability</option>
                    <option value="T4" className="bg-[#1c2128] text-white">T4: Nihiltheistic Convergence</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Search 52 thinkers or quotes..."
                  value={searchFig}
                  onChange={e => setSearchFig(e.target.value)}
                  className="bg-[#1c2128] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-full sm:w-64 focus:border-amber-400"
                />
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between px-1">
                <span>Displaying {filteredFigures.length} of 52 thinkers</span>
                <span className="text-amber-300 font-mono">[P] Primary text • [J314] Journal314 archive • [DESC] Descriptive summary</span>
              </div>

              {/* Thinker Cards */}
              <div className="space-y-3.5">
                {filteredFigures.map((fig: JournalFigure) => (
                  <div
                    key={fig.id}
                    className="p-4 rounded-xl bg-[#14181d]/85 border border-white/10 space-y-2.5 hover:border-amber-400/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#242a33] border border-white/10 text-amber-300 font-mono text-xs flex items-center justify-center font-bold">
                          {fig.figureNumber}
                        </span>
                        <h4 className="font-bold text-white text-sm">{fig.name}</h4>
                        <span className="text-xs text-slate-400">({fig.eraAndTradition})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-[#242a33] text-teal-300 border border-teal-500/30 font-mono">
                          {fig.clusterName}
                        </span>
                        <div className="flex gap-1">
                          {fig.thesesSupported.map((th: string) => (
                            <span
                              key={th}
                              className="px-1.5 py-0.5 rounded bg-[#1c2128] text-amber-300 font-mono text-[10px] font-bold border border-white/10"
                            >
                              {th}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quotes */}
                    <div className="space-y-2 pt-1">
                      {fig.quotes.map((q, qIdx: number) => (
                        <div
                          key={qIdx}
                          className="p-2.5 rounded-lg bg-[#1c2128]/70 border border-white/8 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="text-sky-300">{q.source}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              q.label.includes('J314') ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30' : 'bg-[#242a33] text-slate-300 border border-white/10'
                            }`}>
                              [{q.label}]
                            </span>
                          </div>
                          <p className="text-slate-200 italic leading-relaxed">
                            {q.label === 'DESC' ? (
                              <span className="not-italic text-slate-300">{q.text}</span>
                            ) : (
                              `"${q.text}"`
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                      <span>Activated Steps:</span>
                      {fig.stepsActivated.map((s: string) => (
                        <span key={s} className="font-mono text-amber-300 font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISPARITY PAIRINGS */}
          {activeTab === 'pairings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                Maximum-disparity pairings test whether identical existential phenomenologies manifest across immense historical, cultural, and theological gulfs, validating Thesis T1 (Trans-Historical Universality).
              </div>

              <div className="space-y-4">
                {DISPARITY_PAIRINGS.map((p: DisparityPairing) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[#14181d]/85 border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-2.5">
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <span>⚖️</span>
                        <span>{p.title}</span>
                      </h4>
                      <span className="font-mono text-xs text-amber-300 bg-[#242a33] px-2 py-0.5 rounded border border-white/10">
                        Temporal Distance: {p.temporalDistance}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#1c2128] border border-white/10">
                        <span className="text-slate-400 block font-semibold mb-0.5">Cultural Distance:</span>
                        <span className="text-slate-200">{p.culturalDistance}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#1c2128] border border-white/10">
                        <span className="text-slate-400 block font-semibold mb-0.5">Religious Framework:</span>
                        <span className="text-slate-200">{p.religiousDistance}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-[#1c2128] border border-white/10">
                        <strong className="text-emerald-300 block mb-1">Shared Phenomenological Invariant:</strong>
                        <p className="text-slate-300 leading-relaxed">{p.sharedStructure}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#1c2128] border border-white/10">
                        <strong className="text-sky-300 block mb-1">Divergence & Dialectical Paradox:</strong>
                        <p className="text-slate-300 leading-relaxed">{p.divergenceOrParadox}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PARADOX / APORIA MATRIX */}
          {activeTab === 'aporias' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                The 8 master paradoxes crystallize the aporetic tension where conventional propositional logic encounters the limits of language and the positive agency of the Void.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PARADOX_APORIA_MATRIX.map((apo: ParadoxAporia) => (
                  <div
                    key={apo.id}
                    className="p-5 rounded-2xl bg-[#14181d]/85 border border-white/10 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#242a33] border border-white/10 text-amber-300 flex items-center justify-center text-xs font-mono">
                          {apo.id.replace('apo-', 'A')}
                        </span>
                        <span>{apo.title}</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#1c2128] p-3 rounded-xl border border-white/10">
                        {apo.formulation}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-2 text-[11px] text-slate-400">
                      <span className="text-amber-300 font-semibold block mb-0.5">Exemplar Figures:</span>
                      <div className="flex flex-wrap gap-1">
                        {apo.figures.map((figName: string) => (
                          <span
                            key={figName}
                            className="px-2 py-0.5 rounded bg-[#242a33] text-slate-300 font-mono text-[10px] border border-white/10"
                          >
                            {figName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
