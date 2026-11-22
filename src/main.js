/**
 * @fileoverview Main Game Coordinator for Sankhya Turbo 8-Bit Grand Prix.
 * Orchestrates vehicle physics, free lateral steering, off-road collisions,
 * procedural chiptune audio, speech-to-text voice input, screen reader TTS,
 * in-browser AI STEM Pit Crew doubt solver, and exam anxiety management.
 */

import { RacingEngine, TRACK_CIRCUITS } from './game/racing-engine.js';
import { PixelRenderer } from './game/pixel-renderer.js';
import { ChiptuneAudio } from './game/chiptune-audio.js';
import { QuizController } from './game/quiz-controller.js';
import { VoiceInputController } from './voice/voice-input.js';
import { AiTutor } from './ai/ai-tutor.js';
import { loadProgress, saveProgress } from './save.js';
import en from './i18n/en.js';
import hi from './i18n/hi.js';

const i18n = { en, hi };

class GameApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.startOverlay = document.getElementById('start');
    this.startBtn = document.getElementById('start-btn');
    this.langBtn = document.getElementById('lang-btn');
    this.audioBtn = document.getElementById('audio-btn');
    this.touchControls = document.getElementById('touch-controls');
    this.uiContainer = document.getElementById('ui');

    // Pilot Profile & Character Selection
    this.playerNameInput = document.getElementById('player-name-input');
    this.selectedCharacter = 'Velocity Ace';
    this.playerName = 'ARYABHATA';

    // Topic Study Input
    this.customTopicInput = document.getElementById('custom-topic-input');
    this.btnVoiceTopic = document.getElementById('btn-voice-topic');
    this.topicVoiceFeedback = document.getElementById('topic-voice-feedback');

    this.progress = loadProgress();
    this.activeLang = this.progress.lang || 'hi';
    this.currentGrade = 5;
    this.currentCircuit = 'physics';
    this.customTopic = '';

    // Core Subsystems
    this.engine = new RacingEngine({
      trackLength: 1200,
      circuitId: this.currentCircuit,
      grade: this.currentGrade
    });

    this.renderer = new PixelRenderer(this.canvas);
    this.audio = new ChiptuneAudio();
    this.aiTutor = new AiTutor();

    this.quiz = new QuizController({
      grade: this.currentGrade,
      circuitId: this.currentCircuit,
      lang: this.activeLang,
      customTopic: this.customTopic
    });

    // Voice Input Controller
    this.voiceInput = new VoiceInputController({
      lang: this.activeLang,
      onTranscript: (data) => this.handleVoiceTranscript(data),
      onCommand: (cmd) => this.handleVoiceCommand(cmd),
      onStateChange: (state) => this.handleVoiceStateChange(state),
      onError: (err) => this.handleVoiceError(err)
    });

    this.lastTime = 0;
    this.animationFrameId = null;
    this.activeVoiceTarget = 'topic'; // 'topic' | 'quiz' | 'tutor'
    this.isTutorOpen = false;

    this.initUi();
    this.bindEvents();
    this.updateI18nLabels();

    // Global testing hook
    window.__SANKHYA__ = {
      engine: this.engine,
      renderer: this.renderer,
      audio: this.audio,
      quiz: this.quiz,
      voice: this.voiceInput,
      aiTutor: this.aiTutor,
      app: this,
      handleQuizSubmit: (idx) => this.handleQuizSubmit(idx)
    };

    // Initial render
    this.renderer.render(this.engine, this.quiz, this.activeLang);
  }

  initUi() {
    // Language Selector Chips at top of Garage
    const topLangBtns = document.querySelectorAll('#lang-selector-top .chip-btn');
    topLangBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        topLangBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeLang = btn.dataset.lang || 'hi';
        this.quiz.setLang(this.activeLang);
        this.voiceInput.updateLanguage(this.activeLang);
        this.updateI18nLabels();
      });
    });

    // Car Color Selector Chips
    const colorBtns = document.querySelectorAll('#car-color-selector .chip-btn');
    colorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        colorBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const color = btn.dataset.color || '#00f0ff';
        this.engine.setCarColor(color);
      });
    });

    // Grade Selection Chips
    const gradeBtns = document.querySelectorAll('#grade-selector .chip-btn');
    gradeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        gradeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentGrade = parseInt(btn.dataset.grade, 10);
        this.engine.grade = this.currentGrade;
        this.quiz.setGrade(this.currentGrade);
      });
    });

    // Circuit Selection Chips
    const circuitBtns = document.querySelectorAll('#circuit-selector .chip-btn');
    circuitBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        circuitBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCircuit = btn.dataset.circuit;
        this.engine.circuitId = this.currentCircuit;
        this.quiz.setCircuit(this.currentCircuit);
      });
    });

    // Player Pilot Name Input
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener('input', (e) => {
        this.playerName = e.target.value.trim() || 'ARYABHATA';
        this.engine.setPlayerProfile(this.playerName, this.selectedCharacter);
        this.updateGarageBadge();
      });
    }

    // Character Archetype Chips
    const charBtns = document.querySelectorAll('#character-selector .chip-btn');
    charBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        charBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCharacter = btn.dataset.char || 'Velocity Ace';
        this.engine.setPlayerProfile(this.playerName, this.selectedCharacter);
        this.updateGarageBadge();
      });
    });

    // Custom Topic Input
    if (this.customTopicInput) {
      this.customTopicInput.addEventListener('input', (e) => {
        this.customTopic = e.target.value;
        this.quiz.setCustomTopic(this.customTopic);
      });
    }

    // Voice Topic Microphone Button
    if (this.btnVoiceTopic) {
      this.btnVoiceTopic.addEventListener('click', () => {
        this.activeVoiceTarget = 'topic';
        this.voiceInput.start();
      });
    }

    // Language Toggle Button
    if (this.langBtn) {
      this.langBtn.addEventListener('click', () => {
        this.activeLang = this.activeLang === 'hi' ? 'en' : 'hi';
        this.quiz.setLang(this.activeLang);
        this.voiceInput.updateLanguage(this.activeLang);
        this.screenReader.setLang(this.activeLang);
        this.updateI18nLabels();
      });
    }

    // Audio Toggle Buttons (Garage, In-Game HUD, and Mobile Touch)
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        this.toggleAudioMute();
      });
    }

    const inGameAudioBtn = document.getElementById('btn-in-game-audio');
    if (inGameAudioBtn) {
      inGameAudioBtn.addEventListener('click', () => {
        this.toggleAudioMute();
      });
    }

    const touchMuteBtn = document.getElementById('btn-touch-mute');
    if (touchMuteBtn) {
      touchMuteBtn.addEventListener('click', () => {
        this.toggleAudioMute();
      });
    }

    // Start Race Button (Primary)
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Start Race Button (Secondary Bottom Plinth)
    const secondaryStartBtn = document.getElementById('start-btn-secondary');
    if (secondaryStartBtn) {
      secondaryStartBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Initialize Interactive Garage Preview
    this.initGaragePreview();
    this.updateGarageBadge();
  }

  toggleAudioMute() {
    const isMuted = this.audio.toggleMute();
    if (this.audioBtn) {
      this.audioBtn.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
    }
    const inGameAudioBtn = document.getElementById('btn-in-game-audio');
    if (inGameAudioBtn) {
      inGameAudioBtn.textContent = isMuted ? 'AUDIO: OFF [M]' : 'AUDIO: ON [M]';
      inGameAudioBtn.classList.toggle('muted', isMuted);
    }
    const touchMuteBtn = document.getElementById('btn-touch-mute');
    if (touchMuteBtn) {
      touchMuteBtn.textContent = isMuted ? 'AUDIO: OFF [M]' : 'AUDIO: ON [M]';
      touchMuteBtn.classList.toggle('muted', isMuted);
    }
    if (this.engine) {
      this.engine.shiftFeedback = isMuted ? 'AUDIO MUTED [M]' : 'AUDIO ACTIVE [M]';
      this.engine.shiftFeedbackType = isMuted ? 'bogged' : 'perfect';
      this.engine.shiftFeedbackTimer = 1.2;
    }
    return isMuted;
  }

  updateGarageBadge() {
    const badge = document.getElementById('garage-pilot-badge');
    if (badge) {
      const name = this.playerName || 'ARYABHATA';
      const char = this.selectedCharacter || 'Velocity Ace';
      badge.textContent = `PILOT: ${name.toUpperCase()} • ${char.toUpperCase()}`;
    }
  }

  initGaragePreview() {
    const canvas = document.getElementById('garage-car-preview');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let wheelAngle = 0;

    const render = () => {
      if (this.startOverlay && this.startOverlay.classList.contains('hidden')) {
        return;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#060410';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road background strip
      ctx.fillStyle = '#171329';
      ctx.fillRect(0, 48, canvas.width, 26);
      ctx.fillStyle = '#262040';
      ctx.fillRect(0, 47, canvas.width, 2);

      // Dashed lane marker
      wheelAngle = (wheelAngle + 0.12) % (Math.PI * 2);
      const dashOffset = (performance.now() * 0.08) % 36;
      ctx.fillStyle = '#ffe600';
      for (let rx = -dashOffset; rx < canvas.width; rx += 36) {
        ctx.fillRect(rx, 58, 18, 3);
      }

      // Draw 8-Bit Pixel Car
      const primaryColor = this.engine.player?.carColor || '#00f0ff';
      const secondaryColor = this.engine.player?.carSecondaryColor || '#005577';
      const x = 55;
      const y = 36;
      const bob = Math.sin(wheelAngle * 2) > 0.6 ? 1 : 0;
      const cy = y - 10 + bob;

      // Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(x + 4, y + 10, 88, 8);

      // Nitro exhaust glow
      const flameLen = 12 + Math.floor(Math.sin(performance.now() * 0.02) * 6 + 6);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x - flameLen, cy + 9, flameLen, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - flameLen + 4, cy + 10, flameLen - 6, 2);

      // Chassis
      ctx.fillStyle = primaryColor;
      ctx.fillRect(x + 8, cy + 6, 76, 14);

      // Cockpit / Roof
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(x + 24, cy - 2, 40, 9);

      // Windshield
      ctx.fillStyle = '#a8dadc';
      ctx.fillRect(x + 36, cy, 20, 6);

      // Front Wedge
      ctx.fillStyle = primaryColor;
      ctx.fillRect(x + 84, cy + 10, 8, 10);

      // Rear Spoiler
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(x + 4, cy - 4, 8, 11);
      ctx.fillRect(x + 2, cy - 6, 12, 4);

      // Wheels
      ctx.fillStyle = '#111116';
      ctx.fillRect(x + 16, cy + 16, 16, 9);
      ctx.fillRect(x + 64, cy + 16, 16, 9);

      // Rims
      ctx.fillStyle = '#e5e5e5';
      const rimOff = Math.sin(wheelAngle) > 0 ? 4 : 2;
      ctx.fillRect(x + 20 + rimOff, cy + 18, 4, 5);
      ctx.fillRect(x + 68 + rimOff, cy + 18, 4, 5);

      // Headlight
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(x + 90, cy + 11, 4, 4);

      // Tail light
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(x + 4, cy + 7, 4, 4);

      this.garageAnimId = requestAnimationFrame(render);
    };

    if (this.garageAnimId) {
      cancelAnimationFrame(this.garageAnimId);
    }
    this.garageAnimId = requestAnimationFrame(render);
  }

  updateI18nLabels() {
    const t = i18n[this.activeLang] || i18n.en;
    if (this.langBtn) {
      this.langBtn.textContent = this.activeLang === 'hi' ? 'LANG: हिंदी' : 'LANG: ENGLISH';
    }
    const hiBtn = document.getElementById('top-lang-hi');
    const enBtn = document.getElementById('top-lang-en');
    if (hiBtn && enBtn) {
      if (this.activeLang === 'hi') {
        hiBtn.classList.add('active');
        enBtn.classList.remove('active');
      } else {
        enBtn.classList.add('active');
        hiBtn.classList.remove('active');
      }
    }
    if (this.startBtn) {
      this.startBtn.textContent = this.activeLang === 'hi' ? 'रेस शुरू करें [ENTER / SPACE]' : 'START RACE [ENTER / SPACE]';
    }
    const secondaryStartBtn = document.getElementById('start-btn-secondary');
    if (secondaryStartBtn) {
      secondaryStartBtn.textContent = this.activeLang === 'hi' ? 'रेस शुरू करें [ENTER / SPACE]' : 'START RACE [ENTER / SPACE]';
    }
    if (this.btnVoiceTopic) {
      this.btnVoiceTopic.textContent = this.activeLang === 'hi' ? 'बोलकर चुनें (MIC)' : 'SPEAK TOPIC (MIC)';
    }
  }

  startGame() {
    if (this.garageAnimId) {
      cancelAnimationFrame(this.garageAnimId);
      this.garageAnimId = null;
    }

    this.audio.resume();
    this.audio.startEngine();

    if (this.startOverlay) {
      this.startOverlay.classList.add('hidden');
    }

    if (this.touchControls) {
      this.touchControls.classList.remove('hidden');
    }

    if (this.playerNameInput) {
      if (this.playerNameInput.value.trim()) {
        this.playerName = this.playerNameInput.value.trim();
      }
      this.playerNameInput.blur();
    }
    if (this.customTopicInput) {
      this.customTopicInput.blur();
    }
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    window.focus();
    if (this.canvas) this.canvas.focus();

    this.engine.setPlayerProfile(this.playerName, this.selectedCharacter);

    this.engine.reset();
    this.engine.trackLength = TRACK_CIRCUITS[this.currentCircuit]?.trackLength || 100000;
    this.engine.circuitId = this.currentCircuit;
    this.engine.startCountdown();

    this.audio.playCountdown(3);

    this.lastTime = performance.now();
    if (!this.animationFrameId) {
      this.loop(this.lastTime);
    }
  }

  // --- Voice Input Handlers ---

  handleVoiceTranscript(data) {
    if (this.activeVoiceTarget === 'topic') {
      if (this.topicVoiceFeedback) {
        this.topicVoiceFeedback.textContent = `[सुना गया: "${data.text}"]`;
      }
      if (this.customTopicInput && data.text) {
        this.customTopicInput.value = data.text;
        this.customTopic = data.text;
        this.quiz.setCustomTopic(this.customTopic);
      }
    } else if (this.activeVoiceTarget === 'quiz') {
      const qVoiceFeedback = document.getElementById('quiz-voice-status');
      if (qVoiceFeedback) {
        qVoiceFeedback.textContent = `[सुना: "${data.text}"]`;
      }
    } else if (this.activeVoiceTarget === 'tutor') {
      const tutorInput = document.getElementById('tutor-query-input');
      if (tutorInput && data.text) {
        tutorInput.value = data.text;
      }
    }
  }

  handleVoiceCommand(cmd) {
    if (this.activeVoiceTarget === 'quiz' && this.quiz.isActive) {
      if (cmd.type === 'option' && cmd.optionIndex >= 0 && cmd.optionIndex <= 3) {
        this.handleQuizSubmit(cmd.optionIndex);
      }
    }
  }

  handleVoiceStateChange(state) {
    if (this.activeVoiceTarget === 'topic' && this.btnVoiceTopic) {
      if (state.isListening) {
        this.btnVoiceTopic.classList.add('listening');
        this.btnVoiceTopic.textContent = this.activeLang === 'hi' ? 'सुन रहा हूँ...' : 'LISTENING...';
      } else {
        this.btnVoiceTopic.classList.remove('listening');
        this.btnVoiceTopic.textContent = this.activeLang === 'hi' ? 'बोलकर चुनें (MIC)' : 'SPEAK TOPIC (MIC)';
      }
    }
    const qVoiceBtn = document.getElementById('quiz-btn-voice');
    if (qVoiceBtn) {
      if (state.isListening) {
        qVoiceBtn.classList.add('listening');
        qVoiceBtn.textContent = this.activeLang === 'hi' ? 'उत्तर बोलें...' : 'SPEAK NOW...';
      } else {
        qVoiceBtn.classList.remove('listening');
        qVoiceBtn.textContent = this.activeLang === 'hi' ? 'बोलकर उत्तर दें (MIC)' : 'VOICE ANSWER (MIC)';
      }
    }
  }

  handleVoiceError(err) {
    if (this.topicVoiceFeedback) {
      this.topicVoiceFeedback.textContent = this.activeLang === 'hi'
        ? '[माइक्रोफ़ोन चालू करें या टाइप करें]'
        : '[Please enable microphone or type topic]';
    }
  }

  // --- Keyboard & Touch Event Bindings ---

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      // If typing in an input while start overlay or tutor drawer is open, don't capture game keys
      const activeEl = document.activeElement;
      const isInputFocused = activeEl === this.customTopicInput || activeEl === this.playerNameInput || activeEl?.id === 'tutor-query-input';
      const isModalTyping = isInputFocused && (!this.startOverlay.classList.contains('hidden') || this.isTutorOpen);

      if (isModalTyping) {
        if (e.code === 'Enter' && !this.startOverlay.classList.contains('hidden')) {
          e.preventDefault();
          this.startGame();
        }
        return;
      }

      // In Start overlay, Space or Enter starts
      if (!this.startOverlay.classList.contains('hidden')) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          this.startGame();
          return;
        }
      }

      // If finished, space restarts
      if (this.engine.status === 'finished') {
        if (e.code === 'Space') {
          e.preventDefault();
          this.startGame();
          return;
        }
      }

      // If Quiz is active, keys 1-4 submit option
      if (this.quiz.isActive) {
        let optIndex = -1;
        if (e.code === 'Digit1' || e.code === 'Numpad1' || e.key === '1') optIndex = 0;
        else if (e.code === 'Digit2' || e.code === 'Numpad2' || e.key === '2') optIndex = 1;
        else if (e.code === 'Digit3' || e.code === 'Numpad3' || e.key === '3') optIndex = 2;
        else if (e.code === 'Digit4' || e.code === 'Numpad4' || e.key === '4') optIndex = 3;

        if (optIndex >= 0) {
          e.preventDefault();
          this.handleQuizSubmit(optIndex);
          return;
        }
      }

      // AI Tutor Hotkey (T key)
      if (e.code === 'KeyT' || e.key?.toLowerCase() === 't') {
        e.preventDefault();
        this.toggleAiTutor();
        return;
      }

      // Pranayama / Zen Breath Hotkey (B key)
      if (e.code === 'KeyB' || e.key?.toLowerCase() === 'b') {
        e.preventDefault();
        if (this.engine.activateFocus()) {
          this.audio.playZenBreath();
        }
        return;
      }

      // Audio Mute Toggle Hotkey (M key)
      if (e.code === 'KeyM' || e.key?.toLowerCase() === 'm') {
        e.preventDefault();
        this.toggleAudioMute();
        return;
      }

      const keyLower = e.key ? e.key.toLowerCase() : '';

      // 1. Lane UP: W, ArrowUp, L
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyL' || e.key === 'ArrowUp' || keyLower === 'w' || keyLower === 'l') {
        e.preventDefault();
        this.engine.steerLaneUp();
        this.engine.setSteerUp(true);
      }

      // 2. Lane DOWN: S, ArrowDown, R
      if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyR' || e.key === 'ArrowDown' || keyLower === 's' || keyLower === 'r') {
        e.preventDefault();
        this.engine.steerLaneDown();
        this.engine.setSteerDown(true);
      }

      // 3. Accelerate / Gas: D, ArrowRight
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || keyLower === 'd') {
        e.preventDefault();
        this.engine.setThrottle(true);
      }

      // 4. Active Brake: A, ArrowLeft
      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || keyLower === 'a') {
        e.preventDefault();
        this.engine.setBrake(true);
      }

      // Shift Up (SPACEBAR)
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      }

      // Shift Down (X or Shift)
      if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || keyLower === 'x') {
        e.preventDefault();
        this.engine.shiftDown();
        this.audio.playShift('down');
      }

      // Nitro (N key)
      if (e.code === 'KeyN' || keyLower === 'n') {
        e.preventDefault();
        if (this.engine.activateNitro()) {
          this.audio.playNitro();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const keyLower = e.key ? e.key.toLowerCase() : '';
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyL' || e.key === 'ArrowUp' || keyLower === 'w' || keyLower === 'l') {
        this.engine.setSteerUp(false);
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyR' || e.key === 'ArrowDown' || keyLower === 's' || keyLower === 'r') {
        this.engine.setSteerDown(false);
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || keyLower === 'd') {
        this.engine.setThrottle(false);
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || keyLower === 'a') {
        this.engine.setBrake(false);
      }
    });

    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        window.focus();
      });
    }

    // Touch Buttons
    const bindTouchAction = (id, onStart, onEnd) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onStart();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        onEnd();
      }, { passive: false });
      el.addEventListener('mousedown', () => onStart());
      el.addEventListener('mouseup', () => onEnd());
    };

    const btnLaneUp = document.getElementById('btn-steer-left');
    if (btnLaneUp) {
      btnLaneUp.addEventListener('click', () => this.engine.steerLaneUp());
    }
    const btnLaneDown = document.getElementById('btn-steer-right');
    if (btnLaneDown) {
      btnLaneDown.addEventListener('click', () => this.engine.steerLaneDown());
    }

    bindTouchAction('btn-gas', () => this.engine.setThrottle(true), () => this.engine.setThrottle(false));
    bindTouchAction('btn-brake', () => this.engine.setBrake(true), () => this.engine.setBrake(false));

    const btnShiftUp = document.getElementById('btn-shift-up');
    if (btnShiftUp) {
      btnShiftUp.addEventListener('click', () => {
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      });
    }

    const btnShiftDown = document.getElementById('btn-shift-down');
    if (btnShiftDown) {
      btnShiftDown.addEventListener('click', () => {
        this.engine.shiftDown();
        this.audio.playShift('down');
      });
    }

    const btnNitro = document.getElementById('btn-nitro');
    if (btnNitro) {
      btnNitro.addEventListener('click', () => {
        if (this.engine.activateNitro()) {
          this.audio.playNitro();
        }
      });
    }

    const btnZen = document.getElementById('btn-zen');
    if (btnZen) {
      btnZen.addEventListener('click', () => {
        if (this.engine.activateFocus()) {
          this.audio.playZenBreath();
        }
      });
    }

    const btnOpenTutor = document.getElementById('btn-open-tutor');
    if (btnOpenTutor) {
      btnOpenTutor.addEventListener('click', () => {
        this.toggleAiTutor();
      });
    }

    // Canvas click to shift gear if racing
    this.canvas.addEventListener('click', () => {
      this.audio.resume();
      if (this.engine.status === 'finished') {
        this.startGame();
      } else if (this.engine.status === 'racing') {
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      }
    });

    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }

  // --- High-Legibility In-Game STEM Quiz & Science Scramble Modal ---

  showQuizModal(q) {
    if (!this.uiContainer) return;

    this.engine.pauseForPitstop();

    const isHi = this.activeLang === 'hi';
    const isScramble = q.type === 'scramble';
    const badgeText = isScramble
      ? (isHi ? `[ विज्ञान पहेली: ${q.topicTitle} ]` : `[ SCIENCE PUZZLE: ${q.topicTitle} ]`)
      : (isHi ? `[ पिटस्टॉप चेकपॉइंट: ${q.topicTitle} ]` : `[ PITSTOP CHECKPOINT: ${q.topicTitle} ]`);

    const tilesHtml = isScramble && q.scrambledTiles
      ? `
        <div class="scramble-tiles-rack">
          ${q.scrambledTiles.map((letter) => `<span class="scramble-tile">${letter}</span>`).join('')}
        </div>
      `
      : '';

    this.uiContainer.innerHTML = `
      <div id="stem-quiz-modal">
        <div class="quiz-modal-header">
          <div class="quiz-badge">${badgeText}</div>
          <div class="quiz-audio-bar">
            <button id="quiz-btn-voice" class="quiz-helper-btn" type="button">
              ${isHi ? 'बोलकर उत्तर दें (MIC)' : 'VOICE ANSWER (MIC)'}
            </button>
          </div>
        </div>

        <div id="quiz-voice-status" class="transcription-live-bubble"></div>

        <div class="quiz-question-text" style="white-space: pre-line;">${q.text}</div>

        ${tilesHtml}

        <div class="quiz-options-grid">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="quiz-option-btn" data-idx="${idx}" type="button">
              <span class="quiz-option-key">[${idx + 1}]</span>
              <span>${opt}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <div id="quiz-feedback-container"></div>
      </div>
    `;

    // Bind option clicks
    const optBtns = this.uiContainer.querySelectorAll('.quiz-option-btn');
    optBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.handleQuizSubmit(idx);
      });
    });

    // Bind Voice Microphone Answer
    const btnVoice = document.getElementById('quiz-btn-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        this.activeVoiceTarget = 'quiz';
        this.voiceInput.start();
      });
    }
  }

  handleQuizSubmit(optionIndex) {
    const currentQ = this.quiz.currentQuestion;
    const result = this.quiz.submitAnswer(optionIndex);
    if (!result) return;

    const correctText = (currentQ && currentQ.options && currentQ.options[result.correctIndex])
      ? currentQ.options[result.correctIndex]
      : '';

    this.audio.playQuizResult(result.isCorrect);
    this.engine.onQuizAnswer(result.isCorrect, { correctText, explain: result.explain });

    // Stop active listening
    this.voiceInput.stop();

    // Show feedback in modal with explicit mistake identification and correct answer
    const fbContainer = document.getElementById('quiz-feedback-container');
    if (fbContainer) {
      const isHi = this.activeLang === 'hi';
      const statusTitle = result.isCorrect
        ? (isHi ? '[ सही उत्तर! / CORRECT! ] +1000 अंक & सुपर टर्बो ओवरड्राइव!' : '[ CORRECT! ] +1000 PTS & SUPER TURBO OVERDRIVE!')
        : (isHi ? `[ गलत उत्तर! / INCORRECT! ] -1 जीवन (शेष: ${this.engine.player.lives}/5) | सही: ${correctText}` : `[ INCORRECT! ] -1 LIFE (REMAINING: ${this.engine.player.lives}/5) | CORRECT: ${correctText}`);

      fbContainer.innerHTML = `
        <div class="quiz-feedback-box ${result.isCorrect ? 'correct' : 'incorrect'}">
          <strong>${statusTitle}</strong><br />
          <span>${result.explain}</span>
        </div>
      `;
    }

    // Record progress
    this.progress.stones[`quiz-${Date.now()}`] = {
      score: result.isCorrect ? 1 : 0,
      grade: this.currentGrade,
      circuit: this.currentCircuit
    };
    saveProgress(this.progress);

    // Auto dismiss after 2.0s so student can absorb the explanation
    setTimeout(() => {
      this.quiz.dismiss();
      if (this.engine.status !== 'finished') {
        this.engine.resumeFromPitstop();
      }
      if (this.uiContainer) {
        this.uiContainer.innerHTML = '';
      }
    }, 2000);
  }

  // --- Interactive In-Game AI STEM Tutor Drawer ---

  toggleAiTutor() {
    this.isTutorOpen = !this.isTutorOpen;
    if (this.isTutorOpen) {
      this.engine.pauseForPitstop();
      this.showAiTutor();
    } else {
      this.engine.resumeFromPitstop();
      this.hideAiTutor();
    }
  }

  showAiTutor() {
    if (!this.uiContainer) return;
    const isHi = this.activeLang === 'hi';

    const drawer = document.createElement('div');
    drawer.id = 'ai-tutor-drawer';
    drawer.innerHTML = `
      <div class="ai-tutor-header">
        <div class="ai-tutor-title">${isHi ? 'गुरु बॉट (AI STEM Pit Crew)' : 'GURU BOT (AI STEM Tutor)'}</div>
        <button id="tutor-close-btn" class="ai-tutor-close-btn" type="button">X</button>
      </div>

      <div id="ai-tutor-messages" class="ai-tutor-messages">
        <div class="ai-msg bot">
          ${isHi
            ? 'नमस्ते! मैं आपका रेसिंग गुरु बॉट हूँ। कोई भी विज्ञान, गणित या परीक्षा की घबराहट से जुड़ा सवाल पूछें!'
            : 'Hello! I am your AI Pit Crew. Ask me any STEM doubt or how to calm test anxiety!'}
        </div>
      </div>

      <div class="topic-input-row">
        <input type="text" id="tutor-query-input" class="arcade-text-input" placeholder="${isHi ? 'अपना सवाल पूछें...' : 'Ask your doubt...'}" />
        <button id="tutor-btn-mic" class="arcade-mic-btn" type="button">MIC</button>
        <button id="tutor-btn-send" class="arcade-secondary-btn" type="button">${isHi ? 'पूछें' : 'ASK'}</button>
      </div>
    `;

    this.uiContainer.appendChild(drawer);

    // Bind Close
    document.getElementById('tutor-close-btn')?.addEventListener('click', () => this.hideAiTutor());

    // Bind Send
    const sendBtn = document.getElementById('tutor-btn-send');
    const input = document.getElementById('tutor-query-input');
    const submitQuery = () => {
      const text = (input?.value || '').trim();
      if (!text) return;
      this.appendTutorMessage('user', text);
      if (input) input.value = '';

      const resp = this.aiTutor.answerQuery(text, this.activeLang, this.currentGrade);
      this.appendTutorBotMessage(resp);
    };

    sendBtn?.addEventListener('click', submitQuery);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitQuery();
    });

    // Bind Mic
    document.getElementById('tutor-btn-mic')?.addEventListener('click', () => {
      this.activeVoiceTarget = 'tutor';
      this.voiceInput.start();
    });
  }

  appendTutorMessage(sender, text) {
    const list = document.getElementById('ai-tutor-messages');
    if (!list) return;
    const msg = document.createElement('div');
    msg.className = `ai-msg ${sender}`;
    msg.textContent = text;
    list.appendChild(msg);
    list.scrollTop = list.scrollHeight;
  }

  appendTutorBotMessage(resp) {
    const list = document.getElementById('ai-tutor-messages');
    if (!list) return;
    const msg = document.createElement('div');
    msg.className = 'ai-msg bot';
    msg.innerHTML = `
      <div>${resp.answer}</div>
      ${resp.analogy ? `<div class="ai-analogy-tag">[ANALOGY] ${resp.analogy}</div>` : ''}
      ${resp.anxietyTip ? `<div class="ai-anxiety-tip-tag">[CALM FOCUS] ${resp.anxietyTip}</div>` : ''}
    `;
    list.appendChild(msg);
    list.scrollTop = list.scrollHeight;

    // Speak response cleanly
    this.screenReader.speak(resp.answer);
  }

  hideAiTutor() {
    this.isTutorOpen = false;
    const drawer = document.getElementById('ai-tutor-drawer');
    if (drawer) drawer.remove();
  }

  // --- Main Game Loop ---

  loop(currentTime) {
    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    if (this.engine.status === 'countdown') {
      const prevCount = Math.ceil(this.engine.countdownTime);
      this.engine.update(dt);
      const newCount = Math.ceil(this.engine.countdownTime);
      if (prevCount !== newCount && newCount >= 0) {
        this.audio.playCountdown(newCount);
      }
    } else if (this.engine.status === 'pitstop' || this.engine.isPaused) {
      // FROZEN DURING QUIZ: Game is paused behind the modal!
      // Engine physics are frozen so car does not advance or crash while studying.
    } else {
      this.engine.update(dt);

      // 1. Check for Crash / Impact Audio
      if (this.engine.crashEvent && this.engine.crashEvent.time > 0.3) {
        this.audio.playCrash(this.engine.crashEvent.intensity);
      }

      // 2. Check Checkpoint for STEM Quiz
      if (this.engine.activeQuizCheckpoint && !this.quiz.isActive) {
        this.audio.playRadioBeep();
        const q = this.quiz.nextQuestion();
        if (q) {
          this.engine.pauseForPitstop();
          this.showQuizModal(q);
        }
        this.engine.activeQuizCheckpoint = null;
      }

      // 3. Audio RPM & Heartbeat Pulse
      this.audio.updateEngineRpm(this.engine.player.rpm);
      if (this.engine.player.bpm >= 125) {
        this.audio.playHeartbeat(this.engine.player.bpm);
      }
    }

    // Render Canvas Frame
    this.renderer.render(this.engine, this.quiz, this.activeLang);

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate App when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
