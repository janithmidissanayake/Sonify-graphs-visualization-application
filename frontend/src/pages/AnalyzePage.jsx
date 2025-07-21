import React from "react";
import { Eye, Music, Headphones } from "lucide-react";

const AnalyzePage = ({ analysisResult, graphAudioUrl, voiceAudioUrl, navigateToPage }) => (
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

          {graphAudioUrl && (
            <div className="bg-purple-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                <Music className="mr-2" size={24} />
                Sonification Audio
              </h3>
              <audio controls src={graphAudioUrl} className="w-full mb-2" />
            </div>
          )}

          {voiceAudioUrl && (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                <Headphones className="mr-2" size={24} />
                Voice Description
              </h3>
              <audio controls src={voiceAudioUrl} className="w-full" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No analysis results available.</p>
          <button
            onClick={() => navigateToPage("/upload")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload a Graph Image
          </button>
        </div>
      )}
    </div>
  </div>
);

export default AnalyzePage;
