// Learning Board Modal (गुरु पटल) at the Hub Island
import { BOARD, getGrade, setGrade, GRADES } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
import { playClickSound, speakText, stopSpeaking } from './audio.js';

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
    modalEl.className = 'ss-modal-backdrop';

    modalEl.innerHTML = `
      <div class="ss-modal" role="dialog" aria-modal="true">
        <div class="ss-modal-header">
          <div class="ss-modal-title-group">
            <span class="ss-badge ss-badge-hub">🏛 ${lang === 'hi' ? 'केंद्र' : 'Hub'}</span>
            <h2 class="ss-modal-title">${title}</h2>
          </div>
          <button class="ss-close-btn" aria-label="Close" id="ss-board-close">&times;</button>
        </div>

        <div class="ss-modal-body">
          <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px;">
              <h3 style="margin:0; font-size:1.1rem; color:var(--accent-gold);">
                ${lang === 'hi' ? 'नमस्ते शिक्षार्थी!' : 'Welcome Learner!'}
              </h3>
              <button class="ss-audio-btn" id="ss-board-audio" type="button">
                <span>🔊</span> <span>${t('quiz.listen')}</span>
              </button>
            </div>
            <p style="font-size:0.95rem; line-height:1.6; color:#fff; white-space:pre-line; margin:0;">
              ${body}
            </p>
          </div>

          <!-- Grade Selector -->
          <div style="margin-bottom:16px;">
            <div style="font-size:0.86rem; color:var(--text-muted); margin-bottom:8px;">
              ${lang === 'hi' ? 'आप किस कक्षा में पढ़ते हैं? (कक्षा चुनें):' : 'Select your class/grade:'}
            </div>
            <div class="ss-grade-bar">
              ${GRADES.map((g) => `
                <button class="ss-grade-chip ${g === currentGrade ? 'active' : ''}" data-grade="${g}" type="button">
                  ${lang === 'hi' ? 'कक्षा' : 'Class'} ${g}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Quick Navigation Cards -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;">
            <div style="background:rgba(127, 227, 196, 0.1); border:1px solid rgba(127, 227, 196, 0.3); border-radius:var(--radius-md); padding:12px;">
              <div style="font-size:0.9rem; font-weight:700; color:var(--accent-cyan); margin-bottom:4px;">
                📐 ${t('zone.maths')}
              </div>
              <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">
                ${lang === 'hi' ? 'पश्चिम पुल पार करें: 4 गणितीय संप्रदाय।' : 'Cross west bridge: 4 maths topics.'}
              </p>
            </div>
            <div style="background:rgba(242, 179, 90, 0.1); border:1px solid rgba(242, 179, 90, 0.3); border-radius:var(--radius-md); padding:12px;">
              <div style="font-size:0.9rem; font-weight:700; color:var(--accent-amber); margin-bottom:4px;">
                🔬 ${t('zone.science')}
              </div>
              <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">
                ${lang === 'hi' ? 'पूर्व पुल पार करें: 4 विज्ञान विषय।' : 'Cross east bridge: 4 science topics.'}
              </p>
            </div>
          </div>
        </div>

        <div class="ss-modal-footer" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <button class="ss-btn-secondary" id="ss-board-progress-btn" type="button">
            📊 ${t('progress.title')} [P]
          </button>
          <button class="ss-btn-primary" id="ss-board-done-btn" type="button">
            ${lang === 'hi' ? 'सीखना शुरू करें' : 'Start Exploring'}
          </button>
        </div>
      </div>
    `;

    // Wire events
    modalEl.querySelector('#ss-board-close').addEventListener('click', close);
    modalEl.querySelector('#ss-board-done-btn').addEventListener('click', close);

    modalEl.querySelector('#ss-board-audio').addEventListener('click', () => {
      playClickSound();
      speakText(body, lang);
    });

    modalEl.querySelector('#ss-board-progress-btn').addEventListener('click', () => {
      playClickSound();
      close();
      if (onOpenProgress) onOpenProgress();
    });

    modalEl.querySelectorAll('.ss-grade-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        playClickSound();
        const g = parseInt(chip.getAttribute('data-grade'), 10);
        setGrade(g);
        open();
      });
    });

    container.appendChild(modalEl);
  }

  // Close on Escape key
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
