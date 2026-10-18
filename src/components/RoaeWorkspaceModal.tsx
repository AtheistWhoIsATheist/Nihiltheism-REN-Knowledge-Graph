// src/components/RoaeWorkspaceModal.tsx
import React, { useState } from 'react';
import { executeRoaeAnalysis } from '../services/roae/RoaeClient';
import { CandidateGraphDiff } from '../types/roae';

interface RoaeWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiffGenerated: (diff: CandidateGraphDiff) => void;
}

export const RoaeWorkspaceModal: React.FC<RoaeWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onDiffGenerated
}) => {
  const [targetText, setTargetText] = useState('Martin Heidegger (Being and Time §40: Anxiety & Nothingness)');
  const [primaryQuestions, setPrimaryQuestions] = useState(
    'How does Angst reveal the Nothing (das Nichts)? Does existential anxiety collapse ontological categories into phenomenological groundlessness?'
  );
  const [excludedNonGoals, setExcludedNonGoals] = useState(
    'Psychological therapy, theological salvation, dogmatic comfort'
  );
  const [maxNodes, setMaxNodes] = useState(6);
  const [maxEdges, setMaxEdges] = useState(8);
  const [textContent, setTextContent] = useState(
    'That in the face of which one has anxiety is Being-in-the-world as such. That which anxiety is anxious about is completely indeterminate. This indeterminacy not only describes that nothing in the world is ready-to-hand, but signifies that the world as such is all that can offer itself. In anxiety what is environmentally ready-to-hand sinks away.'
  );

  const [isComputing, setIsComputing] = useState(false);
  const [computationStage, setComputationStage] = useState<string>('');
  const [generatedDiff, setGeneratedDiff] = useState<CandidateGraphDiff | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Heidegger: Angst & Nothingness',
      target: 'Martin Heidegger: Being and Time §40',
      questions: 'Does ontological anxiety disclose the abyss of groundlessness?',
      excluded: 'Nihilistic despair, psychological pathology',
      content: 'In anxiety what is environmentally ready-to-hand sinks away, and the world in its worldhood alone remains.'
    },
    {
      title: 'Ecclesiastes: Hebel & Solar Vanity',
      target: 'Qoheleth: Ecclesiastes (Hebel Matrix)',
      questions: 'Is "vanity of vanities" an ontological emptiness or epistemic futility under the sun?',
      excluded: 'Moralistic sermonizing, deferred afterlife rewards',
      content: 'Vanity of vanities, says the Preacher; all is vanity. What does man gain by all the toil at which he toils under the sun?'
    },
    {
      title: 'Zapffe: The Last Messiah (4 Defenses)',
      target: 'Peter Wessel Zapffe: Over-Evolution of Consciousness',
      questions: 'Why are Isolation, Anchoring, Distraction, and Sublimation constitutive defense mechanisms?',
      excluded: 'Biological optimism, progressivism',
      content: 'The tragedy of a species becoming unfit for life by over-evolving one faculty: consciousness.'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTargetText(p.target);
    setPrimaryQuestions(p.questions);
    setExcludedNonGoals(p.excluded);
    setTextContent(p.content);
  };

  const handleRunRoae = async () => {
    setIsComputing(true);
    setComputationStage('Stage 1: Extracting experiential reports and building L1–L5 firewall...');

    try {
      setTimeout(() => {
        setComputationStage('Stage 2: Executing Adversarial Integrity Protocol (Referee critique & Prosecutor case)...');
      }, 700);

      setTimeout(() => {
        setComputationStage('Stage 3: Testing Physician diagnostic verdict and Void Operator ∅(X) subtraction...');
      }, 1400);

      const diff = await executeRoaeAnalysis(
        {
          id: `contract_${Date.now()}`,
          targetText,
          primaryQuestions: primaryQuestions.split('\n').filter(Boolean),
          excludedNonGoals: excludedNonGoals.split('\n').filter(Boolean),
          sourceHierarchy: 'Primary Canonical Text > Historical Context',
          candidateBudget: {
            maxNodes,
            maxEdges
          }
        },
        textContent
      );

      setGeneratedDiff(diff);
      onDiffGenerated(diff);
    } catch (err) {
      console.error('ROAE Analysis failed:', err);
    } finally {
      setIsComputing(false);
      setComputationStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#1c2128]/95 border border-white/15 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#242a33] border border-white/10 text-teal-300 flex items-center justify-center font-bold text-lg">
              Ω
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ROAE 2.0 — Recursive Ontological Analysis Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#242a33] text-teal-300 border border-teal-500/30">
                  Gemini 3.8 Flash + Epistemic Firewall
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Rigorous dialectical computation with Adversarial Integrity Auditing & Non-Consolation Invariants
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Dialectical Focus Presets:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 text-left rounded-xl bg-[#14181d]/80 hover:bg-[#242a33] border border-white/10 text-slate-200 transition space-y-1"
                >
                  <div className="font-semibold text-xs text-amber-300">{p.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{p.target}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Research Contract Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#14181d]/80 p-4 rounded-xl border border-white/10">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Philosophical Subject:</label>
                <input
                  type="text"
                  value={targetText}
                  onChange={e => setTargetText(e.target.value)}
                  className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Analytical Questions:</label>
                <textarea
                  rows={3}
                  value={primaryQuestions}
                  onChange={e => setPrimaryQuestions(e.target.value)}
                  className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Explicitly Excluded Non-Goals:</label>
                <textarea
                  rows={2}
                  value={excludedNonGoals}
                  onChange={e => setExcludedNonGoals(e.target.value)}
                  className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Candidate Nodes:</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={maxNodes}
                    onChange={e => setMaxNodes(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Candidate Edges:</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={maxEdges}
                    onChange={e => setMaxEdges(parseInt(e.target.value) || 6)}
                    className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Passage / Primary Text Context:</label>
              <textarea
                rows={3}
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                placeholder="Enter philosophical text, citations, or experiential report..."
                className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400 font-serif"
              />
            </div>
          </div>

          {/* Computation Status Indicator */}
          {isComputing && (
            <div className="p-4 rounded-xl bg-[#14181d] border border-sky-400/30 text-center space-y-2 animate-pulse">
              <div className="font-semibold text-sm text-sky-300">
                Executing Multi-Stage Dialectical Computation...
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {computationStage}
              </div>
            </div>
          )}

          {/* Generated Diff Success Notification */}
          {generatedDiff && !isComputing && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <span>✓ Candidate Graph-Diff Generated Successfully</span>
                  <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
                    {generatedDiff.runId}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {generatedDiff.proposedNodes.length} nodes • {generatedDiff.proposedEdges.length} edges
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                Candidate nodes have been stratified across L1–L5 firewalls and subjected to the Adversarial Integrity Protocol (Referee, Prosecutor & Physician). Open the <strong>Candidate Diff Review Workspace</strong> to inspect, verify warrants, and commit to live topology.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Sovereign Protocol: Live graph is NEVER directly mutated; candidate diffs require human audit.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-[#242a33] hover:bg-[#2e3642] text-slate-300 border border-white/10 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRunRoae}
              disabled={isComputing || !targetText.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isComputing || !targetText.trim()
                  ? 'bg-[#242a33] text-slate-500 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
              }`}
            >
              {isComputing ? 'Computing Dialectic...' : 'Run ROAE 2.0 Analysis Engine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
