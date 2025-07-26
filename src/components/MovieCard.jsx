import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'
import CircularRating from './CircularRating';

const MovieCard = ({movie}) => {

    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

  return (
    <div className='movie-card movie-card-tmdb' style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(16,30,54,.08)', overflow: 'hidden', width: 220, height: 440, display: 'flex', flexDirection: 'column', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s' }}>
      <div style={{ position: 'relative', width: '100%', height: 330 }}>
        <img
          onClick={() => { if (movie.id) { navigate(`/movies/${movie.id}`); scrollTo(0, 0); } }}
          src={image_base_url + movie.poster_path}
          alt={movie.title}
          className='movie-card-img'
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 0 }}
        />
        <div style={{ position: 'absolute', left: 16, bottom: 0, zIndex: 2, transform: 'translateY(50%)' }}>
          <CircularRating value={typeof movie.vote_average === 'number' ? movie.vote_average * 10 : 0} size={40} />
        </div>
      </div>
      <div className="movie-card-content" style={{ padding: '14px 12px 10px 12px', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div className="movie-card-text-content">
          <div className="movie-card-title-animated" style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 4, marginTop: 12, overflow: 'hidden' }}>{movie.title}</div>
          <div className="movie-card-details-animated" style={{ color: '#888', fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {(movie.genres && Array.isArray(movie.genres) ? movie.genres.slice(0,2).map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(' | ') : 'No Genre')} • {timeFormat(movie.runtime)}
          </div>
        </div>
      </div>
      <div className="movie-card-book-btn-container">
        <button 
          className="movie-card-book-btn"
          onClick={() => { if (movie.id) { navigate(`/movies/${movie.id}`); scrollTo(0, 0); } }}
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default MovieCard
