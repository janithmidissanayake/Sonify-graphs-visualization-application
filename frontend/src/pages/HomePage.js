const HomePage = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Mathematical Graph Sonification Tool
      </h1>
      <p className="text-xl text-gray-600 mb-6">
        Convert visual graphs into audio for enhanced learning accessibility
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Tutorials Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Book className="mr-2 text-green-600" size={24} />
          Learn First
        </h2>
        <p className="text-gray-700 mb-4">
          Start with our interactive tutorials to understand how sonification works for different types of mathematical graphs.
        </p>
        <button
          onClick={() => navigateToPage("tutorials")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
        >
          Go to Tutorials
        </button>
      </div>

      {/* Upload & Analyze Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Calculator className="mr-2 text-purple-600" size={24} />
          Analyze Graphs
        </h2>
        <p className="text-gray-700 mb-4">
          Upload your graph images and get detailed analysis with sonification, including key graph properties.
        </p>
        <button
          onClick={() => navigateToPage("upload")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
        >
          Upload & Analyze
        </button>
      </div>
    </div>
  </div>
);
