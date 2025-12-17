// pages/provider-dashboard/components/ResourceListingsTable.jsx
import React, { useState } from 'react';
import { Edit, Power, PowerOff, Trash2, Eye, MessageSquare, MapPin } from 'lucide-react';

/**
 * ResourceListingsTable - Shows provider's resources from backend
 * 
 * Props:
 * - listings: Array of resources from GET /api/resources/my-resources
 * - onStatusChange: Callback to activate/deactivate resource
 * - onEdit: Callback to edit resource
 * - onDelete: Callback to delete resource
 * - onPreview: Callback to preview resource
 */
const ResourceListingsTable = ({ listings = [], onStatusChange, onEdit, onDelete, onPreview }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const normalizedCategory = (category || '').toLowerCase().replace(/ /g, '_');
    const icons = {
      food: '🍽️',
      health: '⚕️',
      legal: '⚖️',
      education: '📚',
      housing: '🏠',
      employment: '💼',
      mental_health: '🧠',
      clothing: '👕',
      transportation: '🚗'
    };

    return icons[normalizedCategory] || '📋';
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Yet</h3>
        <p className="text-gray-600 mb-4">
          Create your first resource to start helping your community!
        </p>
        <button
          onClick={() => window.location.href = '/create-resource'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Resource
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resource Listings</h2>
          <span className="text-sm text-gray-600">{listings.length} total</span>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {sortedListings.map((listing) => (
          <div key={listing.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCategoryIcon(listing.category)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={12} />
                    {listing.location}
                  </p>
                </div>
              </div>
              {getStatusBadge(listing.status)}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="capitalize">{listing.category?.replace(/_/g, ' ')}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye size={12} />
                  <span>{listing.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare size={12} />
                  <span>{listing.inquiries}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreview && onPreview(listing.resourceSlug)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                title="Preview"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onEdit(listing.resourceSlug)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Edit size={16} />
                Edit
              </button>
            
              <button
                onClick={() => onDelete(listing.resourceSlug)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Resource
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquiries
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedListings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(listing.category)}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {listing.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 capitalize">
                    {listing.category?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(listing.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Eye size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{listing.views}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{listing.inquiries}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPreview && onPreview(listing.resourceSlug)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(listing.resourceSlug)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(listing.resourceSlug)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceListingsTable;