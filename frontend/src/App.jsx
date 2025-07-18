import React, { useState } from "react";
import axios from "axios";
import { voiceGuide } from "./components/VoiceGuide";

function App() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    voiceGuide.speak("Starting sonification", true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setAudioUrl(`http://localhost:8000/download/${res.data.audio_file}`);
    } catch (err) {
      console.error("Upload failed:", err);
      voiceGuide.speak("Upload failed", true);
      alert("Upload failed.");
    }
    setLoading(false);
  };

  return (
    <main id="main-content" className="min-h-screen px-4 py-6 text-center bg-gray-50">
      <a href="#main-content" className="skip-link focus:static absolute left-[-9999px] focus:left-0 bg-gray-800 text-white p-2">Skip to Main Content</a>
      
      <h1 className="text-2xl font-bold mb-4">Voice-Guided Graph Sonification Tool</h1>

      {/* Voice Controls */}
      <div className="mb-6 space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setVoiceEnabled(true); voiceGuide.toggle(); }}>
          🔊 Enable Voice Guide
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => { setVoiceEnabled(false); voiceGuide.stop(); }}>
          🔇 Disable Voice
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={() => voiceGuide.stop()}>
          ⏹️ Stop Speaking
        </button>
      </div>
      <div aria-live="polite" className="mb-4 text-lg">
        {voiceEnabled ? "🔊 Voice guidance is ON" : "🔇 Voice guidance is OFF"}
      </div>

      {/* File Upload */}
      <section aria-labelledby="upload-section" className="mb-6">
        <h2 id="upload-section" className="text-xl font-semibold mb-2">Step 1: Upload Your Graph</h2>
        <input
          type="file"
          accept="image/png"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleUpload}
          disabled={loading}
        >
          🔄 {loading ? "Processing..." : "Start Sonification Process"}
        </button>
      </section>

      {/* Audio Section */}
      {audioUrl && (
        <section aria-labelledby="listen-section" className="mt-6">
          <h2 id="listen-section" className="text-xl font-semibold mb-2">Step 2: Listen to Your Graph</h2>
          <audio controls src={audioUrl}></audio>
        </section>
      )}

      {/* Accessibility Info */}
      <footer className="mt-8 text-sm text-gray-600 border-t pt-4">
        <h3 className="text-base font-semibold">Accessibility Features</h3>
        <ul className="list-disc list-inside">
          <li>Screen reader support with ARIA roles</li>
          <li>Keyboard navigation and focus styles</li>
          <li>Voice guidance via Web Speech API</li>
        </ul>
      </footer>
    </main>
  );
}

export default App;
