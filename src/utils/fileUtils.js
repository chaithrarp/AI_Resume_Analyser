// Enhanced File Utilities - Updated with extractTextFromFile
// src/utils/fileUtils.js

import mammoth from 'mammoth';

// File type validation
export const validateFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PDF or DOCX file.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.');
  }

  return true;
};

// Get display name for file type
export const getFileTypeDisplayName = (fileType) => {
  const typeMap = {
    'application/pdf': 'PDF Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document'
  };
  
  return typeMap[fileType] || 'Unknown Document';
};

// Extract text from DOCX files
export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No readable text found in the DOCX file.');
    }
    
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX file. Please ensure the file is not corrupted.');
  }
};

// Extract text from PDF files (placeholder - requires PDF.js setup)
export const extractTextFromPDF = async (file) => {
  try {
    // For now, return a placeholder that indicates PDF parsing needs implementation
    console.warn('PDF text extraction not fully implemented. Using placeholder.');
    
    // You can implement PDF.js here later
    // const pdfjsLib = await import('pdfjs-dist');
    // ... PDF extraction logic
    
    // Return a sample text for testing
    return `PDF Content Placeholder
    
This is a placeholder for PDF text extraction. The file "${file.name}" was uploaded successfully.

To implement full PDF parsing, you would need to:
1. Set up PDF.js properly
2. Configure the worker
3. Extract text from each page
4. Combine all text content

For now, you can test the analysis with DOCX files which are fully supported.

Sample resume content for testing:
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

EXPERIENCE
Senior Developer at Tech Company (2020-2023)
- Developed web applications using React and Node.js
- Improved system performance by 40%
- Led team of 5 developers
- Implemented CI/CD pipelines

SKILLS
JavaScript, React, Node.js, Python, Docker, AWS

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)`;
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF file.');
  }
};

// Main function to extract text from any supported file type
export const extractTextFromFile = async (file) => {
  // Validate file first
  validateFile(file);
  
  try {
    let extractedText = '';
    
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDOCX(file);
    } else if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(file);
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Clean and validate extracted text
    const cleanedText = extractedText.trim();
    
    if (!cleanedText || cleanedText.length < 10) {
      throw new Error('The uploaded file appears to be empty or contains insufficient text content.');
    }
    
    return cleanedText;
    
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw error;
  }
};

// Utility to get file info
export const getFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    displayType: getFileTypeDisplayName(file.type),
    sizeFormatted: formatFileSize(file.size),
    lastModified: new Date(file.lastModified).toISOString()
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if file type is supported
export const isSupportedFileType = (fileType) => {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return supportedTypes.includes(fileType);
};