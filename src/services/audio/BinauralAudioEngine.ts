// src/services/audio/BinauralAudioEngine.ts
/**
 * Binaural Resonance Audio Engine for the Nihiltheism REN Knowledge System (NKS)
 * Generates subtle dual-channel sine carrier waves with Delta-Theta beat frequency offsets
 * proportional to active thermal heat levels of selected hot-spot nodes.
 */

export interface BinauralAudioState {
  isActive: boolean;
  isMuted: boolean;
  volume: number; // 0.0 to 1.0 (internal master gain is scaled 0.0 to 0.30 for subtlety)
  carrierFrequency: number; // Hz (108.0 Hz to 216.0 Hz)
  beatFrequency: number; // Hz (1.5 Hz to 6.0 Hz)
  brainwaveBand: 'Delta' | 'Theta';
  activeNodeLabel: string | null;
  heatScore: number;
}

export class BinauralAudioEngine {
  private ctx: AudioContext | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private pannerLeft: StereoPannerNode | null = null;
  private pannerRight: StereoPannerNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;

  private state: BinauralAudioState = {
    isActive: false,
    isMuted: false,
    volume: 0.15,
    carrierFrequency: 108.0,
    beatFrequency: 1.5,
    brainwaveBand: 'Delta',
    activeNodeLabel: null,
    heatScore: 0.05
  };

  private listeners: Array<(state: BinauralAudioState) => void> = [];

  constructor() {
    // Lazy initialization on explicit user gesture
  }

  /**
   * Calculates carrier and beat frequencies from a thermal heat score H in [0.0, 1.0]
   * Mathematical mapping:
   * Carrier: 108 Hz + (H * 108 Hz) => [108.0 Hz, 216.0 Hz]
   * Beat Offset: 1.5 Hz + (H^2 * 4.5 Hz) => [1.5 Hz (Delta), 6.0 Hz (Theta)]
   */
  public static calculateFrequencies(heatScore: number): {
    carrier: number;
    beat: number;
    band: 'Delta' | 'Theta';
  } {
    const clampedH = Math.max(0.0, Math.min(1.0, heatScore));
    const carrier = Math.round((108.0 + clampedH * 108.0) * 10) / 10;
    const beat = Math.round((1.5 + Math.pow(clampedH, 1.8) * 4.5) * 10) / 10;
    const band: 'Delta' | 'Theta' = beat < 4.0 ? 'Delta' : 'Theta';
    return { carrier, beat, band };
  }

  /**
   * Initializes Web Audio Context on explicit user interaction
   */
  public async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (!this.oscLeft || !this.oscRight) {
      this.buildAudioGraph();
    }

    this.state.isActive = true;
    this.updateGain();
    this.notify();
  }

  /**
   * Constructs the dual-channel binaural signal chain:
   * Left Osc (f - Δf/2)  -> Left Panner (-1.0)  -\
   *                                                -> Lowpass (380 Hz) -> Gain -> Destination
   * Right Osc (f + Δf/2) -> Right Panner (+1.0) -/
   */
  private buildAudioGraph(): void {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Filter to maintain warm, non-fatiguing velvet bed
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(380, t);
    this.filter.Q.setValueAtTime(1.0, t);

    // Master Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.0001, t); // Start silent for smooth attack

    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    // Left Channel (f - beat/2)
    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = 'sine';
    const leftFreq = this.state.carrierFrequency - this.state.beatFrequency / 2;
    this.oscLeft.frequency.setValueAtTime(leftFreq, t);

    if (this.ctx.createStereoPanner) {
      this.pannerLeft = this.ctx.createStereoPanner();
      this.pannerLeft.pan.setValueAtTime(-1.0, t);
      this.oscLeft.connect(this.pannerLeft);
      this.pannerLeft.connect(this.filter);
    } else {
      // Fallback for older browsers without StereoPanner
      this.oscLeft.connect(this.filter);
    }

    // Right Channel (f + beat/2)
    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = 'sine';
    const rightFreq = this.state.carrierFrequency + this.state.beatFrequency / 2;
    this.oscRight.frequency.setValueAtTime(rightFreq, t);

    if (this.ctx.createStereoPanner) {
      this.pannerRight = this.ctx.createStereoPanner();
      this.pannerRight.pan.setValueAtTime(1.0, t);
      this.oscRight.connect(this.pannerRight);
      this.pannerRight.connect(this.filter);
    } else {
      this.oscRight.connect(this.filter);
    }

    this.oscLeft.start();
    this.oscRight.start();
  }

  /**
   * Smoothly glides carrier and beat frequencies to match target node heat score
   */
  public setThermalFrequency(heatScore: number, nodeLabel: string | null = null, duration = 1.2): void {
    const { carrier, beat, band } = BinauralAudioEngine.calculateFrequencies(heatScore);

    this.state.carrierFrequency = carrier;
    this.state.beatFrequency = beat;
    this.state.brainwaveBand = band;
    this.state.heatScore = heatScore;
    if (nodeLabel !== null) {
      this.state.activeNodeLabel = nodeLabel;
    }

    if (this.ctx && this.oscLeft && this.oscRight && this.state.isActive) {
      const t = this.ctx.currentTime;
      const leftTarget = Math.max(20, carrier - beat / 2);
      const rightTarget = Math.max(20, carrier + beat / 2);

      // Smooth glide to eliminate clicks
      this.oscLeft.frequency.cancelScheduledValues(t);
      this.oscRight.frequency.cancelScheduledValues(t);

      this.oscLeft.frequency.setValueAtTime(this.oscLeft.frequency.value, t);
      this.oscRight.frequency.setValueAtTime(this.oscRight.frequency.value, t);

      this.oscLeft.frequency.exponentialRampToValueAtTime(leftTarget, t + duration);
      this.oscRight.frequency.exponentialRampToValueAtTime(rightTarget, t + duration);
    }

    this.notify();
  }

  /**
   * Sets master volume with anti-clipping safety ceiling
   */
  public setVolume(volume: number): void {
    this.state.volume = Math.max(0.0, Math.min(1.0, volume));
    this.updateGain();
    this.notify();
  }

  /**
   * Toggles mute state
   */
  public setMute(isMuted: boolean): void {
    this.state.isMuted = isMuted;
    this.updateGain();
    this.notify();
  }

  /**
   * Toggles audio engine active/paused state
   */
  public async toggle(): Promise<boolean> {
    if (!this.state.isActive) {
      await this.init();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  /**
   * Smoothly fades out and pauses audio
   */
  public pause(): void {
    if (!this.ctx || !this.gainNode) {
      this.state.isActive = false;
      this.notify();
      return;
    }

    const t = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(t);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
    this.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.35);

    setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
      this.state.isActive = false;
      this.notify();
    }, 380);
  }

  /**
   * Internal gain manager respecting volume, mute, and safety ceiling
   */
  private updateGain(): void {
    if (!this.ctx || !this.gainNode) return;

    const t = this.ctx.currentTime;
    const targetGain = !this.state.isActive || this.state.isMuted
      ? 0.0001
      : this.state.volume * 0.28; // Scaled for gentle ambient presence

    this.gainNode.gain.cancelScheduledValues(t);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
    this.gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, targetGain), t + 0.25);
  }

  /**
   * Returns a snapshot of the current binaural audio state
   */
  public getState(): BinauralAudioState {
    return { ...this.state };
  }

  /**
   * Subscribes to audio state updates
   */
  public subscribe(listener: (state: BinauralAudioState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(currentState);
      } catch (err) {
        console.error('Audio engine listener error:', err);
      }
    }
  }

  /**
   * Complete cleanup for component unmounting
   */
  public destroy(): void {
    this.pause();
    setTimeout(() => {
      try {
        if (this.oscLeft) this.oscLeft.stop();
        if (this.oscRight) this.oscRight.stop();
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.close();
        }
      } catch (e) {
        // Ignored during teardown
      }
      this.ctx = null;
      this.oscLeft = null;
      this.oscRight = null;
      this.listeners = [];
    }, 450);
  }
}

// Global singleton instance for application session
export const binauralAudio = new BinauralAudioEngine();
