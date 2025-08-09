import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import TrailerModal from '../components/TrailerModal'
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

  const {api, user, image_base_url, userCity, cityChangeCounter} = useAppContext()
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [shows, setShows] = useState([])
  const [currentUserCity, setCurrentUserCity] = useState(null)

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
      }
    } catch (error) {
      setIsFavorited(!!favoriteMovies.find(movie => movie._id === id)); // Revert if error
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
    </div>
  ) : <Loading />
}

export default MovieDetails
