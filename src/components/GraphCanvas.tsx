// src/components/GraphCanvas.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3-force';
import { GraphNode, GraphEdge } from '../types/graph';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchQuery: string;
  selectedCategory: string;
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId: string | null;
}

export interface SimNode extends d3.SimulationNodeDatum, GraphNode {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  radius: number;
  color: string;
}

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string;
  source: string | SimNode;
  target: string | SimNode;
  type: string;
  dialecticalRelation?: string;
  label?: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  searchQuery,
  selectedCategory,
  onSelectNode,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Transform state (pan / zoom)
  const transformRef = useRef({ x: 0, y: 0, k: 0.75 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef<SimNode | null>(null);
  const hoveredNodeRef = useRef<SimNode | null>(null);

  // D3 Force Simulation Reference
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const nodeMapRef = useRef<Map<string, SimNode>>(new Map());
  const animationFrameRef = useRef<number | null>(null);

  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);

  // Category and Stratum color mapper with rich cosmic obsidian palette
  const getNodeColor = (node: GraphNode): string => {
    if (node.id === selectedNodeId) return '#fff0a8'; // Highlight color
    if (node.stratum === 'L5_ONTOLOGICAL_CLAIM') return '#f43f5e'; // Rose
    if (node.stratum === 'L2_PHENOMENOLOGICAL_STRUCTURE') return '#c084fc'; // Purple / Void
    if (node.stratum === 'L1_REPORT') return '#38bdf8'; // Sky Blue
    if (node.stratum === 'L4_CAUSAL_EXPLANATION') return '#fbbf24'; // Amber
    if (node.stratum === 'L3_INTERPRETIVE_CLASSIFICATION') return '#818cf8'; // Violet
    if (node.type === 'document') return '#10b981'; // Ingested document: Emerald
    if (node.type === 'quote') return '#f59e0b'; // Amber
    if (node.type === 'root') return '#6366f1'; // Indigo
    if (node.type === 'theme') return '#818cf8'; // Violet
    if (node.type === 'figure') return '#ec4899'; // Pink
    if (node.provenance?.documentId) return '#06b6d4'; // Ingested entity: Cyan
    if (node.roaeProvenance) return '#a855f7'; // ROAE Candidate Node
    if (node.level === 1) return '#4f46e5';
    if (node.level === 2) return '#4338ca';
    return '#2e2e78';
  };

  // Synchronize incoming nodes & edges with D3 Force Simulation
  useEffect(() => {
    const width = containerRef.current?.clientWidth || 1000;
    const height = containerRef.current?.clientHeight || 750;
    const centerX = width / 2;
    const centerY = height / 2;

    // Filter nodes by category if selected
    const filteredNodes = nodes.filter(n => {
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'DOCUMENT' && n.type !== 'document') return false;
        if (selectedCategory === 'CANONICAL' && (n.provenance?.documentId || n.roaeProvenance)) return false;
        if (selectedCategory === 'INGESTED' && !n.provenance?.documentId && n.type !== 'document') return false;
        if (selectedCategory === 'ROAE' && !n.roaeProvenance) return false;
        if (selectedCategory === 'L1_REPORT' && n.stratum !== 'L1_REPORT') return false;
        if (selectedCategory === 'L2_PHENOMENOLOGY' && n.stratum !== 'L2_PHENOMENOLOGICAL_STRUCTURE') return false;
        if (selectedCategory === 'L5_ONTOLOGY' && n.stratum !== 'L5_ONTOLOGICAL_CLAIM') return false;
      }
      return true;
    });

    const activeNodeIdSet = new Set(filteredNodes.map(n => n.id));
    const previousMap = nodeMapRef.current;
    const nextMap = new Map<string, SimNode>();
    const simNodeList: SimNode[] = [];

    for (let i = 0; i < filteredNodes.length; i++) {
      const n = filteredNodes[i];
      const prev = previousMap.get(n.id);
      const radius = n.type === 'root' ? 16 : (n.type === 'document' ? 13 : (n.isLeaf ? 5.5 : 8.5));

      if (prev) {
        const updated: SimNode = {
          ...n,
          radius,
          color: getNodeColor(n),
          x: prev.x,
          y: prev.y,
          vx: prev.vx,
          vy: prev.vy,
          fx: prev.fx,
          fy: prev.fy
        };
        nextMap.set(n.id, updated);
        simNodeList.push(updated);
      } else {
        const isTree2 = n.id.startsWith('cross-cut') || n.id.startsWith('t-');
        const baseAngle = isTree2 ? Math.PI * 1.1 : 0.1;
        const angle = baseAngle + (i * 0.38);
        const dist = 140 + Math.sqrt(i) * 55;

        const newNode: SimNode = {
          ...n,
          radius,
          color: getNodeColor(n),
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: 0,
          vy: 0
        };
        nextMap.set(n.id, newNode);
        simNodeList.push(newNode);
      }
    }

    nodeMapRef.current = nextMap;
    simNodesRef.current = simNodeList;

    // Filter and prepare links
    const simLinkList: SimLink[] = [];
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (activeNodeIdSet.has(e.source) && activeNodeIdSet.has(e.target)) {
        simLinkList.push({
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.type,
          dialecticalRelation: e.dialecticalRelation,
          label: e.label
        });
      }
    }
    simLinksRef.current = simLinkList;

    // Initialize or reconfigure D3 Force Simulation
    if (!simulationRef.current) {
      const simulation = d3.forceSimulation<SimNode>(simNodeList)
        // 1. Amplified Repulsion Invariant (Many-body force)
        .force('charge', d3.forceManyBody<SimNode>().strength(-400))
        // 2. Rigid Structural Span (Link distance)
        .force(
          'link',
          d3.forceLink<SimNode, SimLink>(simLinkList)
            .id(d => d.id)
            .distance(80)
        )
        // 3. Boundary Firewall (Custom collision force dynamically tied to node radius + buffer)
        .force(
          'collide',
          d3.forceCollide<SimNode>()
            .radius(d => d.radius + 14)
            .iterations(2)
        )
        // 4. Gravity Dampener (Central gravity force reduced to 0.05)
        .force('x', d3.forceX<SimNode>(centerX).strength(0.05))
        .force('y', d3.forceY<SimNode>(centerY).strength(0.05))
        .velocityDecay(0.35)
        .alphaDecay(0.015);

      simulationRef.current = simulation;
    } else {
      const simulation = simulationRef.current;
      simulation.nodes(simNodeList);

      const linkForce = simulation.force<d3.ForceLink<SimNode, SimLink>>('link');
      if (linkForce) {
        linkForce.links(simLinkList).distance(80);
      }

      const chargeForce = simulation.force<d3.ForceManyBody<SimNode>>('charge');
      if (chargeForce) {
        chargeForce.strength(-400);
      }

      const collideForce = simulation.force<d3.ForceCollide<SimNode>>('collide');
      if (collideForce) {
        collideForce.radius(d => d.radius + 14);
      }

      const forceX = simulation.force<d3.ForceX<SimNode>>('x');
      if (forceX) {
        forceX.x(centerX).strength(0.05);
      }

      const forceY = simulation.force<d3.ForceY<SimNode>>('y');
      if (forceY) {
        forceY.y(centerY).strength(0.05);
      }

      simulation.alpha(0.3).restart();
    }
  }, [nodes, edges, selectedCategory, selectedNodeId]);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Save canvas transform
      ctx.save();
      const { x: tx, y: ty, k } = transformRef.current;
      ctx.translate(tx, ty);
      ctx.scale(k, k);

      const nodeList = simNodesRef.current;
      const linkList = simLinksRef.current;

      // 1. Render Links / Edges
      for (let i = 0; i < linkList.length; i++) {
        const link = linkList[i];
        let sx = 0;
        let sy = 0;
        let txNode = 0;
        let tyNode = 0;
        let sourceId = '';
        let targetId = '';

        if (typeof link.source === 'object' && link.source !== null) {
          sx = link.source.x || 0;
          sy = link.source.y || 0;
          sourceId = link.source.id;
        } else {
          const sNode = nodeMapRef.current.get(link.source as string);
          if (!sNode) continue;
          sx = sNode.x || 0;
          sy = sNode.y || 0;
          sourceId = sNode.id;
        }

        if (typeof link.target === 'object' && link.target !== null) {
          txNode = link.target.x || 0;
          tyNode = link.target.y || 0;
          targetId = link.target.id;
        } else {
          const tNode = nodeMapRef.current.get(link.target as string);
          if (!tNode) continue;
          txNode = tNode.x || 0;
          tyNode = tNode.y || 0;
          targetId = tNode.id;
        }

        const isHovered = hoveredNodeRef.current && (hoveredNodeRef.current.id === sourceId || hoveredNodeRef.current.id === targetId);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(txNode, tyNode);

        if (isHovered) {
          ctx.strokeStyle = '#fff0a8';
          ctx.lineWidth = 2.0;
        } else if (link.type === 'semantic') {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
          ctx.lineWidth = 1.2;
        } else if (link.dialecticalRelation === 'grounds' || link.dialecticalRelation === 'limits') {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
          ctx.lineWidth = 0.85;
        }
        ctx.stroke();
      }

      // 2. Render Nodes
      const query = searchQuery.trim().toLowerCase();

      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const nx = node.x || 0;
        const ny = node.y || 0;
        const isMatch = query ? node.label.toLowerCase().includes(query) : false;
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeRef.current?.id === node.id;

        // Aura glow for roots, documents, ontology claims, selected, or matches
        if (isSelected || isMatch || node.type === 'root' || node.type === 'document' || node.stratum === 'L5_ONTOLOGICAL_CLAIM') {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + (isSelected ? 7 : (isMatch ? 5 : 4)), 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? 'rgba(255, 240, 168, 0.4)'
            : (isMatch
                ? 'rgba(255, 240, 168, 0.55)'
                : (node.stratum === 'L5_ONTOLOGICAL_CLAIM'
                    ? 'rgba(244, 63, 94, 0.25)'
                    : 'rgba(99, 102, 241, 0.28)'));
          ctx.fill();
        }

        // Main Node Core
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isMatch ? '#fff0a8' : (isSelected ? '#ffffff' : node.color);
        ctx.fill();

        // High-contrast border
        ctx.strokeStyle = isSelected
          ? '#fff0a8'
          : (isMatch ? '#ffffff' : 'rgba(195, 195, 255, 0.45)');
        ctx.lineWidth = isSelected ? 2.5 : (node.type === 'root' ? 2 : 1);
        ctx.stroke();

        // Label rendering
        const showLabel = k > 0.75 || node.type === 'root' || node.type === 'document' || isSelected || isHovered || isMatch;
        if (showLabel) {
          ctx.font = `${node.type === 'root' ? 'bold 12px' : (node.level <= 1 ? '600 11px' : '10px')} Inter, sans-serif`;
          ctx.fillStyle = isMatch
            ? '#fff0a8'
            : (isSelected ? '#ffffff' : (node.type === 'root' ? '#e0e7ff' : 'rgba(246, 247, 255, 0.92)'));
          const text = node.label.length > 32 ? node.label.slice(0, 29) + '...' : node.label;
          ctx.fillText(text, nx + node.radius + 6, ny + 3.5);
        }
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [searchQuery, selectedNodeId]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        if (simulationRef.current) {
          const forceX = simulationRef.current.force<d3.ForceX<SimNode>>('x');
          const forceY = simulationRef.current.force<d3.ForceY<SimNode>>('y');
          if (forceX) forceX.x(centerX);
          if (forceY) forceY.y(centerY);
          simulationRef.current.alpha(0.15).restart();
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Coordinate helper: Screen (pixel) to Graph Coordinates
  const toGraphCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const { x: tx, y: ty, k } = transformRef.current;
    return {
      x: (px - tx) / k,
      y: (py - ty) / k
    };
  }, []);

  // Find node at coordinates
  const getNodeAt = useCallback((gx: number, gy: number): SimNode | null => {
    const nodes = simNodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const nx = node.x || 0;
      const ny = node.y || 0;
      const dx = gx - nx;
      const dy = gy - ny;
      if (dx * dx + dy * dy <= (node.radius + 8) * (node.radius + 8)) {
        return node;
      }
    }
    return null;
  }, []);

  // Mouse & Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
    const clickedNode = getNodeAt(gx, gy);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      clickedNode.fx = clickedNode.x;
      clickedNode.fy = clickedNode.y;
      if (simulationRef.current) {
        simulationRef.current.alphaTarget(0.25).restart();
      }
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - transformRef.current.x, y: e.clientY - transformRef.current.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeRef.current) {
      const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
      draggedNodeRef.current.fx = gx;
      draggedNodeRef.current.fy = gy;
      return;
    }

    if (isDraggingRef.current) {
      transformRef.current.x = e.clientX - dragStartRef.current.x;
      transformRef.current.y = e.clientY - dragStartRef.current.y;
      return;
    }

    // Hover detection
    const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
    const node = getNodeAt(gx, gy);
    hoveredNodeRef.current = node;
    setHoveredNode(node);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggedNodeRef.current) {
      const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
      const clicked = getNodeAt(gx, gy);
      if (clicked) {
        onSelectNode(clicked);
      }
      draggedNodeRef.current.fx = null;
      draggedNodeRef.current.fy = null;
      draggedNodeRef.current = null;
      if (simulationRef.current) {
        simulationRef.current.alphaTarget(0);
      }
    }
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const currentK = transformRef.current.k;
    const newK = Math.max(0.12, Math.min(4.5, currentK * zoomFactor));

    // Zoom into mouse anchor position
    transformRef.current.x = mouseX - (mouseX - transformRef.current.x) * (newK / currentK);
    transformRef.current.y = mouseY - (mouseY - transformRef.current.y) * (newK / currentK);
    transformRef.current.k = newK;
  };

  // Viewport navigation controls
  const handleZoomIn = () => {
    transformRef.current.k = Math.min(4.5, transformRef.current.k * 1.25);
  };

  const handleZoomOut = () => {
    transformRef.current.k = Math.max(0.12, transformRef.current.k * 0.8);
  };

  const handleResetZoom = () => {
    transformRef.current = { x: 0, y: 0, k: 0.75 };
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#070711]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 bg-[#11112a]/85 backdrop-blur-md p-1.5 rounded-xl border border-indigo-500/30 shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-indigo-950/70 hover:bg-indigo-600/40 text-indigo-200 text-sm font-bold flex items-center justify-center transition border border-indigo-400/20"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-indigo-950/70 hover:bg-indigo-600/40 text-indigo-200 text-sm font-bold flex items-center justify-center transition border border-indigo-400/20"
          title="Zoom Out"
        >
          –
        </button>
        <button
          onClick={handleResetZoom}
          className="w-8 h-8 rounded-lg bg-indigo-950/70 hover:bg-indigo-600/40 text-indigo-200 text-xs font-semibold flex items-center justify-center transition border border-indigo-400/20"
          title="Reset View"
        >
          ⊙
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 max-w-sm pointer-events-none bg-[#11112a]/95 backdrop-blur-md p-3.5 rounded-xl border border-indigo-500/40 shadow-2xl text-xs space-y-1.5 z-10">
          <div className="font-semibold text-indigo-200 flex items-center justify-between gap-2">
            <span>{hoveredNode.label}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-[10px] uppercase tracking-wider text-indigo-300">
              {hoveredNode.type}
            </span>
          </div>
          {hoveredNode.stratum && (
            <div className="text-[11px] font-mono text-purple-300">
              Stratum: {hoveredNode.stratum}
            </div>
          )}
          <div className="text-gray-400">
            Level {hoveredNode.level} {hoveredNode.count ? `• ${hoveredNode.count} subtopics` : ''}
          </div>
          {hoveredNode.provenance?.sourceFile && (
            <div className="text-emerald-400 text-[11px] truncate">
              Source: {hoveredNode.provenance.sourceFile}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
