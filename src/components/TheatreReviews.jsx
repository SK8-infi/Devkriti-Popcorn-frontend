import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User, Shield, Award, Crown, Eye, MessageSquare, X } from 'lucide-react';
import TheatreResponseForm from './TheatreResponseForm';

const TheatreReviews = ({ theatreId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    rating: '',
    verified: false,
    badge: 'all'
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [theatreId, page, sortBy, filters]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        sort: sortBy,
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.verified && { verified: 'true' }),
        ...(filters.badge !== 'all' && { badge: filters.badge })
      });

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/reviews/theatre/${theatreId}?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(page === 1 ? data.reviews : [...reviews, ...data.reviews]);
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, helpful: data.helpful }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
  };

  const handleTheatreResponse = async (reviewId, content) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowResponseForm(false);
        setSelectedReview(null);
        // Refresh reviews to show updated response
        setPage(1);
        fetchReviews();
      } else {
        alert(data.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response');
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'verified':
        return <Shield size={14} className="text-blue-400" />;
      case 'frequent':
        return <Award size={14} className="text-green-400" />;
      case 'expert':
        return <Crown size={14} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getBadgeText = (badge) => {
    switch (badge) {
      case 'verified':
        return 'Verified Reviewer';
      case 'frequent':
        return 'Frequent Reviewer';
      case 'expert':
        return 'Expert Reviewer';
      default:
        return '';
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="theatre-reviews text-white">
      <div className="reviews-header mb-6">        
        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Sort */}
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>

          {/* Rating Filter */}
          <select 
            value={filters.rating} 
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>

          {/* Badge Filter */}
          <select 
            value={filters.badge} 
            onChange={(e) => handleFilterChange('badge', e.target.value)}
            className="px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
          >
            <option value="all">All Reviewers</option>
            <option value="verified">Verified Reviewers</option>
            <option value="frequent">Frequent Reviewers</option>
            <option value="expert">Expert Reviewers</option>
          </select>

          {/* Verified Filter */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.checked)}
              className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
            />
            <span className="text-sm">Verified Only</span>
          </label>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No reviews found. Be the first to review this theatre!
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-3">Customer Reviews (Click to view details)</h4>
          <div className="space-y-3">
          {reviews.map(review => (
            <div 
              key={review._id} 
              className="review-card bg-black p-4 rounded-md cursor-pointer hover:bg-gray-900 transition-colors border border-gray-700"
              onClick={() => handleViewReview(review)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {review.reviewerBadge !== 'none' && `(${review.reviewerBadge})`}
                  </span>
                  <span className="text-sm font-medium text-white">{review.user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye size={14} className="text-blue-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300 font-semibold">{review.title}</p>
              {review.theatreResponse && (
                <div className="mt-2 text-xs text-yellow-400">
                  Theatre has responded
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(page + 1)}
            className="load-more-btn bg-primary hover:bg-primary/80 text-black font-bold py-3 px-8 rounded-lg transition duration-300"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Load More Reviews
          </button>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Review Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Review Content */}
              <div className="space-y-6">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{selectedReview.user?.name || 'Anonymous'}</h4>
                      {selectedReview.reviewerBadge !== 'none' && (
                        <div className="flex items-center gap-1">
                          {getBadgeIcon(selectedReview.reviewerBadge)}
                          <span className="text-xs text-gray-400">{getBadgeText(selectedReview.reviewerBadge)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= selectedReview.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(selectedReview.visitDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!selectedReview.theatreResponse && (
                      <button
                        onClick={() => setShowResponseForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-black font-bold rounded-lg transition duration-300"
                        style={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <MessageSquare size={16} />
                        Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Review Title and Content */}
                <div>
                  <h5 className="text-xl font-semibold text-white mb-3">{selectedReview.title}</h5>
                  <p className="text-gray-300 leading-relaxed mb-4">{selectedReview.content}</p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedReview.pros && selectedReview.pros.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-green-400 mb-2">Pros:</h6>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {selectedReview.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedReview.cons && selectedReview.cons.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-red-400 mb-2">Cons:</h6>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {selectedReview.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Theatre Response */}
                {selectedReview.theatreResponse && (
                  <div className="bg-black p-4 rounded-lg border border-gray-600"
                    style={{
                      borderLeft: '4px solid #FFD6A0'
                    }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium" style={{ color: '#FFD6A0' }}>Theatre Response</span>
                      <span className="text-xs text-gray-400">
                        {new Date(selectedReview.theatreResponse.respondedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{selectedReview.theatreResponse.content}</p>
                  </div>
                )}

                {/* Review Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleHelpful(selectedReview._id)}
                    className="helpful-btn flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 rounded-lg transition-colors text-sm border border-gray-600"
                  >
                    <ThumbsUp size={14} />
                    Helpful ({selectedReview.helpful?.length || 0})
                  </button>
                  <span className="text-xs text-gray-400">
                    Posted on {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Form Modal */}
      {showResponseForm && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}>
            <TheatreResponseForm
              reviewId={selectedReview._id}
              onResponse={handleTheatreResponse}
              onCancel={() => setShowResponseForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TheatreReviews; 