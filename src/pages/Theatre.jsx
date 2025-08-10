import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Plus, MessageSquare, MapPin, Building, Film } from 'lucide-react';
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
  const [theatreShows, setTheatreShows] = useState([]);
  const [movies, setMovies] = useState([]);

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
          
          // Fetch shows for this theatre
          if (tData.theatre?._id) {
            fetchTheatreShows(tData.theatre._id);
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

  const fetchTheatreShows = async (theatreId) => {
    try {
      const response = await fetch(`${API_URL}/api/shows/all`);
      const data = await response.json();
      
      if (data.success) {
        // Filter shows for this specific theatre
        const theatreShows = data.shows.filter(show => 
          show.theatre && show.theatre._id === theatreId
        );
        setTheatreShows(theatreShows);
        
        // Extract unique movies from shows
        const uniqueMovies = [];
        const movieIds = new Set();
        
        theatreShows.forEach(show => {
          if (show.movie && !movieIds.has(show.movie._id)) {
            movieIds.add(show.movie._id);
            uniqueMovies.push(show.movie);
          }
        });
        
        setMovies(uniqueMovies);
      }
    } catch (error) {
      console.error('Error fetching theatre shows:', error);
    }
  };

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
      // Determine if this is a new review or an update
      const isUpdate = userReview && userReview._id;
      const url = isUpdate 
        ? `${API_URL}/api/reviews/${userReview._id}`
        : `${API_URL}/api/reviews`;
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
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
        alert(data.message || `Failed to ${isUpdate ? 'update' : 'submit'} review`);
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
    <div className="min-h-screen bg-black pt-20 py-10 px-4">
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
          <div className="flex justify-center gap-4 mb-8">
            {isAuthenticated && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="review-button-write flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 hover:from-yellow-300 hover:via-orange-400 hover:to-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(255, 193, 7, 0.3)'
                }}
              >
                <Plus size={20} className="animate-pulse" />
                Write a Review
              </button>
            )}
            
            {userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="review-button-edit flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 hover:from-blue-400 hover:via-purple-500 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <MessageSquare size={20} className="animate-pulse" />
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
            className="p-6 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#FFD6A0' }}>Your Review</h3>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                {new Date(userReview.visitDate).toLocaleDateString()}
              </span>
            </div>
            
            {/* Rating and Title Section */}
            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      style={{ 
                        color: star <= userReview.rating ? '#FFD700' : '#666',
                        fill: star <= userReview.rating ? '#FFD700' : 'none'
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  {userReview.rating} out of 5 stars
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{userReview.title}</h4>
              <p className="text-gray-200 leading-relaxed">{userReview.content}</p>
            </div>
            
            {/* Pros and Cons Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReview.pros.length > 0 && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h5 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Pros
                  </h5>
                  <ul className="space-y-1">
                    {userReview.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-200 flex items-center gap-2">
                        <span className="text-green-400">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {userReview.cons.length > 0 && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Cons
                  </h5>
                  <ul className="space-y-1">
                    {userReview.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-200 flex items-center gap-2">
                        <span className="text-red-400">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Movies Section */}
        
        {movies.length > 0 && (
          <div 
            className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
                         <div className="flex items-center gap-3 mb-6">
               <Film className="w-6 h-6 text-primary" />
               <h2 className="text-2xl font-bold" style={{ color: '#FFD6A0' }}>
                 Currently Airing Shows
               </h2>
               <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                 {movies.length} movie{movies.length !== 1 ? 's' : ''} • {theatreShows.length} show{theatreShows.length !== 1 ? 's' : ''}
               </span>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <div 
                  key={movie._id}
                                     className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                   onClick={() => window.open(`/movie/${movie._id}`, '_blank')}
                >
                  <div className="flex items-start gap-4">
                    {movie.poster_path && (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                                         <div className="flex-1 min-w-0">
                       <h3 className="font-semibold text-white mb-2 truncate">{movie.title}</h3>
                       {movie.vote_average && (
                         <div className="flex items-center gap-1 mb-2">
                           <Star className="w-4 h-4 text-yellow-400 fill-current" />
                           <span className="text-sm text-gray-300">{movie.vote_average.toFixed(1)}</span>
                         </div>
                       )}
                       {movie.release_date && (
                         <p className="text-xs text-gray-400">
                           Released: {new Date(movie.release_date).getFullYear()}
                         </p>
                       )}
                       {movie.runtime && (
                         <p className="text-xs text-gray-400">
                           {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                         </p>
                       )}
                       
                       {/* Show Times */}
                       {(() => {
                         const movieShows = theatreShows.filter(show => show.movie && show.movie._id === movie._id);
                         const upcomingShows = movieShows
                           .filter(show => new Date(show.showDateTime) > new Date())
                           .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
                           .slice(0, 3); // Show only next 3 shows
                         
                         if (upcomingShows.length > 0) {
                           return (
                             <div className="mt-3 pt-3 border-t border-gray-700/50">
                               <p className="text-xs text-gray-400 mb-1">Next shows:</p>
                               <div className="flex flex-wrap gap-1">
                                 {upcomingShows.map((show, idx) => (
                                   <span 
                                     key={idx}
                                     className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                                   >
                                     {new Date(show.showDateTime).toLocaleDateString('en-US', { 
                                       month: 'short', 
                                       day: 'numeric' 
                                     })} {new Date(show.showDateTime).toLocaleTimeString('en-US', { 
                                       hour: '2-digit', 
                                       minute: '2-digit',
                                       hour12: true 
                                     })}
                                   </span>
                                 ))}
                                 {movieShows.length > 3 && (
                                   <span className="text-xs text-gray-500">
                                     +{movieShows.length - 3} more
                                   </span>
                                                                  )}
                               </div>
                             </div>
                           );
                         }
                         return null;
                       })()}
                     </div>
                   </div>
                   
                   {/* Book Now Button */}
                   <div className="mt-4 pt-3 border-t border-gray-700/50">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         window.open(`/movie/${movie._id}`, '_blank');
                       }}
                       className="w-full bg-primary hover:bg-primary/80 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm group-hover:scale-105"
                     >
                       Book Now
                     </button>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* All Reviews Section */}
        {theatre._id && (
          <div 
            className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
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