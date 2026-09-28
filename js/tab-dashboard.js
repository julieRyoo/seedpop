// SeedPop — Dashboard Tab Component

class TabDashboard {
  constructor() {
    this.container = document.getElementById('dashboard-tab');
  }

  init() {
    this.render();
  }

  render() {
    const levels = window.seedState.getLevels();
    const currentLevel = window.seedState.selectedLevel;
    const filteredWords = window.seedState.getFilteredWords();
    const incorrectWords = window.seedState.getIncorrectWords();
    const streak = window.seedState.streak;

    // Calculate Box stats
    const boxCounts = [0, 0, 0, 0, 0];
    filteredWords.forEach(w => {
      const b = Math.max(1, Math.min(5, w.box || 1));
      boxCounts[b - 1]++;
    });

    this.container.innerHTML = `
      <div class="level-selector-card">
        <label for="dash-level-select" style="font-weight: 700; color: var(--text-secondary); font-size: 15px;">
          📚 Seed 1 레벨/교재 선택:
        </label>
        <select id="dash-level-select" class="select-input">
          ${levels.map(l => `<option value="${l}" ${l === currentLevel ? 'selected' : ''}>${l === 'ALL' ? '전체 보기 (All Seed 1)' : l}</option>`).join('')}
        </select>
      </div>

      <div class="grid-2">
        <!-- Streak Card -->
        <div class="stat-card">
          <div>
            <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">연속 학습 스트릭</span>
            <h3 style="font-size: 28px; font-weight: 800; color: #f59e0b; margin-top: 4px;">🔥 ${streak}일 연속 학습!</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">매일매일 꾸준히 단어를 완성해보세요!</p>
          </div>
          <div style="font-size: 42px;">⭐</div>
        </div>

        <!-- Incorrect Notebook Shortcut -->
        <div class="stat-card" id="incorrect-shortcut-btn" style="border-left: 6px solid #ef4444;">
          <div>
            <span style="font-size: 13px; color: #ef4444; font-weight: 700;">집중 복습 필요</span>
            <h3 style="font-size: 28px; font-weight: 800; color: #ef4444; margin-top: 4px;">📕 ${incorrectWords.length}개 오답 단어</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">틀린 단어만 모아서 다시 복습하기 &rarr;</p>
          </div>
          <div style="width: 52px; height: 52px; background: #fee2e2; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #ef4444;">
            <i data-lucide="book-open-check"></i>
          </div>
        </div>
      </div>

      <!-- Leitner Spaced Repetition Box Overview -->
      <div style="background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md); margin-bottom: 30px;">
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 16px; color: var(--text-main);">
          🌱 라이트너 상자별 단어 현황 (Spaced Repetition)
        </h3>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; text-align: center;">
          ${boxCounts.map((count, idx) => `
            <div style="background: #f8fafc; padding: 16px 8px; border-radius: var(--radius-md); border: 2px solid ${idx === 0 ? '#fca5a5' : '#e2e8f0'};">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">상자 ${idx + 1}</span>
              <h4 style="font-size: 24px; font-weight: 800; color: ${idx === 0 ? '#ef4444' : 'var(--primary)'}; margin-top: 4px;">${count}개</h4>
              <span style="font-size: 11px; color: var(--text-secondary);">${idx === 0 ? '매일 복습' : (idx === 4 ? '완전 암기' : `${idx + 1}일 주기`)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    lucide.createIcons();

    // Event listeners
    const levelSelect = document.getElementById('dash-level-select');
    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        window.seedState.selectedLevel = e.target.value;
        this.render();
      });
    }

    const shortcut = document.getElementById('incorrect-shortcut-btn');
    if (shortcut) {
      shortcut.addEventListener('click', () => {
        // Switch to study tab filtered for incorrect words
        document.querySelector('[data-target="study-tab"]').click();
      });
    }
  }
}

window.tabDashboard = new TabDashboard();
