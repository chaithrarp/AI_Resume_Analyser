// Enhanced Skills Breakdown Component - Step 8
// src/components/results/SkillsBreakdown.js

import React, { useState } from 'react';
import { 
  CodeBracketIcon, 
  UserGroupIcon, 
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const SkillsBreakdown = ({ skills }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    technical: true,
    soft: false,
    industry: false
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getSkillIcon = (category) => {
    switch (category) {
      case 'technical':
        return <CodeBracketIcon className="h-5 w-5" />;
      case 'soft':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'industry':
        return <BriefcaseIcon className="h-5 w-5" />;
      default:
        return <StarIcon className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'soft':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'industry':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const groupSkillsByCategory = (skillsList) => {
    return skillsList.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
  };

  const skillCategories = [
    {
      key: 'technical',
      title: 'Technical Skills',
      description: 'Programming languages, frameworks, and tools',
      skills: skills.technical || [],
      color: 'blue'
    },
    {
      key: 'soft',
      title: 'Soft Skills',
      description: 'Communication, leadership, and interpersonal abilities',
      skills: skills.soft || [],
      color: 'green'
    },
    {
      key: 'industry',
      title: 'Industry Skills',
      description: 'Sector-specific knowledge and expertise',
      skills: skills.industry || [],
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Skills Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Overview</h3>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {skillCategories.map((category) => (
            <div key={category.key} className={`p-4 rounded-lg border ${getCategoryColor(category.key)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getSkillIcon(category.key)}
                <span className="font-medium">{category.title}</span>
              </div>
              <div className="text-2xl font-bold">{category.skills.length}</div>
              <div className="text-sm opacity-75">Skills identified</div>
            </div>
          ))}
          
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{skills.total || 0}</div>
            <div className="text-sm text-gray-600">All skills</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {skillCategories.map((category) => (
        <div key={category.key} className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.key)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(category.key)}`}>
                {getSkillIcon(category.key)}
              </div>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-gray-900">{category.title}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{category.skills.length}</div>
                <div className="text-sm text-gray-600">skills</div>
              </div>
              {expandedCategories[category.key] ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>

          {/* Category Content */}
          {expandedCategories[category.key] && category.skills.length > 0 && (
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-4">
                {Object.entries(groupSkillsByCategory(category.skills)).map(([subCategory, subSkills]) => (
                  <div key={subCategory} className="mb-6 last:mb-0">
                    <h5 className="text-md font-medium text-gray-800 mb-3 capitalize">{subCategory}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subSkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 capitalize">{skill.name}</div>
                            <div className="text-sm text-gray-600">Confidence: {skill.confidence}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getConfidenceColor(skill.confidence)}`}
                                style={{ width: `${skill.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 min-w-[35px]">{skill.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {expandedCategories[category.key] && category.skills.length === 0 && (
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-4">
                <div className="text-center py-8 text-gray-500">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${getCategoryColor(category.key)} flex items-center justify-center opacity-50`}>
                    {getSkillIcon(category.key)}
                  </div>
                  <p>No {category.title.toLowerCase()} detected in your resume</p>
                  <p className="text-sm mt-1">Consider adding relevant skills to strengthen this area</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Skills Recommendations */}
      {skills.total > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">💡 Skills Enhancement Tips</h4>
          <div className="space-y-3 text-sm text-blue-700">
            {skills.technical.length < 5 && (
              <p>• Consider adding more technical skills relevant to your field</p>
            )}
            {skills.soft.length < 3 && (
              <p>• Include soft skills like communication, leadership, or problem-solving</p>
            )}
            {skills.industry.length === 0 && (
              <p>• Add industry-specific skills to show domain expertise</p>
            )}
            <p>• Use specific skill names rather than generic terms</p>
            <p>• Consider creating a dedicated skills section for better visibility</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsBreakdown;