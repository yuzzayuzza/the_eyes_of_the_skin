/**
 * Procedural Web Audio Synthesizer for "The Eyes of the Skin"
 * Generates organic architectural acoustic responses without external audio assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isInitialized: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create synthetic reverberator (room impulse response)
      this.createSyntheticReverb();

      this.isInitialized = true;
    } catch {
      // Audio context might be blocked until gesture
    }
  }

  private createSyntheticReverb() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const rate = this.ctx.sampleRate;
      const length = rate * 2.2; // 2.2 seconds reverb decay
      const decay = 2.0;
      const impulse = this.ctx.createBuffer(2, length, rate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const n = i;
        const e = Math.exp(-n / (rate * (decay / 6)));
        left[i] = (Math.random() * 2 - 1) * e;
        right[i] = (Math.random() * 2 - 1) * e;
      }

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;

      const reverbGain = this.ctx.createGain();
      reverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.masterGain);
    } catch {
      // Ignore fallback
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.init();
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Footstep / Material Impact Sound
   */
  public playFootstep(material: 'stone' | 'wood' | 'water' | 'fabric' | 'clay' = 'stone', pan: number = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
    }

    const routeOutput = (node: AudioNode) => {
      if (panner) {
        node.connect(panner);
        panner.connect(this.masterGain!);
        if (this.reverbNode) panner.connect(this.reverbNode);
      } else {
        node.connect(this.masterGain!);
        if (this.reverbNode) node.connect(this.reverbNode);
      }
    };

    if (material === 'stone') {
      // Tok: sharp resonant strike
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(5.0, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      routeOutput(gain);

      osc.start(t);
      osc.stop(t + 0.15);

      // Noise click
      this.playTransientClick(t, 2400, 0.02, 0.3, routeOutput);

      // Distinct Stone Hall Echo reflections (深邃石室与长廊回声)
      const echoDelays = [0.13, 0.27, 0.45, 0.68];
      const echoGains = [0.48, 0.32, 0.18, 0.09];
      echoDelays.forEach((delayTime, idx) => {
        if (!this.ctx) return;
        const echoDelay = this.ctx.createDelay(1.0);
        echoDelay.delayTime.setValueAtTime(delayTime, t);

        const echoGain = this.ctx.createGain();
        echoGain.gain.setValueAtTime(0, t);
        echoGain.gain.setValueAtTime(echoGains[idx], t + delayTime);
        echoGain.gain.exponentialRampToValueAtTime(0.0001, t + delayTime + 0.24);

        const echoFilter = this.ctx.createBiquadFilter();
        echoFilter.type = 'bandpass';
        echoFilter.frequency.setValueAtTime(1200 - idx * 220, t);
        echoFilter.Q.setValueAtTime(3.5, t);

        filter.connect(echoDelay);
        echoDelay.connect(echoFilter);
        echoFilter.connect(echoGain);
        routeOutput(echoGain);
      });
    } else if (material === 'wood') {
      // Kong: deep woody hollow resonance
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(65, t + 0.22);

      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      routeOutput(gain);

      osc.start(t);
      osc.stop(t + 0.26);

      this.playTransientClick(t, 900, 0.04, 0.2, routeOutput);
    } else if (material === 'water') {
      // Plup: organic liquid droplet
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350 + Math.random() * 100, t);
      osc.frequency.exponentialRampToValueAtTime(650 + Math.random() * 80, t + 0.09);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      routeOutput(gain);

      osc.start(t);
      osc.stop(t + 0.2);
    } else if (material === 'fabric') {
      // Soft rustle
      this.playNoiseBurst(t, 450, 0.15, 0.15, routeOutput);
    } else if (material === 'clay') {
      // Mud / squelch low viscous thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      routeOutput(gain);
      osc.start(t);
      osc.stop(t + 0.22);
    }
  }

  private playTransientClick(time: number, freq: number, duration: number, gainVal: number, route: (n: AudioNode) => void) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(3, time);

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    route(gain);

    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  private playNoiseBurst(time: number, freq: number, duration: number, gainVal: number, route: (n: AudioNode) => void) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(1.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    route(gain);

    noise.start(time);
  }

  /**
   * Bronze / Metal chime for Act 4
   */
  public playBronzeChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const freqs = [440, 882, 1324, 2100];
    const amps = [0.35, 0.2, 0.12, 0.08];

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(amps[i], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + i * 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      if (this.reverbNode) gain.connect(this.reverbNode);

      osc.start(t);
      osc.stop(t + 1.8);
    });
  }

  /**
   * Ambient low space drone
   */
  public startAmbient() {
    if (this.ambientOsc1) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note sub

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // subtle binaural beat

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    } catch {
      // Handled
    }
  }

  public stopAmbient() {
    if (this.ambientOsc1) {
      try {
        this.ambientOsc1.stop();
        this.ambientOsc2?.stop();
        this.ambientOsc1.disconnect();
        this.ambientOsc2?.disconnect();
      } catch {
        // Handled
      }
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
    }
  }

  /**
   * Somatic sensory resonance for Act 7
   */
  public playSensoryResonance(type: 'retina' | 'sound' | 'skin' | 'shadow' | 'memory' | 'pulse' = 'pulse') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    let freqs: number[] = [220, 330, 440];
    let decay = 2.5;

    switch (type) {
      case 'retina':
        freqs = [880, 1320, 1760]; // Crystalline light
        decay = 2.0;
        break;
      case 'sound':
        freqs = [146.83, 220, 293.66, 440]; // Deep resonant acoustic chamber
        decay = 3.2;
        break;
      case 'skin':
        freqs = [330, 415.3, 493.88]; // Warm organic tactile
        decay = 2.2;
        break;
      case 'shadow':
        freqs = [110, 164.81, 247.5]; // Low deep penumbra
        decay = 3.5;
        break;
      case 'memory':
        freqs = [277.18, 329.63, 440, 554.37]; // Lyrical temporal
        decay = 2.8;
        break;
      case 'pulse':
      default:
        freqs = [220, 277.18, 329.63, 440, 554.37];
        decay = 3.0;
        break;
    }

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.08 / (1 + i * 0.3), t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      if (this.reverbNode) gain.connect(this.reverbNode);

      osc.start(t);
      osc.stop(t + decay + 0.1);
    });
  }

  /**
   * Final cathartic harmonic chord for Act 7
   */
  public playFinalRevelationChord() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const chords = [110, 164.81, 220, 277.18, 329.63, 440, 554.37]; // A major 9th warm acoustic
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.12 / (1 + idx * 0.2), t + 1.2 + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 6.0);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      if (this.reverbNode) gain.connect(this.reverbNode);

      osc.start(t);
      osc.stop(t + 6.5);
    });
  }
}

export const soundEngine = new SoundEngine();
