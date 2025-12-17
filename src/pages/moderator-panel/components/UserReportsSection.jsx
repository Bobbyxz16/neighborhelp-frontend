import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const UserReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.REPORTS.BASE);
      setReports(response?.data?.content || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleResolveReport = async (reportId, notes) => {
    try {
      await api.patch(API_ENDPOINTS.REPORTS.RESOLVE(reportId), { resolutionNotes: notes });
      loadReports();
      setSelectedReport(null);
      setResolutionNotes('');
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  const handleEscalateReport = async (reportId) => {
    try {
      await api.patch(API_ENDPOINTS.REPORTS.ESCALATE(reportId));
      loadReports();
      setSelectedReport(null);
    } catch (err) {
      console.error('Error escalating report:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-700';
      case 'ESCALATED':
        return 'bg-red-100 text-red-700';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTargetColor = (target) => {
    switch (target) {
      case 'RESOURCE':
        return 'bg-blue-100 text-blue-700';
      case 'COMMENT':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredReports = statusFilter === 'all' 
    ? reports 
    : reports.filter(r => r.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">User Reports</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <Button variant="outline" iconName="RefreshCw" onClick={loadReports}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-foreground">{reports.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <Icon name="AlertCircle" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Under Review</p>
              <p className="text-3xl font-bold text-foreground">
                {reports.filter(r => r.status === 'UNDER_REVIEW').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Icon name="Clock" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Escalated</p>
              <p className="text-3xl font-bold text-foreground">
                {reports.filter(r => r.status === 'ESCALATED').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <Icon name="AlertTriangle" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl font-bold text-foreground">
                {reports.filter(r => r.status === 'RESOLVED').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Icon name="CheckCircle" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Reports</h3>
        {filteredReports && filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-accent transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTargetColor(report.reportTarget)}`}>
                        {report.reportTarget}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
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
                      <span className="font-medium">Reported by:</span> {report.reporterName}
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
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(selectedReport.severity)}`}>
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
                      <p className="text-orange-700 font-semibold">This report has been escalated</p>
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

export default UserReportsSection;