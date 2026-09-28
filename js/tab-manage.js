// SeedPop — Vocabulary Management Tab Component (Full Visibility & Instant Search)

class TabManage {
  constructor() {
    this.container = document.getElementById('manage-tab');
    this.searchQuery = '';
    this.selectedLevel = 'ALL';
  }

  init() {
    this.searchQuery = '';
    this.selectedLevel = 'ALL';
    this.render();
  }

  getFilteredWords() {
    return window.seedState.words.filter(w => {
      const levelMatch = this.selectedLevel === 'ALL' || w.level === this.selectedLevel;
      const q = this.searchQuery.toLowerCase().trim();
      const searchMatch = !q || 
        w.word.toLowerCase().includes(q) || 
        w.definition.toLowerCase().includes(q) || 
        (w.lesson && w.lesson.toLowerCase().includes(q));
      return levelMatch && searchMatch;
    });
  }

  render() {
    const allWords = window.seedState.words;
    const filteredWords = this.getFilteredWords();
    const levels = window.seedState.getLevels();

    this.container.innerHTML = `
      <div style="background: white; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
        <!-- Top Action & Info Header -->
        <div style="padding-bottom: 20px; margin-bottom: 20px; border-bottom: 2px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="font-size: 22px; font-weight: 800; color: var(--text-main);">
              📕 전체 단어장 목록 (${allWords.length}개 중 ${filteredWords.length}개 표시)
            </h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              스피커(🔊) 버튼을 누르면 영어 발음을 바로 들을 수 있습니다.
            </p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="restore-default-words-btn" style="font-size: 13px; color: var(--primary); border: 1px solid var(--primary-light);">
              🌱 기본 교재 단어장 복원
            </button>
            <button class="btn btn-secondary" id="reset-progress-btn" style="font-size: 13px; color: #dc2626; border: 1px solid #fca5a5;">
              🔄 암기 단계 초기화
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="manage-search-input" class="select-input" style="width: 100%;" placeholder="🔍 영단어 또는 뜻 검색..." value="${this.searchQuery}" />
          </div>
          <div>
            <select id="manage-level-select" class="select-input">
              ${levels.map(l => `<option value="${l}" ${l === this.selectedLevel ? 'selected' : ''}>${l === 'ALL' ? '전체 교재 보기' : l}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Full Table Display (No restrictive max-height clipping) -->
        <div class="table-container" style="box-shadow: none; border: 2px solid #e2e8f0; border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 14px 18px; text-align: left; width: 28%;">영단어 & 발음</th>
                <th style="padding: 14px 18px; text-align: left; width: 32%;">한글 뜻</th>
                <th style="padding: 14px 18px; text-align: left; width: 22%;">교재 / 레슨</th>
                <th style="padding: 14px 18px; text-align: center; width: 10%;">단계</th>
                <th style="padding: 14px 18px; text-align: center; width: 8%;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${filteredWords.length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 15px;">
                    검색 결과와 일치하는 단어가 없습니다.
                  </td>
                </tr>
              ` : filteredWords.map((w, idx) => `
                <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#fafafa'};">
                  <td style="padding: 14px 18px; font-weight: 800; color: var(--primary); font-family: var(--font-display);">
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="speak-word-btn" data-word="${w.word}" title="단어 발음 듣기 (${w.word})" style="border: none; background: var(--primary-light); color: var(--primary); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: transform 0.2s ease;">
                          <i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>
                        </button>
                        <span style="font-size: 17px;">${w.word}</span>
                      </div>
                      ${w.plural ? `
                        <div style="display: flex; align-items: center; gap: 6px; margin-left: 6px; font-size: 13px;">
                          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 700;">복수: ${w.plural}</span>
                          <button class="speak-word-btn" data-word="${w.plural}" title="복수형 발음 듣기 (${w.plural})" style="border: none; background: #bae6fd; color: #0284c7; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
                          </button>
                        </div>
                      ` : ''}
                    </div>
                  </td>
                  <td style="padding: 14px 18px; font-weight: 700; color: var(--text-main); font-size: 15px;">
                    ${w.definition}
                  </td>
                  <td style="padding: 14px 18px; font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                    ${w.level} / ${w.lesson}
                  </td>
                  <td style="padding: 14px 18px; text-align: center;">
                    <span class="badge" style="background: ${w.box === 5 ? '#10b981' : 'var(--primary)'}; padding: 4px 10px; font-size: 12px;">
                      Box ${w.box || 1}
                    </span>
                  </td>
                  <td style="padding: 14px 18px; text-align: center;">
                    <button class="delete-word-btn" data-id="${w.id}" style="border: none; background: #fee2e2; color: #ef4444; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px; transition: background 0.2s;">
                      삭제
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();

    // Event handlers
    const searchInput = document.getElementById('manage-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
        const input = document.getElementById('manage-search-input');
        if (input) {
          input.focus();
          input.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
        }
      });
    }

    const levelSelect = document.getElementById('manage-level-select');
    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        this.selectedLevel = e.target.value;
        this.render();
      });
    }

    // Sound buttons in list
    this.container.querySelectorAll('.speak-word-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const wordText = btn.getAttribute('data-word');
        window.voiceEngine.speak(wordText);
      });
    });

    // Restore default words button
    document.getElementById('restore-default-words-btn').addEventListener('click', () => {
      if (confirm("April Seed 1 Book 3 기본 교재 단어장으로 복원하시겠습니까?")) {
        window.seedState.resetToDefaultWords();
        alert("기본 교재 단어장이 성공적으로 복원되었습니다!");
        this.render();
      }
    });

    // Reset progress
    document.getElementById('reset-progress-btn').addEventListener('click', () => {
      if (confirm("모든 단어의 암기 단계(상자)가 1단계로 초기화됩니다. 진행하시겠습니까?")) {
        window.seedState.resetProgress();
        alert("모든 암기 단계가 초기화되었습니다.");
        this.render();
      }
    });

    // Delete buttons
    this.container.querySelectorAll('.delete-word-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm("이 단어를 정말 삭제하시겠습니까?")) {
          window.seedState.deleteWord(id);
          this.render();
        }
      });
    });
  }
}

window.tabManage = new TabManage();
