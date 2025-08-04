import React, { useState, useCallback, useEffect } from 'react';
import { ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CircularGallery from './CircularGallery';
import ResponsiveContainer from './ResponsiveContainer';
import useResponsive from '../hooks/useResponsive';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
  const { isTinyMobile, getResponsiveValue } = useResponsive();

  const handleActiveIndexChange = useCallback((idx) => {
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    // Fetch data from backend
    fetch(`${API_URL}/api/movies/latest`)
      .then(res => res.json())
      .then(data => {
        if (data.movies) {
          const items = data.movies.slice(0, 10).map(movie => ({
            image: getImageUrl(movie.poster_url), // for gallery
            backdrop: getImageUrl(movie.backdrop_url) || getImageUrl(movie.poster_url), // for background
            text: movie.title,
            release_date: movie.release_date,
            overview: movie.overview,
            runtime: movie.runtime, // new
            genres: movie.genres,   // new
            logo: movie.logos && movie.logos.length > 0 ? movie.logos[0].url : null, // new
          }));
          setGalleryItems(items);
          // Preload all backdrops
          items.forEach(item => {
            if (item.backdrop) {
              const img = new window.Image();
              img.src = item.backdrop;
            }
          });
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
      if (item.logo) {
        const logoImg = new window.Image();
        logoImg.src = item.logo;
      }
    });
  }, [galleryItems]);

  const responsiveTitleSize = getResponsiveValue({
    xl: '2.2rem',
    lg: '2rem',
    md: '1.8rem',
    sm: '1.6rem',
    xs: '1.4rem',
    tiny: '1.2rem',
  });

  const responsiveLogoTitleSize = getResponsiveValue({
    xl: '1.8rem',
    lg: '1.6rem',
    md: '1.4rem',
    sm: '1.3rem',
    xs: '1.2rem',
    tiny: '1rem',
  });

  const responsiveInfoSize = getResponsiveValue({
    xl: '1.05rem',
    lg: '1rem',
    md: '0.95rem',
    sm: '0.9rem',
    xs: '0.85rem',
    tiny: '0.8rem',
  });

  const responsiveOverviewSize = getResponsiveValue({
    xl: '1.08rem',
    lg: '1rem',
    md: '0.95rem',
    sm: '0.9rem',
    xs: '0.85rem',
    tiny: '0.8rem',
  });

  const responsiveLogoHeight = getResponsiveValue({
    xl: '80px',
    lg: '70px',
    md: '60px',
    sm: '50px',
    xs: '40px',
    tiny: '35px',
  });

  const responsiveLogoWidth = getResponsiveValue({
    xl: '300px',
    lg: '250px',
    md: '200px',
    sm: '180px',
    xs: '150px',
    tiny: '120px',
  });

  const responsiveTopPosition = getResponsiveValue({
    xl: '180px',
    lg: '160px',
    md: '140px',
    sm: '120px',
    xs: '100px',
    tiny: '80px',
  });

  const responsiveLeftPosition = getResponsiveValue({
    xl: '60px',
    lg: '40px',
    md: '30px',
    sm: '20px',
    xs: '15px',
    tiny: '10px',
  });

  const responsiveGap = getResponsiveValue({
    xl: '18px',
    lg: '16px',
    md: '14px',
    sm: '12px',
    xs: '10px',
    tiny: '8px',
  });

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
        top: responsiveTopPosition,
        left: responsiveLeftPosition,
        right: isTinyMobile ? '10px' : '20px',
        zIndex: 3,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: responsiveGap,
        minWidth: isTinyMobile ? 'auto' : '340px',
        maxWidth: '600px',
        padding: '0 20px',
      }}>
        {/* Movie Logo or Placeholder */}
        {galleryItems[activeIndex].logo ? (
          <div style={{ 
            marginBottom: '8px', 
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
            marginBottom: '8px',
          }} />
        )}
        {/* Movie Title (shown when no logo or as fallback) */}
        <div style={{
          fontSize: galleryItems[activeIndex].logo ? responsiveLogoTitleSize : responsiveTitleSize,
          fontWeight: 700,
          letterSpacing: '-1px',
          lineHeight: 1.1,
          fontFamily: 'Times New Roman, Times, serif',
          display: galleryItems[activeIndex].logo ? 'none' : 'block',
        }}>
          {galleryItems[activeIndex].text}
        </div>
        <div style={{
          display: 'flex',
          gap: isTinyMobile ? '8px' : '12px',
          alignItems: 'center',
          fontSize: responsiveInfoSize,
          opacity: 0.85,
          flexWrap: isTinyMobile ? 'wrap' : 'nowrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}>
          <span style={{ color: '#FFD6A0', fontWeight: 600 }}>
            {galleryItems[activeIndex].release_date ? new Date(galleryItems[activeIndex].release_date).getFullYear() : ''}
          </span>
          <span style={{ color: '#aaa' }}>|</span>
          {/* Genres */}
          <span style={{ 
            maxWidth: isTinyMobile ? '120px' : 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockIcon size={isTinyMobile ? 14 : 16} style={{ marginRight: 4, position: 'relative', top: 1 }} />
            {galleryItems[activeIndex].runtime ? `${Math.floor(galleryItems[activeIndex].runtime / 60)}h ${galleryItems[activeIndex].runtime % 60}m` : '~2h'}
          </span>
        </div>
        <div style={{ 
          fontSize: responsiveOverviewSize, 
          opacity: 0.92, 
          lineHeight: 1.5, 
          display: '-webkit-box', 
          WebkitLineClamp: isTinyMobile ? 4 : 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          maxHeight: isTinyMobile ? '6em' : '4.5em',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}>
          {galleryItems[activeIndex].overview}
        </div>
      </div>

      {/* Circular Gallery */}
      <div style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: isTinyMobile ? '250px' : '300px',
        position: 'relative',
        zIndex: 2,
        margin: '5px',
        marginTop: isTinyMobile ? '40px' : '60px',
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
