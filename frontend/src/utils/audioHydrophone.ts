// Subtle, high-fashion oceanic hydrophone ambience synthesizer

class HydrophoneEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private subOsc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3.0);
      this.masterGain.connect(this.ctx.destination);

      // Deep harmonic fundamental (54 Hz deep oceanic frequency)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(54, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.45;
      this.subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      this.subOsc.start();

      // Subtle warm fifth harmonic (81 Hz) with subtle slow detune
      this.subOsc2 = this.ctx.createOscillator();
      this.subOsc2.type = 'sine';
      this.subOsc2.frequency.setValueAtTime(81.2, this.ctx.currentTime);

      const subGain2 = this.ctx.createGain();
      subGain2.gain.value = 0.25;
      this.subOsc2.connect(subGain2);
      subGain2.connect(this.masterGain);
      this.subOsc2.start();

      // Gentle pink-noise ocean water swell
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.153852;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.76160 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(180, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Low frequency oscillator for wave swells (12.5s tidal wave cycle)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(90, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      lfo.start();

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.noiseNode.start();

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          this.subOsc?.stop();
          this.subOsc2?.stop();
          this.noiseNode?.stop();
          this.isPlaying = false;
        }, 1300);
      } else {
        this.isPlaying = false;
      }
    } catch {
      this.isPlaying = false;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const hydrophone = new HydrophoneEngine();
