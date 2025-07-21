import React from "react";
import { LineChart, TrendingUp, Music, Headphones, HelpCircle } from "lucide-react";

const TutorialsPage = () => (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Tutorials</h1>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Linear Functions Card */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow" aria-label="Linear Functions tutorial card">
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
        <div className="flex flex-col gap-2">
          <a href="https://bick-jp.github.io/p5jsMathGraphSonification/training/03-y-equal-2.html" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center">Try y = 2</a>
          <a href="https://bick-jp.github.io/p5jsMathGraphSonification/training/01-y-equal-x.html" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center">Try y = x</a>
          <a href="https://bick-jp.github.io/p5jsMathGraphSonification/training/02-y-equal-minus-x.html" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-center">Try y = -x</a>
        </div>
      </div>

      {/* Quadratic Functions Card */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow" aria-label="Quadratic Functions tutorial card">
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
        <div className="flex flex-col gap-2">
          <a href="https://bick-jp.github.io/p5jsMathGraphSonification/training/04-y-equal-x-squared.html" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium text-center">Try y = x²</a>
          <a href="https://bick-jp.github.io/p5jsMathGraphSonification/training/05-y-equal-minus-x-squared.html" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium text-center">Try y = -x²</a>
        </div>
      </div>

      {/* Sonification Basics */}
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

      {/* Listening Guide */}
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

      {/* Accessibility */}
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

export default TutorialsPage;
