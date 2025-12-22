import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import Icon from '../../components/ui/AppIcon';
import Button from '../../components/ui/ui-components/Button';
import ResourceOwnerProfile from './componets/ResourceOwnerProfile';
import ResourceContactSection from './componets/ResourceContactSection';
import ResourceInfoSection from './componets/ResourceInfoSection';
import ResourceLocationSection from './componets/ResourceLocationSection';
import ResourceReviewsSection from './componets/ResourceReviewsSection';
import ResourceGallerySection from './componets/ResourceGallerySection';
import ResourceSkeleton from './componets/ResourceSkeleton';
import defaultResources from '../../utils/defaultResources';

import { API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';
import SEO from '../../components/SEO/SEO';

const ResourceDetails = ({ mode = 'view' }) => {
  const params = useParams();
  const location = useLocation();
  const resourceName = params.resourceName;
  const resourceId = params.id;
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: '',
    severity: 'MEDIUM',
    description: ''
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const checkIfSaved = useCallback(async (slug) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.IS_SAVED(slug)}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  }, []);

  const loadResourceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');

      // 1. Try finding in defaultResources first (Local Data override)
      let foundLocal = null;
      if (resourceId) {
        foundLocal = defaultResources.find(r => r.id === parseInt(resourceId) || r.id === resourceId);
      } else if (resourceName) {
        foundLocal = defaultResources.find(r => r.slug === resourceName);
      }

      if (foundLocal) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setResource({ ...foundLocal, isDefaultResource: true });
        setLoading(false);
        return;
      }

      // 2. Fallback to API logic if not found locally
      let url;
      let cacheKey;

      if (mode === 'preview' && resourceId) {
        url = `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.BY_ID(resourceId)}`;
        cacheKey = `resource_preview_${resourceId}`;
      } else if (location.state?.id) {
        url = `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.BY_ID(location.state.id)}`;
        cacheKey = `resource_${location.state.id}`;
      } else {
        url = `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.BY_SLUG(resourceName)}`;
        cacheKey = `resource_${resourceName}`;
      }

      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            setResource(data);
            if (token && data.slug) checkIfSaved(data.slug);
            setLoading(false);
            return;
          }
        } catch (e) {
          sessionStorage.removeItem(cacheKey);
        }
      }

      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        if (response.status === 404 && !resourceId && !location.state?.id && token) {
          try {
            const pendingResponse = await fetch(
              `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.PENDING}?size=100`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (pendingResponse.ok) {
              const pendingData = await pendingResponse.json();
              const pendingList = pendingData.content || pendingData || [];
              const found = pendingList.find(r => r.slug === resourceName);

              if (found) {
                const idResponse = await fetch(
                  `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.BY_ID(found.id)}`,
                  { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (idResponse.ok) {
                  const resourceData = await idResponse.json();
                  setResource(resourceData);
                  sessionStorage.setItem(cacheKey, JSON.stringify({ data: resourceData, timestamp: Date.now() }));
                  if (resourceData.slug) checkIfSaved(resourceData.slug);
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (fallbackErr) {
            console.warn('Fallback fetch failed:', fallbackErr);
          }
        }

        setError(response.status === 404 ? 'Resource not found' : 'Failed to load resource');
        setLoading(false);
        return;
      }

      const resourceData = await response.json();
      setResource(resourceData);
      sessionStorage.setItem(cacheKey, JSON.stringify({ data: resourceData, timestamp: Date.now() }));
      if (token && resourceData.slug) checkIfSaved(resourceData.slug);

    } catch (error) {
      console.error('Error loading resource data:', error);
      setError('Failed to load resource');
    } finally {
      setLoading(false);
    }
  }, [resourceName, resourceId, mode, location.state, checkIfSaved]);

  useEffect(() => {
    loadUserData();
    loadResourceData();
  }, [loadUserData, loadResourceData]);

  useEffect(() => {
    if (resource?.title) {
      document.title = `${resource.title} | NeighborlyUnion`;
    } else {
      document.title = 'Resource Details | NeighborlyUnion';
    }
  }, [resource]);

  const normalizedImages = useMemo(() => {
    if (!resource) return [];
    if (resource.images && resource.images.length > 0) return resource.images;
    if (Array.isArray(resource.imageUrl)) {
      return resource.imageUrl.map(url => ({ url, alt: resource.title }));
    }
    if (resource.imageUrl) {
      return [{ url: resource.imageUrl, alt: resource.title }];
    }
    return [];
  }, [resource]);

  const mainImage = normalizedImages.find(img => img.isMain) || normalizedImages[0] || null;

  const handleSaveResource = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login to save resources');
        navigate('/login');
        return;
      }

      const endpoint = isSaved
        ? API_ENDPOINTS.RESOURCES.UNSAVE(resource.slug)
        : API_ENDPOINTS.RESOURCES.SAVE(resource.slug);

      const method = isSaved ? 'DELETE' : 'POST';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving/unsaving resource:', error);
      alert('Failed to update saved status');
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: resource?.title,
      text: `Check out this community resource: ${resource?.title}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackCopyToClipboard(shareUrl);
        }
      }
    } else {
      fallbackCopyToClipboard(shareUrl);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!reportForm.reportType || !reportForm.description.trim()) {
      alert('Please select a report type and provide a description.');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login to submit a report.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resourceId: resource.id,
          reportType: reportForm.reportType,
          severity: reportForm.severity,
          description: reportForm.description
        })
      });

      if (response.ok) {
        alert('Thank you for your report. We will review this resource.');
        setShowReportModal(false);
        setReportForm({ reportType: '', severity: 'MEDIUM', description: '' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return <ResourceSkeleton />;
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Icon name="Search" size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {error || 'Resource Not Found'}
            </h2>
            <p className="text-muted-foreground mb-8">
              The resource you're looking for might have been removed, renamed, or is temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/resources')} size="lg">
                Browse Resources
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Report type options - matching backend enum
  const reportTypes = [
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
    { value: 'INACCURATE_INFORMATION', label: 'Inaccurate Information' },
    { value: 'OUTDATED_INFORMATION', label: 'Outdated Information' },
    { value: 'SPAM_CONTENT', label: 'Spam Content' },
    { value: 'FRAUD', label: 'Fraud or Scam' },
    { value: 'DISCRIMINATION', label: 'Discrimination' },
    { value: 'PRIVACY_VIOLATION', label: 'Privacy Violation' },
    { value: 'OTHER', label: 'Other' }
  ];

  const severityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'HIGH', label: 'High', color: 'bg-red-100 text-red-700' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {resource && (
        <SEO
          title={`${resource.title} - ${resource.city} | NeighborlyUnion`}
          description={resource.description ? resource.description.substring(0, 155) : 'Find community resources on NeighborlyUnion'}
          keywords={`${resource.categoryName}, ${resource.city}, UK charity, free help, ${resource.title}`}
          url={`https://neighborlyunion.com/resources/${resource.slug}`}
          image={mainImage?.url || 'https://neighborlyunion.com/og-image.jpg'}
          type="article"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": resource.title,
            "description": resource.description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": resource.street,
              "addressLocality": resource.city,
              "postalCode": resource.postalCode,
              "addressCountry": "GB"
            },
            "telephone": resource.phone,
            "email": resource.email,
            "url": resource.websiteUrl,
            "image": normalizedImages.map(img => img.url),
            "priceRange": resource.cost === 'FREE' ? 'Free' : (resource.cost === 'LOW_COST' ? '$' : '$$'),
            ...(resource.averageRating > 0 && {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": resource.averageRating,
                "reviewCount": resource.reviewCount
              }
            })
          }}
        />
      )}
      <Header user={user} onLogout={handleLogout} />
      <main className="pt-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/resources')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Resources
              </button>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground font-medium">{resource?.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-foreground">{resource?.title}</h1>
                  {resource?.status === 'PENDING' && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      <Icon name="AlertTriangle" size={16} className="mr-1" />
                      Pending Approval
                    </div>
                  )}
                  {resource?.status === 'REJECTED' && (
                    <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                      <Icon name="XCircle" size={16} className="mr-1" />
                      Rejected
                    </div>
                  )}
                  {resource?.user?.verified && (
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <Icon name="CheckCircle" size={16} className="mr-1" />
                      Verified Provider
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="font-medium">
                    {resource?.user?.organizationName || resource?.user?.username}
                  </span>
                  {resource?.averageRating > 0 && (
                    <div className="flex items-center">
                      <Icon name="Star" size={16} className="text-yellow-500 mr-1" />
                      <span className="text-foreground font-medium">
                        {resource.averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({resource.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Icon name="MapPin" size={16} className="mr-1" />
                    <span>
                      {[resource?.street, resource?.city].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>

                {mainImage ? (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <img
                        src={mainImage.url}
                        alt={mainImage.alt || resource.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-gray-600">No image available</p>
                    <p className="text-foreground mt-2">{resource?.description}</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  iconName="Share"
                  iconPosition="left"
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReport}
                  iconName="Flag"
                  iconPosition="left"
                >
                  Report Issue
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-8">
              <ResourceInfoSection resource={resource} />
              <ResourceLocationSection resource={resource} />

              {normalizedImages.length > 0 && (
                <ResourceGallerySection images={normalizedImages} />
              )}

              <ResourceReviewsSection resourceSlug={resource?.slug} />
            </div>

            {/* Right Column - Contact & Quick Info */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                <ResourceOwnerProfile
                  identifier={resource?.user?.organizationName || resource?.user?.username}
                  city={resource?.city}
                />
                <ResourceContactSection resource={resource} />

                {/* Quick Info Card */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="text-foreground font-medium">{resource?.categoryName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="text-foreground font-medium">
                        {resource?.cost === 'FREE' ? 'Free' : resource?.cost === 'LOW_COST' ? 'Low Cost' : 'Variable'}
                      </span>
                    </div>
                    {resource?.capacity && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="text-foreground font-medium">{resource?.capacity} people</span>
                      </div>
                    )}
                    {resource?.updatedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-foreground font-medium">
                          {new Date(resource?.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Languages Supported */}
                {resource?.languages && resource.languages.trim() !== '' && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Languages Supported</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource?.languages.split(',').map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                        >
                          {language.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                {resource?.targetAudience && resource.targetAudience.trim() !== '' && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Target Audience</h3>
                    <p className="text-muted-foreground">{resource?.targetAudience}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NeighborlyUnion. Connecting communities, one resource at a time.
            </p>
          </div>
        </div>
      </footer>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Report Resource</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600">
                Help us maintain quality by reporting issues with this resource. Your report will be reviewed by our team.
              </p>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportForm.reportType}
                  onChange={(e) => setReportForm(prev => ({ ...prev, reportType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a reason...</option>
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <div className="flex gap-3">
                  {severityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setReportForm(prev => ({ ...prev, severity: option.value }))}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${reportForm.severity === option.value
                        ? `${option.color} border-current font-medium`
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please describe the issue in detail..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="4"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide as much detail as possible to help us investigate.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReportModal(false);
                  setReportForm({ reportType: '', severity: 'MEDIUM', description: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={!reportForm.reportType || !reportForm.description.trim() || isSubmittingReport}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;