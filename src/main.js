/**
 * @fileoverview Main Game Coordinator for Sankhya Turbo 8-Bit Grand Prix.
 * Orchestrates physics engine, 8-bit canvas renderer, chiptune audio, and STEM radio quiz.
 */

import { RacingEngine, TRACK_CIRCUITS } from './game/racing-engine.js';
import { PixelRenderer } from './game/pixel-renderer.js';
import { ChiptuneAudio } from './game/chiptune-audio.js';
import { QuizController } from './game/quiz-controller.js';
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

    this.progress = loadProgress();
    this.activeLang = this.progress.lang || 'hi';
    this.currentGrade = 5;
    this.currentCircuit = 'physics';

    // Game Subsystems
    this.engine = new RacingEngine({
      trackLength: 1200,
      circuitId: this.currentCircuit,
      grade: this.currentGrade
    });

    this.renderer = new PixelRenderer(this.canvas);
    this.audio = new ChiptuneAudio();
    this.quiz = new QuizController({
      grade: this.currentGrade,
      circuitId: this.currentCircuit,
      lang: this.activeLang
    });

    this.lastTime = 0;
    this.animationFrameId = null;

    this.initUi();
    this.bindEvents();
    this.updateI18nLabels();

    // Expose for testing
    window.__SANKHYA__ = {
      engine: this.engine,
      renderer: this.renderer,
      audio: this.audio,
      quiz: this.quiz,
      app: this,
      handleQuizSubmit: (idx) => this.handleQuizSubmit(idx)
    };

    // Initial render
    this.renderer.render(this.engine, this.quiz, this.activeLang);
  }

  initUi() {
    // Grade Buttons
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

    // Circuit Buttons
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

    // Language Toggle
    if (this.langBtn) {
      this.langBtn.addEventListener('click', () => {
        this.activeLang = this.activeLang === 'hi' ? 'en' : 'hi';
        this.quiz.setLang(this.activeLang);
        this.updateI18nLabels();
      });
    }

    // Audio Toggle
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        this.audioBtn.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
      });
    }

    // Start Race Button
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        this.startGame();
      });
    }
  }

  updateI18nLabels() {
    const t = i18n[this.activeLang] || i18n.en;
    if (this.langBtn) {
      this.langBtn.textContent = this.activeLang === 'hi' ? 'LANG: हिंदी' : 'LANG: ENGLISH';
    }
    if (this.startBtn) {
      this.startBtn.textContent = `${t['app.start']} ➔`;
    }
  }

  startGame() {
    this.audio.resume();
    this.audio.startEngine();

    if (this.startOverlay) {
      this.startOverlay.classList.add('hidden');
    }

    if (this.touchControls && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      this.touchControls.classList.remove('hidden');
    }

    this.engine.reset();
    this.engine.trackLength = TRACK_CIRCUITS[this.currentCircuit]?.trackLength || 1200;
    this.engine.circuitId = this.currentCircuit;
    this.engine.startCountdown();

    this.audio.playCountdown(3);

    this.lastTime = performance.now();
    if (!this.animationFrameId) {
      this.loop(this.lastTime);
    }
  }

  bindEvents() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      // In Start overlay, Space can start
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

      // If Quiz is active, keys 1-4 answer
      if (this.quiz.isActive) {
        let optIndex = -1;
        if (e.code === 'Digit1' || e.code === 'Numpad1') optIndex = 0;
        else if (e.code === 'Digit2' || e.code === 'Numpad2') optIndex = 1;
        else if (e.code === 'Digit3' || e.code === 'Numpad3') optIndex = 2;
        else if (e.code === 'Digit4' || e.code === 'Numpad4') optIndex = 3;

        if (optIndex >= 0) {
          e.preventDefault();
          this.handleQuizSubmit(optIndex);
          return;
        }
      }

      // Race Controls
      if (e.code === 'Space') {
        e.preventDefault();
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.engine.steerLane(1);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this.engine.steerLane(-1);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        this.engine.steerLane(-1);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        this.engine.steerLane(1);
      } else if (e.code === 'KeyN' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        e.preventDefault();
        if (this.engine.activateNitro()) {
          this.audio.playNitro();
        }
      }
    });

    // Mobile / Touch Buttons
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
        this.audio.playShift('normal');
      });
    }

    const btnSteerUp = document.getElementById('btn-steer-up');
    if (btnSteerUp) {
      btnSteerUp.addEventListener('click', () => {
        this.engine.steerLane(-1);
      });
    }

    const btnSteerDown = document.getElementById('btn-steer-down');
    if (btnSteerDown) {
      btnSteerDown.addEventListener('click', () => {
        this.engine.steerLane(1);
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

    // Canvas click: When quiz is active, allow clicking options; else shift gear
    this.canvas.addEventListener('click', (e) => {
      this.audio.resume();

      if (this.engine.status === 'finished') {
        this.startGame();
        return;
      }

      if (this.quiz.isActive) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.renderer.width / rect.width;
        const scaleY = this.renderer.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        // Check if clicked one of the 4 quiz option boxes (see pixel-renderer coordinates)
        const optY = 110;
        for (let i = 0; i < 4; i++) {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const bx = 80 + col * 240;
          const by = optY + row * 38;

          if (clickX >= bx && clickX <= bx + 225 && clickY >= by && clickY <= by + 30) {
            this.handleQuizSubmit(i);
            return;
          }
        }
      } else if (this.engine.status === 'racing') {
        // Tap canvas to shift gear!
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }

  handleQuizSubmit(optionIndex) {
    const result = this.quiz.submitAnswer(optionIndex);
    if (!result) return;

    this.audio.playQuizResult(result.isCorrect);
    this.engine.onQuizAnswer(result.isCorrect);

    // Save score
    this.progress.stones[`quiz-${Date.now()}`] = {
      score: result.isCorrect ? 1 : 0,
      grade: this.currentGrade,
      circuit: this.currentCircuit
    };
    saveProgress(this.progress);

    // Auto dismiss question after brief delay
    setTimeout(() => {
      this.quiz.dismiss();
    }, 900);
  }

  loop(currentTime) {
    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Check Countdown tones
    if (this.engine.status === 'countdown') {
      const prevCount = Math.ceil(this.engine.countdownTime);
      this.engine.update(dt);
      const newCount = Math.ceil(this.engine.countdownTime);
      if (prevCount !== newCount && newCount >= 0) {
        this.audio.playCountdown(newCount);
      }
    } else {
      this.engine.update(dt);

      // Check if Checkpoint triggered for STEM Quiz
      if (this.engine.activeQuizCheckpoint && !this.quiz.isActive) {
        this.audio.playRadioBeep();
        this.quiz.nextQuestion();
        this.engine.activeQuizCheckpoint = null;
      }

      // Update Engine Synthesizer Pitch
      this.audio.updateEngineRpm(this.engine.player.rpm);
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
