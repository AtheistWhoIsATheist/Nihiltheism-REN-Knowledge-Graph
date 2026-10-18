// src/components/ExportModal.tsx
import React, { useState, useMemo } from 'react';
import { GraphNode, GraphEdge, IngestedDocumentRecord } from '../types/graph';
import { exportGraphToJson, exportGraphToMarkdown, exportGraphToCsv } from '../services/export/GraphExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  documents: IngestedDocumentRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  documents
}) => {
  const [format, setFormat] = useState<'json' | 'markdown' | 'csv'>('json');
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => {
    if (format === 'json') return exportGraphToJson(nodes, edges, documents);
    if (format === 'markdown') return exportGraphToMarkdown(nodes);
    return exportGraphToCsv(nodes, edges);
  }, [nodes, edges, documents, format]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const mimeTypes = {
      json: 'application/json',
      markdown: 'text/markdown',
      csv: 'text/csv'
    };

    const extensions = {
      json: 'json',
      markdown: 'md',
      csv: 'csv'
    };

    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nihiltheism-knowledge-graph-${new Date().toISOString().slice(0, 10)}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#1c2128]/95 border border-white/15 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Export Knowledge Graph</span>
            </h2>
            <p className="text-xs text-slate-400">
              Export full graph ({nodes.length} nodes, {edges.length} edges) for Cytoscape, Xmind, Obsidian, or Gephi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242a33] hover:bg-[#2e3642] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Format selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                format === 'json'
                  ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'bg-[#242a33] border-white/10 text-slate-300 hover:bg-[#2e3642]'
              }`}
            >
              JSON (Full Graph)
            </button>
            <button
              onClick={() => setFormat('markdown')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                format === 'markdown'
                  ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'bg-[#242a33] border-white/10 text-slate-300 hover:bg-[#2e3642]'
              }`}
            >
              Markdown (Xmind / Obsidian)
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                format === 'csv'
                  ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'bg-[#242a33] border-white/10 text-slate-300 hover:bg-[#2e3642]'
              }`}
            >
              CSV (Spreadsheet / Gephi)
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Preview ({content.length.toLocaleString()} characters)</span>
              <button
                onClick={handleCopy}
                className="text-sky-400 hover:text-sky-300 transition"
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#14181d] border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 whitespace-pre-wrap select-all">
              {content.slice(0, 1500)}
              {content.length > 1500 && '\n\n... (truncated in preview)'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14181d]/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-[#242a33] hover:bg-[#2e3642] text-slate-300 border border-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-b from-[#3a4250] to-[#282e38] hover:from-[#444e5f] hover:to-[#2e3642] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] transition"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};
