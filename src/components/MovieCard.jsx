import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'
<<<<<<< Updated upstream

const MovieCard = ({movie}) => {

    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

  return (
    <div className='movie-card'>

      <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
       src={image_base_url + movie.backdrop_path} alt="" className='movie-card-img'/>

       <p className='movie-card-title' style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</p>

       <p className='movie-card-details'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0,2).map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(" | ")} • {timeFormat(movie.runtime)}
       </p>

       <div className='movie-card-footer'>
        <button onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}} className='movie-card-buy-btn'>Buy Tickets</button>

        <p className='movie-card-rating'>
            <StarIcon className="star-icon"/>
            {movie.vote_average.toFixed(1)}
        </p>
       </div>

=======
import CircularRating from './CircularRating'
import TrailerModal from './TrailerModal'
import GlareHover from './GlareHover'
import useResponsive from '../hooks/useResponsive'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const { image_base_url } = useAppContext()
  const [showTrailer, setShowTrailer] = React.useState(false)
  const { isTinyMobile, isSmallMobile, getResponsiveValue } = useResponsive()

  // Responsive values optimized for 300px screens
  const responsiveCardWidth = getResponsiveValue({
    xl: '220px',
    lg: '220px',
    md: '200px',
    sm: '180px',
    xs: '160px',
    small: '150px',
    tiny: '140px',
  });

  const responsiveCardHeight = getResponsiveValue({
    xl: '440px',
    lg: '440px',
    md: '400px',
    sm: '380px',
    xs: '360px',
    small: '260px',
    tiny: '260px',
  });

  const responsiveImageHeight = getResponsiveValue({
    xl: '330px',
    lg: '330px',
    md: '300px',
    sm: '280px',
    xs: '260px',
    small: '180px',
    tiny: '180px',
  });

  const responsiveTitleSize = getResponsiveValue({
    xl: '16px',
    lg: '16px',
    md: '15px',
    sm: '14px',
    xs: '13px',
    small: '12px',
    tiny: '11px',
  });

  const responsiveDetailsSize = getResponsiveValue({
    xl: '14px',
    lg: '14px',
    md: '13px',
    sm: '12px',
    xs: '11px',
    small: '10px',
    tiny: '9px',
  });

  const responsiveButtonSize = getResponsiveValue({
    xl: '15px',
    lg: '15px',
    md: '14px',
    sm: '13px',
    xs: '12px',
    small: '11px',
    tiny: '10px',
  });

  const responsivePadding = getResponsiveValue({
    xl: '14px 12px 10px 12px',
    lg: '14px 12px 10px 12px',
    md: '12px 10px 8px 10px',
    sm: '10px 8px 6px 8px',
    xs: '8px 6px 4px 6px',
    small: '6px 4px 2px 4px',
    tiny: '4px 2px 1px 2px',
  });

  return (
    <div
      className='movie-card movie-card-tmdb'
      style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px 0 rgba(16,30,54,.08)',
        overflow: 'hidden',
        width: responsiveCardWidth,
        height: responsiveCardHeight,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s',
        borderBottom: '1px dashed #FFD6A0',
        flexShrink: 0, // Prevent shrinking in flex containers
      }}
    >
      {/* Responsive UI for different screen sizes */}
      {isTinyMobile ? (
        // Tiny mobile layout (300px and below)
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Movie Poster - Extended */}
          <div style={{
            width: '100%',
            height: '180px', // Extended from 120px
            position: 'relative',
          }}>
            <img
              onClick={() => {
                if (movie.id || movie._id) {
                  navigate(`/movies/${movie.id || movie._id}`)
                  scrollTo(0, 0)
                }
              }}
              src={movie.poster_path ? image_base_url + movie.poster_path : '/placeholder-movie.jpg'}
              alt={movie.title || 'Movie'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '12px 12px 0 0',
              }}
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg'
              }}
            />
          </div>

          {/* Content Section - Reduced white space */}
          <div style={{
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px', // Reduced from 6px
            flex: 1,
            justifyContent: 'flex-start', // Changed from space-between
            minHeight: '60px', // Reduced height
          }}>
            {/* Star Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <StarIcon size={12} style={{ color: '#ff6b35' }} />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#333',
              }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span style={{
                fontSize: '0.6rem',
                color: '#666',
              }}>
                {movie.vote_count ? `${(movie.vote_count / 1000).toFixed(1)}K` : ''}
              </span>
            </div>

            {/* Movie Title */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start', // Changed from flex-end
              minHeight: '32px',
            }}>
              <h3 style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#222',
                lineHeight: 1.2,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxHeight: '1.8em',
                width: '100%',
              }}>
                {movie.title}
              </h3>
            </div>
          </div>
        </div>
      ) : isSmallMobile ? (
        // Small mobile layout (300px - 480px)
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Movie Poster - Extended */}
          <div style={{
            width: '100%',
            height: '180px', // Extended from 140px
            position: 'relative',
          }}>
            <img
              onClick={() => {
                if (movie.id || movie._id) {
                  navigate(`/movies/${movie.id || movie._id}`)
                  scrollTo(0, 0)
                }
              }}
              src={movie.poster_path ? image_base_url + movie.poster_path : '/placeholder-movie.jpg'}
              alt={movie.title || 'Movie'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '12px 12px 0 0',
              }}
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg'
              }}
            />
          </div>

          {/* Content Section - Reduced white space */}
          <div style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px', // Reduced from 8px
            flex: 1,
            justifyContent: 'flex-start', // Changed from space-between
            minHeight: '70px', // Reduced height
          }}>
            {/* Star Rating with Vote Count */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <StarIcon size={14} style={{ color: '#ff6b35' }} />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#333',
              }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: '#666',
              }}>
                {movie.vote_count ? `${(movie.vote_count / 1000).toFixed(1)}K votes` : 'No votes'}
              </span>
            </div>

            {/* Movie Title */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start', // Changed from flex-end
              minHeight: '36px',
            }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#222',
                lineHeight: 1.2,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxHeight: '2.4em',
                width: '100%',
              }}>
                {movie.title}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        // Original UI for larger screens
        <>
          <div style={{ position: 'relative', width: '100%', height: responsiveImageHeight }}>
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
                left: isTinyMobile ? 8 : isSmallMobile ? 12 : 16,
                bottom: 0,
                zIndex: 2,
                transform: 'translateY(50%)',
              }}
            >
              <CircularRating
                value={typeof movie.vote_average === 'number' ? movie.vote_average * 10 : 0}
                size={isTinyMobile ? 28 : isSmallMobile ? 32 : 40}
              />
            </div>
          </div>
          <div
            className='movie-card-content'
            style={{
              padding: responsivePadding,
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className='movie-card-text-content'>
              <div
                className='movie-card-title-animated'
                style={{
                  fontWeight: 700,
                  fontSize: responsiveTitleSize,
                  color: '#222',
                  marginBottom: isTinyMobile ? 2 : isSmallMobile ? 3 : 4,
                  marginTop: isTinyMobile ? 6 : isSmallMobile ? 8 : 12,
                  overflow: 'hidden',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {movie.title}
              </div>
              <div
                className='movie-card-details-animated'
                style={{
                  color: '#888',
                  fontWeight: 500,
                  fontSize: responsiveDetailsSize,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {(movie.genres && Array.isArray(movie.genres)
                  ? movie.genres
                      .slice(0, 2)
                      .map((genre) => (genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name))
                      .join(' | ')
                  : 'No Genre')}{' '}
                • {timeFormat(movie.runtime)}
              </div>
            </div>
          </div>
          <div className='movie-card-book-btn-container'>
            <GlareHover
              width='auto'
              height='auto'
              background='#111'
              borderRadius='12px'
              borderColor='transparent'
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
                onClick={() => {
                  if (movie.id || movie._id) {
                    navigate(`/movies/${movie.id || movie._id}`)
                    scrollTo(0, 0)
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  pointerEvents: 'auto',
                  color: '#FFD6A0',
                  fontWeight: 'bold',
                  fontSize: responsiveButtonSize,
                  padding: isTinyMobile ? '4px 6px' : isSmallMobile ? '6px 8px' : '8px 12px',
                  cursor: 'pointer',
                }}
              >
                Book Ticket
              </button>
            </GlareHover>
          </div>
        </>
      )}
>>>>>>> Stashed changes
    </div>
  )
}

export default MovieCard
