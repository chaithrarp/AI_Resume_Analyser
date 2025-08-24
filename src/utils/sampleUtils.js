// Sample Resume Utilities
// src/utils/sampleUtils.js

// Create a mock file object for sample resumes
export const createSampleFile = (content, filename, type = 'text/plain') => {
  const file = new File([content], filename, {
    type: type,
    lastModified: Date.now()
  });
  
  // Add additional properties that might be expected
  Object.defineProperty(file, 'path', {
    value: filename,
    writable: false
  });
  
  return file;
};

// Convert sample resume content to proper file format
export const prepareSampleForAnalysis = (sample) => {
  const filename = `${sample.title.replace(/\s+/g, '_').toLowerCase()}_sample.docx`;
  
  return {
    file: createSampleFile(sample.content, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    extractedText: sample.content,
    isSample: true,
    sampleInfo: {
      title: sample.title,
      description: sample.description,
      expectedScore: sample.expectedScore,
      id: sample.id
    }
  };
};