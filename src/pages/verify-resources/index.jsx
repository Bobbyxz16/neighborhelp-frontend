import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { API_BASE_URL } from '../../utils/constants';
import { API_ENDPOINTS } from '../../utils/constants';
import Icon from '../../components/ui/AppIcon';
import Button from '../../components/ui/ui-components/Button';

const VerifyResources = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPendingResources();
    }, []);

    const fetchPendingResources = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(API_ENDPOINTS.RESOURCES.PENDING);
            setResources(Array.isArray(data) ? data : (data?.content || []));
            setError(null);
        } catch (err) {
            console.error('Error fetching pending resources:', err);
            setError('Failed to load pending resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (slug) => {
        if (!confirm('Are you sure you want to approve this resource?')) return;

        try {
            setProcessingId(slug);
            console.log('Approving resource:', slug);
            const url = API_ENDPOINTS.RESOURCES.APPROVE(encodeURIComponent(slug));
            console.log('Request URL:', url);

            await api.patch(url);
            // Remove from list
            setResources(prev => prev.filter(r => r.slug !== slug));
            alert('Resource approved successfully');
        } catch (err) {
            console.error('Error approving resource:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to approve resource';
            alert(`Error: ${errorMessage}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (slug) => {
        const reason = prompt('Please enter a reason for rejection:');
        if (reason === null) return; // Cancelled

        try {
            setProcessingId(slug);
            console.log('Rejecting resource:', slug);
            const url = API_ENDPOINTS.RESOURCES.REJECT(encodeURIComponent(slug));
            console.log('Request URL:', url);

            await api.patch(url, { reason });
            // Remove from list
            setResources(prev => prev.filter(r => r.slug !== slug));
            alert('Resource rejected successfully');
        } catch (err) {
            console.error('Error rejecting resource:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to reject resource';
            alert(`Error: ${errorMessage}`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Verify Resources</h1>
                        <p className="mt-2 text-gray-600">Review and approve pending resource submissions</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/admin-panel')}>
                        Back to Admin Panel
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Icon name="AlertTriangle" className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {resources.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                        <p className="mt-2 text-gray-500">There are no pending resources to verify at this time.</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={fetchPendingResources}
                        >
                            Refresh List
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => {
                            // Helper to get display image
                            const displayImage = (resource.images && resource.images.length > 0)
                                ? resource.images[0].url
                                : (Array.isArray(resource.imageUrl) && resource.imageUrl.length > 0)
                                    ? resource.imageUrl[0]
                                    : resource.imageUrl;

                            // Helper to get user avatar
                            const userImage = resource.user?.organizationName
                                ? (resource.user?.profile?.logo || resource.user?.logo)
                                : (resource.user?.profile?.avatar || resource.user?.avatar);

                            const userDisplayName = resource.user?.organizationName || resource.user?.username || resource.providerName || 'Unknown Provider';

                            const userAvatarSrc = userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&size=120&background=${resource.user?.organizationName ? '10b981' : '4f46e5'}&color=fff`;

                            return (
                                <div key={resource.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col">
                                    {/* Image Thumbnail */}
                                    <div className="h-48 w-full bg-gray-100 relative">
                                        {displayImage ? (
                                            <img
                                                src={displayImage}
                                                alt={resource.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <Icon name="Image" size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 capitalize shadow-sm">
                                                {resource.categoryName || resource.category || 'Uncategorized'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 mr-2">
                                                    {resource.title}
                                                </h3>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${resource.cost === 'FREE' ? 'bg-green-100 text-green-800' :
                                                    resource.cost === 'LOW_COST' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {resource.cost === 'FREE' ? 'Free' :
                                                        resource.cost === 'LOW_COST' ? 'Low Cost' :
                                                            resource.cost === 'VARIES' ? 'Varies' : resource.cost}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Submitted: {new Date(resource.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {resource.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2 mb-6 flex-1">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <img
                                                    src={userAvatarSrc}
                                                    alt={userDisplayName}
                                                    className="w-6 h-6 rounded-full object-cover mr-2 flex-shrink-0"
                                                />
                                                <span className="truncate">
                                                    By {userDisplayName}
                                                </span>
                                            </div>

                                            <div className="flex items-start text-sm text-gray-500">
                                                <Icon name="MapPin" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">
                                                    {[
                                                        resource.street,
                                                        resource.city,
                                                        resource.postalCode
                                                    ].filter(Boolean).join(', ') || resource.location?.address || resource.city || 'No location provided'}
                                                </span>
                                            </div>

                                            {resource.availability && (
                                                <div className="flex items-start text-sm text-gray-500">
                                                    <Icon name="Clock" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">
                                                        {resource.availability}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex gap-3 mb-3">
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleApprove(resource.slug)}
                                                    disabled={processingId === resource.slug}
                                                >
                                                    {processingId === resource.slug ? 'Processing...' : 'Approve'}
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                                    onClick={() => handleReject(resource.slug)}
                                                    disabled={processingId === resource.slug}
                                                >
                                                    Reject
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                className="w-full text-sm"
                                                onClick={() => navigate(`/resources/${resource.slug}`)}
                                            >
                                                View Full Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyResources;
