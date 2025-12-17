// pages/provider-dashboard/components/MetricsPanel.jsx
import React from 'react';
import { Eye, MessageSquare, Star, List, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * MetricsPanel - Shows provider metrics calculated from real backend data
 * 
 * Props:
 * - metrics: Object containing calculated metrics from resources
 */
const MetricsPanel = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Views',
      value: metrics?.totalViews || 0,

      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Contacts Received',
      value: metrics?.contactsReceived || 0,
      change: metrics?.contactsChange || 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Rating',
      value: `${metrics?.averageRating || 0}/5`,
      change: metrics?.ratingChange || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Active Listings',
      value: metrics?.activeListings || 0,
      change: metrics?.listingsChange || 0,
      icon: List,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getTrendIcon = (change) => {
    if (change > 0) return { Icon: TrendingUp, color: 'text-green-500' };
    if (change < 0) return { Icon: TrendingDown, color: 'text-red-500' };
    return { Icon: Minus, color: 'text-gray-400' };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => {
        const trend = getTrendIcon(metric.change);
        const Icon = metric.icon;
        const TrendIcon = trend.Icon;
        
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon size={24} className={metric.color} />
              </div>
              <div className="flex items-center space-x-1">
                
                <span className={`text-sm font-medium ${trend.color}`}>
                 
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </h3>
              <p className="text-sm text-gray-600">
                {metric.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsPanel;
