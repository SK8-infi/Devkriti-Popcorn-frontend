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

  // Fetch city-filtered movies
  useEffect(() => {
    const fetchCityFilteredMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/shows/city/${currentUserCity || 'Indore'}`);
        if (response.ok) {
          const data = await response.json();
          setCityFilteredMovies(data);
        }
      } catch (error) {
        console.error('Error fetching city filtered movies:', error);
      }
    };

    if (currentUserCity) {
      fetchCityFilteredMovies();
    }
  }, [currentUserCity, cityChangeCounter]);

  // Generate trailers from movies
  useEffect(() => {
    const generateTrailers = () => {
      let movieTrailers = [];
      
      // Use city-filtered movies if available, otherwise use all movies
      const moviesToUse = cityFilteredMovies.length > 0 ? cityFilteredMovies : allMovies;
      
      if (moviesToUse && moviesToUse.length > 0) {
        // Get movies with trailers
        const moviesWithTrailers = moviesToUse.filter(movie => 
          movie.trailer_url || movie.youtube_url || movie.videoUrl
        );
        
        // Convert movies to trailer format
        movieTrailers = moviesWithTrailers.map(movie => ({
          id: movie._id || movie.id,
          title: movie.title,
          youtube_url: movie.trailer_url || movie.youtube_url || movie.videoUrl,
          videoUrl: movie.trailer_url || movie.youtube_url || movie.videoUrl,
          thumbnail: movie.poster_path,
          movie: movie
        }));
      }
      
      // If no movie trailers, use dummy trailers
      if (movieTrailers.length === 0) {
        movieTrailers = dummyTrailers;
      }
      
      setTrailers(movieTrailers);
    };

    generateTrailers();
  }, [allMovies, cityFilteredMovies]);

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

  // For mobile, show only one trailer with better spacing
  if (isTinyMobile) {
    return (
      <ResponsiveContainer>
        <section className="trailers-section" style={{ 
          width: '100%', 
          color: '#ffefcb', 
          padding: '20px 0 40px 0', 
          position: 'relative', 
          overflow: 'hidden', 
          backgroundColor: 'transparent', 
          marginBottom: '40px' 
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
              marginBottom: 16, 
              fontWeight: 'bold' 
            }}>Trailers</p>
            
            {/* Mobile: Single trailer with navigation */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0, 
              position: 'relative', 
              width: '100%',
              padding: '0 20px',
            }}>
              <button onClick={handleLeft} disabled={centerIdx === 0} style={{ 
                background: 'rgba(0,0,0,0.8)', 
                border: '2px solid #FFD6A0', 
                color: '#FFD6A0', 
                fontSize: 20, 
                cursor: centerIdx === 0 ? 'not-allowed' : 'pointer', 
                padding: '8px', 
                zIndex: 10,
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                opacity: centerIdx === 0 ? 0.3 : 1,
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}>&#8592;</button>
              
              <div style={{ 
                width: '100%',
                maxWidth: '320px',
                position: 'relative',
              }}>
                {/* Trailer Title */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  zIndex: 5,
                  background: 'rgba(0,0,0,0.8)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  margin: '0 10px',
                }}>
                  <p style={{
                    color: '#FFD6A0',
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {trailers[centerIdx]?.title || 'Movie Trailer'}
                  </p>
                </div>
                
                {/* Main Trailer */}
                <div
                  className={`center-trailer-anim${animDirection ? ' anim-' + animDirection : ''}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    zIndex: 2,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#111',
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)',
                    transition: 'all 0.3s',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <ReactPlayer
                    url={trailers[centerIdx]?.youtube_url || trailers[centerIdx]?.videoUrl}
                    controls={true}
                    width="100%"
                    height="200px"
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
              </div>
              
              <button onClick={handleRight} disabled={centerIdx === trailers.length - 1} style={{ 
                background: 'rgba(0,0,0,0.8)', 
                border: '2px solid #FFD6A0', 
                color: '#FFD6A0', 
                fontSize: 20, 
                cursor: centerIdx === trailers.length - 1 ? 'not-allowed' : 'pointer', 
                padding: '8px', 
                zIndex: 10,
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                opacity: centerIdx === trailers.length - 1 ? 0.3 : 1,
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}>&#8594;</button>
            </div>
          </div>
        </section>
      </ResponsiveContainer>
    );
  }

  // Desktop layout (unchanged)
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
            minHeight: 520,
            width: '100%',
          }}>
            <button onClick={handleLeft} disabled={centerIdx === 0} style={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '2px solid #FFD6A0', 
              color: '#FFD6A0', 
              fontSize: 32, 
              cursor: centerIdx === 0 ? 'not-allowed' : 'pointer', 
              padding: '12px 16px', 
              marginRight: 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === 0 ? 0.3 : 1,
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>&#8592;</button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0, 
              width: 1100, 
              overflow: 'visible', 
              position: 'relative',
              padding: '0 80px',
            }}>
              {/* Left trailer (if exists) */}
              {centerIdx > 0 && (
                <div style={{
                  minWidth: 340,
                  maxWidth: 380,
                  height: 260,
                  opacity: 0.6,
                  transform: 'scale(0.8) translateX(40px)',
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginRight: -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx - 1]?.youtube_url || trailers[centerIdx - 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height="260px"
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
                  minWidth: 900,
                  maxWidth: 1100,
                  height: 520,
                  zIndex: 2,
                  borderRadius: 28,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 8px 32px 0 rgba(255,214,0,0.10)',
                  marginLeft: 0,
                  marginRight: 0,
                  transition: 'all 0.3s',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ReactPlayer
                  url={trailers[centerIdx]?.youtube_url || trailers[centerIdx]?.videoUrl}
                  controls={true}
                  width="100%"
                  height="520px"
                  style={{ borderRadius: 28, background: '#111' }}
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
                  minWidth: 340,
                  maxWidth: 380,
                  height: 260,
                  opacity: 0.6,
                  transform: 'scale(0.8) translateX(-40px)',
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginLeft: -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx + 1]?.youtube_url || trailers[centerIdx + 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height="260px"
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
              fontSize: 32, 
              cursor: centerIdx === trailers.length - 1 ? 'not-allowed' : 'pointer', 
              padding: '12px 16px', 
              marginLeft: 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === trailers.length - 1 ? 0.3 : 1,
              position: 'absolute',
              right: '20px',
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
