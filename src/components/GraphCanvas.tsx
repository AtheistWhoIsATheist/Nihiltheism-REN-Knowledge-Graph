// src/components/GraphCanvas.tsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3-force';
import { GraphNode, GraphEdge } from '../types/graph';
import { JOURNAL_FIGURES, JOURNAL_PHASES } from '../data/journal314DensificationData';
import { binauralAudio, BinauralAudioState } from '../services/audio/BinauralAudioEngine';

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

interface ThematicStepDescriptor {
  step: string;
  phaseKey: OntologicalPhaseKey;
  phaseName: string;
  title: string;
  keywords: string[];
}

export const THEMATIC_STEPS_CATALOG: ThematicStepDescriptor[] = [
  // Phase I: Diagnosis (S1 - S3)
  {
    step: 'S1',
    phaseKey: 'PHASE_I',
    phaseName: 'Phase I: Diagnosis',
    title: 'Axiological Collapse & Meaninglessness',
    keywords: ['vanity', 'absurd', 'meaningless', 'purpose', 'suicide', 'collapse', 'futile', 'worthless', 'doom']
  },
  {
    step: 'S2',
    phaseKey: 'PHASE_I',
    phaseName: 'Phase I: Diagnosis',
    title: 'Anxiety, Boredom & The Void',
    keywords: ['anxiety', 'dread', 'angst', 'boredom', 'void', 'abyss', 'nothing', 'nichts', 'horror', 'question']
  },
  {
    step: 'S3',
    phaseKey: 'PHASE_I',
    phaseName: 'Phase I: Diagnosis',
    title: 'Suspension of Epistemic Certainty',
    keywords: ['epistemic', 'doubt', 'skepticism', 'knowledge', 'ignorance', 'straw', 'unexamined', 'representation']
  },

  // Phase II: Anthropology (S4 - S6)
  {
    step: 'S4',
    phaseKey: 'PHASE_II',
    phaseName: 'Phase II: Anthropology',
    title: 'The Split Animal (Mortality vs Infinity)',
    keywords: ['mortality', 'split', 'death', 'finite', 'eternity', 'flesh', 'reed', 'creature', 'rot']
  },
  {
    step: 'S5',
    phaseKey: 'PHASE_II',
    phaseName: 'Phase II: Anthropology',
    title: 'Call to Renunciation & Contemplation',
    keywords: ['renunciation', 'contemplation', 'desire', 'monastic', 'retreat', 'detach', 'wisdom']
  },
  {
    step: 'S6',
    phaseKey: 'PHASE_II',
    phaseName: 'Phase II: Anthropology',
    title: 'Contemplative Friction & Doubt',
    keywords: ['friction', 'dark night', 'difficulty', 'struggle', 'perishing', 'agony', 'dead faith']
  },

  // Phase III: Purgation (S7 - S10)
  {
    step: 'S7',
    phaseKey: 'PHASE_III',
    phaseName: 'Phase III: Purgation',
    title: 'Inward Recollection',
    keywords: ['recollection', 'interior', 'inward', 'chamber', 'soul', 'center', 'solitude']
  },
  {
    step: 'S8',
    phaseKey: 'PHASE_III',
    phaseName: 'Phase III: Purgation',
    title: 'Sensory Mortification',
    keywords: ['sensory', 'pleasure', 'mortification', 'fasting', 'ascetic', 'weary', 'appetite']
  },
  {
    step: 'S9',
    phaseKey: 'PHASE_III',
    phaseName: 'Phase III: Purgation',
    title: 'Clearing Distraction & Psychological Suppression',
    keywords: ['distraction', 'suppression', 'anchoring', 'isolation', 'sublimation', 'subtraction', 'quiet', 'chamber']
  },
  {
    step: 'S10',
    phaseKey: 'PHASE_III',
    phaseName: 'Phase III: Purgation',
    title: 'Altered & Mystical Consciousness',
    keywords: ['reducing valve', 'psychedelic', 'consciousness', 'mind at large', 'screen', 'doors', 'perception']
  },

  // Phase IV: Disclosure (S11 - S15)
  {
    step: 'S11',
    phaseKey: 'PHASE_IV',
    phaseName: 'Phase IV: Disclosure',
    title: 'The Infinite Within',
    keywords: ['infinite within', 'spark', 'diamond', 'castle', 'ground', 'kingdom', 'interior infinity']
  },
  {
    step: 'S12',
    phaseKey: 'PHASE_IV',
    phaseName: 'Phase IV: Disclosure',
    title: 'Philosophical Despair as Catalyst',
    keywords: ['question to myself', 'despair', 'lucid', 'unyielding', 'heights', 'experiment', 'sorrow']
  },
  {
    step: 'S13',
    phaseKey: 'PHASE_IV',
    phaseName: 'Phase IV: Disclosure',
    title: 'Infinite Terror & Beauty (Divine Darkness)',
    keywords: ['terror', 'divine darkness', 'dreadful', 'unapproachable', 'sea', 'abyss', 'punishment']
  },
  {
    step: 'S14',
    phaseKey: 'PHASE_IV',
    phaseName: 'Phase IV: Disclosure',
    title: 'Surrender & Non-Possession',
    keywords: ['surrender', 'unpossessing', 'let nothing disturb', 'poverty', 'releasement', 'destiny']
  },
  {
    step: 'S15',
    phaseKey: 'PHASE_IV',
    phaseName: 'Phase IV: Disclosure',
    title: 'Ego-Dissolution & True Ground',
    keywords: ['false self', 'ego', 'dissolution', 'form is emptiness', 'tat tvam asi', 'maya', 'clear light', 'unconditioned']
  },

  // Phase V: Reconception (S16 - S22)
  {
    step: 'S16',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'God Beyond Theism (The Godhead)',
    keywords: ['rid me of god', 'god above god', 'beyond theism', 'theologian of cross', 'ground of being']
  },
  {
    step: 'S17',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Divine Absence as Dark Presence',
    keywords: ['dark night of nothingness', 'absence', 'bolted door', 'abandonment', 'night', 'cold']
  },
  {
    step: 'S18',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Linguistic Collapse & Ineffability',
    keywords: ['neti neti', 'straw', 'cannot be told', 'unspoken', 'beyond mind', 'unknown']
  },
  {
    step: 'S19',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Sacred Silence',
    keywords: ['silence', 'first language', 'unreasonable silence', 'still', 'quietude']
  },
  {
    step: 'S20',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Symbolic Practice & Kenosis',
    keywords: ['symbolic', 'kenosis', 'emptying', 'subtraction', 'ground']
  },
  {
    step: 'S21',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Metanoia & Transformed Vision',
    keywords: ['attitude', 'transformation', 'metanoia', 'renewal', 'revaluation']
  },
  {
    step: 'S22',
    phaseKey: 'PHASE_V',
    phaseName: 'Phase V: Reconception',
    title: 'Nothingness as Temporal Transcendence',
    keywords: ['nothing is means', 'das nichts', 'point of nothingness', 'empty hub', 'unconditioned', 'nirvana', 'sunyata']
  }
];

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

  // Heatmap Layer State
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<OntologicalPhaseKey>('ALL');

  // Binaural Audio State
  const [audioState, setAudioState] = useState<BinauralAudioState>(() => binauralAudio.getState());

  // D3 Force Simulation Reference
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const nodeMapRef = useRef<Map<string, SimNode>>(new Map());
  const animationFrameRef = useRef<number | null>(null);

  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);

  // Subscribe to audio engine state changes
  useEffect(() => {
    const unsubscribe = binauralAudio.subscribe(setAudioState);
    return () => {
      unsubscribe();
    };
  }, []);

  // Update audio frequency when a node is selected or deselected
  useEffect(() => {
    if (selectedNodeId) {
      const selected = nodeMapRef.current.get(selectedNodeId);
      if (selected) {
        binauralAudio.setThermalFrequency(selected.heatScore || 0.05, selected.label);
      }
    } else {
      // Return to baseline grounding frequency
      binauralAudio.setThermalFrequency(0.05, 'Baseline Ground');
    }
  }, [selectedNodeId]);

  // Index figure step activity counts across all 52 thinkers
  const stepFigureIntersectionMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const fig of JOURNAL_FIGURES) {
      for (const step of fig.stepsActivated) {
        const list = map.get(step) || [];
        list.push(fig.name);
        map.set(step, list);
      }
    }
    return map;
  }, []);

  // Compute highest intersection steps for each phase
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

  // Thermal Color Mapper based on Activity Heat Score (0.0 to 1.0)
  const getThermalColor = (score: number): string => {
    if (score >= 0.90) return '#fff0a8'; // Supernova Hot Gold / White
    if (score >= 0.75) return '#f43f5e'; // Radiant Crimson / Hot Coral
    if (score >= 0.55) return '#f59e0b'; // Solar Amber
    if (score >= 0.38) return '#10b981'; // Emerald Active
    if (score >= 0.20) return '#06b6d4'; // Electric Azure / Cyan
    return '#312e81'; // Deep Cosmic Indigo (Cold Baseline)
  };

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

  // Synchronize incoming nodes & edges with D3 Force Simulation and calculate Heat Scores
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

    // Precompute figure name map for rapid lookup
    const figureDataMap = new Map<string, typeof JOURNAL_FIGURES[0]>();
    for (const f of JOURNAL_FIGURES) {
      figureDataMap.set(f.name.toLowerCase(), f);
      figureDataMap.set(f.id, f);
    }

    for (let i = 0; i < filteredNodes.length; i++) {
      const n = filteredNodes[i];
      const prev = previousMap.get(n.id);
      const baseRadius = n.type === 'root' ? 16 : (n.type === 'document' ? 13 : (n.isLeaf ? 5.5 : 8.5));

      // -------------------------------------------------------------
      // THEMATIC ACTIVATION SCORE H(n) COMPUTATION
      // Formula: H(n) = min(1.0, B + (k_steps * w_s) + (I_figures * w_f))
      // -------------------------------------------------------------
      const B = n.type === 'root' ? 0.65 : 0.05; // Baseline resting temperature
      const ws = 0.12; // Heuristic weight for active thematic steps
      const wf = 0.035; // Heuristic weight for intersecting thinker citations

      let matchedSteps: string[] = [];
      let totalIntersections = 0;
      let dominantPhase = 'General Ground';

      // 1. Check if node is an ingested Journal314 Figure or Figure entity
      const lowerLabel = n.label.toLowerCase();
      let matchedFig: typeof JOURNAL_FIGURES[0] | undefined;

      for (const [figKey, figObj] of figureDataMap.entries()) {
        if (lowerLabel.includes(figKey) || n.id.includes(figObj.id)) {
          matchedFig = figObj;
          break;
        }
      }

      if (matchedFig) {
        // Scoped steps in current active phase
        const relevantSteps = matchedFig.stepsActivated.filter(st => {
          if (selectedPhase === 'ALL') return true;
          const desc = THEMATIC_STEPS_CATALOG.find(cat => cat.step === st);
          return desc?.phaseKey === selectedPhase;
        });

        matchedSteps = relevantSteps;
        dominantPhase = matchedFig.clusterName;

        for (const st of relevantSteps) {
          const intersecting = stepFigureIntersectionMap.get(st) || [];
          totalIntersections += intersecting.length;
        }
      } else {
        // 2. Canonical, conceptual, and topic nodes: match against 22 thematic steps keywords
        const nodeText = `${n.label} ${n.provenance?.snippet || ''}`.toLowerCase();

        for (const desc of THEMATIC_STEPS_CATALOG) {
          if (selectedPhase !== 'ALL' && desc.phaseKey !== selectedPhase) continue;

          for (const kw of desc.keywords) {
            if (nodeText.includes(kw)) {
              if (!matchedSteps.includes(desc.step)) {
                matchedSteps.push(desc.step);
                const inter = stepFigureIntersectionMap.get(desc.step) || [];
                totalIntersections += inter.length;
                dominantPhase = desc.phaseName;
              }
            }
          }
        }
      }

      const k_steps = matchedSteps.length;
      const I_figures = totalIntersections;

      // Deterministic calculation of H(n)
      let heatScore: number;
      if (k_steps > 0 || n.type === 'root') {
        heatScore = Math.min(1.0, B + (k_steps * ws) + (I_figures * wf));
      } else {
        heatScore = B;
      }

      const displayRadius = isHeatmapActive && heatScore >= 0.75 ? baseRadius + 2.5 : baseRadius;
      const displayColor = isHeatmapActive ? getThermalColor(heatScore) : getNodeColor(n);

      if (prev) {
        const updated: SimNode = {
          ...n,
          radius: displayRadius,
          color: displayColor,
          heatScore,
          heatPhase: dominantPhase,
          heatDetails: {
            activeSteps: matchedSteps,
            figureCount: totalIntersections,
            topNexus: matchedSteps.join(', ') || 'Baseline Topology'
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
        const angle = baseAngle + (i * 0.38);
        const dist = 140 + Math.sqrt(i) * 55;

        const newNode: SimNode = {
          ...n,
          radius: displayRadius,
          color: displayColor,
          heatScore,
          heatPhase: dominantPhase,
          heatDetails: {
            activeSteps: matchedSteps,
            figureCount: totalIntersections,
            topNexus: matchedSteps.join(', ') || 'Baseline Topology'
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

      simulation.alpha(0.15).restart();
    }
  }, [nodes, edges, selectedCategory, selectedNodeId, isHeatmapActive, selectedPhase]);

  // Canvas Render Loop with Thermal Heat-mapping Layer
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
        } else if (isHeatmapActive) {
          // Heatmap thermal edge gradient: highlights connection paths between hot nodes
          const sHeat = nodeMapRef.current.get(sourceId)?.heatScore || 0;
          const tHeat = nodeMapRef.current.get(targetId)?.heatScore || 0;
          const avgHeat = (sHeat + tHeat) / 2;

          if (avgHeat >= 0.70) {
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
            ctx.lineWidth = 1.4;
          } else if (avgHeat >= 0.40) {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
            ctx.lineWidth = 1.0;
          } else {
            ctx.strokeStyle = 'rgba(49, 46, 129, 0.25)';
            ctx.lineWidth = 0.65;
          }
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

      // 2. Render Nodes with Thermal Hot Spots & Radiance Auras
      const query = searchQuery.trim().toLowerCase();

      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const nx = node.x || 0;
        const ny = node.y || 0;
        const isMatch = query ? node.label.toLowerCase().includes(query) : false;
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const heat = node.heatScore || 0;
        const isHotSpot = isHeatmapActive && heat >= 0.75;

        // A. THERMAL HOT SPOT RADIANT AURA
        if (isHotSpot) {
          // Tier 1: Outer diffuse thermal field (radius + 12px, alpha 0.20-0.25)
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 12, 0, Math.PI * 2);
          ctx.fillStyle = heat >= 0.90 ? 'rgba(255, 240, 168, 0.25)' : 'rgba(244, 63, 94, 0.20)';
          ctx.fill();

          // Tier 2: Mid-range intense ionization ring (radius + 6px, alpha 0.35-0.40)
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = heat >= 0.90 ? 'rgba(244, 63, 94, 0.40)' : 'rgba(245, 158, 11, 0.35)';
          ctx.fill();
        } else if (isSelected || isMatch || node.type === 'root' || node.type === 'document' || node.stratum === 'L5_ONTOLOGICAL_CLAIM') {
          // Standard Cosmic Aura Glow
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

        // B. MAIN NODE CORE
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isMatch ? '#fff0a8' : (isSelected ? '#ffffff' : node.color);
        ctx.fill();

        // High-contrast border
        ctx.strokeStyle = isSelected
          ? '#fff0a8'
          : (isHotSpot
              ? (heat >= 0.90 ? '#fff0a8' : '#fda4af')
              : (isMatch ? '#ffffff' : 'rgba(195, 195, 255, 0.45)'));
        ctx.lineWidth = isSelected ? 2.5 : (isHotSpot ? 2.0 : (node.type === 'root' ? 2 : 1));
        ctx.stroke();

        // C. LABEL RENDERING
        const showLabel = k > 0.75 || isHotSpot || node.type === 'root' || node.type === 'document' || isSelected || isHovered || isMatch;
        if (showLabel) {
          ctx.font = `${isHotSpot ? 'bold 11px' : (node.type === 'root' ? 'bold 12px' : (node.level <= 1 ? '600 11px' : '10px'))} Inter, sans-serif`;
          ctx.fillStyle = isMatch
            ? '#fff0a8'
            : (isSelected
                ? '#ffffff'
                : (isHotSpot
                    ? '#ffe4e6'
                    : (node.type === 'root' ? '#e0e7ff' : 'rgba(246, 247, 255, 0.92)')));
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
  }, [searchQuery, selectedNodeId, isHeatmapActive, selectedPhase]);

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

  // Hot spot count in current view
  const currentHotSpotsCount = useMemo(() => {
    return simNodesRef.current.filter(n => (n.heatScore || 0) >= 0.75).length;
  }, [simNodesRef.current, isHeatmapActive, selectedPhase]);

  // Audio Control Handlers
  const handleToggleAudio = async () => {
    await binauralAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    binauralAudio.setVolume(newVol);
  };

  const handleToggleMute = () => {
    binauralAudio.setMute(!audioState.isMuted);
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

      {/* TOP-LEFT FLOATING CONTROLS: THEMATIC HEATMAP & BINAURAL AUDIO HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-xl">
        {/* Row 1: Primary Heatmap & Binaural Audio Master Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-[#11112a]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-indigo-500/35 shadow-2xl">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
              isHeatmapActive
                ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white border border-rose-400/50 shadow-rose-900/40 animate-pulse'
                : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30'
            }`}
            title="Toggle Thematic Step Activity Heat-Mapping Layer"
          >
            <span>🔥</span>
            <span>{isHeatmapActive ? 'Thematic Heatmap [ACTIVE]' : 'Thematic Heatmap'}</span>
          </button>

          {isHeatmapActive && (
            <div className="flex items-center gap-2 pl-2 border-l border-indigo-500/30 text-xs">
              <span className="text-[11px] font-mono text-rose-300">
                {currentHotSpotsCount} Hot Spots Detected
              </span>
            </div>
          )}

          {/* Divider between visual and acoustic HUD */}
          <div className="h-4 w-px bg-indigo-500/30 hidden sm:block" />

          {/* Binaural Audio Engine Master Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
              audioState.isActive && !audioState.isMuted
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border border-cyan-400/50 shadow-cyan-900/40 animate-pulse'
                : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30'
            }`}
            title="Toggle Subtle Binaural Resonance Audio Engine"
          >
            <span>{audioState.isActive && !audioState.isMuted ? '🔊' : '🔇'}</span>
            <span>{audioState.isActive ? 'Binaural Tone [ON]' : 'Binaural Tone'}</span>
          </button>

          {/* Volume Slider & Mute Toggle (Shown when Audio is Initialized) */}
          {audioState.isActive && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-indigo-500/30">
              <button
                onClick={handleToggleMute}
                className="text-xs text-gray-300 hover:text-white transition px-1"
                title={audioState.isMuted ? 'Unmute Tone' : 'Mute Tone'}
              >
                {audioState.isMuted ? '🔇' : '🔉'}
              </button>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={audioState.volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title={`Volume: ${Math.round(audioState.volume * 100)}%`}
              />
              <span className="text-[10px] font-mono text-cyan-300 tabular-nums w-7">
                {Math.round(audioState.volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Audio Telemetry Chip (Shown when Audio is Active) */}
        {audioState.isActive && (
          <div className="bg-[#0e0e24]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-xl flex items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-gray-300">
                Resonance: <strong className="text-cyan-300 font-mono tabular-nums">{audioState.carrierFrequency.toFixed(1)} Hz</strong> Carrier
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-amber-300 font-mono tabular-nums">
                Δ {audioState.beatFrequency.toFixed(1)} Hz ({audioState.brainwaveBand} Beat)
              </span>
            </div>
            {audioState.activeNodeLabel && (
              <span className="text-[10px] font-mono text-purple-300 truncate max-w-[180px]">
                Target: {audioState.activeNodeLabel}
              </span>
            )}
          </div>
        )}

        {/* Phase Filter Selector (Shown when Heatmap is Active) */}
        {isHeatmapActive && (
          <div className="flex flex-wrap items-center gap-1 bg-[#0e0e24]/95 backdrop-blur-md p-2 rounded-2xl border border-rose-500/30 shadow-2xl text-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 px-2">
              Ontological Phase:
            </span>
            {[
              { id: 'ALL', label: 'All 22 Steps' },
              { id: 'PHASE_I', label: 'Phase I: Diagnosis' },
              { id: 'PHASE_II', label: 'Phase II: Anthropology' },
              { id: 'PHASE_III', label: 'Phase III: Purgation' },
              { id: 'PHASE_IV', label: 'Phase IV: Disclosure' },
              { id: 'PHASE_V', label: 'Phase V: Reconception' }
            ].map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id as OntologicalPhaseKey)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  selectedPhase === phase.id
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow'
                    : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-gray-300'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        )}

        {/* Heatmap Legend Bar (Shown when Heatmap is Active) */}
        {isHeatmapActive && (
          <div className="bg-[#0e0e24]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-500/30 shadow-2xl flex items-center justify-between gap-3 text-[11px]">
            <span className="text-gray-400 font-medium">Thermal Spectrum:</span>
            <div className="flex items-center gap-1.5 flex-1 max-w-xs">
              <span className="text-[10px] text-indigo-400 font-mono">Cold</span>
              <div
                className="h-2.5 flex-1 rounded-full shadow-inner"
                style={{
                  background: 'linear-gradient(to right, #312e81, #06b6d4, #10b981, #f59e0b, #f43f5e, #fff0a8)'
                }}
              />
              <span className="text-[10px] text-amber-300 font-mono font-bold">Hot Spot</span>
            </div>
            <div className="text-[10px] font-mono text-gray-300 hidden sm:block">
              Peak: <span className="text-amber-300 font-semibold">{phaseNexusSummary[selectedPhase].nexusStep}</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Viewport Controls */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 bg-[#11112a]/85 backdrop-blur-md p-1.5 rounded-xl border border-indigo-500/30 shadow-2xl z-20">
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

      {/* Hover Tooltip with Thematic Heatmap Inspector */}
      {hoveredNode && (
        <div className="absolute bottom-5 left-5 max-w-sm pointer-events-none bg-[#11112a]/95 backdrop-blur-md p-3.5 rounded-xl border border-indigo-500/40 shadow-2xl text-xs space-y-1.5 z-20">
          <div className="font-semibold text-indigo-200 flex items-center justify-between gap-2">
            <span>{hoveredNode.label}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-[10px] uppercase tracking-wider text-indigo-300">
              {hoveredNode.type}
            </span>
          </div>

          {/* Heatmap Layer Specific Metrics */}
          {isHeatmapActive && (
            <div className="p-2 rounded-lg bg-black/50 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-300 font-semibold flex items-center gap-1">
                  <span>🔥</span>
                  <span>Thematic Heat Activity:</span>
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
              <div className="text-[10px] text-gray-400">
                Phase Nexus: <span className="text-indigo-300">{hoveredNode.heatPhase}</span>
              </div>
              {hoveredNode.heatDetails?.activeSteps && hoveredNode.heatDetails.activeSteps.length > 0 && (
                <div className="text-[10px] text-gray-400 truncate">
                  Active Steps: <span className="text-rose-300 font-mono">{hoveredNode.heatDetails.activeSteps.join(', ')}</span>
                  {hoveredNode.heatDetails.figureCount > 0 && (
                    <span> • {hoveredNode.heatDetails.figureCount} intersecting thinker citations</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Binaural Frequency Coupling Preview */}
          {audioState.isActive && (
            <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-cyan-500/20 text-[10px] text-cyan-300 flex items-center justify-between font-mono">
              <span>Binaural Coupling:</span>
              <span>
                {Math.round(108 + (hoveredNode.heatScore || 0.05) * 108)} Hz / Δ{' '}
                {(1.5 + Math.pow(hoveredNode.heatScore || 0.05, 1.8) * 4.5).toFixed(1)} Hz
              </span>
            </div>
          )}

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
