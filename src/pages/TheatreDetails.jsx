import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Calendar, MessageSquare, Plus, Building, Film } from 'lucide-react';
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
  const [theatreShows, setTheatreShows] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchTheatreDetails();
    if (isAuthenticated) {
      checkUserReview();
    }
  }, [theatreId, isAuthenticated]);

  useEffect(() => {
    if (theatre?._id) {
      fetchTheatreShows();
    }
  }, [theatre]);

  const fetchTheatreShows = async () => {
    try {
      const response = await fetch(`${API_URL}/api/shows/all`);
      const data = await response.json();
      
      if (data.success) {
        // Filter shows for this specific theatre
        const theatreShows = data.shows.filter(show => 
          show.theatre && show.theatre._id === theatre._id
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
    <div className="min-h-screen bg-black pt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Theatre Header */}
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>
            {theatre.name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <span>{theatre.city}</span>
            </div>
            {theatre.address && (
              <>
                <span className="text-gray-500">•</span>
                <span>{theatre.address}</span>
              </>
            )}
          </div>
          
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
                    className={`w-6 h-6 ${
                      star <= theatre.averageRating 
                        ? 'text-primary fill-current' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-300 font-medium">
                {theatre.averageRating.toFixed(1)} ({theatre.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {isAuthenticated && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-black font-bold px-6 py-3 rounded-lg transition duration-300"
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
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
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

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
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
          <div 
            className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
            <TheatreResponseForm
              reviewId={showResponseForm}
              onResponse={handleTheatreResponse}
              onCancel={() => setShowResponseForm(null)}
            />
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-6 px-8">
        {/* User Review Section */}
        {userReview && (
          <div 
            className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#FFD6A0' }}>Your Review</h2>
            <div className="p-6 rounded-lg bg-black/30 border border-gray-700/50">
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
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Reviews Section */}
        <div 
          className="p-8 rounded-xl border border-gray-600/50 hover:border-primary/50 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#FFD6A0' }}>All Reviews</h2>
            {canRespondToReviews() && (
              <button
                onClick={() => setShowResponseForm('some-review-id')}
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-black font-bold px-4 py-2 rounded-lg transition duration-300"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <MessageSquare size={16} />
                Respond to Reviews
              </button>
            )}
          </div>
          
          <TheatreReviews theatreId={theatreId} />
        </div>
      </div>
    </div>
  );
};

export default TheatreDetails; 