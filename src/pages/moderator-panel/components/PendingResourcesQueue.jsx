import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import { API_BASE_URL, API_ENDPOINTS, getRelativeTime } from '../../../utils/constants';

const PendingResourcesQueue = ({ onApprove, onReject }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const getCostDisplay = (cost, price = null) => {
    switch (cost) {
      case 'FREE':
        return 'Free';
      case 'LOW_COST':
        return 'Low Cost';
      case 'VARIES':
        return 'Varies';
      case 'FIXED_FEE':
        return price ? `$${price}` : 'Fixed Fee';
      default:
        return cost || 'Free';
    }
  };

  const loadResources = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const params = new URLSearchParams({
        page: currentPage,
        size: 20,
        sort: 'createdAt,desc'
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        statusFilter === 'PENDING'
          ? `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.PENDING}?${params}`
          : `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.ADMIN_OVERVIEW}?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResources(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  const normalizeImages = (resource) => {
    if (!resource) return [];
    if (resource.imageUrl && Array.isArray(resource.imageUrl) && resource.imageUrl.length > 0) {
      return resource.imageUrl;
    }
    if (resource.images && Array.isArray(resource.images) && resource.images.length > 0) {
      return resource.images.map(img => typeof img === 'string' ? img : img.url || img);
    }
    if (Array.isArray(resource.imageUrl)) {
      return resource.imageUrl;
    }
    if (resource.imageUrl) {
      return [resource.imageUrl];
    }
    return [];
  };

  const getProviderName = (resource) => {
    return resource?.user?.organizationName || resource?.user?.username || resource?.displayName || resource?.username || 'Unknown';
  };

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': 'Utensils',
      'Housing': 'Home',
      'Legal': 'Scale',
      'Mental Health': 'Heart',
      'Employment': 'Briefcase',
      'Healthcare': 'Heart',
      'Education': 'GraduationCap',
      'Transportation': 'Car'
    };
    return iconMap[category] || 'HelpCircle';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      'ACTIVE': { label: 'Active', color: 'bg-green-100 text-green-800' },
      'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      'INACTIVE': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleApprove = (resource) => {
    onApprove(resource.slug);
    setSelectedResource(null);
  };

  const handleReject = () => {
    if (selectedResource && rejectReason) {
      onReject(selectedResource.slug, rejectReason);
      setShowRejectModal(false);
      setSelectedResource(null);
      setRejectReason('');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading pending resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Resource Review Queue</h2>
        <div className="flex items-center space-x-2">
          <select 
            className="border border-border rounded-lg px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={loadResources}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">No pending resources to review at the moment.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-elevation-1 border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon 
                            name={getCategoryIcon(resource.categoryName)} 
                            size={16} 
                            className="text-primary" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {resource.username || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">{resource.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(new Date(resource.createdAt).getTime())}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(resource.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => setSelectedResource(resource)}
                          title="View Details"
                        />
                        {resource.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Check"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(resource)}
                              title="Approve"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="X"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedResource(resource);
                                setShowRejectModal(true);
                              }}
                              title="Reject"
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Header with Blue Background */}
            <div className="bg-blue-600 text-white px-6 py-3 rounded-t-2xl">
              <p className="text-sm font-medium">Resource Review for Moderation</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              aria-label="Close"
            >
              <Icon name="X" size={20} className="text-gray-600" />
            </button>

            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedResource.title}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {selectedResource.categoryName}
                      </span>
                      {getStatusBadge(selectedResource.status)}
                    </div>
                  </div>
                </div>

                {/* Image */}
                {normalizeImages(selectedResource).length > 0 && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src={normalizeImages(selectedResource)[0]}
                      alt={selectedResource.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedResource.description}
                </p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="MapPin" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-sm text-gray-600">
                      {selectedResource.fullAddress || `${selectedResource.city || 'Not specified'}${selectedResource.postalCode ? ', ' + selectedResource.postalCode : ''}`}
                    </p>
                  </div>
                </div>

                {/* Cost/Price from API */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="DollarSign" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Cost</h3>
                    <p className="text-sm text-gray-600">
                      {getCostDisplay(selectedResource.cost, selectedResource.price)}
                    </p>
                  </div>
                </div>

                {/* Submitted Date */}
                {selectedResource.createdAt && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="Clock" size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Submitted</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedResource.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Images Count */}
                {normalizeImages(selectedResource).length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="Images" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Photos</h3>
                      <p className="text-sm text-gray-600">
                        {normalizeImages(selectedResource).length} image{normalizeImages(selectedResource).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* All Images Gallery */}
              {normalizeImages(selectedResource).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {normalizeImages(selectedResource).map((img, idx) => (
                      <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <img
                          src={img}
                          alt={`Resource ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Provider Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="User" size={20} className="text-blue-600" />
                  Provider Information
                </h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold text-gray-900">Name:</span> {getProviderName(selectedResource)}</p>
                  <p><span className="font-semibold text-gray-900">Email:</span> {selectedResource.email || 'Not provided'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedResource.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleApprove(selectedResource);
                      setSelectedResource(null);
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setShowRejectModal(true)}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Reject Resource</h3>
            <textarea
              className="w-full p-3 border border-border rounded-lg mb-4"
              rows="4"
              placeholder="Please explain the reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleReject}
                disabled={!rejectReason}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingResourcesQueue;