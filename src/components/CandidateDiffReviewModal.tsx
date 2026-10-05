// src/components/CandidateDiffReviewModal.tsx
import React, { useState } from 'react';
import { CandidateGraphDiff, CandidateNode, CandidateEdge, EpistemicStratum } from '../types/roae';
import { graphStorage } from '../services/storage/GraphStorage';

interface CandidateDiffReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffs: CandidateGraphDiff[];
  onCommitSuccess: () => void;
}

export const CandidateDiffReviewModal: React.FC<CandidateDiffReviewModalProps> = ({
  isOpen,
  onClose,
  diffs,
  onCommitSuccess
}) => {
  const [selectedDiffId, setSelectedDiffId] = useState<string>(diffs[0]?.id || '');
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<Set<string>>(new Set());

  const activeDiff = diffs.find(d => d.id === selectedDiffId) || diffs[0];

  // Initialize selected items whenever activeDiff changes
  React.useEffect(() => {
    if (activeDiff) {
      setSelectedDiffId(activeDiff.id);
      setSelectedNodeIds(new Set(activeDiff.proposedNodes.map(n => n.tempId)));
      setSelectedEdgeIds(new Set(activeDiff.proposedEdges.map(e => e.tempId)));
    }
  }, [selectedDiffId, activeDiff]);

  if (!isOpen) return null;

  const toggleNode = (tempId: string) => {
    const next = new Set(selectedNodeIds);
    if (next.has(tempId)) {
      next.delete(tempId);
    } else {
      next.add(tempId);
    }
    setSelectedNodeIds(next);
  };

  const toggleEdge = (tempId: string) => {
    const next = new Set(selectedEdgeIds);
    if (next.has(tempId)) {
      next.delete(tempId);
    } else {
      next.add(tempId);
    }
    setSelectedEdgeIds(next);
  };

  const handleCommit = () => {
    if (!activeDiff) return;
    graphStorage.commitCandidateDiff(
      activeDiff.id,
      Array.from(selectedNodeIds),
      Array.from(selectedEdgeIds)
    );
    onCommitSuccess();
    onClose();
  };

  const handleReject = () => {
    if (!activeDiff) return;
    graphStorage.rejectCandidateDiff(activeDiff.id);
    onCommitSuccess();
  };

  const getStratumBadge = (stratum: EpistemicStratum) => {
    switch (stratum) {
      case 'L1_REPORT':
        return { label: 'L1: Report', color: 'bg-blue-950 text-blue-300 border-blue-500/40' };
      case 'L2_PHENOMENOLOGICAL_STRUCTURE':
        return { label: 'L2: Phenomenological Structure', color: 'bg-purple-950 text-purple-300 border-purple-500/40' };
      case 'L3_INTERPRETIVE_CLASSIFICATION':
        return { label: 'L3: Interpretive Classification', color: 'bg-indigo-950 text-indigo-300 border-indigo-500/40' };
      case 'L4_CAUSAL_EXPLANATION':
        return { label: 'L4: Causal Explanation', color: 'bg-amber-950 text-amber-300 border-amber-500/40' };
      case 'L5_ONTOLOGICAL_CLAIM':
        return { label: 'L5: Ontological Claim', color: 'bg-rose-950 text-rose-300 border-rose-500/40 font-bold' };
      default:
        return { label: stratum, color: 'bg-gray-900 text-gray-300 border-gray-600' };
    }
  };

  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case 'Survives Unchanged':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'Survives with Qualification':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'Partially Abandoned':
        return 'bg-orange-950 text-orange-300 border-orange-500/40';
      case 'Rejected':
        return 'bg-rose-950 text-rose-300 border-rose-500/40';
      default:
        return 'bg-indigo-950 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl bg-[#11112a] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold text-lg">
              ⚖
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Candidate Graph-Diff Review & Audit Workspace</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Data/Theory Firewall Active
                </span>
              </h2>
              <p className="text-xs text-indigo-300">
                Audit machine-generated inferences before committing to live philosophical baseline
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

        {/* Diff Tabs if multiple */}
        {diffs.length > 1 && (
          <div className="flex gap-2 p-3 bg-black/40 border-b border-indigo-500/20 overflow-x-auto text-xs">
            {diffs.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => setSelectedDiffId(d.id)}
                className={`px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-2 ${
                  selectedDiffId === d.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40'
                }`}
              >
                <span>Diff #{idx + 1} ({d.runId})</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  d.status === 'committed' ? 'bg-emerald-900 text-emerald-200' :
                  d.status === 'rejected' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'
                }`}>
                  {d.status}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        {!activeDiff ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <div className="text-3xl">📭</div>
            <div className="font-semibold text-sm">No Candidate Graph Diffs in Queue</div>
            <p className="text-xs text-gray-500">
              Run an analysis in the ROAE 2.0 Engine Workspace to generate candidate graph diffs for human audit.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-indigo-100">
            {/* Diff Meta Banner */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-sm">
                  Target: {activeDiff.contract.targetText}
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-1">
                  Engine: {activeDiff.engineVersion} • Timestamp: {new Date(activeDiff.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getVerdictBadge(activeDiff.audit.physicianVerdict.status)}`}>
                  Physician Verdict: {activeDiff.audit.physicianVerdict.status}
                </span>
                {activeDiff.audit.symmetricalEvaluation.underdeterminationDeclared && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    ⚖ Underdetermined
                  </span>
                )}
              </div>
            </div>

            {/* Adversarial Integrity Protocol Card */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <span>Adversarial Integrity Protocol (AIP) Audit</span>
                <span className="text-[10px] font-normal text-purple-400">(Referee, Prosecutor & Physician)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                {/* Referee */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 space-y-1.5">
                  <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <span>🧐 Competent Critic (Referee):</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                    {activeDiff.audit.refereeCritique.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                  {activeDiff.audit.refereeCritique.vulnerabilitiesIdentified.length > 0 && (
                    <div className="text-amber-400 pt-1 text-[10px]">
                      Vulnerabilities: {activeDiff.audit.refereeCritique.vulnerabilitiesIdentified.join('; ')}
                    </div>
                  )}
                </div>

                {/* Prosecutor */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 space-y-1.5">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <span>⚖ Strongest Case Against (Prosecutor):</span>
                  </div>
                  <div className="text-gray-300">
                    "{activeDiff.audit.prosecutorCase.strongestCounterThesis}"
                  </div>
                  <div className="text-rose-400 text-[10px] pt-1">
                    Objections: {activeDiff.audit.prosecutorCase.destructiveObjections.join('; ')}
                  </div>
                </div>

                {/* Error Profile */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 space-y-1">
                  <div className="font-semibold text-amber-300">Error Theory & Cognitive Bias Trap:</div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">Presumed Bias:</span> {activeDiff.audit.errorProfile.presumedBias}
                  </div>
                  <div className="text-gray-400 text-[10px]">
                    Why it looks compelling: {activeDiff.audit.errorProfile.whyItAppearsCompelling}
                  </div>
                </div>

                {/* Symmetrical Evaluation */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 space-y-1">
                  <div className="font-semibold text-cyan-300">Symmetrical Skepticism Triangulation:</div>
                  <div className="text-gray-300 text-[10px]">
                    <div>• <strong>Nihiltheistic:</strong> {activeDiff.audit.symmetricalEvaluation.nihiltheisticInterpretation}</div>
                    <div>• <strong>Naturalistic:</strong> {activeDiff.audit.symmetricalEvaluation.naturalisticInterpretation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposed Candidate Nodes Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-indigo-200">
                  Proposed Candidate Nodes ({activeDiff.proposedNodes.length})
                </h3>
                <span className="text-xs text-gray-400">
                  Select nodes to approve for integration into live graph
                </span>
              </div>

              <div className="border border-indigo-500/20 rounded-xl overflow-hidden divide-y divide-indigo-500/10">
                {activeDiff.proposedNodes.map(node => {
                  const badge = getStratumBadge(node.stratum);
                  const isChecked = selectedNodeIds.has(node.tempId);

                  return (
                    <div
                      key={node.tempId}
                      className={`p-3.5 transition flex items-start gap-3 ${
                        isChecked ? 'bg-indigo-950/30' : 'bg-black/20 opacity-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleNode(node.tempId)}
                        disabled={activeDiff.status === 'committed'}
                        className="mt-1 rounded accent-indigo-500 w-4 h-4 cursor-pointer"
                      />

                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-xs">{node.label}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-900/50 text-indigo-300">
                            Stance: {node.stance}
                          </span>
                          {node.nothingnessSense && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                              {node.nothingnessSense}
                            </span>
                          )}
                          {node.firewallCheck.passed ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              ✓ Firewall Passed
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30">
                              ⚠ Firewall Leap Flagged
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-gray-300">
                          <span className="text-gray-400">Epistemic Warrant:</span> {node.stratumWarrant}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proposed Candidate Edges Table */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-indigo-200">
                Proposed Dialectical Edges ({activeDiff.proposedEdges.length})
              </h3>
              <div className="border border-indigo-500/20 rounded-xl overflow-hidden divide-y divide-indigo-500/10">
                {activeDiff.proposedEdges.map(edge => {
                  const isChecked = selectedEdgeIds.has(edge.tempId);
                  const sourceNode = activeDiff.proposedNodes.find(n => n.tempId === edge.sourceTempId);
                  const targetNode = activeDiff.proposedNodes.find(n => n.tempId === edge.targetTempId);

                  return (
                    <div
                      key={edge.tempId}
                      className={`p-3 transition flex items-start gap-3 ${
                        isChecked ? 'bg-indigo-950/20' : 'bg-black/20 opacity-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEdge(edge.tempId)}
                        disabled={activeDiff.status === 'committed'}
                        className="mt-0.5 rounded accent-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-indigo-200 font-medium truncate max-w-[200px]">
                            {sourceNode?.label || edge.sourceTempId}
                          </span>
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                            — {edge.relation} →
                          </span>
                          <span className="text-indigo-200 font-medium truncate max-w-[200px]">
                            {targetNode?.label || edge.targetTempId}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Warrant: {edge.warrant}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {activeDiff && activeDiff.status === 'committed' ? (
              <span className="text-emerald-400 font-medium">✓ This diff has already been committed to the live topology.</span>
            ) : (
              <span>Selected {selectedNodeIds.size} node(s) and {selectedEdgeIds.size} edge(s) for atomic commit.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition"
            >
              Close
            </button>
            {activeDiff && activeDiff.status !== 'committed' && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl text-xs bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition"
                >
                  Reject Diff
                </button>
                <button
                  onClick={handleCommit}
                  disabled={selectedNodeIds.size === 0}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <span>✓</span>
                  <span>Commit Approved to Live Topology</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
