// src/components/Journal314CorpusModal.tsx
import React, { useState } from 'react';
import {
  JOURNAL_THESES,
  JOURNAL_PHASES,
  JOURNAL_FIGURES,
  DISPARITY_PAIRINGS,
  PARADOX_APORIA_MATRIX,
  generateJournal314GraphEntities
} from '../data/journal314DensificationData';

interface Journal314CorpusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncToGraph: (nodes: any[], edges: any[]) => void;
  isAlreadySynced?: boolean;
}

export const Journal314CorpusModal: React.FC<Journal314CorpusModalProps> = ({
  isOpen,
  onClose,
  onSyncToGraph,
  isAlreadySynced = false
}) => {
  const [activeTab, setActiveTab] = useState<'theses' | 'phases' | 'figures' | 'pairings' | 'aporias' | 'source'>('theses');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [searchFig, setSearchFig] = useState('');
  const [selectedThesisFilter, setSelectedThesisFilter] = useState<string>('ALL');
  const [syncedNotice, setSyncedNotice] = useState(false);

  if (!isOpen) return null;

  const clusters = [
    { code: 'ALL', name: 'All 52 Figures (Clusters A–I)' },
    { code: 'A', name: 'Cluster A: Christian Mystical (14 Figures)' },
    { code: 'B', name: 'Cluster B: Existentialist / Phenomenological (5 Figures)' },
    { code: 'C', name: 'Cluster C: Pessimist / Anti-Natalist (5 Figures)' },
    { code: 'D', name: 'Cluster D: Secular / Analytic (4 Figures)' },
    { code: 'E', name: 'Cluster E: Psychological / Empirical (5 Figures)' },
    { code: 'F', name: 'Cluster F: Eastern Traditions (4 Figures)' },
    { code: 'G', name: 'Cluster G: Classical / Renaissance (3 Figures)' },
    { code: 'H', name: 'Cluster H: Modern Theological (8 Figures)' },
    { code: 'I', name: 'Cluster I: Miscellaneous / Boundary (3 Figures)' }
  ];

  const filteredFigures = JOURNAL_FIGURES.filter(fig => {
    if (selectedCluster !== 'ALL' && fig.cluster !== selectedCluster) return false;
    if (selectedThesisFilter !== 'ALL' && !fig.thesesSupported.includes(selectedThesisFilter as any)) return false;
    if (searchFig.trim()) {
      const q = searchFig.toLowerCase();
      const matchName = fig.name.toLowerCase().includes(q);
      const matchTradition = fig.eraAndTradition.toLowerCase().includes(q);
      const matchQuote = fig.quotes.some(qu => qu.text.toLowerCase().includes(q) || qu.source.toLowerCase().includes(q));
      return matchName || matchTradition || matchQuote;
    }
    return true;
  });

  const handleSyncClick = () => {
    const { nodes, edges } = generateJournal314GraphEntities();
    onSyncToGraph(nodes, edges);
    setSyncedNotice(true);
    setTimeout(() => setSyncedNotice(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl bg-[#0d0d21] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/25 bg-gradient-to-r from-indigo-950/70 via-[#11112e] to-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-lg font-mono shadow-inner">
              Ω
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  JOURNAL314 Ω: Universal Phenomenology of Nihilism
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-mono border border-purple-400/30">
                  52 Figures • 22 Steps • 4 Theses
                </span>
              </div>
              <p className="text-xs text-indigo-300/80">
                Totalizing synthesis across Christian Mysticism, Existentialism, Pessimism, and Eastern Traditions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSyncClick}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition flex items-center gap-1.5"
              title="Integrate the 52 Figures, Master Theses, and Aporias directly into the interactive graph canvas"
            >
              <span>⚡</span>
              <span>{isAlreadySynced ? 'Re-Sync Graph Entities' : 'Sync to Knowledge Graph'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 text-gray-400 hover:text-white flex items-center justify-center text-sm border border-indigo-500/20 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sync notification toast */}
        {syncedNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between">
            <span>✅ Successfully integrated Journal314 figures, theses, and dialectical relationships into the live graph!</span>
            <span className="font-mono text-[10px] text-emerald-400">Baseline 730 nodes preserved intact.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-indigo-500/20 bg-indigo-950/30 px-4 overflow-x-auto gap-1 text-xs font-medium">
          {[
            { id: 'theses', label: '4 Master Theses (T1–T4)' },
            { id: 'phases', label: '22 Thematic Steps (5 Phases)' },
            { id: 'figures', label: `52 Thinkers & Extracts (${JOURNAL_FIGURES.length})` },
            { id: 'pairings', label: 'Disparity Pairings (5)' },
            { id: 'aporias', label: 'Paradox / Aporia Matrix (8)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 transition font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-400 text-indigo-200 bg-indigo-900/30'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-[#090918]/60">
          {/* TAB 1: 4 MASTER THESES */}
          {activeTab === 'theses' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/25 text-xs text-indigo-300 leading-relaxed">
                The entire analytical edifice rests upon four interlocking ontological claims. T1 establishes universality; T2 establishes positive reality; T3 establishes structural necessity; T4 proposes ultimate identity. Together they constitute <strong className="text-white">Nihiltheism</strong>: nihilism as the unmediated temporal expression of transcendence.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JOURNAL_THESES.map(t => (
                  <div
                    key={t.code}
                    className="p-5 rounded-2xl bg-[#12122d]/80 border border-indigo-500/30 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-900/60 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
                          {t.code}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                          Ontological Invariant
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-2">{t.title}</h3>
                      <p className="text-xs font-mono text-indigo-200/90 mt-2 bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-500/20 leading-relaxed">
                        "{t.claim}"
                      </p>
                    </div>

                    <div className="border-t border-indigo-500/20 pt-3 text-xs text-gray-300/90 leading-relaxed">
                      <strong className="text-indigo-300">Empirical & Textual Evidence:</strong>
                      <div className="mt-1 text-gray-400">{t.argumentSummary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 22 THEMATIC STEPS */}
          {activeTab === 'phases' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/25 text-xs text-indigo-300 leading-relaxed">
                The 22 Steps form a <strong className="text-white">phenomenological topology</strong> — charting the trajectory of consciousness from ordinary distraction, through the nihilistic void, to potential contemplation of the transcendent.
              </div>

              <div className="space-y-4">
                {JOURNAL_PHASES.map((p, idx) => (
                  <div
                    key={p.name}
                    className="p-4 rounded-2xl bg-[#12122d]/80 border border-indigo-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-900/80 text-indigo-300 flex items-center justify-center font-mono text-xs border border-indigo-500/30">
                          {idx + 1}
                        </span>
                        <span>{p.name}</span>
                      </span>
                      <div className="flex gap-1.5">
                        {p.steps.map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-indigo-900/60 text-[11px] font-mono text-indigo-300 border border-indigo-500/30"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300/90 leading-relaxed pl-8">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 52 THINKERS & EXTRACTS */}
          {activeTab === 'figures' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedCluster}
                    onChange={e => setSelectedCluster(e.target.value)}
                    className="bg-[#12122d] border border-indigo-500/30 rounded-lg px-2.5 py-1.5 text-xs text-indigo-200 outline-none"
                  >
                    {clusters.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedThesisFilter}
                    onChange={e => setSelectedThesisFilter(e.target.value)}
                    className="bg-[#12122d] border border-indigo-500/30 rounded-lg px-2.5 py-1.5 text-xs text-indigo-200 outline-none"
                  >
                    <option value="ALL">All Theses (T1–T4)</option>
                    <option value="T1">Supports T1 (Universality)</option>
                    <option value="T2">Supports T2 (Positive Nothing)</option>
                    <option value="T3">Supports T3 (Fundamental/Rare)</option>
                    <option value="T4">Supports T4 (Transcendence)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Search 52 thinkers or quotes..."
                  value={searchFig}
                  onChange={e => setSearchFig(e.target.value)}
                  className="bg-[#12122d] border border-indigo-500/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none w-full sm:w-64"
                />
              </div>

              <div className="text-xs text-gray-400 flex items-center justify-between px-1">
                <span>Displaying {filteredFigures.length} of 52 thinkers</span>
                <span className="text-indigo-400 font-mono">[P] Primary text • [J314] Journal314 archive • [DESC] Descriptive summary</span>
              </div>

              {/* Thinker Cards */}
              <div className="space-y-3.5">
                {filteredFigures.map(fig => (
                  <div
                    key={fig.id}
                    className="p-4 rounded-xl bg-[#12122d]/85 border border-indigo-500/25 space-y-2.5 hover:border-indigo-400/50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center justify-center font-bold">
                          {fig.figureNumber}
                        </span>
                        <h4 className="font-bold text-white text-sm">{fig.name}</h4>
                        <span className="text-xs text-gray-400">({fig.eraAndTradition})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 font-mono">
                          {fig.clusterName}
                        </span>
                        <div className="flex gap-1">
                          {fig.thesesSupported.map(th => (
                            <span
                              key={th}
                              className="px-1.5 py-0.5 rounded bg-indigo-900/70 text-indigo-200 font-mono text-[10px] font-bold"
                            >
                              {th}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quotes */}
                    <div className="space-y-2 pt-1">
                      {fig.quotes.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-2.5 rounded-lg bg-[#0a0a1a]/70 border border-indigo-500/15 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                            <span className="text-indigo-300">{q.source}</span>
                            <span className={`px-1.5 py-0.2 rounded font-bold ${
                              q.label.includes('J314') ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30' : 'bg-indigo-900/50 text-indigo-300'
                            }`}>
                              [{q.label}]
                            </span>
                          </div>
                          <p className="text-gray-200 italic leading-relaxed">
                            {q.label === 'DESC' ? (
                              <span className="not-italic text-gray-300">{q.text}</span>
                            ) : (
                              `"${q.text}"`
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-gray-400">
                      <span>Activated Steps:</span>
                      {fig.stepsActivated.map(s => (
                        <span key={s} className="font-mono text-indigo-300 font-semibold">
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
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/25 text-xs text-indigo-300 leading-relaxed">
                Maximum-disparity pairings test whether identical existential phenomenologies manifest across immense historical, cultural, and theological gulfs, validating Thesis T1 (Trans-Historical Universality).
              </div>

              <div className="space-y-4">
                {DISPARITY_PAIRINGS.map(p => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[#12122d]/85 border border-indigo-500/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-indigo-500/20 pb-2.5">
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <span>⚖️</span>
                        <span>{p.title}</span>
                      </h4>
                      <span className="font-mono text-xs text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded">
                        Temporal Distance: {p.temporalDistance}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20">
                        <span className="text-gray-400 block font-semibold mb-0.5">Cultural Distance:</span>
                        <span className="text-indigo-200">{p.culturalDistance}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20">
                        <span className="text-gray-400 block font-semibold mb-0.5">Religious Framework:</span>
                        <span className="text-indigo-200">{p.religiousDistance}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-[#0a0a1a] border border-indigo-500/20">
                        <strong className="text-emerald-300 block mb-1">Shared Phenomenological Invariant:</strong>
                        <p className="text-gray-300 leading-relaxed">{p.sharedStructure}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0a0a1a] border border-indigo-500/20">
                        <strong className="text-purple-300 block mb-1">Divergence & Dialectical Paradox:</strong>
                        <p className="text-gray-300 leading-relaxed">{p.divergenceOrParadox}</p>
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
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/25 text-xs text-indigo-300 leading-relaxed">
                The 8 master paradoxes crystallize the aporetic tension where conventional propositional logic encounters the limits of language and the positive agency of the Void.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PARADOX_APORIA_MATRIX.map(apo => (
                  <div
                    key={apo.id}
                    className="p-5 rounded-2xl bg-[#12122d]/85 border border-indigo-500/30 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-purple-900/60 border border-purple-400/30 text-purple-300 flex items-center justify-center text-xs font-mono">
                          {apo.id.replace('apo-', 'A')}
                        </span>
                        <span>{apo.title}</span>
                      </h4>
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed bg-[#0a0a1a] p-3 rounded-xl border border-indigo-500/15">
                        {apo.formulation}
                      </p>
                    </div>

                    <div className="border-t border-indigo-500/20 pt-2 text-[11px] text-gray-400">
                      <span className="text-indigo-300 font-semibold block mb-0.5">Exemplar Figures:</span>
                      <span>{apo.figures.join(', ')}</span>
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
