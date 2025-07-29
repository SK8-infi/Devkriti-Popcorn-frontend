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

const MovieDetails = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const [movie, setMovie] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [error, setError] = useState(null)
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState(null)

  const {api, user, image_base_url} = useAppContext()
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [shows, setShows] = useState([])

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
    try {
      const response = await api.get('/api/show/all');
      if (response.data.success) {
        setShows(response.data.shows || []);
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setShows([]);
    }
  };

  const getShow = async ()=>{
    try {
      const [{ data: showData }, { data: movieData }] = await Promise.all([
        api.get(`/api/show/${id}`),
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
      console.log(error)
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
  }, []);

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
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getShow()
  },[id])

  const handlePlayTrailer = () => {
    if (movie && movie.trailers && movie.trailers.length > 0) {
      setSelectedTrailer(movie.trailers[0]); // Use the first (highest priority) trailer
      setIsTrailerModalOpen(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  }

  console.log("SHOW STATE:", show);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-2xl text-red-500 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary rounded text-white mt-2">Retry</button>
      </div>
    )
  }

  return show && movie ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>

        <img src={movie.poster_url || image_base_url + movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>

        <div className='relative flex flex-col gap-3'>
          <p className='text-primary'>{movie.original_language?.toUpperCase() || 'ENGLISH'}</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance' style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className="w-5 h-5" style={{ color: '#FFD600', fill: '#FFD600' }}/>
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{movie.overview}</p>

          <p>
            {timeFormat(movie.runtime)} • {Array.isArray(movie.genres) ? movie.genres.map(genre => (typeof genre === 'string' ? genre : genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name)).join(", ") : ''} • {movie.release_date?.split("-")[0]}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button 
              onClick={handlePlayTrailer}
              disabled={!movie?.trailers?.length}
              className={`flex items-center gap-2 px-7 py-3 text-sm transition rounded-md font-medium cursor-pointer active:scale-95 ${
                movie?.trailers?.length 
                  ? 'bg-gray-800 hover:bg-gray-900' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <PlayCircleIcon className="w-5 h-5"/>
              Watch Trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>Buy Tickets</a>
            <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5${isFavorited ? ' heart-favorited' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Shows Section */}
      <div className='mt-12'>
        <h2 className='text-2xl font-semibold mb-4'>Upcoming Shows</h2>
        {show.dateTime && Object.keys(show.dateTime).length > 0 ? (
          <div className='flex flex-col gap-4'>
            {Object.entries(show.dateTime).map(([date, times]) => (
              <div key={date} className='border-b border-gray-700 pb-2'>
                <div className='font-medium text-lg text-primary mb-1'>{date}</div>
                <div className='flex flex-wrap gap-3'>
                  {times.map(({ time, showId, theatreName, theatreCity }) => (
                    <div key={showId} className='flex items-center gap-4 bg-primary/80 text-white px-4 py-2 rounded cursor-pointer text-sm'>
                      <span>{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className='font-semibold'>{theatreName}</span>
                      <span className='text-yellow-200'>{theatreCity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-400'>No upcoming shows for this movie.</div>
        )}
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0,12).map((cast,index)=> (
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover'/>
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id}/>

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      {shows && shows.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {/* Only show each movie once and not the current movie or those with open booking window */}
          {(() => {
            const uniqueMovies = [];
            const seen = new Set();
            for (const movie of shows) {
              // Exclude current movie and movies with open booking window
              const isCurrent = movie._id === id;
              const hasOpenBooking = movie.dateTime && Object.keys(movie.dateTime).length > 0;
              if (!isCurrent && !hasOpenBooking && !seen.has(movie.movie._id)) {
                uniqueMovies.push(movie);
                seen.add(movie.movie._id);
              }
              if (uniqueMovies.length === 4) break;
            }
            return uniqueMovies.map((movie, index) => (
              <MovieCard key={movie.movie._id || movie.movie.id} movie={movie.movie}/>
            ));
          })()}
        </div>
      ) : (
        <div className='flex justify-center my-10'>
          <Loading />
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        trailer={selectedTrailer}
      />

    </div>
  ) : <Loading />
}

export default MovieDetails
