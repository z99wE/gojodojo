import test from 'node:test';
import assert from 'node:assert/strict';

import { QuizController } from '../src/game/quiz-controller.js';
import { GRADES } from '../src/content/index.js';
import { AiTutor } from '../src/ai/ai-tutor.js';
import { VoiceInputController } from '../src/voice/voice-input.js';

test('QuizController generates grade-appropriate STEM questions for all classes', () => {
  for (const grade of GRADES) {
    const quiz = new QuizController({ grade, circuitId: 'physics', lang: 'en' });
    const q = quiz.nextQuestion();

    assert.ok(q, `Grade ${grade} must provide a question`);
    assert.ok(typeof q.text === 'string' && q.text.length > 0, `Question text must not be empty`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Options must have >= 2 items`);
    assert.ok(typeof q.correctIndex === 'number');
    assert.ok(typeof q.hint === 'string');
    assert.ok(typeof q.explain === 'string');
  }
});

test('QuizController handles answer submission, streak, and history', () => {
  const quiz = new QuizController({ grade: 5, circuitId: 'maths', lang: 'hi' });
  const q = quiz.nextQuestion();
  assert.strictEqual(quiz.isActive, true);

  // Submit correct answer
  const correctResult = quiz.submitAnswer(q.correctIndex);
  assert.strictEqual(correctResult.isCorrect, true);
  assert.strictEqual(quiz.streak, 1);
  assert.strictEqual(quiz.history.length, 1);

  // Next question
  quiz.dismiss();
  assert.strictEqual(quiz.isActive, false);

  const q2 = quiz.nextQuestion();
  const wrongIndex = (q2.correctIndex + 1) % q2.options.length;
  const wrongResult = quiz.submitAnswer(wrongIndex);
  assert.strictEqual(wrongResult.isCorrect, false);
  assert.strictEqual(quiz.streak, 0, 'Streak resets on incorrect answer');
});

test('AiTutor explains STEM concepts and provides anxiety advice in Hindi and English', () => {
  const tutor = new AiTutor();

  // 1. Friction query
  const physicsResp = tutor.answerQuery('friction', 'en', 6);
  assert.ok(physicsResp.answer.length > 10);
  assert.ok(physicsResp.analogy.length > 5);
  assert.ok(physicsResp.anxietyTip.length > 5);

  // 2. Hindi Anxiety query
  const anxietyResp = tutor.answerQuery('मुझे परीक्षा में घबराहट होती है', 'hi', 7);
  assert.ok(anxietyResp.answer.includes('दिल') || anxietyResp.answer.includes('शरीर') || anxietyResp.answer.includes('सामान्य'));
  assert.ok(anxietyResp.anxietyTip.includes('4-7-8') || anxietyResp.anxietyTip.includes('प्राणायाम'));
});

test('QuizController dynamically synthesizes customized quiz questions for user-selected topics', () => {
  const quiz = new QuizController({ grade: 7, lang: 'hi', customTopic: 'प्रकाश संश्लेषण (Photosynthesis)' });
  const q = quiz.nextQuestion();

  assert.ok(q, 'Must generate custom topic question');
  assert.strictEqual(q.topicTitle, 'प्रकाश संश्लेषण (Photosynthesis)');
  assert.ok(typeof q.text === 'string' && q.text.length > 5);
  assert.strictEqual(q.options.length, 4);
  assert.ok(typeof q.correctIndex === 'number');
  assert.ok(typeof q.hint === 'string');
  assert.ok(typeof q.explain === 'string');
});

test('VoiceInputController parses spoken Hindi and English numbers to option indices', () => {
  const voice = new VoiceInputController();

  assert.strictEqual(voice.parseOptionCommand('Option 1'), 0);
  assert.strictEqual(voice.parseOptionCommand('पहला विकल्प'), 0);
  assert.strictEqual(voice.parseOptionCommand('एक'), 0);
  assert.strictEqual(voice.parseOptionCommand('two'), 1);
  assert.strictEqual(voice.parseOptionCommand('दो'), 1);
  assert.strictEqual(voice.parseOptionCommand('three'), 2);
  assert.strictEqual(voice.parseOptionCommand('तीन'), 2);
  assert.strictEqual(voice.parseOptionCommand('four'), 3);
  assert.strictEqual(voice.parseOptionCommand('चार'), 3);
  assert.strictEqual(voice.parseOptionCommand('what is gravity'), null);
});
