/**
 * @fileoverview Zero-dependency Web Audio API 8-Bit Chiptune Synthesizer.
 * Generates retro arcade engine revs, gear shifts, nitro blasts, metal collision crunches,
 * physiological anxiety heartbeat pulses, and Zen focus chimes.
 */

export class ChiptuneAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.lastHeartbeatTime = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      void e;
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.engineGain) {
      this.engineGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.muted;
  }

  // --- Engine Rev Synthesizer ---

  startEngine() {
    if (!this.ctx || this.engineOsc || this.muted) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(80, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);

      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();
    } catch (e) {
      void e;
    }
  }

  updateEngineRpm(rpm, maxRpm = 9000) {
    if (!this.ctx || !this.engineOsc || this.muted) return;
    try {
      const ratio = Math.max(0, Math.min(1.0, rpm / maxRpm));
      const freq = 65 + ratio * 320;
      this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);

      if (this.engineGain) {
        this.engineGain.gain.setTargetAtTime(0.06 + ratio * 0.04, this.ctx.currentTime, 0.05);
      }
    } catch (e) {
      void e;
    }
  }

  stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {
        void e;
      }
      this.engineOsc = null;
    }
  }

  // --- Sound Effects ---

  playShift(type = 'normal') {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';

      if (type === 'perfect') {
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.setValueAtTime(659.25, t + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, t + 0.12); // G5
        osc.frequency.setValueAtTime(1046.5, t + 0.18); // C6
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (type === 'early') {
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.15);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      } else {
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.10);
      }
    } catch (e) {
      void e;
    }
  }

  playCrash(intensity = 1.0) {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const dur = 0.3 * intensity;
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + dur);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * intensity, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(t);
    } catch (e) {
      void e;
    }
  }

  playScreech() {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.linearRampToValueAtTime(440, t + 0.25);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {
      void e;
    }
  }

  playHeartbeat(bpm) {
    if (!this.ctx || this.muted) return;
    const now = performance.now();
    const intervalMs = (60 / Math.max(70, Math.min(180, bpm))) * 1000;
    if (now - this.lastHeartbeatTime < intervalMs) return;
    this.lastHeartbeatTime = now;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Low thud
      osc.frequency.setValueAtTime(55, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {
      void e;
    }
  }

  playZenBreath() {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const chords = [392.00, 493.88, 587.33, 783.99]; // G major serene chime
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0.12, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + 1.2);
      });
    } catch (e) {
      void e;
    }
  }

  playNitro() {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.4);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch (e) {
      void e;
    }
  }

  playCountdown(count) {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const freq = count === 0 ? 880 : 440;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (count === 0 ? 0.45 : 0.2));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (count === 0 ? 0.45 : 0.2));
    } catch (e) {
      void e;
    }
  }

  playRadioBeep() {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.setValueAtTime(1400, t + 0.08);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {
      void e;
    }
  }

  playQuizResult(isCorrect) {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      if (isCorrect) {
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.08);
        osc.frequency.setValueAtTime(659.25, t + 0.16);
        osc.frequency.setValueAtTime(880, t + 0.24);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      } else {
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.setValueAtTime(185, t + 0.12);
        osc.frequency.setValueAtTime(130, t + 0.24);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch (e) {
      void e;
    }
  }
}
