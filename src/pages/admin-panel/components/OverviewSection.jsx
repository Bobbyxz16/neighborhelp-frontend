import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const OverviewSection = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState(null);
  // const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadOverviewData = async () => {
      try {
        setLoading(true);
        // Fetch from analytics overview endpoint
        const { data } = await api.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
        console.log('Admin Overview API Response:', data);

        if (!isCancelled) {
          // Map backend response to frontend expectations
          const mappedData = {
            totalUsers: data?.totalUsers || 0,
            totalResources: data?.totalResources || 0,
            activeResources: data?.activeResources || 0,
            pendingVerifications: data?.pendingReviews || 0, // Backend calls it pendingReviews
            totalProviders: data?.totalProviders || 0,
            dailyStats: {
              newUsers: data?.dailyStats?.newUsers || 0,
              newResources: data?.dailyStats?.newResources || 0,
            },
            systemHealth: data?.systemHealth || { overall: 'healthy' },
            recentActivity: data?.recentActivity || [],
          };

          setMetrics(mappedData);
          // setSystemHealth(mappedData.systemHealth);
        }
      } catch (error) {
        console.error('Error loading overview data:', error);
        // Set default values on error
        if (!isCancelled) {
          setMetrics({
            totalUsers: 0,
            totalResources: 0,
            activeResources: 0,
            pendingVerifications: 0,
            totalProviders: 0,
            dailyStats: { newUsers: 0, newResources: 0 },
            systemHealth: { overall: 'healthy' },
            recentActivity: [],
          });
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadOverviewData();
    return () => { isCancelled = true; };
  }, []);

  // const getHealthStatusColor = (status) => {
  //   switch (status) {
  //     case 'healthy':
  //       return 'text-green-600 bg-green-100';
  //     case 'warning':
  //       return 'text-yellow-600 bg-yellow-100';
  //     case 'error':
  //       return 'text-red-600 bg-red-100';
  //     default:
  //       return 'text-gray-600 bg-gray-100';
  //   }
  // };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{metrics?.totalUsers?.toLocaleString() || 0}</p>
              {metrics?.dailyStats?.newUsers > 0 && (
                <p className="text-sm text-green-600">+{metrics?.dailyStats?.newUsers} today</p>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon name="Users" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Resources</p>
              <p className="text-2xl font-bold text-foreground">{metrics?.activeResources?.toLocaleString() || 0}</p>
              {metrics?.dailyStats?.newResources > 0 && (
                <p className="text-sm text-green-600">+{metrics?.dailyStats?.newResources} today</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icon name="Building2" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Verifications</p>
              <p className="text-2xl font-bold text-foreground">{metrics?.pendingVerifications || 0}</p>
              <p className="text-sm text-yellow-600">Needs attention</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icon name="AlertTriangle" size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {metrics?.recentActivity?.length > 0 ? (
              metrics.recentActivity.map((activity) => (
                <div key={activity?.id} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full shrink-0 ${getSeverityColor(activity?.severity)}`}>
                    <Icon
                      name={activity?.severity === 'success' ? 'Check' : activity?.severity === 'warning' ? 'AlertTriangle' : 'Info'}
                      size={12}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity?.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity?.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
            iconName="UserPlus"
            onClick={() => onNavigate && onNavigate('users', { action: 'create' })}
          >
            <span>Add User</span>
            <span className="text-xs text-muted-foreground">Create new account</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
            iconName="Building"
            onClick={() => window.location.href = '/verify-resources'}
          >
            <span>Verify Resource</span>
            <span className="text-xs text-muted-foreground">Review pending items</span>
          </Button>

        
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;