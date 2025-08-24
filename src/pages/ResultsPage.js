// Complete Results Page Integration
// src/pages/ResultsPage.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentArrowDownIcon, ShareIcon } from '@heroicons/react/24/outline';
import AnalysisResults from '../components/results/AnalysisResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyzeResumeText } from '../utils/textAnalysis';
import { analyzeWithAI } from '../services/aiService';
import { generatePDFReport, exportAnalysisJSON } from '../services/exportService';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get data from navigation state
  const { file, extractedText } = location.state || {};

  useEffect(() => {
    // Redirect if no data
    if (!file || !extractedText) {
      navigate('/analysis');
      return;
    }

    performAnalysis();
  }, [file, extractedText, navigate]);

  const performAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Basic analysis
      console.log('Starting basic analysis...');
      const basicAnalysis = analyzeResumeText(extractedText);
      
      // Step 2: AI enhancement (with fallback)
      console.log('Enhancing with AI...');
      const enhancedAnalysis = await analyzeWithAI(extractedText, basicAnalysis);
      
      console.log('Analysis complete:', enhancedAnalysis);
      setAnalysisData(enhancedAnalysis);

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    performAnalysis();
  };

  const handleNewAnalysis = () => {
    navigate('/analysis');
  };

  const handleExportPDF = () => {
    if (analysisData && file) {
      generatePDFReport(analysisData, file.name);
    }
  };

  const handleExportJSON = () => {
    if (analysisData && file) {
      exportAnalysisJSON(analysisData, file.name);
    }
  };

  const handleShare = () => {
    if (navigator.share && analysisData) {
      navigator.share({
        title: 'My Resume Analysis Results',
        text: `I scored ${analysisData.overall.score}/100 (${analysisData.overall.grade}) on my resume analysis!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Please copy the URL manually to share your results.'));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            Analyzing Your Resume
          </h2>
          <p className="text-gray-600">
            This may take a few moments...
          </p>
          <div className="mt-4 max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">Processing content and generating insights</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleNewAnalysis}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Upload Different Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show results
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleNewAnalysis}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Analyze Another Resume</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Analysis completed successfully
              </div>
              
              {/* Export & Share Buttons */}
              {analysisData && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    Export Report
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      {analysisData ? (
        <AnalysisResults 
          analysisData={analysisData} 
          fileName={file.name}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No analysis data available</p>
          <button
            onClick={handleNewAnalysis}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Start New Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;