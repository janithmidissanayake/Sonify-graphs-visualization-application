import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Play,
  Pause,
  Upload,
  Book,
  Calculator,
  Eye,
  Volume2,
  VolumeX,
  Home,
  HelpCircle
} from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState("home");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (voiceEnabled) {
      voiceGuide.speak("Welcome to the Mathematical Graph Sonification Tool", true);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploadedImage(URL.createObjectURL(selectedFile));
    setAudioUrl(null);
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
      const res = await axios.post("http://localhost:8000/upload", formData);
      const audioPath = res.data.audio_file;
      setAudioUrl(`http://localhost:8000/download/${audioPath}`);

      if (res.data.analysis) {
        const a = res.data.analysis;
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

  const navigateToPage = (page) => {
    setCurrentPage(page);
    if (voiceEnabled) {
      const pageNames = {
        home: "Home page",
        tutorials: "Tutorials page",
        upload: "Upload and analyze page",
      };
      voiceGuide.speak(`Navigated to ${pageNames[page]}`, true);
    }
  };

  const playAudio = () => {
    setIsPlaying(!isPlaying);
    if (voiceEnabled) {
      voiceGuide.speak(isPlaying ? "Audio paused" : "Playing sonification", true);
    }
  };

  const UploadPage = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload & Analyze Graphs</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2 text-blue-600" size={24} />
            Upload Graph Image
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            disabled={loading}
          />
          {loading && (
            <div className="mt-4 text-gray-600 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              Analyzing your graph...
            </div>
          )}
          {uploadedImage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
              <img
                src={uploadedImage}
                alt="Uploaded graph"
                className="w-full max-w-md border rounded"
              />
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Eye className="mr-2 text-green-600" size={24} />
            Analysis Results
          </h2>
          {analysisResult ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-green-800">Graph Type: {analysisResult.graph_type}</h3>
                <p className="text-green-700"><strong>Trend:</strong> {analysisResult.trend}</p>
                <p className="text-green-700"><strong>X-intercept:</strong> {analysisResult.x_intercept}</p>
                <p className="text-green-700"><strong>Y-intercept:</strong> {analysisResult.y_intercept}</p>
              </div>
              {audioUrl && (
                <div className="bg-purple-50 p-4 rounded">
                  <h3 className="font-semibold text-purple-800 mb-2">Sonification:</h3>
                  <button
                    onClick={playAudio}
                    className="bg-purple-600 text-white px-4 py-2 rounded flex items-center mb-2"
                  >
                    {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                    {isPlaying ? "Pause" : "Play"} Audio
                  </button>
                  <audio controls src={audioUrl} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Upload a graph image to see analysis results.</p>
          )}
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Mathematical Graph Sonification Tool
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload a graph image and listen to its sound representation.
      </p>
      <button
        onClick={() => navigateToPage("upload")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Go to Upload & Analyze
      </button>
    </div>
  );

  const TutorialsPage = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Tutorials</h1>
      {/* Add tutorial cards if needed */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex space-x-6">
            <button onClick={() => navigateToPage("home")} className={navBtnStyle(currentPage === "home")}>
              <Home size={18} className="mr-2" /> Home
            </button>
            <button onClick={() => navigateToPage("tutorials")} className={navBtnStyle(currentPage === "tutorials")}>
              <Book size={18} className="mr-2" /> Tutorials
            </button>
            <button onClick={() => navigateToPage("upload")} className={navBtnStyle(currentPage === "upload")}>
              <Upload size={18} className="mr-2" /> Upload & Analyze
            </button>
          </nav>
          <button onClick={toggleVoice} className={`flex items-center px-4 py-2 rounded-lg font-medium ${voiceEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
            {voiceEnabled ? <Volume2 size={18} className="mr-2" /> : <VolumeX size={18} className="mr-2" />}
            {voiceEnabled ? "Voice On" : "Voice Off"}
          </button>
        </div>
      </header>

      <main className="py-8 px-4" id="main-content">
        {currentPage === "home" && <HomePage />}
        {currentPage === "tutorials" && <TutorialsPage />}
        {currentPage === "upload" && <UploadPage />}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
          <h3 className="font-semibold mb-2 flex justify-center items-center">
            <HelpCircle size={18} className="mr-2" /> Accessibility Features
          </h3>
          <p className="text-sm">
            Screen reader support • Keyboard navigation • Voice guidance
          </p>
        </div>
      </footer>
    </div>
  );
}

const navBtnStyle = (active) =>
  `flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
    active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
  }`;

export default App;
