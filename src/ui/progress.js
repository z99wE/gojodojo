// Progress View Modal with three dedicated perspectives: Learner, Parent, Teacher/Volunteer
import { GRADES, getGrade, setGrade, topicsForGrade, progressKey } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
import { loadProgress } from '../save.js';
import { playClickSound, speakText, stopSpeaking } from './audio.js';

export function createProgressModal({ container, onClose, onOpenTopic }) {
  let modalEl = null;
  let activeTab = 'learner'; // 'learner' | 'parent' | 'teacher'
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
    modalEl.className = 'ss-modal-backdrop';

    render();
    container.appendChild(modalEl);
  }

  function render() {
    const lang = getLang();
    const progress = loadProgress();
    const topics = topicsForGrade(currentGrade);

    // Calculate metrics for current grade
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

    modalEl.innerHTML = `
      <div class="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-progress-title">
        <div class="ss-modal-header">
          <div class="ss-modal-title-group">
            <span class="ss-badge ss-badge-hub">
              ${lang === 'hi' ? 'कक्षा' : 'Class'} ${currentGrade}
            </span>
            <h2 id="ss-progress-title" class="ss-modal-title">${t('progress.title')}</h2>
          </div>
          <button class="ss-close-btn" aria-label="Close" id="ss-progress-close">&times;</button>
        </div>

        <div class="ss-modal-body">
          <!-- Role Navigation Tabs -->
          <div class="ss-role-tabs">
            <button class="ss-role-tab ${activeTab === 'learner' ? 'active' : ''}" data-tab="learner" type="button">
              <span>🎒</span> <span>${t('progress.learner')}</span>
            </button>
            <button class="ss-role-tab ${activeTab === 'parent' ? 'active' : ''}" data-tab="parent" type="button">
              <span>👨‍👩‍👧</span> <span>${t('progress.parent')}</span>
            </button>
            <button class="ss-role-tab ${activeTab === 'teacher' ? 'active' : ''}" data-tab="teacher" type="button">
              <span>👩‍🏫</span> <span>${t('progress.teacher')}</span>
            </button>
          </div>

          <!-- Grade Selector (1 to 8) -->
          <div class="ss-grade-bar">
            <span style="font-size:0.82rem; color:var(--text-muted); margin-right:4px;">
              ${lang === 'hi' ? 'कक्षा चुनें:' : 'Select Grade:'}
            </span>
            ${GRADES.map((g) => `
              <button class="ss-grade-chip ${g === currentGrade ? 'active' : ''}" data-grade="${g}" type="button">
                ${lang === 'hi' ? 'कक्षा' : 'Class'} ${g}
              </button>
            `).join('')}
          </div>

          <!-- Tab Content -->
          <div id="ss-tab-container">
            ${
              activeTab === 'learner'
                ? renderLearnerView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats, focusTopics })
                : activeTab === 'parent'
                  ? renderParentView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats })
                  : renderTeacherView({ lang, currentGrade, completedCount, totalTopics, totalScore, accuracyPct, topicStats })
            }
          </div>
        </div>

        <div class="ss-modal-footer">
          <span class="ss-offline-badge">
            ⚡ ${lang === 'hi' ? 'ऑफ़लाइन सुरक्षित (डेटा खर्च नहीं)' : 'Saved on device (Zero data cost)'}
          </span>
          <button class="ss-btn-primary" id="ss-progress-done-btn" type="button">
            ${lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    `;

    // Wire events
    modalEl.querySelector('#ss-progress-close').addEventListener('click', close);
    modalEl.querySelector('#ss-progress-done-btn').addEventListener('click', close);

    // Tab buttons
    modalEl.querySelectorAll('.ss-role-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        playClickSound();
        activeTab = tabBtn.getAttribute('data-tab');
        render();
      });
    });

    // Grade selector
    modalEl.querySelectorAll('.ss-grade-chip').forEach((gChip) => {
      gChip.addEventListener('click', () => {
        playClickSound();
        const g = parseInt(gChip.getAttribute('data-grade'), 10);
        setGrade(g);
        currentGrade = g;
        render();
      });
    });

    // Practice buttons on topic rows
    modalEl.querySelectorAll('.ss-practice-topic-btn').forEach((pBtn) => {
      pBtn.addEventListener('click', () => {
        playClickSound();
        const topicId = pBtn.getAttribute('data-id');
        close();
        if (onOpenTopic) onOpenTopic(topicId, currentGrade);
      });
    });

    // Parent Voice Aloud Button
    const parentVoiceBtn = modalEl.querySelector('#ss-parent-voice-btn');
    if (parentVoiceBtn) {
      let speakingParent = false;
      parentVoiceBtn.addEventListener('click', () => {
        playClickSound();
        if (speakingParent) {
          stopSpeaking();
          speakingParent = false;
          parentVoiceBtn.innerHTML = `<span>🔊</span> <span>${t('progress.parentVoiceSummary')}</span>`;
        } else {
          speakingParent = true;
          parentVoiceBtn.innerHTML = `<span>⏹</span> <span>${t('quiz.stopAudio')}</span>`;
          const spokenText = lang === 'hi'
            ? `अभिभावक रिपोर्ट: आपके बच्चे ने कक्षा ${currentGrade} में कुल ${totalTopics} में से ${completedCount} विषय पूरे कर लिए हैं। बच्चे की सटीकता ${accuracyPct} प्रतिशत है। बच्चे ने नियमित पढ़ाई की है। आज शाम बच्चे को शाबाशी दें और प्रेरित करें!`
            : `Parent Report: Your child has completed ${completedCount} out of ${totalTopics} topics in Class ${currentGrade} with an accuracy of ${accuracyPct} percent. Your child is making steady progress!`;
          speakText(spokenText, lang);
        }
      });
    }

    // Teacher Copy WhatsApp Report Button
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
          teacherCopyBtn.textContent = '✓ ' + t('progress.reportCopied');
          setTimeout(() => {
            if (teacherCopyBtn) teacherCopyBtn.textContent = t('progress.shareReport');
          }, 3000);
        }).catch(() => {
          alert(reportText);
        });
      });
    }
  }

  // Learner View Template
  function renderLearnerView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats, focusTopics }) {
    const mathsTopics = topicStats.filter((t) => t.subject === 'maths');
    const scienceTopics = topicStats.filter((t) => t.subject === 'science');

    // Badges calculation
    const badges = [
      {
        icon: '🌱',
        name: lang === 'hi' ? 'आरंभक (Starter)' : 'Starter',
        unlocked: completedCount >= 1,
      },
      {
        icon: '📐',
        name: lang === 'hi' ? 'गणित नायक (Maths Hero)' : 'Maths Hero',
        unlocked: mathsTopics.every((t) => t.isDone),
      },
      {
        icon: '🔬',
        name: lang === 'hi' ? 'विज्ञान खोजी (Science Scout)' : 'Science Scout',
        unlocked: scienceTopics.every((t) => t.isDone),
      },
      {
        icon: '👑',
        name: lang === 'hi' ? 'कक्षा विजेता (Grade Master)' : 'Grade Master',
        unlocked: completedCount === totalTopics && totalTopics > 0,
      },
    ];

    return `
      <!-- Stats Overview -->
      <div class="ss-stats-grid">
        <div class="ss-stat-card">
          <div class="ss-stat-value">${completedCount} / ${totalTopics}</div>
          <div class="ss-stat-label">${t('progress.topicsDone')}</div>
        </div>
        <div class="ss-stat-card">
          <div class="ss-stat-value">⭐ ${totalScore}</div>
          <div class="ss-stat-label">${t('progress.totalStars')}</div>
        </div>
        <div class="ss-stat-card">
          <div class="ss-stat-value">${accuracyPct}%</div>
          <div class="ss-stat-label">${t('progress.accuracy')}</div>
        </div>
      </div>

      <!-- Badges -->
      <div class="ss-section-title">
        <span>🏆 ${lang === 'hi' ? 'उपलब्धि पदक (Badges Earned)' : 'Achievement Badges'}</span>
      </div>
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; margin-bottom:16px;">
        ${badges.map((b) => `
          <div style="
            background: ${b.unlocked ? 'rgba(240, 199, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
            border: 1px solid ${b.unlocked ? 'var(--accent-gold)' : 'var(--border-subtle)'};
            border-radius: var(--radius-md);
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: ${b.unlocked ? '1' : '0.45'};
            white-space: nowrap;
          ">
            <span style="font-size:1.4rem;">${b.icon}</span>
            <span style="font-size:0.82rem; font-weight:600; color:${b.unlocked ? 'var(--accent-gold)' : 'var(--text-muted)'};">
              ${b.name}
            </span>
          </div>
        `).join('')}
      </div>

      <!-- Revision Focus if any -->
      ${focusTopics.length > 0 ? `
        <div style="background:rgba(242, 179, 90, 0.1); border:1px solid var(--accent-amber); border-radius:var(--radius-md); padding:12px; margin-bottom:16px;">
          <div style="font-size:0.9rem; font-weight:700; color:var(--accent-amber); margin-bottom:6px;">
            ⚠️ ${t('progress.focusAreas')}
          </div>
          <p style="font-size:0.84rem; color:var(--text-secondary); margin:0 0 8px 0;">
            ${lang === 'hi' ? 'इन विषयों में कुछ गलतियाँ हुई थीं, एक बार और अभ्यास करें:' : 'Review these topics to master missed questions:'}
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${focusTopics.map((ft) => `
              <button class="ss-btn-secondary ss-practice-topic-btn" data-id="${ft.id}" style="font-size:0.8rem; padding:4px 8px;">
                🔄 ${ft.title[lang] || ft.title.hi}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Topic List: Maths Island -->
      <div class="ss-section-title">
        <span style="color:var(--accent-cyan);">📐 ${t('zone.maths')}</span>
      </div>
      <div class="ss-topics-list">
        ${mathsTopics.map((topic) => renderTopicRow(topic, lang)).join('')}
      </div>

      <!-- Topic List: Science Island -->
      <div class="ss-section-title" style="margin-top:20px;">
        <span style="color:var(--accent-amber);">🔬 ${t('zone.science')}</span>
      </div>
      <div class="ss-topics-list">
        ${scienceTopics.map((topic) => renderTopicRow(topic, lang)).join('')}
      </div>
    `;
  }

  // Parent View Template (Accessible, Non-technical, Spoken Audio)
  function renderParentView({ lang, completedCount, totalTopics, totalScore, accuracyPct, topicStats }) {
    const completedTopics = topicStats.filter((t) => t.isDone);

    return `
      <div class="ss-parent-banner">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h3 style="margin:0 0 4px 0; font-size:1.15rem; color:#fff;">
              ${lang === 'hi' ? 'नमस्ते अभिभावक जी!' : 'Welcome Parent!'}
            </h3>
            <p style="margin:0; font-size:0.88rem; color:var(--text-secondary);">
              ${lang === 'hi' ? 'एक ही फोन पर आपके बच्चे की सुरक्षित व बिना इंटरनेट पढ़ाई।' : 'Your child\'s learning progress on this shared phone.'}
            </p>
          </div>
          <button class="ss-audio-btn" id="ss-parent-voice-btn" type="button" style="padding:8px 14px; font-size:0.9rem;">
            <span>🔊</span> <span>${t('progress.parentVoiceSummary')}</span>
          </button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;">
          <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">${lang === 'hi' ? 'सीखे गए विषय' : 'Topics Studied'}</div>
            <div style="font-size:1.4rem; font-weight:700; color:var(--accent-gold);">${completedCount} / ${totalTopics}</div>
          </div>
          <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">${lang === 'hi' ? 'प्रयास और समझ' : 'Understanding'}</div>
            <div style="font-size:1.4rem; font-weight:700; color:#a4f5c2;">${accuracyPct}% (${totalScore} ⭐)</div>
          </div>
        </div>
      </div>

      <div class="ss-parent-tip">
        <strong>💡 ${lang === 'hi' ? 'आज का सुझाव (Parent Tip):' : 'Today\'s Tip for Parents:'}</strong><br/>
        ${lang === 'hi' 
          ? 'बच्चे को प्रोत्साहित करें। उनसे कहें: "आज तुमने बहुत मेहनत की, मुझे बताओ तुमने कौन सा नया सवाल सीखा!" ऐसा पूछने से बच्चे का आत्मविश्वास दुगुना होता है।' 
          : 'Praise your child today: "You worked hard today, show me one new problem you solved!" This builds tremendous confidence.'}
      </div>

      <div class="ss-section-title">
        <span>📖 ${lang === 'hi' ? 'आज क्या सीखा गया (What was studied):' : 'What was studied:'}</span>
      </div>
      <div class="ss-topics-list">
        ${completedTopics.length > 0
          ? completedTopics.map((ct) => `
            <div class="ss-topic-row">
              <div class="ss-topic-info">
                <span class="ss-topic-title">${ct.title[lang] || ct.title.hi}</span>
                <span class="ss-topic-sub">
                  ${ct.subject === 'maths' ? (lang === 'hi' ? 'गणित' : 'Maths') : (lang === 'hi' ? 'विज्ञान' : 'Science')} • ${ct.score}/${ct.total} ${lang === 'hi' ? 'अंक' : 'pts'}
                </span>
              </div>
              <span style="color:#a4f5c2; font-weight:700; font-size:0.9rem;">✓ ${lang === 'hi' ? 'सफलतापूर्वक सीखा' : 'Learned'}</span>
            </div>
          `).join('')
          : `
            <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.9rem;">
              ${lang === 'hi' ? 'अभी इस कक्षा में कोई विषय पूरा नहीं हुआ है। बच्चे को 15 मिनट अभ्यास करने दें!' : 'No topics completed yet for this grade. Let the child practice for 15 minutes!'}
            </div>
          `}
      </div>
    `;
  }

  // Teacher / Volunteer View Template (Curriculum Mapping, WhatsApp Share)
  function renderTeacherView({ lang, currentGrade, completedCount, totalTopics, totalScore, accuracyPct, topicStats }) {
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; font-size:1.1rem; color:#fff;">
            ${lang === 'hi' ? 'राज्य शिक्षा बोर्ड पाठ्यक्रम संरेखण' : 'State Board Syllabus Alignment'}
          </h3>
          <p style="margin:4px 0 0 0; font-size:0.82rem; color:var(--text-muted);">
            NCERT / State Board Class ${currentGrade} Syllabus Competency Matrix
          </p>
        </div>
        <button class="ss-btn-primary" id="ss-teacher-copy-btn" type="button" style="font-size:0.86rem; padding:8px 14px;">
          ${t('progress.shareReport')}
        </button>
      </div>

      <!-- Summary metrics table -->
      <div class="ss-stats-grid" style="margin-bottom:14px;">
        <div class="ss-stat-card">
          <div class="ss-stat-value">${completedCount} / ${totalTopics}</div>
          <div class="ss-stat-label">${lang === 'hi' ? 'सक्षम दक्षताएं' : 'Competencies Met'}</div>
        </div>
        <div class="ss-stat-card">
          <div class="ss-stat-value">${accuracyPct}%</div>
          <div class="ss-stat-label">${lang === 'hi' ? 'औसत शुद्धता' : 'Avg Accuracy'}</div>
        </div>
      </div>

      <!-- Diagnostic Syllabus Matrix -->
      <div class="ss-section-title">
        <span>📋 ${lang === 'hi' ? 'दक्षता मूल्यांकन विवरण (Diagnostic Assessment)' : 'Competency Matrix'}</span>
      </div>
      <div class="ss-topics-list">
        ${topicStats.map((tItem) => {
          const statusText = tItem.isDone
            ? `${tItem.score}/${tItem.total} (${Math.round((tItem.score / tItem.total) * 100)}%)`
            : (lang === 'hi' ? 'लंबित' : 'Pending');
          const statusColor = tItem.isDone
            ? (tItem.score === tItem.total ? '#a4f5c2' : 'var(--accent-amber)')
            : 'var(--text-muted)';
          return `
            <div class="ss-topic-row">
              <div class="ss-topic-info">
                <span class="ss-topic-title">${tItem.title[lang] || tItem.title.hi}</span>
                <span class="ss-topic-sub">
                  ${tItem.id} • ${tItem.subject.toUpperCase()} • ${lang === 'hi' ? 'प्रयास:' : 'Attempts:'} ${tItem.attempts}
                </span>
              </div>
              <div style="text-align:right;">
                <span style="font-weight:700; color:${statusColor}; font-size:0.88rem;">${statusText}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Teacher Recommendation -->
      <div class="ss-parent-tip" style="border-left-color:var(--accent-cyan); margin-top:16px;">
        <strong>🧑‍🏫 ${lang === 'hi' ? 'शिक्षक / स्वयंसेवक टिप्पणी (Teacher Observation):' : 'Teacher Observation:'}</strong><br/>
        ${completedCount >= 4
          ? (lang === 'hi' ? 'शिक्षार्थी ने आधारभूत दक्षताओं में अच्छा प्रदर्शन किया है। अगले अध्याय के व्यावहारिक अनुप्रयोगों पर बल दें।' : 'Student demonstrates good understanding of core concepts. Emphasize real-world problem applications.')
          : (lang === 'hi' ? 'नियमित 15 मिनट अभ्यास सत्र जारी रखने की संस्तुति की जाती है। संकेत व ऑडियो सहायता का प्रयोग फलदायी रहेगा।' : 'Recommend daily 15-minute practice sessions with voice guidance.')}
      </div>
    `;
  }

  function renderTopicRow(topic, lang) {
    const isDone = topic.isDone;
    const scoreText = isDone ? `${topic.score}/${topic.total} ⭐` : '';

    return `
      <div class="ss-topic-row">
        <div class="ss-topic-info">
          <span class="ss-topic-title">${topic.title[lang] || topic.title.hi}</span>
          <span class="ss-topic-sub">
            ${isDone ? `✓ ${t('progress.completed')} • ${scoreText}` : (lang === 'hi' ? 'अभ्यास बाकी' : 'Not started')}
          </span>
        </div>
        <div class="ss-topic-action">
          <button class="ss-btn-secondary ss-practice-topic-btn" data-id="${topic.id}" type="button">
            ${isDone ? '🔄 ' + t('quiz.retry') : '▶ ' + t('progress.practice')}
          </button>
        </div>
      </div>
    `;
  }

  function generateWhatsAppReport({ grade, completedCount, totalTopics, accuracyPct, topicStats, lang }) {
    const dateStr = new Date().toLocaleDateString('en-IN');
    const header = `📚 *संख्या स्ट्राइक (Sankhya Strike) - प्रगति रिपोर्ट*`;
    const meta = `📅 दिनांक: ${dateStr}\n🏫 कक्षा: ${grade}\n🎯 पूर्ण विषय: ${completedCount}/${totalTopics} (${accuracyPct}% शुद्धता)`;
    const details = topicStats
      .filter((t) => t.isDone)
      .map((t) => `• ${t.title.hi}: ${t.score}/${t.total} अंक`)
      .join('\n');

    const footer = `\n💡 *अभिभावक/शिक्षक संदेश:* नियमित अभ्यास जारी रखें। फ़ोन पर डेटा के बिना ऑफ़लाइन उपलब्ध।`;
    return `${header}\n${meta}\n\n*सीखे गए अध्याय:*\n${details || '• कोई विषय अभी पूरा नहीं हुआ'}\n${footer}`;
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
