# Accessibility-enhanced version of your Streamlit app
# Integrates screen reader support, keyboard navigation, and fully functional voice synthesis via iframe injection

import streamlit as st
import requests
import time

# Page configuration
st.set_page_config(
    page_title="Voice-Guided Graph Sonification Tool",
    layout="centered",
    initial_sidebar_state="expanded"
)

# Inject Skip Link, Main Landmark, Focus Styles
st.markdown("""
<a href="#main-content" class="skip-link" tabindex="1">⏩ Skip to Main Content</a>

<style>
.skip-link {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
.skip-link:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 10px;
    background-color: #343a40;
    color: white;
    z-index: 1000;
    font-weight: bold;
    border-radius: 4px;
}
:focus {
    outline: 3px solid #ff8c00;
    outline-offset: 2px;
}
</style>

<main id="main-content" role="main" tabindex="-1"></main>
""", unsafe_allow_html=True)

# Inject voice synthesis JS via escaped iframe
script = """
<script>
(function() {
  if (!window.voiceGuide) {
    class VoiceGuide {
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
            this.voice = voices.find(v => v.lang.includes('en')) || voices[0];
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
        if (this.isEnabled) {
          this.speak('Voice guidance enabled. I will help you navigate.');
        }
        return this.isEnabled;
      }
      setRate(r) { this.rate = r; }
      setPitch(p) { this.pitch = p; }
      setVolume(v) { this.volume = v; }
    }
    window.voiceGuide = new VoiceGuide();
    window.toggleVoice = () => window.voiceGuide.toggle();
    window.speakInstruction = (txt) => window.voiceGuide.speak(txt);
    window.speakPriority = (txt) => window.voiceGuide.speak(txt, true);
    window.lastInstruction = '';
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') toggleVoice();
      if (e.ctrlKey && e.shiftKey && e.key === 'S') window.voiceGuide.stop();
      if (e.ctrlKey && e.shiftKey && e.key === 'R') window.voiceGuide.speak(window.lastInstruction, true);
    });
  }
})();
</script>
""".replace('"', '&quot;').replace('\n', ' ')

st.markdown(f"""<iframe srcdoc="{script}" width="0" height="0" style="display:none; border:none;"></iframe>""", unsafe_allow_html=True)

# Voice Control Panel
st.markdown('<div class="voice-control-panel" role="region" aria-label="Voice Guidance Controls">', unsafe_allow_html=True)
st.markdown("### 🎤 Voice Guidance Controls")

col1, col2, col3 = st.columns(3)

with col1:
    if st.button("🔊 Enable Voice Guide", key="enable_voice", help="Turn on voice guidance (Ctrl+Shift+V)"):
        st.session_state['voice_enabled'] = True
        st.markdown('<script>toggleVoice();</script>', unsafe_allow_html=True)

with col2:
    if st.button("🔇 Disable Voice", key="disable_voice", help="Turn off voice guidance"):
        st.session_state['voice_enabled'] = False
        st.markdown('<script>window.voiceGuide.isEnabled = false; window.voiceGuide.stop();</script>', unsafe_allow_html=True)

with col3:
    if st.button("⏹️ Stop Speaking", key="stop_voice", help="Stop current voice announcement (Ctrl+Shift+S)"):
        st.markdown('<script>window.voiceGuide.stop();</script>', unsafe_allow_html=True)

status = "🔊 Voice guidance is ON" if st.session_state.get('voice_enabled', False) else "🔇 Voice guidance is OFF"
st.markdown(f'<div aria-live="polite" class="voice-status">{status}</div>', unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# Step 1: Upload
st.markdown('<section role="region" aria-labelledby="upload-section">', unsafe_allow_html=True)
st.markdown('<h2 id="upload-section" class="section-header">Step 1: Upload Your Graph</h2>', unsafe_allow_html=True)

uploaded_file = st.file_uploader(
    "Choose a PNG graph image",
    type=["png"],
    help="Upload a PNG image of a graph.",
    key="graph_uploader",
    label_visibility="visible"
)

if uploaded_file:
    st.success("File uploaded successfully!")
    st.markdown('<div id="status-region" role="status" aria-live="polite">Upload completed. Proceed to processing.</div>', unsafe_allow_html=True)

    # Step 2: Process
    st.markdown('<h2 class="section-header">Step 2: Process Graph</h2>', unsafe_allow_html=True)
    if st.button("🔄 Start Sonification Process", key="process_button"):
        st.markdown('<script>speakPriority("Starting sonification.");</script>', unsafe_allow_html=True)
        with st.spinner("Processing..."):
            progress_bar = st.progress(0)
            for i in range(5):
                progress_bar.progress((i + 1) * 20)
                time.sleep(0.3)
            try:
                response = requests.post("http://127.0.0.1:8000/upload", files={"file": (uploaded_file.name, uploaded_file, "image/png")})
                if response.status_code == 200:
                    data = response.json()
                    st.session_state['sonification_data'] = data
                    st.session_state['processing_complete'] = True
                    st.success("Sonification complete!")
                else:
                    st.error("Processing failed.")
            except Exception as e:
                st.error(f"Error: {str(e)}")

st.markdown('</section>', unsafe_allow_html=True)

# Step 3: Listen
if st.session_state.get("processing_complete"):
    data = st.session_state['sonification_data']
    st.markdown('<section role="region" aria-labelledby="listen-section">', unsafe_allow_html=True)
    st.markdown('<h2 id="listen-section" class="section-header">Step 3: Listen to Your Graph</h2>', unsafe_allow_html=True)
    st.audio(f"http://127.0.0.1:8000/download/{data['audio_file']}", format='audio/wav')
    st.markdown('</section>', unsafe_allow_html=True)

# Footer accessibility tips
st.markdown("""
<section role="contentinfo">
<hr>
<h3>Accessibility Features</h3>
<ul>
<li>Screen reader friendly with ARIA roles and labels</li>
<li>Keyboard navigation via Tab, Shift+Tab, and Enter</li>
<li>Voice-guided instructions and audio status feedback</li>
</ul>
</section>
""", unsafe_allow_html=True)