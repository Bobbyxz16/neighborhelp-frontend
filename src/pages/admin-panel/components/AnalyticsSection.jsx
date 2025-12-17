import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const AnalyticsSection = () => {
  const [data, setData] = useState({
    usage: null,
    geographic: null,
    resources: null,
    reports: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('usage');
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usageRes, geoRes, resRes, reportsRes] = await Promise.all([
        api.get(API_ENDPOINTS.ANALYTICS.USAGE),
        api.get(API_ENDPOINTS.ANALYTICS.GEOGRAPHIC),
        api.get(API_ENDPOINTS.ANALYTICS.RESOURCES),
        api.get(API_ENDPOINTS.REPORTS.BASE)
      ]);

      setData({
        usage: usageRes?.data || {},
        geographic: geoRes?.data || {},
        resources: resRes?.data || {},
        reports: reportsRes?.data || { content: [], totalElements: 0 }
      });
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId, notes) => {
    try {
      await api.patch(API_ENDPOINTS.REPORTS.RESOLVE(reportId), { resolutionNotes: notes });
      loadAnalytics();
      setSelectedReport(null);
      setResolutionNotes('');
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  const handleEscalateReport = async (reportId) => {
    try {
      await api.patch(API_ENDPOINTS.REPORTS.ESCALATE(reportId));
      loadAnalytics();
      setSelectedReport(null);
    } catch (err) {
      console.error('Error escalating report:', err);
    }
  };

  const MetricCard = ({ title, value, icon, color = 'blue', subtext }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100 text-blue-600' : color === 'green' ? 'bg-green-100 text-green-600' : color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground">Platform usage and performance insights</p>
        </div>
        <Button onClick={loadAnalytics} variant="outline">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-border">
        {[
          { id: 'usage', label: 'Usage', icon: 'Activity' },
          { id: 'geographic', label: 'Geographic', icon: 'Map' },
          { id: 'resources', label: 'Resources', icon: 'Package' },
          { id: 'reports', label: 'Reports', icon: 'AlertCircle' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Views"
              value={data.usage?.totalViews?.toLocaleString() || 0}
              icon="Eye"
              color="blue"
            />
            <MetricCard
              title="Total Searches"
              value={data.usage?.totalSearches?.toLocaleString() || 0}
              icon="Search"
              color="green"
            />
            <MetricCard
              title="New Users This Month"
              value={data.usage?.newUsersThisMonth || 0}
              icon="Users"
              color="orange"
            />
            <MetricCard
              title="New Resources This Month"
              value={data.usage?.newResourcesThisMonth || 0}
              icon="Plus"
              color="purple"
            />
          </div>

          {/* Active Users Today */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Users Today</h3>
            <p className="text-4xl font-bold text-blue-600">{data.usage?.activeUsersToday || 0}</p>
            <p className="text-sm text-muted-foreground mt-2">Currently active on the platform</p>
          </div>

          {/* Daily Stats Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.usage?.dailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
                <Line type="monotone" dataKey="searches" stroke="#10b981" strokeWidth={2} name="Searches" />
                <Line type="monotone" dataKey="newUsers" stroke="#f59e0b" strokeWidth={2} name="New Users" />
                <Line type="monotone" dataKey="newResources" stroke="#8b5cf6" strokeWidth={2} name="New Resources" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Categories */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Popular Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(data.usage?.popularCategories || {}).map(([name, value]) => ({ name, value }))} >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Geographic Tab */}
      {activeTab === 'geographic' && (
        <div className="space-y-6">
          {/* Most Active City */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Most Active City</h3>
            <p className="text-4xl font-bold text-blue-600">{data.geographic?.mostActiveCity || 'N/A'}</p>
            <p className="text-sm text-muted-foreground mt-2">Leading platform activity</p>
          </div>

          {/* Cities Stats Table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cities Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">City</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Resources</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Users</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Total Views</th>
                  </tr>
                </thead>
                <tbody>
                  {data.geographic?.citiesStats?.map((city, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-accent">
                      <td className="py-3 px-4">{city.city}</td>
                      <td className="text-right py-3 px-4">{city.resourceCount}</td>
                      <td className="text-right py-3 px-4">{city.userCount}</td>
                      <td className="text-right py-3 px-4">{city.totalViews?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resources by City Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(data.geographic?.resourcesByCity || {}).map(([city, count]) => ({ name: city, value: count }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#3b82f6"
                  dataKey="value"
                >
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color, idx) => (
                    <Cell key={`cell-${idx}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Users by City Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Users by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(data.geographic?.usersByCity || {}).map(([city, count]) => ({ city, count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="city" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Resources"
              value={data.resources?.totalResources || 0}
              icon="Package"
              color="blue"
            />
            <MetricCard
              title="Approved Today"
              value={data.resources?.approvedToday || 0}
              icon="CheckCircle"
              color="green"
            />
            <MetricCard
              title="Rejected Today"
              value={data.resources?.rejectedToday || 0}
              icon="XCircle"
              color="orange"
            />
            <MetricCard
              title="Approval Rate"
              value={`${data.resources?.approvalRate || 0}%`}
              icon="TrendingUp"
              color="purple"
            />
          </div>

          {/* Processing Time */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Average Processing Time</h3>
            <p className="text-4xl font-bold text-blue-600">{data.resources?.averageProcessingTime || 0} days</p>
            <p className="text-sm text-muted-foreground mt-2">Average time to approve/reject resources</p>
          </div>

          {/* Category Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Count</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Percentage</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.resources?.categoryBreakdown?.map((cat, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-accent">
                      <td className="py-3 px-4 font-medium">{cat.category}</td>
                      <td className="text-right py-3 px-4">{cat.count}</td>
                      <td className="text-right py-3 px-4">{cat.percentage.toFixed(1)}%</td>
                      <td className="text-right py-3 px-4">
                        <span className="flex items-center justify-end gap-1">
                          ⭐ {cat.avgRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trends */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Trends (Last 3 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.resources?.recentTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Line type="monotone" dataKey="newResources" stroke="#3b82f6" strokeWidth={2} name="New Resources" />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Reports"
              value={data.reports?.totalElements || 0}
              icon="AlertCircle"
              color="orange"
            />
            <MetricCard
              title="Under Review"
              value={data.reports?.content?.filter(r => r.status === 'UNDER_REVIEW').length || 0}
              icon="Clock"
              color="blue"
            />
            <MetricCard
              title="Escalated"
              value={data.reports?.content?.filter(r => r.status === 'ESCALATED').length || 0}
              icon="AlertTriangle"
              color="red"
            />
            <MetricCard
              title="Resolved"
              value={data.reports?.content?.filter(r => r.status === 'RESOLVED').length || 0}
              icon="CheckCircle"
              color="green"
            />
          </div>

          {/* Reports List */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">User Reports</h3>
            {data.reports?.content && data.reports.content.length > 0 ? (
              <div className="space-y-4">
                {data.reports.content.map((report) => (
                  <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-accent transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.reportTarget === 'RESOURCE' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {report.reportTarget}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            report.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                            report.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {report.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                            report.status === 'ESCALATED' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {report.reportTarget === 'RESOURCE' ? report.resourceTitle : report.commentText?.substring(0, 100)}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Report Type:</span> {report.reportType?.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Reported by:</span> {report.reporterName} ({report.reporterEmail})
                        </p>
                        <p className="text-sm text-foreground">{report.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium whitespace-nowrap"
                      >
                        Review
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reported on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No reports found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Report ID</p>
                    <p className="font-semibold text-foreground">#{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      selectedReport.status === 'ESCALATED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      selectedReport.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      selectedReport.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="font-semibold text-foreground">{selectedReport.reportType?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Report Target Info */}
              <div className="bg-accent rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  {selectedReport.reportTarget} INFORMATION
                </p>
                {selectedReport.reportTarget === 'RESOURCE' ? (
                  <>
                    <p className="text-sm"><span className="font-semibold">Resource:</span> {selectedReport.resourceTitle}</p>
                    <p className="text-sm"><span className="font-semibold">Resource ID:</span> {selectedReport.resourceId}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm"><span className="font-semibold">Comment:</span> {selectedReport.commentText}</p>
                    <p className="text-sm"><span className="font-semibold">Comment Author:</span> {selectedReport.commentAuthorName}</p>
                    <p className="text-sm"><span className="font-semibold">Resource:</span> {selectedReport.resourceTitle}</p>
                  </>
                )}
              </div>

              {/* Reporter Info */}
              <div className="bg-accent rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">REPORTER INFORMATION</p>
                <p className="text-sm"><span className="font-semibold">Name:</span> {selectedReport.reporterName}</p>
                <p className="text-sm"><span className="font-semibold">Email:</span> {selectedReport.reporterEmail}</p>
                <p className="text-sm"><span className="font-semibold">ID:</span> {selectedReport.reporterId}</p>
              </div>

              {/* Description */}
              <div className="bg-accent rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">REPORT DESCRIPTION</p>
                <p className="text-foreground">{selectedReport.description}</p>
              </div>

              {/* Timeline */}
              <div className="bg-accent rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-3">TIMELINE</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reported</span>
                    <span className="text-sm font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm font-medium">{new Date(selectedReport.updatedAt).toLocaleString()}</span>
                  </div>
                  {selectedReport.resolvedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolved</span>
                      <span className="text-sm font-medium">{new Date(selectedReport.resolvedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Notes */}
              {selectedReport.resolutionNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-green-700 uppercase font-semibold mb-2">RESOLUTION NOTES</p>
                  <p className="text-green-700">{selectedReport.resolutionNotes}</p>
                  {selectedReport.resolvedByName && (
                    <p className="text-xs text-green-600 mt-2">Resolved by {selectedReport.resolvedByName}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {selectedReport.status !== 'RESOLVED' && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {selectedReport.status !== 'ESCALATED' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Resolution Notes (Optional)
                        </label>
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Enter resolution notes..."
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          rows="3"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveReport(selectedReport.id, resolutionNotes)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          <Icon name="Check" size={16} className="inline mr-2" />
                          Mark as Resolved
                        </button>
                        <button
                          onClick={() => handleEscalateReport(selectedReport.id)}
                          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                          <Icon name="AlertTriangle" size={16} className="inline mr-2" />
                          Escalate
                        </button>
                      </div>
                    </>
                  )}
                  {selectedReport.status === 'ESCALATED' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <p className="text-orange-700 font-semibold">This report has been escalated to higher authorities</p>
                    </div>
                  )}
                </div>
              )}

              {selectedReport.status === 'RESOLVED' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Icon name="CheckCircle" size={32} className="mx-auto text-green-600 mb-2" />
                  <p className="text-green-700 font-semibold">Report has been resolved</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection;

