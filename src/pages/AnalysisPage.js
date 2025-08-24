import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/upload/FileUpload';
import ResumePreview from '../components/upload/ResumePreview';

const AnalysisPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (file, text) => {
    setUploadedFile(file);
    setExtractedText(text);
  };

  const handleAnalyze = () => {
    if (!uploadedFile || !extractedText) {
      alert('Please upload a resume first');
      return;
    }

    setIsAnalyzing(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      navigate('/results', { 
        state: { 
          file: uploadedFile, 
          extractedText: extractedText 
        }
      });
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Analysis</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
          <FileUpload onFileUpload={handleFileUpload} />
          
          {uploadedFile && (
            <div className="mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Starting Analysis...
                  </>
                ) : (
                  'Start Analysis'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
          <ResumePreview file={uploadedFile} extractedText={extractedText} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;