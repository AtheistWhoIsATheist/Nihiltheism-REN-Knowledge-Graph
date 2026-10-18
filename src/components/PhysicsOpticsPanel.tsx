// src/components/PhysicsOpticsPanel.tsx
import React from 'react';

export interface PhysicsConfig {
  gravity: number;        // 0.01 - 0.40, default 0.08
  repulsion: number;      // -600 - -15, default -120
  linkDistance: number;   // 20 - 350, default 90
  collisionRadius: number;// 0 - 50, default 12
  isFrozen: boolean;      // default false
}

export interface OpticsConfig {
  nodeSize: number;       // 0.3 - 3.0, default 1.0
  lineThickness: number;  // 0.2 - 4.0, default 1.0
  lineOpacity: number;    // 0.05 - 1.00, default 0.35
  labelMode: 'auto' | 'always' | 'focused'; // default 'auto'
  labelSize: number;      // 0.7 - 1.8, default 1.0
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 0.08,
  repulsion: -120,
  linkDistance: 90,
  collisionRadius: 12,
  isFrozen: false
};

export const DEFAULT_OPTICS_CONFIG: OpticsConfig = {
  nodeSize: 1.0,
  lineThickness: 1.0,
  lineOpacity: 0.35,
  labelMode: 'auto',
  labelSize: 1.0
};

interface PhysicsOpticsPanelProps {
  physics: PhysicsConfig;
  optics: OpticsConfig;
  onUpdatePhysics: (updater: (prev: PhysicsConfig) => PhysicsConfig) => void;
  onUpdateOptics: (updater: (prev: OpticsConfig) => OpticsConfig) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const PhysicsOpticsPanel: React.FC<PhysicsOpticsPanelProps> = ({
  physics,
  optics,
  onUpdatePhysics,
  onUpdateOptics,
  onResetDefaults,
  onClose
}) => {
  return (
    <div
      className="w-80 bg-[#181c22]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl text-xs text-slate-200 space-y-4 select-none z-30 animate-in fade-in zoom-in-95 duration-150"
      role="region"
      aria-label="Physics and Optics Control Deck"
    >
      {/* Header with Title, Reset, and Close */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-100 text-sm">
          <span className="text-amber-400">⚙️</span>
          <span>Physics & Optics Deck</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetDefaults}
            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium bg-[#242a33]/90 hover:bg-[#2e3642] text-amber-300 border border-amber-400/30 transition shadow-sm"
            title="Reset all physics & visual parameters to baseline defaults"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* SECTION 1: PHYSICS SIMULATION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Physics Simulation
          </span>
          <button
            onClick={() =>
              onUpdatePhysics(prev => ({ ...prev, isFrozen: !prev.isFrozen }))
            }
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition flex items-center gap-1 border shadow-sm ${
              physics.isFrozen
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
            }`}
            title="Toggle simulation pause or wake"
          >
            <span>{physics.isFrozen ? '▶ Wake' : '⏸ Freeze'}</span>
          </button>
        </div>

        {/* Node Gravity */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Node Gravity (Central Pull)</span>
            <span className="font-mono text-teal-300">{physics.gravity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.40"
            step="0.01"
            value={physics.gravity}
            onChange={e => {
              const val = parseFloat(e.target.value);
              onUpdatePhysics(prev => ({ ...prev, gravity: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Node Repulsion (Charge) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Node Repulsion (Charge)</span>
            <span className="font-mono text-teal-300">{physics.repulsion}</span>
          </div>
          <input
            type="range"
            min="-600"
            max="-15"
            step="5"
            value={physics.repulsion}
            onChange={e => {
              const val = parseInt(e.target.value, 10);
              onUpdatePhysics(prev => ({ ...prev, repulsion: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Line / Link Distance */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Line / Link Distance</span>
            <span className="font-mono text-teal-300">{physics.linkDistance}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="350"
            step="5"
            value={physics.linkDistance}
            onChange={e => {
              const val = parseInt(e.target.value, 10);
              onUpdatePhysics(prev => ({ ...prev, linkDistance: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Node Spacing (Collision) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Node Spacing (Collision)</span>
            <span className="font-mono text-teal-300">{physics.collisionRadius}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={physics.collisionRadius}
            onChange={e => {
              const val = parseInt(e.target.value, 10);
              onUpdatePhysics(prev => ({ ...prev, collisionRadius: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>
      </div>

      {/* SECTION 2: VISUAL OPTICS (INSTANT 60 FPS CANVAS REDRAW) */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Visual Optics (Instant 60 FPS)
        </span>

        {/* Node Size */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Node Orb Size</span>
            <span className="font-mono text-sky-300">{optics.nodeSize.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="3.0"
            step="0.1"
            value={optics.nodeSize}
            onChange={e => {
              const val = parseFloat(e.target.value);
              onUpdateOptics(prev => ({ ...prev, nodeSize: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Line Thickness */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Line Thickness</span>
            <span className="font-mono text-sky-300">{optics.lineThickness.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="4.0"
            step="0.1"
            value={optics.lineThickness}
            onChange={e => {
              const val = parseFloat(e.target.value);
              onUpdateOptics(prev => ({ ...prev, lineThickness: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Line Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Line Opacity</span>
            <span className="font-mono text-sky-300">{Math.round(optics.lineOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.00"
            step="0.05"
            value={optics.lineOpacity}
            onChange={e => {
              const val = parseFloat(e.target.value);
              onUpdateOptics(prev => ({ ...prev, lineOpacity: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Label Visibility Mode */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Label Visibility Mode</span>
          </div>
          <div className="flex rounded-xl bg-[#14181d]/90 p-0.5 border border-white/10 text-[10px]">
            {(
              [
                { id: 'auto', label: 'Auto LOD' },
                { id: 'always', label: 'Always On' },
                { id: 'focused', label: 'Focused Only' }
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                onClick={() => onUpdateOptics(prev => ({ ...prev, labelMode: opt.id }))}
                className={`flex-1 py-1 rounded-lg font-medium transition text-center ${
                  optics.labelMode === opt.id
                    ? 'bg-gradient-to-b from-[#3a4250] to-[#282e38] text-white border border-slate-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.4)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Label Size */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Label Text Size</span>
            <span className="font-mono text-sky-300">{optics.labelSize.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.8"
            step="0.1"
            value={optics.labelSize}
            onChange={e => {
              const val = parseFloat(e.target.value);
              onUpdateOptics(prev => ({ ...prev, labelSize: val }));
            }}
            className="w-full h-1.5 bg-[#14181d] rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>
      </div>
    </div>
  );
};
