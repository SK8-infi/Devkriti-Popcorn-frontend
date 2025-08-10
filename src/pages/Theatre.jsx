import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Plus, MessageSquare, MapPin, Building } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TheatreReviews from '../components/TheatreReviews';
import TheatreReviewForm from '../components/TheatreReviewForm';
import TheatreResponseForm from '../components/TheatreResponseForm';
import './Theatres.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// This will be dynamically generated based on admin name
const getPlaceholderImg = (adminName) => {
  const name = adminName || 'Admin';
  return `https://ui-avatars.com/api/?background=FFD6A0&color=232323&name=${encodeURIComponent(name)}`;
};

const Theatre = () => {
  const { theatreId } = useParams();
  const { user, isAuthenticated } = useAppContext();
  const [theatre, setTheatre] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch theatre details by ID instead of name
        const tRes = await fetch(`${API_URL}/api/admin/theatre/${theatreId}`);
        const tData = await tRes.json();
        
        if (tData.success) {
          setTheatre(tData.theatre);
          // Admin data is already populated in the theatre object
          if (tData.theatre && tData.theatre.admin) {
            setAdmin(tData.theatre.admin);
          }
          
          // Check if user has reviewed this theatre
          if (isAuthenticated && tData.theatre?._id) {
            checkUserReview(tData.theatre._id);
          }
        } else {
          setError('Theatre not found.');
        }
        
        setLoading(false);
      } catch (e) {
        setError('Failed to load theatre details.');
        setLoading(false);
      }
    }
    fetchData();
  }, [theatreId, isAuthenticated]);

  // Lock/unlock body scroll when modals open/close
  useEffect(() => {
    if (showReviewForm || showResponseForm) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewForm, showResponseForm]);

  const checkUserReview = async (theatreObjectId) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const userReviewForThisTheatre = data.reviews.find(
          review => review.theatre._id === theatreObjectId
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
        body: JSON.stringify({ ...reviewData, theatreId: theatre._id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowReviewForm(false);
        setUserReview(data.review);
        // Optionally refresh the page to show updated reviews
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
           theatre && theatre.admin._id === user._id;
  };

  if (loading) return <div className="theatres-loading">Loading theatre...</div>;
  if (error || !theatre) return <div className="theatres-error">{error || 'Theatre not found.'}</div>;

  return (
    <div className="min-h-screen bg-transparent pt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Theatre Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>
            {theatre.name}
          </h1>
          
          {/* Theatre Address */}
          {theatre.address && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-gray-300">{theatre.address}</span>
            </div>
          )}
          
          {/* Available Formats */}
          {theatre.rooms && theatre.rooms.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building className="w-5 h-5 text-primary" />
              <span className="text-gray-300">Available Formats:</span>
              <div className="flex gap-2">
                {[...new Set(theatre.rooms.map(room => room.type))].map((type, idx) => (
                  <span 
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      type === 'IMAX' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : type === '3D' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Rating Display */}
          {theatre.averageRating !== undefined && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= theatre.averageRating ? 'star-filled' : 'star-empty'}
                    style={{ 
                      color: star <= theatre.averageRating ? '#FFD6A0' : '#666',
                      fill: star <= theatre.averageRating ? '#FFD6A0' : 'none'
                    }}
                  />
                ))}
              </div>
              <span className="text-gray-300 font-medium">
                {theatre.averageRating.toFixed(1)} ({theatre.reviewCount || 0} reviews)
              </span>
            </div>
          )}
          
          {/* Review Action Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            {isAuthenticated && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 bg-black hover:bg-red-950 text-white font-bold px-6 py-3 rounded-lg transition duration-300"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <Plus size={18} />
                Write a Review
              </button>
            )}
            
            {userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 border border-gray-600 hover:border-primary/50 text-white font-bold px-6 py-3 rounded-lg transition duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <MessageSquare size={18} />
                Edit Your Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 px-8">
        {/* User's Review Section */}
        {userReview && (
          <div 
            className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#FFD6A0' }}>Your Review</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={14}
                    style={{ 
                      color: star <= userReview.rating ? '#FFD700' : '#DDD',
                      fill: star <= userReview.rating ? '#FFD700' : 'none'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {new Date(userReview.visitDate).toLocaleDateString()}
              </span>
            </div>
            
            <h4 style={{ margin: '8px 0', fontSize: '16px', fontWeight: '600' }}>{userReview.title}</h4>
            <p style={{ margin: '8px 0', lineHeight: '1.5', color: '#333' }}>{userReview.content}</p>
            
            {userReview.pros.length > 0 && (
              <div style={{ margin: '12px 0' }}>
                <strong style={{ color: '#28a745', fontSize: '14px' }}>Pros:</strong>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {userReview.pros.map((pro, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#333' }}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {userReview.cons.length > 0 && (
              <div style={{ margin: '12px 0' }}>
                <strong style={{ color: '#dc3545', fontSize: '14px' }}>Cons:</strong>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {userReview.cons.map((con, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#333' }}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Section */}
        {theatre._id && (
          <div 
            className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#FFD6A0' }}>
              All Reviews
            </h2>
            <TheatreReviews theatreId={theatre._id} />
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundImage: 'url("/bg-4.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            transform: 'scale(0.7)',
            transformOrigin: 'center center'
          }}>
            <TheatreReviewForm
              theatreId={theatre._id}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
              initialData={userReview}
            />
          </div>
        </div>
      )}

      {/* Theatre Response Form Modal */}
      {showResponseForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundImage: 'url("/bg-4.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            transform: 'scale(0.7)',
            transformOrigin: 'center center'
          }}>
            <TheatreResponseForm
              reviewId={showResponseForm}
              onResponse={handleTheatreResponse}
              onCancel={() => setShowResponseForm(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Theatre;
