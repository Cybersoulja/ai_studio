/**
 * USS Hustle - Space Station Ambient Audio Soundscape Engine
 * Pure procedural Web Audio API synthesis - zero external audio assets required.
 * Generates an atmospheric, low-volume "space station" environment:
 * - Sub-bass reactor core hum (dual detuned sine waves creating subtle zero-g binaural pulse)
 * - Pressurized life-support air circulation (filtered pink/white noise buffer with gentle LFO)
 * - Distant orbital harmonic resonance
 */

class SpaceStationSoundscape {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | AudioBufferSourceNode)[] = [];
  private isPlaying: boolean = false;
  private volume: number = 0.15; // Low-volume ambient baseline

  private initContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Create a 2-second looped noise buffer for airflow ventilation
  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation for warm air ventilation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  public start(customVolume?: number): boolean {
    if (this.isPlaying) return true;

    const ctx = this.initContext();
    if (!ctx) return false;

    if (customVolume !== undefined) {
      this.volume = Math.max(0, Math.min(1, customVolume));
    }

    try {
      const now = ctx.currentTime;

      // Master Gain with gentle fade-in
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1.5);
      this.masterGain.connect(ctx.destination);

      // 1. SUB-BASS REACTOR HUM (Dual Detuned Oscillators at 55Hz & 57.2Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const reactorGain = ctx.createGain();
      const reactorFilter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // A1 fundamental

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(57.2, now); // 2.2Hz binaural beating pulse

      reactorFilter.type = 'lowpass';
      reactorFilter.frequency.setValueAtTime(140, now);

      reactorGain.gain.setValueAtTime(0.65, now);

      osc1.connect(reactorFilter);
      osc2.connect(reactorFilter);
      reactorFilter.connect(reactorGain);
      reactorGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);

      this.nodes.push(osc1, osc2, reactorFilter, reactorGain);

      // 2. LIFE-SUPPORT AIR CIRCULATION & CABIN VENTILATION
      const noiseBuffer = this.createNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.setValueAtTime(320, now);
      airFilter.Q.setValueAtTime(1.8, now);

      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.35, now);

      // Airflow LFO for rhythmic slow breathing/pressurization
      const airLfo = ctx.createOscillator();
      const airLfoGain = ctx.createGain();
      airLfo.frequency.setValueAtTime(0.08, now); // ~12.5s cycle
      airLfoGain.gain.setValueAtTime(0.12, now);

      airLfo.connect(airLfoGain);
      airLfoGain.connect(airGain.gain);

      noiseSource.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(this.masterGain);

      airLfo.start(now);
      noiseSource.start(now);

      this.nodes.push(noiseSource, airFilter, airGain, airLfo, airLfoGain);

      // 3. DISTANT ORBITAL HARMONIC RESONANCE (Subtle cosmic overtone at 220Hz & 440Hz)
      const harmonicOsc = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      const harmonicFilter = ctx.createBiquadFilter();

      harmonicOsc.type = 'triangle';
      harmonicOsc.frequency.setValueAtTime(220, now);

      harmonicFilter.type = 'lowpass';
      harmonicFilter.frequency.setValueAtTime(280, now);

      harmonicGain.gain.setValueAtTime(0.08, now);

      harmonicOsc.connect(harmonicFilter);
      harmonicFilter.connect(harmonicGain);
      harmonicGain.connect(this.masterGain);

      harmonicOsc.start(now);

      this.nodes.push(harmonicOsc, harmonicFilter, harmonicGain);

      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn('Failed to start space station soundscape:', err);
      this.isPlaying = false;
      return false;
    }
  }

  public stop(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) {
      this.isPlaying = false;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      // Fade out to prevent clicks
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        this.nodes.forEach((node) => {
          try {
            if ('stop' in node && typeof (node as any).stop === 'function') {
              (node as any).stop();
            }
            node.disconnect();
          } catch {}
        });
        this.nodes = [];
        this.isPlaying = false;
      }, 850);
    } catch {
      this.isPlaying = false;
      this.nodes = [];
    }
  }

  public setVolume(newVolume: number): void {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const spaceStationAudio = new SpaceStationSoundscape();
