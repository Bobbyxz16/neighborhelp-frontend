import React from 'react';
import { Eye, Package, Star, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// MetricCard Component
const MetricCard = ({ title, value, icon, color, subValue, change }) => {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200'
  };

  const iconBgStyles = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600'
  };

  const iconMap = {
    Eye: <Eye className="w-5 h-5" />,
    Package: <Package className="w-5 h-5" />,
    Star: <Star className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />
  };

  return (
    <div className={`border rounded-lg p-6 ${colorStyles[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={change >= 0 ? 'text-green-600' : 'text-red-600'} style={{ fontSize: '0.875rem' }}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-3 ${iconBgStyles[color]}`}>
          {iconMap[icon] || <Eye className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
};

// ResourceRow Component for rankings
const ResourceRow = ({ rank, title, value, status }) => {
  const badges = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center space-x-4 flex-1">
        <span className="text-2xl">{badges[rank] || `#${rank}`}</span>
        <div className="flex-1">
          <p className="font-medium text-gray-900 truncate">{title}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

// EmptyState Component
const EmptyState = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 mb-4">
        <Package className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const AnalyticsOverview = ({ metrics = {}, myResources = [], analyticsData = {} }) => {
  // Safety check: ensure myResources is an array
  const resources = Array.isArray(myResources) ? myResources : [];
  
  // Prepare data for charts
  const resourceStatusData = [
    {
      name: 'Active',
      value: resources.filter(r => r.status === 'ACTIVE').length,
      color: '#10b981'
    },
    {
      name: 'Pending',
      value: resources.filter(r => r.status === 'PENDING').length,
      color: '#f59e0b'
    },
    {
      name: 'Inactive',
      value: resources.filter(r => r.status !== 'ACTIVE' && r.status !== 'PENDING').length,
      color: '#d1d5db'
    }
  ];

  // Filter resources with actual views
  const topViewedResources = [...resources]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 3);

  // Filter resources with ratings
  const topRatedResources = [...resources]
    .filter(r => r.averageRating > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  // Prepare engagement data for bar chart
  const engagementData = analyticsData?.monthly ? analyticsData.monthly.slice(-6) : [];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={metrics?.totalViews || 0}
          icon="Eye"
          color="blue"
          subValue="Views on all resources"
          change={metrics?.viewsChange || 0}
        />
        <MetricCard
          title="Active Listings"
          value={metrics?.activeListings || 0}
          icon="Package"
          color="indigo"
          subValue={`${metrics?.listingsChange || 0} pending approval`}
          change={metrics?.listingsChange || 0}
        />
        <MetricCard
          title="Avg Rating"
          value={metrics?.averageRating || '0.0'}
          icon="Star"
          color="yellow"
          subValue="Based on reviews"
          change={metrics?.ratingChange || 0}
        />
        <MetricCard
          title="Inquiries Received"
          value={metrics?.contactsReceived || 0}
          icon="MessageSquare"
          color="green"
          subValue="Contact requests"
          change={metrics?.contactsChange || 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resource Status Distribution</h3>
          {resourceStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} resources`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No Resources Yet"
              description="Create your first resource to see statistics here"
            />
          )}
        </div>

        {/* Community Engagement */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Community Engagement (Last 6 Months)</h3>
          {engagementData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="views" fill="#3b82f6" name="Views" />
                <Bar dataKey="contacts" fill="#10b981" name="Contacts" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No Engagement Data"
              description="Analytics will appear as you receive views and inquiries"
            />
          )}
        </div>
      </div>

      {/* Top Resources Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed Resources */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Viewed Resources</h3>
          {topViewedResources.length > 0 ? (
            <div className="space-y-2">
              {topViewedResources.map((resource, index) => (
                <ResourceRow
                  key={resource.id}
                  rank={index + 1}
                  title={resource.title || resource.resourceName}
                  value={`${resource.viewsCount || 0} views`}
                  status={resource.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Views Yet"
              description="Your resources will appear here as they receive views"
            />
          )}
        </div>

        {/* Highest Rated Resources */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Highest Rated Resources</h3>
          {topRatedResources.length > 0 ? (
            <div className="space-y-2">
              {topRatedResources.map((resource, index) => (
                <ResourceRow
                  key={resource.id}
                  rank={index + 1}
                  title={resource.title || resource.resourceName}
                  value={`${resource.averageRating?.toFixed(1) || '0.0'} ⭐`}
                  status={resource.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Ratings Yet"
              description="Resources with ratings will appear here"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
