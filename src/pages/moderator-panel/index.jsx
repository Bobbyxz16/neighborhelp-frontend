import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import PendingResourcesQueue from './components/PendingResourcesQueue';
import UserReportsSection from './components/UserReportsSection';
import ModerationMetrics from './components/ModerationMetrics';
import CommunicationPanel from './components/CommunicationPanel';
import Icon from '../../components/ui/AppIcon';
import Button from '../../components/ui/ui-components/Button';
import { API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';

const ModeratorPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  const loadUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Check if user is moderator or admin
        if (userData.role !== 'MODERATOR' && userData.role !== 'ADMIN') {
          alert('Access denied. Moderator privileges required.');
          navigate('/');
          return;
        }
        
        setUser(userData);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Load pending resources count
      const pendingResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.PENDING}?page=0&size=1`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (pendingResponse.ok) {
        const data = await pendingResponse.json();
        setPendingCount(data.totalElements || 0);
      }

      // Note: Reports endpoint would need to be implemented in backend
      // For now, we'll use 0 as placeholder
      setReportsCount(0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, [loadUserData, loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleApproveResource = async (resourceSlug) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.APPROVE(resourceSlug)}`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        alert('Resource approved successfully');
        loadDashboardData();
        // Reload the active tab data
        if (activeTab === 'queue') {
          window.location.reload();
        }
      } else {
        alert('Failed to approve resource');
      }
    } catch (error) {
      console.error('Error approving resource:', error);
      alert('Failed to approve resource');
    }
  };

  const handleRejectResource = async (resourceSlug, reason) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.REJECT(resourceSlug)}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        }
      );

      if (response.ok) {
        alert('Resource rejected successfully');
        loadDashboardData();
        if (activeTab === 'queue') {
          window.location.reload();
        }
      } else {
        alert('Failed to reject resource');
      }
    } catch (error) {
      console.error('Error rejecting resource:', error);
      alert('Failed to reject resource');
    }
  };

  const handleRequestClarification = async (resourceSlug, questions) => {
    try {
      // This would require a backend endpoint for requesting clarification
      // For now, we'll show an alert
      alert('Clarification request feature coming soon. Backend endpoint needed.');
      console.log(`Request clarification for ${resourceSlug}:`, questions);
    } catch (error) {
      console.error('Error requesting clarification:', error);
    }
  };

  const handleResolveReport = async (reportId, resolution) => {
    try {
      // This would require a backend reports endpoint
      alert('Report resolution feature coming soon. Backend endpoint needed.');
      console.log(`Resolve report ${reportId}:`, resolution);
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleEscalateReport = async (reportId) => {
    try {
      // This would require a backend reports endpoint
      alert('Report escalation feature coming soon. Backend endpoint needed.');
      console.log(`Escalate report ${reportId}`);
    } catch (error) {
      console.error('Error escalating report:', error);
    }
  };

  const handleSendMessage = async (recipientId, message) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // This would use the messages endpoint
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MESSAGES.SEND}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            receiverId: recipientId,
            subject: message.subject,
            body: message.body
          })
        }
      );

      if (response.ok) {
        alert('Message sent successfully');
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const tabs = [
    { id: 'queue', label: 'Review Queue', icon: 'Clock', badge: pendingCount },
    { id: 'reports', label: 'User Reports', icon: 'Flag', badge: reportsCount },
    { id: 'metrics', label: 'Performance', icon: 'BarChart3' },
    { id: 'communication', label: 'Messages', icon: 'MessageSquare' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading moderator panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Moderator Panel
                </h1>
                <p className="text-muted-foreground">
                  Review resource submissions, manage user reports, and maintain platform quality standards.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="default" 
                  iconName="BarChart3" 
                  iconPosition="left"
                  onClick={() => setActiveTab('metrics')}
                >
                  View Stats
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Icon name="Clock" size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Reports</p>
                  <p className="text-2xl font-bold text-foreground">{reportsCount}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <Icon name="Flag" size={24} className="text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Role</p>
                  <p className="text-2xl font-bold text-foreground">{user.role}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon name="Shield" size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    {tab?.badge > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {tab?.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'queue' && (
              <PendingResourcesQueue
                onApprove={handleApproveResource}
                onReject={handleRejectResource}
                onRequestClarification={handleRequestClarification}
              />
            )}

            {activeTab === 'reports' && (
              <UserReportsSection />
            )}

            {activeTab === 'metrics' && (
              <ModerationMetrics />
            )}

            {activeTab === 'communication' && (
              <CommunicationPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;