/**
 * @fileoverview Zero-dependency Web Audio API 8-Bit Chiptune Synthesizer.
 * Generates retro arcade engine revs, gear shift clunks, nitro blasts, and chiptune melodies.
 */

export class ChiptuneAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
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
        // High harmonic sparkle arpeggio
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
        // Low sluggish clunk
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.15);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      } else {
        // Solid mechanical clutch snap
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      }
    } catch (e) {
      void e;
    }
  }

  playNitro() {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      // White noise roar with bandpass filter
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1760, t + 0.08);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) {
      void e;
    }
  }

  playQuizResult(correct) {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (correct) {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.08);
        osc.frequency.setValueAtTime(659.25, t + 0.16);
        osc.frequency.setValueAtTime(880, t + 0.24);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.setValueAtTime(120, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      }
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
      const freq = count === 0 ? 880 : 440; // High tone on GO
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (count === 0 ? 0.4 : 0.15));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (count === 0 ? 0.4 : 0.15));
    } catch (e) {
      void e;
    }
  }
}
