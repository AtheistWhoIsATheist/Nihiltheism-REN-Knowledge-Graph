// src/components/HypermapView.tsx
import React, { useMemo } from 'react';
import { GraphNode } from '../types/graph';

interface HypermapViewProps {
  nodes: GraphNode[];
  searchQuery: string;
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId: string | null;
}

interface TreeNode extends GraphNode {
  children: TreeNode[];
}

export const HypermapView: React.FC<HypermapViewProps> = ({
  nodes,
  searchQuery,
  onSelectNode,
  selectedNodeId
}) => {
  // Build nested tree structure
  const treeData = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    nodes.forEach(n => {
      nodeMap.set(n.id, { ...n, children: [] });
    });

    const roots: TreeNode[] = [];
    nodeMap.forEach(item => {
      if (item.parentId && nodeMap.has(item.parentId)) {
        nodeMap.get(item.parentId)!.children.push(item);
      } else {
        roots.push(item);
      }
    });

    return roots;
  }, [nodes]);

  const query = searchQuery.trim().toLowerCase();

  const handleSetAll = (open: boolean) => {
    const container = document.getElementById('hypermap-container');
    if (container) {
      container.querySelectorAll('details').forEach(d => {
        d.open = open;
      });
    }
  };

  const renderNode = (node: TreeNode) => {
    const isMatch = query && node.label.toLowerCase().includes(query);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children.length > 0;
    const isLeaf = node.isLeaf || !hasChildren;

    // Summary background styles based on level
    const levelClass =
      node.level === 0 ? 'bg-gradient-to-r from-[#191959] to-[#2c2ca0] border-white/30 text-base font-medium' :
      node.level === 1 ? 'bg-gradient-to-r from-[#1c1c69] to-[#151542] border-indigo-400/20 text-sm font-medium' :
      node.level === 2 ? 'bg-gradient-to-r from-[#20205e] to-[#14142d] border-indigo-400/20 text-sm' :
      node.level === 3 ? 'bg-gradient-to-r from-[#1b1b4b] to-[#121224] border-indigo-400/20 text-xs' :
      'bg-gradient-to-r from-[#17173a] to-[#11111d] border-indigo-400/20 text-xs';

    if (isLeaf) {
      return (
        <div
          key={node.id}
          onClick={() => onSelectNode(node)}
          className={`relative my-1.5 ml-6 py-2 px-3.5 rounded-xl border border-indigo-400/20 bg-[#161626]/90 text-indigo-100 hover:border-indigo-400/60 cursor-pointer transition shadow-md flex items-center justify-between gap-2 ${
            isSelected ? 'ring-2 ring-[#fff0a8] border-[#fff0a8]' : ''
          }`}
        >
          <span className={`break-words ${isMatch ? 'bg-[#fff0a8] text-[#151515] px-1 rounded' : ''}`}>
            {node.label}
          </span>
          {node.type === 'document' && (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              DOC
            </span>
          )}
          {node.provenance?.documentId && (
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
              INGESTED
            </span>
          )}
        </div>
      );
    }

    return (
      <details
        key={node.id}
        open={node.level <= 1 || Boolean(isMatch)}
        className="relative my-1.5 ml-3 pl-3 border-l-2 border-indigo-500/40 group"
      >
        <summary
          onClick={e => {
            // If clicking the text, select node
            if ((e.target as HTMLElement).tagName !== 'SUMMARY') {
              onSelectNode(node);
            }
          }}
          className={`list-none rounded-xl p-2.5 shadow-lg border cursor-pointer flex items-center gap-3 transition hover:brightness-110 ${levelClass} ${
            isSelected ? 'ring-2 ring-[#fff0a8] border-[#fff0a8]' : ''
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-indigo-300/20 text-indigo-200 text-xs font-bold inline-flex items-center justify-center shrink-0 group-open:rotate-90 transition-transform">
            ›
          </span>
          <span className={`break-words ${isMatch ? 'bg-[#fff0a8] text-[#151515] px-1 rounded' : ''}`}>
            {node.label}
          </span>
          {node.type === 'document' && (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 ml-auto mr-2">
              DOCUMENT
            </span>
          )}
          {node.count !== undefined && node.count > 0 && (
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full text-indigo-200 shrink-0">
              {node.count}
            </span>
          )}
        </summary>
        <div className="ml-1 pl-1 mt-1 space-y-1">
          {node.children.map(child => renderNode(child))}
        </div>
      </details>
    );
  };

  return (
    <div id="hypermap-container" className="w-full h-full overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
        <div className="text-xs text-indigo-300">
          Showing {nodes.length} nodes across {treeData.length} root branches
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSetAll(true)}
            className="px-3 py-1 rounded-full text-xs bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-400/30 text-indigo-200 transition"
          >
            Expand all
          </button>
          <button
            onClick={() => handleSetAll(false)}
            className="px-3 py-1 rounded-full text-xs bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-400/30 text-indigo-200 transition"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {treeData.map(root => renderNode(root))}
      </div>
    </div>
  );
};
