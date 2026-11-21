// Quiz UI component with AI Tutor, Audio Read-Aloud, and Voice/Photo Doubt Assistance
import { getTopic, progressKey } from '../content/index.js';
import { t, getLang } from '../i18n/index.js';
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

export function createQuizModal({ container, onClose, onOpenProgress, getProgress, onSaveProgress }) {
  let modalEl = null;
  let activeRecognition = null;

  function close() {
    stopSpeaking();
    if (activeRecognition) {
      try { activeRecognition.abort(); } catch (e) {}
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
    modalEl.className = 'ss-modal-backdrop';

    function renderQuestion() {
      stopSpeaking();
      const q = topic.questions[currentIdx];
      const totalQ = topic.questions.length;
      const progressPercent = Math.round(((currentIdx) / totalQ) * 100);

      const subjectName = topic.subject === 'maths'
        ? (lang === 'hi' ? 'गणित' : 'Mathematics')
        : (lang === 'hi' ? 'विज्ञान' : 'Science');

      const titleText = topic.title[lang] || topic.title.hi;
      const questionText = q.text[lang] || q.text.hi;
      const hintText = q.hint[lang] || q.hint.hi;
      const explainText = q.explain[lang] || q.explain.hi;

      modalEl.innerHTML = `
        <div class="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-quiz-title">
          <div class="ss-modal-header">
            <div class="ss-modal-title-group">
              <span class="ss-badge ss-badge-${topic.subject}">${subjectName}</span>
              <h2 id="ss-quiz-title" class="ss-modal-title">${titleText}</h2>
            </div>
            <button class="ss-close-btn" aria-label="Close" id="ss-quiz-close">&times;</button>
          </div>

          <div class="ss-modal-body">
            <div class="ss-quiz-progress">
              <span>${t('quiz.question')} ${currentIdx + 1} / ${totalQ}</span>
              <div class="ss-progress-bar-wrap">
                <div class="ss-progress-bar-fill" style="width: ${progressPercent}%"></div>
              </div>
              <span class="ss-offline-badge">${t('hud.offline')}</span>
            </div>

            <div class="ss-question-card">
              <div class="ss-question-header">
                <p class="ss-question-text">${questionText}</p>
                <button class="ss-audio-btn" id="ss-audio-toggle" type="button" title="${t('quiz.listen')}">
                  <span>🔊</span> <span>${t('quiz.listen')}</span>
                </button>
              </div>

              <div class="ss-options-grid" id="ss-options-container">
                ${q.options
                  .map((opt, i) => {
                    const optText = opt[lang] || opt.hi;
                    const charCode = ['A', 'B', 'C', 'D'][i] || (i + 1);
                    return `
                    <button class="ss-option-btn" type="button" data-idx="${i}">
                      <span class="ss-option-indicator">${charCode}</span>
                      <span class="ss-option-label">${optText}</span>
                    </button>
                  `;
                  })
                  .join('')}
              </div>

              ${
                showHint
                  ? `
                <div class="ss-tutor-box" id="ss-hint-box">
                  <div class="ss-tutor-header">
                    <span class="ss-tutor-title">💡 ${t('quiz.hint')}</span>
                  </div>
                  <div class="ss-tutor-content">${hintText}</div>
                </div>
              `
                  : ''
              }

              <div id="ss-feedback-container"></div>

              <div class="ss-doubt-bar">
                <button class="ss-btn-secondary" id="ss-hint-btn" type="button">
                  💡 ${showHint ? 'संकेत छिपाएँ' : t('quiz.hint')}
                </button>
                <button class="ss-btn-secondary" id="ss-ask-voice-btn" type="button">
                  🎤 ${t('quiz.voiceDoubt')}
                </button>
                <button class="ss-btn-secondary" id="ss-ask-photo-btn" type="button">
                  📷 ${t('quiz.photoDoubt')}
                </button>
              </div>

              <div id="ss-tutor-doubt-area" style="display:none; margin-top:12px;"></div>
            </div>
          </div>

          <div class="ss-modal-footer">
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
              ⭐ ${t('quiz.score')}: <strong>${score}</strong>
            </div>
            <div id="ss-footer-action"></div>
          </div>
        </div>
      `;

      // Wire events for this question
      modalEl.querySelector('#ss-quiz-close').addEventListener('click', close);

      // Read question aloud
      const audioBtn = modalEl.querySelector('#ss-audio-toggle');
      let isReading = false;
      audioBtn.addEventListener('click', () => {
        playClickSound();
        if (isReading) {
          stopSpeaking();
          isReading = false;
          audioBtn.innerHTML = `<span>🔊</span> <span>${t('quiz.listen')}</span>`;
        } else {
          isReading = true;
          audioBtn.innerHTML = `<span>⏹</span> <span>${t('quiz.stopAudio')}</span>`;
          // Read question and options in regional language
          const optionsText = q.options
            .map((opt, i) => `${['A', 'B', 'C', 'D'][i]}: ${opt[lang] || opt.hi}`)
            .join('. ');
          speakText(`${questionText}. ${optionsText}`, lang);
        }
      });

      // Hint toggle
      modalEl.querySelector('#ss-hint-btn').addEventListener('click', () => {
        playHintSound();
        showHint = !showHint;
        renderQuestion();
      });

      // Voice Doubt
      const voiceBtn = modalEl.querySelector('#ss-ask-voice-btn');
      voiceBtn.addEventListener('click', () => {
        playClickSound();
        const doubtArea = modalEl.querySelector('#ss-tutor-doubt-area');
        doubtArea.style.display = 'block';
        doubtArea.innerHTML = `
          <div class="ss-tutor-box">
            <div class="ss-tutor-header">
              <span class="ss-tutor-title">🤖 AI गुरु संशय निवारक (Voice AI Tutor)</span>
            </div>
            <div style="font-size:0.9rem; color:var(--accent-gold); margin-bottom:8px;">
              ${t('quiz.listening')}
            </div>
          </div>
        `;

        activeRecognition = startVoiceRecognition({
          lang,
          onResult: (spokenText) => {
            activeRecognition = null;
            handleDoubtResponse(spokenText, q, lang);
          },
          onError: () => {
            activeRecognition = null;
            // Simulated speech assistant fallback for offline/devices without mic permission
            handleDoubtResponse(
              lang === 'hi'
                ? 'मुझे यह सवाल समझ नहीं आ रहा, आसान भाषा में समझाएँ'
                : 'I do not understand this question, explain simply',
              q,
              lang
            );
          },
        });
      });

      // Photo Doubt (Camera snapshot simulation)
      modalEl.querySelector('#ss-ask-photo-btn').addEventListener('click', () => {
        playClickSound();
        const doubtArea = modalEl.querySelector('#ss-tutor-doubt-area');
        doubtArea.style.display = 'block';
        doubtArea.innerHTML = `
          <div class="ss-tutor-box">
            <div class="ss-tutor-header">
              <span class="ss-tutor-title">📷 फोटो से सवाल पहचान (Textbook Photo AI)</span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-secondary); margin:4px 0 8px 0;">
              ${lang === 'hi' 
                ? 'किताब या कॉपी के सवाल की फोटो स्कैन की गई:' 
                : 'Scanned problem from textbook or notebook:'}
            </p>
            <div style="background:#081410; padding:10px; border-radius:6px; font-size:0.9rem; border-left:3px solid var(--accent-cyan);">
              <em>"${questionText}"</em>
            </div>
            <p style="font-size:0.92rem; color:#a4f5c2; margin-top:10px;">
              🤖 <strong>AI गुरु सुझाव:</strong> ${q.hint[lang] || q.hint.hi}
            </p>
          </div>
        `;
        speakText(q.hint[lang] || q.hint.hi, lang);
      });

      // Options click handlers
      const optionButtons = modalEl.querySelectorAll('.ss-option-btn');
      optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);
          const isCorrect = chosenIdx === q.answer;

          // Freeze all options
          optionButtons.forEach((b) => {
            b.disabled = true;
            b.style.cursor = 'default';
          });

          // Highlight choices
          if (isCorrect) {
            score += 1;
            btn.classList.add('correct');
            playCorrectSound();
          } else {
            btn.classList.add('incorrect');
            mistakes.push({
              question: questionText,
              chosen: q.options[chosenIdx][lang] || q.options[chosenIdx].hi,
              correct: q.options[q.answer][lang] || q.options[q.answer].hi,
            });
            playIncorrectSound();

            // Highlight the true answer in green
            const correctBtn = modalEl.querySelector(`.ss-option-btn[data-idx="${q.answer}"]`);
            if (correctBtn) correctBtn.classList.add('correct');
          }

          // Feedback & Explanation Card
          const feedbackContainer = modalEl.querySelector('#ss-feedback-container');
          feedbackContainer.innerHTML = `
            <div class="ss-tutor-box" style="margin-top: 14px; border-color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-coral)'}">
              <div class="ss-tutor-header">
                <span class="ss-tutor-title" style="color: ${isCorrect ? 'var(--accent-green)' : '#ffb8b8'}">
                  ${isCorrect ? '✓ ' + t('quiz.correct') : '✗ ' + t('quiz.incorrect')}
                </span>
                <button class="ss-btn-secondary" id="ss-explain-audio-btn" type="button" style="padding:4px 8px; font-size:0.78rem;">
                  🔊 व्याख्या सुनें
                </button>
              </div>
              <div class="ss-tutor-content" style="font-size:0.92rem;">
                ${explainText}
              </div>
            </div>
          `;

          // Listen to explanation
          modalEl.querySelector('#ss-explain-audio-btn').addEventListener('click', () => {
            playClickSound();
            speakText(explainText, lang);
          });

          // Show Next / Finish button
          const isLast = currentIdx >= totalQ - 1;
          const footerAction = modalEl.querySelector('#ss-footer-action');
          footerAction.innerHTML = `
            <button class="ss-btn-primary" id="ss-next-btn" type="button">
              ${isLast ? t('quiz.finish') : t('quiz.next')}
            </button>
          `;

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
      const doubtArea = modalEl.querySelector('#ss-tutor-doubt-area');
      if (!doubtArea) return;

      const responseText = currentLang === 'hi'
        ? `गुरु: "${studentDoubt}" को हल करने के लिए - ध्यान दें कि ${question.hint.hi}. अब सोचिए कि सही मान क्या होगा!`
        : `Guru: To solve "${studentDoubt}" - note that ${question.hint.en}. Now consider which choice satisfies this!`;

      doubtArea.innerHTML = `
        <div class="ss-tutor-box" style="border-color:var(--accent-gold);">
          <div class="ss-tutor-header">
            <span class="ss-tutor-title">🤖 AI गुरु (Simple Language Explanation)</span>
          </div>
          <div class="ss-tutor-content" style="font-size:0.92rem; color:#fff;">
            ${responseText}
          </div>
        </div>
      `;
      speakText(responseText, currentLang);
    }

    function finishQuiz() {
      stopSpeaking();
      playFanfareSound();
      const totalQ = topic.questions.length;
      const pct = Math.round((score / totalQ) * 100);

      // Save progress immediately to localStorage
      if (onSaveProgress) {
        onSaveProgress(stoneId, grade, {
          score,
          total: totalQ,
          completed: true,
          mistakes,
        });
      }

      // Star display
      let stars = '⭐';
      if (score === totalQ) stars = '⭐⭐⭐';
      else if (score >= 2) stars = '⭐⭐';

      const praise = score === totalQ
        ? (lang === 'hi' ? 'शाबाश! आपने सभी प्रश्नों का सही उत्तर दिया है!' : 'Outstanding! You got every question right!')
        : (score >= 2
            ? (lang === 'hi' ? 'बहुत अच्छा प्रयास! थोड़ा अभ्यास आपको परिपूर्ण बनाएगा।' : 'Great effort! A little more practice and you will master this.')
            : (lang === 'hi' ? 'सीखने की शुरुआत अच्छी है! संकेत और व्याख्या पढ़कर फिर से प्रयास करें।' : 'Good beginning! Read the explanations and try once more.'));

      modalEl.innerHTML = `
        <div class="ss-modal" role="dialog">
          <div class="ss-modal-header">
            <div class="ss-modal-title-group">
              <span class="ss-badge ss-badge-${topic.subject}">
                ${topic.subject === 'maths' ? (lang === 'hi' ? 'गणित' : 'Maths') : (lang === 'hi' ? 'विज्ञान' : 'Science')}
              </span>
              <h2 class="ss-modal-title">${t('quiz.completed')}</h2>
            </div>
            <button class="ss-close-btn" aria-label="Close" id="ss-summary-close">&times;</button>
          </div>

          <div class="ss-modal-body">
            <div class="ss-summary-card">
              <div class="ss-stars-row">${stars}</div>
              <div class="ss-score-large">${score} / ${totalQ}</div>
              <div class="ss-score-label">${topic.title[lang] || topic.title.hi} (${pct}%)</div>
              <p class="ss-message-praise">${praise}</p>

              ${
                mistakes.length > 0
                  ? `
                <div style="text-align:left; background:var(--bg-surface-elevated); padding:14px; border-radius:8px; margin-bottom:18px;">
                  <strong style="color:var(--accent-amber); font-size:0.9rem;">
                    📝 ${lang === 'hi' ? 'समीक्षा: जिन प्रश्नों पर दोबारा ध्यान देना है' : 'Review: Questions to practice again'}
                  </strong>
                  <ul style="margin:8px 0 0 16px; padding:0; font-size:0.86rem; color:var(--text-secondary);">
                    ${mistakes.map((m) => `<li>${m.question} <em>(${lang === 'hi' ? 'सही' : 'Correct'}: ${m.correct})</em></li>`).join('')}
                  </ul>
                </div>
              `
                  : ''
              }
            </div>
          </div>

          <div class="ss-modal-footer" style="justify-content: center; gap: 12px; flex-wrap: wrap;">
            <button class="ss-btn-secondary" id="ss-retry-btn" type="button">
              🔄 ${t('quiz.retry')}
            </button>
            <button class="ss-btn-secondary" id="ss-progress-btn" type="button">
              📊 ${t('progress.title')}
            </button>
            <button class="ss-btn-primary" id="ss-finish-btn" type="button">
              🏝 ${t('quiz.returnWorld')}
            </button>
          </div>
        </div>
      `;

      modalEl.querySelector('#ss-summary-close').addEventListener('click', close);
      modalEl.querySelector('#ss-finish-btn').addEventListener('click', close);

      modalEl.querySelector('#ss-retry-btn').addEventListener('click', () => {
        playClickSound();
        open(stoneId, grade);
      });

      modalEl.querySelector('#ss-progress-btn').addEventListener('click', () => {
        playClickSound();
        close();
        if (onOpenProgress) onOpenProgress();
      });
    }

    renderQuestion();
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
