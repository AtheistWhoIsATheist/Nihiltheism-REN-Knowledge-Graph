// src/components/IngestionModal.tsx
import React, { useState, useRef } from 'react';
import { IngestionBatchItem } from '../types/graph';
import { processIngestionBatch } from '../services/ingestion/IngestionService';

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
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleStartIngestion = async () => {
    if (selectedFiles.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setBatchResults([]);

    try {
      const results = await processIngestionBatch(selectedFiles, (_idx, _total, item) => {
        setBatchResults(prev => {
          const next = [...prev];
          const existIdx = next.findIndex(r => r.id === item.id);
          if (existIdx >= 0) {
            next[existIdx] = item;
          } else {
            next.push(item);
          }
          return next;
        });
      });

      setBatchResults(results);
      onIngestionComplete();
    } catch (e) {
      console.error('Batch processing error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Pre-configured fixtures for instant browser / test verification
  const loadFixture = (type: 'markdown' | 'text' | 'json' | 'malformed') => {
    let file: File;
    if (type === 'markdown') {
      const mdContent = `# Dialectics of the Abyss
## The Nihilistic Pivot
- Groundlessness manifests as absolute epistemic freedom.
- The silence of being precedes all ontological articulation.
> "To gaze into nothingness is to perceive the unconditioned substrate of consciousness."
## Apophatic Dynamics
- The unknowable divine darkness of Pseudo-Dionysius.
- Radical detachment from affirmative dogma.`;
      file = new File([mdContent], 'dialectics-of-the-abyss.md', { type: 'text/markdown' });
    } else if (type === 'text') {
      const txtContent = `Arthur Schopenhauer and the Denial of the Will.

The world as representation offers mere phenomena, whereas the inner kernel is the blind, relentless Will. Suffering originates from unceasing desire and striving. 

Nietzsche later inverted this pessimism into the affirmative Will to Power, rejecting passive decadence in favor of eternal recurrence.`;
      file = new File([txtContent], 'schopenhauer-will-study.txt', { type: 'text/plain' });
    } else if (type === 'json') {
      const jsonContent = JSON.stringify({
        nodes: [
          { id: "c1", label: "Ontological Void", type: "concept" },
          { id: "c2", label: "Radical Immanence", type: "concept" }
        ],
        edges: [
          { id: "e1", source: "c1", target: "c2", label: "generates" }
        ]
      }, null, 2);
      file = new File([jsonContent], 'ontological-void-schema.json', { type: 'application/json' });
    } else {
      file = new File(["{ malformed json without closing brace..."], 'malformed-fixture.json', { type: 'application/json' });
    }

    setSelectedFiles(prev => [...prev, file]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#11112a] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-indigo-500/20 bg-indigo-950/40">
          <div>
            <h2 className="text-lg font-bold text-indigo-100 flex items-center gap-2">
              <span>Bulk File Ingestion System</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Live State Invariant
              </span>
            </h2>
            <p className="text-xs text-indigo-300">
              Contract-verified parser for .md, .txt, .pdf, .json, .csv with content hash deduplication
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
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              dragActive
                ? 'border-indigo-400 bg-indigo-950/60'
                : 'border-indigo-500/30 bg-[#0d0d22] hover:border-indigo-400/60'
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
              <div className="text-sm font-medium text-indigo-200">
                Drag and drop files here or click to browse
              </div>
              <div className="text-xs text-indigo-400">
                Supported: Markdown (.md), Text (.txt), PDF (.pdf), JSON (.json), CSV (.csv) — Max 25MB
              </div>
            </div>
          </div>

          {/* Quick Fixtures */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-indigo-400 font-medium">Quick Fixtures:</span>
            <button
              onClick={() => loadFixture('markdown')}
              className="px-2.5 py-1 rounded-lg text-xs bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 transition"
            >
              + Abyss (Markdown)
            </button>
            <button
              onClick={() => loadFixture('text')}
              className="px-2.5 py-1 rounded-lg text-xs bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 transition"
            >
              + Schopenhauer (Text)
            </button>
            <button
              onClick={() => loadFixture('json')}
              className="px-2.5 py-1 rounded-lg text-xs bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 transition"
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
              <div className="text-xs font-semibold text-indigo-300 flex items-center justify-between">
                <span>Selected Queue ({selectedFiles.length} files)</span>
                {!isProcessing && (
                  <button
                    onClick={() => { setSelectedFiles([]); setBatchResults([]); }}
                    className="text-indigo-400 hover:text-indigo-200"
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
                      className="p-2.5 rounded-lg bg-[#0d0d22] border border-indigo-500/20 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="truncate flex-1">
                        <div className="font-medium text-indigo-200 truncate">{file.name}</div>
                        <div className="text-[10px] text-gray-400">
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
                            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 animate-pulse">
                              Processing...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500">Ready</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Summary if any */}
          {batchResults.length > 0 && !isProcessing && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
              <div className="font-semibold text-indigo-200">Batch Processing Report:</div>
              <div className="text-gray-300 text-[11px]">
                Committed {batchResults.filter(r => r.status === 'success').length} documents • Skipped {batchResults.filter(r => r.status === 'duplicate').length} duplicates • Isolated {batchResults.filter(r => r.status === 'error').length} failures.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/30 flex items-center justify-between">
          <div className="text-xs text-indigo-400">
            {isProcessing ? 'Processing batch...' : `${selectedFiles.length} file(s) selected`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition"
            >
              Close
            </button>
            <button
              onClick={handleStartIngestion}
              disabled={selectedFiles.length === 0 || isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedFiles.length === 0 || isProcessing
                  ? 'bg-indigo-900/40 text-indigo-400 cursor-not-allowed border border-indigo-800/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
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
