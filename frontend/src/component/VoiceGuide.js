export class VoiceGuide {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isEnabled = false;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 0.8;
    this.setVoice();
  }

  setVoice() {
    const trySet = () => {
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        this.voice = voices.find(v => v.lang.includes("en")) || voices[0];
      } else {
        setTimeout(trySet, 200);
      }
    };
    trySet();
  }

  speak(text, priority = false) {
    if (!this.isEnabled || !this.synth) return;
    if (priority) this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) this.speak("Voice guidance enabled.");
    return this.isEnabled;
  }
}

export const voiceGuide = new VoiceGuide();
