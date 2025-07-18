import React, { useState, useEffect } from "react";
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
  HelpCircle,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Music,
  Headphones
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
      voiceGuide.speak("Welcome to the Mathematical Graph Sonification Tool for blind Students", true);
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
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      const res = await response.json();
      const audioPath = res.audio_file;
      setAudioUrl(`http://localhost:8000/download/${audioPath}`);

      if (res.analysis) {
        const a = res.analysis;
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
        upload: "Upload page",
        analyze: "Analyze page",
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Graph Image</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Upload className="mr-3 text-blue-600" size={28} />
          Select Your Graph Image
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            disabled={loading}
          />
          <p className="text-gray-600 mb-4">
            Supported formats: PNG, JPG, JPEG, GIF
          </p>
          {loading && (
            <div className="mt-6 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              Processing your graph...
            </div>
          )}
        </div>
        
        {uploadedImage && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Uploaded Image:</h3>
            <img
              src={uploadedImage}
              alt="Uploaded graph"
              className="w-full max-w-md border rounded shadow-sm mx-auto"
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => navigateToPage("analyze")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Go to Analysis Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const AnalyzePage = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Graph Analysis Results</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Eye className="mr-3 text-green-600" size={28} />
          Analysis & Sonification
        </h2>
        
        {analysisResult ? (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Graph Analysis</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-700"><strong>Graph Type:</strong> {analysisResult.graph_type}</p>
                  <p className="text-green-700"><strong>Trend:</strong> {analysisResult.trend}</p>
                </div>
                <div>
                  <p className="text-green-700"><strong>X-intercept:</strong> {analysisResult.x_intercept}</p>
                  <p className="text-green-700"><strong>Y-intercept:</strong> {analysisResult.y_intercept}</p>
                </div>
              </div>
            </div>
            
            {audioUrl && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                  <Music className="mr-2" size={24} />
                  Sonification Audio
                </h3>
                <button
                  onClick={playAudio}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center mb-4 hover:bg-purple-700 font-medium"
                >
                  {isPlaying ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
                  {isPlaying ? "Pause Audio" : "Play Audio"}
                </button>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No analysis results available.</p>
            <button
              onClick={() => navigateToPage("upload")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Upload a Graph Image
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mathematical Graph Sonification Tool for blind Students
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload a graph image and listen to its sound representation. Experience mathematics through audio.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Upload className="mr-2 text-blue-600" size={28} />
              <Eye className="mr-3 text-green-600" size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Upload & Analyze</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Upload your mathematical graph image and get detailed analysis including trends, 
            intercepts, and sonification audio. Experience your data through sound.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigateToPage("upload")}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Upload Graph
            </button>
            <button
              onClick={() => navigateToPage("analyze")}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              View Analysis
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Book className="mr-3 text-purple-600" size={32} />
            <h2 className="text-2xl font-semibold text-gray-900">Learn More</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Explore tutorials and guides to understand how graph sonification works and how to 
            interpret the audio representations of mathematical functions.
          </p>
          <button
            onClick={() => navigateToPage("tutorials")}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Go to Tutorials
          </button>
        </div>
      </div>
    </div>
  );

  const TutorialsPage = () => (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Tutorials</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
  aria-label="Linear Functions tutorial card"
>
  <div className="flex items-center mb-4">
    <LineChart className="mr-3 text-blue-600" size={28} />
    <h3 className="text-xl font-semibold">Linear Functions</h3>
  </div>

  <p className="text-gray-600 mb-4">
    Learn how linear functions sound when converted to audio. Understand the relationship 
    between slope and pitch variations.
  </p>

  <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mb-4">
    <strong>Audio Pattern:</strong> Steady pitch changes
  </div>

  {/* External Graph Links */}
  <div className="flex flex-col gap-2">
    <a
      href="https://bick-jp.github.io/p5jsMathGraphSonification/training/03-y-equal-2.html"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center"
      aria-label="Open y equals x graph sonification training in new tab"
    >
      Try y = 2
    </a>
    <a
      href="https://bick-jp.github.io/p5jsMathGraphSonification/training/01-y-equal-x.html"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center"
      aria-label="Open y equals x graph sonification training in new tab"
    >
      Try y = x
    </a>
    <a
      href="https://bick-jp.github.io/p5jsMathGraphSonification/training/02-y-equal-minus-x.html"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center"
      aria-label="Open y equals minus x graph sonification training in new tab"
    >
      Try y = -x
    </a>
  </div>
</div>


        <div
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
  aria-label="Quadratic Functions tutorial card"
>
  <div className="flex items-center mb-4">
    <TrendingUp className="mr-3 text-green-600" size={28} />
    <h3 className="text-xl font-semibold">Quadratic Functions</h3>
  </div>

  <p className="text-gray-600 mb-4">
    Discover how parabolic curves translate to audio. Experience the acceleration and 
    deceleration in sound form.
  </p>

  <div className="bg-green-50 p-3 rounded text-sm text-green-800 mb-4">
    <strong>Audio Pattern:</strong> Curved pitch transitions
  </div>

  {/* External Links for y = x² and y = -x² */}
  <div className="flex flex-col gap-2">
    <a
      href="https://bick-jp.github.io/p5jsMathGraphSonification/training/04-y-equal-x-squared.html"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium text-center"
      aria-label="Open y equals x squared graph sonification training in new tab"
    >
      Try y = x²
    </a>
    <a
      href="https://bick-jp.github.io/p5jsMathGraphSonification/training/05-y-equal-minus-x-squared.html"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium text-center"
      aria-label="Open y equals minus x squared graph sonification training in new tab"
    >
      Try y = -x²
    </a>
  </div>
</div>


      

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Music className="mr-3 text-orange-600" size={28} />
            <h3 className="text-xl font-semibold">Sonification Basics</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Understand the fundamentals of converting visual data to audio. Learn about 
            pitch mapping and frequency relationships.
          </p>
          <div className="bg-orange-50 p-3 rounded text-sm text-orange-800">
            <strong>Key Concept:</strong> Visual to audio mapping
             <ul className="list-disc pl-6 text-sm text-gray-700 mb-4">
        <li>📈 <strong>Pitch</strong> to indicate slope and curve direction</li>
        <li>🔔 <strong>Chime sounds</strong> for X and Y intercepts</li>
        <li>🔊 <strong>Dynamic volume scaling</strong> based on slope magnitude</li>
        <li>🗣 <strong>Text-to-speech</strong> summary of trend and intercepts</li>
      </ul>

          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Headphones className="mr-3 text-red-600" size={28} />
            <h3 className="text-xl font-semibold">Listening Guide</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Master the art of interpreting sonified graphs. Learn to identify patterns, 
            trends, and mathematical features through sound.
          </p>
          <div className="bg-red-50 p-3 rounded text-sm text-red-800">
            <strong>Skill:</strong> Audio pattern recognition
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <HelpCircle className="mr-3 text-teal-600" size={28} />
            <h3 className="text-xl font-semibold">Accessibility Features</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Learn about the accessibility features of this tool including voice guidance, 
            keyboard navigation, and screen reader support.
          </p>
          <div className="bg-teal-50 p-3 rounded text-sm text-teal-800">
            <strong>Focus:</strong> Inclusive design principles
          </div>
        </div>
      </div>
    </div>
  );

  const navBtnStyle = (active) =>
    `flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
      active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
    }`;

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
              <Upload size={18} className="mr-2" /> Upload
            </button>
            <button onClick={() => navigateToPage("analyze")} className={navBtnStyle(currentPage === "analyze")}>
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
        {currentPage === "home" && <HomePage />}
        {currentPage === "tutorials" && <TutorialsPage />}
        {currentPage === "upload" && <UploadPage />}
        {currentPage === "analyze" && <AnalyzePage />}
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