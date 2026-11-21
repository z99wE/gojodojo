/**
 * @fileoverview Compact, reliable Screen Reader TTS helper using Web Speech Synthesis.
 * Reads questions, explanations, and tutor advice in Hindi or English.
 */

export class ScreenReader {
  constructor(options = {}) {
    this.lang = options.lang || 'hi';
    this.isSpeaking = false;
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.voices = [];

    if (this.isSupported) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.isSupported) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  setLang(lang) {
    this.lang = lang;
  }

  speak(text, onEnd = () => {}) {
    if (!this.isSupported || !text) {
      onEnd();
      return;
    }

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower, highly clear for learners
      utterance.pitch = 1.0;

      // Try finding an appropriate language voice
      if (this.voices.length > 0) {
        const targetPrefix = this.lang === 'hi' ? 'hi' : 'en';
        const matched = this.voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(targetPrefix));
        if (matched) {
          utterance.voice = matched;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.isSpeaking = false;
      onEnd();
    }
  }

  stop() {
    if (this.isSupported && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        void e;
      }
      this.isSpeaking = false;
    }
  }
}
