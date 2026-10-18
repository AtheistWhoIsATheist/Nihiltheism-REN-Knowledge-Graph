// src/components/IngestionModal.tsx
import React, { useState, useRef } from 'react';
import { processIngestionBatch } from '../services/ingestion/IngestionService';
import { IngestionBatchItem } from '../types/graph';
import { graphStorage } from '../services/storage/GraphStorage';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestionComplete: () => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestionComplete
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<IngestionBatchItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArr]);
    }
  };

  const loadFixture = (type: 'markdown' | 'text' | 'json' | 'malformed') => {
    let mockFile: File;
    if (type === 'markdown') {
      const content = `# The Abyss of Consciousness
Axiological collapse is the fundamental disclosure of existence.
- Heidegger discusses das Nichts in Being and Time.
- The silence of the desert reflects the unconditioned.
> "The abyss does not negotiate."
`;
      mockFile = new File([content], 'abyss-meditation.md', { type: 'text/markdown' });
    } else if (type === 'text') {
      const content = `Arthur Schopenhauer on the Will.
The world as will and representation reveals eternal dissatisfaction.
Phenomenological groundlessness cannot be redeemed by historical progress.
`;
      mockFile = new File([content], 'schopenhauer-fragment.txt', { type: 'text/plain' });
    } else if (type === 'json') {
      const content = JSON.stringify({
        title: 'Structured Void Protocol',
        author: 'Nāgārjuna',
        concepts: ['Śūnyatā', 'Pratītyasamutpāda', 'Two Truths'],
        description: 'Emptiness is the relational nature of all dependently originated phenomena.'
      }, null, 2);
      mockFile = new File([content], 'nagarjuna-schema.json', { type: 'application/json' });
    } else {
      mockFile = new File(['{ malformed json test ::: [ invalid ] }'], 'malformed-test.json', { type: 'application/json' });
    }

    setSelectedFiles(prev => [...prev, mockFile]);
  };

  const handleStartIngestion = async () => {
    if (selectedFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      const results = await processIngestionBatch(selectedFiles);
      setBatchResults(results);
      onIngestionComplete();
    } catch (err) {
      console.error('Batch ingestion failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#1c2128]/95 border border-white/15 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#14181d]/50">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Bulk File Ingestion System</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Live State Invariant
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Contract-verified parser for .md, .txt, .pdf, .json, .csv with content hash deduplication
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
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              dragActive
                ? 'border-sky-400 bg-[#242a33]'
                : 'border-white/15 bg-[#14181d]/80 hover:border-sky-400/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".md,.markdown,.txt,.pdf,.json,.csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="space-y-1">
              <div className="text-2xl">📥</div>
              <div className="text-sm font-medium text-slate-200">
                Drag and drop files here or click to browse
              </div>
              <div className="text-xs text-slate-400">
                Supported: Markdown (.md), Text (.txt), PDF (.pdf), JSON (.json), CSV (.csv) — Max 25MB
              </div>
            </div>
          </div>

          {/* Quick Fixtures */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Fixtures:</span>
            <button
              onClick={() => loadFixture('markdown')}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
            >
              + Abyss (Markdown)
            </button>
            <button
              onClick={() => loadFixture('text')}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
            >
              + Schopenhauer (Text)
            </button>
            <button
              onClick={() => loadFixture('json')}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
            >
              + Void Schema (JSON)
            </button>
            <button
              onClick={() => loadFixture('malformed')}
              className="px-2.5 py-1 rounded-lg text-xs bg-rose-950/50 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 transition"
            >
              + Malformed (Test Isolation)
            </button>
          </div>

          {/* Selected Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Selected Queue ({selectedFiles.length} files)</span>
                {!isProcessing && (
                  <button
                    onClick={() => { setSelectedFiles([]); setBatchResults([]); }}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {selectedFiles.map((file, idx) => {
                  const result = batchResults[idx];
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#14181d]/80 border border-white/10 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="truncate flex-1">
                        <div className="font-medium text-slate-200 truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>

                      {result ? (
                        <div className="shrink-0 flex items-center gap-2">
                          {result.status === 'success' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              ✓ {result.extractedNodes?.length || 0} nodes
                            </span>
                          )}
                          {result.status === 'duplicate' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30" title={result.summary}>
                              Duplicate (Skipped)
                            </span>
                          )}
                          {result.status === 'error' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30" title={result.errorMessage}>
                              ✕ Error Isolated
                            </span>
                          )}
                          {result.status === 'processing' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 animate-pulse border border-sky-500/30">
                              Processing...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Ready</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Summary if any */}
          {batchResults.length > 0 && !isProcessing && (
            <div className="p-3 rounded-xl bg-[#14181d]/80 border border-white/10 text-xs space-y-1">
              <div className="font-semibold text-slate-200">Batch Processing Report:</div>
              <div className="text-slate-300 text-[11px]">
                Committed {batchResults.filter(r => r.status === 'success').length} documents • Skipped {batchResults.filter(r => r.status === 'duplicate').length} duplicates • Isolated {batchResults.filter(r => r.status === 'error').length} failures.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14181d]/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isProcessing ? 'Processing batch...' : `${selectedFiles.length} file(s) selected`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-[#242a33] hover:bg-[#2e3642] text-slate-300 border border-white/10 transition"
            >
              Close
            </button>
            <button
              onClick={handleStartIngestion}
              disabled={selectedFiles.length === 0 || isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedFiles.length === 0 || isProcessing
                  ? 'bg-[#242a33] text-slate-500 cursor-not-allowed border border-white/10'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              {isProcessing ? 'Ingesting...' : 'Ingest & Live Update Graph'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
