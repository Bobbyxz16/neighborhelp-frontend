import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import ReportModal from '../../../components/ui/ReportModal';
import { API_BASE_URL, API_ENDPOINTS } from '../../../utils/constants';

const ResourceReviewsSection = ({ resourceSlug }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: '',
    severity: 'MEDIUM',
    description: ''
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!resourceSlug) return;
    try {
      setLoading(true);
      setError(null);

      // The endpoint returns both ratings and summary in one object
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RATINGS.BY_RESOURCE(resourceSlug)}`);

      if (response.ok) {
        const data = await response.json();
        // Map the API response to our internal structure if necessary, or use directly
        // API returns: { ratings: [...], summary: {...}, ... }
        setReviews(data.ratings || []);
        setSummary(data.summary || null);
      } else {
        setError('Failed to load reviews');
      }
    } catch (e) {
      console.error('Error loading reviews:', e);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [resourceSlug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filters = [
    { id: 'all', label: 'All Reviews', count: summary?.totalRatings || 0 },
    { id: '5', label: '5 Stars', count: summary?.fiveStarCount || 0 },
    { id: '4', label: '4 Stars', count: summary?.fourStarCount || 0 },
    { id: '3', label: '3 Stars', count: summary?.threeStarCount || 0 },
    // The API example didn't explicitly show verified count in summary, so we filter locally or omit if not available
    { id: 'verified', label: 'Verified', count: reviews?.filter(r => r?.verified)?.length || 0 }
  ];

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews?.filter(review => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'verified') return review?.verified;
      return review?.rating === parseInt(activeFilter);
    }) || [];

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  const filteredReviews = getFilteredAndSortedReviews();
  const averageRating = summary?.averageRating || 0;

  const handleSubmitReview = async (e) => {
    e?.preventDefault();
    if (!resourceSlug) return;
    if (!newReview?.comment?.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login to submit a review');
        return;
      }

      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RATINGS.CREATE(resourceSlug)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newReview?.rating, comment: newReview?.comment })
      });

      if (res.ok) {
        setNewReview({ rating: 5, comment: '' });
        setShowWriteReview(false);
        await loadReviews();
      } else {
        alert('Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Error submitting review');
    }
  };

  const handleMarkHelpful = async (ratingId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login to mark helpful');
        return;
      }
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RATINGS.MARK_HELPFUL(ratingId)}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === ratingId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
      }
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  };

  const handleReport = (reviewId) => {
    setReportingReviewId(reviewId);
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
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          commentId: reportingReviewId,
          reportType: reportForm.reportType,
          severity: reportForm.severity,
          description: reportForm.description
        })
      });

      if (response.ok) {
        alert('Thank you for your report. We will review this review.');
        setShowReportModal(false);
        setReportForm({ reportType: '', severity: 'MEDIUM', description: '' });
        setReportingReviewId(null);
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

  const renderStars = (rating, size = 16) => {
    return Array?.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={size}
        className={`${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Reviews & Ratings</h3>
          <p className="text-sm text-gray-500 mt-1">See what others are saying about this resource</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowWriteReview(!showWriteReview)}
          iconName="Edit"
          iconPosition="left"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          Write a Review
        </Button>
      </div>

      {loading && (
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading reviews...
        </div>
      )}

      {!loading && (
        <div className="p-6">
          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-center md:text-left min-w-[140px]">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating?.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start mb-2 space-x-1">
                {renderStars(Math.round(averageRating), 20)}
              </div>
              <div className="text-sm font-medium text-gray-500">
                Based on {summary?.totalRatings || 0} reviews
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              {[5, 4, 3, 2, 1]?.map(star => {
                // Use counts from summary if available
                let count = 0;
                if (summary) {
                  if (star === 5) count = summary.fiveStarCount;
                  else if (star === 4) count = summary.fourStarCount;
                  else if (star === 3) count = summary.threeStarCount;
                  else if (star === 2) count = summary.twoStarCount;
                  else if (star === 1) count = summary.oneStarCount;
                } else {
                  count = reviews?.filter(r => r?.rating === star)?.length;
                }

                const total = summary?.totalRatings || reviews?.length || 1;
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3 mb-2 last:mb-0">
                    <span className="text-sm font-medium text-gray-600 w-3">{star}</span>
                    <Icon name="Star" size={14} className="text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Form */}
          {showWriteReview && (
            <div className="mb-10 p-6 border border-blue-100 rounded-xl bg-blue-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="MessageSquare" size={18} className="text-blue-600" />
                Share Your Experience
              </h4>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5]?.map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Icon
                          name="Star"
                          size={28}
                          className={`${star <= newReview?.rating
                            ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-400'
                            } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {newReview.rating === 5 ? 'Excellent' :
                        newReview.rating === 4 ? 'Good' :
                          newReview.rating === 3 ? 'Average' :
                            newReview.rating === 2 ? 'Poor' : 'Terrible'}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview?.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e?.target?.value })}
                    placeholder="Tell us about your experience with this resource..."
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowWriteReview(false)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Controls: Filters & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters?.map(filter => (
                <button
                  key={filter?.id}
                  onClick={() => setActiveFilter(filter?.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === filter?.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  {filter?.label} <span className="opacity-75 ml-1">({filter?.count || 0})</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-100"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews?.map(review => (
              <div key={review?.id} className="group">
                <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {review?.userAvatar || review?.profile?.avatar || review?.profile?.logo ? (
                      <img
                        src={review?.userAvatar || review?.profile?.avatar || review?.profile?.logo}
                        alt={review?.displayName || review?.userName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm">
                        {/* Show icon based on user type (organization vs individual) */}
                        {review?.type === 'ORGANIZATION' ? (
                          <Icon name="Building" size={20} className="text-blue-600" />
                        ) : (
                          <Icon name="User" size={20} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review?.displayName || review?.userName || 'Anonymous User'}</h4>
                        {review?.verified && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                            <Icon name="CheckCircle" size={10} />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(review?.rating, 14)}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">
                      {review?.comment}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleMarkHelpful(review?.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors group/btn"
                      >
                        <Icon name="ThumbsUp" size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Helpful ({review?.helpfulCount || 0})
                      </button>
                      <button
                        onClick={() => handleReport(review?.id)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gray-100 mt-6 group-last:hidden"></div>
              </div>
            ))}

            {filteredReviews?.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <Icon name="MessageSquare" size={24} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  {activeFilter !== 'all'
                    ? `No reviews match the "${filters.find(f => f.id === activeFilter)?.label}" filter.`
                    : "Be the first to share your experience with this resource!"}
                </p>
                {activeFilter !== 'all' && (
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportForm({ reportType: '', severity: 'MEDIUM', description: '' });
          setReportingReviewId(null);
        }}
        onSubmit={handleSubmitReport}
        isSubmitting={isSubmittingReport}
        reportForm={reportForm}
        setReportForm={setReportForm}
        title="Report Review"
        description="Help us maintain quality by reporting issues with this review. Your report will be reviewed by our team."
        targetType="COMMENT"
      />
    </div>
  );
};
    
     export default ResourceReviewsSection;