import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const ResourceOversightSection = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(API_ENDPOINTS.ANALYTICS.RESOURCES);
      setAnalyticsData(data || {});
    } catch (err) {
      console.error('Error loading resources analytics:', err);
      setError('Failed to load resource analytics');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by search term
  const filteredCategories = analyticsData?.categoryBreakdown?.filter(cat =>
    cat?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'herramientas':
        return 'Wrench';
      case 'electrodomésticos':
        return 'Zap';
      case 'mobiliario':
        return 'Sofa';
      case 'jardinería':
        return 'Leaf';
      case 'deportes':
        return 'Dumbbell';
      case 'libros':
        return 'Book';
      case 'otros':
        return 'Building2';
      case 'food':
        return 'Utensils';
      case 'health':
        return 'Heart';
      case 'employment':
        return 'Briefcase';
      case 'housing':
        return 'Home';
      case 'education':
        return 'GraduationCap';
      case 'legal':
        return 'Scale';
      default:
        return 'Building2';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Button onClick={loadAnalytics}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Resource Oversight</h2>
          <p className="text-sm text-muted-foreground">Complete resource analytics and management</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full sm:w-64"
            iconName="Search"
          />
          <Button onClick={loadAnalytics} variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {analyticsData?.totalResources || 0}
          </div>
          <div className="text-sm font-medium text-muted-foreground">Total Resources</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {analyticsData?.approvedToday || 0}
          </div>
          <div className="text-sm font-medium text-muted-foreground">Approved Today</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {analyticsData?.rejectedToday || 0}
          </div>
          <div className="text-sm font-medium text-muted-foreground">Rejected Today</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {analyticsData?.approvalRate || 0}%
          </div>
          <div className="text-sm font-medium text-muted-foreground">Approval Rate</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-bold text-foreground">Category</th>
                <th className="text-right p-4 font-bold text-foreground">Count</th>
                <th className="text-right p-4 font-bold text-foreground">Percentage</th>
                <th className="text-right p-4 font-bold text-foreground">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories?.map((category, idx) => (
                <tr key={idx} className="border-t border-border hover:bg-accent/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name={getCategoryIcon(category?.category)} size={16} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground capitalize">{category?.category}</span>
                    </div>
                  </td>
                  <td className="text-right p-4 text-foreground font-semibold">{category?.count}</td>
                  <td className="text-right p-4 text-muted-foreground">{category?.percentage?.toFixed(1)}%</td>
                  <td className="text-right p-4">
                    <span className="flex items-center justify-end gap-1 text-foreground font-semibold">
                      ⭐ {category?.avgRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories?.length === 0 && !loading && (
          <div className="text-center py-8">
            <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No categories found matching your search.</p>
          </div>
        )}
      </div>

      {/* Processing Time Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Average Processing Time</h3>
        <div className="flex items-end space-x-4">
          <div>
            <p className="text-4xl font-bold text-blue-600">{analyticsData?.averageProcessingTime || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">days</p>
          </div>
          <p className="text-muted-foreground mb-2">Average time to approve/reject resources</p>
        </div>
      </div>

      {/* Recent Trends */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Trends (Last 3 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">New Resources</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Approved</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Rejected</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Avg Processing Time</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.recentTrends?.map((trend, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-accent">
                  <td className="py-3 px-4 font-medium text-foreground">{trend?.date}</td>
                  <td className="text-right py-3 px-4 text-foreground">{trend?.newResources}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-semibold">{trend?.approved}</td>
                  <td className="text-right py-3 px-4 text-red-600 font-semibold">{trend?.rejected}</td>
                  <td className="text-right py-3 px-4 text-blue-600 font-semibold">{trend?.avgProcessingTime} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!analyticsData?.recentTrends || analyticsData?.recentTrends?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent trends data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceOversightSection;