// SeedPop — Core State & Leitner Spaced Repetition Logic

const SEEDPOP_VERSION = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : "2026.09.28.1";

class SeedPopState {
  constructor() {
    this.STORAGE_KEY = 'seedpop_words_v2';
    this.VERSION_KEY = 'seedpop_version';
    this.STREAK_KEY = 'seedpop_streak_v1';
    this.version = SEEDPOP_VERSION;
    this.words = [];
    this.selectedLevel = 'ALL';
    this.selectedLesson = 'ALL';
    this.streak = 0;
    this.lastStudyDate = null;
    
    this.loadState();
  }

  loadState() {
    const savedVersion = localStorage.getItem(this.VERSION_KEY);
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (savedVersion !== this.version || !saved) {
      console.log(`[SeedPop] 새 버전 감지 (${savedVersion} -> ${this.version}): 기본 단어장 동기화`);
      this.words = JSON.parse(JSON.stringify(window.defaultWords || []));
      this.saveState();
      localStorage.setItem(this.VERSION_KEY, this.version);
    } else {
      try {
        this.words = JSON.parse(saved);
        if (window.defaultWords) {
          this.words.forEach(w => {
            const def = window.defaultWords.find(dw => dw.id === w.id);
            if (def && def.plural) {
              w.plural = def.plural;
            }
          });
          this.saveState();
        }
      } catch (e) {
        console.error("Failed to parse saved words", e);
        this.words = [...(window.defaultWords || [])];
      }
    }

    const savedStreak = localStorage.getItem(this.STREAK_KEY);
    if (savedStreak) {
      const data = JSON.parse(savedStreak);
      this.streak = data.streak || 0;
      this.lastStudyDate = data.lastDate || null;
    }
  }

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.words));
    localStorage.setItem(this.STREAK_KEY, JSON.stringify({
      streak: this.streak,
      lastDate: this.lastStudyDate
    }));
  }

  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastStudyDate === today) return;

    if (this.lastStudyDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (this.lastStudyDate === yesterdayStr) {
        this.streak += 1;
      } else {
        this.streak = 1;
      }
    } else {
      this.streak = 1;
    }
    this.lastStudyDate = today;
    this.saveState();
  }

  getFilteredWords() {
    return this.words.filter(w => {
      const levelMatch = this.selectedLevel === 'ALL' || w.level === this.selectedLevel;
      const lessonMatch = this.selectedLesson === 'ALL' || w.lesson === this.selectedLesson;
      return levelMatch && lessonMatch;
    });
  }

  getIncorrectWords() {
    return this.getFilteredWords().filter(w => w.box === 1 || w.isIncorrect);
  }

  getLevels() {
    const levels = new Set(this.words.map(w => w.level));
    return ['ALL', ...Array.from(levels)];
  }

  getLessons(level = this.selectedLevel) {
    const words = level === 'ALL' ? this.words : this.words.filter(w => w.level === level);
    const lessons = new Set(words.map(w => w.lesson));
    return ['ALL', ...Array.from(lessons)];
  }

  // Leitner Spaced Repetition Progression
  markWordResult(wordId, isCorrect) {
    const word = this.words.find(w => w.id === wordId);
    if (!word) return;

    if (isCorrect) {
      word.box = Math.min((word.box || 1) + 1, 5);
      word.isIncorrect = false;
    } else {
      word.box = 1; // Drop back to Box 1 for review
      word.isIncorrect = true;
    }

    this.updateStreak();
    this.saveState();
  }

  addCustomWord(wordData) {
    const newWord = {
      id: 'custom_' + Date.now(),
      word: wordData.word.trim(),
      pos: wordData.pos || 'noun',
      definition: wordData.definition.trim(),
      example: wordData.example || '',
      exampleTranslation: wordData.exampleTranslation || '',
      level: wordData.level || 'Seed 1 Book 1',
      lesson: wordData.lesson || 'Lesson 01',
      phonics: wordData.phonics || '',
      box: 1,
      nextReview: 0
    };

    this.words.unshift(newWord);
    this.saveState();
    return newWord;
  }

  deleteWord(id) {
    this.words = this.words.filter(w => w.id !== id);
    this.saveState();
  }

  resetProgress() {
    this.words.forEach(w => {
      w.box = 1;
      w.isIncorrect = false;
    });
    this.saveState();
  }

  resetToDefaultWords() {
    this.words = JSON.parse(JSON.stringify(window.defaultWords));
    this.saveState();
  }
}

window.seedState = new SeedPopState();
