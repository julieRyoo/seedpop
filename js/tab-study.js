// SeedPop — Flashcard Study Tab Component

class TabStudy {
  constructor() {
    this.container = document.getElementById('study-tab');
    this.currentIndex = 0;
    this.words = [];
    this.isFlipped = false;
  }

  init() {
    this.words = window.seedState.getFilteredWords();
    this.currentIndex = 0;
    this.isFlipped = false;
    this.render();
  }

  render() {
    if (this.words.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h3 style="font-size: 24px; font-weight: 800;">🎉 등록된 단어가 없습니다!</h3>
          <p style="color: var(--text-secondary); margin-top: 8px;">단어장 관리 탭에서 새로운 단어를 추가해보세요.</p>
        </div>
      `;
      return;
    }

    const currentWord = this.words[this.currentIndex];

    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span class="badge" style="background: var(--primary); font-size: 14px;">
            ${this.currentIndex + 1} / ${this.words.length} 단어
          </span>
          <span style="font-size: 13px; font-weight: 700; color: var(--text-secondary);">
            📦 라이트너 상자 ${currentWord.box || 1}단계
          </span>
        </div>

        <!-- 3D Flashcard -->
        <div class="flashcard-wrapper">
          <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="main-flashcard">
            <!-- Front Face (English + Sound) -->
            <div class="card-face">
              <span style="font-size: 12px; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 4px 12px; border-radius: var(--radius-full);">
                ${currentWord.lesson || 'Seed 1'}
              </span>
              <h2 class="word-display" style="margin-top: 16px;">${currentWord.word}</h2>
              ${currentWord.phonics ? `<span class="phonics-tag">${currentWord.phonics}</span>` : ''}

              <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 8px;">
                <button class="audio-btn" id="study-audio-btn" title="단어 발음 듣기 (${currentWord.word})">
                  <i data-lucide="volume-2"></i>
                </button>
              </div>

              ${currentWord.plural ? `
                <div style="margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; background: #e0f2fe; padding: 6px 14px; border-radius: var(--radius-full); border: 1.5px solid #7dd3fc;">
                  <span style="font-size: 14px; font-weight: 800; color: #0369a1;">
                    복수형: <strong>${currentWord.plural}</strong>
                  </span>
                  <button id="study-plural-audio-btn" title="복수형 발음 듣기 (${currentWord.plural})" style="border: none; background: #0284c7; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
                    <i data-lucide="volume-2" style="width: 15px; height: 15px;"></i>
                  </button>
                </div>
              ` : ''}

              <p style="font-size: 13px; color: var(--text-muted); margin-top: 24px;">
                💡 카드를 클릭하면 한국어 뜻이 보여요!
              </p>
            </div>

            <!-- Back Face (Korean Definition + Example) -->
            <div class="card-face card-back">
              <h3 class="definition-display">${currentWord.definition}</h3>
              <p style="font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 8px;">
                [${currentWord.pos || '명사'}] ${currentWord.plural ? `(복수형: ${currentWord.plural})` : ''}
              </p>
              
              ${currentWord.example ? `
                <div class="example-box">
                  <p style="font-weight: 600;">"${currentWord.example}"</p>
                  <p style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">${currentWord.exampleTranslation || ''}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Buttons Row -->
        <div class="controls-row">
          <button class="btn btn-danger" id="study-know-not">
            <i data-lucide="x-circle"></i> 몰라요 (다시 복습)
          </button>
          <button class="btn btn-success" id="study-know-yes">
            <i data-lucide="check-circle-2"></i> 기억나요! (다음 상자로)
          </button>
        </div>
      </div>
    `;

    lucide.createIcons();

    // Auto speak on render
    window.voiceEngine.speak(currentWord.word);

    // Event handlers
    const card = document.getElementById('main-flashcard');
    if (card) {
      card.addEventListener('click', (e) => {
        // Prevent trigger if audio button clicked
        if (e.target.closest('#study-audio-btn') || e.target.closest('#study-plural-audio-btn')) return;
        this.isFlipped = !this.isFlipped;
        card.classList.toggle('flipped', this.isFlipped);
      });
    }

    const audioBtn = document.getElementById('study-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.voiceEngine.speak(currentWord.word);
      });
    }

    const pluralAudioBtn = document.getElementById('study-plural-audio-btn');
    if (pluralAudioBtn && currentWord.plural) {
      pluralAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.voiceEngine.speak(currentWord.plural);
      });
    }

    document.getElementById('study-know-not').addEventListener('click', () => {
      window.seedState.markWordResult(currentWord.id, false);
      this.nextCard();
    });

    document.getElementById('study-know-yes').addEventListener('click', () => {
      window.seedState.markWordResult(currentWord.id, true);
      this.nextCard();
    });
  }

  nextCard() {
    this.isFlipped = false;
    this.currentIndex = (this.currentIndex + 1) % this.words.length;
    this.render();
  }
}

window.tabStudy = new TabStudy();
