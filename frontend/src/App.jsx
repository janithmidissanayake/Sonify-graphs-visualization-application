import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Upload,
  Book,
  Eye,
  Volume2,
  VolumeX,
  Home,
  HelpCircle
} from "lucide-react";

import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import AnalyzePage from "./pages/AnalyzePage";
import TutorialsPage from "./pages/TutorialPage";

// Voice guide helper
const voiceGuide = {
  speak: (text, interrupt = false) => {
    if ("speechSynthesis" in window) {
      if (interrupt) window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  },
  stop: () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },
};

function App() {
  const navigate = useNavigate();

  const [graphAudioUrl, setGraphAudioUrl] = useState(null);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (voiceEnabled) {
      voiceGuide.speak("Welcome to the Mathematical Graph Sonification Tool for blind Students", true);
    }
  }, [voiceEnabled]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploadedImage(URL.createObjectURL(selectedFile));
    setGraphAudioUrl(null);
    setVoiceAudioUrl(null);
    setAnalysisResult(null);
    setLoading(true);
    handleUpload(selectedFile);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    if (voiceEnabled) {
      voiceGuide.speak("Starting sonification", true);
    }

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const res = await response.json();

      if (res.graph_audio && res.voice_audio) {
        setGraphAudioUrl(`http://localhost:8000/download/${res.graph_audio}`);
        setVoiceAudioUrl(`http://localhost:8000/download/${res.voice_audio}`);
      }

      if (res.metadata) {
        const a = res.metadata;
        setAnalysisResult(a);
        if (voiceEnabled) {
          const message = `Graph analysis complete. Trend is ${a.trend}. X intercept at ${a.x_intercept}. Y intercept at ${a.y_intercept}.`;
          voiceGuide.speak(message, true);
        }
      } else {
        voiceGuide.speak("Sonification complete. Ready to play audio.", true);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
      if (voiceEnabled) voiceGuide.speak("Upload failed. Please try again.", true);
    }

    setLoading(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      voiceGuide.speak("Voice guidance enabled", true);
    } else {
      voiceGuide.stop();
    }
  };

  const navigateToPage = (path) => {
    navigate(path);
    if (voiceEnabled) {
      const pageNames = {
        "/": "Home page",
        "/tutorials": "Tutorials page",
        "/upload": "Upload page",
        "/analyze": "Analyze page",
      };
      voiceGuide.speak(`Navigated to ${pageNames[path]}`, true);
    }
  };

  const navBtnStyle = (path) =>
    `flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
      window.location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex space-x-6">
            <button onClick={() => navigateToPage("/")} className={navBtnStyle("/")}>
              <Home size={18} className="mr-2" /> Home
            </button>
            <button onClick={() => navigateToPage("/tutorials")} className={navBtnStyle("/tutorials")}>
              <Book size={18} className="mr-2" /> Tutorials
            </button>
            <button onClick={() => navigateToPage("/upload")} className={navBtnStyle("/upload")}>
              <Upload size={18} className="mr-2" /> Upload
            </button>
            <button onClick={() => navigateToPage("/analyze")} className={navBtnStyle("/analyze")}>
              <Eye size={18} className="mr-2" /> Analyze
            </button>
          </nav>
          <button onClick={toggleVoice} className={`flex items-center px-4 py-2 rounded-lg font-medium ${voiceEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
            {voiceEnabled ? <Volume2 size={18} className="mr-2" /> : <VolumeX size={18} className="mr-2" />}
            {voiceEnabled ? "Voice On" : "Voice Off"}
          </button>
        </div>
      </header>

      <main className="py-8 px-4" id="main-content">
        <Routes>
          <Route path="/" element={<HomePage navigateToPage={navigateToPage} />} />
          <Route
            path="/upload"
            element={
              <UploadPage
                handleFileChange={handleFileChange}
                loading={loading}
                uploadedImage={uploadedImage}
                navigateToPage={navigateToPage}
              />
            }
          />
          <Route
            path="/analyze"
            element={
              <AnalyzePage
                analysisResult={analysisResult}
                graphAudioUrl={graphAudioUrl}
                voiceAudioUrl={voiceAudioUrl}
                navigateToPage={navigateToPage}
              />
            }
          />
          <Route path="/tutorials" element={<TutorialsPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
          <h3 className="font-semibold mb-2 flex justify-center items-center">
            <HelpCircle size={18} className="mr-2" /> Accessibility Features
          </h3>
          <p className="text-sm">
            Screen reader support • Keyboard navigation • Voice guidance • Sonification technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
