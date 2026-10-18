// src/components/HypermapView.tsx
import React, { useMemo, useState, useCallback } from 'react';
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
  // State for expanded limits per branch for branches with large children sets
  const [expandedLimits, setExpandedLimits] = useState<Record<string, number>>({});

  // Build nested tree structure efficiently
  const treeData = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      nodeMap.set(n.id, { ...n, children: [] });
    }

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

  const handleSetAll = useCallback((open: boolean) => {
    const container = document.getElementById('hypermap-container');
    if (container) {
      container.querySelectorAll('details').forEach(d => {
        d.open = open;
      });
    }
  }, []);

  const handleShowMore = (branchId: string, currentCount: number) => {
    setExpandedLimits(prev => ({
      ...prev,
      [branchId]: currentCount + 100
    }));
  };

  const renderNode = (node: TreeNode) => {
    const isMatch = query ? node.label.toLowerCase().includes(query) : false;
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children.length > 0;
    const isLeaf = node.isLeaf || !hasChildren;

    // Summary background styles based on level in Anodized Gunmetal & Titanium
    const levelClass =
      node.level === 0 ? 'bg-gradient-to-r from-[#2f3846] to-[#222832] border-amber-400/40 text-base font-semibold text-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]' :
      node.level === 1 ? 'bg-gradient-to-r from-[#28303c] to-[#1e242d] border-white/12 text-sm font-medium text-slate-200' :
      node.level === 2 ? 'bg-gradient-to-r from-[#242b36] to-[#1a2027] border-white/10 text-sm text-slate-300' :
      node.level === 3 ? 'bg-gradient-to-r from-[#202630] to-[#171c23] border-white/8 text-xs text-slate-300' :
      'bg-gradient-to-r from-[#1c222b] to-[#14181f] border-white/6 text-xs text-slate-400';

    if (isLeaf) {
      return (
        <div
          key={node.id}
          onClick={() => onSelectNode(node)}
          className={`relative my-1.5 ml-6 py-2 px-3.5 rounded-xl border border-white/10 bg-[#1c2128]/90 text-slate-200 hover:border-sky-400/50 hover:bg-[#242a33] cursor-pointer transition shadow-md flex items-center justify-between gap-2 ${
            isSelected ? 'ring-2 ring-amber-300 border-amber-300' : ''
          }`}
        >
          <span className={`break-words ${isMatch ? 'bg-amber-300 text-slate-950 font-semibold px-1 rounded' : ''}`}>
            {node.label}
          </span>
          {node.type === 'document' && (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              DOC
            </span>
          )}
          {node.provenance?.documentId && (
            <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
              INGESTED
            </span>
          )}
        </div>
      );
    }

    // Windowing for very large child lists
    const branchLimit = expandedLimits[node.id] || 50;
    const shouldWindow = !query && node.children.length > branchLimit;
    const visibleChildren = shouldWindow ? node.children.slice(0, branchLimit) : node.children;
    const remainingCount = node.children.length - visibleChildren.length;

    return (
      <details
        key={node.id}
        open={node.level <= 1 || Boolean(isMatch)}
        className="relative my-1.5 ml-3 pl-3 border-l-2 border-slate-700/60 group"
      >
        <summary
          onClick={e => {
            if ((e.target as HTMLElement).tagName !== 'SUMMARY') {
              onSelectNode(node);
            }
          }}
          className={`list-none rounded-xl p-2.5 shadow-lg border cursor-pointer flex items-center gap-3 transition hover:brightness-110 ${levelClass} ${
            isSelected ? 'ring-2 ring-amber-300 border-amber-300' : ''
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/10 text-slate-200 text-xs font-bold inline-flex items-center justify-center shrink-0 group-open:rotate-90 transition-transform">
            ›
          </span>
          <span className={`break-words ${isMatch ? 'bg-amber-300 text-slate-950 font-semibold px-1 rounded' : ''}`}>
            {node.label}
          </span>
          {node.type === 'document' && (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 ml-auto mr-2">
              DOCUMENT
            </span>
          )}
          {node.count !== undefined && node.count > 0 && (
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 shrink-0 font-mono">
              {node.count}
            </span>
          )}
        </summary>
        <div className="ml-1 pl-1 mt-1 space-y-1">
          {visibleChildren.map(child => renderNode(child))}
          {shouldWindow && (
            <div className="pl-6 py-2">
              <button
                type="button"
                onClick={() => handleShowMore(node.id, branchLimit)}
                className="px-3 py-1 rounded-lg text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
              >
                + Show {Math.min(100, remainingCount)} more of {remainingCount} remaining...
              </button>
            </div>
          )}
        </div>
      </details>
    );
  };

  return (
    <div id="hypermap-container" className="w-full h-full overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto space-y-4 bg-[#14181d]">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="text-xs text-slate-300 font-mono">
          Showing {nodes.length.toLocaleString()} nodes across {treeData.length} root branches
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSetAll(true)}
            className="px-3 py-1 rounded-full text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
          >
            Expand all
          </button>
          <button
            onClick={() => handleSetAll(false)}
            className="px-3 py-1 rounded-full text-xs bg-[#242a33] hover:bg-[#2e3642] border border-white/10 text-slate-200 transition"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="space-y-3 pb-12">
        {treeData.map(rootNode => renderNode(rootNode))}
      </div>
    </div>
  );
};
