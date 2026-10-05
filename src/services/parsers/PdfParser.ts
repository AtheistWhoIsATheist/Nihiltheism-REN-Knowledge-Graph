// src/services/parsers/PdfParser.ts
import { GraphNode, GraphEdge } from '../../types/graph';
import { ParsedDocumentResult } from './MarkdownParser';

export async function parsePdf(
  fileBuffer: ArrayBuffer,
  docId: string,
  fileName: string,
  hash: string
): Promise<ParsedDocumentResult> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const now = new Date().toISOString();
  const docTitle = fileName.replace(/\.[^/.]+$/, "");
  const docNodeId = `doc_${docId}`;

  try {
    // Dynamic import to avoid SSR/bundler issues
    const pdfjsLib = await import('pdfjs-dist');
    // Set standard worker if needed
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc && typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(fileBuffer),
      useWorkerFetch: false,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let fullText = '';
    const pageTexts: { page: number; text: string }[] = [];

    for (let i = 1; i <= Math.min(numPages, 50); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageStr = textContent.items
        .map((item: unknown) => (item && typeof item === 'object' && 'str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      if (pageStr.trim()) {
        fullText += pageStr + '\n\n';
        pageTexts.push({ page: i, text: pageStr.trim() });
      }
    }

    // Root node
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
        snippet: fullText.slice(0, 150) || `PDF Document (${numPages} pages)`
      }
    });

    if (pageTexts.length === 0) {
      // Scanned or image-only PDF: obey IV8
      const noticeNodeId = `notice_${docId}`;
      nodes.push({
        id: noticeNodeId,
        label: 'Notice: Scanned Image / No Text Layer (OCR not configured)',
        level: 2,
        type: 'concept',
        parentId: docNodeId,
        isLeaf: true,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: 'Zero text items extracted from PDF stream. Visual-only pages detected.'
        }
      });
      edges.push({
        id: `edge_${docNodeId}_${noticeNodeId}`,
        source: docNodeId,
        target: noticeNodeId,
        type: 'hierarchical',
        label: 'status'
      });
      nodes[0].count = 1;

      return {
        title: docTitle,
        summary: `PDF has ${numPages} pages but no extractable text layer (scanned/image-only). Document container safely registered.`,
        nodes,
        edges
      };
    }

    // Process extracted pages
    for (const { page, text } of pageTexts) {
      const pageNodeId = `page_${docId}_${page}`;
      const pageSnippet = text.slice(0, 70);

      nodes.push({
        id: pageNodeId,
        label: `Page ${page}: ${pageSnippet}...`,
        level: 2,
        type: 'theme',
        parentId: docNodeId,
        isLeaf: false,
        provenance: {
          documentId: docId,
          sourceFile: fileName,
          fileHash: hash,
          extractedAt: now,
          snippet: text.slice(0, 200)
        }
      });

      edges.push({
        id: `edge_${docNodeId}_${pageNodeId}`,
        source: docNodeId,
        target: pageNodeId,
        type: 'hierarchical',
        label: 'page'
      });

      // Extract notable phrases / terms
      const keyPhrases = text.split(/[.;]\s+/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 90).slice(0, 2);
      let sIdx = 0;
      for (const phrase of keyPhrases) {
        sIdx++;
        const itemNodeId = `pitem_${docId}_${page}_${sIdx}`;
        nodes.push({
          id: itemNodeId,
          label: phrase,
          level: 3,
          type: 'concept',
          parentId: pageNodeId,
          isLeaf: true,
          provenance: {
            documentId: docId,
            sourceFile: fileName,
            fileHash: hash,
            extractedAt: now,
            snippet: phrase
          }
        });
        edges.push({
          id: `edge_${pageNodeId}_${itemNodeId}`,
          source: pageNodeId,
          target: itemNodeId,
          type: 'semantic',
          label: 'statement'
        });
      }
    }

    nodes[0].count = nodes.length - 1;

    return {
      title: docTitle,
      summary: `Extracted ${nodes.length} nodes from ${numPages} PDF pages.`,
      nodes,
      edges
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('password') || errorMsg.includes('encrypted')) {
      throw new Error(`Encrypted PDF: File is password-protected or encrypted. Ingestion rejected safely.`);
    }
    throw new Error(`PDF Parsing failed: ${errorMsg}`);
  }
}
