/**
 * @fileoverview STEM Radio Pitstop Controller for 8-bit Grand Prix.
 * Delivers NCERT/State Board Class 1-8 questions or custom user-selected/spoken topics.
 */

import { topicsForGrade, getTopic } from '../content/index.js';
import { AiTutor } from '../ai/ai-tutor.js';

export class QuizController {
  constructor(options = {}) {
    this.grade = options.grade || 5;
    this.circuitId = options.circuitId || 'physics';
    this.lang = options.lang || 'hi';
    this.customTopic = options.customTopic || '';
    this.aiTutor = new AiTutor();

    this.currentQuestion = null;
    this.isActive = false;
    this.answered = false;
    this.streak = 0;
    this.history = [];
  }

  setGrade(grade) {
    this.grade = Math.max(1, Math.min(8, grade));
  }

  setCircuit(circuitId) {
    this.circuitId = circuitId;
  }

  setLang(lang) {
    this.lang = lang === 'en' ? 'en' : 'hi';
  }

  setCustomTopic(topic) {
    this.customTopic = (topic || '').trim();
  }

  /**
   * Selects or synthesizes an appropriate STEM question for the current grade & custom topic.
   */
  nextQuestion() {
    // 1. If user entered a custom topic, use AI Tutor to generate tailored questions
    if (this.customTopic && this.customTopic.length > 1) {
      const customQuestions = this.aiTutor.generateCustomQuiz(this.customTopic, this.grade, this.lang);
      if (customQuestions && customQuestions.length > 0) {
        const q = customQuestions[Math.floor(Math.random() * customQuestions.length)];
        this.currentQuestion = {
          topicTitle: this.customTopic,
          subject: 'custom',
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          hint: q.hint,
          explain: q.explain
        };
        this.isActive = true;
        this.answered = false;
        return this.currentQuestion;
      }
    }

    // 2. Otherwise load from standard curriculum index
    const topics = topicsForGrade(this.grade);
    if (!topics || topics.length === 0) return null;

    let targetSubject = 'science';
    if (this.circuitId === 'maths') targetSubject = 'maths';

    let matchedTopics = topics.filter((t) => t.subject === targetSubject);
    if (matchedTopics.length === 0) matchedTopics = topics;

    const chosenTopicHeader = matchedTopics[Math.floor(Math.random() * matchedTopics.length)];
    const fullTopic = getTopic(chosenTopicHeader.id, this.grade);

    if (!fullTopic || !fullTopic.questions || fullTopic.questions.length === 0) {
      return null;
    }

    const q = fullTopic.questions[Math.floor(Math.random() * fullTopic.questions.length)];

    this.currentQuestion = {
      topicTitle: fullTopic.title[this.lang] || fullTopic.title.en,
      subject: fullTopic.subject,
      text: q.text[this.lang] || q.text.en,
      options: q.options.map((opt) => opt[this.lang] || opt.en),
      correctIndex: q.answer,
      hint: q.hint[this.lang] || q.hint.en,
      explain: q.explain[this.lang] || q.explain.en
    };

    this.isActive = true;
    this.answered = false;
    return this.currentQuestion;
  }

  /**
   * Validates option chosen (0 to 3).
   * @param {number} optionIndex
   * @returns {{ isCorrect: boolean, explain: string, streak: number }}
   */
  submitAnswer(optionIndex) {
    if (!this.isActive || !this.currentQuestion) return null;

    const isCorrect = optionIndex === this.currentQuestion.correctIndex;
    this.answered = true;

    if (isCorrect) {
      this.streak++;
    } else {
      this.streak = 0;
    }

    const result = {
      isCorrect,
      correctIndex: this.currentQuestion.correctIndex,
      explain: this.currentQuestion.explain,
      streak: this.streak
    };

    this.history.push({
      question: this.currentQuestion.text,
      isCorrect,
      timestamp: Date.now()
    });

    return result;
  }

  dismiss() {
    this.isActive = false;
    this.currentQuestion = null;
    this.answered = false;
  }
}
