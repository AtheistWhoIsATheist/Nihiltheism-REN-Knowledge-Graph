// src/components/NihiltheisticSuiteModal.tsx
import React, { useState } from 'react';
import { VoidOperatorExperiment } from '../types/roae';

export interface NothingnessTypologyItem {
  code: string;
  title: string;
  formal: string;
  description: string;
  caution: string;
}

interface NihiltheisticSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NihiltheisticSuiteModal: React.FC<NihiltheisticSuiteModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'void_operator' | 'typology' | 'convergence'>('void_operator');

  // Void Operator simulation state
  const [targetDomain, setTargetDomain] = useState('Cosmic Moral Order & Teleological Meaning');
  const [subtractedAssumption, setSubtractedAssumption] = useState('Objective Value & Transcendental Purpose');
  const [voidResult, setVoidResult] = useState<VoidOperatorExperiment | null>({
    id: 'void-default-1',
    targetArgumentOrDomain: 'Cosmic Moral Order & Teleological Meaning',
    subtractedAssumption: 'Objective Value & Transcendental Purpose',
    survivingPhenomenology: [
      'Raw immediacy of grief and pain',
      'The silent, self-luminous presence of bare awareness',
      'Affective recognition of absurdity without metaphysical consolation',
      'Immediate somatic empathy and vulnerability'
    ],
    collapsedStructures: [
      'Providential retribution and divine cosmic reward',
      'Eschatological final justification of earthly suffering',
      'Theological theodicy asserting evil serves a "greater good"'
    ],
    survivingEpistemologyAndEthics: [
      'Radical compassion grounded solely in shared vulnerability',
      'Intellectual modesty: refusing to counterfeit transcendent warrant',
      'Lucid recognition of contingency without cynical despair'
    ],
    apophaticResidue: 'The sheer "is-ness" of phenomena stripped of teleological commentary.',
    createdAt: new Date().toISOString()
  });

  if (!isOpen) return null;

  const typologyItems: NothingnessTypologyItem[] = [
    { code: 'N1', title: 'Privative Nothingness', formal: 'Privatio Boni', description: 'Mere absence, lack, or deficit of a specified substance, property, or good within a preexisting container.', caution: 'Do not confuse with ontological nothingness; N1 presupposes a plenary ground.' },
    { code: 'N2', title: 'Relative / Dialectical Nothingness', formal: 'Relatio Nihil', description: 'The contrasting pole in a polar opposition (e.g. Yin/Yang, Being/Non-Being). Dependent upon its counterpart for definition.', caution: 'Do not conflate with absolute groundlessness; N2 remains within systemic relativity.' },
    { code: 'N3', title: 'Cosmological Nothingness', formal: 'Vacuum Quantum', description: 'The physical quantum vacuum: fluctuating ground state possessing non-zero energy, zero-point fields, and spacetime.', caution: 'Physical vacuum is NOT philosophical nothingness; it is a rich physical state governed by quantum fields.' },
    { code: 'N4', title: 'Phenomenological Nothingness', formal: 'Das Nichts (Heidegger) / Néant (Sartre)', description: 'Experiential disclosure of groundlessness via radical affective states (Angst, vertigo, boredom, silence) wherein beings slip away.', caution: 'Keep strictly on L2 phenomenological level; do not prematurely reify into metaphysical deity.' },
    { code: 'N5', title: 'Epistemological Nothingness', formal: 'Agnosia / Unknowing', description: 'Cognitive limit wherein intellect confronts its constitutive inability to represent its own ultimate conditions.', caution: 'Recognize cognitive boundary without claiming mystical infallibility.' },
    { code: 'N6', title: 'Apophatic / Hyperessential Nothingness', formal: 'Hyperousios / Ein Sof / Śūnyatā', description: 'That which "is not" because it transcends all predicable being, existence, or conceptual determination.', caution: 'Enforce firewall: eastern Śūnyatā and western Pseudo-Dionysian hyper-being are not automatically identical.' },
    { code: 'N7', title: 'Absolute / Ontological Nothingness', formal: 'Absoluta Nihilitas', description: 'The absolute absence of all entities, fields, spacetime, physical laws, and logic.', caution: 'Strictly uninstantiated in reality; functions as a limiting theoretical counterfactual.' },
    { code: 'N8', title: 'The Axiological Void', formal: 'Vanitas / Hebel (Ecclesiastes)', description: 'The absence of inherent cosmic purpose, intrinsic meaning, or objective telos under the sun.', caution: 'The foundational insight of nihiltheism: the axiological void does not cancel experiential reality.' }
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

  const handleRunVoidOperator = () => {
    if (!targetDomain.trim() || !subtractedAssumption.trim()) return;

    setVoidResult({
      id: `void-${Date.now()}`,
      targetArgumentOrDomain: targetDomain.trim(),
      subtractedAssumption: subtractedAssumption.trim(),
      survivingPhenomenology: [
        `Direct immediate experience within ${targetDomain.trim()} minus ${subtractedAssumption.trim()}`,
        'Residual affective structure surviving counterfactual subtraction',
        'Immanent relational friction remaining intact'
      ],
      collapsedStructures: [
        `Dogmatic claims that ${targetDomain.trim()} requires ${subtractedAssumption.trim()} to exist`,
        'Extraneous theological consolation superimposed on experience',
        'Artificial synthetic harmony between contradictory imperatives'
      ],
      survivingEpistemologyAndEthics: [
        'Lucid, unadorned ethical responsibility without transcendental insurance',
        'Disciplined epistemic restraint: refusing inferential leap across firewall'
      ],
      apophaticResidue: `What survives the subtraction of ${subtractedAssumption.trim()} is bare phenomenological presence.`,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#1c2128]/95 border border-white/15 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#242a33] border border-white/10 text-sky-300 flex items-center justify-center font-bold text-lg font-mono">
              ∅
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>The Nihiltheistic Suite & Void Operator (∅)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
                  Domain-Specific Instrumentation
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Precision conceptual scalpels: Typology of Nothingness (N1–N8) and Counterfactual Subtraction Stress-Testing
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

        {/* Tab Bar */}
        <div className="flex border-b border-white/10 bg-[#14181d]/80 px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('void_operator')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'void_operator'
                ? 'border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            The Void Operator ∅(X) Console
          </button>
          <button
            onClick={() => setActiveTab('typology')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'typology'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Typology of Nothingness (N1–N8)
          </button>
          <button
            onClick={() => setActiveTab('convergence')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'convergence'
                ? 'border-teal-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Levels of Convergence Ladder (C1–C7)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {activeTab === 'void_operator' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-sky-500/30 text-slate-300 text-xs leading-relaxed">
                <strong className="text-sky-300">The Void Operator Invariant: ∅(X).</strong> When applied to any dogma, concept, or domain, the operator systematically subtracts assumption X (e.g. Teleology, Divine Intervention, Objective Value) and strictly isolates surviving phenomenology from collapsed dogmatic structures.
              </div>

              {/* Subtraction Inputs */}
              <div className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                      Target Domain or Claim:
                    </label>
                    <input
                      type="text"
                      value={targetDomain}
                      onChange={e => setTargetDomain(e.target.value)}
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                      Subtracted Assumption ∅(X):
                    </label>
                    <input
                      type="text"
                      value={subtractedAssumption}
                      onChange={e => setSubtractedAssumption(e.target.value)}
                      className="w-full bg-[#1c2128] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex gap-1.5">
                    <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                    {['∅(Teleology)', '∅(Eschatology)', '∅(Immortal Soul)'].map(p => (
                      <button
                        key={p}
                        onClick={() => setSubtractedAssumption(p.replace(/∅\(|\)/g, ''))}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#242a33] hover:bg-[#2e3642] text-sky-300 border border-white/10"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunVoidOperator}
                    className="px-4 py-1.5 rounded-xl font-bold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition"
                  >
                    ∅ Apply Counterfactual Subtraction
                  </button>
                </div>
              </div>

              {/* Current Experiment Result */}
              {voidResult && (
                <div className="p-4 rounded-xl bg-[#14181d]/80 border border-sky-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-white text-sm font-mono text-sky-300">
                      ∅({voidResult.subtractedAssumption}) on "{voidResult.targetArgumentOrDomain}"
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(voidResult.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Surviving Phenomenology */}
                    <div className="p-3 rounded-lg bg-[#1c2128] border border-emerald-500/30 space-y-1.5">
                      <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <span>✓ Surviving Phenomenology:</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                        {voidResult.survivingPhenomenology.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Collapsed Structures */}
                    <div className="p-3 rounded-lg bg-[#1c2128] border border-rose-500/30 space-y-1.5">
                      <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                        <span>✕ Collapsed Dogmatic Structures:</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                        {voidResult.collapsedStructures.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Surviving Epistemology & Ethics */}
                    <div className="p-3 rounded-lg bg-[#1c2128] border border-teal-500/30 space-y-1.5">
                      <div className="font-semibold text-teal-300">
                        ⚖ Surviving Epistemology & Ethics:
                      </div>
                      <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                        {voidResult.survivingEpistemologyAndEthics.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Apophatic Residue */}
                    <div className="p-3 rounded-lg bg-[#1c2128] border border-amber-500/30 space-y-1.5">
                      <div className="font-semibold text-amber-300">
                        Ω Apophatic Residue:
                      </div>
                      <p className="text-slate-300 text-[11px] font-serif italic">
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
              <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-amber-500/30 text-slate-300 text-xs">
                <strong className="text-amber-300">Typology of Nothingness (Section VI):</strong> To eliminate equivocation and intellectual counterfeiting, the system requires classifying any invocation of "Nothingness" into its precise philosophical category.
              </div>

              <div className="space-y-3">
                {typologyItems.map(item => (
                  <div
                    key={item.code}
                    className="p-4 rounded-xl bg-[#14181d]/80 border border-white/10 hover:border-amber-400/40 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40">
                          {item.code}
                        </span>
                        <span className="font-bold text-white text-xs">{item.title}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-xs">{item.formal}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">{item.description}</div>
                    <div className="text-[10px] text-amber-300/90 pt-1">
                      <span className="font-semibold">Epistemic Caution:</span> {item.caution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'convergence' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#14181d]/80 border border-teal-500/30 text-slate-300 text-xs">
                <strong className="text-teal-300">Levels of Convergence Ladder (Section VI):</strong> When comparing disparate traditions (e.g. Meister Eckhart and Nāgārjuna), the AI strictly enforces this ladder. Resemblance is NEVER upgraded to identity without mathematical isomorphism and exhaustive metaphysical warrant.
              </div>

              <div className="space-y-2">
                {convergenceLevels.map((c, i) => (
                  <div
                    key={c.level}
                    className="p-3 rounded-xl bg-[#14181d]/80 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                        i === 6 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        i >= 4 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-sky-950 text-sky-300 border border-sky-500/30'
                      }`}>
                        {c.level}
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">{c.name}</div>
                        <div className="text-[11px] text-slate-300">{c.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 font-mono">
                      Level {i + 1}/7
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14181d]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
