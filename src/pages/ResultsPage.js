import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AnalysisResults from '../components/results/AnalysisResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyzeResumeText } from '../utils/textAnalysis';

const ResultsPage = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get data from navigation state
  const { file, extractedText } = location.state || {};

  useEffect(() => {
    if (!file || !extractedText) {
      setError('No resume data found. Please upload a resume first.');
      setIsLoading(false);
      return;
    }

    // Simulate analysis delay for better UX
    const performAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Add a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysis = analyzeResumeText(extractedText);
        setAnalysisData(analysis);
      } catch (err) {
        setError(err.message || 'Error analyzing resume');
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [file, extractedText]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Analyzing your resume..." />
          <div className="mt-8 space-y-2">
            <p className="text-gray-600">🔍 Extracting key information...</p>
            <p className="text-gray-600">📊 Calculating scores...</p>
            <p className="text-gray-600">💡 Generating recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Analysis Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link 
            to="/analysis"
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AnalysisResults 
        analysisData={analysisData} 
        fileName={file?.name} 
      />
    </div>
  );
};

export default ResultsPage;