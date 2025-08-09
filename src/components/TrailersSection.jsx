<<<<<<< Updated upstream
import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
import './TrailersSection.css'
import redCurtain from '../assets/red-curtain.svg';

const TrailersSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0)
=======
import React, { useState, useEffect } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import { useAppContext } from '../context/AppContext';
import ResponsiveContainer from './ResponsiveContainer';
import useResponsive from '../hooks/useResponsive';
import { Play, Film } from 'lucide-react';
import './TrailersSection.css';

const TrailersSection = () => {
  const { allMovies } = useAppContext();
  const [centerIdx, setCenterIdx] = useState(0); // Start with first trailer
  const [animDirection, setAnimDirection] = useState(null); // 'left' or 'right' or null
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const { isTinyMobile, isSmallMobile, getResponsiveValue, windowSize } = useResponsive();

  // Extract trailers from movies when allMovies changes
  useEffect(() => {
    if (allMovies && allMovies.length > 0) {
      const movieTrailers = [];
      allMovies.forEach(movie => {
        if (movie.trailers && movie.trailers.length > 0) {
          // Add the first trailer of each movie with movie info
          movieTrailers.push({
            ...movie.trailers[0],
            movieTitle: movie.title,
            movieId: movie.id,
            image: movie.trailers[0].thumbnail_url
          });
        }
      });
      setTrailers(movieTrailers.slice(0, 6)); // Limit to 6 trailers
      setCenterIdx(Math.min(2, Math.floor(movieTrailers.length / 2))); // Start in middle or beginning
    } else {
      // Fallback to dummy trailers if no real trailers available
      setTrailers(dummyTrailers);
      setCenterIdx(2);
    }
  }, [allMovies]);

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
    small: '1.1rem',
    tiny: '1rem',
  });
>>>>>>> Stashed changes

  const responsiveSectionPadding = getResponsiveValue({
    xl: '40px 0 80px 0',
    lg: '40px 0 80px 0',
    md: '35px 0 70px 0',
    sm: '30px 0 60px 0',
    xs: '25px 0 50px 0',
    small: '20px 0 40px 0',
    tiny: '15px 0 30px 0',
  });

  // Modern card-based grid layout for tiny mobile devices
  if (isTinyMobile) {
    return (
      <section className="trailers-section tiny-trailers-modern" style={{ padding: '20px 0' }}>
        <ResponsiveContainer>
          {/* Clear TRAILERS heading */}
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            padding: '0 8px',
          }}>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              TRAILERS
            </h2>
          </div>

          {/* Modern card grid */}
          <div className="tiny-trailers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            padding: '0 8px',
            width: '100%',
            maxWidth: '100%',
          }}>
            {trailers.map((trailer, index) => (
              <div
                key={trailer.id || index}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelectedTrailer(trailer)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                }}
              >
                {/* Thumbnail with play button overlay */}
                <div style={{
                  width: '100%',
                  height: '120px',
                  position: 'relative',
                  background: '#000',
                  overflow: 'hidden',
                }}>
                  <img
                    src={trailer.image || `https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                    alt={trailer.name || `Trailer ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.8)',
                    }}
                  />
                  
                  {/* Play button overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 214, 160, 0.9)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}>
                    <Play size={16} color="#000" fill="#000" />
                  </div>
                </div>

                {/* Movie info */}
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#fff',
                    margin: '0 0 4px 0',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {trailer.movieTitle || trailer.name || `Movie ${index + 1}`}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#ccc',
                    margin: 0,
                    lineHeight: 1.3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Film size={12} />
                    {trailer.site === 'YouTube' ? 'Official Trailer' : trailer.site}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for video player */}
          {selectedTrailer && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }} onClick={() => setSelectedTrailer(null)}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                background: '#111',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{
                  width: '100%',
                  height: '250px',
                  position: 'relative',
                }}>
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${selectedTrailer.key}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    style={{
                      borderRadius: '16px 16px 0 0',
                    }}
                  />
                </div>
                <div style={{
                  padding: '16px',
                  background: '#111',
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#fff',
                    margin: '0 0 8px 0',
                    lineHeight: 1.3,
                  }}>
                    {selectedTrailer.movieTitle || selectedTrailer.name}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#ccc',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {selectedTrailer.site === 'YouTube' ? 'Official Trailer' : selectedTrailer.site}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ResponsiveContainer>
      </section>
    );
  }

  // Horizontal carousel for larger screens
  return (
<<<<<<< Updated upstream
    <div className='trailers-section' style={{ zIndex: 30, position: 'sticky', top: '54px', background: 'none', color: '#ffefcb', height: 'calc(100vh - 54px)', overflow: 'hidden' }}>
      <img src={redCurtain} alt="Red Curtain" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.45)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p className='trailers-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#FFD6A0', letterSpacing: '1px' }}>Trailers</p>
        <div className='trailers-inline-row'>
          {dummyTrailers.map((trailer, idx) => (
            <div key={idx} className='trailer-card'>
              <img src={trailer.image} alt={trailer.videoUrl || 'Trailer'} className='trailer-thumbnail' />
              <div className='trailer-info'>
                <h4>{trailer.title || 'Trailer'}</h4>
                <p>{trailer.duration || ''}</p>
              </div>
            </div>
          ))}
=======
    <ResponsiveContainer>
      <section className="trailers-section" style={{ 
        width: '100%', 
        color: '#ffefcb', 
        padding: responsiveSectionPadding, 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: '#000000', 
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
            minHeight: isSmallMobile ? 280 : 520,
            width: '100%',
          }}>
            <button onClick={handleLeft} disabled={centerIdx === 0} style={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '2px solid #FFD6A0', 
              color: '#FFD6A0', 
              fontSize: isSmallMobile ? 24 : 32, 
              cursor: centerIdx === 0 ? 'not-allowed' : 'pointer', 
              padding: isSmallMobile ? '8px 12px' : '12px 16px', 
              marginRight: isSmallMobile ? 8 : 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: isSmallMobile ? '40px' : '50px',
              height: isSmallMobile ? '40px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === 0 ? 0.3 : 1,
              position: 'absolute',
              left: isSmallMobile ? '10px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>&#8592;</button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0, 
              width: isSmallMobile ? '100%' : 1100, 
              overflow: 'visible', 
              position: 'relative',
              padding: isSmallMobile ? '0 50px' : '0 80px',
            }}>
              {/* Left trailer (if exists) */}
              {centerIdx > 0 && (
                <div style={{
                  minWidth: isSmallMobile ? 200 : 340,
                  maxWidth: isSmallMobile ? 240 : 380,
                  height: isSmallMobile ? 160 : 260,
                  opacity: 0.6,
                  transform: `scale(0.8) translateX(${isSmallMobile ? 20 : 40}px)`,
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginRight: isSmallMobile ? -30 : -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx - 1]?.youtube_url || trailers[centerIdx - 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height={isSmallMobile ? "160px" : "260px"}
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
                  minWidth: isSmallMobile ? 240 : 900,
                  maxWidth: isSmallMobile ? 280 : 1100,
                  height: isSmallMobile ? 180 : 520,
                  zIndex: 2,
                  borderRadius: isSmallMobile ? 16 : 28,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: isSmallMobile ? '0 4px 16px 0 rgba(0,0,0,0.18)' : '0 8px 32px 0 rgba(255,214,0,0.10)',
                  marginLeft: isSmallMobile ? 0 : 0,
                  marginRight: isSmallMobile ? 0 : 0,
                  transition: 'all 0.3s',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => !isSmallMobile && (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => !isSmallMobile && (e.currentTarget.style.transform = 'scale(1)')}
              >
                <ReactPlayer
                  url={trailers[centerIdx]?.youtube_url || trailers[centerIdx]?.videoUrl}
                  controls={!isSmallMobile}
                  width="100%"
                  height={isSmallMobile ? "180px" : "520px"}
                  style={{ borderRadius: isSmallMobile ? 16 : 28, background: '#111' }}
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
                  minWidth: isSmallMobile ? 200 : 340,
                  maxWidth: isSmallMobile ? 240 : 380,
                  height: isSmallMobile ? 160 : 260,
                  opacity: 0.6,
                  transform: `scale(0.8) translateX(${isSmallMobile ? -20 : -40}px)`,
                  zIndex: 1,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  marginLeft: isSmallMobile ? -30 : -60,
                  transition: 'all 0.3s',
                }}>
                  <ReactPlayer
                    url={trailers[centerIdx + 1]?.youtube_url || trailers[centerIdx + 1]?.videoUrl}
                    controls={false}
                    width="100%"
                    height={isSmallMobile ? "160px" : "260px"}
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
              fontSize: isSmallMobile ? 24 : 32, 
              cursor: centerIdx === trailers.length - 1 ? 'not-allowed' : 'pointer', 
              padding: isSmallMobile ? '8px 12px' : '12px 16px', 
              marginLeft: isSmallMobile ? 8 : 12, 
              zIndex: 10,
              borderRadius: '50%',
              width: isSmallMobile ? '40px' : '50px',
              height: isSmallMobile ? '40px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: centerIdx === trailers.length - 1 ? 0.3 : 1,
              position: 'absolute',
              right: isSmallMobile ? '10px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>&#8594;</button>
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  )
}

export default TrailersSection
