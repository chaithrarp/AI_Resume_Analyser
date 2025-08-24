// Fixed AnalysisPage.js with proper preview -> analyze flow
// src/pages/AnalysisPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUpload from '../components/upload/FileUpload';
import ResumePreview from '../components/upload/ResumePreview';
import AnalysisResults from '../components/results/AnalysisResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  DocumentTextIcon,
  ChartBarIcon,
  XMarkIcon,
  StarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Resume analysis hook
  const {
    // State
    progress,
    currentStep,
    analysisResult,
    error,
    fileName,
    originalText,
    
    // Actions
    analyzeResume,
    resetAnalysis,
    cancelAnalysis,
    
    // Status checks
    isProcessing,
    isCompleted,
    hasError,
    isIdle
  } = useResumeAnalysis();

  // Local state for UI and file handling
  const [showPreview, setShowPreview] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isSampleResume, setIsSampleResume] = useState(false);
  const [sampleInfo, setSampleInfo] = useState(null);

  // Check if we received sample data from HomePage
  useEffect(() => {
    const sampleData = location.state?.sampleData;
    if (sampleData) {
      setCurrentFile(sampleData.file);
      setExtractedText(sampleData.extractedText);
      setIsSampleResume(sampleData.isSample);
      setSampleInfo(sampleData.sampleInfo);
      setShowPreview(true);
      
      // Auto-start analysis for sample resumes
      handleSampleAnalysis(sampleData.file);
    }
  }, [location.state]);

  // Handle sample resume analysis
  const handleSampleAnalysis = async (file) => {
    try {
      await analyzeResume(file);
    } catch (err) {
      console.error('Sample analysis failed:', err);
    }
  };

  // Handle file upload from FileUpload component - ONLY SET PREVIEW, DON'T ANALYZE
  const handleFileUpload = async (file, text) => {
    if (!file || !text) {
      setShowPreview(false);
      setCurrentFile(null);
      setExtractedText('');
      setIsSampleResume(false);
      setSampleInfo(null);
      return;
    }

    // ONLY set preview state, don't start analysis
    setCurrentFile(file);
    setExtractedText(text);
    setShowPreview(true);
    setIsSampleResume(false);
    setSampleInfo(null);
  };

  // NEW: Handle manual analyze button click
  const handleAnalyzeClick = async () => {
    if (!currentFile) return;
    
    try {
      await analyzeResume(currentFile);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  // Handle starting over
  const handleStartOver = () => {
    resetAnalysis();
    setShowPreview(false);
    setCurrentFile(null);
    setExtractedText('');
    setIsSampleResume(false);
    setSampleInfo(null);
    
    // Clear location state if it exists
    if (location.state) {
      navigate('/analysis', { replace: true });
    }
  };

  // Handle cancel analysis
  const handleCancel = () => {
    cancelAnalysis();
    setShowPreview(false);
    setCurrentFile(null);
    setExtractedText('');
    setIsSampleResume(false);
    setSampleInfo(null);
  };

  // If analysis is completed, show results
  if (isCompleted && analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition duration-200"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Analyze Another Resume
              </button>
              {isSampleResume && sampleInfo && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <StarIcon className="h-4 w-4" />
                  Sample: {sampleInfo.title}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <DocumentTextIcon className="h-4 w-4" />
              Back to Home
            </button>
          </div>
          
          {/* Results Component */}
          <AnalysisResults 
            analysisData={analysisResult} 
            fileName={fileName}
            isSample={isSampleResume}
            sampleInfo={sampleInfo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your resume and get instant AI-powered analysis with personalized recommendations
          </p>
          
          {/* Sample Resume Banner */}
          {isSampleResume && sampleInfo && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Sample Resume Analysis</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Analyzing: <strong>{sampleInfo.title}</strong> - {sampleInfo.description}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Expected Score: {sampleInfo.expectedScore}/100
                </p>
              </div>
            </div>
          )}
          
          {/* Progress Indicator */}
          {isProcessing && (
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isSampleResume ? 'Analyzing Sample Resume' : 'Analyzing Your Resume'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{currentStep}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm text-gray-600">Processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h3>
                  <p className="text-red-700 mb-4">{error?.message}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleStartOver}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* File Upload Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {isSampleResume ? 'Sample Resume' : 'Upload Resume'}
                </h2>
              </div>
              
              {!showPreview ? (
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  accept=".pdf,.docx"
                  maxSize={10}
                  disabled={isProcessing}
                />
              ) : (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${
                    isSampleResume 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className={`h-5 w-5 ${
                        isSampleResume ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          isSampleResume ? 'text-yellow-800' : 'text-green-800'
                        }`}>
                          {isSampleResume ? 'Sample Resume Loaded' : 'File Uploaded'}
                        </div>
                        <div className={`text-sm ${
                          isSampleResume ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {currentFile?.name}
                        </div>
                      </div>
                    </div>
                    {!isProcessing && (
                      <button
                        onClick={handleStartOver}
                        className={`hover:text-opacity-80 transition duration-200 ${
                          isSampleResume ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* ANALYZE BUTTON - Only show when file is ready and not processing */}
                  {!isProcessing && !isSampleResume && (
                    <div className="text-center">
                      <button
                        onClick={handleAnalyzeClick}
                        disabled={!currentFile}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <PlayIcon className="h-5 w-5" />
                        Analyze Resume
                      </button>
                      <p className="text-sm text-gray-600 mt-2">
                        Click to start AI-powered analysis
                      </p>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="text-center py-4">
                      <LoadingSpinner />
                      <p className="text-sm text-gray-600 mt-2">
                        {isSampleResume ? 'Analyzing sample resume...' : 'Analyzing your resume...'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Resume Preview Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resume Preview
                </h2>
              </div>
              
              {showPreview && extractedText ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Preview of extracted text from {isSampleResume ? 'sample resume' : 'uploaded file'}:
                  </div>
                  <ResumePreview 
                    file={currentFile}
                    extractedText={extractedText}
                    isSample={isSampleResume}
                    sampleInfo={sampleInfo}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload a resume to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;