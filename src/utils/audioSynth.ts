// Audio Synthesizer for Maritime Ambience and Vessel Chime using Web Audio API

class MaritimeAudio {
  private ctx: AudioContext | null = null;
  private isPlayingOcean = false;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleOceanWaves(): boolean {
    if (this.isPlayingOcean) {
      this.stopOceanWaves();
      return false;
    } else {
      this.startOceanWaves();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingOcean;
  }

  public startOceanWaves() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.isPlayingOcean) return;

      // Create pink/pinkish ocean wave noise buffer
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.05; // lower amplitude
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for ocean wave sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();

      this.noiseNode = whiteNoise;
      this.filterNode = filter;
      this.gainNode = gain;
      this.isPlayingOcean = true;

      // Modulate filter frequency to simulate swelling ocean waves
      let phase = 0;
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.filterNode || !this.gainNode) return;
        phase += 0.05;
        const wave = (Math.sin(phase) + 1) / 2; // 0 to 1
        const cutoff = 150 + wave * 350; // 150Hz to 500Hz
        const volume = 0.04 + wave * 0.06;
        
        this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.2);
        this.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.2);
      }, 200);

    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  }

  public stopOceanWaves() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      setTimeout(() => {
        if (this.noiseNode) {
          (this.noiseNode as AudioBufferSourceNode).stop();
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        this.isPlayingOcean = false;
      }, 350);
    } else {
      this.isPlayingOcean = false;
    }
  }

  public playShipHorn() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Ship horn is two resonant low frequencies (e.g. 110Hz and 138.5Hz - A2 and C#3)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const hornGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(108, now);
      osc2.frequency.setValueAtTime(136, now);

      // Lowpass filter to make it warm and distant
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      hornGain.gain.setValueAtTime(0, now);
      hornGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      hornGain.gain.setValueAtTime(0.18, now + 1.8);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(hornGain);
      hornGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 2.8);
      osc2.stop(now + 2.8);
    } catch (e) {
      console.warn('Ship horn audio error:', e);
    }
  }
}

export const maritimeAudio = new MaritimeAudio();
