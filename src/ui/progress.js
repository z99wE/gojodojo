// South Korean Pastel RPG Adventure Log (Learner, Parent & Teacher Views)
import { GRADES, getGrade, setGrade, topicsForGrade, progressKey } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
import { loadProgress } from '../save.js';
import { playClickSound, speakText, stopSpeaking } from './audio.js';
import { sanitizeHtml } from './sanitize.js';

export function createProgressModal({ container, onClose, onOpenTopic }) {
  let modalEl = null;
  let activeTab = 'learner';
  let currentGrade = getGrade();

  function close() {
    stopSpeaking();
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
      modalEl = null;
    }
    if (onClose) onClose();
  }

  function open(preferredTab = 'learner') {
    close();
    activeTab = preferredTab;
    currentGrade = getGrade();

    modalEl = document.createElement('div');
    modalEl.className = 'ss-clay-backdrop';

    render();
    container.appendChild(modalEl);
  }

  function render() {
    const lang = getLang();
    const progress = loadProgress();
    const topics = topicsForGrade(currentGrade);

    let completedCount = 0;
    let totalScore = 0;
    let maxPossible = 0;
    const focusTopics = [];

    const topicStats = topics.map((tItem) => {
      const key = progressKey(tItem.id, currentGrade);
      const data = progress.stones?.[key];
      const isDone = !!data?.completed;
      const score = data?.score || 0;
      const total = data?.total || 3;
      if (isDone) {
        completedCount++;
        totalScore += score;
        maxPossible += total;
        if (score < total) {
          focusTopics.push(tItem);
        }
      }
      return {
        ...tItem,
        isDone,
        score,
        total,
        attempts: data?.attempts || (isDone ? 1 : 0),
        mistakes: data?.mistakes || [],
      };
    });

    const accuracyPct = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    const totalTopics = topics.length;

    modalEl.innerHTML = sanitizeHtml(`
      <div class="ss-clay-modal ss-progress-modal" role="dialog" aria-modal="true">
        <!-- Header -->
        <div class="ss-clay-header ss-header-hub">
          <div class="ss-mascot-avatar">[LOG]</div>
          <div class="ss-clay-title-wrap">
            <span class="ss-tactical-tag">${lang === 'hi' ? 'सत्यापन डायरी' : 'VERIFICATION TELEMETRY'}</span>
            <h2 class="ss-clay-title">${t('progress.title')}</h2>
          </div>
          <button class="ss-clay-close" aria-label="Close" id="ss-progress-close">&times;</button>
        </div>

        <div class="ss-clay-body">
          <!-- 3 Tactical Role Tabs -->
          <div class="ss-clay-tabs">
            <button class="ss-clay-tab ${activeTab === 'learner' ? 'active' : ''}" data-tab="learner" type="button">
              <span>${t('progress.learner')}</span>
            </button>
            <button class="ss-clay-tab ${activeTab === 'parent' ? 'active' : ''}" data-tab="parent" type="button">
              <span>${t('progress.parent')}</span>
            </button>
            <button class="ss-clay-tab ${activeTab === 'teacher' ? 'active' : ''}" data-tab="teacher" type="button">
              <span>${t('progress.teacher')}</span>
            </button>
          </div>

          <!-- Grade Selector Chips -->
          <div class="ss-grade-scroll">
            <span class="ss-grade-hint">${lang === 'hi' ? 'कक्षा चुनें:' : 'Grade:'}</span>
            <div class="ss-grade-chips">
              ${GRADES.map((g) => `
                <button class="ss-grade-btn ${g === currentGrade ? 'active' : ''}" data-grade="${g}" type="button">
                  ${lang === 'hi' ? 'कक्षा' : 'Grade'} ${g}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Dynamic Tab Content -->
          <div id="ss-tab-content">
            ${
              activeTab === 'learner'
                ? renderLearnerView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats, focusTopics })
                : activeTab === 'parent'
                  ? renderParentView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats })
                  : renderTeacherView({ lang, currentGrade, completedCount, totalTopics, totalScore, accuracyPct, topicStats })
            }
          </div>
        </div>

        <div class="ss-clay-footer" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <span class="ss-offline-badge-clay">
            [OFFLINE] ${lang === 'hi' ? '100% ऑफ़लाइन सुरक्षित (0 KB डेटा)' : '100% Offline (0 KB Data)'}
          </span>
          <button class="ss-clay-primary-btn" id="ss-progress-done-btn" type="button">
            ${lang === 'hi' ? 'द्वीप पर लौटें' : 'Return to Island'}
          </button>
        </div>
      </div>
    `);

    // Wire events safely
    const closeBtn = modalEl.querySelector('#ss-progress-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    const doneBtn = modalEl.querySelector('#ss-progress-done-btn');
    if (doneBtn) doneBtn.addEventListener('click', close);

    // Tab buttons
    modalEl.querySelectorAll('.ss-clay-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        playClickSound();
        activeTab = tabBtn.getAttribute('data-tab');
        render();
      });
    });

    // Grade selector
    modalEl.querySelectorAll('.ss-grade-btn').forEach((gBtn) => {
      gBtn.addEventListener('click', () => {
        playClickSound();
        const g = parseInt(gBtn.getAttribute('data-grade'), 10);
        setGrade(g);
        currentGrade = g;
        render();
      });
    });

    // Topic practice buttons
    modalEl.querySelectorAll('.ss-quest-play-btn').forEach((pBtn) => {
      pBtn.addEventListener('click', () => {
        playClickSound();
        const topicId = pBtn.getAttribute('data-id');
        close();
        if (onOpenTopic) onOpenTopic(topicId, currentGrade);
      });
    });

    // Parent Voice Aloud
    const parentVoiceBtn = modalEl.querySelector('#ss-parent-voice-btn');
    if (parentVoiceBtn) {
      let speakingParent = false;
      parentVoiceBtn.addEventListener('click', () => {
        playClickSound();
        if (speakingParent) {
          stopSpeaking();
          speakingParent = false;
          parentVoiceBtn.innerHTML = sanitizeHtml(`<span>[AUDIO]</span> <span>${t('progress.parentVoiceSummary')}</span>`);
        } else {
          speakingParent = true;
          parentVoiceBtn.innerHTML = sanitizeHtml(`<span>[STOP]</span> <span>${t('quiz.stopAudio')}</span>`);
          const spokenText = lang === 'hi'
            ? `अभिभावक रिपोर्ट: आपके बच्चे ने कक्षा ${currentGrade} में कुल ${totalTopics} में से ${completedCount} अध्याय पूरे कर लिए हैं। बच्चे की शुद्धता ${accuracyPct} प्रतिशत है। बच्चे ने बहुत मन लगाकर अभ्यास किया है। आज शाम बच्चे की पीठ थपथपाएँ और उन्हें शाबाशी दें!`
            : `Parent Report: Your child has completed ${completedCount} out of ${totalTopics} topics in Class ${currentGrade} with an accuracy of ${accuracyPct} percent. Your child is making steady progress!`;
          speakText(spokenText, lang);
        }
      });
    }

    // Teacher Copy WhatsApp Report
    const teacherCopyBtn = modalEl.querySelector('#ss-teacher-copy-btn');
    if (teacherCopyBtn) {
      teacherCopyBtn.addEventListener('click', () => {
        playClickSound();
        const reportText = generateWhatsAppReport({
          grade: currentGrade,
          completedCount,
          totalTopics,
          accuracyPct,
          topicStats,
          lang,
        });

        navigator.clipboard.writeText(reportText).then(() => {
          teacherCopyBtn.textContent = '[COPIED] ' + t('progress.reportCopied');
          setTimeout(() => {
            if (teacherCopyBtn) teacherCopyBtn.textContent = t('progress.shareReport');
          }, 3000);
        }).catch(() => {
          alert(reportText);
        });
      });
    }
  }

  // Learner View Template (RPG Skill Tree & Quests)
  function renderLearnerView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats, focusTopics }) {
    const mathsTopics = topicStats.filter((t) => t.subject === 'maths');
    const scienceTopics = topicStats.filter((t) => t.subject === 'science');

    const badges = [
      { code: 'STR', name: lang === 'hi' ? 'आरंभक' : 'Starter', unlocked: completedCount >= 1 },
      { code: 'MTH', name: lang === 'hi' ? 'गणित नायक' : 'Maths Knight', unlocked: mathsTopics.every((t) => t.isDone) },
      { code: 'SCI', name: lang === 'hi' ? 'विज्ञान खोजी' : 'Science Scout', unlocked: scienceTopics.every((t) => t.isDone) },
      { code: 'EXP', name: lang === 'hi' ? 'कक्षा विजेता' : 'Class Champion', unlocked: completedCount === totalTopics && totalTopics > 0 },
    ];

    return `
      <!-- Stats Summary -->
      <div class="ss-rpg-stat-grid">
        <div class="ss-rpg-stat-box">
          <div class="ss-stat-num">${completedCount} / ${totalTopics}</div>
          <div class="ss-stat-label">${t('progress.topicsDone')}</div>
        </div>
        <div class="ss-rpg-stat-box">
          <div class="ss-stat-num">${totalScore}</div>
          <div class="ss-stat-label">${t('progress.totalStars')}</div>
        </div>
        <div class="ss-rpg-stat-box">
          <div class="ss-stat-num">${accuracyPct}%</div>
          <div class="ss-stat-label">${t('progress.accuracy')}</div>
        </div>
      </div>

      <!-- Achievement Badges -->
      <div class="ss-quest-heading">
        <span>${lang === 'hi' ? 'दक्षता बैज' : 'Competency Badges'}</span>
      </div>
      <div class="ss-badges-row">
        ${badges.map((b) => `
          <div class="ss-badge-card ${b.unlocked ? 'unlocked' : 'locked'}">
            <span class="ss-badge-ico">[${b.code}]</span>
            <span class="ss-badge-name">${b.name}</span>
          </div>
        `).join('')}
      </div>

      <!-- Revision Alert if any -->
      ${focusTopics.length > 0 ? `
        <div class="ss-focus-alert">
          <div class="ss-focus-title">[!] ${t('progress.focusAreas')}</div>
          <p class="ss-focus-desc">
            ${lang === 'hi' ? 'इन अध्यायों में कुछ गलतियाँ हुई थीं, एक बार फिर मुकाबला करें:' : 'Review these challenges to achieve 100% accuracy:'}
          </p>
          <div class="ss-focus-buttons">
            ${focusTopics.map((ft) => `
              <button class="ss-chip-action ss-quest-play-btn" data-id="${ft.id}">
                ${ft.title[lang] || ft.title.hi}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Maths Isle Quests -->
      <div class="ss-quest-heading" style="color:#7d5fff;">
        <span>${t('zone.maths')} (Ganit Dweep)</span>
      </div>
      <div class="ss-quest-list">
        ${mathsTopics.map((topic) => renderQuestRow(topic, lang)).join('')}
      </div>

      <!-- Science Garden Quests -->
      <div class="ss-quest-heading" style="color:#2ed573; margin-top:20px;">
        <span>${t('zone.science')} (Vigyan Vatika)</span>
      </div>
      <div class="ss-quest-list">
        ${scienceTopics.map((topic) => renderQuestRow(topic, lang)).join('')}
      </div>
    `;
  }

  // Parent View Template (Gentle, Non-technical, Spoken Audio)
  function renderParentView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats }) {
    const completedTopics = topicStats.filter((t) => t.isDone);

    return `
      <div class="ss-parent-card">
        <div class="ss-parent-header-row">
          <div>
            <h3 class="ss-parent-greet">
              ${lang === 'hi' ? 'नमस्ते अभिभावक जी' : 'Parent Telemetry Briefing'}
            </h3>
            <p class="ss-parent-note">
              ${lang === 'hi' ? 'एक ही फोन पर बिना इंटरनेट के आपके बच्चे की सुरक्षित पढ़ाई।' : 'Your child\'s learning progress on this shared device.'}
            </p>
          </div>
          <button class="ss-clay-audio-btn" id="ss-parent-voice-btn" type="button">
            <span>${t('progress.parentVoiceSummary')}</span>
          </button>
        </div>

        <div class="ss-parent-metrics">
          <div class="ss-parent-stat">
            <span class="ss-pstat-label">${lang === 'hi' ? 'सीखे गए अध्याय' : 'Topics Studied'}</span>
            <span class="ss-pstat-val">${completedCount} / ${totalTopics}</span>
          </div>
          <div class="ss-parent-stat">
            <span class="ss-pstat-label">${lang === 'hi' ? 'समझ और परिणाम' : 'Understanding'}</span>
            <span class="ss-pstat-val" style="color:#2ed573;">${accuracyPct}% (${totalScore} pts)</span>
          </div>
        </div>
      </div>

      <div class="ss-parent-tip-box">
        <strong>${lang === 'hi' ? 'अभिभावक सुझाव:' : 'Parent Directive:'}</strong><br/>
        ${lang === 'hi'
          ? 'आज शाम बच्चे से पूछें: "तुमने आज कौन सा नया सवाल सीखा, मुझे भी सिखाओ!" बच्चे जब अपने माता-पिता को समझाते हैं, तो उनकी समझ 3 गुना पक्की हो जाती है।'
          : 'Praise your child today: "Show me one exciting problem you solved!" When kids teach what they learned, their memory retention triples.'}
      </div>

      <div class="ss-quest-heading">
        <span>${lang === 'hi' ? 'अध्ययन विवरण (Completed Topics):' : 'Completed Topics:'}</span>
      </div>
      <div class="ss-quest-list">
        ${completedTopics.length > 0
          ? completedTopics.map((ct) => `
            <div class="ss-quest-row">
              <div class="ss-quest-info">
                <span class="ss-quest-title">${ct.title[lang] || ct.title.hi}</span>
                <span class="ss-quest-sub">
                  ${ct.subject === 'maths' ? 'गणित (Maths)' : 'विज्ञान (Science)'} • ${ct.score}/${ct.total} अंक
                </span>
              </div>
              <span class="ss-quest-tag-done">[COMPLETE] पूर्ण / Mastered</span>
            </div>
          `).join('')
          : `
            <div style="text-align:center; padding:24px; color:#887a99; font-weight:600;">
              ${lang === 'hi' ? 'अभी इस कक्षा में कोई अध्याय पूरा नहीं हुआ है। बच्चे को 15 मिनट खेलने दें!' : 'No topics completed yet for this grade. Let the child explore for 15 minutes!'}
            </div>
          `}
      </div>
    `;
  }

  // Teacher / Volunteer View Template (Competency Matrix & WhatsApp Report)
  function renderTeacherView({ lang, currentGrade, completedCount, totalTopics, totalScore, accuracyPct, topicStats }) {
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; font-size:1.15rem; color:#2d2438;">
            ${lang === 'hi' ? 'राज्य शिक्षा बोर्ड पाठ्यक्रम संरेखण' : 'State Board Syllabus Alignment'}
          </h3>
          <p style="margin:2px 0 0 0; font-size:0.84rem; color:#7d6c8f;">
            NCERT / State Board Class ${currentGrade} Syllabus Matrix
          </p>
        </div>
        <button class="ss-clay-primary-btn" id="ss-teacher-copy-btn" type="button" style="font-size:0.86rem; padding:8px 16px;">
          ${t('progress.shareReport')}
        </button>
      </div>

      <div class="ss-rpg-stat-grid" style="margin-bottom:16px;">
        <div class="ss-rpg-stat-box">
          <div class="ss-stat-num">${completedCount} / ${totalTopics}</div>
          <div class="ss-stat-label">${lang === 'hi' ? 'सक्षम दक्षताएं' : 'Competencies Met'}</div>
        </div>
        <div class="ss-rpg-stat-box">
          <div class="ss-stat-num">${accuracyPct}%</div>
          <div class="ss-stat-label">${lang === 'hi' ? 'औसत शुद्धता' : 'Avg Accuracy'}</div>
        </div>
      </div>

      <div class="ss-quest-heading">
        <span>[REPORT] ${lang === 'hi' ? 'दक्षता मूल्यांकन विवरण (Diagnostic Assessment)' : 'Competency Matrix'}</span>
      </div>
      <div class="ss-quest-list">
        ${topicStats.map((tItem) => {
          const statusText = tItem.isDone
            ? `${tItem.score}/${tItem.total} (${Math.round((tItem.score / tItem.total) * 100)}%)`
            : (lang === 'hi' ? 'लंबित' : 'Pending');
          const isFull = tItem.isDone && tItem.score === tItem.total;
          return `
            <div class="ss-quest-row">
              <div class="ss-quest-info">
                <span class="ss-quest-title">${tItem.title[lang] || tItem.title.hi}</span>
                <span class="ss-quest-sub">
                  ${tItem.id} • ${tItem.subject.toUpperCase()} • प्रयास: ${tItem.attempts}
                </span>
              </div>
              <span class="ss-quest-tag-done" style="background:${isFull ? '#e6f9ed' : '#fff4e6'}; color:${isFull ? '#2ed573' : '#ffa502'};">
                ${statusText}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderQuestRow(topic, lang) {
    const isDone = topic.isDone;
    const scoreText = isDone ? `${topic.score}/${topic.total}` : '';

    return `
      <div class="ss-quest-row">
        <div class="ss-quest-info">
          <span class="ss-quest-title">${topic.title[lang] || topic.title.hi}</span>
          <span class="ss-quest-sub">
            ${isDone ? `[VERIFIED] • Score: ${scoreText}` : (lang === 'hi' ? 'मॉड्यूल प्रतीक्षारत' : 'Module Ready')}
          </span>
        </div>
        <button class="ss-clay-action-btn ss-quest-play-btn" data-id="${topic.id}" type="button">
          ${isDone ? t('quiz.retry') : t('progress.practice')}
        </button>
      </div>
    `;
  }

  function generateWhatsAppReport({ grade, completedCount, totalTopics, accuracyPct, topicStats, lang }) {
    const dateStr = new Date().toLocaleDateString('en-IN');
    const header = `*संख्या स्ट्राइक (Sankhya Strike) - टेलीमेट्री रिपोर्ट*`;
    const meta = `दिनांक: ${dateStr}\nकक्षा: ${grade}\nपूर्ण मॉड्यूल: ${completedCount}/${totalTopics} (${accuracyPct}% शुद्धता)`;
    const details = topicStats
      .filter((t) => t.isDone)
      .map((t) => `• ${t.title.hi}: ${t.score}/${t.total} अंक`)
      .join('\n');

    const footer = `\nअभिभावक/शिक्षक संदेश: नियमित 4D STEM सिमुलेशन अभ्यास जारी रखें।`;
    return `${header}\n${meta}\n\n*सत्यापित मॉड्यूल:*\n${details || '• कोई विषय अभी पूरा नहीं हुआ'}\n${footer}`;
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
