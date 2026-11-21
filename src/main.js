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
import { ScreenReader } from './voice/screen-reader.js';
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
    this.screenReader = new ScreenReader({ lang: this.activeLang });

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
      screenReader: this.screenReader,
      aiTutor: this.aiTutor,
      app: this,
      handleQuizSubmit: (idx) => this.handleQuizSubmit(idx)
    };

    // Initial render
    this.renderer.render(this.engine, this.quiz, this.activeLang);
  }

  initUi() {
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

    // Audio Toggle Button
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
      this.startBtn.textContent = t['app.start'];
    }
    if (this.btnVoiceTopic) {
      this.btnVoiceTopic.textContent = this.activeLang === 'hi' ? 'बोलकर चुनें (MIC)' : 'SPEAK TOPIC (MIC)';
    }
  }

  startGame() {
    this.audio.resume();
    this.audio.startEngine();

    if (this.startOverlay) {
      this.startOverlay.classList.add('hidden');
    }

    if (this.touchControls) {
      this.touchControls.classList.remove('hidden');
    }

    if (this.playerNameInput && this.playerNameInput.value.trim()) {
      this.playerName = this.playerNameInput.value.trim();
    }
    this.engine.setPlayerProfile(this.playerName, this.selectedCharacter);

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
      // In Start overlay, Space or Enter starts
      if (!this.startOverlay.classList.contains('hidden')) {
        if (e.code === 'Space' || e.code === 'Enter') {
          if (document.activeElement === this.customTopicInput) return; // Allow typing spaces
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

      // AI Tutor Hotkey (T key)
      if (e.code === 'KeyT') {
        e.preventDefault();
        this.toggleAiTutor();
        return;
      }

      // Pranayama / Zen Breath Hotkey (B key)
      if (e.code === 'KeyB') {
        e.preventDefault();
        if (this.engine.activateFocus()) {
          this.audio.playZenBreath();
        }
        return;
      }

      // Throttle (Accelerate / Gas)
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this.engine.setThrottle(true);
      }

      // Active Brake
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.engine.setBrake(true);
      }

      // Steer Left
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        this.engine.setSteerLeft(true);
      }

      // Steer Right
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        this.engine.setSteerRight(true);
      }

      // Shift Up (SPACEBAR)
      if (e.code === 'Space') {
        e.preventDefault();
        const prevGear = this.engine.player.gear;
        this.engine.shiftUp();
        if (this.engine.player.gear > prevGear) {
          this.audio.playShift(this.engine.player.shiftFeedback.type);
        }
      }

      // Shift Down (X or Shift)
      if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        e.preventDefault();
        this.engine.shiftDown();
        this.audio.playShift('down');
      }

      // Nitro (N key)
      if (e.code === 'KeyN') {
        e.preventDefault();
        if (this.engine.activateNitro()) {
          this.audio.playNitro();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.engine.setThrottle(false);
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.engine.setBrake(false);
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.engine.setSteerLeft(false);
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.engine.setSteerRight(false);
      }
    });

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

    bindTouchAction('btn-gas', () => this.engine.setThrottle(true), () => this.engine.setThrottle(false));
    bindTouchAction('btn-brake', () => this.engine.setBrake(true), () => this.engine.setBrake(false));
    bindTouchAction('btn-steer-left', () => this.engine.setSteerLeft(true), () => this.engine.setSteerLeft(false));
    bindTouchAction('btn-steer-right', () => this.engine.setSteerRight(true), () => this.engine.setSteerRight(false));

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

  // --- High-Legibility In-Game STEM Quiz Modal ---

  showQuizModal(q) {
    if (!this.uiContainer) return;

    this.screenReader.stop();

    const isHi = this.activeLang === 'hi';
    const badgeText = isHi ? `[ पिटस्टॉप चेकपॉइंट: ${q.topicTitle} ]` : `[ PITSTOP CHECKPOINT: ${q.topicTitle} ]`;

    this.uiContainer.innerHTML = `
      <div id="stem-quiz-modal">
        <div class="quiz-modal-header">
          <div class="quiz-badge">${badgeText}</div>
          <div class="quiz-audio-bar">
            <button id="quiz-btn-speak" class="quiz-helper-btn" type="button">
              ${isHi ? 'प्रश्न सुनें (TTS)' : 'LISTEN QUESTION'}
            </button>
            <button id="quiz-btn-voice" class="quiz-helper-btn" type="button">
              ${isHi ? 'बोलकर उत्तर दें (MIC)' : 'VOICE ANSWER (MIC)'}
            </button>
          </div>
        </div>

        <div id="quiz-voice-status" class="transcription-live-bubble"></div>

        <div class="quiz-question-text">${q.text}</div>

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

    // Bind Screen Reader TTS
    const btnSpeak = document.getElementById('quiz-btn-speak');
    if (btnSpeak) {
      btnSpeak.addEventListener('click', () => {
        const fullReadText = `${q.text}. ${isHi ? 'विकल्प हैं:' : 'Options are:'} 1: ${q.options[0]}, 2: ${q.options[1]}, 3: ${q.options[2]}, 4: ${q.options[3]}`;
        this.screenReader.speak(fullReadText);
      });
    }

    // Bind Voice Microphone Answer
    const btnVoice = document.getElementById('quiz-btn-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        this.activeVoiceTarget = 'quiz';
        this.voiceInput.start();
      });
    }

    // Auto-read question with screen reader if enabled
    const autoReadText = `${q.text}`;
    this.screenReader.speak(autoReadText);
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

    // Stop active listening and speaking
    this.voiceInput.stop();
    this.screenReader.stop();

    // Show feedback in modal with explicit mistake identification and correct answer
    const fbContainer = document.getElementById('quiz-feedback-container');
    if (fbContainer) {
      const isHi = this.activeLang === 'hi';
      const statusTitle = result.isCorrect
        ? (isHi ? '[ सही उत्तर! / CORRECT! ] +1000 अंक & सुपर टर्बो ओवरड्राइव!' : '[ CORRECT! ] +1000 PTS & SUPER TURBO OVERDRIVE!')
        : (isHi ? `[ गलत उत्तर! / INCORRECT! ] सही उत्तर: ${correctText}` : `[ INCORRECT! ] CORRECT ANSWER: ${correctText}`);

      fbContainer.innerHTML = `
        <div class="quiz-feedback-box ${result.isCorrect ? 'correct' : 'incorrect'}">
          <strong>${statusTitle}</strong><br />
          <span>${result.explain}</span>
        </div>
      `;

      // Read out explanation with TTS
      this.screenReader.speak(`${statusTitle}. ${result.explain}`);
    }

    // Record progress
    this.progress.stones[`quiz-${Date.now()}`] = {
      score: result.isCorrect ? 1 : 0,
      grade: this.currentGrade,
      circuit: this.currentCircuit
    };
    saveProgress(this.progress);

    // Auto dismiss after 2.6s so student can absorb the explanation and mistake analysis
    setTimeout(() => {
      this.quiz.dismiss();
      if (this.uiContainer) {
        this.uiContainer.innerHTML = '';
      }
    }, 2600);
  }

  // --- Interactive In-Game AI STEM Tutor Drawer ---

  toggleAiTutor() {
    this.isTutorOpen = !this.isTutorOpen;
    if (this.isTutorOpen) {
      this.showAiTutor();
    } else {
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
