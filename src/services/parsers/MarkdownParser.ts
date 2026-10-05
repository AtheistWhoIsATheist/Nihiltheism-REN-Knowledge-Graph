// src/services/parsers/MarkdownParser.ts
import { GraphNode, GraphEdge } from '../../types/graph';

export interface ParsedDocumentResult {
  title: string;
  summary: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function parseMarkdown(
  text: string,
  docId: string,
  fileName: string,
  hash: string
): ParsedDocumentResult {
  const lines = text.split(/\r?\n/);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const now = new Date().toISOString();

  // Root document node
  const docTitle = lines.find(l => l.startsWith('# '))?.replace(/^#\s+/, '').trim() || fileName.replace(/\.[^/.]+$/, "");
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

  let currentSectionNodeId = docNodeId;
  let sectionIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings (##, ###)
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)/);
    if (headingMatch) {
      sectionIndex++;
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      const sectionNodeId = `sec_${docId}_${sectionIndex}`;

      nodes.push({
        id: sectionNodeId,
        label: headingText,
        level: level,
        type: 'theme',
        parentId: docNodeId,
        isLeaf: false,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: trimmed
        }
      });

      edges.push({
        id: `edge_${docNodeId}_${sectionNodeId}`,
        source: docNodeId,
        target: sectionNodeId,
        type: 'hierarchical',
        label: 'section'
      });

      currentSectionNodeId = sectionNodeId;
      continue;
    }

    // Bullet points / lists
    const listMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (listMatch) {
      const itemText = listMatch[1].trim();
      if (itemText.length > 2 && itemText.length < 120) {
        sectionIndex++;
        const itemNodeId = `item_${docId}_${sectionIndex}`;
        nodes.push({
          id: itemNodeId,
          label: itemText,
          level: 4,
          type: 'concept',
          parentId: currentSectionNodeId,
          isLeaf: true,
          provenance: {
            documentId: docId,
            sourceFile: fileName,
            fileHash: hash,
            extractedAt: now,
            snippet: itemText
          }
        });

        edges.push({
          id: `edge_${currentSectionNodeId}_${itemNodeId}`,
          source: currentSectionNodeId,
          target: itemNodeId,
          type: 'hierarchical',
          label: 'concept'
        });
      }
    }

    // Quotes
    const quoteMatch = trimmed.match(/^>\s+(.+)/);
    if (quoteMatch) {
      sectionIndex++;
      const quoteText = quoteMatch[1].trim();
      const quoteNodeId = `quote_${docId}_${sectionIndex}`;
      nodes.push({
        id: quoteNodeId,
        label: quoteText.length > 80 ? quoteText.slice(0, 77) + '...' : quoteText,
        level: 5,
        type: 'quote',
        parentId: currentSectionNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: quoteText
        }
      });
      edges.push({
        id: `edge_${currentSectionNodeId}_${quoteNodeId}`,
        source: currentSectionNodeId,
        target: quoteNodeId,
        type: 'semantic',
        label: 'quoted'
      });
    }
  }

  // Update doc count
  nodes[0].count = nodes.length - 1;

  return {
    title: docTitle,
    summary: `Extracted ${nodes.length} nodes from Markdown document.`,
    nodes,
    edges
  };
}
