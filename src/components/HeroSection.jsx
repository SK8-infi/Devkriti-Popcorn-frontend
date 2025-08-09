import React, { useState, useCallback, useEffect } from 'react';
import { ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CircularGallery from './CircularGallery';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/movies/latest';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL.replace(/\/$/, '')}${path}`;
}

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
<<<<<<< Updated upstream
=======
  const { isTinyMobile, isSmallMobile, getResponsiveValue } = useResponsive();
>>>>>>> Stashed changes

  const handleActiveIndexChange = useCallback((idx) => {
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    // Fetch data from backend
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.movies) {
          setGalleryItems(
            data.movies.map(movie => ({
              image: getImageUrl(movie.poster_url), // for gallery
              backdrop: getImageUrl(movie.backdrop_url) || getImageUrl(movie.poster_url), // for background
              text: movie.title,
              release_date: movie.release_date,
              overview: movie.overview,
            }))
          );
        }
      })
      .catch(err => {
        console.error('Failed to fetch movies:', err);
      });
  }, []);

  // Preload images
  useEffect(() => {
    galleryItems.forEach(item => {
      if (item.image) {
        const img = new window.Image();
        img.src = item.image;
      }
      if (item.backdrop) {
        const backdropImg = new window.Image();
        backdropImg.src = item.backdrop;
      }
    });
  }, [galleryItems]);

<<<<<<< Updated upstream
=======
  // Responsive values optimized for 300px screens
  const responsiveTitleSize = getResponsiveValue({
    xl: '2.2rem',
    lg: '2rem',
    md: '1.8rem',
    sm: '1.6rem',
    xs: '1.4rem',
    small: '1.8rem', // Increased from 1.2rem
    tiny: '1.6rem', // Increased from 1rem
  });

  const responsiveLogoTitleSize = getResponsiveValue({
    xl: '1.8rem',
    lg: '1.6rem',
    md: '1.4rem',
    sm: '1.3rem',
    xs: '1.2rem',
    small: '1.5rem', // Increased from 1rem
    tiny: '1.3rem', // Increased from 0.9rem
  });

  const responsiveInfoSize = getResponsiveValue({
    xl: '1.05rem',
    lg: '1rem',
    md: '0.95rem',
    sm: '0.9rem',
    xs: '0.85rem',
    small: '0.9rem', // Increased from 0.8rem
    tiny: '0.85rem', // Increased from 0.75rem
  });

  const responsiveOverviewSize = getResponsiveValue({
    xl: '0.95rem',
    lg: '0.9rem',
    md: '0.85rem',
    sm: '0.8rem',
    xs: '0.75rem',
    small: '0.7rem', // Further reduced from 0.9rem
    tiny: '0.65rem', // Further reduced from 0.85rem
  });

  const responsiveLogoHeight = getResponsiveValue({
    xl: '80px',
    lg: '70px',
    md: '60px',
    sm: '50px',
    xs: '40px',
    small: '45px', // Increased from 35px
    tiny: '40px', // Increased from 30px
  });

  const responsiveLogoWidth = getResponsiveValue({
    xl: '300px',
    lg: '250px',
    md: '200px',
    sm: '180px',
    xs: '150px',
    small: '160px', // Increased from 120px
    tiny: '140px', // Increased from 100px
  });

  const responsiveTopPosition = getResponsiveValue({
    xl: '180px',
    lg: '160px',
    md: '140px',
    sm: '120px',
    xs: '100px',
    small: '100px', // Increased from 80px
    tiny: '80px', // Increased from 60px
  });

  const responsiveLeftPosition = getResponsiveValue({
    xl: '60px',
    lg: '40px',
    md: '30px',
    sm: '20px',
    xs: '15px',
    small: '12px', // Increased from 10px
    tiny: '10px', // Increased from 8px
  });

  const responsiveGap = getResponsiveValue({
    xl: '18px',
    lg: '16px',
    md: '14px',
    sm: '12px',
    xs: '10px',
    small: '12px', // Increased from 8px
    tiny: '10px', // Increased from 6px
  });

>>>>>>> Stashed changes
  if (!galleryItems.length) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: 100 }}>Loading latest movies...</div>;
  }

  return (
    <div
      className="landing-bg hero-vignette-bg"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        minHeight: '100vh',
        width: '100vw',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        backgroundImage: `url(${galleryItems[activeIndex].backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.7s cubic-bezier(0.4,0,0.2,1)',
        willChange: 'background-image, transform',
        transform: 'translateZ(0)',
        overflow: 'hidden', // Prevent horizontal overflow
      }}
    >
      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: `
          linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.0) 45%),
          radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.88) 100%)
        `
      }} />

      {/* Movie Info Block */}
      <div style={{
        position: 'absolute',
<<<<<<< Updated upstream
        top: '220px',
        left: '60px',
=======
        top: responsiveTopPosition,
        left: responsiveLeftPosition,
        right: isTinyMobile ? '8px' : isSmallMobile ? '10px' : '20px',
>>>>>>> Stashed changes
        zIndex: 3,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
<<<<<<< Updated upstream
        gap: '18px',
        minWidth: '340px',
        maxWidth: '600px',
      }}>
=======
        gap: responsiveGap,
        minWidth: isTinyMobile ? 'auto' : '340px',
        maxWidth: isTinyMobile ? 'calc(100vw - 16px)' : '600px',
        padding: isTinyMobile ? '0 8px' : isSmallMobile ? '0 10px' : '0 20px',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {/* Movie Logo or Placeholder */}
        {galleryItems[activeIndex].logo ? (
          <div style={{ 
            marginBottom: isTinyMobile ? '12px' : isSmallMobile ? '16px' : '20px', // Increased spacing
            minHeight: responsiveLogoHeight, 
            minWidth: responsiveLogoWidth, 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <img 
              src={galleryItems[activeIndex].logo}
              alt={`${galleryItems[activeIndex].text} logo`}
              style={{
                maxHeight: responsiveLogoHeight,
                maxWidth: responsiveLogoWidth,
                height: 'auto',
                width: 'auto',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          // Placeholder to reserve space for logo
          <div style={{ 
            minHeight: responsiveLogoHeight, 
            minWidth: responsiveLogoWidth, 
            marginBottom: isTinyMobile ? '12px' : isSmallMobile ? '16px' : '20px', // Increased spacing
          }} />
        )}
        
        {/* Movie Title (shown when no logo or as fallback) */}
>>>>>>> Stashed changes
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          letterSpacing: isTinyMobile ? '-0.5px' : '-1px',
          lineHeight: 1.1,
<<<<<<< Updated upstream
          fontFamily: 'Times New Roman, Times, serif'
=======
          fontFamily: 'Times New Roman, Times, serif',
          display: galleryItems[activeIndex].logo ? 'none' : 'block',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
          whiteSpace: 'normal',
          overflow: 'hidden',
          marginBottom: isTinyMobile ? '16px' : isSmallMobile ? '20px' : '24px', // Added bottom margin
          textShadow: '0 2px 4px rgba(0,0,0,0.8)', // Added text shadow for better visibility
>>>>>>> Stashed changes
        }}>
          {galleryItems[activeIndex].text}
        </div>
        
        {/* Movie Meta Info - Moved down with better spacing */}
        <div style={{
          display: 'flex',
<<<<<<< Updated upstream
          gap: '12px',
          alignItems: 'center',
          fontSize: '1.05rem',
          opacity: 0.85
=======
          gap: isTinyMobile ? '6px' : isSmallMobile ? '8px' : '12px',
          alignItems: 'center',
          fontSize: responsiveInfoSize,
          opacity: 0.9, // Increased opacity
          flexWrap: 'wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
          whiteSpace: 'normal',
          marginBottom: isTinyMobile ? '16px' : isSmallMobile ? '20px' : '24px', // Added bottom margin
          padding: isTinyMobile ? '8px 0' : isSmallMobile ? '10px 0' : '12px 0', // Added padding
          borderBottom: isTinyMobile ? '1px solid rgba(255,255,255,0.2)' : isSmallMobile ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.4)', // Added separator
>>>>>>> Stashed changes
        }}>
          <span style={{ color: '#ffd700', fontWeight: 600 }}>
            {galleryItems[activeIndex].release_date ? new Date(galleryItems[activeIndex].release_date).getFullYear() : ''}
          </span>
          <span style={{ color: '#aaa' }}>|</span>
<<<<<<< Updated upstream
          <span>Movie</span>
          <span style={{ color: '#aaa' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockIcon size={16} style={{ marginRight: 4, position: 'relative', top: 1 }} />
            ~2h
          </span>
        </div>
        <div style={{ fontSize: '1.08rem', opacity: 0.92, lineHeight: 1.5 }}>
=======
          {/* Genres */}
          <span style={{ 
            maxWidth: isTinyMobile ? '100px' : isSmallMobile ? '140px' : 'auto', // Increased max width
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexShrink: 1,
          }}>
            {galleryItems[activeIndex].genres && galleryItems[activeIndex].genres.length > 0
              ? galleryItems[activeIndex].genres.map(g =>
                  typeof g === 'string'
                    ? (g === 'Science Fiction' ? 'Sci-Fi' : g)
                    : (g.name === 'Science Fiction' ? 'Sci-Fi' : g.name)
                ).join(', ')
              : 'Movie'}
          </span>
          <span style={{ color: '#aaa' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: isTinyMobile ? 2 : 4 }}>
            <ClockIcon size={isTinyMobile ? 12 : isSmallMobile ? 14 : 16} style={{ marginRight: isTinyMobile ? 2 : 4, position: 'relative', top: 1 }} />
            {galleryItems[activeIndex].runtime ? `${Math.floor(galleryItems[activeIndex].runtime / 60)}h ${galleryItems[activeIndex].runtime % 60}m` : '~2h'}
          </span>
        </div>
        
        {/* Movie Overview - Improved readability */}
        <div style={{ 
          fontSize: responsiveOverviewSize, 
          opacity: 0.95, // Increased opacity
          lineHeight: 1.6, // Increased line height for better readability
          display: isTinyMobile ? 'block' : '-webkit-box', // Use block for tiny devices
          WebkitLineClamp: isTinyMobile ? 'none' : isSmallMobile ? 7 : 3, // No line clamp for tiny
          WebkitBoxOrient: isTinyMobile ? 'unset' : 'vertical', 
          overflow: isTinyMobile ? 'visible' : 'hidden', // Allow overflow for tiny devices
          textOverflow: isTinyMobile ? 'unset' : 'ellipsis', 
          maxHeight: isTinyMobile ? 'none' : isSmallMobile ? '11.2em' : '4.5em', // No max height for tiny
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          maxWidth: '100%',
          whiteSpace: 'normal',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)', // Added text shadow
          padding: isTinyMobile ? '8px 0' : isSmallMobile ? '10px 0' : '12px 0', // Added padding
        }}>
>>>>>>> Stashed changes
          {galleryItems[activeIndex].overview}
        </div>
      </div>

      {/* Circular Gallery */}
      <div style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
<<<<<<< Updated upstream
        height: '300px',
        position: 'relative',
        zIndex: 2,
        margin: '5px',
        marginTop: '60px',
=======
        height: isTinyMobile ? '200px' : isSmallMobile ? '250px' : '300px',
        position: 'relative',
        zIndex: 2,
        margin: '5px',
        marginTop: isTinyMobile ? '30px' : isSmallMobile ? '40px' : '60px',
        overflow: 'hidden',
>>>>>>> Stashed changes
      }}>
        <div style={{display: 'none'}}>
          {galleryItems.map((item, idx) => (
            <img key={idx} src={item.image} alt={item.text} />
          ))}
        </div>
        <CircularGallery
          items={galleryItems}
          bend={2}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          onActiveIndexChange={handleActiveIndexChange}
        />
      </div>
    </div>
  );
};

export default HeroSection;
