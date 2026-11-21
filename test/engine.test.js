import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizeHtml } from '../src/ui/sanitize.js';
import { isFeatureEnabled, FEATURES } from '../src/flags.js';
import { loadProgress, saveProgress, flushProgress, resetProgress, SAVE_KEY } from '../src/save.js';
import { GRADES, topicsForGrade, getTopic, progressKey, BOARD } from '../src/content/index.js';

// Mock localStorage for headless Node testing environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

test('Sanitize HTML prevents script injection and dangerous attributes', () => {
  const dirty = '<div>Safe text</div><script>alert("hack")</script><img src="x" onerror="alert(1)">';
  const clean = sanitizeHtml(dirty);

  assert.ok(!clean.includes('<script>'), 'Should strip script tag');
  assert.ok(!clean.includes('onerror='), 'Should strip onerror attribute');
  assert.ok(clean.includes('<div>Safe text</div>'), 'Should preserve safe markup');
});

test('Feature flag engine correctly checks configured flags', () => {
  assert.strictEqual(isFeatureEnabled(FEATURES.RETRO_8BIT_MODE), true);
  assert.strictEqual(isFeatureEnabled(FEATURES.CHIPTUNE_AUDIO), true);
  assert.strictEqual(isFeatureEnabled(FEATURES.STEM_RADIO_QUIZ), true);
  assert.strictEqual(isFeatureEnabled(FEATURES.TOUCH_CONTROLS), true);
  assert.strictEqual(isFeatureEnabled('nonExistentFlag'), true, 'Defaults to true for unlisted flags');
});

test('Progress state initializes with safe defaults and zero personal data', () => {
  localStorage.clear();
  const state = loadProgress();

  assert.strictEqual(state.version, 1);
  assert.strictEqual(state.lang, 'hi');
  assert.strictEqual(typeof state.stones, 'object');
  assert.strictEqual(typeof state.zones, 'object');
});

test('Progress persistence saves and flushes properly to localStorage', () => {
  localStorage.clear();
  const state = loadProgress();
  const key = progressKey('maths-1', 8);
  state.stones[key] = { bestScore: 3, totalQuestions: 3, stars: 3, attempts: 1 };

  saveProgress(state);
  flushProgress();

  const retrieved = loadProgress();
  assert.ok(retrieved.stones[key], 'Key should be persisted in storage');
  assert.strictEqual(retrieved.stones[key].bestScore, 3);
  assert.strictEqual(retrieved.stones[key].stars, 3);
});

test('Curriculum index covers grades 1 to 8 with comprehensive STEM topics', () => {
  assert.deepStrictEqual(GRADES, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(BOARD.title.hi && BOARD.title.en);

  for (const grade of GRADES) {
    const topicHeaders = topicsForGrade(grade);
    assert.ok(Array.isArray(topicHeaders), `Grade ${grade} topics must be an array`);
    assert.ok(topicHeaders.length > 0, `Grade ${grade} must have topics`);

    for (const header of topicHeaders) {
      assert.ok(header.id, `Topic header must have id`);
      const topic = getTopic(header.id, grade);
      assert.ok(topic, `Topic ${header.id} must resolve for grade ${grade}`);
      assert.ok(topic.title.hi && topic.title.en, `Topic ${topic.id} must have both titles`);
      assert.ok(Array.isArray(topic.questions) && topic.questions.length > 0, `Topic ${topic.id} must have questions`);

      for (const q of topic.questions) {
        assert.ok(q.text.hi && q.text.en, `Question in ${header.id} must have both languages`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Question options must have >= 2 items`);
        for (const opt of q.options) {
          assert.ok(opt.hi && opt.en, `Option in ${header.id} must have both languages`);
        }
        assert.ok(typeof q.answer === 'number', `Question in ${header.id} must have answer index`);
        assert.ok(q.hint.hi && q.hint.en, `Question in ${header.id} must provide both hints`);
        assert.ok(q.explain.hi && q.explain.en, `Question in ${header.id} must provide both explanations`);
      }
    }
  }
});

test('Topic lookup by stoneId resolves correctly', () => {
  const topicG8 = getTopic('maths-1', 8);
  assert.ok(topicG8, 'Should locate grade 8 maths-1 topic');
  assert.strictEqual(topicG8.subject, 'maths');
  assert.ok(topicG8.title.hi && topicG8.title.en);
});
