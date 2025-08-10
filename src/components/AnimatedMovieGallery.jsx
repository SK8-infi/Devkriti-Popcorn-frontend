import React, { useEffect, useRef, useCallback } from 'react';
import './AnimatedMovieGallery.css';

const AnimatedMovieGallery = ({ onActiveIndexChange, galleryItems = [] }) => {
  const galleryTrackRef = useRef(null);
  const animationRef = useRef(null);
  const lastCenterIndexRef = useRef(0);
  const pauseTimeoutRef = useRef(null);
  const [centerCardIndex, setCenterCardIndex] = React.useState(0);
  const [isAnimationPaused, setIsAnimationPaused] = React.useState(false);
  const [shouldShowCenterScale, setShouldShowCenterScale] = React.useState(false);
  
  // Get responsive card dimensions
  const getResponsiveDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
      return { cardWidth: 100, gap: 1.5 * 16 }; // Small mobile
    } else if (screenWidth <= 768) {
      return { cardWidth: 120, gap: 2.25 * 16 }; // Mobile
    } else if (screenWidth <= 1024) {
      return { cardWidth: 150, gap: 3 * 16 }; // Tablet
    } else {
      return { cardWidth: 200, gap: 4.5 * 16 }; // Desktop
    }
  }, []);

  // Convert galleryItems to the format needed for the gallery
  const movies = galleryItems.map((item, index) => ({
    id: index + 1,
    title: item.text,
    poster: item.image
  }));

  // If no galleryItems provided, show loading or fallback
  if (!galleryItems.length) {
    return (
      <div className="animated-movie-gallery">
        <div className="gallery-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            Loading movies...
          </div>
        </div>
      </div>
    );
  }

  // Create multiple copies for truly infinite scrolling
  // Calculate based on screen width to ensure enough copies are always visible
  const screenWidth = window.innerWidth;
  const { cardWidth, gap } = getResponsiveDimensions();
  const cardTotalWidth = cardWidth + gap;
  const visibleCards = Math.ceil(screenWidth / cardTotalWidth) + 4; // Extra buffer
  const copiesNeeded = Math.max(6, Math.ceil(visibleCards * 2 / movies.length));
  
  const duplicatedMovies = [];
  for (let i = 0; i < copiesNeeded; i++) {
    duplicatedMovies.push(...movies);
  }
  
  // Ensure we have enough items for seamless infinite scrolling
  const minimumItems = Math.max(48, Math.ceil(screenWidth / 150) * 2);
  while (duplicatedMovies.length < minimumItems) {
    duplicatedMovies.push(...movies);
  }

  const handleCardClick = (index) => {
    if (onActiveIndexChange) {
      onActiveIndexChange(index % movies.length);
    }
  };
  
  const singleSetWidth = movies.length * (cardWidth + gap) - gap; // Subtract one gap at the end
  
  // Function to handle center pause and scaling
  const handleCenterPause = useCallback(() => {
    if (!galleryTrackRef.current) return;
    
    // Clear any existing timeouts
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Show scaling immediately when movie reaches center
    setShouldShowCenterScale(true);
    
    // Pause the animation
    setIsAnimationPaused(true);
    galleryTrackRef.current.classList.add('center-paused');
    
    // After 2 seconds, resume animation and remove scaling
    pauseTimeoutRef.current = setTimeout(() => {
      setIsAnimationPaused(false);
      setShouldShowCenterScale(false);
      if (galleryTrackRef.current) {
        galleryTrackRef.current.classList.remove('center-paused');
      }
    }, 2000);
  }, []);
  
  // Function to calculate which movie is in the center
  const calculateCenterMovie = useCallback(() => {
    if (!galleryTrackRef.current || movies.length === 0) return;
    
    const galleryTrack = galleryTrackRef.current;
    const galleryContainer = galleryTrack.parentElement;
    const containerRect = galleryContainer.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    
    // Get current responsive dimensions
    const currentDimensions = getResponsiveDimensions();
    const currentCardWidth = currentDimensions.cardWidth;
    const currentGap = currentDimensions.gap;
    
    // Get the current transform value
    const computedStyle = window.getComputedStyle(galleryTrack);
    const matrix = computedStyle.transform;
    let translateX = 0;
    
    if (matrix !== 'none') {
      const values = matrix.split('(')[1].split(')')[0].split(',');
      translateX = parseFloat(values[4]) || 0;
    }
    
    // Calculate the current position relative to the track
    const trackStartX = translateX;
    const cardTotalWidth = currentCardWidth + currentGap;
    
    // Find the center position relative to the moving track
    const centerPositionOnTrack = centerX - trackStartX;
    
    // Calculate which card index is at the center
    let centerCardIndex = Math.round(centerPositionOnTrack / cardTotalWidth);
    
    // Seamless infinite scroll reset
    const totalSets = Math.floor(duplicatedMovies.length / movies.length);
    const midPoint = Math.floor(totalSets / 2) * movies.length;
    
    // If we're getting close to the end or beginning, reset position seamlessly
    if (centerCardIndex >= (totalSets - 2) * movies.length) {
      // Near the end, reset to middle
      const resetPosition = midPoint * cardTotalWidth;
      galleryTrack.style.transform = `translateX(-${resetPosition}px)`;
      centerCardIndex = centerCardIndex % movies.length + midPoint;
    } else if (centerCardIndex < 2 * movies.length) {
      // Near the beginning, reset to middle
      const resetPosition = midPoint * cardTotalWidth;
      galleryTrack.style.transform = `translateX(-${resetPosition}px)`;
      centerCardIndex = centerCardIndex % movies.length + midPoint;
    }
    
    // Handle the infinite loop by wrapping to original movie indices
    centerCardIndex = centerCardIndex % movies.length;
    if (centerCardIndex < 0) {
      centerCardIndex = movies.length + centerCardIndex;
    }
    
    // Only trigger change if the center movie actually changed
    if (centerCardIndex !== lastCenterIndexRef.current) {
      lastCenterIndexRef.current = centerCardIndex;
      setCenterCardIndex(centerCardIndex);
      
      // Handle center pause and scaling
      handleCenterPause();
      
      if (onActiveIndexChange) {
        onActiveIndexChange(centerCardIndex);
      }
    }
  }, [movies.length, getResponsiveDimensions, onActiveIndexChange, handleCenterPause]);
  
  // Track animation progress to sync background (throttled for performance)
  useEffect(() => {
    if (!galleryTrackRef.current) return;
    
    let lastTime = 0;
    const throttleMs = 100; // Update every 100ms for smooth background changes
    
    // Function to continuously track center movie
    const trackCenter = (currentTime) => {
      if (currentTime - lastTime >= throttleMs) {
        calculateCenterMovie();
        lastTime = currentTime;
      }
      animationRef.current = requestAnimationFrame(trackCenter);
    };
    
    // Start tracking
    animationRef.current = requestAnimationFrame(trackCenter);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [calculateCenterMovie]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      calculateCenterMovie();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCenterMovie]);
  
  // Initial calculation when component mounts
  useEffect(() => {
    if (galleryTrackRef.current && movies.length > 0) {
      // Small delay to ensure CSS animation has started
      const timer = setTimeout(() => {
        calculateCenterMovie();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [movies.length, calculateCenterMovie]);
  
  return (
    <div className="animated-movie-gallery">
      <div className="gallery-container">
        <div 
          ref={galleryTrackRef}
          className="gallery-track"
          style={{
            '--single-set-width': `${singleSetWidth}px`,
            '--total-items': duplicatedMovies.length,
            '--base-duration': '75s',
          }}
        >
          {duplicatedMovies.map((movie, index) => {
            // Determine if this card represents the center movie
            const originalIndex = index % movies.length;
            const isCenterCard = originalIndex === centerCardIndex;
            const shouldScale = isCenterCard && shouldShowCenterScale;
            
            // Calculate distance-based opacity
            const calculateOpacity = () => {
              // Calculate the distance from center for this card
              let distance = Math.abs(originalIndex - centerCardIndex);
              
              // Handle wrap-around for circular array
              const halfLength = Math.floor(movies.length / 2);
              if (distance > halfLength) {
                distance = movies.length - distance;
              }
              
              // Apply opacity based on distance
              switch (distance) {
                case 0: return 1.0;    // Center: 100%
                case 1: return 0.9;    // Adjacent: 90%
                case 2: return 0.6;    // 2 positions away: 60%
                case 3: return 0.3;    // 3 positions away: 30%
                case 4: return 0.1;    // 4 positions away: 10%
                default: return 0.0;   // Far away: 0% (completely transparent)
              }
            };
            
            const cardOpacity = calculateOpacity();
            
            return (
              <div
                key={`${movie.id}-${index}`}
                className={`movie-card ${shouldScale ? 'center-card' : ''}`}
                style={{ opacity: cardOpacity }}
                onClick={() => handleCardClick(index)}
              >
                <div className="movie-poster">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="movie-overlay">
                    <div className="movie-title">{movie.title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedMovieGallery;
