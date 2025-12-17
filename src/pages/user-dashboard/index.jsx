import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import SavedResourcesSection from './components/SavedResourcesSection';
import ActivityFeed from './components/ActivityFeed';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecommendationsSection from './components/RecommendationsSection';
import TotalViewsCard from './components/TotalViewsCard';
import HelpSupportCard from './components/HelpSupportCard';
import CommunityImpactCard from './components/CommunityImpactCard';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';

/**
 * User Dashboard - Main Page
 * 
 * Data Flow:
 * 1. Fetch user's created resources from backend
 * 2. Fetch user's saved/bookmarked resources
 * 3. Display personalized recommendations
 * 4. Show recent activity and quick actions
 */
const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myResources, setMyResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user
      const { data: me } = await api.get(API_ENDPOINTS.USERS.ME);
      setUser(me);

      // Fetch my resources
      const { data: resourcesData } = await api.get(API_ENDPOINTS.RESOURCES.MY_RESOURCES,
        { params: { size: 20, sort: 'createdAt', direction: 'desc' } }
      );
      const my = resourcesData?.content || [];
      // Client-side sort to be safe
      my.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMyResources(my);

      // Derive simple activity feed from latest resource updates
      const derivedActivities = (my || []).slice(0, 5).map(r => ({
        id: r.id,
        type: 'new_resource',
        title: r.title,
        description: r.description,
        timestamp: r.createdAt || r.updatedAt || Date.now(),
        provider: me?.username || me?.organizationName || 'You',
        actionLabel: 'View',
        image: r.images?.[0]?.url,
        imageAlt: r.title,
      }));
      setActivities(derivedActivities);

      // Fetch user statistics (if backend endpoint exists)
      if (me?.username || me?.organizationName) {
        const identifier = me.username || me.organizationName;
        const { data: stats } = await api.get(
          API_ENDPOINTS.USERS.STATISTICS(identifier)
        );
        setStatistics(stats || {});
      }

      // Fetch saved/bookmarked resources
      try {
        const { data: savedData } = await api.get(API_ENDPOINTS.RESOURCES.SAVED, {
          params: { size: 10, sort: 'createdAt', direction: 'desc' },
        });
        setSavedResources(savedData?.content || savedData || []);
      } catch {
        setSavedResources([]);
      }

      // Fetch recommendation candidates (simple: latest popular resources near user)
      try {
        const params = { size: 6, sort: 'createdAt', direction: 'desc' };
        if (me?.city) params.city = me.city;
        const { data: recData } = await api.get(API_ENDPOINTS.RESOURCES.BASE, { params });
        setRecommendations(recData?.content || recData || []);
      } catch {
        setRecommendations([]);
      }

      // Fetch unread messages count for quick actions badge
      try {
        const { data: unread } = await api.get(API_ENDPOINTS.MESSAGES.UNREAD_COUNT);
        setUnreadCount(typeof unread === 'number' ? unread : (unread?.count || 0));
      } catch {
        setUnreadCount(0);
      }

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Failed to load data');

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Handle resource actions (edit, delete, etc.)
   */
  const handleResourceAction = async (action, resourceSlug) => {
    try {
      switch (action) {
        case 'view':
          navigate(`/resources/${resourceSlug}`);
          break;
        case 'edit':
          navigate(`/edit-resource/${resourceSlug}`);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this resource?')) {
            await api.delete(
              API_ENDPOINTS.RESOURCES.DELETE_PERMANENT(resourceSlug)
            );
            loadDashboardData();
          }
          break;
        case 'activate':
          await api.patch(
            API_ENDPOINTS.RESOURCES.ACTIVATE(resourceSlug)
          );
          loadDashboardData();
          break;
        case 'deactivate':
          await api.patch(
            API_ENDPOINTS.RESOURCES.DEACTIVATE(resourceSlug)
          );
          loadDashboardData();
          break;
        case 'unsave':
          await api.delete(API_ENDPOINTS.RESOURCES.UNSAVE(resourceSlug));
          loadDashboardData();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Resource action failed:', err);
      alert(`Failed to ${action} resource: ${err?.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection user={user} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Created Resources - DYNAMIC FROM BACKEND */}
            <SavedResourcesSection
              resources={myResources}
              onAction={handleResourceAction}
              viewAllTo="/my-resources"
              viewAllLabel="View All My Resources"
            />


            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <TotalViewsCard statistics={statistics} />
              </div>
              <HelpSupportCard />
              <CommunityImpactCard />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <QuickActionsPanel
              user={user}
              statistics={statistics}
              unreadCount={unreadCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;