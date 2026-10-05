// src/components/ExportModal.tsx
import React, { useState } from 'react';
import { GraphNode, GraphEdge, IngestedDocumentRecord } from '../types/graph';
import {
  exportGraphToJson,
  exportGraphToMarkdown,
  exportGraphToCsv,
  triggerDownload
} from '../services/export/GraphExport';

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

  if (!isOpen) return null;

  const getExportData = () => {
    if (format === 'json') return exportGraphToJson(nodes, edges, documents);
    if (format === 'markdown') return exportGraphToMarkdown(nodes);
    return exportGraphToCsv(nodes, edges);
  };

  const content = getExportData();

  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    if (format === 'json') {
      triggerDownload(content, `nihiltheism-graph-${timestamp}.json`, 'application/json');
    } else if (format === 'markdown') {
      triggerDownload(content, `nihiltheism-hypermap-${timestamp}.md`, 'text/markdown');
    } else {
      triggerDownload(content, `nihiltheism-nodes-edges-${timestamp}.csv`, 'text/csv');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#11112a] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-indigo-950/40 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-indigo-100 flex items-center gap-2">
              <span>Export Knowledge Graph</span>
            </h2>
            <p className="text-xs text-indigo-300">
              Export full graph ({nodes.length} nodes, {edges.length} edges) for Cytoscape, Xmind, Obsidian, or Gephi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-indigo-900/40 hover:bg-indigo-800 text-indigo-300 flex items-center justify-center transition"
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
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-indigo-950/60 border-indigo-500/20 text-indigo-300 hover:bg-indigo-900'
              }`}
            >
              JSON (Full Graph)
            </button>
            <button
              onClick={() => setFormat('markdown')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                format === 'markdown'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-indigo-950/60 border-indigo-500/20 text-indigo-300 hover:bg-indigo-900'
              }`}
            >
              Markdown (Xmind / Obsidian)
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                format === 'csv'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-indigo-950/60 border-indigo-500/20 text-indigo-300 hover:bg-indigo-900'
              }`}
            >
              CSV (Spreadsheet / Gephi)
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Preview ({content.length.toLocaleString()} characters)</span>
              <button
                onClick={handleCopy}
                className="text-indigo-400 hover:text-indigo-200 transition"
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-black/60 border border-indigo-500/20 text-[11px] font-mono text-indigo-200 overflow-x-auto max-h-64 whitespace-pre-wrap select-all">
              {content.slice(0, 1500)}
              {content.length > 1500 && '\n\n... (truncated in preview)'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};
