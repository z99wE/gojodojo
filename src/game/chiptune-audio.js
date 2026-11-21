/**
 * @fileoverview Web Audio API Arcade Synthesizer with energetic chiptune rhythm,
 * smooth filtered engine harmonics (no droning buzz), and punchy race sound effects.
 */

export class ChiptuneAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
    this.lastHeartbeatTime = 0;
    this.bgmStep = 0;
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
    if (this.muted) {
      if (this.engineGain) {
        this.engineGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
      }
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.muted;
  }

  // --- Smooth, Warm Filtered Engine Sound (No Droning Buzz) ---

  startEngine() {
    if (!this.ctx || this.engineOsc || this.muted) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineGain = this.ctx.createGain();

      // Triangle wave for smooth, warm engine hum instead of grating sawtooth drone
      this.engineOsc.type = 'triangle';
      this.engineOsc.frequency.setValueAtTime(75, this.ctx.currentTime);

      // Lowpass filter cutoff to remove harsh high frequencies
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

      // Gentle, pleasant baseline volume
      this.engineGain.gain.setValueAtTime(this.muted ? 0 : 0.05, this.ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();

      this.startBgm();
    } catch (e) {
      void e;
    }
  }

  updateEngineRpm(rpm, maxRpm = 9000) {
    if (!this.ctx || !this.engineOsc || this.muted) return;
    try {
      const ratio = Math.max(0, Math.min(1.0, rpm / maxRpm));
      const freq = 60 + ratio * 240;
      this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.06);

      if (this.engineFilter) {
        this.engineFilter.frequency.setTargetAtTime(240 + ratio * 320, this.ctx.currentTime, 0.06);
      }

      if (this.engineGain) {
        this.engineGain.gain.setTargetAtTime(0.04 + ratio * 0.04, this.ctx.currentTime, 0.06);
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
    this.stopBgm();
  }

  // --- Energetic Retro Arcade Bassline (Creates Speed & Urgency) ---

  startBgm() {
    if (this.isBgmPlaying || this.muted || !this.ctx) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // 130 BPM driving synthwave arpeggio
    const bassline = [
      110.0, 110.0, 130.81, 146.83, // A2, A2, C3, D3
      110.0, 110.0, 164.81, 146.83, // A2, A2, E3, D3
      98.0, 98.0, 123.47, 130.81,   // G2, G2, B2, C3
      82.41, 82.41, 110.0, 123.47   // E2, E2, A2, B2
    ];

    const stepIntervalMs = 120; // Fast energetic tempo

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const t = this.ctx.currentTime;
        const freq = bassline[this.bgmStep % bassline.length];
        this.bgmStep++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, t);
        filter.frequency.exponentialRampToValueAtTime(140, t + 0.1);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
      } catch (e) {
        void e;
      }
    }, stepIntervalMs);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
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
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.setValueAtTime(659.25, t + 0.05);
        osc.frequency.setValueAtTime(783.99, t + 0.10);
        osc.frequency.setValueAtTime(1046.5, t + 0.15);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      } else {
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
        gain.gain.setValueAtTime(0.10, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {
      void e;
    }
  }

  playCrash(intensity = 1.0) {
    if (!this.ctx || this.muted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const dur = 0.28 * intensity;
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
      filter.frequency.setValueAtTime(550, t);
      filter.frequency.exponentialRampToValueAtTime(70, t + dur);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3 * intensity, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(t);
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
      const chords = [392.0, 493.88, 587.33, 783.99];
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

      gain.gain.setValueAtTime(0.20, t);
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

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (count === 0 ? 0.4 : 0.18));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (count === 0 ? 0.4 : 0.18));
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

      gain.gain.setValueAtTime(0.16, t);
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
        osc.frequency.setValueAtTime(554.37, t + 0.07);
        osc.frequency.setValueAtTime(659.25, t + 0.14);
        osc.frequency.setValueAtTime(880, t + 0.21);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      } else {
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.setValueAtTime(175, t + 0.12);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
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
