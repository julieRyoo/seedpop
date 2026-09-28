// SeedPop — Dedicated Add Word Tab Component

class TabAddWord {
  constructor() {
    this.container = document.getElementById('add-word-tab');
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="background: white; border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-pop); border: 3px solid #e0e7ff;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px dashed #cbd5e1;">
            <div style="width: 44px; height: 44px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="plus-circle" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <h2 style="font-size: 22px; font-weight: 800; color: var(--text-main);">➕ 새 단어 등록하기</h2>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">나만의 April Seed 1 단어를 직접 등록해보세요!</p>
            </div>
          </div>

          <form id="standalone-add-word-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">영단어 (English Word) <span style="color: #ef4444;">*</span></label>
              <input type="text" id="standalone-word-input" required class="select-input" style="width: 100%; margin-top: 6px; font-size: 16px;" placeholder="예: sunflower" />
            </div>

            <div>
              <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">한글 뜻 (Definition) <span style="color: #ef4444;">*</span></label>
              <input type="text" id="standalone-def-input" required class="select-input" style="width: 100%; margin-top: 6px; font-size: 16px;" placeholder="예: 해바라기" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">교재/레벨 (Level)</label>
                <select id="standalone-level-select" class="select-input" style="width: 100%; margin-top: 6px;">
                  <option value="Seed 1 Book 3">Seed 1 Book 3</option>
                  <option value="Seed 1 Book 1">Seed 1 Book 1</option>
                  <option value="Seed 1 Book 2">Seed 1 Book 2</option>
                  <option value="Seed 1 Extra">Seed 1 Extra</option>
                </select>
              </div>

              <div>
                <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">레슨 (Lesson)</label>
                <input type="text" id="standalone-lesson-input" class="select-input" style="width: 100%; margin-top: 6px;" placeholder="Lesson 05 (p.37)" value="Lesson 05 (p.37)" />
              </div>
            </div>

            <div>
              <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">영어 예문 (Example Sentence)</label>
              <input type="text" id="standalone-example-input" class="select-input" style="width: 100%; margin-top: 6px;" placeholder="The sunflower is yellow." />
            </div>

            <div>
              <label style="font-size: 14px; font-weight: 700; color: var(--text-main);">예문 한국어 번역 (Example Translation)</label>
              <input type="text" id="standalone-example-trans-input" class="select-input" style="width: 100%; margin-top: 6px;" placeholder="해바라기는 노란색이에요." />
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 12px; justify-content: center; padding: 16px; font-size: 18px;">
              ✨ 단어장으로 저장하기
            </button>
          </form>

          <div id="add-word-success-msg" style="display: none; margin-top: 20px; padding: 16px; background: #d1fae5; border: 2px solid #10b981; border-radius: var(--radius-md); color: #065f46; font-weight: 700; text-align: center;">
            🎉 단어가 성공적으로 등록되었습니다! 단어장 관리 및 학습 모드에서 확인해보세요.
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    const form = document.getElementById('standalone-add-word-form');
    const msg = document.getElementById('add-word-success-msg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const word = document.getElementById('standalone-word-input').value;
      const def = document.getElementById('standalone-def-input').value;
      const level = document.getElementById('standalone-level-select').value;
      const lesson = document.getElementById('standalone-lesson-input').value;
      const example = document.getElementById('standalone-example-input').value;
      const exampleTranslation = document.getElementById('standalone-example-trans-input').value;

      window.seedState.addCustomWord({ word, definition: def, level, lesson, example, exampleTranslation });

      // Speak newly added word
      window.voiceEngine.speak(word);

      // Show success message
      msg.style.display = 'block';
      form.reset();

      setTimeout(() => {
        msg.style.display = 'none';
      }, 3000);
    });
  }
}

window.tabAddWord = new TabAddWord();
