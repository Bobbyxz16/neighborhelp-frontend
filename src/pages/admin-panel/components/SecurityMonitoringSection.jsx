import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Select from '../../../components/ui/ui-components/Select';

// Mock security monitoring data
const mockSecurityData = {
  summary: {
    totalAlerts: 23,
    criticalAlerts: 2,
    activeThreats: 1,
    blockedIPs: 12,
    suspiciousLogins: 15,
    failedAttempts: 156
  },
  alerts: [
    {
      id: 1,
      type: 'multiple_failed_logins',
      severity: 'high',
      timestamp: '2025-11-02T11:15:00Z',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      details: {
        ip: '192.168.1.100',
        attempts: 12,
        targetEmail: 'admin@neighborlyunion.com'
      },
      status: 'active',
      actions: ['block_ip', 'notify_admin']
    },
    {
      id: 2,
      type: 'unusual_access_pattern',
      severity: 'medium',
      timestamp: '2025-11-02T10:45:00Z',
      description: 'Unusual access pattern detected for user sarah.johnson@email.com',
      details: {
        userId: 1,
        locations: ['California, US', 'London, UK'],
        timeSpan: '30 minutes'
      },
      status: 'investigating',
      actions: ['verify_user', 'require_2fa']
    },
    {
      id: 3,
      type: 'data_access_anomaly',
      severity: 'critical',
      timestamp: '2025-11-02T10:30:00Z',
      description: 'Abnormal data access patterns detected',
      details: {
        userId: 45,
        dataAccessed: 'user_database',
        volume: 'high',
        timePattern: 'automated'
      },
      status: 'resolved',
      actions: ['account_suspended', 'audit_trail']
    },
    {
      id: 4,
      type: 'api_rate_limit_exceeded',
      severity: 'low',
      timestamp: '2025-11-02T09:20:00Z',
      description: 'API rate limit exceeded by client application',
      details: {
        clientId: 'app_12345',
        requestCount: 1200,
        timeWindow: '1 hour'
      },
      status: 'auto_resolved',
      actions: ['rate_limit_applied']
    },
    {
      id: 5,
      type: 'privilege_escalation_attempt',
      severity: 'high',
      timestamp: '2025-11-02T08:15:00Z',
      description: 'Attempted privilege escalation detected',
      details: {
        userId: 23,
        attemptedRole: 'admin',
        currentRole: 'user'
      },
      status: 'blocked',
      actions: ['access_denied', 'log_incident']
    }
  ],
  blockedIPs: [
    { ip: '192.168.1.100', reason: 'Multiple failed logins', blockedAt: '2025-11-02T11:15:00Z', attempts: 12 },
    { ip: '10.0.0.45', reason: 'Suspicious activity', blockedAt: '2025-11-02T09:30:00Z', attempts: 8 },
    { ip: '172.16.0.1', reason: 'Bot detection', blockedAt: '2025-11-02T08:45:00Z', attempts: 25 }
  ],
  loginAttempts: {
    successful: 1247,
    failed: 156,
    blocked: 23,
    locations: [
      { country: 'United States', attempts: 1156, success: 89.2 },
      { country: 'Canada', attempts: 234, success: 92.1 },
      { country: 'United Kingdom', attempts: 13, success: 85.7 }
    ]
  }
};

const SecurityMonitoringSection = () => {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSecurityData(mockSecurityData);
      } catch (error) {
        console.error('Error loading security data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityData();
  }, [timeFilter]);

  const filteredAlerts = securityData?.alerts?.filter(alert => {
    if (severityFilter === 'all') return true;
    return alert?.severity === severityFilter;
  });

  const handleResolveAlert = (alertId) => {
    if (confirm('Mark this alert as resolved?')) {
      setSecurityData(prev => ({
        ...prev,
        alerts: prev?.alerts?.map(a => (a?.id === alertId ? { ...a, status: 'resolved' } : a))
      }));
      alert('Alert marked as resolved');
    }
  };

  const handleBlockIP = (ip) => {
    if (confirm(`Block IP address ${ip}?`)) {
      // In real app, this would make API call
      alert(`IP ${ip} has been blocked`);
    }
  };

  const handleUnblockIP = (ip) => {
    if (confirm(`Unblock IP address ${ip}?`)) {
      // In real app, this would make API call
      alert(`IP ${ip} has been unblocked`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'auto_resolved':
        return 'text-green-600 bg-green-100';
      case 'blocked':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Monitoring</h2>
          <p className="text-muted-foreground">Monitor security threats and access patterns</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e?.target?.value)}>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </Select>
          
          <Select value={severityFilter} onChange={(e) => setSeverityFilter(e?.target?.value)}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Button
            iconName="Download"
            iconPosition="left"
            onClick={() => alert('Exporting security report...')}
          >
            Export Report
          </Button>
        </div>
      </div>
      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground">{securityData?.summary?.totalAlerts}</p>
            </div>
            <Icon name="AlertTriangle" size={24} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{securityData?.summary?.criticalAlerts}</p>
            </div>
            <Icon name="AlertCircle" size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Threats</p>
              <p className="text-2xl font-bold text-orange-600">{securityData?.summary?.activeThreats}</p>
            </div>
            <Icon name="Shield" size={24} className="text-orange-600" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blocked IPs</p>
              <p className="text-2xl font-bold text-foreground">{securityData?.summary?.blockedIPs}</p>
            </div>
            <Icon name="Ban" size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Suspicious Logins</p>
              <p className="text-2xl font-bold text-foreground">{securityData?.summary?.suspiciousLogins}</p>
            </div>
            <Icon name="LogIn" size={24} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed Attempts</p>
              <p className="text-2xl font-bold text-foreground">{securityData?.summary?.failedAttempts}</p>
            </div>
            <Icon name="X" size={24} className="text-red-600" />
          </div>
        </div>
      </div>
      {/* Security Alerts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Security Alerts</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Refreshing alerts...')}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {filteredAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`border rounded-lg p-4 ${getSeverityColor(alert?.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(alert?.severity)}`}>
                      {alert?.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(alert?.status)}`}>
                      {alert?.status?.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(alert?.timestamp)?.toLocaleString()}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-foreground mb-2">{alert?.description}</h4>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {Object?.entries(alert?.details || {})?.map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="capitalize font-medium mr-2">{key?.replace('_', ' ')}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alert?.actions?.map((action, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                      >
                        {action?.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  {alert?.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveAlert(alert?.id)}
                    >
                      Resolve
                    </Button>
                  )}
                  {alert?.details?.ip && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockIP(alert?.details?.ip)}
                    >
                      Block IP
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`View details for alert ${alert?.id}`)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No security alerts match your current filters.</p>
          </div>
        )}
      </div>
      {/* Blocked IPs and Login Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocked IPs */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Blocked IP Addresses</h3>
          <div className="space-y-3">
            {securityData?.blockedIPs?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <div className="font-medium text-accent-foreground">{item?.ip}</div>
                  <div className="text-sm text-accent-foreground/80">{item?.reason}</div>
                  <div className="text-xs text-accent-foreground/70">
                    Blocked: {new Date(item?.blockedAt)?.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-accent-foreground/80">{item?.attempts} attempts</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblockIP(item?.ip)}
                  >
                    Unblock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Statistics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Login Statistics</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{securityData?.loginAttempts?.successful}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{securityData?.loginAttempts?.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{securityData?.loginAttempts?.blocked}</div>
              <div className="text-sm text-muted-foreground">Blocked</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Top Locations</h4>
            {securityData?.loginAttempts?.locations?.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-foreground">{location?.country}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{location?.attempts} attempts</div>
                  <div className="text-xs text-green-600">{location?.success}% success</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringSection;