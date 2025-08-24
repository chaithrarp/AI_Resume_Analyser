// Enhanced Resume Analysis Hook - Step 10
// src/hooks/useResumeAnalysis.js

import { useState, useCallback, useRef } from 'react';
import { analyzeResumeText } from '../utils/textAnalysis';
import { extractTextFromFile } from '../utils/fileUtils';

// Analysis status constants
const ANALYSIS_STATUS = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  ANALYZING: 'analyzing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Progress steps for better UX
const PROGRESS_STEPS = [
  { key: 'extracting', label: 'Extracting text from file', progress: 25 },
  { key: 'preprocessing', label: 'Preprocessing content', progress: 45 },
  { key: 'analyzing', label: 'Analyzing resume structure', progress: 70 },
  { key: 'generating', label: 'Generating recommendations', progress: 90 },
  { key: 'completed', label: 'Analysis complete', progress: 100 }
];

export const useResumeAnalysis = () => {
  // Core state
  const [status, setStatus] = useState(ANALYSIS_STATUS.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [originalText, setOriginalText] = useState('');

  // Analysis history and comparison
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // Refs for cleanup
  const analysisTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Helper function to simulate realistic analysis timing
  const simulateProgress = useCallback((stepKey) => {
    const step = PROGRESS_STEPS.find(s => s.key === stepKey);
    if (step) {
      setCurrentStep(step.label);
      setProgress(step.progress);
    }
  }, []);

  // Helper function to add delay for better UX
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Main analysis function
  const analyzeResume = useCallback(async (file) => {
    // Reset state
    setStatus(ANALYSIS_STATUS.EXTRACTING);
    setProgress(0);
    setError(null);
    setAnalysisResult(null);
    setFileName(file.name);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Step 1: Extract text from file
      simulateProgress('extracting');
      await delay(500); // Realistic timing

      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No readable text found in the file. Please ensure the file contains text content.');
      }

      setOriginalText(extractedText);

      // Step 2: Preprocess content
      simulateProgress('preprocessing');
      await delay(300);

      // Basic preprocessing
      const cleanedText = extractedText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters only
        .trim();

      if (cleanedText.length < 50) {
        throw new Error('Resume content is too short for meaningful analysis. Please provide a more detailed resume.');
      }

      // Step 3: Analyze resume
      simulateProgress('analyzing');
      await delay(800);

      setStatus(ANALYSIS_STATUS.ANALYZING);
      const analysis = analyzeResumeText(cleanedText);

      // Step 4: Generate final results
      simulateProgress('generating');
      await delay(400);

      // Enhance analysis with additional metadata
      const enhancedAnalysis = {
        ...analysis,
        metadata: {
          ...analysis.metadata,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          processedAt: new Date().toISOString(),
          textLength: cleanedText.length,
          originalTextLength: extractedText.length,
          processingTime: Date.now() // Will be calculated later
        }
      };

      // Step 5: Complete analysis
      simulateProgress('completed');
      await delay(200);

      setAnalysisResult(enhancedAnalysis);
      setStatus(ANALYSIS_STATUS.COMPLETED);

      // Add to history
      const historyEntry = {
        id: Date.now().toString(),
        fileName: file.name,
        analyzedAt: new Date().toISOString(),
        score: enhancedAnalysis.overall.score,
        grade: enhancedAnalysis.overall.grade,
        analysis: enhancedAnalysis
      };

      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      return enhancedAnalysis;

    } catch (err) {
      console.error('Resume analysis failed:', err);
      setError({
        message: err.message || 'An error occurred during analysis',
        type: err.name || 'AnalysisError',
        timestamp: new Date().toISOString()
      });
      setStatus(ANALYSIS_STATUS.ERROR);
      setProgress(0);
      throw err;
    } finally {
      // Cleanup
      abortControllerRef.current = null;
    }
  }, [simulateProgress]);

  // Quick analysis function for multiple files
  const analyzeMultipleResumes = useCallback(async (files) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        setCurrentStep(`Analyzing file ${i + 1} of ${files.length}: ${files[i].name}`);
        const result = await analyzeResume(files[i]);
        results.push({
          file: files[i],
          analysis: result,
          success: true
        });
      } catch (err) {
        errors.push({
          file: files[i],
          error: err.message,
          success: false
        });
      }
    }

    return { results, errors };
  }, [analyzeResume]);

  // Compare two resumes
  const compareResumes = useCallback((analysis1, analysis2) => {
    if (!analysis1 || !analysis2) {
      throw new Error('Both resume analyses are required for comparison');
    }

    const comparison = {
      scores: {
        resume1: analysis1.overall.score,
        resume2: analysis2.overall.score,
        difference: analysis2.overall.score - analysis1.overall.score
      },
      breakdown: {},
      skills: {
        resume1: analysis1.skills.total,
        resume2: analysis2.skills.total,
        difference: analysis2.skills.total - analysis1.skills.total
      },
      recommendations: {
        resume1: analysis1.recommendations.length,
        resume2: analysis2.recommendations.length,
        difference: analysis2.recommendations.length - analysis1.recommendations.length
      },
      metadata: {
        comparedAt: new Date().toISOString(),
        files: [analysis1.metadata.fileName, analysis2.metadata.fileName]
      }
    };

    // Compare breakdown scores
    Object.keys(analysis1.overall.breakdown).forEach(key => {
      comparison.breakdown[key] = {
        resume1: analysis1.overall.breakdown[key],
        resume2: analysis2.overall.breakdown[key],
        difference: analysis2.overall.breakdown[key] - analysis1.overall.breakdown[key]
      };
    });

    setIsComparing(true);
    return comparison;
  }, []);

  // Cancel ongoing analysis
  const cancelAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    setStatus(ANALYSIS_STATUS.IDLE);
    setProgress(0);
    setCurrentStep('');
    setError(null);
  }, []);

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    cancelAnalysis();
    setAnalysisResult(null);
    setOriginalText('');
    setFileName('');
    setIsComparing(false);
  }, [cancelAnalysis]);

  // Clear analysis history
  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
  }, []);

  // Get analysis from history
  const getAnalysisFromHistory = useCallback((id) => {
    return analysisHistory.find(entry => entry.id === id);
  }, [analysisHistory]);

  // Export analysis data
  const exportAnalysis = useCallback((format = 'json') => {
    if (!analysisResult) {
      throw new Error('No analysis data to export');
    }

    const exportData = {
      fileName,
      analysis: analysisResult,
      exportedAt: new Date().toISOString(),
      format
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // Add more formats as needed
    return exportData;
  }, [analysisResult, fileName]);

  // Validation helpers
  const validateFile = useCallback((file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or DOCX file.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload a file smaller than 10MB.');
    }

    return true;
  }, []);

  // Analysis statistics
  const getAnalysisStats = useCallback(() => {
    if (!analysisResult) return null;

    const { overall, skills, recommendations, metadata } = analysisResult;
    
    return {
      overall: {
        score: overall.score,
        grade: overall.grade,
        strengths: overall.strengths.length,
        improvements: overall.improvements.length
      },
      content: {
        wordCount: metadata.wordCount,
        skillsFound: skills.total,
        recommendationsCount: recommendations.length,
        readingTime: metadata.estimatedReadTime
      },
      performance: {
        processingTime: metadata.processingTime,
        fileSize: metadata.fileSize,
        compressionRatio: metadata.originalTextLength > 0 
          ? (metadata.textLength / metadata.originalTextLength * 100).toFixed(1)
          : 0
      }
    };
  }, [analysisResult]);

  // Return hook interface
  return {
    // State
    status,
    progress,
    currentStep,
    analysisResult,
    error,
    fileName,
    originalText,
    analysisHistory,
    isComparing,

    // Actions
    analyzeResume,
    analyzeMultipleResumes,
    compareResumes,
    cancelAnalysis,
    resetAnalysis,
    clearHistory,
    validateFile,
    exportAnalysis,

    // Utilities
    getAnalysisFromHistory,
    getAnalysisStats,

    // Status checks
    isIdle: status === ANALYSIS_STATUS.IDLE,
    isExtracting: status === ANALYSIS_STATUS.EXTRACTING,
    isAnalyzing: status === ANALYSIS_STATUS.ANALYZING,
    isCompleted: status === ANALYSIS_STATUS.COMPLETED,
    hasError: status === ANALYSIS_STATUS.ERROR,
    isProcessing: [ANALYSIS_STATUS.EXTRACTING, ANALYSIS_STATUS.ANALYZING].includes(status),

    // Constants for external use
    ANALYSIS_STATUS,
    PROGRESS_STEPS
  };
};

export default useResumeAnalysis;