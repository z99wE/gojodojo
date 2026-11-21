// South Korean Pastel RPG Challenge Arena UI (Quiz & STEM Diagnostic Terminal)
import { getTopic } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
import { emit } from '../engine/events.js';
import {
  playCorrectSound,
  playIncorrectSound,
  playClickSound,
  playHintSound,
  playFanfareSound,
  speakText,
  stopSpeaking,
  startVoiceRecognition,
} from './audio.js';
import { sanitizeHtml } from './sanitize.js';

export function createQuizModal({
  container,
  onClose,
  onOpenProgress,
  onSaveProgress,
  onReward,
}) {
  let modalEl = null;
  let activeRecognition = null;

  function close() {
    stopSpeaking();
    if (activeRecognition) {
      try { activeRecognition.abort(); } catch (e) { void e; }
      activeRecognition = null;
    }
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
      modalEl = null;
    }
    if (onClose) onClose();
  }

  function open(stoneId, grade) {
    close();

    const topic = getTopic(stoneId, grade);
    if (!topic || !topic.questions || topic.questions.length === 0) {
      console.warn('No questions found for stone:', stoneId, 'grade:', grade);
      return;
    }

    const lang = getLang();
    let currentIdx = 0;
    let score = 0;
    let answered = false;
    let showHint = false;
    const mistakes = [];

    modalEl = document.createElement('div');
    modalEl.className = 'ss-clay-backdrop';

    function renderQuestion() {
      stopSpeaking();
      const q = topic.questions[currentIdx];
      const totalQ = topic.questions.length;
      const progressPercent = Math.round(((currentIdx) / totalQ) * 100);

      const subjectName = topic.subject === 'maths'
        ? (lang === 'hi' ? 'गणित द्वीप • मॉड्यूल' : 'Maths Isle • Module')
        : (lang === 'hi' ? 'विज्ञान वाटिका • मॉड्यूल' : 'Science Garden • Module');

      const titleText = topic.title[lang] || topic.title.hi;
      const questionText = q.text[lang] || q.text.hi;
      const hintText = q.hint[lang] || q.hint.hi;
      const explainText = q.explain[lang] || q.explain.hi;

      modalEl.innerHTML = sanitizeHtml(`
        <div class="ss-clay-modal" role="dialog" aria-modal="true">
          <!-- Modal Top Header with Mascot & Title -->
          <div class="ss-clay-header ss-header-${topic.subject}">
            <div class="ss-mascot-avatar" id="ss-guru-mascot" title="Diagnostic Core">[SYS]</div>
            <div class="ss-clay-title-wrap">
              <span class="ss-tactical-tag">[SECTOR: ${subjectName.toUpperCase()}]</span>
              <h2 class="ss-clay-title">${titleText}</h2>
            </div>
            <button class="ss-clay-close" aria-label="Close" id="ss-quiz-close">&times;</button>
          </div>

          <!-- Modal Body -->
          <div class="ss-clay-body">
            <!-- Level & Track Bar -->
            <div class="ss-quest-step-bar">
              <div class="ss-step-label">
                <span>${t('quiz.question')} ${currentIdx + 1} / ${totalQ}</span>
                <span class="ss-step-gold-hint">+30 XP • +15 ENERGY</span>
              </div>
              <div class="ss-clay-progress-track">
                <div class="ss-clay-progress-fill" style="width: ${progressPercent}%"></div>
              </div>
            </div>

            <!-- Main Question Card -->
            <div class="ss-clay-card">
              <div class="ss-q-header">
                <p class="ss-q-text">${questionText}</p>
                <button class="ss-clay-audio-btn" id="ss-audio-toggle" type="button" title="${t('quiz.listen')}">
                  <span class="ss-audio-label">${t('quiz.listen')}</span>
                </button>
              </div>

              <!-- 4 Tactile Candy Choice Buttons -->
              <div class="ss-candy-options-grid" id="ss-options-container">
                ${q.options
                  .map((opt, i) => {
                    const optText = opt[lang] || opt.hi;
                    const charCode = ['A', 'B', 'C', 'D'][i] || (i + 1);
                    return `
                    <button class="ss-candy-btn" type="button" data-idx="${i}">
                      <span class="ss-candy-badge">${charCode}</span>
                      <span class="ss-candy-text">${optText}</span>
                    </button>
                  `;
                  })
                  .join('')}
              </div>

              <!-- Hint Accordion -->
              ${
                showHint
                  ? `
                <div class="ss-guru-bubble ss-hint-bubble">
                  <div class="ss-bubble-tag">${t('quiz.hint')}</div>
                  <div class="ss-bubble-msg">${hintText}</div>
                </div>
              `
                  : ''
              }

              <!-- Feedback / Explanation Container -->
              <div id="ss-feedback-container"></div>

              <!-- In-Game Assistant Quick Bar -->
              <div class="ss-companion-bar">
                <button class="ss-chip-action" id="ss-hint-btn" type="button">
                  [HINT] ${showHint ? 'संकेत छिपाएँ' : t('quiz.hint')}
                </button>
                <button class="ss-chip-action" id="ss-ask-voice-btn" type="button">
                  [VOICE] ${t('quiz.voiceDoubt')}
                </button>
                <button class="ss-chip-action" id="ss-ask-photo-btn" type="button">
                  [SCAN] ${t('quiz.photoDoubt')}
                </button>
              </div>

              <!-- Guru Bot Interactive Chat Area -->
              <div id="ss-guru-chat-area" style="display:none; margin-top:14px;"></div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="ss-clay-footer">
            <div class="ss-footer-stat">
              <span class="ss-score-pill">[SCORE] ${t('quiz.score')}: <strong>${score}</strong></span>
            </div>
            <div id="ss-footer-action"></div>
          </div>
        </div>
      `);

      // Wire close button safely
      const closeBtn = modalEl.querySelector('#ss-quiz-close');
      if (closeBtn) closeBtn.addEventListener('click', close);

      // Audio read aloud
      const audioBtn = modalEl.querySelector('#ss-audio-toggle');
      let isReading = false;
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          playClickSound();
          if (isReading) {
            stopSpeaking();
            isReading = false;
            const icon = audioBtn.querySelector('.ss-audio-icon');
            const label = audioBtn.querySelector('.ss-audio-label');
            if (icon) icon.textContent = '[VOICE]';
            if (label) label.textContent = t('quiz.listen');
          } else {
            isReading = true;
            const icon = audioBtn.querySelector('.ss-audio-icon');
            const label = audioBtn.querySelector('.ss-audio-label');
            if (icon) icon.textContent = '[STOP]';
            if (label) label.textContent = t('quiz.stopAudio');
            const optionsText = q.options
              .map((opt, i) => `${['A', 'B', 'C', 'D'][i]}: ${opt[lang] || opt.hi}`)
              .join('. ');
            speakText(`${questionText}. ${optionsText}`, lang);
          }
        });
      }

      // Hint toggle
      const hintBtn = modalEl.querySelector('#ss-hint-btn');
      if (hintBtn) {
        hintBtn.addEventListener('click', () => {
          playHintSound();
          showHint = !showHint;
          botMood = '';
          renderQuestion();
        });
      }

      // Voice Doubt Assistant
      const voiceBtn = modalEl.querySelector('#ss-ask-voice-btn');
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          playClickSound();
          const chatArea = modalEl.querySelector('#ss-guru-chat-area');
          if (chatArea) chatArea.style.display = 'block';
          botMood = '';
          updateMascot();

          if (chatArea) {
            chatArea.innerHTML = sanitizeHtml(`
              <div class="ss-guru-bubble">
                <div class="ss-tactical-directive-bar">[AI TUTOR] GURU BOT AUDIO SYNTH</div>
                <div class="ss-listening-pulse">${t('quiz.listening')}</div>
              </div>
            `);
          }

          activeRecognition = startVoiceRecognition({
            lang,
            onResult: (spokenText) => {
              activeRecognition = null;
              handleDoubtResponse(spokenText, q, lang);
            },
            onError: () => {
              activeRecognition = null;
              handleDoubtResponse(
                lang === 'hi'
                  ? 'मुझे इस सवाल को हल करने की सरल विधि समझाएँ'
                  : 'Explain simple step to solve this',
                q,
                lang
              );
            },
          });
        });
      }

      // Photo Doubt Assistant (Textbook snapshot scanner)
      const photoBtn = modalEl.querySelector('#ss-ask-photo-btn');
      if (photoBtn) {
        photoBtn.addEventListener('click', () => {
          playClickSound();
          const chatArea = modalEl.querySelector('#ss-guru-chat-area');
          if (chatArea) chatArea.style.display = 'block';
          botMood = '';
          updateMascot();

          if (chatArea) {
            chatArea.innerHTML = sanitizeHtml(`
              <div class="ss-guru-bubble ss-photo-bubble">
                <div class="ss-tactical-directive-bar">[OPTICAL SCAN] TEXTBOOK OCR FEED</div>
                <div class="ss-scanned-preview">
                  <span class="ss-scan-tag">[SCAN COMPLETE]</span>
                  <p class="ss-scanned-text">"${questionText}"</p>
                </div>
                <div class="ss-bubble-msg" style="margin-top:10px;">
                  <strong>[HINT] गुरु बॉट का संकेत:</strong> ${q.hint[lang] || q.hint.hi}
                </div>
              </div>
            `);
          }
          speakText(q.hint[lang] || q.hint.hi, lang);
        });
      }

      // Candy Option Buttons click handling
      const optionButtons = modalEl.querySelectorAll('.ss-candy-btn');
      optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);
          const isCorrect = chosenIdx === q.answer;

          // Disable buttons
          optionButtons.forEach((b) => {
            b.disabled = true;
          });

          if (isCorrect) {
            score += 1;
            botMood = '';
            btn.classList.add('ss-correct-pop');
            playCorrectSound();
          } else {
            btn.classList.add('ss-incorrect-pop');
            mistakes.push({
              question: questionText,
              chosen: q.options[chosenIdx][lang] || q.options[chosenIdx].hi,
              correct: q.options[q.answer][lang] || q.options[q.answer].hi,
            });
            playIncorrectSound();
            // Penalty: Damage shield and trigger containment alert
            emit('player:damage', { amount: 25, reason: 'Formula parameter discrepancy' });

            // Highlight the correct answer
            const correctBtn = modalEl.querySelector(`.ss-candy-btn[data-idx="${q.answer}"]`);
            if (correctBtn) correctBtn.classList.add('ss-correct-pop');
          }

          // Show explanation card
          const feedbackContainer = modalEl.querySelector('#ss-feedback-container');
          feedbackContainer.innerHTML = sanitizeHtml(`
            <div class="ss-guru-bubble ${isCorrect ? 'ss-success-bubble' : 'ss-review-bubble'}">
              <div class="ss-bubble-tag">
                <span>${isCorrect ? t('quiz.correct') : t('quiz.incorrect')}</span>
                <button class="ss-clay-audio-btn" id="ss-explain-audio-btn" type="button" style="padding:4px 8px; font-size:0.75rem;">
                  ${t('quiz.listen')}
                </button>
              </div>
              <div class="ss-bubble-msg">${explainText}</div>
            </div>
          `);

          modalEl.querySelector('#ss-explain-audio-btn').addEventListener('click', () => {
            playClickSound();
            speakText(explainText, lang);
          });

          // Show Next / Finish button
          const isLast = currentIdx >= totalQ - 1;
          const footerAction = modalEl.querySelector('#ss-footer-action');
          footerAction.innerHTML = sanitizeHtml(`
            <button class="ss-clay-primary-btn" id="ss-next-btn" type="button">
              ${isLast ? t('quiz.finish') : t('quiz.next')}
            </button>
          `);

          modalEl.querySelector('#ss-next-btn').addEventListener('click', () => {
            playClickSound();
            if (isLast) {
              finishQuiz();
            } else {
              currentIdx += 1;
              answered = false;
              showHint = false;
              renderQuestion();
            }
          });
        });
      });
    }

    function handleDoubtResponse(studentDoubt, question, currentLang) {
      const chatArea = modalEl.querySelector('#ss-guru-chat-area');
      if (!chatArea) return;

      const responseText = currentLang === 'hi'
        ? `ट्यूटर विश्लेषण: "${studentDoubt}" को समझना सीधा है। याद रखें कि ${question.hint.hi}। अब भौतिक विकल्पों की तुलना करें।`
        : `Tutor Diagnostics: Clarifying "${studentDoubt}". Recall that ${question.hint.en}. Now compare the scientific parameters.`;

      chatArea.innerHTML = sanitizeHtml(`
        <div class="ss-guru-bubble ss-hint-bubble">
          <div class="ss-bubble-tag">STEM Tutor Diagnostics</div>
          <div class="ss-bubble-msg">${responseText}</div>
        </div>
      `);
      speakText(responseText, currentLang);
    }

    function finishQuiz() {
      stopSpeaking();
      playFanfareSound();
      const totalQ = topic.questions.length;

      // Trigger reward callback to HUD
      if (onReward) {
        onReward(score, totalQ);
      }

      // Save progress to localStorage
      if (onSaveProgress) {
        onSaveProgress(stoneId, grade, {
          score,
          total: totalQ,
          completed: true,
          mistakes,
        });
      }

      const praise = score === totalQ
        ? (lang === 'hi' ? 'उत्कृष्ट! आपने सभी वैज्ञानिक सिद्धांतों का सही समाधान किया।' : 'Flawless execution! All physical and chemical parameters verified.')
        : (score >= 2
            ? (lang === 'hi' ? 'सराहनीय प्रदर्शन। थोड़े संशोधन के साथ आप पूर्ण दक्ष होंगे।' : 'Commendable performance. A quick review will achieve full mastery.')
            : (lang === 'hi' ? 'प्रारंभिक प्रयास। व्याख्या का अध्ययन कर पुनः सत्यापन करें।' : 'Initial pass complete. Review diagnostic formulas and retry.'));

      modalEl.innerHTML = sanitizeHtml(`
        <div class="ss-clay-modal ss-victory-modal" role="dialog">
          <div class="ss-clay-header ss-header-${topic.subject}">
            <div class="ss-mascot-avatar">[SYS]</div>
            <div class="ss-clay-title-wrap">
              <span class="ss-tactical-tag">MODULE VERIFIED</span>
              <h2 class="ss-clay-title">${titleText}</h2>
            </div>
            <button class="ss-clay-close" aria-label="Close" id="ss-summary-close">&times;</button>
          </div>

          <div class="ss-clay-body" style="text-align:center;">
            <div class="ss-victory-score">${score} / ${totalQ}</div>
            <div class="ss-victory-xp">+${score * 30} XP • +${score * 15} ENERGY UNITS</div>
            <p class="ss-praise-text">${praise}</p>

            ${
              mistakes.length > 0
                ? `
              <div class="ss-mistakes-recap">
                <strong>${lang === 'hi' ? 'समीक्षा एवं सुधारात्मक बिंदु:' : 'Points for Remediation:'}</strong>
                <ul>
                  ${mistakes.map((m) => `<li>${m.question} <em>(${lang === 'hi' ? 'सही' : 'Correct'}: ${m.correct})</em></li>`).join('')}
                </ul>
              </div>
            `
                : ''
            }
          </div>

          <div class="ss-clay-footer ss-victory-footer">
            <button class="ss-chip-action" id="ss-retry-btn" type="button">
              [RETRY] ${t('quiz.retry')}
            </button>
            <button class="ss-chip-action" id="ss-progress-btn" type="button">
              [LOG] ${lang === 'hi' ? 'साहसिक डायरी' : 'Adventure Log'}
            </button>
            <button class="ss-clay-primary-btn" id="ss-finish-btn" type="button">
              [WORLD] ${t('quiz.returnWorld')}
            </button>
          </div>
        </div>
      `);

      // Wire summary buttons safely
      const summaryClose = modalEl.querySelector('#ss-summary-close');
      if (summaryClose) summaryClose.addEventListener('click', close);

      const finishBtn = modalEl.querySelector('#ss-finish-btn');
      if (finishBtn) finishBtn.addEventListener('click', close);

      const retryBtn = modalEl.querySelector('#ss-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          playClickSound();
          open(stoneId, grade);
        });
      }

      const progressBtn = modalEl.querySelector('#ss-progress-btn');
      if (progressBtn) {
        progressBtn.addEventListener('click', () => {
          playClickSound();
          close();
          if (onOpenProgress) onOpenProgress();
        });
      }
    }

    renderQuestion();
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
