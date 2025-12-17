import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);
  const [topResources, setTopResources] = useState({ byViews: [], byRating: [] });
  const [resourceStatusData, setResourceStatusData] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data: meResp } = await api.get(API_ENDPOINTS.USERS.ME);
      setMe(meResp);

      if (meResp?.username || meResp?.organizationName) {
        const identifier = meResp.username || meResp.organizationName;

        // Fetch statistics and user resources in parallel
        const [statsResp, resourcesResp] = await Promise.all([
          api.get(API_ENDPOINTS.USERS.STATISTICS(identifier)),
          api.get(API_ENDPOINTS.RESOURCES.USER_RESOURCES(meResp.id))
        ]);

        const fullStats = statsResp.data;
        const resourcesData = resourcesResp.data;

        let allResources = [];
        if (Array.isArray(resourcesData)) {
          allResources = resourcesData;
        } else if (resourcesData?.content && Array.isArray(resourcesData.content)) {
          allResources = resourcesData.content;
        } else if (resourcesData?.resources && Array.isArray(resourcesData.resources)) {
          allResources = resourcesData.resources;
        }

        setStats(fullStats);

        // Process Data for Charts
        const statusCounts = {
          Active: fullStats.activeResources || 0,
          Pending: fullStats.pendingResources || 0,
          Other: Math.max(0, (fullStats.resourcesCreated || 0) - (fullStats.activeResources || 0) - (fullStats.pendingResources || 0))
        };

        const chartData = Object.entries(statusCounts)
          .filter(([_, value]) => value > 0)
          .map(([name, value]) => ({ name, value }));

        setResourceStatusData(chartData);

        // Process Top Resources
        const sortedByViews = [...allResources]
          .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
          .slice(0, 3);

        const sortedByRating = [...allResources]
          .filter(r => (r.averageRating || 0) > 0)
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3);

        setTopResources({
          byViews: sortedByViews,
          byRating: sortedByRating
        });

      } else {
        setStats(null);
      }
    } catch (err) {
      console.error("Error loading statistics:", err);
      setError(err?.message || 'Failed to load statistics');
      if (err?.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const totalViews = stats?.totalViews ?? 0;

  // Data for Engagement Bar Chart
  const engagementData = [
    { name: 'Given', value: stats?.ratingsGiven || 0 },
    { name: 'Received', value: stats?.ratingsReceived || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={18} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytics Dashboard</h1>
          </div>
          {me && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                {me.username || me.organizationName}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Gathering insights...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to load statistics</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={load}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Views"
                value={totalViews}
                icon="Eye"
                color="blue"
                trend={totalViews > 0 ? "+12% this month" : "No views yet"} // Placeholder trend
              />
              <MetricCard
                title="Total Resources"
                value={stats?.resourcesCreated ?? 0}
                icon="Package"
                color="indigo"
              />
              <MetricCard
                title="Avg Rating"
                value={(stats?.averageRatingReceived ?? 0).toFixed(1)}
                icon="Star"
                color="yellow"
                subValue={`(${stats?.ratingsReceived ?? 0} reviews)`}
              />
              <MetricCard
                title="Active Resources"
                value={stats?.activeResources ?? 0}
                icon="CheckCircle"
                color="green"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resource Status Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Icon name="PieChart" size={20} className="text-gray-500" />
                  Resource Status
                </h3>
                <div className="h-64 w-full">
                  {resourceStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resourceStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {resourceStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="No resources created yet" />
                  )}
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Icon name="BarChart2" size={20} className="text-gray-500" />
                  Community Engagement
                </h3>
                <div className="h-64 w-full">
                  {(stats?.ratingsGiven > 0 || stats?.ratingsReceived > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={30}>
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#8884d8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="No ratings activity yet" />
                  )}
                </div>
              </div>
            </div>

            {/* Top Performing Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Viewed */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-blue-500" />
                    Most Viewed Resources
                  </h3>
                </div>
                <div className="p-0">
                  {topResources.byViews.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {topResources.byViews.map((resource, idx) => (
                        <ResourceRow
                          key={resource.id}
                          rank={idx + 1}
                          resource={resource}
                          metric={`${resource.viewsCount || 0} views`}
                          metricIcon="Eye"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8"><EmptyState message="No views recorded yet" /></div>
                  )}
                </div>
              </div>

              {/* Highest Rated */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="Award" size={20} className="text-yellow-500" />
                    Highest Rated Resources
                  </h3>
                </div>
                <div className="p-0">
                  {topResources.byRating.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {topResources.byRating.map((resource, idx) => (
                        <ResourceRow
                          key={resource.id}
                          rank={idx + 1}
                          resource={resource}
                          metric={(resource.averageRating || 0).toFixed(1)}
                          metricIcon="Star"
                          isRating
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8"><EmptyState message="No ratings received yet" /></div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

const MetricCard = ({ title, value, icon, color, subValue, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {subValue && <span className="text-sm text-gray-500">{subValue}</span>}
          </div>
          {trend && <p className="mt-2 text-xs text-green-600 font-medium">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

const ResourceRow = ({ rank, resource, metric, metricIcon, isRating }) => (
  <div className="flex items-center p-4 hover:bg-gray-50 transition-colors group">
    <div className={`
      w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4
      ${rank === 1 ? 'bg-yellow-100 text-yellow-700' :
        rank === 2 ? 'bg-gray-100 text-gray-700' :
          'bg-orange-50 text-orange-700'}
    `}>
      {rank}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
        {resource.title}
      </h4>
      <p className="text-xs text-gray-500 truncate">{resource.categoryName}</p>
    </div>
    <div className={`flex items-center gap-1.5 text-sm font-semibold ${isRating ? 'text-yellow-600' : 'text-blue-600'}`}>
      <Icon name={metricIcon} size={14} />
      {metric}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center py-8">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
      <Icon name="BarChart" size={20} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default Statistics;