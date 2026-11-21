import test from 'node:test';
import assert from 'node:assert/strict';

import { QuizController } from '../src/game/quiz-controller.js';
import { GRADES } from '../src/content/index.js';

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
