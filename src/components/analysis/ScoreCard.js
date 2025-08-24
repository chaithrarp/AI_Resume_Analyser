// Enhanced Score Card Component - Step 8
// src/components/analysis/ScoreCard.js

import React from 'react';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const ScoreCard = ({ score, grade, breakdown, compact = false }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColor = (grade) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 85) return <TrophyIcon className="h-5 w-5 text-green-500" />;
    if (score >= 70) return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
    if (score >= 55) return <ChartBarIcon className="h-5 w-5 text-yellow-500" />;
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {getScoreIcon(score)}
          <div>
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade)}`}>
          Grade {grade}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${getScoreColor(score)} border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getScoreIcon(score)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resume Score</h3>
              <p className="text-sm text-gray-600">Overall assessment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{score}</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade)}`}>
              {grade}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Score Breakdown</h4>
        <div className="space-y-4">
          {Object.entries(breakdown).map(([category, categoryScore]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{category}</span>
                <span className="font-medium text-gray-900">{categoryScore}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      categoryScore >= 80 ? 'bg-green-500' :
                      categoryScore >= 60 ? 'bg-blue-500' :
                      categoryScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${categoryScore}%`,
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {Object.values(breakdown).filter(s => s >= 70).length}
            </div>
            <div className="text-xs text-gray-600">Strong Areas</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {Object.values(breakdown).filter(s => s < 70).length}
            </div>
            <div className="text-xs text-gray-600">Need Improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;