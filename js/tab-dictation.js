// SeedPop — Dictation (받아쓰기) Component for 2nd Graders

class TabDictation {
  constructor() {
    this.container = document.getElementById('dictation-tab');
    this.currentWord = null;
    this.showHint = false;
  }

  init() {
    this.showHint = false;
    this.loadNextWord();
  }

  loadNextWord() {
    const words = window.seedState.getFilteredWords();
    if (words.length === 0) return;

    const randomIndex = Math.floor(Math.random() * words.length);
    this.currentWord = words[randomIndex];
    this.showHint = false;
    this.render();
  }

  render() {
    if (!this.currentWord) return;

    const hintText = this.showHint 
      ? `첫 글자 힌트: "${this.currentWord.word.charAt(0).toUpperCase()}..." (총 ${this.currentWord.word.length}글자)`
      : `총 ${this.currentWord.word.length}글자의 단어입니다.`;

    this.container.innerHTML = `
      <div class="dictation-container">
        <div style="background: white; border-radius: var(--radius-lg); padding: 32px 24px; box-shadow: var(--shadow-pop); border: 3px solid #e0e7ff; margin-bottom: 24px;">
          <span style="font-size: 14px; font-weight: 700; color: var(--primary);">
            🎧 소리를 듣고 영단어 스펠링을 입력하세요!
          </span>
          
          <h3 style="font-size: 26px; font-weight: 800; color: var(--text-main); margin-top: 12px;">
            "${this.currentWord.definition}"
          </h3>

          <div style="display: flex; justify-content: center; gap: 16px; margin-top: 20px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="dict-speak-normal">
              <i data-lucide="volume-2"></i> 보통 속도 듣기
            </button>
            <button class="btn btn-secondary" id="dict-speak-slow" style="border: 2px solid #cbd5e1;">
              <i data-lucide="turtle"></i> 천천히 듣기 (0.7x)
            </button>
            ${this.currentWord.plural ? `
              <button type="button" class="btn btn-secondary" id="dict-plural-audio-btn" style="border: 2px solid #7dd3fc; background: #e0f2fe; color: #0369a1;">
                <i data-lucide="volume-2"></i> 복수형 (${this.currentWord.plural}) 듣기
              </button>
            ` : ''}
          </div>

          <p style="font-size: 14px; color: var(--text-muted); margin-top: 16px;">
            ${hintText}
          </p>
        </div>

        <form id="dictation-form">
          <input type="text" id="dictation-input-field" class="dictation-input" placeholder="영단어 작성..." autocomplete="off" autofocus />

          <div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px;">
            <button type="button" class="btn btn-secondary" id="dict-hint-btn">
              💡 첫 글자 힌트 보기
            </button>
            <button type="submit" class="btn btn-success">
              ✅ 정답 확인하기
            </button>
          </div>
        </form>

        <div id="dictation-feedback" style="margin-top: 20px; font-size: 18px; font-weight: 800;"></div>
      </div>
    `;

    lucide.createIcons();
    window.voiceEngine.speak(this.currentWord.word);

    // Speakers
    document.getElementById('dict-speak-normal').addEventListener('click', () => {
      window.voiceEngine.speak(this.currentWord.word, false);
    });

    document.getElementById('dict-speak-slow').addEventListener('click', () => {
      window.voiceEngine.speak(this.currentWord.word, true);
    });

    const dictPluralBtn = document.getElementById('dict-plural-audio-btn');
    if (dictPluralBtn && this.currentWord.plural) {
      dictPluralBtn.addEventListener('click', () => {
        window.voiceEngine.speak(this.currentWord.plural);
      });
    }

    // Hint
    document.getElementById('dict-hint-btn').addEventListener('click', () => {
      this.showHint = true;
      this.render();
    });

    // Submit
    const form = document.getElementById('dictation-form');
    const input = document.getElementById('dictation-input-field');
    const feedback = document.getElementById('dictation-feedback');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      const answer = this.currentWord.word.trim().toLowerCase();

      if (val === answer) {
        feedback.style.color = '#10b981';
        feedback.innerHTML = `🎉 정답입니다! (${this.currentWord.word})`;
        window.seedState.markWordResult(this.currentWord.id, true);

        if (typeof confetti === 'function') {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        }

        setTimeout(() => this.loadNextWord(), 1400);
      } else {
        feedback.style.color = '#ef4444';
        feedback.innerHTML = `❌ 아쉬워요! 정답은 "${this.currentWord.word}" 입니다.`;
        window.seedState.markWordResult(this.currentWord.id, false);

        setTimeout(() => this.loadNextWord(), 2000);
      }
    });
  }
}

window.tabDictation = new TabDictation();
