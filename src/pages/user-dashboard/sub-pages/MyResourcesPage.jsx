// src/pages/user-dashboard/sub-pages/MyResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Power, PowerOff, ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/ui-components/Button';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const MyResourcesPage = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyResources();
    }, []);

    const fetchMyResources = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(API_ENDPOINTS.RESOURCES.MY_RESOURCES, {
                params: { sort: 'createdAt', direction: 'desc' }
            });

            let resourceList = [];
            if (Array.isArray(data)) {
                resourceList = data;
            } else if (data && Array.isArray(data.content)) {
                resourceList = data.content;
            } else if (data && Array.isArray(data.resources)) {
                resourceList = data.resources;
            } else {
                resourceList = [];
            }

            // Client-side sort to be safe
            resourceList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setResources(resourceList);
        } catch (err) {
            console.error('Failed to fetch resources:', err);
            setError('Failed to load your resources. Please try again.');
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, slug) => {
        try {
            switch (action) {
                case 'delete':
                    if (!window.confirm('Are you sure you want to delete this resource?')) return;
                    await api.delete(API_ENDPOINTS.RESOURCES.DELETE_PERMANENT(slug));
                    break;
                case 'activate':
                    await api.patch(API_ENDPOINTS.RESOURCES.ACTIVATE(slug));
                    break;
                case 'deactivate':
                    await api.patch(API_ENDPOINTS.RESOURCES.DEACTIVATE(slug));
                    break;
                default:
                    return;
            }
            fetchMyResources();
        } catch (err) {
            console.error('Action failed:', err);
            alert('Action failed. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'INACTIVE': return 'bg-gray-100 text-gray-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your resources...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/user-dashboard')}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-200"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">My Resources</h1>
                    </div>
                    <p className="text-gray-600">Manage all resources you've created</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {resources.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-border">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
                        <p className="text-gray-600 mb-6">You haven’t created any resources.</p>
                        <Button asChild>
                            <Link to="/create-resource">Create Your First Resource</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {resources.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-gray-50">
                                            {/* Resource: Title only, no description */}
                                            <td className="px-4 py-3 whitespace-nowrap max-w-xs">
                                                <div className="font-medium text-gray-900 truncate" title={resource.title}>
                                                    {resource.title}
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                <span className="truncate" title={resource.categoryName || resource.category}>
                                                    {resource.categoryName || resource.category || '—'}
                                                </span>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                <span className="truncate" title={`${resource.city}, ${resource.postalCode}`}>
                                                    {resource.city}{resource.postalCode ? `, ${resource.postalCode}` : ''}
                                                </span>
                                            </td>

                                            {/* Views */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                {resource.viewsCount || 0}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(resource.status)}`}>
                                                    {resource.status || '—'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    {/* View */}
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link to={`/resources/${resource.slug}`} target="_blank" title="View resource">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>

                                                    {/* Edit */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/edit-resource/${resource.slug}`)}
                                                        title="Edit resource"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>

                                                    {/* Delete */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-700 hover:bg-red-100"
                                                        onClick={() => handleAction('delete', resource.slug)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyResourcesPage;
