import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Plus, MessageSquare } from 'lucide-react';
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
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch theatre details
        const tRes = await fetch(`${API_URL}/api/admin/all-theatres`);
        const tData = await tRes.json();
        const found = tData.theatres.find(t => t.name === decodeURIComponent(theatreId));
        setTheatre(found);
        // Admin data is already populated in the theatre object
        if (found && found.admin) {
          setAdmin(found.admin);
        }
        // Fetch shows for this theatre
        const sRes = await fetch(`${API_URL}/api/show/all`);
        const sData = await sRes.json();
        const filteredShows = sData.shows.filter(show => show.theatre === found?._id);
        setShows(filteredShows);
        
        // Check if user has reviewed this theatre
        if (isAuthenticated && found?._id) {
          checkUserReview(found._id);
        }
        
        setLoading(false);
      } catch (e) {
        setError('Failed to load theatre details.');
        setLoading(false);
      }
    }
    fetchData();
  }, [theatreId, isAuthenticated]);

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
    <div className="theatre-detail-container">
      <div className="theatre-detail-header">
        <img className="theatre-detail-image" src={admin?.image || getPlaceholderImg(admin?.name)} alt="Theatre" />
        <div className="theatre-detail-header-info">
          <h1 className="theatre-detail-title">{theatre.name}</h1>
          <div className="theatre-detail-admin">Admin: {admin?.name || (theatre.admin.slice(0,8)+'...')}</div>
          
          {/* Rating Display */}
          {theatre.averageRating !== undefined && (
            <div className="theatre-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= theatre.averageRating ? 'star-filled' : 'star-empty'}
                    style={{ 
                      color: star <= theatre.averageRating ? '#FFD700' : '#DDD',
                      fill: star <= theatre.averageRating ? '#FFD700' : 'none'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {theatre.averageRating.toFixed(1)} ({theatre.reviewCount || 0} reviews)
              </span>
            </div>
          )}
          
          {/* Review Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {isAuthenticated && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                Write a Review
              </button>
            )}
            
            {userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#666',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={16} />
                Edit Your Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User's Review Section */}
      {userReview && (
        <div style={{ margin: '20px 0', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Your Review</h3>
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

      <div className="theatre-detail-layout-block">
        <div className="theatre-detail-layout-label">Layout</div>
        <div className="theatre-detail-layout-grid">
          {theatre.layout && theatre.layout.map((row, i) => (
            <div className="theatre-detail-layout-row" key={i}>
              {row.map((seat, j) => (
                <span className={`theatre-detail-layout-seat${seat ? '' : ' theatre-detail-layout-seat-empty'}`} key={j}>{seat ? '🟩' : '⬜'}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="theatre-detail-shows-block">
        <h2 className="theatre-detail-shows-title">Currently Airing Shows</h2>
        {shows.length === 0 ? (
          <div className="theatre-detail-no-shows">No shows currently airing in this theatre.</div>
        ) : (
          <ul className="theatre-detail-shows-list">
            {shows.map(show => (
              <li className="theatre-detail-show-item" key={show._id}>
                <b>{show.movie?.title || 'Untitled Movie'}</b> <span className="theatre-detail-show-time">{new Date(show.showDateTime).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Reviews Section */}
      {theatre._id && (
        <div style={{ margin: '40px 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#000' }}>
            All Reviews
          </h2>
          <TheatreReviews theatreId={theatre._id} />
        </div>
      )}

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
            backgroundColor: '#000',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
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
            backgroundColor: '#000',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
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