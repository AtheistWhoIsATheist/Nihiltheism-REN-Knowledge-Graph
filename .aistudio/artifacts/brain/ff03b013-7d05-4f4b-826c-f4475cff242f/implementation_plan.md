# Binaural Resonance Audio Engine for Thematic Hot-Spot Nodes

A subtle, browser-based Web Audio engine that translates the active thermal heat scores of selected hot-spot nodes into meditative binaural resonance tones, bridging philosophical topology with acoustic immersion.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural design incorporates the three user-confirmed preferences from Phase 1:
> 1. **Frequency Spectrum**: Calibrated to the deep meditative Delta-Theta threshold ($108\text{ Hz}$ to $216\text{ Hz}$ carrier with $1.5\text{ Hz}$ to $7.0\text{ Hz}$ binaural beat offset).
> 2. **Interaction Model**: Dedicated audio HUD control panel in the top-left canvas toolbar featuring master toggle, volume slider, mute button, and active frequency telemetry.
> 3. **Synthesis Topology**: Dual pure sine wave oscillators routed through discrete stereo panners and a gentle $380\text{ Hz}$ lowpass filter, ensuring smooth $1.2\text{s}$ gain ramp transitions without acoustic clicks.

- **Confirmed Decision 1**: Carrier base frequency spans $108\text{ Hz}$ (deep ground at $H=0.0$) to $216\text{ Hz}$ (resonant upper limit at $H=1.0$), with binaural beat $\Delta f$ spanning $1.5\text{ Hz}$ (Delta) to $6.0\text{ Hz}$ (Theta).
- **Confirmed Decision 2**: Audio activates exclusively via explicit user intent (HUD toggle) to honor browser autoplay policies; once active, selecting any node smoothly glides the binaural carrier to that node's thermal temperature.
- **Confirmed Decision 3**: Master volume is capped at a gentle default (-18 dB / 0.15 gain) with exponential smoothing curves to maintain a quiet, unobtrusive ambient presence.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the Nihiltheism REN Knowledge Graph with a Web Audio API synthesizer. When a user explores the graph and selects nodes—especially high-density "hot spots" where multiple historical figures intersect on ontological phases—the engine synthesizes a gentle binaural frequency pair (Left ear = $f - \Delta f / 2$, Right ear = $f + \Delta f / 2$).
- **Target Audience & Context**: Philosophers, researchers, and contemplative users navigating complex dialectical nodes who desire an acoustic dimension to the visual thermal heat-mapping layer.
- **Key Value**: Provides immediate psychoacoustic feedback of ontological density; high-heat convergence zones (e.g., Step S22 "Nothingness as Temporal Transcendence" or Step S1 "Axiological Void") emit deeper, harmonically coherent resonant states.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Zero-State / Default**: The canvas displays graph nodes and the top-left HUD. Audio remains dormant (`AudioContext` suspended) to comply with browser autoplay restrictions.
2. **Activation**: The user clicks the `🔊 Sound [OFF]` toggle in the canvas HUD. The `AudioContext` initializes, transitioning the button to active amber/cyan with an acoustic pulse.
3. **Node Selection & Acoustic Gliding**:
   - The user selects a node (e.g., St. Augustine or Step S22 hot spot with $94\%$ heat).
   - The audio engine smoothly glides frequencies over $1.2\text{s}$ using Web Audio `exponentialRampToValueAtTime`:
     - Left Ear: $213.5\text{ Hz}$
     - Right Ear: $218.5\text{ Hz}$
     - Resultant Binaural Beat: $5.0\text{ Hz}$ (Deep Theta wave).
   - The HUD displays real-time telemetry: `108–216 Hz Carrier · 5.0 Hz Theta Beat`.
4. **Volume & Mute Adjustment**: The user fine-tunes volume via a subtle HUD slider or instantly silences audio with the mute icon.
5. **Deselection**: When no node is selected, the audio gently transitions to the baseline resting resonance ($108\text{ Hz} \pm 0.75\text{ Hz}$ Delta hum).

### Visual Identity & HUD Ergonomics
- **Placement**: Anchored in the top-left canvas control stack immediately adjacent to the `🔥 Thematic Heatmap` bar.
- **Aesthetic Tone**: Cosmic obsidian theme (`#11112a` backdrop, hairline indigo borders, amber/cyan glowing indicators).
- **Control Layout**:
  - Audio Master Button: `[🔊 Tone: ON/OFF]`
  - Volume Slider: Sleek 64px rail with percentage readout.
  - Telemetry Pill: `Carrier: 216 Hz · Beat: 5.2 Hz (Theta)`.
- **Typographic Standards**: Tabular monospace numbers (`font-mono tabular-nums text-[10px]`) for live frequency readouts to prevent layout shifting.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Audio Service vs. Inline Canvas Logic**
  - *Chosen Approach*: Implement a dedicated `BinauralAudioEngine` class in `src/services/audio/BinauralAudioEngine.ts` and connect it through React hooks in `GraphCanvas.tsx`.
  - *Why*: Separation of audio synthesis concerns from Canvas 2D render loops guarantees 60 FPS visual performance and prevents audio glitching during heavy graph pan/zoom operations.
  - *Alternatives Considered*: Direct inline oscillator management inside `GraphCanvas.tsx` was rejected due to risk of memory leaks and orphaned audio nodes on component re-renders.

- **Decision 2: Autoplay Policy Compliance**
  - *Chosen Approach*: Lazy instantiation of `AudioContext` only after a physical user click on the HUD audio button.
  - *Why*: Modern browsers reject unprompted audio initialization with console warnings; this ensures 100% reliable audio startup across Chrome, Firefox, and Safari.

- **Decision 3: Frequency Mapping Curve**
  - *Chosen Approach*: Continuous linear interpolation for carrier ($108\text{ Hz} \to 216\text{ Hz}$) and quadratic curve for binaural beat ($\Delta f = 1.5 + 4.5 \cdot H^2\text{ Hz}$).
  - *Why*: Delta frequencies ($1.5\text{ Hz}$) dominate standard and cold nodes, while hot spots accelerate into the Theta meditation band ($5\text{–}6\text{ Hz}$), providing distinct auditory differentiation.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Viewport & Canvas                          │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │   Canvas HUD Controls                                        │     │
│   │   [🔥 Thematic Heatmap]   [🔊 Binaural Tone: ON] [Vol: 15%]  │     │
│   │   Telemetry: Carrier: 216.0 Hz │ Beat: 5.2 Hz (Theta)        │     │
│   └──────────────────────┬───────────────────────────────────────┘     │
│                          │ User Toggle / Volume Change                 │
│                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │   GraphCanvas.tsx (React Controller)                         │     │
│   │   - Tracks selectedNode & heatScore H(n)                     │     │
│   │   - Calls audio.setThermalState(H(n), nodeLabel)             │     │
│   └──────────────────────┬───────────────────────────────────────┘     │
└──────────────────────────┼─────────────────────────────────────────────┘
                           │ Dispatches Parameters
                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│             BinauralAudioEngine.ts (Web Audio Service)                 │
│                                                                        │
│   ┌───────────────────┐               ┌───────────────────┐            │
│   │ Osc Left (Sine)   │               │ Osc Right (Sine)  │            │
│   │ f - Δf / 2        │               │ f + Δf / 2        │            │
│   └─────────┬─────────┘               └─────────┬─────────┘            │
│             │                                   │                      │
│             ▼                                   ▼                      │
│   ┌───────────────────┐               ┌───────────────────┐            │
│   │ StereoPannerNode  │               │ StereoPannerNode  │            │
│   │ pan: -1.0 (Left)  │               │ pan: +1.0 (Right) │            │
│   └─────────┬─────────┘               └─────────┬─────────┘            │
│             └─────────────────┬─────────────────┘                      │
│                               ▼                                        │
│                 ┌───────────────────────────┐                          │
│                 │ BiquadFilterNode (380 Hz) │                          │
│                 └─────────────┬─────────────┘                          │
│                               ▼                                        │
│                 ┌───────────────────────────┐                          │
│                 │ Master GainNode (Smooth)  │                          │
│                 └─────────────┬─────────────┘                          │
│                               ▼                                        │
│                 ┌───────────────────────────┐                          │
│                 │ AudioContext.destination  │ (Stereo Headphones/Out)  │
│                 └───────────────────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Parameter Specification

```typescript
export interface BinauralParameters {
  carrierFrequency: number; // 108.0 Hz to 216.0 Hz
  beatFrequency: number;    // 1.5 Hz to 7.0 Hz
  gain: number;             // 0.0 to 0.35 (capped for subtlety)
  isMuted: boolean;
  activeNodeLabel?: string;
  activePhase?: string;
}
```

### Component & State Mapping
1. **`src/services/audio/BinauralAudioEngine.ts`**:
   - `init()`: Starts `AudioContext`, builds dual oscillator stereo graph.
   - `setThermalFrequency(heatScore: number, smoothDuration = 1.2)`: Glides oscillators smoothly to target frequencies.
   - `setMasterVolume(volume: number)`: Updates main gain node without clipping.
   - `stop()`: Cleanly ramps gain to zero and suspends context.
2. **`src/components/GraphCanvas.tsx`**:
   - Connects audio engine lifecycle to `useEffect`.
   - Listens to `selectedNode` changes: when a node with `heatScore` is selected, updates the audio engine frequency.
   - Embeds the audio HUD in the top-left toolbar alongside the heatmap selector.
3. **Automated Verification**:
   - Update `tests/comprehensive-verification.ts` with test `AUDIO-1` verifying parameter formulas, frequency bounds ($108\text{–}216\text{ Hz}$), beat delta bounds ($1.5\text{–}7.0\text{ Hz}$), and non-blocking service creation.
