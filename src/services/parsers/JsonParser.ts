// src/services/parsers/JsonParser.ts
import { GraphNode, GraphEdge } from '../../types/graph';
import { ParsedDocumentResult } from './MarkdownParser';

export function parseJson(
  jsonText: string,
  docId: string,
  fileName: string,
  hash: string
): ParsedDocumentResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err: unknown) {
    throw new Error(`Malformed JSON file: ${err instanceof Error ? err.message : String(err)}`);
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
      snippet: jsonText.slice(0, 150)
    }
  });

  // Handle graph schema format if already in nodes/edges format
  if (parsed && typeof parsed === 'object' && 'nodes' in parsed && Array.isArray((parsed as { nodes: unknown }).nodes)) {
    const rawNodes = (parsed as { nodes: Array<{ id?: string; label?: string; name?: string; type?: string }> }).nodes;
    const rawEdges = Array.isArray((parsed as unknown as { edges?: unknown }).edges)
      ? (parsed as unknown as { edges: Array<{ id?: string; source?: string; target?: string; label?: string }> }).edges
      : [];

    let count = 0;
    for (const rn of rawNodes) {
      count++;
      const nodeId = `json_${docId}_${rn.id || count}`;
      const label = rn.label || rn.name || `Node ${count}`;
      nodes.push({
        id: nodeId,
        label,
        level: 2,
        type: (rn.type as GraphNode['type']) || 'concept',
        parentId: docNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: JSON.stringify(rn).slice(0, 100)
        }
      });
      edges.push({
        id: `edge_${docNodeId}_${nodeId}`,
        source: docNodeId,
        target: nodeId,
        type: 'hierarchical',
        label: 'entry'
      });
    }

    for (const re of rawEdges) {
      if (re.source && re.target) {
        edges.push({
          id: `edge_json_${docId}_${re.id || `${re.source}_${re.target}`}`,
          source: `json_${docId}_${re.source}`,
          target: `json_${docId}_${re.target}`,
          type: 'semantic',
          label: re.label || 'connected'
        });
      }
    }
  } else if (Array.isArray(parsed)) {
    // Array of objects
    parsed.slice(0, 50).forEach((item, idx) => {
      const nodeId = `json_item_${docId}_${idx + 1}`;
      const label = typeof item === 'object' && item !== null
        ? String((item as Record<string, unknown>).title || (item as Record<string, unknown>).name || (item as Record<string, unknown>).id || `Item ${idx + 1}`)
        : String(item);

      nodes.push({
        id: nodeId,
        label: label.slice(0, 70),
        level: 2,
        type: 'concept',
        parentId: docNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: JSON.stringify(item).slice(0, 120)
        }
      });
      edges.push({
        id: `edge_${docNodeId}_${nodeId}`,
        source: docNodeId,
        target: nodeId,
        type: 'hierarchical',
        label: 'record'
      });
    });
  } else if (typeof parsed === 'object' && parsed !== null) {
    // Key-value pairs
    Object.entries(parsed as Record<string, unknown>).slice(0, 40).forEach(([key, val], idx) => {
      const nodeId = `json_prop_${docId}_${idx + 1}`;
      const valStr = typeof val === 'object' ? JSON.stringify(val).slice(0, 50) : String(val);
      nodes.push({
        id: nodeId,
        label: `${key}: ${valStr}`,
        level: 2,
        type: 'concept',
        parentId: docNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: `${key} = ${valStr}`
        }
      });
      edges.push({
        id: `edge_${docNodeId}_${nodeId}`,
        source: docNodeId,
        target: nodeId,
        type: 'hierarchical',
        label: key
      });
    });
  }

  nodes[0].count = nodes.length - 1;

  return {
    title: docTitle,
    summary: `Extracted ${nodes.length} nodes from structured JSON.`,
    nodes,
    edges
  };
}
