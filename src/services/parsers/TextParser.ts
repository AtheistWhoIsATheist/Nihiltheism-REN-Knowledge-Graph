// src/services/parsers/TextParser.ts
import { GraphNode, GraphEdge } from '../../types/graph';
import { ParsedDocumentResult } from './MarkdownParser';

export function parsePlainText(
  text: string,
  docId: string,
  fileName: string,
  hash: string
): ParsedDocumentResult {
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
      snippet: text.slice(0, 150)
    }
  });

  // Split into paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 5);

  let pIndex = 0;
  for (const para of paragraphs) {
    pIndex++;
    const pNodeId = `p_${docId}_${pIndex}`;
    // Extract first sentence as label or summary
    const firstSentence = para.split(/[.!?]\s+/)[0] || para;
    const label = firstSentence.length > 70 ? firstSentence.slice(0, 67) + '...' : firstSentence;

    nodes.push({
      id: pNodeId,
      label,
      level: 2,
      type: 'concept',
      parentId: docNodeId,
      isLeaf: false,
      provenance: {
        documentId: docId,
        sourceFile: fileName,
        fileHash: hash,
        extractedAt: now,
        snippet: para.slice(0, 200)
      }
    });

    edges.push({
      id: `edge_${docNodeId}_${pNodeId}`,
      source: docNodeId,
      target: pNodeId,
      type: 'hierarchical',
      label: 'paragraph'
    });

    // Extract named entities or keywords (capitalized words or key terms)
    const terms = Array.from(new Set(para.match(/\b[A-Z][a-z]{3,}\b/g) || [])).slice(0, 3);
    for (let tIdx = 0; tIdx < terms.length; tIdx++) {
      const term = terms[tIdx];
      const termNodeId = `term_${docId}_${pIndex}_${tIdx}`;
      nodes.push({
        id: termNodeId,
        label: term,
        level: 3,
        type: 'entity',
        parentId: pNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: `Entity in: "${label}"`
        }
      });

      edges.push({
        id: `edge_${pNodeId}_${termNodeId}`,
        source: pNodeId,
        target: termNodeId,
        type: 'semantic',
        label: 'references'
      });
    }
  }

  nodes[0].count = nodes.length - 1;

  return {
    title: docTitle,
    summary: `Extracted ${nodes.length} nodes across ${paragraphs.length} paragraphs.`,
    nodes,
    edges
  };
}
