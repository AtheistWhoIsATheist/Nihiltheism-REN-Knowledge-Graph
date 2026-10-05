// src/services/ingestion/IngestionService.ts
import { IngestionBatchItem, IngestedDocumentRecord } from '../../types/graph';
import { computeSHA256 } from '../../utils/crypto';
import { parseMarkdown } from '../parsers/MarkdownParser';
import { parsePlainText } from '../parsers/TextParser';
import { parsePdf } from '../parsers/PdfParser';
import { parseJson } from '../parsers/JsonParser';
import { parseCsv } from '../parsers/CsvParser';
import { graphStorage } from '../storage/GraphStorage';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function processIngestionBatch(
  files: File[],
  onProgress?: (index: number, total: number, item: IngestionBatchItem) => void
): Promise<IngestionBatchItem[]> {
  const results: IngestionBatchItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const itemId = `batch_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;
    const batchItem: IngestionBatchItem = {
      file,
      id: itemId,
      status: 'processing',
      progress: 10
    };

    try {
      // 1. Validation: Size check
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds limit of 25 MB.`);
      }

      // 2. Validation: Empty file check
      if (file.size === 0) {
        throw new Error('File is empty (0 bytes).');
      }

      // 3. Read content and compute hash
      let textContent = '';
      let arrayBuffer: ArrayBuffer | null = null;
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      if (ext === 'pdf') {
        arrayBuffer = await file.arrayBuffer();
        batchItem.contentHash = await computeSHA256(arrayBuffer);
      } else {
        textContent = await file.text();
        batchItem.contentHash = await computeSHA256(textContent);
      }

      batchItem.progress = 40;

      // 4. Duplicate Check (Contract Invariant 3.6: same content different name or repeat ingestion)
      const existingDoc = graphStorage.getDocumentByHash(batchItem.contentHash);
      if (existingDoc) {
        batchItem.status = 'duplicate';
        batchItem.progress = 100;
        batchItem.summary = `Duplicate detected: Content matches previously ingested document "${existingDoc.fileName}" (Hash: ${batchItem.contentHash.slice(0, 10)}...). Existing graph state preserved without duplicate nodes.`;
        results.push(batchItem);
        if (onProgress) onProgress(i, files.length, batchItem);
        continue;
      }

      // 5. Parser Dispatch
      const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      let parsed;

      switch (ext) {
        case 'md':
        case 'markdown':
          parsed = parseMarkdown(textContent, docId, file.name, batchItem.contentHash);
          break;
        case 'txt':
        case 'text':
          parsed = parsePlainText(textContent, docId, file.name, batchItem.contentHash);
          break;
        case 'pdf':
          if (!arrayBuffer) arrayBuffer = await file.arrayBuffer();
          parsed = await parsePdf(arrayBuffer, docId, file.name, batchItem.contentHash);
          break;
        case 'json':
          parsed = parseJson(textContent, docId, file.name, batchItem.contentHash);
          break;
        case 'csv':
          parsed = parseCsv(textContent, docId, file.name, batchItem.contentHash);
          break;
        default:
          throw new Error(`Unsupported file format ".${ext}". Supported formats are: .md, .txt, .pdf, .json, .csv.`);
      }

      batchItem.progress = 80;
      batchItem.extractedNodes = parsed.nodes;
      batchItem.extractedEdges = parsed.edges;
      batchItem.summary = parsed.summary;

      // 6. Commit to Persistent Storage (Atomic per file)
      const docRecord: IngestedDocumentRecord = {
        id: docId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || `application/${ext}`,
        contentHash: batchItem.contentHash,
        ingestedAt: new Date().toISOString(),
        nodeCount: parsed.nodes.length,
        edgeCount: parsed.edges.length,
        status: 'success',
        statusMessage: parsed.summary,
        summary: parsed.summary
      };

      graphStorage.addIngestedDocument(docRecord, parsed.nodes, parsed.edges);

      batchItem.status = 'success';
      batchItem.progress = 100;
    } catch (err: unknown) {
      batchItem.status = 'error';
      batchItem.progress = 100;
      batchItem.errorMessage = err instanceof Error ? err.message : String(err);
    }

    results.push(batchItem);
    if (onProgress) onProgress(i, files.length, batchItem);
  }

  return results;
}
