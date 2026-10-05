// src/components/NihiltheisticSuiteModal.tsx
import React, { useState } from 'react';
import { executeVoidOperator } from '../services/roae/RoaeClient';
import { VoidOperatorExperiment } from '../types/roae';
import { graphStorage } from '../services/storage/GraphStorage';

interface NihiltheisticSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NihiltheisticSuiteModal: React.FC<NihiltheisticSuiteModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'void_operator' | 'typology' | 'convergence'>('void_operator');

  // Void Operator form state
  const [subtractedAssumption, setSubtractedAssumption] = useState('Teleological Purpose / Cosmic Design');
  const [targetDomain, setTargetDomain] = useState('Ethical action, suffering alleviation, and existential awareness');
  const [isExecutingVoid, setIsExecutingVoid] = useState(false);
  const [voidResult, setVoidResult] = useState<VoidOperatorExperiment | null>(null);

  if (!isOpen) return null;

  const pastExperiments = graphStorage.getVoidExperiments();

  const handleRunVoidOperator = async () => {
    if (!subtractedAssumption.trim() || isExecutingVoid) return;
    setIsExecutingVoid(true);

    try {
      const exp = await executeVoidOperator(subtractedAssumption, targetDomain);
      graphStorage.addVoidExperiment(exp);
      setVoidResult(exp);
    } catch (err) {
      console.error('Void operator calculation failed:', err);
    } finally {
      setIsExecutingVoid(false);
    }
  };

  const typologyItems = [
    {
      code: 'N1',
      title: 'Logical Negation',
      formal: '¬P',
      description: 'The strict logical absence of a specific predicate or property. (e.g. "The stone is not alive"). Does not imply metaphysical void.',
      caution: 'Do not confuse logical negation with cosmic nullity.'
    },
    {
      code: 'N3',
      title: 'Axiological Collapse',
      formal: 'V(x) = ∅',
      description: 'The subjective evaporation of objective values, moral significance, or cosmic meaning. Classic existential crisis / passive nihilism.',
      caution: 'Axiological collapse is an evaluative and affective event, not proof that physical reality is false.'
    },
    {
      code: 'N5',
      title: 'Phenomenological Emptiness',
      formal: 'Φ(awareness) \ Intentionality',
      description: 'The lived, experiential state wherein conceptual representations and narrative internal dialogue dissolve, leaving pure quietude or abyss.',
      caution: 'Treated strictly as L2 datum. Does not provide an unearned warrant for L5 transcendent claims.'
    },
    {
      code: 'N7',
      title: 'Metaphysical Absence',
      formal: 'Onto(Ground) = Null',
      description: 'The ontological claim that cosmic reality is devoid of an underlying substance, teleological guarantor, or divine foundation. Absolute groundlessness.',
      caution: 'Must remain subject to Symmetrical Skepticism alongside naturalistic and theistic models.'
    },
    {
      code: 'N8',
      title: 'Nihiltheistic Nothingness',
      formal: 'Kenosis ∩ Abyss',
      description: 'The dialectical nexus where apophatic theology and existential nihilism converge: God as the unconditioned Void, transcendent precisely because empty of all idolatrous predicates.',
      caution: 'Requires rigorous Apophatic constraint: preserves silence rather than converting it into a new positive dogma.'
    }
  ];

  const convergenceLevels = [
    { level: 'C1', name: 'Lexical Resemblance', desc: 'Different traditions using identical words (e.g. "abyss", "darkness") with divergent contextual semantics.' },
    { level: 'C2', name: 'Thematic Affinity', desc: 'Superficial alignment on broad topics (e.g. impermanence, detachment).' },
    { level: 'C3', name: 'Functional Parallel', desc: 'Distinct doctrines serving a similar psychological or ritual coping function.' },
    { level: 'C4', name: 'Experiential Analogue', desc: 'Contemplative reports of comparable affective states (e.g. ego dissolution, silence).' },
    { level: 'C5', name: 'Structural Isomorphism', desc: 'Formal algebraic or structural equivalence between theoretical models (e.g. Buddhist Śūnyatā and Eckhartian Godhead).' },
    { level: 'C6', name: 'Axiomatic Convergence', desc: 'Shared fundamental philosophical axioms concerning epistemology and groundlessness.' },
    { level: 'C7', name: 'Ontological Identity', desc: 'Strict assertion that referents are metaphysically identical. (STRICTLY REGULATED: Requires exhaustive warrant; structural resemblance never auto-promotes to identity).' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#11112a] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-lg font-mono">
              ∅
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>The Nihiltheistic Suite & Void Operator (∅)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Domain-Specific Instrumentation
                </span>
              </h2>
              <p className="text-xs text-indigo-300">
                Precision conceptual scalpels: Typology of Nothingness (N1–N8) and Counterfactual Subtraction Stress-Testing
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

        {/* Tab Bar */}
        <div className="flex border-b border-indigo-500/20 bg-black/40 px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('void_operator')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'void_operator'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            The Void Operator ∅(X) Console
          </button>
          <button
            onClick={() => setActiveTab('typology')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'typology'
                ? 'border-purple-400 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Typology of Nothingness (N1–N8)
          </button>
          <button
            onClick={() => setActiveTab('convergence')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'convergence'
                ? 'border-indigo-400 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Convergence Ladder (C1–C7)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-indigo-100">
          {activeTab === 'void_operator' && (
            <div className="space-y-6">
              {/* Introduction card */}
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-gray-300 text-xs">
                <strong>The Void Operator (∅):</strong> A counterfactual subtraction stress-test. It removes a load-bearing assumption (teleological, providential, or physicalist) and isolates what phenomenology, ethics, and inquiry survive the collapse.
              </div>

              {/* Subtraction Input Form */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Subtracted Assumption ∅(X):</label>
                    <input
                      type="text"
                      value={subtractedAssumption}
                      onChange={e => setSubtractedAssumption(e.target.value)}
                      placeholder="e.g. Teleological purpose, Absolute divine providence"
                      className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Target Argument / Domain:</label>
                    <input
                      type="text"
                      value={targetDomain}
                      onChange={e => setTargetDomain(e.target.value)}
                      placeholder="e.g. Ethical duty, Compassion, Mystical experience"
                      className="w-full bg-[#0d0d22] border border-indigo-500/30 rounded-lg p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    {['Teleology', 'Divine Providence', 'Reductive Materialism', 'Moral Realism'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSubtractedAssumption(tag)}
                        className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/20"
                      >
                        ∅({tag})
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRunVoidOperator}
                    disabled={isExecutingVoid}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition flex items-center gap-1.5"
                  >
                    <span>{isExecutingVoid ? 'Subtracting...' : 'Execute ∅(X) Subtraction'}</span>
                  </button>
                </div>
              </div>

              {/* Current Experiment Result */}
              {voidResult && (
                <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                    <span className="font-bold text-white text-sm font-mono text-cyan-300">
                      ∅({voidResult.subtractedAssumption}) on "{voidResult.targetArgumentOrDomain}"
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(voidResult.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Surviving Phenomenology */}
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-emerald-500/30 space-y-1.5">
                      <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <span>✓ Surviving Phenomenology:</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-1">
                        {voidResult.survivingPhenomenology.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Collapsed Structures */}
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-rose-500/30 space-y-1.5">
                      <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                        <span>✕ Collapsed Dogmatic Structures:</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-1">
                        {voidResult.collapsedStructures.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Surviving Epistemology & Ethics */}
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-blue-500/30 space-y-1.5">
                      <div className="font-semibold text-blue-300">
                        ⚖ Surviving Epistemology & Ethics:
                      </div>
                      <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-1">
                        {voidResult.survivingEpistemologyAndEthics.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Apophatic Residue */}
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-purple-500/30 space-y-1.5">
                      <div className="font-semibold text-purple-300">
                        Ω Apophatic Residue:
                      </div>
                      <p className="text-gray-300 text-[11px] font-serif italic">
                        "{voidResult.apophaticResidue}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'typology' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-gray-300 text-xs">
                <strong>Typology of Nothingness (Section VI):</strong> To eliminate equivocation and intellectual counterfeiting, the system requires classifying any invocation of "Nothingness" into its precise philosophical category.
              </div>

              <div className="space-y-3">
                {typologyItems.map(item => (
                  <div
                    key={item.code}
                    className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 hover:border-purple-500/40 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/40">
                          {item.code}
                        </span>
                        <span className="font-bold text-white text-xs">{item.title}</span>
                      </div>
                      <span className="font-mono text-gray-400 text-xs">{item.formal}</span>
                    </div>
                    <div className="text-[11px] text-gray-300">{item.description}</div>
                    <div className="text-[10px] text-amber-400/90 pt-1">
                      <span className="font-semibold">Epistemic Caution:</span> {item.caution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'convergence' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-gray-300 text-xs">
                <strong>Levels of Convergence Ladder (Section VI):</strong> When comparing disparate traditions (e.g. Meister Eckhart and Nāgārjuna), the AI strictly enforces this ladder. Resemblance is NEVER upgraded to identity without mathematical isomorphism and exhaustive metaphysical warrant.
              </div>

              <div className="space-y-2">
                {convergenceLevels.map((c, i) => (
                  <div
                    key={c.level}
                    className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                        i === 6 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        i >= 4 ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                        'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {c.level}
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">{c.name}</div>
                        <div className="text-[11px] text-gray-300">{c.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider shrink-0 font-mono">
                      Level {i + 1}/7
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
