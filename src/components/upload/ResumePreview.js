import React from 'react';
import { DocumentIcon, DocumentTextIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { getFileTypeDisplayName } from '../../utils/fileUtils';

const ResumePreview = ({ file, extractedText }) => {
  if (!file) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
        <DocumentIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500">Upload a resume to see preview</p>
        <p className="text-sm text-gray-400 mt-2">
          We'll extract and analyze the text content
        </p>
      </div>
    );
  }

  const wordCount = extractedText ? extractedText.split(/\s+/).filter(word => word.length > 0).length : 0;
  const charCount = extractedText ? extractedText.length : 0;
  const lineCount = extractedText ? extractedText.split('\n').length : 0;

  return (
    <div className="space-y-6">
      {/* File Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <DocumentIcon className="h-5 w-5 mr-2 text-blue-600" />
          File Information
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Name:</p>
            <p className="font-medium text-gray-800">{file.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Type:</p>
            <p className="font-medium text-gray-800">{getFileTypeDisplayName(file.type)}</p>
          </div>
          <div>
            <p className="text-gray-600">Size:</p>
            <p className="font-medium text-gray-800">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div>
            <p className="text-gray-600">Modified:</p>
            <p className="font-medium text-gray-800">{new Date(file.lastModified).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Text Stats */}
      {extractedText && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
            <DocumentTextIcon className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{wordCount}</p>
            <p className="text-sm text-green-600">Words</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
            <HashtagIcon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{charCount}</p>
            <p className="text-sm text-blue-600">Characters</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100">
            <DocumentIcon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">{lineCount}</p>
            <p className="text-sm text-purple-600">Lines</p>
          </div>
        </div>
      )}

      {/* Text Preview */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Text Preview</h3>
        <div className="max-h-80 overflow-y-auto">
          {extractedText ? (
            <div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
                {extractedText.substring(0, 2000)}
                {extractedText.length > 2000 && (
                  <span className="text-blue-600">
                    ... ({extractedText.length - 2000} more characters)
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 text-sm italic">
                Processing file to extract text...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;