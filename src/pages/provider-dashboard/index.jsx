// pages/provider-dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X, Search, User } from 'lucide-react';
import MetricsPanel from './components/MetricsPanel';
import ResourceListingsTable from './components/ResourceListingsTable';
import DashboardMessagesPreview from './components/DashboardMessagesPreview';
import AnalyticsChart from './components/AnalyticsChart';
import ResourcePreviewModal from '../user-dashboard/components/ResourcePreviewModal';
import ProviderMessagesPage from './sub-pages/ProviderMessagesPage';
import Button from '../../components/ui/ui-components/Button';
import Input from '../../components/ui/ui-components/Input';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';
import AnalyticsOverview from './components/AnalyticsOverview';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [myResources, setMyResources] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [conversations, setConversations] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userProfile } = await api.get(API_ENDPOINTS.USERS.ME);
      setUser(userProfile);

      const { data: resourcesData } = await api.get(API_ENDPOINTS.RESOURCES.MY_RESOURCES,
        { params: { size: 100, sort: 'createdAt', direction: 'desc' } }
      );
      const resources = resourcesData?.content || resourcesData || [];
      setMyResources(resources);

      const identifier = userProfile?.organizationName || userProfile?.username || userProfile?.id;
      let statisticsData = {};
      if (identifier) {
        try {
          const { data: stats } = await api.get(API_ENDPOINTS.USERS.STATISTICS(identifier));
          statisticsData = stats;
        } catch (statsError) {
          console.warn('Failed to load provider statistics:', statsError);
        }
      }

      // Fetch messages first to calculate proper contact counts
      let inboxMessages = [];
      let sentMessages = [];
      
      try {
        const [inboxResponse, sentResponse] = await Promise.all([
          api.get(API_ENDPOINTS.MESSAGES.INBOX, { params: { size: 50 } }),
          api.get(API_ENDPOINTS.MESSAGES.SENT, { params: { size: 50 } })
        ]);

        inboxMessages = (inboxResponse.data.content || inboxResponse.data || []).map(msg => ({
          ...msg,
          isSentByMe: false
        }));

        sentMessages = (sentResponse.data.content || sentResponse.data || []).map(msg => ({
          ...msg,
          isSentByMe: true
        }));
      } catch (msgError) {
        console.warn('Failed to fetch messages initially:', msgError);
      }

      // Now calculate metrics with actual message counts
      calculateMetrics(resources, inboxMessages, statisticsData);

      try {
        generateAnalyticsData(resources, inboxMessages);
      } catch (e) {
        console.warn('Failed to fetch analytics, falling back to local calculation', e);
        generateAnalyticsData(resources, inboxMessages);
      }

      try {
        const allMessages = [...inboxMessages, ...sentMessages];
        const conversationMap = new Map();

        allMessages.forEach(message => {
          const isSentByMe = message.isSentByMe;
          const otherUser = isSentByMe ? message.recipient : message.sender;
          const otherUserId = otherUser?.id;

          if (!otherUserId) return;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              id: otherUserId,
              userName: otherUser.organizationName || otherUser.name || 'Unknown User',
              userAvatar: otherUser.organizationName ? otherUser.organizationLogo : otherUser.profilePicture,
              lastMessage: message.content,
              lastMessageDate: message.createdAt,
              unreadCount: 0,
              messages: []
            });
          }

          const conversation = conversationMap.get(otherUserId);
          conversation.messages.push(message);

          if (!message.isRead && !isSentByMe) {
            conversation.unreadCount++;
          }

          if (new Date(message.createdAt) > new Date(conversation.lastMessageDate)) {
            conversation.lastMessageDate = message.createdAt;
            conversation.lastMessage = message.content;
          }
        });

        const sortedConversations = Array.from(conversationMap.values())
          .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

        setConversations(sortedConversations);
      } catch (msgError) {
        console.warn('Failed to fetch messages:', msgError);
        setConversations([]);
      }

    } catch (err) {
      console.error('Failed to load provider data:', err);
      setError(err.message);

      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (resources, inboxMessages = [], statisticsData = {}) => {
    const totalViews = resources.reduce((sum, r) => sum + (r.viewsCount || 0), 0);
    const activeListings = resources.filter(r => r.status === 'ACTIVE').length;
    const resourcesWithRatings = resources.filter(r => r.averageRating > 0);
    const averageRating = resourcesWithRatings.length > 0
      ? resourcesWithRatings.reduce((sum, r) => sum + r.averageRating, 0) / resourcesWithRatings.length
      : 0;
    
    // Use contactsReceived from statistics endpoint, fallback to message count or 0
    const contactsReceived = statisticsData?.contactsReceived !== undefined
      ? statisticsData.contactsReceived
      : inboxMessages.length > 0
        ? inboxMessages.filter(msg => !msg.isSentByMe).length
        : resources.reduce((sum, r) => sum + (r.messagesCount || 0), 0);

    setMetrics({
      totalViews,
      viewsChange: 0,
      contactsReceived,
      contactsChange: 0,
      averageRating: averageRating.toFixed(1),
      ratingChange: 0,
      activeListings,
      listingsChange: resources.filter(r => r.status === 'PENDING').length
    });
  };

  const generateAnalyticsData = (resources, inboxMessages = []) => {
    const totalViews = resources.reduce((s, r) => s + (r.viewsCount || 0), 0);
    // Count messages received (excluding sent messages)
    const totalContacts = inboxMessages.length > 0
      ? inboxMessages.filter(msg => !msg.isSentByMe).length
      : resources.reduce((s, r) => s + (r.messagesCount || 0), 0);
    const totalBookings = resources.reduce((s, r) => s + (r.bookings || 0), 0);

    const point = {
      date: 'All Time',
      views: totalViews,
      contacts: totalContacts,
      bookings: totalBookings
    };

    const hasData = totalViews || totalContacts || totalBookings;

    setAnalyticsData({
      weekly: hasData ? [point] : [],
      monthly: hasData ? generateMonthlyData(resources, inboxMessages) : [],
      quarterly: hasData ? generateQuarterlyData(resources, inboxMessages) : []
    });
  };

  const generateMonthlyData = (resources, inboxMessages = []) => {
    const totalViews = (resources && resources.length)
      ? resources.reduce((s, r) => s + (r.viewsCount || 0), 0)
      : 0;
    const totalContacts = inboxMessages.length > 0
      ? inboxMessages.filter(msg => !msg.isSentByMe).length
      : (resources && resources.length)
        ? resources.reduce((s, r) => s + (r.messagesCount || 0), 0)
        : 0;
    const totalBookings = (resources && resources.length)
      ? resources.reduce((s, r) => s + (r.bookings || 0), 0)
      : 0;

    if (!totalViews && !totalContacts && !totalBookings) return [];

    const weeks = [];
    for (let i = 0; i < 4; i++) {
      weeks.push({
        date: `Week ${i + 1}`,
        views: Math.round(totalViews / 4),
        contacts: Math.round(totalContacts / 4),
        bookings: Math.round(totalBookings / 4)
      });
    }
    return weeks;
  };

  const generateQuarterlyData = (resources, inboxMessages = []) => {
    const months = ['Month 1', 'Month 2', 'Month 3'];
    const totalViews = (resources && resources.length)
      ? resources.reduce((s, r) => s + (r.viewsCount || 0), 0)
      : 0;
    const totalContacts = inboxMessages.length > 0
      ? inboxMessages.filter(msg => !msg.isSentByMe).length
      : (resources && resources.length)
        ? resources.reduce((s, r) => s + (r.messagesCount || 0), 0)
        : 0;
    const totalBookings = (resources && resources.length)
      ? resources.reduce((s, r) => s + (r.bookings || 0), 0)
      : 0;

    if (!totalViews && !totalContacts && !totalBookings) return [];

    return months.map((month) => ({
      date: month,
      views: Math.round(totalViews / 3),
      contacts: Math.round(totalContacts / 3),
      bookings: Math.round(totalBookings / 3)
    }));
  };

  const handleStatusChange = async (resourceSlug, currentStatus, newStatus) => {
    try {
      if (currentStatus === 'accepted' || currentStatus === 'ACCEPTED') {
        alert('Cannot change status of an accepted resource');
        return;
      }

      const endpoint = newStatus === 'ACTIVE'
        ? API_ENDPOINTS.RESOURCES.ACTIVATE(resourceSlug)
        : API_ENDPOINTS.RESOURCES.DEACTIVATE(resourceSlug);

      await api.request(endpoint, { method: 'PATCH' });
      await loadProviderData();

      alert(`Resource ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      console.error('Failed to change status:', err);
      alert('Failed to change resource status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditListing = (resourceSlug) => {
    navigate(`/edit-resource/${resourceSlug}`);
  };

  const handleDeleteResource = async (resourceSlug) => {
    if (!window.confirm('Are you sure you want to permanently delete this resource?')) {
      return;
    }

    try {
      await api.request(
        API_ENDPOINTS.RESOURCES.DELETE_PERMANENT(resourceSlug),
        { method: 'DELETE' }
      );

      await loadProviderData();
      alert('Resource deleted successfully!');
    } catch (err) {
      console.error('Failed to delete resource:', err);
      alert('Failed to delete resource: ' + err.message);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.post(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));
      // Optimistically update conversations
      setConversations(prev =>
        prev.map(conv => {
          const updatedMessages = conv.messages.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          );
          const unreadCount = updatedMessages.filter(m => !m.isRead && !m.isSentByMe).length;
          return { ...conv, messages: updatedMessages, unreadCount };
        })
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleReplyToMessage = (messageId) => {
    // Logic to find message in conversations if needed, but reply modal might need adjustment
    // For now, finding in flattened messages if we kept them, or searching through conversations
    let message = null;
    for (const conv of conversations) {
      message = conv.messages.find(m => m.id === messageId);
      if (message) break;
    }
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const handlePreviewResource = (resourceSlug) => {
    const resource = myResources.find(r =>
      r.resourceName === resourceSlug ||
      r.slug === resourceSlug ||
      String(r.id) === String(resourceSlug)
    );
    if (resource) {
      setPreviewResource(resource);
    } else {
      console.warn('Resource not found for preview:', resourceSlug);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper to get category name (handles both string and object)
  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') return category.name || 'Uncategorized';
    return category;
  };

  const handleMessagesRead = (messageIds) => {
    setConversations(prev =>
      prev.map(conv => {
        const updatedMessages = conv.messages.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        );
        const unreadCount = updatedMessages.filter(m => !m.isRead && !m.isSentByMe).length;
        return { ...conv, messages: updatedMessages, unreadCount };
      })
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'listings', label: 'My Listings', icon: 'List' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare', badge: conversations.reduce((acc, conv) => acc + conv.unreadCount, 0) }
  ];

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
            onClick={loadProviderData}
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profile?.logo ? (
                  <img
                    src={user.profile.logo}
                    alt={user.organizationName || 'Logo'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-semibold text-lg">
                    {(user?.organizationName || user?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {user?.organizationName || user?.username}
                </h1>
                
              </div>
            </div>

            {/* Center - Find Resources Button */}
            <button
              onClick={() => navigate('/resources')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Search className="h-4 w-4" />
              Find Resources
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/profile-settings')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || user?.organizationName || user?.username}!
              </h1>
              <p className="text-gray-600">
                Manage your resources and connect with community members seeking assistance.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/create-resource')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <span>+</span>
                Create Resource
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <MetricsPanel metrics={metrics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resource Listings - First 2 resources with See More button */}
                <div>
                  <ResourceListingsTable
                    listings={myResources.slice(0, 2).map(r => ({
                      id: r.id,
                      title: r.title,
                      category: getCategoryName(r.categoryName),
                      status: (r.status || 'unknown').toLowerCase(),
                      location: r.fullAddress || `${r.street || ''}, ${r.city || ''}, ${r.postalCode || ''}`.trim(),
                      views: r.viewsCount || 0,
                      inquiries: r.totalRatings || 0,
                      unreadInquiries: 0,
                      createdAt: r.createdAt,
                      resourceSlug: r.resourceName || r.slug || r.id
                    }))}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteResource}
                    onPreview={handlePreviewResource}
                  />
                  {myResources.length > 2 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setActiveTab('listings')}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      >
                        See More Resources →
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <DashboardMessagesPreview
                  conversations={conversations.slice(0, 5)}
                  onConversationClick={(conv) => {
                    setSelectedConversationId(conv.id);
                    setActiveTab('messages');
                    }}
                  />
                  </div>
                </>
                )}

                {activeTab === 'listings' && (
                <ResourceListingsTable
                  listings={myResources.map(r => ({
                  id: r.id,
                  title: r.title,
                  category: getCategoryName(r.categoryName),
                  status: (r.status || 'unknown').toLowerCase(),
                  location: r.fullAddress || `${r.street || ''}, ${r.city || ''}, ${r.postalCode || ''}`.trim(),
                  views: r.viewsCount || 0,
                  inquiries: r.totalRatings || 0,
                  unreadInquiries: 0,
                  createdAt: r.createdAt,
                  resourceSlug: r.resourceName || r.slug || r.id
                  }))}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditListing}
                  onDelete={handleDeleteResource}
                  onPreview={handlePreviewResource}
                />
                )}

                {activeTab === 'messages' && (
                <ProviderMessagesPage
                  onMessagesRead={handleMessagesRead}
                  initialConversationId={selectedConversationId}
                />
                )}
               
                {activeTab === 'analytics' && (
                <AnalyticsOverview metrics={metrics} analyticsData={analyticsData} />
                )}
                
              </div>
              </div>

              {/* Reply Modal */}
              {showReplyModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={() => { setShowReplyModal(false); setSelectedMessage(null); }}
          ></div>
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Reply to Message</h2>
            <p className="text-gray-700 mb-4">
              {selectedMessage
                ? selectedMessage.subject || selectedMessage.preview || selectedMessage.body || 'No message content available.'
                : 'No message selected.'}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setShowReplyModal(false); setSelectedMessage(null); }}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
              <button
                onClick={() => { alert('Reply feature coming soon'); }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Preview Modal */}
      <ResourcePreviewModal
        isOpen={!!previewResource}
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  );
};

export default ProviderDashboard;