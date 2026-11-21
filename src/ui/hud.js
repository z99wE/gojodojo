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
      <!-- Top Tactical Telemetry Bar -->
      <div class="ss-hud-top-bar">
        <!-- Tactical Combat Status Card (Left) -->
        <div class="ss-tactical-status-card">
          <div class="ss-stat-meter-row">
            <span class="ss-meter-label">SHIELD</span>
            <div class="ss-meter-track"><div class="ss-meter-fill ss-shield-fill" id="ss-shield-bar" style="width: 100%"></div></div>
            <span class="ss-meter-val" id="ss-shield-text">100%</span>
          </div>
          <div class="ss-stat-meter-row">
            <span class="ss-meter-label">ENERGY</span>
            <div class="ss-meter-track"><div class="ss-meter-fill ss-energy-fill" id="ss-energy-bar" style="width: 100%"></div></div>
            <span class="ss-meter-val" id="ss-energy-text">100%</span>
          </div>
          <div class="ss-telemetry-row">
            <span class="ss-telem-chip" id="ss-telem-status">SYS: ONLINE</span>
            <span class="ss-telem-chip" id="ss-telem-coord">4D: t=0.0s</span>
          </div>
        </div>

        <!-- Tactical Active Mission Directive (Center) -->
        <div class="ss-tactical-directive-bar" id="ss-gta-mission-bar">
          <span class="ss-directive-tag">[ACTIVE STEM DIRECTIVE]</span>
          <span class="ss-mission-text" id="ss-active-mission-title">
            ${
              lang === 'hi'
                ? 'निर्देश: प्रयोगशाला टारगेट को शूट करें और भौतिकी व रसायन चक्र सक्रिय करें'
                : 'DIRECTIVE: Shoot laboratory targets to calibrate physics & chemistry loops'
            }
          </span>
        </div>

        <!-- Tactical Quick Actions (Right) -->
        <div class="ss-tactical-actions-right">
          <button class="ss-tactical-btn" id="ss-hud-grade-btn" type="button">
            ${lang === 'hi' ? 'मानक' : 'GRADE'} ${currentGrade}
          </button>
          <button class="ss-tactical-btn" id="ss-hud-progress-btn" type="button" title="${t('hud.progress')}">
            ${lang === 'hi' ? 'मिशन लॉग' : 'MISSION LOG'} [P]
          </button>
          <button class="ss-tactical-btn" id="ss-hud-lang-btn" type="button">
            ${lang === 'hi' ? 'EN' : 'हिंदी'}
          </button>
        </div>
      </div>

      <!-- Damage Vignette Flash -->
      <div class="ss-damage-vignette" id="ss-damage-vignette"></div>

      <!-- Containment Breach Alarm Banner -->
      <div class="ss-containment-alarm-banner" id="ss-containment-banner" style="display:none;">
        <div class="ss-alarm-title">[!] CONTAINMENT BREACH DETECTED</div>
        <div class="ss-alarm-desc" id="ss-alarm-desc">CRITICAL SHIELD DAMAGE: RE-CALIBRATING SYSTEM</div>
      </div>

      <!-- Proximity GTA Style Interaction Banner -->
      <div class="ss-gta-prompt-bubble" id="ss-stone-prompt-banner" style="display:none;">
        <div class="ss-prompt-key">E</div>
        <div class="ss-prompt-desc">
          <span class="ss-prompt-sub" id="ss-prompt-sub">QUANTUM APPARATUS TERMINAL</span>
          <strong class="ss-prompt-main" id="ss-prompt-text"></strong>
        </div>
      </div>

      <!-- GTA Style Minimap Radar (Bottom Left) -->
      <div class="ss-gta-radar-container">
        <canvas id="ss-radar-canvas" width="130" height="130"></canvas>
        <div class="ss-radar-hud-label">
          <span>RADAR TELEMETRY</span>
        </div>
      </div>

      <!-- Floating Reward Container -->
      <div id="ss-floating-rewards-layer"></div>
    `);

    // Wire events safely
    const progBtn = hudContainer.querySelector('#ss-hud-progress-btn');
    if (progBtn) {
      progBtn.addEventListener('click', () => {
        playButtonPopSound();
        if (onOpenProgress) onOpenProgress();
      });
    }

    const gradeBtn = hudContainer.querySelector('#ss-hud-grade-btn');
    if (gradeBtn) {
      gradeBtn.addEventListener('click', () => {
        playButtonPopSound();
        if (onOpenProgress) onOpenProgress('learner');
      });
    }

    const langBtn = hudContainer.querySelector('#ss-hud-lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        playButtonPopSound();
        const nextLang = lang === 'hi' ? 'en' : 'hi';
        setLang(nextLang);
        render();
        if (onLanguageChange) onLanguageChange(nextLang);
      });
    }

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
      const subj = currentPromptStone.zone === 'maths' ? '[MTH] GANIT' : '[SCI] VIGYAN';
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

  function setShield(hp) {
    const bar = hudContainer.querySelector('#ss-shield-bar');
    const txt = hudContainer.querySelector('#ss-shield-text');
    const clamped = Math.max(0, Math.min(100, Math.round(hp)));
    if (bar) bar.style.width = `${clamped}%`;
    if (txt) txt.textContent = `${clamped}%`;
  }

  function setEnergy(energy) {
    const bar = hudContainer.querySelector('#ss-energy-bar');
    const txt = hudContainer.querySelector('#ss-energy-text');
    const clamped = Math.max(0, Math.min(100, Math.round(energy)));
    if (bar) bar.style.width = `${clamped}%`;
    if (txt) txt.textContent = `${clamped}%`;
  }

  function setCoordinates(coordsText) {
    const el = hudContainer.querySelector('#ss-telem-coord');
    if (el) el.textContent = coordsText;
  }

  function triggerDamageFlash() {
    const vig = hudContainer.querySelector('#ss-damage-vignette');
    if (vig) {
      vig.classList.add('active');
      setTimeout(() => vig.classList.remove('active'), 280);
    }
  }

  function showContainmentWarning(title, desc, durationMs = 3500) {
    const banner = hudContainer.querySelector('#ss-containment-banner');
    if (!banner) return;
    const titleEl = banner.querySelector('.ss-alarm-title');
    const descEl = banner.querySelector('#ss-alarm-desc');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    banner.style.display = 'block';
    triggerDamageFlash();

    setTimeout(() => {
      if (banner) banner.style.display = 'none';
    }, durationMs);
  }

  function setMissionDirective(text) {
    const el = hudContainer.querySelector('#ss-active-mission-title');
    if (el) el.textContent = text;
  }

  render();
  container.appendChild(hudContainer);

  return {
    setPrompt,
    update: render,
    updateRadar,
    setShield,
    setEnergy,
    setCoordinates,
    triggerDamageFlash,
    showContainmentWarning,
    setMissionDirective,
    addGold,
    addQuizReward,
    destroy() {
      if (hudContainer.parentNode) hudContainer.parentNode.removeChild(hudContainer);
    },
  };
}
