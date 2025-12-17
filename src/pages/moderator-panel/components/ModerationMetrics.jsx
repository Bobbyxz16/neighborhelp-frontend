import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const ModerationMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the appropriate endpoint based on selected period
      const endpointMap = {
        daily: API_ENDPOINTS.MODERATION.METRICS_DAILY,
        weekly: API_ENDPOINTS.MODERATION.METRICS_WEEKLY,
        monthly: API_ENDPOINTS.MODERATION.METRICS_MONTHLY
      };

      const endpoint = endpointMap[selectedPeriod] || endpointMap.daily;
      const response = await api.get(endpoint);
      
      setMetrics(response?.data || {});
    } catch (error) {
      console.error('Error loading moderation metrics:', error);
      // Set default values if API fails
      setMetrics({
        reviewsCompleted: 0,
        averageProcessingTime: 0,
        approvalRate: 0,
        qualityScore: 0,
        chartData: [],
        weeklyStats: {},
        monthlyStats: {}
      });
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const getTrendIcon = (current, previous) => {
    if (current > previous) return { icon: 'TrendingUp', color: 'text-green-500' };
    if (current < previous) return { icon: 'TrendingDown', color: 'text-red-500' };
    return { icon: 'Minus', color: 'text-gray-400' };
  };

  const getMetricColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const reviewsTrend = getTrendIcon(
    metrics?.reviewsCompleted || 0,
    metrics?.previousReviewsCompleted || metrics?.reviewsCompleted || 0
  );
  const processingTrend = getTrendIcon(
    metrics?.previousAverageProcessingTime || metrics?.averageProcessingTime || 0,
    metrics?.averageProcessingTime || 0
  );
  const approvalTrend = getTrendIcon(
    metrics?.approvalRate || 0,
    metrics?.previousApprovalRate || metrics?.approvalRate || 0
  );
  const qualityTrend = getTrendIcon(
    metrics?.qualityScore || 0,
    metrics?.previousQualityScore || metrics?.qualityScore || 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Moderation Performance</h2>
        <div className="flex items-center space-x-2">
          <select 
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Button variant="outline" iconName="RefreshCw" onClick={loadMetrics}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon name="CheckSquare" size={24} className="text-blue-600" />
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={reviewsTrend.icon} size={16} className={reviewsTrend.color} />
              <span className={`text-sm font-medium ${reviewsTrend.color}`}>
                {Math.round((metrics?.reviewsCompleted || 0) - (metrics?.previousReviewsCompleted || 0))}
              </span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-foreground mb-1 ${getMetricColor(metrics?.reviewsCompleted || 0, 12)}`}>
              {metrics?.reviewsCompleted || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Reviews Completed</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Icon name="Clock" size={24} className="text-orange-600" />
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={processingTrend.icon} size={16} className={processingTrend.color} />
              <span className={`text-sm font-medium ${processingTrend.color}`}>
                {Math.round((metrics?.averageProcessingTime || 0) - (metrics?.previousAverageProcessingTime || 0))}m
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {Math.round(metrics?.averageProcessingTime || 0)}m
            </h3>
            <p className="text-sm text-muted-foreground">Avg Processing Time</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={approvalTrend.icon} size={16} className={approvalTrend.color} />
              <span className={`text-sm font-medium ${approvalTrend.color}`}>
                {Math.round((metrics?.approvalRate || 0) - (metrics?.previousApprovalRate || 0))}%
              </span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-foreground mb-1 ${getMetricColor(metrics?.approvalRate || 0, 85)}`}>
              {Math.round(metrics?.approvalRate || 0)}%
            </h3>
            <p className="text-sm text-muted-foreground">Approval Rate</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Icon name="Star" size={24} className="text-purple-600" />
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={qualityTrend.icon} size={16} className={qualityTrend.color} />
              <span className={`text-sm font-medium ${qualityTrend.color}`}>
                {(metrics?.qualityScore || 0).toFixed(1) - (metrics?.previousQualityScore || 0).toFixed(1)}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {(metrics?.qualityScore || 0).toFixed(1)}/5
            </h3>
            <p className="text-sm text-muted-foreground">Quality Score</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews Over Time */}
        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Reviews Over Time</h3>
          {metrics?.chartData && metrics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedPeriod === 'daily' ? 'date' : selectedPeriod === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>

        {/* Processing Time Trends */}
        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Average Processing Time</h3>
          {metrics?.chartData && metrics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedPeriod === 'daily' ? 'date' : selectedPeriod === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Weekly Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Reviews</span>
              <span className="font-medium text-foreground">{metrics?.weeklyStats?.totalReviews || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reports Handled</span>
              <span className="font-medium text-foreground">{metrics?.weeklyStats?.reportsHandled || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Escalations</span>
              <span className="font-medium text-foreground">{metrics?.weeklyStats?.escalations || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User Feedback</span>
              <span className="font-medium text-foreground">{(metrics?.weeklyStats?.userFeedbackScore || 0).toFixed(1)}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Reviews</span>
              <span className="font-medium text-foreground">{metrics?.monthlyStats?.totalReviews || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quality Score</span>
              <span className="font-medium text-foreground">{(metrics?.monthlyStats?.averageQualityScore || 0).toFixed(1)}/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Provider Satisfaction</span>
              <span className="font-medium text-foreground">{Math.round(metrics?.monthlyStats?.providerSatisfaction || 0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Community Impact</span>
              <span className="font-medium text-foreground">{Math.round(metrics?.monthlyStats?.communityImpact || 0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Performance Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Reviews Per Day</span>
                <span className="text-sm font-medium">{metrics?.reviewsCompleted || 0}/15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(((metrics?.reviewsCompleted || 0) / 15) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Processing Time</span>
                <span className="text-sm font-medium">{Math.round(metrics?.averageProcessingTime || 0)}m/20m</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((((20 - (metrics?.averageProcessingTime || 0)) / 20) * 100), 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Quality Score</span>
                <span className="text-sm font-medium">{(metrics?.qualityScore || 0).toFixed(1)}/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${((metrics?.qualityScore || 0) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationMetrics;