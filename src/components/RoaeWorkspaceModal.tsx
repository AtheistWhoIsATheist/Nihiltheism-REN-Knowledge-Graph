// src/components/RoaeWorkspaceModal.tsx
import React, { useState } from 'react';
import { ResearchContract, CandidateGraphDiff } from '../types/roae';
import { executeRoaeAnalysis } from '../services/roae/RoaeClient';
import { graphStorage } from '../services/storage/GraphStorage';

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
  const [targetText, setTargetText] = useState(
    'Pseudo-Dionysius & Cioran: The Dialectic of Divine Darkness and Radical Groundlessness'
  );
  const [textContent, setTextContent] = useState(
    `In the Mystical Theology, Pseudo-Dionysius insists that the transcendent cause of all things is "neither soul nor intellect; nor has it imagination, opinion, or reason... it is beyond all assertion and denial." This radical apophasis mirrors E.M. Cioran\'s existential revelation in On the Heights of Despair: "I have no arguments, only tears, screams, and silence before the absolute void." Does this convergence point to an ontological presence exceeding thought, or to a neurological cessation of language in the face of groundless trauma?`
  );
  const [primaryQuestions, setPrimaryQuestions] = useState(
    '1. Does experiential silence (L2) provide evidential warrant for transcendent groundlessness (L5)?\n2. How do naturalistic and apophatic models symmetrically explain the cessation of intentional grasp?'
  );
  const [excludedNonGoals, setExcludedNonGoals] = useState(
    'Do not manufacture synthetic theological harmony. Do not smuggle teleological purpose into phenomenological reports.'
  );
  const [maxNodes, setMaxNodes] = useState(5);
  const [maxEdges, setMaxEdges] = useState(6);

  const [isComputing, setIsComputing] = useState(false);
  const [computationStage, setComputationStage] = useState('');
  const [generatedDiff, setGeneratedDiff] = useState<CandidateGraphDiff | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Apophatic Darkness vs. Void',
      target: 'Pseudo-Dionysius & Cioran: Divine Darkness vs. Groundless Void',
      text: 'Pseudo-Dionysius describes the divine darkness as "unapproachable light," while Cioran describes insomnia as an abyss stripped of grace. We examine whether noetic intensity warrants metaphysical claims.',
      questions: '1. What is the boundary between L2 Phenomenological Emptiness and L5 Ontological Claim?\n2. Does subtracting teleology via ∅(Teleology) leave ethical solidarity intact?',
      nonGoals: 'No apologetic reconciliations. No conversion of silence into positive theology.'
    },
    {
      title: 'The Epistemic Non-Consolation Test (A-4)',
      target: 'Nietzsche and the Symmetrical Desirability of Severe Nihilism',
      text: 'Nietzsche criticizes Christian consolation as weakness, yet romanticizes the grim severity of the Eternal Recurrence as an aesthetic triumph. Principle A-4 dictates that the psychological attraction of bleakness is just as evidentially invalid as the comfort of heaven.',
      questions: '1. How does the desire for existential hardness distort probability assessments?\n2. Can Amor Fati survive without metaphysical fatalism?',
      nonGoals: 'Avoid psychological moralizing; evaluate strict evidential warrant only.'
    },
    {
      title: 'Kenotic Silence vs. Neuro-Biological Closure',
      target: 'Cognitive Deactivation in Deep Meditation and Mystical Apophaticism',
      text: 'Neuroimaging during unitive mystical absorption reveals default mode network (DMN) quiescence. Naturalists claim causal sufficiency; apophatics claim trans-conceptual disclosure. ROAE must evaluate symmetrical underdetermination.',
      questions: '1. Does neural deactivation explain away apophatic insight, or merely describe its biological substrate?\n2. Why must the state be declared Underdetermined?',
      nonGoals: 'Do not declare victory for physicalism or mysticism; map the irreducible aporia.'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTargetText(p.target);
    setTextContent(p.text);
    setPrimaryQuestions(p.questions);
    setExcludedNonGoals(p.nonGoals);
  };

  const handleRunRoae = async () => {
    setIsComputing(true);
    setGeneratedDiff(null);

    const contract: ResearchContract = {
      id: `contract_${Date.now()}`,
      targetText,
      primaryQuestions: primaryQuestions.split('\n').filter(Boolean),
      excludedNonGoals: excludedNonGoals.split('\n').filter(Boolean),
      sourceHierarchy: 'Primary textual citations > Phenomenological reports > Causal hypotheses',
      candidateBudget: {
        maxNodes,
        maxEdges
      }
    };

    // Staged dialectical progression simulation for transparency
    const stages = [
      'Stage 1: Enforcing Epistemic Invariants & Bounded Research Contract...',
      'Stage 2: α (Panoramic Enumeration) & γ (Phenomenological Mining)...',
      'Stage 3: β (Relational Mapping) & Constructing Dialectical Tension...',
      'Stage 4: Interpretive Oscillation (Charity Pass ⇌ Suspicion Pass)...',
      'Stage 5: Adversarial Integrity Protocol (Referee, Prosecutor & Physician)...',
      'Stage 6: Symmetrical Skepticism Triangulation & Underdetermination Check...',
      'Stage 7: Formulating Candidate Graph-Diff with L1–L5 Stratum Firewalls...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setComputationStage(stages[i]);
      await new Promise(r => setTimeout(r, 260));
    }

    try {
      const diff = await executeRoaeAnalysis(contract, textContent);
      graphStorage.addCandidateDiff(diff);
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
      <div className="w-full max-w-4xl bg-[#11112a] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-lg">
              Ω
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ROAE 2.0 — Recursive Ontological Analysis Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.8 Flash + Epistemic Firewall
                </span>
              </h2>
              <p className="text-xs text-indigo-300">
                Rigorous dialectical computation with Adversarial Integrity Auditing & Non-Consolation Invariants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-indigo-900/40 hover:bg-indigo-800 text-indigo-300 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-indigo-100">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-300">Dialectical Focus Presets:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 text-left rounded-xl bg-indigo-950/30 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-200 transition space-y-1"
                >
                  <div className="font-semibold text-xs text-indigo-300">{p.title}</div>
                  <div className="text-[11px] text-gray-400 line-clamp-2">{p.target}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Research Contract Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/20">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-indigo-300 mb-1">Target Philosophical Subject:</label>
                <input
                  type="text"
                  value={targetText}
                  onChange={e => setTargetText(e.target.value)}
                  className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-indigo-300 mb-1">Primary Analytical Questions:</label>
                <textarea
                  rows={3}
                  value={primaryQuestions}
                  onChange={e => setPrimaryQuestions(e.target.value)}
                  className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-indigo-300 mb-1">Explicitly Excluded Non-Goals:</label>
                <textarea
                  rows={2}
                  value={excludedNonGoals}
                  onChange={e => setExcludedNonGoals(e.target.value)}
                  className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-indigo-300 mb-1">Max Candidate Nodes:</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={maxNodes}
                    onChange={e => setMaxNodes(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-indigo-300 mb-1">Max Candidate Edges:</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={maxEdges}
                    onChange={e => setMaxEdges(parseInt(e.target.value) || 6)}
                    className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-indigo-300 mb-1">Passage / Primary Text Context:</label>
              <textarea
                rows={3}
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                placeholder="Enter philosophical text, citations, or experiential report..."
                className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-400 font-serif"
              />
            </div>
          </div>

          {/* Computation Status Indicator */}
          {isComputing && (
            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center space-y-2 animate-pulse">
              <div className="font-semibold text-sm text-indigo-200">
                Executing Multi-Stage Dialectical Computation...
              </div>
              <div className="text-xs text-indigo-400 font-mono">
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
                <span className="text-xs text-gray-400">
                  {generatedDiff.proposedNodes.length} nodes • {generatedDiff.proposedEdges.length} edges
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                Candidate nodes have been stratified across L1–L5 firewalls and subjected to the Adversarial Integrity Protocol (Referee, Prosecutor & Physician). Open the <strong>Candidate Diff Review Workspace</strong> to inspect, verify warrants, and commit to live topology.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Sovereign Protocol: Live graph is NEVER directly mutated; candidate diffs require human audit.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRunRoae}
              disabled={isComputing || !targetText.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isComputing || !targetText.trim()
                  ? 'bg-indigo-900/40 text-indigo-400 cursor-not-allowed border border-indigo-800/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
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
