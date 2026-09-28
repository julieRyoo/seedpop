// SeedPop — 4-Option Word Quiz Component

class TabQuiz {
  constructor() {
    this.container = document.getElementById('quiz-tab');
    this.currentWord = null;
    this.options = [];
    this.score = 0;
    this.streak = 0;
  }

  init() {
    this.score = 0;
    this.streak = 0;
    this.loadQuestion();
  }

  loadQuestion() {
    const allWords = window.seedState.getFilteredWords();
    if (allWords.length < 4) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h3>⚠️ 퀴즈를 진행하려면 최소 4개 이상의 단어가 필요합니다!</h3>
        </div>
      `;
      return;
    }

    // Pick random target word
    const randomIndex = Math.floor(Math.random() * allWords.length);
    this.currentWord = allWords[randomIndex];

    // Pick 3 random distractor definitions
    const distractors = allWords.filter(w => w.id !== this.currentWord.id);
    this.shuffle(distractors);

    const quizOptions = [
      { text: this.currentWord.definition, correct: true },
      { text: distractors[0].definition, correct: false },
      { text: distractors[1].definition, correct: false },
      { text: distractors[2].definition, correct: false }
    ];

    this.shuffle(quizOptions);
    this.options = quizOptions;

    this.render();
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  render() {
    this.container.innerHTML = `
      <div style="max-width: 640px; margin: 0 auto; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <span class="badge" style="background: #f59e0b; font-size: 14px;">
            🔥 연속 ${this.streak}문제 정답!
          </span>
          <span style="font-weight: 700; color: var(--text-secondary);">
            점수: ${this.score}점
          </span>
        </div>

        <div style="background: white; border-radius: var(--radius-lg); padding: 36px 24px; box-shadow: var(--shadow-pop); margin-bottom: 30px; border: 3px solid #e0e7ff;">
          <span style="font-size: 13px; font-weight: 700; color: var(--primary);">영단어를 읽고 알맞은 뜻을 고르세요!</span>
          <h1 style="font-family: var(--font-display); font-size: 48px; font-weight: 800; color: var(--primary); margin: 12px 0;">
            ${this.currentWord.word}
          </h1>
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap;">
            <button class="audio-btn" id="quiz-audio-btn" title="단어 발음 듣기 (${this.currentWord.word})">
              <i data-lucide="volume-2"></i>
            </button>
            ${this.currentWord.plural ? `
              <button class="btn btn-secondary" id="quiz-plural-audio-btn" style="border: 2px solid #7dd3fc; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: var(--radius-full);">
                <i data-lucide="volume-2" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"></i> 복수형 (${this.currentWord.plural}) 듣기
              </button>
            ` : ''}
          </div>
        </div>

        <div class="options-grid">
          ${this.options.map((opt, idx) => `
            <button class="option-btn" data-correct="${opt.correct}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    lucide.createIcons();
    window.voiceEngine.speak(this.currentWord.word);

    document.getElementById('quiz-audio-btn').addEventListener('click', () => {
      window.voiceEngine.speak(this.currentWord.word);
    });

    const pluralBtn = document.getElementById('quiz-plural-audio-btn');
    if (pluralBtn && this.currentWord.plural) {
      pluralBtn.addEventListener('click', () => {
        window.voiceEngine.speak(this.currentWord.plural);
      });
    }

    const optionBtns = this.container.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          btn.classList.add('correct');
          this.score += 10;
          this.streak += 1;
          window.seedState.markWordResult(this.currentWord.id, true);

          // Confetti celebration if 3+ streak!
          if (typeof confetti === 'function') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          }

          setTimeout(() => this.loadQuestion(), 1000);
        } else {
          btn.classList.add('wrong');
          this.streak = 0;
          window.seedState.markWordResult(this.currentWord.id, false);

          // Highlight correct option
          optionBtns.forEach(b => {
            if (b.getAttribute('data-correct') === 'true') {
              b.classList.add('correct');
            }
          });

          setTimeout(() => this.loadQuestion(), 1600);
        }
      });
    });
  }
}

window.tabQuiz = new TabQuiz();
