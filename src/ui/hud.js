// GTA Vice City Style Radar & South Korean Pastel RPG HUD
import { getGrade, getTopic } from '../content/index.js';
import { t, getLang, setLang } from '../i18n/index.js';
import { playButtonPopSound } from './audio.js';
import { sanitizeHtml } from './sanitize.js';

export function createHUD({
  container,
  onOpenProgress,
  onLanguageChange,
  getController,
  getWorld,
}) {
  const hudContainer = document.createElement('div');
  hudContainer.id = 'ss-hud-root';

  let currentPromptStone = null;
  let playerGold = 50;
  let playerXP = 120;
  let playerLevel = 1;
  let playerStreak = 1;

  // Read saved gold/XP if available
  try {
    const savedStats = localStorage.getItem('ss-rpg-stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      playerGold = parsed.gold ?? 50;
      playerXP = parsed.xp ?? 120;
      playerLevel = Math.floor(playerXP / 100) + 1;
      playerStreak = parsed.streak ?? 1;
    }
  } catch (e) {
    void e;
  }

  function saveStats() {
    try {
      localStorage.setItem(
        'ss-rpg-stats',
        JSON.stringify({ gold: playerGold, xp: playerXP, streak: playerStreak })
      );
    } catch (e) {
      void e;
    }
  }

  function addGold(amount) {
    playerGold += amount;
    playerXP += amount * 2;
    playerLevel = Math.floor(playerXP / 100) + 1;
    saveStats();
    showFloatingReward(`+${amount} 🪙`);
    updateStatsDisplay();
  }

  function addQuizReward(stars, score) {
    const earnedGold = score * 15;
    const earnedXP = score * 30;
    playerGold += earnedGold;
    playerXP += earnedXP;
    playerLevel = Math.floor(playerXP / 100) + 1;
    playerStreak += 1;
    saveStats();
    showFloatingReward(`+${earnedXP} XP! ⭐`);
    updateStatsDisplay();
  }

  function render() {
    const lang = getLang();
    const currentGrade = getGrade();
    const levelTitle = lang === 'hi' ? 'दक्षता स्तर' : 'Rank';
    const xpNext = playerLevel * 100;
    const xpCurrent = playerXP % 100;

    hudContainer.innerHTML = sanitizeHtml(`
      <!-- Top RPG Navigation Bar -->
      <div class="ss-hud-top-bar">
        <!-- Player Level & Treasury Card (Left) -->
        <div class="ss-rpg-player-card">
          <div class="ss-rpg-avatar">🧑‍🎓</div>
          <div class="ss-rpg-info">
            <div class="ss-rpg-level-row">
              <span class="ss-rpg-level-badge">LVL ${playerLevel}</span>
              <span class="ss-rpg-rank-title">${levelTitle} ${playerLevel}</span>
            </div>
            <div class="ss-rpg-xp-track">
              <div class="ss-rpg-xp-fill" style="width: ${xpCurrent}%"></div>
            </div>
          </div>
          <div class="ss-rpg-currency">
            <span class="ss-coin-badge">🪙 ${playerGold}</span>
            <span class="ss-streak-badge">🔥 ${playerStreak}x</span>
          </div>
        </div>

        <!-- GTA Active Mission Pill (Center) -->
        <div class="ss-gta-mission-pill" id="ss-gta-mission-bar">
          <span class="ss-mission-icon">🎯</span>
          <span class="ss-mission-text" id="ss-active-mission-title">
            ${
              lang === 'hi'
                ? 'मिशन: सोने के सिक्के इकट्ठा करें और गणित द्वीप पर जाएँ!'
                : 'MISSION: Collect gold star coins & cross to Maths Isle!'
            }
          </span>
        </div>

        <!-- Quick Game Toggles (Right) -->
        <div class="ss-hud-actions-right">
          <button class="ss-clay-btn ss-clay-grade-btn" id="ss-hud-grade-btn" type="button">
            <span>🏫</span> <span>${lang === 'hi' ? 'कक्षा' : 'Class'} ${currentGrade}</span>
          </button>
          <button class="ss-clay-btn ss-clay-progress-btn" id="ss-hud-progress-btn" type="button" title="${t('hud.progress')}">
            <span>📜</span> <span>${lang === 'hi' ? 'साहसिक डायरी' : 'Log'} [P]</span>
          </button>
          <button class="ss-clay-btn ss-clay-lang-btn" id="ss-hud-lang-btn" type="button">
            <span>🌐</span> <span>${lang === 'hi' ? 'EN' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      <!-- Proximity GTA Style Interaction Banner -->
      <div class="ss-gta-prompt-bubble" id="ss-stone-prompt-banner" style="display:none;">
        <div class="ss-prompt-key">E</div>
        <div class="ss-prompt-desc">
          <span class="ss-prompt-sub" id="ss-prompt-sub">ज्ञान का चमकता पत्थर</span>
          <strong class="ss-prompt-main" id="ss-prompt-text"></strong>
        </div>
      </div>

      <!-- GTA Style Minimap Radar (Bottom Left) -->
      <div class="ss-gta-radar-container">
        <canvas id="ss-radar-canvas" width="130" height="130"></canvas>
        <div class="ss-radar-hud-label">
          <span>SANKHYA RADAR</span>
        </div>
      </div>

      <!-- Floating Reward Container -->
      <div id="ss-floating-rewards-layer"></div>
    `);

    // Wire events
    hudContainer.querySelector('#ss-hud-progress-btn').addEventListener('click', () => {
      playButtonPopSound();
      if (onOpenProgress) onOpenProgress();
    });

    hudContainer.querySelector('#ss-hud-grade-btn').addEventListener('click', () => {
      playButtonPopSound();
      if (onOpenProgress) onOpenProgress('learner');
    });

    hudContainer.querySelector('#ss-hud-lang-btn').addEventListener('click', () => {
      playButtonPopSound();
      const nextLang = lang === 'hi' ? 'en' : 'hi';
      setLang(nextLang);
      render();
      if (onLanguageChange) onLanguageChange(nextLang);
    });

    updatePromptDisplay();
  }

  function updateStatsDisplay() {
    const coinBadge = hudContainer.querySelector('.ss-coin-badge');
    const xpFill = hudContainer.querySelector('.ss-rpg-xp-fill');
    const lvlBadge = hudContainer.querySelector('.ss-rpg-level-badge');
    if (coinBadge) coinBadge.textContent = `🪙 ${playerGold}`;
    if (lvlBadge) lvlBadge.textContent = `LVL ${playerLevel}`;
    if (xpFill) xpFill.style.width = `${playerXP % 100}%`;
  }

  function showFloatingReward(text) {
    const layer = hudContainer.querySelector('#ss-floating-rewards-layer');
    if (!layer) return;

    const el = document.createElement('div');
    el.className = 'ss-floating-reward-pop';
    el.textContent = text;
    el.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
    el.style.bottom = '160px';
    layer.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1400);
  }

  function setPrompt(stone) {
    if (currentPromptStone === stone) return;
    currentPromptStone = stone;
    updatePromptDisplay();
  }

  function updatePromptDisplay() {
    const banner = hudContainer.querySelector('#ss-stone-prompt-banner');
    const textEl = hudContainer.querySelector('#ss-prompt-text');
    const subEl = hudContainer.querySelector('#ss-prompt-sub');
    if (!banner || !textEl) return;

    if (!currentPromptStone) {
      banner.style.display = 'none';
      return;
    }

    const lang = getLang();
    const currentGrade = getGrade();

    if (currentPromptStone.id === 'hub-1') {
      subEl.textContent = lang === 'hi' ? 'केंद्रीय ज्ञान पटल' : 'Central Learning Board';
      textEl.textContent = lang === 'hi' ? 'गुरु पटल खोलें (Press E)' : 'Open Guru Board (Press E)';
    } else {
      const topic = getTopic(currentPromptStone.id, currentGrade);
      const title = topic?.title?.[lang] || topic?.title?.hi || currentPromptStone.topic;
      const subj = currentPromptStone.zone === 'maths' ? '📐 GANIT' : '🔬 VIGYAN';
      subEl.textContent = `${subj} • ${lang === 'hi' ? 'कक्षा' : 'Class'} ${currentGrade}`;
      textEl.textContent = lang === 'hi' ? `चुनौती: ${title}` : `Challenge: ${title}`;
    }

    banner.style.display = 'flex';
  }

  // Draw the GTA-style Minimap Radar in real-time
  function updateRadar() {
    const canvas = hudContainer.querySelector('#ss-radar-canvas');
    if (!canvas || !getController || !getWorld) return;
    const ctx = canvas.getContext('2d');
    const controller = getController();
    const world = getWorld();
    if (!controller || !world) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w / 2 - 4;

    ctx.clearRect(0, 0, w, h);

    // Save clip region for circular radar
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Dark radar sea background
    ctx.fillStyle = 'rgba(25, 18, 38, 0.88)';
    ctx.fillRect(0, 0, w, h);

    // Radar concentric distance rings
    ctx.strokeStyle = 'rgba(216, 180, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Radar scale: world units to radar pixels
    const scale = 1.35;
    const px = controller.position.x;
    const pz = controller.position.z;
    const yaw = controller.getYaw ? controller.getYaw() : 0;

    // Helper to project world coord to radar relative to player orientation
    function toRadar(wx, wz) {
      const dx = wx - px;
      const dz = wz - pz;
      // Rotate by player yaw so radar is heading-up (GTA style)
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      const rx = (dx * cos - dz * sin) * scale;
      const ry = (dx * sin + dz * cos) * scale;
      return { x: cx + rx, y: cy + ry };
    }

    // Draw Islands outlines on radar
    // 1. Hub Island (0, 0)
    const hubCenter = toRadar(0, 0);
    ctx.fillStyle = 'rgba(255, 240, 245, 0.25)';
    ctx.beginPath();
    ctx.arc(hubCenter.x, hubCenter.y, 14 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 2. Maths Island (-38, -6)
    const mathsCenter = toRadar(-38, -6);
    ctx.fillStyle = 'rgba(179, 157, 219, 0.28)';
    ctx.beginPath();
    ctx.arc(mathsCenter.x, mathsCenter.y, 14 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 3. Science Island (38, -6)
    const sciCenter = toRadar(38, -6);
    ctx.fillStyle = 'rgba(165, 214, 167, 0.28)';
    ctx.beginPath();
    ctx.arc(sciCenter.x, sciCenter.y, 14 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw Bridges
    ctx.strokeStyle = 'rgba(238, 214, 196, 0.4)';
    ctx.lineWidth = 3;
    const b1a = toRadar(-25, -3);
    const b1b = toRadar(-14, -3);
    ctx.beginPath();
    ctx.moveTo(b1a.x, b1a.y);
    ctx.lineTo(b1b.x, b1b.y);
    ctx.stroke();

    const b2a = toRadar(14, -3);
    const b2b = toRadar(25, -3);
    ctx.beginPath();
    ctx.moveTo(b2a.x, b2a.y);
    ctx.lineTo(b2b.x, b2b.y);
    ctx.stroke();

    // Draw Collectible Coins blips (small gold dots)
    if (world.coins) {
      ctx.fillStyle = '#ffd166';
      for (const coin of world.coins) {
        if (!coin.collected) {
          const pt = toRadar(coin.x, coin.z);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw Challenge Stones blips
    if (world.stones) {
      for (const stone of world.stones) {
        const pt = toRadar(stone.position.x, stone.position.z);
        ctx.beginPath();
        if (stone.id === 'hub-1') {
          ctx.fillStyle = '#ffb703';
          ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        } else if (stone.zone === 'maths') {
          ctx.fillStyle = '#80deea';
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = '#ffb7b2';
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw Player Arrow at Radar Center (Pointing straight up because radar is heading-up)
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 5, cy + 6);
    ctx.lineTo(cx, cy + 3);
    ctx.lineTo(cx - 5, cy + 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Radar Outer Ring (Pastel Lavender)
    ctx.strokeStyle = '#d8b4f8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  render();
  container.appendChild(hudContainer);

  return {
    setPrompt,
    update: render,
    updateRadar,
    addGold,
    addQuizReward,
    destroy() {
      if (hudContainer.parentNode) hudContainer.parentNode.removeChild(hudContainer);
    },
  };
}
