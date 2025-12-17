import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import Icon from '../../components/ui/AppIcon';
import Button from '../../components/ui/ui-components/Button';
import OverviewSection from './components/OverviewSection';
import UserManagementSection from './components/UserManagementSection';
import ResourceOversightSection from './components/ResourceOversightSection';
import AnalyticsSection from './components/AnalyticsSection';
import SystemConfigSection from './components/SystemConfigSection';
import SecurityMonitoringSection from './components/SecurityMonitoringSection';
import api from '../../api/axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock admin user data
  // const mockAdminUser = useMemo(() => ({
  //   id: 1,
  //   firstName: 'Admin',
  //   lastName: 'User',
  //   email: 'admin@neighborlyunion.com',
  //   type: 'admin',
  //   role: 'system_administrator',
  //   permissions: [
  //     'user_management',
  //     'resource_management',
  //     'system_config',
  //     'analytics_access',
  //     'security_monitoring'
  //   ],
  //   lastLogin: '2025-11-02T10:30:00Z',
  //   notifications: 8
  // }), []);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'Platform metrics and health status'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage user accounts and permissions'
    },
    {
      id: 'resources',
      label: 'Resource Oversight',
      icon: 'Building2',
      description: 'Content moderation and resource management'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Platform usage and performance reports'
    }
  ];

  useEffect(() => {
    let isCancelled = false;

    const loadAdminData = async () => {
      try {
        setLoading(true);

        // Check admin authentication
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await api.get(API_ENDPOINTS.USERS.ME);
        if (!isCancelled) {
          setUser(data);
          // Verify user has admin role
          const userRole = (data?.role || '').toString().toUpperCase();
          if (userRole !== 'ADMIN') {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        navigate('/login');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadAdminData();
    return () => { isCancelled = true; };
  }, [navigate]);

  const [tabParams, setTabParams] = useState(null);

  const handleNavigate = (tab, params = null) => {
    setActiveTab(tab);
    setTabParams(params);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection onNavigate={handleNavigate} />;
      case 'users':
        return <UserManagementSection initialAction={tabParams} />;
      case 'resources':
        return <ResourceOversightSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'system':
        return <SystemConfigSection />;
      case 'security':
        return <SecurityMonitoringSection />;
      default:
        return <OverviewSection onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || (user?.role || '').toString().toUpperCase() !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="Shield" size={64} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">You don't have administrator privileges to access this panel.</p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="pt-16">
        <div className="max-w-full mx-auto">
          {/* Admin Header */}
          <div className="bg-linear-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-black">Administrator Panel</h1>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    iconName="Search"
                    iconPosition="left"
                    onClick={() => navigate('/resources')}
                  >
                    Find Resources
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-red-800/50 px-3 py-1 rounded-full text-sm">
                    <Icon name="Shield" size={16} className="inline mr-1" />
                    System Administrator
                  </div>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    iconName="AlertTriangle"
                    iconPosition="left"
                  >
                    System Alerts ({user?.notifications})
                  </Button>
                </div>
              </div>
              <p className="text-black font-bold mt-2">
                Welcome back, {user?.firstName}. Last login: {' '}
                {user?.lastLogin && !isNaN(new Date(user.lastLogin).getTime())
                  ? new Date(user.lastLogin).toLocaleString()
                  : new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 whitespace-nowrap transition-smooth ${activeTab === tab?.id
                      ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }`}
                    title={tab?.description}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="font-medium">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} NeighborlyUnion Admin Panel. Secure platform management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
