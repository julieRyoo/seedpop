// SeedPop — Voice Engine (Web Speech API TTS with slow mode support)

class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const load = () => {
      this.voices = this.synth.getVoices();
      // Prefer Google US English, Samantha, or any en-US voice
      this.selectedVoice = 
        this.voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
        this.voices.find(v => v.lang === 'en-US') ||
        this.voices.find(v => v.lang.startsWith('en')) ||
        this.voices[0];
    };

    load();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = load;
    }
  }

  speak(text, slow = false) {
    if (!this.synth) {
      alert("이 브라우저는 음성 재생을 지원하지 않습니다.");
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slow ? 0.7 : 0.95; // 0.7 for 2nd graders to listen carefully!
    utterance.pitch = 1.05;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.synth.speak(utterance);
  }
}

window.voiceEngine = new VoiceEngine();
