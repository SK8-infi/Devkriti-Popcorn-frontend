import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { Heart, PlayCircleIcon, StarIcon, Plus, MessageSquare, X } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import TrailerModal from '../components/TrailerModal'
import MovieReviewForm from '../components/MovieReviewForm'
import MovieReviews from '../components/MovieReviews'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import './MovieDetails.css'
import GlareHover from '../components/GlareHover'

const MovieDetails = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const [movie, setMovie] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [error, setError] = useState(null)
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState(null)

  const {api, user, image_base_url, userCity, cityChangeCounter, isAuthenticated} = useAppContext()
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [shows, setShows] = useState([])
  const [currentUserCity, setCurrentUserCity] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState(null)

  const fetchFavoriteMovies = async () => {
    try {
      if (user) {
        const response = await api.get('/api/user/favorites');
        if (response.data.success) {
          setFavoriteMovies(response.data.favorites || []);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteMovies([]);
    }
  };

  const fetchShows = async () => {
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    try {
      // Build query params for shows - only add city if it exists
      const showParams = new URLSearchParams();
      if (currentUserCity && currentUserCity.trim() !== '') {
        showParams.append('city', currentUserCity);
      }
      const showQueryString = showParams.toString();
      const showUrl = showQueryString ? `/api/show/all?${showQueryString}` : '/api/show/all';
      
      const response = await api.get(showUrl);
      if (response.data.success) {
        setShows(response.data.shows || []);
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setShows([]);
    }
  };

  // Get user city from context or localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    setCurrentUserCity(userCity || savedCity);
  }, [userCity]);

  const getShow = async ()=>{
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    try {
      // Build query params for show - only add city if it exists
      const showParams = new URLSearchParams();
      if (currentUserCity && currentUserCity.trim() !== '') {
        showParams.append('city', currentUserCity);
      }
      const showQueryString = showParams.toString();
      const showUrl = showQueryString ? `/api/show/${id}?${showQueryString}` : `/api/show/${id}`;
      
      const [{ data: showData }, { data: movieData }] = await Promise.all([
        api.get(showUrl),
        api.get(`/api/movies/${id}`)
      ]);
      if(showData.success && movieData.movie){
        setShow(showData)
        setMovie(movieData.movie)
        setError(null)
      } else {
        setError('Movie not found.')
      }
    } catch (error) {
      setError('Failed to load movie details.')
    }
  }

  useEffect(() => {
    if (favoriteMovies && favoriteMovies.length > 0) {
      setIsFavorited(!!favoriteMovies.find(movie => movie._id === id));
    } else {
      setIsFavorited(false); // Reset to false when no favorites or empty array
    }
  }, [favoriteMovies, id]);

  useEffect(() => {
    if (user) {
      fetchFavoriteMovies();
    }
  }, [user]);

  useEffect(() => {
    fetchShows();
  }, [currentUserCity, cityChangeCounter]);

  const handleFavorite = async ()=>{
    try {
      if(!user) return toast.error("Please login to proceed");
      
      setIsFavorited(prev => !prev); // Optimistically update UI
      
      const { data } = await api.post('/api/user/update-favorite', {movieId: id})
      
      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      } else {
        // Revert UI if backend returned an error
        setIsFavorited(!!favoriteMovies.find(movie => movie._id === id));
        toast.error(data.message || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      // Revert UI if request failed
      setIsFavorited(!!favoriteMovies.find(movie => movie._id === id));
      toast.error('Failed to update favorites. Please try again.');
    }
  }
  
  useEffect(()=>{
    getShow()
  },[id, currentUserCity, cityChangeCounter])

  const handlePlayTrailer = () => {
    if (movie && movie.trailers && movie.trailers.length > 0) {
      setSelectedTrailer(movie.trailers[0]); // Use the first (highest priority) trailer
      setIsTrailerModalOpen(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  }

  // Check if user has reviewed this movie
  const checkUserReview = async () => {
    if (!isAuthenticated || !movie || (!movie._id && !movie.id)) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/movie-reviews/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const movieId = movie._id || movie.id;
        const userReviewForThisMovie = data.reviews.find(
          review => review.movie._id === movieId
        );
        setUserReview(userReviewForThisMovie);
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  // Handle movie review submission
  const handleSubmitMovieReview = async (reviewData) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Determine if this is a new review or an update
      const isUpdate = userReview && userReview._id;
      const url = isUpdate 
        ? `${API_URL}/api/movie-reviews/${userReview._id}`
        : `${API_URL}/api/movie-reviews`;
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ ...reviewData, movieId: movie._id || movie.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowReviewForm(false);
        setUserReview(data.review);
        toast.success(`Review ${isUpdate ? 'updated' : 'submitted'} successfully!`);
        // Optionally refresh the page to show updated reviews
        window.location.reload();
      } else {
        toast.error(data.message || `Failed to ${isUpdate ? 'update' : 'submit'} review`);
      }
    } catch (error) {
      console.error('Error submitting movie review:', error);
      toast.error('Failed to submit review');
    }
  };

  // Check user review when movie loads
  useEffect(() => {
    if (movie && isAuthenticated) {
      checkUserReview();
    }
  }, [movie, isAuthenticated]);

  // Lock/unlock scrolling when modal is open
  useEffect(() => {
    if (showReviewForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewForm]);





  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-2xl text-red-500 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary rounded text-white mt-2">Retry</button>
      </div>
    )
  }

  return show && movie ? (
    <div className='relative'>
      {/* Backdrop Background */}
      <div 
        className='fixed left-0 right-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${movie.backdrop_url || image_base_url + movie.backdrop_path})`,
          top: '54px',
          height: 'calc(100vh - 54px)',
          backgroundPosition: 'center center',
          zIndex: -1
        }}
      />
      <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
        <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
          <img src={movie.poster_url || image_base_url + movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
          <div className='relative flex flex-col gap-3'>
            <p className='text-primary'>
              {(() => {
                const languages = new Set();
                if (movie.original_language) {
                  languages.add(movie.original_language.toUpperCase());
                }
                if (movie.spoken_languages && Array.isArray(movie.spoken_languages)) {
                  movie.spoken_languages.forEach(lang => {
                    languages.add(lang.iso_639_1?.toUpperCase() || lang.english_name?.substring(0, 2).toUpperCase());
                  });
                }
                return Array.from(languages).join(' | ') || 'EN';
              })()}
            </p>
            <h1 className='text-4xl font-semibold whitespace-nowrap' style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</h1>
            <div className='flex items-center gap-2 text-gray-300'>
              <StarIcon className="w-5 h-5" style={{ color: '#FFD600', fill: '#FFD600' }}/>
              {show.movie.vote_average.toFixed(1)}
            </div>
            <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{movie.overview}</p>
            <p>
              {timeFormat(movie.runtime)} • {Array.isArray(movie.genres) ? movie.genres.map(genre => (typeof genre === 'string' ? genre : genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name)).join(", ") : ''} • {movie.release_date?.split("-")[0]}
            </p>
            <div className='flex items-center flex-wrap gap-4 mt-4'>
              <GlareHover
                width="auto"
                height="auto"
                background={movie?.trailers?.length ? "#374151" : "#6B7280"}
                borderRadius="8px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                style={{ display: 'inline-block' }}
              >
                <button 
                  onClick={handlePlayTrailer}
                  disabled={!movie?.trailers?.length}
                  className={`flex items-center gap-2 px-7 py-3 text-sm transition rounded-md font-medium cursor-pointer active:scale-95 ${
                    movie?.trailers?.length 
                      ? 'bg-transparent hover:bg-transparent' 
                      : 'bg-transparent cursor-not-allowed opacity-50'
                  }`}
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
                >
                  <PlayCircleIcon className="w-5 h-5"/>
                  Watch Trailer
                </button>
              </GlareHover>
              <GlareHover
                width="auto"
                height="auto"
                background="#FFD600"
                borderRadius="8px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                style={{ display: 'inline-block' }}
              >
                <button
                  onClick={() => navigate(`/movies/${id}/select-showtime`)}
                  className='flex items-center gap-2 px-7 py-3 text-sm bg-transparent hover:bg-transparent transition rounded-md font-medium cursor-pointer active:scale-95'
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#000', pointerEvents: 'auto' }}
                >
                  Buy Tickets
                </button>
              </GlareHover>
              <GlareHover
                width="auto"
                height="auto"
                background="#374151"
                borderRadius="50%"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                style={{ display: 'inline-block' }}
              >
                <button onClick={handleFavorite} className='bg-transparent p-2.5 rounded-full transition cursor-pointer active:scale-95' style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}>
                  <Heart className={`w-5 h-5${isFavorited ? ' heart-favorited' : ''}`} />
                </button>
              </GlareHover>
            </div>
          </div>
        </div>
      </div>
      {/* Rest of the content outside backdrop */}
      <div className='px-6 md:px-16 lg:px-40'>
        {/* Your Favorite Cast Section */}
        <div className='mt-12'>
          <p className='text-lg font-medium mb-8'>Your Favorite Cast</p>
          <div className='overflow-x-auto no-scrollbar pb-4'>
            <div className='flex items-center gap-4 w-max px-4'>
              {show.movie.casts.slice(0,12).map((cast,index)=> (
                <div key={index} className='flex flex-col items-center text-center'>
                  <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover'/>
                  <p className='font-medium text-xs mt-3'>{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movie Reviews Section */}
        <div className='mt-20'>
          {/* Section Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
            <div>
              <h2 className='text-lg font-medium text-white'>
                Movie Reviews
              </h2>
              <p className='text-gray-400 text-sm mt-1'>Share your thoughts and read what others think</p>
            </div>
            
            {isAuthenticated && (
              <div className='flex gap-4'>
                {!userReview && (
                  <GlareHover
                    width="auto"
                    height="auto"
                    background="#FFD600"
                    borderRadius="12px"
                    borderColor="transparent"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-transparent transition rounded-lg font-medium cursor-pointer active:scale-95 text-sm'
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#000', pointerEvents: 'auto' }}
                    >
                      <Plus size={16} />
                      Write a Review
                    </button>
                  </GlareHover>
                )}
                
                {userReview && (
                  <GlareHover
                    width="auto"
                    height="auto"
                    background="#3B82F6"
                    borderRadius="12px"
                    borderColor="transparent"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-transparent transition rounded-lg font-medium cursor-pointer active:scale-95 text-sm'
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#fff', pointerEvents: 'auto' }}
                    >
                      <MessageSquare size={16} />
                      Edit Review
                    </button>
                  </GlareHover>
                )}
              </div>
            )}
          </div>

          {/* User's Review Section */}
          {userReview && (
            <div className="bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">Y</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{fontFamily: 'Times New Roman, Times, serif'}}>
                      Your Review
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(userReview.watchDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarIcon
                        key={star}
                        size={20}
                        style={{ 
                          color: star <= userReview.rating ? '#FFD700' : '#666',
                          fill: star <= userReview.rating ? '#FFD700' : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold text-xl">{userReview.rating}</span>
                </div>
              </div>
              
              {/* Review Content */}
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white mb-3" style={{fontFamily: 'Times New Roman, Times, serif'}}>
                  {userReview.title}
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">{userReview.content}</p>
              </div>
              
              {/* Pros and Cons Section */}
              {(userReview.pros.length > 0 || userReview.cons.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userReview.pros.length > 0 && (
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                      <h5 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        What you liked
                      </h5>
                      <ul className="space-y-2">
                        {userReview.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-green-400">•</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {userReview.cons.length > 0 && (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                      <h5 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        What could be better
                      </h5>
                      <ul className="space-y-2">
                        {userReview.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-red-400">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* All Reviews Section */}
          {movie && (movie._id || movie.id) && (
            <div className="rounded-2xl p-6 border border-gray-800/50" style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <MovieReviews movieId={movie._id || movie.id} />
            </div>
          )}
        </div>

        <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
        <div style={{ marginBottom: '60px' }}>
          {shows && shows.length > 0 ? (
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
              {(() => {
                const uniqueMovies = [];
                const seen = new Set();
                for (const movie of shows) {
                  // Exclude only the current movie
                  const isCurrent = (movie._id === id) || (movie.movie && (movie.movie._id === id || movie.movie.id === id));
                  if (!isCurrent && !seen.has(movie.movie._id)) {
                    uniqueMovies.push(movie);
                    seen.add(movie.movie._id);
                  }
                  if (uniqueMovies.length === 4) break;
                }
                return uniqueMovies.map((movie, index) => (
                  <MovieCard
                    key={movie.movie._id || movie.movie.id}
                    movie={{ ...movie.movie, id: movie.movie.id || movie.movie._id }}
                  />
                ));
              })()}
            </div>
          ) : null}
          <TrailerModal 
            isOpen={isTrailerModalOpen}
            onClose={() => setIsTrailerModalOpen(false)}
            trailer={selectedTrailer}
          />
        </div>
      </div>

      {/* Movie Review Form Modal */}
      {showReviewForm && movie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowReviewForm(false)}
                className="w-10 h-10 bg-gray-800/80 hover:bg-gray-700/80 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-8">
              {movie && (movie._id || movie.id) ? (
                <MovieReviewForm
                  movieId={movie._id || movie.id}
                  onSubmit={handleSubmitMovieReview}
                  onCancel={() => setShowReviewForm(false)}
                  initialData={userReview}
                />
              ) : (
                <div className="bg-black/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800/50 text-white text-center">
                  <p>Loading form...</p>
                  <p className="text-sm text-gray-400 mt-2">Movie ID: {movie ? (movie._id || movie.id || 'undefined') : 'null'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : <Loading />
}

export default MovieDetails
