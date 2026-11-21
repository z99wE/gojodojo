/**
 * @fileoverview Robust Browser Voice Input Controller using SpeechRecognition.
 * Handles continuous speech recognition, live interim transcription, Hindi and English
 * speech recognition, and automatic mapping of spoken answers (e.g., 'एक', 'दो', 'one', 'two').
 */

export class VoiceInputController {
  constructor(options = {}) {
    this.activeLang = options.lang || 'hi';
    this.onTranscript = options.onTranscript || (() => {});
    this.onCommand = options.onCommand || (() => {});
    this.onError = options.onError || (() => {});
    this.onStateChange = options.onStateChange || (() => {});

    this.recognition = null;
    this.isListening = false;
    this.lastTranscript = '';
    this.isSupported = false;

    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') {
      this.isSupported = false;
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.updateLanguage(this.activeLang);

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange({ isListening: true, status: 'listening' });
      };

      this.recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            finalText += text;
          } else {
            interimText += text;
          }
        }

        const currentText = (finalText || interimText).trim();
        this.lastTranscript = currentText;
        this.onTranscript({ text: currentText, isFinal: Boolean(finalText) });

        if (finalText) {
          const mappedOption = this.parseOptionCommand(finalText);
          if (mappedOption !== null) {
            this.onCommand({ type: 'option', optionIndex: mappedOption, raw: finalText });
          } else {
            this.onCommand({ type: 'text', text: finalText });
          }
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.onStateChange({ isListening: false, status: 'error', error: event.error });
        this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStateChange({ isListening: false, status: 'idle' });
      };

      this.isSupported = true;
    } catch (err) {
      this.isSupported = false;
      this.onError(err);
    }
  }

  updateLanguage(lang) {
    this.activeLang = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }

  start() {
    if (!this.isSupported) {
      this.onError('SPEECH_RECOGNITION_UNSUPPORTED');
      return false;
    }
    if (this.isListening) {
      this.stop();
      return true;
    }

    try {
      this.updateLanguage(this.activeLang);
      this.recognition.start();
      return true;
    } catch (err) {
      // If already started or aborting, reset
      try {
        this.recognition.stop();
      } catch (e) {
        void e;
      }
      this.onError(err);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        void e;
      }
      this.isListening = false;
    }
  }

  /**
   * Intelligently parses Hindi and English numbers/words into 0-indexed option indices (0 to 3).
   * @param {string} text Spoken transcript
   * @returns {number|null} 0, 1, 2, 3 or null if no command matched
   */
  parseOptionCommand(text) {
    const clean = text.toLowerCase().trim();

    // Option 1 (Index 0)
    if (/(?:^|\P{L}|_)(1|one|first|ek|पहला|एक|ए|a|option\s*1|option\s*a)(?:$|\P{L}|_)/iu.test(clean)) return 0;

    // Option 2 (Index 1)
    if (/(?:^|\P{L}|_)(2|two|second|do|दूसरा|दो|बी|b|option\s*2|option\s*b)(?:$|\P{L}|_)/iu.test(clean)) return 1;

    // Option 3 (Index 2)
    if (/(?:^|\P{L}|_)(3|three|third|teen|तीसरा|तीन|सी|c|option\s*3|option\s*c)(?:$|\P{L}|_)/iu.test(clean)) return 2;

    // Option 4 (Index 3)
    if (/(?:^|\P{L}|_)(4|four|fourth|chaar|char|चौथा|चार|डी|d|option\s*4|option\s*d)(?:$|\P{L}|_)/iu.test(clean)) return 3;

    return null;
  }
}
