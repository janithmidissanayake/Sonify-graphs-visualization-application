import React from "react";
import { Upload, Eye, Book } from "lucide-react";

const HomePage = ({ navigateToPage }) => (
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
            onClick={() => navigateToPage("/upload")}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload Graph
          </button>
          <button
            onClick={() => navigateToPage("/analyze")}
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
          onClick={() => navigateToPage("/tutorials")}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          Go to Tutorials
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
