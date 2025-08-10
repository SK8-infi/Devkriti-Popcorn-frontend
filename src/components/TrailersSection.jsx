import React, { useState, useEffect } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import { useAppContext } from '../context/AppContext';
import ResponsiveContainer from './ResponsiveContainer';
import useResponsive from '../hooks/useResponsive';
import './TrailersSection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TrailersSection = () => {
  const { allMovies, userCity, cityChangeCounter } = useAppContext();
  const [centerIdx, setCenterIdx] = useState(0); // Start with first trailer
  const [animDirection, setAnimDirection] = useState(null); // 'left' or 'right' or null
  const [trailers, setTrailers] = useState([]);
  const [cityFilteredMovies, setCityFilteredMovies] = useState([]);
  const [currentUserCity, setCurrentUserCity] = useState(null);
  const { isTinyMobile, getResponsiveValue } = useResponsive();

  // Get user city from context or localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    setCurrentUserCity(userCity || savedCity);
  }, [userCity]);

  // Fetch shows and filter movies based on user's city
  useEffect(() => {
    if (currentUserCity === null) return;
    
    const fetchCityFilteredMovies = async () => {
      try {
        // Build query params for shows - only add city if it exists
        const showParams = new URLSearchParams();
        if (currentUserCity && currentUserCity.trim() !== '') {
          showParams.append('city', currentUserCity);
        }
        const showQueryString = showParams.toString();
        const showUrl = showQueryString ? `${API_URL}/api/show/all?${showQueryString}` : `${API_URL}/api/show/all`;
        
        const showsResponse = await fetch(showUrl);
        const showsData = await showsResponse.json();
        
        if (showsData.success && allMovies && allMovies.length > 0) {
          const now = new Date();
          const futureShowMovieIds = new Set(
            (showsData.shows || [])
              .filter(show => new Date(show.showDateTime) > now)
              .map(show => show.movie && String(show.movie._id))
          );
          
          // Filter allMovies to only include those with shows in user's city
          const filteredMovies = allMovies.filter(movie => 
            futureShowMovieIds.has(String(movie.id))
          );
          
          setCityFilteredMovies(filteredMovies);
        } else {
          setCityFilteredMovies([]);
        }
      } catch (error) {
        console.error('Error fetching city-filtered movies for trailers:', error);
        // Fallback to all movies if there's an error
        setCityFilteredMovies(allMovies || []);
      }
    };
    
    fetchCityFilteredMovies();
  }, [allMovies, currentUserCity, cityChangeCounter]);

  // Extract trailers from city-filtered movies and fill with popular movies if needed
  useEffect(() => {
    const movieTrailers = [];
    const usedMovieIds = new Set();
    
    // First, add trailers from movies with shows in user's city
    if (cityFilteredMovies && cityFilteredMovies.length > 0) {
      cityFilteredMovies.forEach(movie => {
        if (movie.trailers && movie.trailers.length > 0 && movieTrailers.length < 6) {
          movieTrailers.push({
            ...movie.trailers[0],
            movieTitle: movie.title,
            movieId: movie.id,
            image: movie.trailers[0].thumbnail_url
          });
          usedMovieIds.add(String(movie.id));
        }
      });
    }
    
    // If we have fewer than 6 trailers, fill remaining slots with popular movies
    if (movieTrailers.length < 6 && allMovies && allMovies.length > 0) {
      // Sort movies by popularity/rating and filter out already used ones
      const availableMovies = allMovies
        .filter(movie => 
          !usedMovieIds.has(String(movie.id)) && 
          movie.trailers && 
          movie.trailers.length > 0
        )
        .sort((a, b) => {
          // Sort by vote_average descending, then by popularity if available
          const ratingA = a.vote_average || 0;
          const ratingB = b.vote_average || 0;
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          // Secondary sort by popularity or vote_count
          const popularityA = a.popularity || a.vote_count || 0;
          const popularityB = b.popularity || b.vote_count || 0;
          return popularityB - popularityA;
        });
      
      // Add trailers from popular movies to fill remaining slots
      availableMovies.forEach(movie => {
        if (movieTrailers.length < 6) {
          movieTrailers.push({
            ...movie.trailers[0],
            movieTitle: movie.title,
            movieId: movie.id,
            image: movie.trailers[0].thumbnail_url
          });
        }
      });
    }
    
    // Set trailers or fallback to dummy trailers if still empty
    if (movieTrailers.length > 0) {
      setTrailers(movieTrailers);
      setCenterIdx(Math.min(2, Math.floor(movieTrailers.length / 2))); // Start in middle or beginning
    } else {
      // Fallback to dummy trailers if no real trailers available
      setTrailers(dummyTrailers);
      setCenterIdx(2);
    }
  }, [cityFilteredMovies, allMovies]);

  const handleLeft = () => {
    if (centerIdx > 0) {
      setAnimDirection('left');
      setTimeout(() => {
        setCenterIdx(idx => idx - 1);
        setAnimDirection(null);
      }, 250);
    }
  };
  const handleRight = () => {
    if (centerIdx < trailers.length - 1) {
      setAnimDirection('right');
      setTimeout(() => {
        setCenterIdx(idx => idx + 1);
        setAnimDirection(null);
      }, 250);
    }
  };

  const responsiveTitleSize = getResponsiveValue({
    xl: '1.6rem',
    lg: '1.5rem',
    md: '1.4rem',
    sm: '1.3rem',
    xs: '1.2rem',
    tiny: '1.1rem',
  });

  return (
    <ResponsiveContainer>
      <section className="trailers-section" style={{ 
        width: '100%', 
        color: '#ffefcb', 
        padding: '40px 0 80px 0', 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: 'transparent', 
        marginBottom: '60px' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1 
        }}>
          <p className="trailers-title" style={{ 
            fontSize: responsiveTitleSize, 
            color: '#FFD6A0', 
            letterSpacing: '1px', 
            marginBottom: 32, 
            fontWeight: 'bold' 
          }}>Trailers</p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 0, 
            position: 'relative', 
            minHeight: isTinyMobile ? 280 : 520,
            width: '100%',
          }}>
            <button onClick={handleLeft} disabled={centerIdx === 0} style={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '2px solid #FFD6A0', 
              color: '#FFD6A0', 
              fontSize: isTinyMobile ? 24 : 32, 
              cursor: centerIdx === 0 ? 'not-allowed' : 'pointer', 
              padding: isTinyMobile ? '8px 12px' : '12px 16px', 
              marginRight: isTinyMobile ? 8 : 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: isTinyMobile ? '40px' : '50px',
              height: isTinyMobile ? '40px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === 0 ? 0.3 : 1,
              position: 'absolute',
              left: isTinyMobile ? '10px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>&#8592;</button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0, 
              width: isTinyMobile ? '100%' : 1100, 
              overflow: 'visible', 
              position: 'relative',
              padding: isTinyMobile ? '0 50px' : '0 80px',
            }}>
              {/* Left trailer (if exists) */}
              {centerIdx > 0 && (
                <div style={{
                  minWidth: isTinyMobile ? 200 : 340,
                  maxWidth: isTinyMobile ? 240 : 380,
                  height: isTinyMobile ? 160 : 260,
                  opacity: 0.6,
                  transform: `scale(0.8) translateX(${isTinyMobile ? 20 : 40}px)`,
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginRight: isTinyMobile ? -30 : -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx - 1]?.youtube_url || trailers[centerIdx - 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height={isTinyMobile ? "160px" : "260px"}
                    style={{ borderRadius: 16, background: '#111' }}
                    config={{
                      youtube: {
                        playerVars: {
                          origin: window.location.origin,
                          modestbranding: 1,
                          rel: 0
                        }
                      }
                    }}
                  />
                </div>
              )}
              {/* Center trailer with animation */}
              <div
                className={`center-trailer-anim${animDirection ? ' anim-' + animDirection : ''}`}
                style={{
                  minWidth: isTinyMobile ? 240 : 900,
                  maxWidth: isTinyMobile ? 280 : 1100,
                  height: isTinyMobile ? 180 : 520,
                  zIndex: 2,
                  borderRadius: isTinyMobile ? 16 : 28,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: isTinyMobile ? '0 4px 16px 0 rgba(0,0,0,0.18)' : '0 8px 32px 0 rgba(255,214,0,0.10)',
                  marginLeft: isTinyMobile ? 0 : 0,
                  marginRight: isTinyMobile ? 0 : 0,
                  transition: 'all 0.3s',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => !isTinyMobile && (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => !isTinyMobile && (e.currentTarget.style.transform = 'scale(1)')}
              >
                <ReactPlayer
                  url={trailers[centerIdx]?.youtube_url || trailers[centerIdx]?.videoUrl}
                  controls={!isTinyMobile}
                  width="100%"
                  height={isTinyMobile ? "180px" : "520px"}
                  style={{ borderRadius: isTinyMobile ? 16 : 28, background: '#111' }}
                  config={{
                    youtube: {
                      playerVars: {
                        origin: window.location.origin,
                        modestbranding: 1,
                        rel: 0
                      }
                    }
                  }}
                />
              </div>
              {/* Right trailer (if exists) */}
              {centerIdx < trailers.length - 1 && (
                <div style={{
                  minWidth: isTinyMobile ? 200 : 340,
                  maxWidth: isTinyMobile ? 240 : 380,
                  height: isTinyMobile ? 160 : 260,
                  opacity: 0.6,
                  transform: `scale(0.8) translateX(${isTinyMobile ? -20 : -40}px)`,
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginLeft: isTinyMobile ? -30 : -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx + 1]?.youtube_url || trailers[centerIdx + 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height={isTinyMobile ? "160px" : "260px"}
                    style={{ borderRadius: 16, background: '#111' }}
                    config={{
                      youtube: {
                        playerVars: {
                          origin: window.location.origin,
                          modestbranding: 1,
                          rel: 0
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <button onClick={handleRight} disabled={centerIdx === trailers.length - 1} style={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '2px solid #FFD6A0', 
              color: '#FFD6A0', 
              fontSize: isTinyMobile ? 24 : 32, 
              cursor: centerIdx === trailers.length - 1 ? 'not-allowed' : 'pointer', 
              padding: isTinyMobile ? '8px 12px' : '12px 16px', 
              marginLeft: isTinyMobile ? 8 : 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: isTinyMobile ? '40px' : '50px',
              height: isTinyMobile ? '40px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === trailers.length - 1 ? 0.3 : 1,
              position: 'absolute',
              right: isTinyMobile ? '10px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>&#8594;</button>
          </div>
        </div>
      </section>
    </ResponsiveContainer>
  );
};

export default TrailersSection;
