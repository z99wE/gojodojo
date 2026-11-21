// Heads-Up Display (HUD) overlay for 3D exploration and quick actions
import { getGrade, getTopic } from '../content/index.js';
import { t, getLang, setLang } from '../i18n/index.js';
import { playClickSound } from './audio.js';

export function createHUD({ container, onOpenProgress, onLanguageChange }) {
  const hudContainer = document.createElement('div');
  hudContainer.id = 'ss-hud-root';

  let currentPromptStone = null;

  function render() {
    const lang = getLang();
    const currentGrade = getGrade();

    hudContainer.innerHTML = `
      <div class="ss-hud-top">
        <div style="display:flex; align-items:center; gap:8px; pointer-events:auto;">
          <button class="ss-hud-btn" id="ss-hud-grade-btn" type="button" title="${lang === 'hi' ? 'कक्षा बदलें' : 'Change Grade'}">
            <span>🏫</span> <span>${lang === 'hi' ? 'कक्षा' : 'Class'} ${currentGrade}</span>
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:8px; pointer-events:auto;">
          <span class="ss-offline-badge" style="background:rgba(15,31,27,0.85); box-shadow:0 2px 8px rgba(0,0,0,0.3);">
            ${t('hud.offline')}
          </span>
          <button class="ss-hud-btn ss-hud-btn-primary" id="ss-hud-progress-btn" type="button" title="${t('hud.progress')}">
            <span>📊</span> <span>${t('hud.progress')}</span>
          </button>
          <button class="ss-hud-btn" id="ss-hud-lang-btn" type="button">
            <span>🌐</span> <span>${lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      <div class="ss-interaction-banner" id="ss-stone-prompt-banner" style="display:none;">
        <span style="background:var(--accent-gold); color:#0f1f1b; font-weight:800; padding:2px 8px; border-radius:4px; font-size:0.85rem;">E</span>
        <span id="ss-prompt-text"></span>
      </div>
    `;

    // Wire events
    hudContainer.querySelector('#ss-hud-progress-btn').addEventListener('click', () => {
      playClickSound();
      if (onOpenProgress) onOpenProgress();
    });

    hudContainer.querySelector('#ss-hud-grade-btn').addEventListener('click', () => {
      playClickSound();
      if (onOpenProgress) onOpenProgress('learner');
    });

    hudContainer.querySelector('#ss-hud-lang-btn').addEventListener('click', () => {
      playClickSound();
      const nextLang = lang === 'hi' ? 'en' : 'hi';
      setLang(nextLang);
      render();
      if (onLanguageChange) onLanguageChange(nextLang);
    });

    updatePromptDisplay();
  }

  function setPrompt(stone) {
    if (currentPromptStone === stone) return;
    currentPromptStone = stone;
    updatePromptDisplay();
  }

  function updatePromptDisplay() {
    const banner = hudContainer.querySelector('#ss-stone-prompt-banner');
    const textEl = hudContainer.querySelector('#ss-prompt-text');
    if (!banner || !textEl) return;

    if (!currentPromptStone) {
      banner.style.display = 'none';
      return;
    }

    const lang = getLang();
    const currentGrade = getGrade();

    if (currentPromptStone.id === 'hub-1') {
      textEl.textContent = lang === 'hi'
        ? 'गुरु पटल (Learning Board) देखने के लिए दबाएँ'
        : 'Press to open Learning Board';
    } else {
      const topic = getTopic(currentPromptStone.id, currentGrade);
      const title = topic?.title?.[lang] || topic?.title?.hi || currentPromptStone.topic;
      textEl.textContent = lang === 'hi'
        ? `"${title}" सीखने के लिए दबाएँ`
        : `Press to practice "${title}"`;
    }

    banner.style.display = 'flex';
  }

  render();
  container.appendChild(hudContainer);

  return {
    setPrompt,
    update: render,
    destroy() {
      if (hudContainer.parentNode) hudContainer.parentNode.removeChild(hudContainer);
    },
  };
}
