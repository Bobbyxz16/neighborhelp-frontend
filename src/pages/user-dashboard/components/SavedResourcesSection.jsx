// pages/user-dashboard/components/SavedResourcesSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/ui-components/Button';
import { MapPin, Star, Phone, Eye, Trash2, Edit, Power, PowerOff } from 'lucide-react';
import ResourcePreviewModal from './ResourcePreviewModal';

const SavedResourcesSection = ({
  resources = [],
  title = "My Resources",
  emptyMessage = "No resources found.",
  onAction,
  showActions = true,
  showFilters = true,
  showViewAll = true,
  viewAllTo = "/my-resources",
  viewAllLabel = "View All My Resources"
}) => {
  const [filter, setFilter] = useState('all');
  const [previewResource, setPreviewResource] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2); // Show 2 by default

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  const filteredResources = filter === 'all'
    ? resources
    : resources.filter(r => r.status === filter);

  const visibleResources = filteredResources.slice(0, visibleCount);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostColor = (cost) => {
    switch (cost) {
      case 'FREE': return 'text-green-600 font-semibold';
      case 'LOW_COST': return 'text-blue-600';
      case 'VARIABLE': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handlePreview = (resource) => {
    setPreviewResource(resource);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewResource(null);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4); // Load 4 more at a time
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
          {title} ({filteredResources.length})
        </h2>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredResources.length === 0 ? (
        showActions ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">{emptyMessage}</p>
            <button
              onClick={() => { window.location.href = '/create-resource'; }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Resource
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visibleResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{resource.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{resource.city}, {resource.postalCode}</span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                    <span className={getCostColor(resource.cost)}>
                      {resource.cost.replace('_', ' ')}
                    </span>
                  </div>

                  {resource.averageRating > 0 && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                      <span>{resource.averageRating.toFixed(1)} ({resource.totalRatings} reviews)</span>
                    </div>
                  )}
                </div>

                {showActions && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(resource)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      onClick={() => onAction('edit', resource.slug)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    {resource.status === 'ACCEPTED' && (
                      resource.status === 'ACTIVE' ? (
                        <button
                          onClick={() => onAction('deactivate', resource.slug)}
                          className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                          title="Deactivate"
                        >
                          <PowerOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onAction('activate', resource.slug)}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          title="Activate"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )
                    )}

                    <button
                      onClick={() => onAction('delete', resource.slug)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>



          {/* View All Button (always shown if resources exist and viewAll enabled) */}
          {showViewAll && filteredResources.length > 0 && (
            <div className="mt-4 text-center">
              <Link to={viewAllTo}>
                <Button variant="ghost" iconName="Eye" iconPosition="left">
                  {viewAllLabel}
                </Button>
              </Link>
            </div>
          )}
        </>
      )}

      <ResourcePreviewModal
        resource={previewResource}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />
    </div>
  );
};

export default SavedResourcesSection;