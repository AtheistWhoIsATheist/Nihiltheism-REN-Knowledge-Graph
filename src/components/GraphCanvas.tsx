// src/components/GraphCanvas.tsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3-force';
import { GraphNode, GraphEdge } from '../types/graph';
import {
  PhysicsOpticsPanel,
  PhysicsConfig,
  OpticsConfig,
  DEFAULT_PHYSICS_CONFIG,
  DEFAULT_OPTICS_CONFIG
} from './PhysicsOpticsPanel';
import {
  graphIndex,
  getNodeBaseColor,
  getThermalColor,
  SubgraphDensityMode,
  DialecticalPathResult
} from '../services/storage/GraphIndex';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchQuery: string;
  selectedCategory: string;
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId: string | null;
  densityMode?: SubgraphDensityMode;
  highlightedPath?: DialecticalPathResult | null;
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
  heatScore?: number;
  heatPhase?: string;
  heatDetails?: {
    activeSteps: string[];
    figureCount: number;
    topNexus: string;
  };
}

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string;
  source: string | SimNode;
  target: string | SimNode;
  type: string;
  dialecticalRelation?: string;
  label?: string;
}

export type OntologicalPhaseKey = 'ALL' | 'PHASE_I' | 'PHASE_II' | 'PHASE_III' | 'PHASE_IV' | 'PHASE_V';

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  searchQuery,
  selectedCategory,
  onSelectNode,
  selectedNodeId,
  densityMode = 'core',
  highlightedPath = null
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Transform state (pan / zoom) with unrestricted macro-to-micro scale
  const transformRef = useRef({ x: 0, y: 0, k: 0.75 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef<SimNode | null>(null);
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const hasAutoFittedRef = useRef<boolean>(false);

  // Heatmap Layer State
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<OntologicalPhaseKey>('ALL');

  // Physics & Visual Optics State
  const [physicsConfig, setPhysicsConfig] = useState<PhysicsConfig>(DEFAULT_PHYSICS_CONFIG);
  const [opticsConfig, setOpticsConfig] = useState<OpticsConfig>(DEFAULT_OPTICS_CONFIG);
  const [isPhysicsPanelOpen, setIsPhysicsPanelOpen] = useState<boolean>(false);

  // D3 Force Simulation Reference
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const nodeMapRef = useRef<Map<string, SimNode>>(new Map());
  const animationFrameRef = useRef<number | null>(null);

  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [hotSpotCount, setHotSpotCount] = useState<number>(0);

  // True Bounding-Box Auto-Fit Function with Smooth Easing
  const fitGraphToViewport = useCallback((durationMs: number = 450) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width || 1000;
    const height = canvas.height || 750;
    const activeNodes = simNodesRef.current;

    if (activeNodes.length === 0) {
      transformRef.current = { x: width / 2, y: height / 2, k: 0.75 };
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < activeNodes.length; i++) {
      const n = activeNodes[i];
      const nx = n.x ?? 0;
      const ny = n.y ?? 0;
      if (nx < minX) minX = nx;
      if (nx > maxX) maxX = nx;
      if (ny < minY) minY = ny;
      if (ny > maxY) maxY = ny;
    }

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      minX = -300;
      maxX = 300;
      minY = -300;
      maxY = 300;
    }

    const graphWidth = Math.max(100, maxX - minX);
    const graphHeight = Math.max(100, maxY - minY);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const optimalK = Math.max(0.005, Math.min(2.0, 0.85 * Math.min(width / graphWidth, height / graphHeight)));
    const targetK = optimalK;
    const targetX = width / 2 - centerX * optimalK;
    const targetY = height / 2 - centerY * optimalK;

    if (durationMs <= 0) {
      transformRef.current = { x: targetX, y: targetY, k: targetK };
      return;
    }

    const startX = transformRef.current.x;
    const startY = transformRef.current.y;
    const startK = transformRef.current.k;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // easeInOutCubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      transformRef.current = {
        x: startX + (targetX - startX) * ease,
        y: startY + (targetY - startY) * ease,
        k: startK + (targetK - startK) * ease
      };

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Center viewport on highlighted dialectical path when activated
  useEffect(() => {
    if (highlightedPath && highlightedPath.pathNodes.length > 0) {
      const midNode = highlightedPath.pathNodes[Math.floor(highlightedPath.pathNodes.length / 2)];
      const simNode = nodeMapRef.current.get(midNode.id);
      if (simNode && typeof simNode.x === 'number' && typeof simNode.y === 'number') {
        const width = containerRef.current?.clientWidth || 1000;
        const height = containerRef.current?.clientHeight || 750;
        transformRef.current = {
          x: width / 2 - simNode.x * 0.85,
          y: height / 2 - simNode.y * 0.85,
          k: 0.85
        };
      }
    }
  }, [highlightedPath]);

  // Phase nexus summaries
  const phaseNexusSummary = useMemo(() => {
    const summary: Record<OntologicalPhaseKey, { nexusStep: string; title: string; count: number }> = {
      ALL: { nexusStep: 'S22 & S1', title: 'Temporal Transcendence & Axiological Void', count: 17 },
      PHASE_I: { nexusStep: 'S1', title: 'Axiological Collapse (Diagnosis)', count: 17 },
      PHASE_II: { nexusStep: 'S4', title: 'The Split Animal (Anthropology)', count: 8 },
      PHASE_III: { nexusStep: 'S9', title: 'Suppression & Distraction (Purgation)', count: 9 },
      PHASE_IV: { nexusStep: 'S15', title: 'Ego-Dissolution (Disclosure)', count: 10 },
      PHASE_V: { nexusStep: 'S22', title: 'Nothingness as Transcendence (Reconception)', count: 16 }
    };
    return summary;
  }, []);

  // Synchronize incoming nodes & edges with D3 Force Simulation
  useEffect(() => {
    const width = containerRef.current?.clientWidth || 1000;
    const height = containerRef.current?.clientHeight || 750;
    const centerX = width / 2;
    const centerY = height / 2;

    // Pre-Simulation Density Governor: Deterministically select active topology subset
    const pathNodeIds = highlightedPath?.pathNodes ? new Set(highlightedPath.pathNodes.map(n => n.id)) : null;
    const { activeNodes: filteredNodes, activeEdges: preselectedEdges } = graphIndex.getActiveSubgraph({
      densityMode,
      selectedCategory,
      searchQuery,
      selectedNodeId,
      hoveredNodeId: hoveredNodeRef.current?.id,
      pathNodeIds
    });

    const activeNodeIdSet = new Set(filteredNodes.map(n => n.id));
    const previousMap = nodeMapRef.current;
    const nextMap = new Map<string, SimNode>();
    const simNodeList: SimNode[] = [];
    let hotSpots = 0;

    for (let i = 0; i < filteredNodes.length; i++) {
      const n = filteredNodes[i];
      const prev = previousMap.get(n.id);
      const baseRadius = n.type === 'root' ? 16 : n.type === 'document' ? 13 : n.isLeaf ? 5.5 : 8.5;

      // Instant O(1) Thermal Metrics Computation from GraphIndex
      const thermal = graphIndex.getThermalMetrics(n.id, selectedPhase);
      const heatScore = thermal.heatScore;
      if (heatScore >= 0.75) {
        hotSpots++;
      }

      const displayRadius = isHeatmapActive && heatScore >= 0.75 ? baseRadius + thermal.radiusOffset : baseRadius;
      const displayColor = isHeatmapActive ? thermal.color : getNodeBaseColor(n);

      if (prev) {
        const updated: SimNode = {
          ...n,
          radius: displayRadius,
          color: displayColor,
          heatScore,
          heatPhase: thermal.heatPhase,
          heatDetails: {
            activeSteps: thermal.activeSteps,
            figureCount: thermal.figureCount,
            topNexus: thermal.topNexus
          },
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
        const angle = baseAngle + i * 0.38;
        const dist = 140 + Math.sqrt(i) * 55;

        const newNode: SimNode = {
          ...n,
          radius: displayRadius,
          color: displayColor,
          heatScore,
          heatPhase: thermal.heatPhase,
          heatDetails: {
            activeSteps: thermal.activeSteps,
            figureCount: thermal.figureCount,
            topNexus: thermal.topNexus
          },
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: 0,
          vy: 0
        };
        nextMap.set(n.id, newNode);
        simNodeList.push(newNode);
      }
    }

    setHotSpotCount(hotSpots);
    nodeMapRef.current = nextMap;
    simNodesRef.current = simNodeList;

    // Update Spatial Hash Grid for O(1) hit testing
    graphIndex.updateSpatialGrid(simNodeList);

    // Filter and sanitize links using preselectedEdges from Governor
    const simLinkList: SimLink[] = [];
    for (let i = 0; i < preselectedEdges.length; i++) {
      const e = preselectedEdges[i];
      const sId = typeof e.source === 'object' && e.source !== null ? (e.source as { id: string }).id : String(e.source);
      const tId = typeof e.target === 'object' && e.target !== null ? (e.target as { id: string }).id : String(e.target);

      if (activeNodeIdSet.has(sId) && activeNodeIdSet.has(tId)) {
        simLinkList.push({
          id: e.id,
          source: sId,
          target: tId,
          type: e.type,
          dialecticalRelation: e.dialecticalRelation,
          label: e.label
        });
      }
    }
    simLinksRef.current = simLinkList;

    // Simulation management: scale physics gracefully with live parameters
    if (!simulationRef.current) {
      const simulation = d3
        .forceSimulation<SimNode>(simNodeList)
        .force('charge', d3.forceManyBody<SimNode>().strength(physicsConfig.repulsion))
        .force(
          'link',
          d3
            .forceLink<SimNode, SimLink>(simLinkList)
            .id(d => d.id)
            .distance(physicsConfig.linkDistance)
        )
        .force(
          'collide',
          d3
            .forceCollide<SimNode>()
            .radius(d => d.radius + physicsConfig.collisionRadius)
            .iterations(1)
        )
        .force('x', d3.forceX<SimNode>(centerX).strength(physicsConfig.gravity))
        .force('y', d3.forceY<SimNode>(centerY).strength(physicsConfig.gravity))
        .velocityDecay(0.4)
        .alphaDecay(0.025);

      simulation.on('tick', () => {
        graphIndex.updateSpatialGrid(simNodesRef.current);
      });

      simulationRef.current = simulation;

      // Automatically frame and fit active graph once after initial pre-warming
      if (!hasAutoFittedRef.current) {
        hasAutoFittedRef.current = true;
        setTimeout(() => {
          fitGraphToViewport(0);
        }, 120);
      }
    } else {
      const simulation = simulationRef.current;
      simulation.nodes(simNodeList);

      const linkForce = simulation.force<d3.ForceLink<SimNode, SimLink>>('link');
      if (linkForce) {
        linkForce.links(simLinkList).distance(physicsConfig.linkDistance);
      }

      const chargeForce = simulation.force<d3.ForceManyBody<SimNode>>('charge');
      if (chargeForce) {
        chargeForce.strength(physicsConfig.repulsion);
      }

      const collideForce = simulation.force<d3.ForceCollide<SimNode>>('collide');
      if (collideForce) {
        collideForce.radius(d => d.radius + physicsConfig.collisionRadius);
      }

      const forceX = simulation.force<d3.ForceX<SimNode>>('x');
      if (forceX) {
        forceX.x(centerX).strength(physicsConfig.gravity);
      }

      const forceY = simulation.force<d3.ForceY<SimNode>>('y');
      if (forceY) {
        forceY.y(centerY).strength(physicsConfig.gravity);
      }

      if (!physicsConfig.isFrozen) {
        simulation.alpha(0.12).restart();
      }
    }
  }, [
    nodes,
    edges,
    selectedCategory,
    selectedNodeId,
    isHeatmapActive,
    selectedPhase,
    densityMode,
    highlightedPath,
    searchQuery,
    fitGraphToViewport
  ]);

  // Handle live Physics parameter adjustments
  useEffect(() => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    const width = canvasRef.current?.width || 1000;
    const height = canvasRef.current?.height || 750;
    const centerX = width / 2;
    const centerY = height / 2;

    const chargeForce = simulation.force<d3.ForceManyBody<SimNode>>('charge');
    if (chargeForce) {
      chargeForce.strength(physicsConfig.repulsion);
    }

    const linkForce = simulation.force<d3.ForceLink<SimNode, SimLink>>('link');
    if (linkForce) {
      linkForce.distance(physicsConfig.linkDistance);
    }

    const collideForce = simulation.force<d3.ForceCollide<SimNode>>('collide');
    if (collideForce) {
      collideForce.radius(d => d.radius + physicsConfig.collisionRadius);
    }

    const forceX = simulation.force<d3.ForceX<SimNode>>('x');
    if (forceX) {
      forceX.x(centerX).strength(physicsConfig.gravity);
    }

    const forceY = simulation.force<d3.ForceY<SimNode>>('y');
    if (forceY) {
      forceY.y(centerY).strength(physicsConfig.gravity);
    }

    if (physicsConfig.isFrozen) {
      simulation.stop();
    } else {
      simulation.alpha(0.35).restart();
    }
  }, [physicsConfig]);

  // High-performance Canvas Render Loop with Viewport Culling & Visual Optics
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

      // 1. Deep Anodized Gunmetal Smoky Atmosphere
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.1,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, 'rgba(32, 38, 46, 0.94)'); // Inner focal nebula (#20262e)
      bgGrad.addColorStop(1, 'rgba(18, 22, 27, 0.99)'); // Outer gunmetal slate (#12161b)
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Save canvas transform
      ctx.save();
      const { x: tx, y: ty, k } = transformRef.current;
      ctx.translate(tx, ty);
      ctx.scale(k, k);

      // Viewport Bounds in Graph Coordinates with 60px safety margin
      const margin = 60 / k;
      const xMin = -tx / k - margin;
      const yMin = -ty / k - margin;
      const xMax = (width - tx) / k + margin;
      const yMax = (height - ty) / k + margin;

      const nodeList = simNodesRef.current;
      const linkList = simLinksRef.current;
      const hoveredId = hoveredNodeRef.current?.id;

      const pathNodeSet = highlightedPath?.pathNodes ? new Set(highlightedPath.pathNodes.map(n => n.id)) : null;
      const pathEdgeSet = highlightedPath?.pathEdges ? new Set(highlightedPath.pathEdges.map(e => e.id)) : null;

      const { nodeSize, lineThickness, lineOpacity, labelMode, labelSize } = opticsConfig;

      // 2. Render Links / Edges (With Viewport Culling & Live Optics)
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

        // Viewport Culling for Edges
        const sInside = sx >= xMin && sx <= xMax && sy >= yMin && sy <= yMax;
        const tInside = txNode >= xMin && txNode <= xMax && tyNode >= yMin && tyNode <= yMax;
        if (!sInside && !tInside) continue;

        const isHovered = hoveredId && (hoveredId === sourceId || hoveredId === targetId);
        const isPathEdge =
          (pathEdgeSet && pathEdgeSet.has(link.id)) ||
          (pathNodeSet && pathNodeSet.has(sourceId) && pathNodeSet.has(targetId));

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(txNode, tyNode);

        if (isPathEdge) {
          // Dialectical Synthesis Beam (Glacier Cyan)
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.2 * lineThickness;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
        } else if (isHovered) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(229, 193, 88, 0.90)'; // Champagne Gold
          ctx.lineWidth = 1.8 * lineThickness;
        } else if (isHeatmapActive) {
          ctx.shadowBlur = 0;
          const sHeat = nodeMapRef.current.get(sourceId)?.heatScore || 0;
          const tHeat = nodeMapRef.current.get(targetId)?.heatScore || 0;
          const avgHeat = (sHeat + tHeat) / 2;

          if (avgHeat >= 0.7) {
            ctx.strokeStyle = `rgba(244, 63, 94, ${Math.min(1.0, lineOpacity * 1.3)})`;
            ctx.lineWidth = 1.4 * lineThickness;
          } else if (avgHeat >= 0.4) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${Math.min(1.0, lineOpacity * 1.1)})`;
            ctx.lineWidth = 1.0 * lineThickness;
          } else {
            ctx.strokeStyle = `rgba(148, 163, 184, ${Math.min(1.0, lineOpacity * 0.6)})`;
            ctx.lineWidth = 0.65 * lineThickness;
          }
        } else if (link.type === 'semantic') {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(45, 212, 191, ${Math.min(1.0, lineOpacity * 1.1)})`; // Silver-Teal
          ctx.lineWidth = 1.1 * lineThickness;
        } else if (link.dialecticalRelation === 'grounds' || link.dialecticalRelation === 'limits') {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1.0, lineOpacity * 1.1)})`; // Glacier Cyan
          ctx.lineWidth = 1.1 * lineThickness;
        } else {
          // Standard Smoky Translucent Silver-Slate Filaments controlled by lineOpacity slider
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(168, 179, 194, ${lineOpacity})`;
          ctx.lineWidth = 0.85 * lineThickness;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // 3. Render Nodes with Glassmorphic Orbs & Anti-Disappearance Floor
      const query = searchQuery.trim().toLowerCase();
      const matchSet = query ? new Set(graphIndex.searchNodes(query, 500)) : null;

      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const nx = node.x || 0;
        const ny = node.y || 0;

        // Viewport Culling for Nodes
        if (nx < xMin || nx > xMax || ny < yMin || ny > yMax) continue;

        const isMatch = matchSet ? matchSet.has(node.id) || node.label.toLowerCase().includes(query) : false;
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredId === node.id;
        const isPathNode = pathNodeSet ? pathNodeSet.has(node.id) : false;
        const isCanonicalHub =
          node.type === 'root' ||
          (!node.provenance?.documentId && !node.roaeProvenance) ||
          (node.level !== undefined && node.level <= 1);
        const heat = node.heatScore || 0;
        const isHotSpot = isHeatmapActive && heat >= 0.75;

        // Unrestricted Deep-Space Zoom: Enforce minimum screen-space pixel radius (Math.max(1.2 / k, nodeRadius * nodeSize))
        // This ensures nodes never vanish into sub-pixel invisibility even at ultra-wide macro zoom (k = 0.003x)
        const effectiveRadius = Math.max(1.2 / k, node.radius * nodeSize);

        // A. Atmospheric Halo on Hubs, Path, Selection, and Hotspots
        if (isPathNode) {
          ctx.beginPath();
          ctx.arc(nx, ny, effectiveRadius + 9 * nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, ny, effectiveRadius + 4 * nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(229, 193, 88, 0.55)';
          ctx.fill();
        } else if (isHotSpot) {
          ctx.beginPath();
          ctx.arc(nx, ny, effectiveRadius + 10 * nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = heat >= 0.9 ? 'rgba(255, 240, 168, 0.20)' : 'rgba(244, 63, 94, 0.18)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, ny, effectiveRadius + 5 * nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = heat >= 0.9 ? 'rgba(244, 63, 94, 0.35)' : 'rgba(245, 158, 11, 0.30)';
          ctx.fill();
        } else if (isSelected || isHovered || isMatch || isCanonicalHub) {
          const haloBoost = isSelected ? 7 : isHovered ? 6 : isMatch ? 5 : 4;
          ctx.beginPath();
          ctx.arc(nx, ny, effectiveRadius + haloBoost * nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? 'rgba(229, 193, 88, 0.28)'
            : isHovered
            ? 'rgba(56, 189, 248, 0.22)'
            : isMatch
            ? 'rgba(255, 240, 168, 0.35)'
            : 'rgba(229, 193, 88, 0.15)';
          ctx.fill();
        }

        // B. Translucent Glassmorphic Node Core (alpha 0.85)
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(nx, ny, effectiveRadius, 0, Math.PI * 2);
        ctx.fillStyle = isMatch ? '#fff0a8' : isSelected ? '#ffffff' : node.color;
        ctx.fill();
        ctx.restore();

        // C. Crisp High-Luminance Mineral Rim
        ctx.beginPath();
        ctx.arc(nx, ny, effectiveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? 'rgba(255, 240, 168, 0.98)'
          : isHotSpot
          ? heat >= 0.9
            ? 'rgba(255, 240, 168, 0.95)'
            : 'rgba(253, 164, 175, 0.95)'
          : isMatch
          ? 'rgba(255, 255, 255, 0.98)'
          : isHovered
          ? 'rgba(56, 189, 248, 0.95)'
          : isCanonicalHub
          ? 'rgba(229, 193, 88, 0.85)'
          : 'rgba(203, 213, 225, 0.65)';
        ctx.lineWidth = (isSelected ? 2.0 : 1.25) * Math.min(2.0, Math.max(0.7, nodeSize));
        ctx.stroke();

        // D. Label Rendering governed by Label Visibility Mode & Size
        const showLabel =
          labelMode === 'always'
            ? true
            : labelMode === 'focused'
            ? isSelected || isHovered || isMatch || node.type === 'root'
            : k > 0.75 ||
              isHotSpot ||
              node.type === 'root' ||
              node.type === 'document' ||
              isSelected ||
              isHovered ||
              isMatch;

        if (showLabel) {
          const baseFontSize = isHotSpot
            ? 11
            : node.type === 'root'
            ? 12
            : node.level !== undefined && node.level <= 1
            ? 11
            : 10;
          const finalFontSize = Math.round(baseFontSize * labelSize);
          ctx.font = `${
            isHotSpot || node.type === 'root'
              ? 'bold '
              : node.level !== undefined && node.level <= 1
              ? '600 '
              : ''
          }${finalFontSize}px Inter, sans-serif`;

          ctx.fillStyle = isMatch
            ? '#fff0a8'
            : isSelected
            ? '#ffffff'
            : isHotSpot
            ? '#ffe4e6'
            : isHovered
            ? '#38bdf8'
            : node.type === 'root'
            ? '#f1f5f9'
            : 'rgba(241, 245, 249, 0.92)';

          const text = node.label.length > 32 ? node.label.slice(0, 29) + '...' : node.label;
          ctx.fillText(text, nx + effectiveRadius + 6, ny + 3.5);
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
  }, [searchQuery, selectedNodeId, isHeatmapActive, selectedPhase, opticsConfig]);

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
          if (!physicsConfig.isFrozen) {
            simulationRef.current.alpha(0.12).restart();
          }
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [physicsConfig.isFrozen]);

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

  // O(1) Spatial Hash Grid Hit-testing
  const getNodeAt = useCallback(
    (gx: number, gy: number): SimNode | null => {
      const candidates = graphIndex.getCandidatesNear(gx, gy);
      const nodeMap = nodeMapRef.current;
      const k = transformRef.current.k;

      for (let i = candidates.length - 1; i >= 0; i--) {
        const node = nodeMap.get(candidates[i]);
        if (!node) continue;
        const nx = node.x || 0;
        const ny = node.y || 0;
        const dx = gx - nx;
        const dy = gy - ny;
        const effectiveRadius = Math.max(1.2 / k, node.radius * opticsConfig.nodeSize);
        const hitRadius = effectiveRadius + 8;
        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          return node;
        }
      }
      return null;
    },
    [opticsConfig.nodeSize]
  );

  // Mouse & Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
    const clickedNode = getNodeAt(gx, gy);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      clickedNode.fx = clickedNode.x;
      clickedNode.fy = clickedNode.y;
      if (simulationRef.current && !physicsConfig.isFrozen) {
        simulationRef.current.alphaTarget(0.2).restart();
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

    // O(1) Instant Hover detection via Spatial Grid
    const { x: gx, y: gy } = toGraphCoords(e.clientX, e.clientY);
    const node = getNodeAt(gx, gy);
    if (hoveredNodeRef.current !== node) {
      hoveredNodeRef.current = node;
      setHoveredNode(node);
    }
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
      if (simulationRef.current && !physicsConfig.isFrozen) {
        simulationRef.current.alphaTarget(0);
      }
    }
    isDraggingRef.current = false;
  };

  // Unrestricted Macro-to-Micro Wheel Zoom with responsive delta curve
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Wheel sensitivity matching D3 wheelDelta specification
    const delta = -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.0025);
    const zoomFactor = Math.pow(2, delta);

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { x: tx, y: ty, k: currentK } = transformRef.current;
    // Unrestricted macro-to-micro zoom extent: 0.003x to 15x
    const newK = Math.max(0.003, Math.min(15.0, currentK * zoomFactor));

    transformRef.current = {
      x: mouseX - (mouseX - tx) * (newK / currentK),
      y: mouseY - (mouseY - ty) * (newK / currentK),
      k: newK
    };
  };

  const handleZoomIn = () => {
    const width = canvasRef.current?.width || 1000;
    const height = canvasRef.current?.height || 750;
    const { x: tx, y: ty, k: currentK } = transformRef.current;
    const newK = Math.min(15.0, currentK * 1.3);
    transformRef.current = {
      x: width / 2 - (width / 2 - tx) * (newK / currentK),
      y: height / 2 - (height / 2 - ty) * (newK / currentK),
      k: newK
    };
  };

  const handleZoomOut = () => {
    const width = canvasRef.current?.width || 1000;
    const height = canvasRef.current?.height || 750;
    const { x: tx, y: ty, k: currentK } = transformRef.current;
    const newK = Math.max(0.003, currentK * 0.75);
    transformRef.current = {
      x: width / 2 - (width / 2 - tx) * (newK / currentK),
      y: height / 2 - (height / 2 - ty) * (newK / currentK),
      k: newK
    };
  };

  const handleResetDefaults = () => {
    setPhysicsConfig(DEFAULT_PHYSICS_CONFIG);
    setOpticsConfig(DEFAULT_OPTICS_CONFIG);
    fitGraphToViewport(450);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#14181d]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* TOP-RIGHT CONTROLS: [🔥 HEATMAP] AND [⚙️ PHYSICS & OPTICS] CONTROL DECK */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#1c2128]/90 backdrop-blur-2xl px-2.5 py-1.5 rounded-2xl border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.55)]">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
              isHeatmapActive
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border border-amber-400/50 shadow-amber-900/40 animate-pulse'
                : 'bg-[#242a33]/85 hover:bg-[#2e3642] text-slate-200 border border-white/10'
            }`}
            title="Toggle Thematic Step Activity Heat-Mapping Layer"
          >
            <span>🔥</span>
            <span>{isHeatmapActive ? 'Heatmap [ON]' : 'Heatmap'}</span>
          </button>

          {isHeatmapActive && (
            <span className="text-[11px] font-mono text-amber-300 pr-1 border-r border-white/10">
              {hotSpotCount} Hot
            </span>
          )}

          {/* Physics & Optics Deck Toggle */}
          <button
            onClick={() => setIsPhysicsPanelOpen(!isPhysicsPanelOpen)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow ${
              isPhysicsPanelOpen
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border border-cyan-400/50 shadow-cyan-900/40'
                : 'bg-[#242a33]/85 hover:bg-[#2e3642] text-slate-200 border border-white/10'
            }`}
            title="Toggle Physics and Optics Real-Time Control Deck"
          >
            <span>⚙️</span>
            <span>Physics & Optics</span>
          </button>
        </div>

        {/* Collapsible Physics & Visual Optics Control Panel */}
        {isPhysicsPanelOpen && (
          <PhysicsOpticsPanel
            physics={physicsConfig}
            optics={opticsConfig}
            onUpdatePhysics={setPhysicsConfig}
            onUpdateOptics={setOpticsConfig}
            onResetDefaults={handleResetDefaults}
            onClose={() => setIsPhysicsPanelOpen(false)}
          />
        )}
      </div>

      {/* TOP-LEFT HUD: HEATMAP PHASE SELECTOR & LEGEND (CLEAN & MINIMAL, NO AUDIO BLOAT) */}
      {isHeatmapActive && (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 max-w-md pointer-events-auto animate-in fade-in duration-150">
          {/* Heatmap Phase Selector Tabs */}
          <div className="bg-[#1c2128]/85 backdrop-blur-2xl p-1 rounded-xl border border-white/12 shadow-2xl flex flex-wrap gap-1 text-[11px]">
            {(['ALL', 'PHASE_I', 'PHASE_II', 'PHASE_III', 'PHASE_IV', 'PHASE_V'] as OntologicalPhaseKey[]).map(
              phaseKey => {
                const isSelected = selectedPhase === phaseKey;
                const shortNames: Record<OntologicalPhaseKey, string> = {
                  ALL: 'All Phases',
                  PHASE_I: 'Phase I',
                  PHASE_II: 'Phase II',
                  PHASE_III: 'Phase III',
                  PHASE_IV: 'Phase IV',
                  PHASE_V: 'Phase V'
                };
                return (
                  <button
                    key={phaseKey}
                    onClick={() => setSelectedPhase(phaseKey)}
                    className={`px-2 py-0.5 rounded-lg transition font-medium ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)]'
                        : 'bg-[#242a33]/60 hover:bg-[#2e3642] text-slate-300'
                    }`}
                  >
                    {shortNames[phaseKey]}
                  </button>
                );
              }
            )}
          </div>

          {/* Heatmap Legend Bar */}
          <div className="bg-[#1c2128]/85 backdrop-blur-2xl px-3 py-1.5 rounded-xl border border-white/12 shadow-2xl flex items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400 font-medium">Spectrum:</span>
            <div className="flex items-center gap-1.5 flex-1 max-w-xs">
              <span className="text-[10px] text-slate-400 font-mono">Cold</span>
              <div
                className="h-2 flex-1 rounded-full shadow-inner"
                style={{
                  background: 'linear-gradient(to right, #334155, #38bdf8, #34d399, #f59e0b, #f43f5e, #fff0a8)'
                }}
              />
              <span className="text-[10px] text-amber-300 font-mono font-bold">Hot Spot</span>
            </div>
            <div className="text-[10px] font-mono text-slate-300 hidden sm:block">
              Peak: <span className="text-amber-300 font-semibold">{phaseNexusSummary[selectedPhase].nexusStep}</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING VIEWPORT ZOOM CONTROLS (BOTTOM-RIGHT) WITH TRUE BOUNDING-BOX FIT */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-[#1c2128]/85 backdrop-blur-2xl p-1.5 rounded-xl border border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.55)] z-20">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-lg bg-[#242a33]/85 hover:bg-[#2e3642] text-slate-200 text-sm font-bold flex items-center justify-center transition border border-white/10"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-lg bg-[#242a33]/85 hover:bg-[#2e3642] text-slate-200 text-sm font-bold flex items-center justify-center transition border border-white/10"
          title="Zoom Out"
        >
          –
        </button>
        <button
          onClick={() => fitGraphToViewport(450)}
          className="w-7 h-7 rounded-lg bg-[#242a33]/85 hover:bg-[#2e3642] text-amber-300 text-xs font-semibold flex items-center justify-center transition border border-white/10"
          title="⊙ Fit Graph (True Bounding-Box Auto-Fit)"
        >
          ⊙
        </button>
      </div>

      {/* UNIFIED BOTTOM-LEFT DOCK: INSPECTION CARD OR TELEMETRY PILL */}
      {hoveredNode ? (
        <div className="absolute bottom-4 left-4 max-w-sm pointer-events-none bg-[#1c2128]/95 backdrop-blur-2xl p-3.5 rounded-xl border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_16px_36px_rgba(0,0,0,0.65)] text-xs space-y-1.5 z-20">
          <div className="font-semibold text-slate-100 flex items-center justify-between gap-2">
            <span className="truncate">{hoveredNode.label}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#242a33] text-[10px] uppercase tracking-wider text-amber-300 border border-white/10">
              {hoveredNode.type}
            </span>
          </div>

          {/* Heatmap Layer Specific Metrics */}
          {isHeatmapActive && (
            <div className="p-2 rounded-lg bg-[#14181d]/80 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <span>🔥</span>
                  <span>Heat Activity:</span>
                </span>
                <span
                  className="font-mono font-bold px-1.5 py-0.2 rounded"
                  style={{
                    backgroundColor: `${getThermalColor(hoveredNode.heatScore || 0)}25`,
                    color: getThermalColor(hoveredNode.heatScore || 0)
                  }}
                >
                  {Math.round((hoveredNode.heatScore || 0) * 100)}%
                  {(hoveredNode.heatScore || 0) >= 0.75 ? ' (HOT SPOT)' : ''}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Phase Nexus: <span className="text-slate-200">{hoveredNode.heatPhase}</span>
              </div>
              {hoveredNode.heatDetails?.activeSteps && hoveredNode.heatDetails.activeSteps.length > 0 && (
                <div className="text-[10px] text-slate-400 truncate">
                  Steps: <span className="text-amber-300 font-mono">{hoveredNode.heatDetails.activeSteps.join(', ')}</span>
                  {hoveredNode.heatDetails.figureCount > 0 && (
                    <span> • {hoveredNode.heatDetails.figureCount} thinkers</span>
                  )}
                </div>
              )}
            </div>
          )}

          {hoveredNode.stratum && (
            <div className="text-[11px] font-mono text-teal-300">
              Stratum: {hoveredNode.stratum}
            </div>
          )}
          <div className="text-slate-400">
            Level {hoveredNode.level} {hoveredNode.count ? `• ${hoveredNode.count} subtopics` : ''}
          </div>
          {hoveredNode.provenance?.sourceFile && (
            <div className="text-emerald-400 text-[11px] truncate">
              Source: {hoveredNode.provenance.sourceFile}
            </div>
          )}
        </div>
      ) : (
        /* Default Physics Telemetry Pill (Sits cleanly in bottom-left without collisions) */
        <div className="absolute bottom-4 left-4 pointer-events-none bg-[#1c2128]/85 backdrop-blur-2xl px-3 py-1.5 rounded-xl border border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.55)] text-[11px] font-mono text-slate-300 flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-100 font-semibold">
            {simNodesRef.current.length.toLocaleString()} active in physics
          </span>
          <span className="text-slate-600">•</span>
          <span className="capitalize text-amber-300 font-bold">{densityMode} governor</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-300 font-medium">60 FPS Culled</span>
          {physicsConfig.isFrozen && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-bold">⏸ Frozen</span>
            </>
          )}
          {highlightedPath && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-sky-300">⚡ Path: {highlightedPath.pathNodes.length} nodes</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
