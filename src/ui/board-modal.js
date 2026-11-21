// Learning Board Modal (गुरु पटल) at the Hub Island - South Korean Pastel RPG Edition
import { BOARD, getGrade, setGrade, GRADES } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
import { playClickSound, speakText, stopSpeaking } from './audio.js';
import { sanitizeHtml } from './sanitize.js';

export function createBoardModal({ container, onClose, onOpenProgress }) {
  let modalEl = null;

  function close() {
    stopSpeaking();
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
      modalEl = null;
    }
    if (onClose) onClose();
  }

  function open() {
    close();
    const lang = getLang();
    const currentGrade = getGrade();

    const title = BOARD.title[lang] || BOARD.title.hi;
    const body = BOARD.body[lang] || BOARD.body.hi;

    modalEl = document.createElement('div');
    modalEl.className = 'ss-clay-backdrop';

    modalEl.innerHTML = sanitizeHtml(`
      <div class="ss-clay-modal" role="dialog" aria-modal="true">
        <!-- Header -->
        <div class="ss-clay-header ss-header-hub">
          <div class="ss-mascot-avatar">🏛️</div>
          <div class="ss-clay-title-wrap">
            <span class="ss-clay-pill ss-pill-hub">${lang === 'hi' ? 'केंद्रीय गिल्ड हॉल' : 'Central Guild Hall'}</span>
            <h2 class="ss-clay-title">${title}</h2>
          </div>
          <button class="ss-clay-close" aria-label="Close" id="ss-board-close">✕</button>
        </div>

        <div class="ss-clay-body">
          <div class="ss-clay-card" style="border-left: 6px solid #ffa502;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
              <div>
                <h3 style="margin:0 0 4px 0; font-size:1.2rem; color:#ff4757; font-weight:800;">
                  ${lang === 'hi' ? 'नमस्ते युवा साहसी! 🌸' : 'Welcome Young Adventurer! 🌸'}
                </h3>
                <span style="font-size:0.86rem; color:#7d6c8f; font-weight:600;">
                  ${lang === 'hi' ? 'संख्या स्ट्राइक की दुनिया में आपका स्वागत है' : 'Welcome to the world of Sankhya Strike'}
                </span>
              </div>
              <button class="ss-clay-audio-btn" id="ss-board-audio" type="button">
                <span>🔊</span> <span>${t('quiz.listen')}</span>
              </button>
            </div>
            <p style="font-size:1rem; line-height:1.6; color:#2d2438; white-space:pre-line; margin:0; font-weight:600;">
              ${body}
            </p>
          </div>

          <!-- Grade Level Selector -->
          <div style="margin:16px 0;">
            <div style="font-size:0.9rem; font-weight:700; color:#5f4577; margin-bottom:8px;">
              ${lang === 'hi' ? 'कक्षा स्तर चुनें (Grade Selection):' : 'Select Grade Level:'}
            </div>
            <div class="ss-grade-chips">
              ${GRADES.map((g) => `
                <button class="ss-grade-btn ${g === currentGrade ? 'active' : ''}" data-grade="${g}" type="button">
                  ${lang === 'hi' ? 'कक्षा' : 'Grade'} ${g}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Island Guide Cards -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
            <div class="ss-clay-card" style="padding:14px; background:#f7f1ff; border:2px solid #d4bbff;">
              <div style="font-size:0.95rem; font-weight:800; color:#7d5fff; margin-bottom:4px;">
                📐 ${t('zone.maths')}
              </div>
              <p style="font-size:0.82rem; color:#635274; margin:0; line-height:1.4; font-weight:500;">
                ${lang === 'hi' ? 'पश्चिम पुल पार करें: 4 गणितीय चुनौतियाँ।' : 'Cross west bridge: 4 maths challenges.'}
              </p>
            </div>
            <div class="ss-clay-card" style="padding:14px; background:#f0fff4; border:2px solid #b7eb8f;">
              <div style="font-size:0.95rem; font-weight:800; color:#2ed573; margin-bottom:4px;">
                🔬 ${t('zone.science')}
              </div>
              <p style="font-size:0.82rem; color:#635274; margin:0; line-height:1.4; font-weight:500;">
                ${lang === 'hi' ? 'पूर्व पुल पार करें: 4 विज्ञान चुनौतियाँ।' : 'Cross east bridge: 4 science challenges.'}
              </p>
            </div>
          </div>
        </div>

        <div class="ss-clay-footer" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <button class="ss-chip-action" id="ss-board-progress-btn" type="button">
            📜 ${t('progress.title')} [P]
          </button>
          <button class="ss-clay-primary-btn" id="ss-board-done-btn" type="button">
            ${lang === 'hi' ? 'साहसिक खोज जारी रखें ➔' : 'Continue Adventure ➔'}
          </button>
        </div>
      </div>
    `);

    // Wire events safely
    const closeBtn = modalEl.querySelector('#ss-board-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const doneBtn = modalEl.querySelector('#ss-board-done-btn');
    if (doneBtn) doneBtn.addEventListener('click', close);

    const audioBtn = modalEl.querySelector('#ss-board-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        playClickSound();
        speakText(body, lang);
      });
    }

    const progBtn = modalEl.querySelector('#ss-board-progress-btn');
    if (progBtn) {
      progBtn.addEventListener('click', () => {
        playClickSound();
        close();
        if (onOpenProgress) onOpenProgress();
      });
    }

    modalEl.querySelectorAll('.ss-grade-btn').forEach((chip) => {
      chip.addEventListener('click', () => {
        playClickSound();
        const g = parseInt(chip.getAttribute('data-grade'), 10);
        setGrade(g);
        open();
      });
    });

    container.appendChild(modalEl);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && modalEl) {
      close();
    }
  }
  window.addEventListener('keydown', handleKeyDown);

  return {
    open,
    close,
    isOpen: () => !!modalEl,
  };
}
