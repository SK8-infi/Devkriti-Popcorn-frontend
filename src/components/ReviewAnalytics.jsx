import React, { useState, useEffect } from 'react';
import { Star, BarChart3, TrendingUp, Users, Award, Eye, MessageSquare, X, Calendar, Shield, Crown, ThumbsUp } from 'lucide-react';
import TheatreResponseForm from './TheatreResponseForm';

const ReviewAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [fullReviews, setFullReviews] = useState(new Map());

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/reviews/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullReview = async (theatreId, reviewId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/reviews/theatre/${theatreId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const fullReview = data.reviews.find(r => r._id === reviewId);
        if (fullReview) {
          setFullReviews(prev => new Map(prev.set(reviewId, fullReview)));
          return fullReview;
        }
      }
    } catch (error) {
      console.error('Error fetching full review:', error);
    }
    return null;
  };

  const handleViewReview = async (theatreId, review) => {
    // Check if we already have the full review
    if (fullReviews.has(review._id)) {
      setSelectedReview(fullReviews.get(review._id));
    } else {
      // Fetch the full review details
      const fullReview = await fetchFullReview(theatreId, review._id);
      if (fullReview) {
        setSelectedReview(fullReview);
      }
    }
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
        // Refresh analytics to show updated response
        fetchAnalytics();
      } else {
        alert(data.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'expert':
        return 'text-yellow-400';
      case 'frequent':
        return 'text-green-400';
      case 'verified':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No theatres found. You need to own theatres to view analytics.
      </div>
    );
  }

  return (
    <div className="review-analytics text-white p-6" style={{
      background: 'transparent'
    }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 size={24} className="text-yellow-400" />
        Review Analytics
      </h2>

      <div className="space-y-8">
        {analytics.map((theatreAnalytics) => (
          <div key={theatreAnalytics.theatre._id} className="theatre-analytics p-6 rounded-lg border border-gray-600/20" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <h3 className="text-xl font-semibold mb-4">{theatreAnalytics.theatre.name}</h3>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="stat-card p-4 rounded-md" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-400">Average Rating</span>
                </div>
                <div className={`text-2xl font-bold ${getRatingColor(theatreAnalytics.averageRating)}`}>
                  {theatreAnalytics.averageRating.toFixed(1)}
                </div>
              </div>

              <div className="stat-card p-4 rounded-md" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Total Reviews</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {theatreAnalytics.totalReviews}
                </div>
              </div>

              <div className="stat-card p-4 rounded-md" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm text-gray-400">5-Star Reviews</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {theatreAnalytics.ratingDistribution[5]}
                </div>
              </div>

              <div className="stat-card p-4 rounded-md" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-purple-400" />
                  <span className="text-sm text-gray-400">Expert Reviews</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {theatreAnalytics.badgeDistribution.expert}
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{rating}</span>
                      <Star size={12} className="text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ 
                          width: `${theatreAnalytics.totalReviews > 0 
                            ? (theatreAnalytics.ratingDistribution[rating] / theatreAnalytics.totalReviews) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-8 text-right">
                      {theatreAnalytics.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviewer Badge Distribution */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Reviewer Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getBadgeColor('expert')}`}>
                    {theatreAnalytics.badgeDistribution.expert}
                  </div>
                  <div className="text-sm text-gray-400">Expert</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getBadgeColor('frequent')}`}>
                    {theatreAnalytics.badgeDistribution.frequent}
                  </div>
                  <div className="text-sm text-gray-400">Frequent</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getBadgeColor('verified')}`}>
                    {theatreAnalytics.badgeDistribution.verified}
                  </div>
                  <div className="text-sm text-gray-400">Verified</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getBadgeColor('none')}`}>
                    {theatreAnalytics.badgeDistribution.none}
                  </div>
                  <div className="text-sm text-gray-400">Regular</div>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            {theatreAnalytics.recentReviews.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Recent Reviews (Click to view details)</h4>
                <div className="space-y-3">
                  {theatreAnalytics.recentReviews.map(review => (
                    <div 
                      key={review._id} 
                      className="p-3 rounded-md cursor-pointer transition-colors"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(127, 29, 29, 0.3)';
                        e.target.style.borderColor = 'rgba(127, 29, 29, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onClick={() => handleViewReview(theatreAnalytics.theatre._id, review)}
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
                        </div>
                        <div className="flex items-center gap-3">
                          <Eye size={14} className="text-blue-400" />
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{review.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{
            background: 'rgba(17, 24, 39, 0.9)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
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
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition-colors"
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
                  <div className="bg-gray-800 p-4 rounded-md border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-yellow-400">Theatre Response</span>
                      <span className="text-xs text-gray-400">
                        {new Date(selectedReview.theatreResponse.respondedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{selectedReview.theatreResponse.content}</p>
                  </div>
                )}

                {/* Review Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <ThumbsUp size={14} />
                    {selectedReview.helpful?.length || 0} people found this helpful
                  </span>
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
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

export default ReviewAnalytics; 