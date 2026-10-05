// src/services/export/GraphExport.ts
import { GraphNode, GraphEdge, IngestedDocumentRecord } from '../../types/graph';

export function exportGraphToJson(
  nodes: GraphNode[],
  edges: GraphEdge[],
  documents: IngestedDocumentRecord[]
): string {
  const payload = {
    app: "Nihiltheism REN Knowledge Graph",
    exportedAt: new Date().toISOString(),
    version: "1.0.0",
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      ingestedDocuments: documents.length
    },
    documents,
    nodes,
    edges
  };
  return JSON.stringify(payload, null, 2);
}

export function exportGraphToMarkdown(nodes: GraphNode[]): string {
  let md = "# JOURNAL314 Ω — Nihiltheism REN Knowledge Graph Export\n\n";
  md += `*Exported on: ${new Date().toLocaleString()}*\n\n`;

  // Build children index
  const childrenMap = new Map<string | null, GraphNode[]>();
  for (const node of nodes) {
    const pId = node.parentId || null;
    if (!childrenMap.has(pId)) childrenMap.set(pId, []);
    childrenMap.get(pId)!.push(node);
  }

  function renderTree(parentId: string | null, depth: number) {
    const list = childrenMap.get(parentId) || [];
    for (const item of list) {
      const indent = "  ".repeat(depth);
      const badge = item.type === 'document' ? ' 📄' : (item.type === 'quote' ? ' 💬' : '');
      md += `${indent}- **${item.label}**${badge}\n`;
      renderTree(item.id, depth + 1);
    }
  }

  renderTree(null, 0);
  return md;
}

export function exportGraphToCsv(nodes: GraphNode[], edges: GraphEdge[]): string {
  let csv = "type,id,label,level,category,parent_id,source_file\n";
  for (const n of nodes) {
    const cleanLabel = (n.label || '').replace(/"/g, '""');
    const source = n.provenance?.sourceFile || 'canonical';
    csv += `node,"${n.id}","${cleanLabel}",${n.level},"${n.type}","${n.parentId || ''}","${source}"\n`;
  }
  csv += "\nedge_id,source,target,edge_type,label\n";
  for (const e of edges) {
    csv += `"${e.id}","${e.source}","${e.target}","${e.type}","${e.label || ''}"\n`;
  }
  return csv;
}

export function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
