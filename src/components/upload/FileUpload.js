import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import { extractTextFromPDF, extractTextFromDOCX, validateFile } from '../../utils/fileUtils';

const FileUpload = ({ onFileUpload }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const processFile = useCallback(async (file) => {
    setIsProcessing(true);
    setError('');

    try {
      // Validate file first
      validateFile(file);
      
      let extractedText = '';
      
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromDOCX(file);
      }

      // Check if we extracted meaningful text
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract readable text from the file. Please ensure the file contains text content.');
      }

      setUploadedFile(file);
      onFileUpload(file, extractedText);
    } catch (err) {
      setError(err.message || 'Error processing file');
      setUploadedFile(null);
      onFileUpload(null, '');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload]); // Add onFileUpload as dependency

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous state
    setError('');
    setUploadedFile(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File size must be less than 10MB');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Only PDF and DOCX files are supported');
      } else {
        setError('File was rejected. Please try another file.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      processFile(file);
    }
  }, [processFile]); // Add processFile as dependency

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeFile = useCallback(() => {
    setError('');
    setUploadedFile(null);
    onFileUpload(null, '');
  }, [onFileUpload]);

  if (isProcessing) {
    return (
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8">
        <LoadingSpinner message="Extracting text from your resume..." />
      </div>
    );
  }

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-300 border-dashed rounded-lg p-6 bg-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Text extracted successfully
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop your resume here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop your resume here, or{' '}
              <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF and DOCX files (max 10MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;