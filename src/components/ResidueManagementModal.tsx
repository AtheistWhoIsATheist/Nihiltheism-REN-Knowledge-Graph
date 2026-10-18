// src/components/ResidueManagementModal.tsx
import React, { useState } from 'react';
import { graphStorage } from '../services/storage/GraphStorage';
import { ResidueItem, ResidueCategory } from '../types/roae';

interface ResidueManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ResidueManagementModal: React.FC<ResidueManagementModalProps> = ({
  isOpen,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'aporia' | 'contradictions' | 'negative_knowledge'>('aporia');
  const [residueItems, setResidueItems] = useState(() => graphStorage.getResidueItems());
  const [contradictions, setContradictions] = useState(() => graphStorage.getContradictions());
  const [negativeKnowledge, setNegativeKnowledge] = useState(() => graphStorage.getNegativeKnowledge());

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResidueCategory>('R6_METAPHYSICAL_APORIA');
  const [newProblem, setNewProblem] = useState('');
  const [newRationale, setNewRationale] = useState('');

  // Contradiction form states
  const [contraA, setContraA] = useState('');
  const [contraNotA, setContraNotA] = useState('');
  const [contraReason, setContraReason] = useState('');

  // Negative Knowledge form states
  const [negAssertion, setNegAssertion] = useState('');
  const [negWarrant, setNegWarrant] = useState('');

  if (!isOpen) return null;

  const handleToggleStatus = (id: string) => {
    graphStorage.toggleResidueStatus(id);
    setResidueItems(graphStorage.getResidueItems());
    onUpdate();
  };

  const handleAddResidue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProblem.trim()) return;

    graphStorage.addResidueItem({
      id: `residue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: newCategory,
      title: newTitle.trim(),
      problemStatement: newProblem.trim(),
      unanswerabilityRationale: newRationale.trim() || 'Constitutive limit of experiential self-reference',
      scope: 'Phenomenological-Ontological Boundary',
      status: 'open_friction',
      detectedAt: new Date().toISOString(),
      associatedNodes: []
    });

    setResidueItems(graphStorage.getResidueItems());
    setNewTitle('');
    setNewProblem('');
    setNewRationale('');
    onUpdate();
  };

  const handleAddContradiction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contraA.trim() || !contraNotA.trim()) return;

    graphStorage.addContradiction({
      id: `contra_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      domainScope: 'Ontological Void / Axiological Meaning',
      thesisA: contraA.trim(),
      antithesisNotA: contraNotA.trim(),
      synthesisForbiddenReason: contraReason.trim() || 'Synthetic reconciliation would counterfeit epistemic warrant',
      createdAt: new Date().toISOString()
    });

    setContradictions(graphStorage.getContradictions());
    setContraA('');
    setContraNotA('');
    setContraReason('');
  };

  const handleAddNegativeKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!negAssertion.trim() || !negWarrant.trim()) return;

    graphStorage.addNegativeKnowledge({
      id: `neg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      assertion: negAssertion.trim(),
      establishedBy: negWarrant.trim(),
      createdAt: new Date().toISOString()
    });

    setNegativeKnowledge(graphStorage.getNegativeKnowledge());
    setNegAssertion('');
    setNegWarrant('');
  };

  const formatCategoryName = (cat: string) => {
    return cat.replace(/^R\d+_/, '').replace(/_/g, ' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#1c2128]/95 border border-white/15 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-400/40 text-rose-300 flex items-center justify-center font-bold text-lg">
              🛑
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Residue Management Panel (RMP 2.0)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
                  Negative Knowledge Systematization
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Treating unanswerability and genuine contradictions as structured, first-class philosophical data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242a33] hover:bg-[#2e3642] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#14181d]/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('aporia')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'aporia'
                ? 'border-rose-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unresolved Aporias ({residueItems.length})
          </button>
          <button
            onClick={() => setActiveTab('contradictions')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'contradictions'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Contradictions ⟨A, ¬A⟩ ({contradictions.length})
          </button>
          <button
            onClick={() => setActiveTab('negative_knowledge')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'negative_knowledge'
                ? 'border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Negative Knowledge Ledger ({negativeKnowledge.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {activeTab === 'aporia' && (
            <div className="space-y-6">
              {/* Existing Residue Items List */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Structured Unresolved Items (R1–R9)</span>
                  <span className="text-[11px] text-slate-400">
                    An item is closed when its boundaries are perfectly mapped, not when artificially resolved.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {residueItems.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 hover:border-white/20 transition space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{item.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/30">
                            {item.category.slice(0, 2)}: {formatCategoryName(item.category)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                            item.status === 'mapped_bounded'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.status === 'mapped_bounded' ? '✓ Mapped & Bounded' : '• Open Friction'}
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400 font-medium">Problem:</span> {item.problemStatement}
                      </div>

                      <div className="p-2.5 rounded bg-[#14181d] text-[11px] text-slate-200 border border-white/10">
                        <span className="text-rose-400 font-medium">Why Unanswerable:</span> {item.unanswerabilityRationale}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Scope: {item.scope}</span>
                        <span>Logged: {new Date(item.detectedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Aporia Form */}
              <form onSubmit={handleAddResidue} className="p-4 rounded-xl bg-[#14181d]/90 border border-white/10 space-y-3">
                <div className="font-semibold text-xs text-amber-300">Record New Philosophical Aporia</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Aporia Title:</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. The Epistemic Boundary of Groundlessness"
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Residue Class:</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as ResidueCategory)}
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    >
                      <option value="R1_MISSING_EVIDENCE">R1: Missing Evidence</option>
                      <option value="R2_CONCEPTUAL_AMBIGUITY">R2: Conceptual Ambiguity</option>
                      <option value="R3_METHODOLOGICAL_BARRIER">R3: Methodological Barrier</option>
                      <option value="R4_HERMENEUTICAL_FRICTION">R4: Hermeneutical Friction</option>
                      <option value="R5_VALUE_CONFLICT">R5: Value Conflict</option>
                      <option value="R6_METAPHYSICAL_APORIA">R6: Metaphysical Aporia</option>
                      <option value="R7_STRUCTURAL_PARADOX">R7: Structural Paradox</option>
                      <option value="R8_INCOMMENSURABILITY">R8: Incommensurability</option>
                      <option value="R9_IRREDUCIBLE_MYSTERY">R9: Irreducible Mystery</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Problem Statement:</label>
                    <textarea
                      rows={2}
                      value={newProblem}
                      onChange={e => setNewProblem(e.target.value)}
                      placeholder="Describe the irreducible dialectical impasse..."
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Unanswerability Rationale:</label>
                    <textarea
                      rows={2}
                      value={newRationale}
                      onChange={e => setNewRationale(e.target.value)}
                      placeholder="Why can this not be smoothed over or synthesized away?"
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition"
                  >
                    + Register Aporia
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'contradictions' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-amber-500/30 text-slate-300 text-xs">
                <strong className="text-amber-300">Contradiction Preservation Invariant:</strong> The AI is strictly forbidden from forcibly synthesizing structural paradoxes into artificial harmonies. True antinomies are maintained in explicit tension ⟨A, ¬A⟩ with defined scopes.
              </div>

              <div className="space-y-3">
                {contradictions.map(c => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-amber-300 font-bold">Domain: {c.domainScope}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] border border-amber-500/30">
                        Formal Antinomy ⟨A, ¬A⟩
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#1c2128] border border-sky-500/20 space-y-1">
                        <div className="font-semibold text-sky-300">Thesis A:</div>
                        <div className="text-slate-200">{c.thesisA}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#1c2128] border border-rose-500/20 space-y-1">
                        <div className="font-semibold text-rose-300">Antithesis ¬A:</div>
                        <div className="text-slate-200">{c.antithesisNotA}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 pt-1">
                      <span className="text-amber-400 font-medium">Why Synthesis is Forbidden:</span> {c.synthesisForbiddenReason}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Contradiction Form */}
              <form onSubmit={handleAddContradiction} className="p-4 rounded-xl bg-[#14181d]/90 border border-white/10 space-y-3">
                <div className="font-semibold text-xs text-amber-300">Preserve Formal Antinomy ⟨A, ¬A⟩</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Thesis A:</label>
                    <textarea
                      rows={2}
                      value={contraA}
                      onChange={e => setContraA(e.target.value)}
                      placeholder="State proposition A..."
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Antithesis ¬A:</label>
                    <textarea
                      rows={2}
                      value={contraNotA}
                      onChange={e => setContraNotA(e.target.value)}
                      placeholder="State contradictory proposition ¬A..."
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Domain Scope & Synthesis-Forbidden Reason:</label>
                    <input
                      type="text"
                      value={contraReason}
                      onChange={e => setContraReason(e.target.value)}
                      placeholder="Why would a synthesized middle position counterfeit epistemic warrant?"
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition"
                  >
                    + Lock Contradiction
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'negative_knowledge' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 text-slate-300 text-xs">
                <strong className="text-sky-300">Negative Knowledge Protocol:</strong> The system systematically records what the evidence does <em>NOT</em> establish, preventing unwarranted inferential creep.
              </div>

              <div className="space-y-2.5">
                {negativeKnowledge.map(n => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-[#14181d]/80 border border-sky-500/20 hover:border-sky-500/40 transition flex items-start gap-3"
                  >
                    <span className="text-sky-400 text-base">⊘</span>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-white font-medium">{n.assertion}</div>
                      <div className="text-[10px] text-slate-400">
                        Established by: <span className="text-sky-300">{n.establishedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Negative Knowledge */}
              <form onSubmit={handleAddNegativeKnowledge} className="p-4 rounded-xl bg-[#14181d]/90 border border-white/10 space-y-3">
                <div className="font-semibold text-xs text-sky-300">Establish Negative Knowledge Boundary</div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Non-Implication Assertion:</label>
                  <input
                    type="text"
                    value={negAssertion}
                    onChange={e => setNegAssertion(e.target.value)}
                    placeholder='e.g. "Experiencing mystical silence does not establish the existence of a personal deity."'
                    className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Evidential Basis / Warrant:</label>
                  <input
                    type="text"
                    value={negWarrant}
                    onChange={e => setNegWarrant(e.target.value)}
                    placeholder="e.g. Symmetrical Underdetermination / Phenomenology-Ontology Firewall"
                    className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition"
                  >
                    + Register Negative Knowledge
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14181d]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition"
          >
            Close RMP
          </button>
        </div>
      </div>
    </div>
  );
};
