import React from 'react';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';

const RecommendationsPanel = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
        <div className="text-center py-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Great job! Your resume looks good with no major issues detected.</p>
        </div>
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <LightBulbIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  // Group recommendations by priority
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.priority]) {
      acc[rec.priority] = [];
    }
    acc[rec.priority].push(rec);
    return acc;
  }, {});

  const priorityOrder = ['high', 'medium', 'low'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
        <span className="text-sm text-gray-600">
          {recommendations.length} suggestion{recommendations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {priorityOrder.map(priority => {
          const priorityRecs = groupedRecommendations[priority];
          if (!priorityRecs || priorityRecs.length === 0) return null;

          return (
            <div key={priority} className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center">
                {getPriorityIcon(priority)}
                <span className="ml-2 capitalize">{priority} Priority</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(priority)}`}>
                  {priorityRecs.length}
                </span>
              </h4>
              
              {priorityRecs.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getPriorityIcon(rec.priority)}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-1">{rec.title}</h5>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec.priority)}`}>
                          {rec.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Quick Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm text-center">
          <div>
            <span className="block text-lg font-bold text-red-600">
              {groupedRecommendations.high?.length || 0}
            </span>
            <span className="text-red-600">High Priority</span>
          </div>
          <div>
            <span className="block text-lg font-bold text-yellow-600">
              {groupedRecommendations.medium?.length || 0}
            </span>
            <span className="text-yellow-600">Medium Priority</span>
          </div>
          <div>
            <span className="block text-lg font-bold text-blue-600">
              {groupedRecommendations.low?.length || 0}
            </span>
            <span className="text-blue-600">Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;