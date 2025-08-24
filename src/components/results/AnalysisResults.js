// Enhanced Analysis Results Display - Step 8
// src/components/results/AnalysisResults.js

import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  StarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AnalysisResults = ({ analysisData, fileName }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analysis data available</p>
      </div>
    );
  }

  const { overall, skills, sections, recommendations, metadata } = analysisData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Results</h1>
            <p className="text-gray-600">Analysis for: <span className="font-medium">{fileName}</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <ClockIcon className="h-4 w-4" />
              <span>Analyzed {new Date(metadata.analyzedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{metadata.wordCount} words</span>
              <span>{metadata.estimatedReadTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Score */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{overall.score}</div>
            <div className="text-2xl font-semibold mb-1">{overall.grade}</div>
            <div className="text-blue-100">Overall Score</div>
          </div>
          
          {/* Score Breakdown */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(overall.breakdown).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{category}</span>
                    <span>{score}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-1000"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'skills', name: 'Skills Analysis', icon: StarIcon },
            { id: 'sections', name: 'Section Review', icon: DocumentTextIcon },
            { id: 'recommendations', name: 'Recommendations', icon: ExclamationTriangleIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
            </div>
            {overall.strengths.length > 0 ? (
              <div className="space-y-3">
                {overall.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <ArrowUpIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-800">{strength.area}</div>
                      <div className="text-sm text-green-600">{strength.description}</div>
                      <div className="text-xs text-green-500 mt-1">Score: {strength.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Focus on the improvements below to develop your strengths.</p>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
            </div>
            {overall.improvements.length > 0 ? (
              <div className="space-y-3">
                {overall.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <ArrowDownIcon className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-orange-800">{improvement.area}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          improvement.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {improvement.priority} priority
                        </span>
                      </div>
                      <div className="text-sm text-orange-600">{improvement.description}</div>
                      <div className="text-xs text-orange-500 mt-1">Score: {improvement.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Great! No major areas for improvement identified.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Skills Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{skills.technical.length}</div>
                <div className="text-sm text-blue-800">Technical Skills</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{skills.soft.length}</div>
                <div className="text-sm text-green-800">Soft Skills</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{skills.industry.length}</div>
                <div className="text-sm text-purple-800">Industry Skills</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{skills.total}</div>
                <div className="text-sm text-gray-800">Total Skills</div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          {skills.technical.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  skills.technical.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h5 className="font-medium text-gray-800 mb-3 capitalize">{category}</h5>
                    <div className="space-y-2">
                      {categorySkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-800 capitalize">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                                style={{ width: `${skill.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-blue-600">{skill.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {skills.soft.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  skills.soft.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h5 className="font-medium text-gray-800 mb-3 capitalize">{category}</h5>
                    <div className="space-y-2">
                      {categorySkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800 capitalize">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-green-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 rounded-full h-2 transition-all duration-500"
                                style={{ width: `${skill.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-green-600">{skill.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resume Sections Analysis</h3>
          <div className="space-y-4">
            {Object.entries(sections).map(([sectionName, sectionData]) => (
              <div key={sectionName} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    sectionData.present ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{sectionName}</div>
                    <div className="text-sm text-gray-500">
                      {sectionData.required ? 'Required' : 'Optional'} • Weight: {Math.round(sectionData.weight * 100)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      sectionData.present ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sectionData.present ? 'Present' : 'Missing'}
                    </div>
                    <div className="text-sm text-gray-500">Score: {sectionData.score}%</div>
                  </div>
                  {!sectionData.present && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  )}
                  {sectionData.present && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personalized Recommendations</h3>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'critical' ? 'bg-red-50 border-red-500' :
                    rec.priority === 'high' ? 'bg-orange-50 border-orange-500' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-sm text-gray-700">
                            <strong>Action:</strong> {rec.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Excellent! No specific recommendations at this time.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Next Steps</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                <DocumentTextIcon className="h-4 w-4" />
                Download Report
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
                <ArrowUpIcon className="h-4 w-4" />
                Analyze Another Resume
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200">
                <EyeIcon className="h-4 w-4" />
                View Examples
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;