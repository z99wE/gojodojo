// Language selection and UI string lookup.
import hi from './hi.js';
import en from './en.js';

const DICTS = { hi, en };
const STORE_KEY = 'ss-lang';

// Read the saved language on load; default to Hindi.
let current = 'hi';
try {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved === 'hi' || saved === 'en') current = saved;
} catch (e) {
  // Storage may be blocked; keep the default.
}

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = current;
}

// Look up a key in the current language, then Hindi, then return the key itself.
export function t(key) {
  const dict = DICTS[current];
  if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
  if (Object.prototype.hasOwnProperty.call(hi, key)) return hi[key];
  return key;
}

export function getLang() {
  return current;
}

// Change language. Unknown values are ignored.
export function setLang(lang) {
  if (lang !== 'hi' && lang !== 'en') return;
  current = lang;
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch (e) {
    // Storage may be full or blocked; the change still applies for this session.
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// Fill every element with a data-i18n attribute using its translated text.
export function applyDom(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}
