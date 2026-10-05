// src/services/parsers/CsvParser.ts
import { GraphNode, GraphEdge } from '../../types/graph';
import { ParsedDocumentResult } from './MarkdownParser';

export function parseCsv(
  csvText: string,
  docId: string,
  fileName: string,
  hash: string
): ParsedDocumentResult {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const now = new Date().toISOString();
  const docTitle = fileName.replace(/\.[^/.]+$/, "");
  const docNodeId = `doc_${docId}`;

  nodes.push({
    id: docNodeId,
    label: docTitle,
    level: 1,
    type: 'document',
    count: 0,
    isLeaf: false,
    provenance: {
      documentId: docId,
      sourceFile: fileName,
      fileHash: hash,
      extractedAt: now,
      snippet: csvText.slice(0, 150)
    }
  });

  const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());

  for (let i = 1; i < Math.min(lines.length, 100); i++) {
    const row = lines[i].split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
    const primaryVal = row[0] || `Row ${i}`;
    const rowNodeId = `csv_row_${docId}_${i}`;

    nodes.push({
      id: rowNodeId,
      label: primaryVal.slice(0, 70),
      level: 2,
      type: 'concept',
      parentId: docNodeId,
      isLeaf: row.length <= 1,
      provenance: {
        documentId: docId,
        sourceFile: fileName,
        fileHash: hash,
        extractedAt: now,
        snippet: lines[i]
      }
    });

    edges.push({
      id: `edge_${docNodeId}_${rowNodeId}`,
      source: docNodeId,
      target: rowNodeId,
      type: 'hierarchical',
      label: headers[0] || 'record'
    });

    // Sub-attributes
    for (let c = 1; c < Math.min(row.length, 5); c++) {
      if (row[c]) {
        const colNodeId = `csv_col_${docId}_${i}_${c}`;
        const headerName = headers[c] || `Field ${c}`;
        nodes.push({
          id: colNodeId,
          label: `${headerName}: ${row[c]}`.slice(0, 70),
          level: 3,
          type: 'entity',
          parentId: rowNodeId,
          isLeaf: true,
          provenance: {
            documentId: docId,
            sourceFile: fileName,
            fileHash: hash,
            extractedAt: now,
            snippet: `${headerName}: ${row[c]}`
          }
        });
        edges.push({
          id: `edge_${rowNodeId}_${colNodeId}`,
          source: rowNodeId,
          target: colNodeId,
          type: 'semantic',
          label: headerName
        });
      }
    }
  }

  nodes[0].count = nodes.length - 1;

  return {
    title: docTitle,
    summary: `Extracted ${nodes.length} nodes from CSV data.`,
    nodes,
    edges
  };
}
