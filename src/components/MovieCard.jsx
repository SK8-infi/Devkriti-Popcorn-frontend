import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'
import CircularRating from './CircularRating'
import TrailerModal from './TrailerModal'
import GlareHover from './GlareHover'
import toast from 'react-hot-toast'
import useResponsive from '../hooks/useResponsive'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const { image_base_url } = useAppContext()
  const [showTrailer, setShowTrailer] = React.useState(false)
  const { isMobile, isTinyMobile } = useResponsive()

  const handleBookTicket = () => {
    // Navigate to movie details page first, let the details page handle show availability
    if (movie.id || movie._id) {
      navigate(`/movies/${movie.id || movie._id}`)
      scrollTo(0, 0)
    }
  }

  // Mobile-optimized dimensions
  const cardWidth = isMobile ? '100%' : 220
  const cardHeight = isMobile ? 'auto' : 440
  const imageHeight = isMobile ? 200 : 330
  const titleSize = isMobile ? '14px' : '16px'
  const detailsSize = isMobile ? '12px' : '14px'
  const buttonSize = isMobile ? '13px' : '15px'
  const ratingSize = isMobile ? 32 : 40

  return (
    <div
      className='movie-card movie-card-tmdb'
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        boxShadow: '0 2px 8px 0 rgba(16,30,54,.08)',
        overflow: 'hidden',
        width: cardWidth,
        height: cardHeight,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: isMobile ? 320 : 'auto',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: imageHeight }}>
        <img
          onClick={() => {
            if (movie.id || movie._id) {
              navigate(`/movies/${movie.id || movie._id}`)
              scrollTo(0, 0)
            }
          }}
          src={movie.poster_path ? image_base_url + movie.poster_path : '/placeholder-movie.jpg'}
          alt={movie.title || 'Movie'}
          className='movie-card-img'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 0,
          }}
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: isMobile ? 12 : 16,
            bottom: 0,
            zIndex: 2,
            transform: 'translateY(50%)',
          }}
        >
          <CircularRating
            value={typeof movie.vote_average === 'number' ? movie.vote_average * 10 : 0}
            size={ratingSize}
          />
        </div>
      </div>
      <div
        className='movie-card-content'
        style={{
          padding: isMobile ? '10px 8px 8px 8px' : '14px 12px 10px 12px',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <div className='movie-card-text-content'>
          <div
            className='movie-card-title-animated'
            style={{
              fontWeight: 700,
              fontSize: titleSize,
              color: '#ffefcb',
              marginBottom: 4,
              marginTop: isMobile ? 8 : 12,
              overflow: 'hidden',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              lineHeight: isMobile ? 1.2 : 1.3,
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            {movie.title}
          </div>
          <div
            className='movie-card-details-animated'
            style={{
              color: 'rgba(255, 239, 203, 0.7)',
              fontWeight: 500,
              fontSize: detailsSize,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              marginTop: isMobile ? 4 : 6,
            }}
          >
            {(movie.genres && Array.isArray(movie.genres)
              ? movie.genres
                  .slice(0, isMobile ? 1 : 2)
                  .map((genre) => (genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name))
                  .join(' | ')
              : 'No Genre')}{' '}
            • {timeFormat(movie.runtime)}
          </div>
        </div>
      </div>
      <div className='movie-card-book-btn-container' style={{ padding: isMobile ? '8px' : '12px' }}>
        <GlareHover
          width='auto'
          height='auto'
          background='rgba(0, 0, 0, 0.3)'
          borderRadius='12px'
          borderColor='rgba(255, 255, 255, 0.1)'
          glareColor='#ffffff'
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
          style={{ display: 'inline-block' }}
        >
          <button
            className='movie-card-show-trailer-btn'
            onClick={handleBookTicket}
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
              color: '#FFD6A0',
              fontWeight: 'bold',
              fontSize: buttonSize,
              padding: isMobile ? '6px 10px' : '8px 12px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Book Ticket
          </button>
        </GlareHover>
      </div>
    </div>
  )
}

export default MovieCard
