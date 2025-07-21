import React from "react";
import { Upload } from "lucide-react";

const UploadPage = ({
  handleFileChange,
  loading,
  uploadedImage,
  navigateToPage,
}) => (
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
              onClick={() => navigateToPage("/analyze")}
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

export default UploadPage;
