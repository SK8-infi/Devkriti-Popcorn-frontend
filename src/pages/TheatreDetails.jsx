import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Calendar, MessageSquare, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TheatreReviews from '../components/TheatreReviews';
import TheatreReviewForm from '../components/TheatreReviewForm';
import TheatreResponseForm from '../components/TheatreResponseForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TheatreDetails = () => {
  const { theatreId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppContext();
  
  const [theatre, setTheatre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchTheatreDetails();
    if (isAuthenticated) {
      checkUserReview();
    }
  }, [theatreId, isAuthenticated]);

  const fetchTheatreDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/theatre/${theatreId}`);
      const data = await response.json();
      
      if (data.success) {
        setTheatre(data.theatre);
      }
    } catch (error) {
      console.error('Error fetching theatre details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const userReviewForThisTheatre = data.reviews.find(
          review => review.theatre._id === theatreId
        );
        setUserReview(userReviewForThisTheatre);
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowReviewForm(false);
        setUserReview(data.review);
        // Refresh the reviews section
        window.location.reload();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  const handleTheatreResponse = async (reviewId, content) => {
    try {
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
        setShowResponseForm(null);
        // Refresh the reviews section
        window.location.reload();
      } else {
        alert(data.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response');
    }
  };

  const canRespondToReviews = () => {
    return user && (user.role === 'admin' || user.role === 'owner') && 
           theatre && theatre.admin === user._id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading theatre details...</div>
      </div>
    );
  }

  if (!theatre) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Theatre not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Theatre Header */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{theatre.name}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{theatre.city}</span>
                </div>
                {theatre.address && (
                  <span>{theatre.address}</span>
                )}
              </div>
            </div>
            
            {/* Rating Display */}
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= theatre.averageRating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">
                {theatre.averageRating.toFixed(1)} ({theatre.reviewCount} reviews)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isAuthenticated && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <Plus size={16} />
                Write a Review
              </button>
            )}
            
            {userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <MessageSquare size={16} />
                Edit Your Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TheatreReviewForm
              theatreId={theatreId}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Theatre Response Form Modal */}
      {showResponseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TheatreResponseForm
              reviewId={showResponseForm}
              onResponse={handleTheatreResponse}
              onCancel={() => setShowResponseForm(null)}
            />
          </div>
        </div>
      )}

      {/* User Review Section */}
      {userReview && (
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">Your Review</h2>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= userReview.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(userReview.visitDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3">{userReview.title}</h3>
            <p className="text-gray-300 mb-4">{userReview.content}</p>
            
            {userReview.pros.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-400 mb-2">Pros:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {userReview.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {userReview.cons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-400 mb-2">Cons:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {userReview.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Reviews Section */}
      <div className="container mx-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Reviews</h2>
          {canRespondToReviews() && (
            <button
              onClick={() => setShowResponseForm('some-review-id')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
            >
              <MessageSquare size={16} />
              Respond to Reviews
            </button>
          )}
        </div>
        
        <TheatreReviews theatreId={theatreId} />
      </div>
    </div>
  );
};

export default TheatreDetails; 