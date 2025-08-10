import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TheatreReviewForm from '../components/TheatreReviewForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const UserReviews = () => {
  const { user, isAuthenticated } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${editingReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowEditForm(false);
        setEditingReview(null);
        fetchUserReviews(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchUserReviews(); // Refresh the list
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to be logged in to view your reviews.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading your reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <div className="text-sm text-gray-400">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Reviews Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't written any reviews yet. Start reviewing theatres to see them here.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Browse Theatres
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{review.theatre.name}</h3>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-400">{review.theatre.city}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.visitDate).toLocaleDateString()}
                      </span>
                      {review.reviewerBadge !== 'none' && (
                        <span className={`text-xs ${getBadgeColor(review.reviewerBadge)}`}>
                          {getBadgeText(review.reviewerBadge)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setShowEditForm(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-red-950 rounded-md transition-colors text-sm"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mb-3">{review.title}</h4>
                <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>
                
                {review.pros.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-green-400 mb-2">Pros:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      {review.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {review.cons.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-red-400 mb-2">Cons:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      {review.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {review.theatreResponse && (
                  <div className="bg-gray-800 p-4 rounded-md mt-4 border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-yellow-400">Theatre Response</span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.theatreResponse.respondedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{review.theatreResponse.content}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <span className="text-xs text-gray-400">
                    {review.helpful.length} people found this helpful
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Form Modal */}
      {showEditForm && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TheatreReviewForm
              theatreId={editingReview.theatre._id}
              onSubmit={handleEditReview}
              onCancel={() => {
                setShowEditForm(false);
                setEditingReview(null);
              }}
              initialData={editingReview}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews; 