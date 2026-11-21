import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/i18n/en.js';
import hi from '../src/i18n/hi.js';

test('i18n catalogs have 1:1 matching keys between English and Hindi', () => {
  const enKeys = Object.keys(en).sort();
  const hiKeys = Object.keys(hi).sort();

  assert.deepStrictEqual(enKeys, hiKeys, 'Every translation key in en.js must exist in hi.js');

  for (const k of enKeys) {
    assert.ok(typeof en[k] === 'string' && en[k].trim().length > 0, `en[${k}] must be non-empty`);
    assert.ok(typeof hi[k] === 'string' && hi[k].trim().length > 0, `hi[${k}] must be non-empty`);
  }
});

test('i18n catalogs contain strictly 0 emoji characters', () => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const [k, v] of Object.entries(en)) {
    assert.strictEqual(emojiRegex.test(v), false, `en[${k}] contains forbidden emoji: "${v}"`);
  }
  for (const [k, v] of Object.entries(hi)) {
    assert.strictEqual(emojiRegex.test(v), false, `hi[${k}] contains forbidden emoji: "${v}"`);
  }
});
