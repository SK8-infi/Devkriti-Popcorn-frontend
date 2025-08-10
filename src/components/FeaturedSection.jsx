import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import ResponsiveContainer from './ResponsiveContainer'
import ResponsiveGrid from './ResponsiveGrid'
import useResponsive from '../hooks/useResponsive'
import './FeaturedSection.css'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { api, userCity, cityChangeCounter } = useAppContext()
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(true)
    const { isTinyMobile, isMobile, getResponsiveValue } = useResponsive()
    const [currentUserCity, setCurrentUserCity] = useState(null)

    // Get user city from context or localStorage
    useEffect(() => {
        const savedCity = localStorage.getItem('userCity')
        setCurrentUserCity(userCity || savedCity)
    }, [userCity])

    // Fetch movies and shows data with city filtering
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Build query params for shows - only add city if it exists
                const showParams = new URLSearchParams();
                if (currentUserCity && currentUserCity.trim() !== '') {
                    showParams.append('city', currentUserCity);
                }
                const showQueryString = showParams.toString();
                const showUrl = showQueryString ? `/api/show/all?${showQueryString}` : '/api/show/all';
                
                const [moviesResponse, showsResponse] = await Promise.all([
                    api.get('/api/movies/latest'),
                    api.get(showUrl)
                ]);
                
                if (moviesResponse.data.movies && showsResponse.data.success) {
                    const now = new Date();
                    const futureShowMovieIds = new Set();
                    
                    // Collect all movie IDs from shows that have future showtimes
                    (showsResponse.data.shows || []).forEach(show => {
                        if (new Date(show.showDateTime) > now && show.movie) {
                            // Add both _id and id if they exist
                            if (show.movie._id) {
                                futureShowMovieIds.add(String(show.movie._id));
                            }
                            if (show.movie.id) {
                                futureShowMovieIds.add(String(show.movie.id));
                            }
                        }
                    });
                    
                    // Filter movies that have shows - check both id and _id fields
                    const filteredMovies = (moviesResponse.data.movies || []).filter(movie => {
                        const movieId = String(movie.id || '');
                        const movieIdAlt = String(movie._id || '');
                        return futureShowMovieIds.has(movieId) || futureShowMovieIds.has(movieIdAlt);
                    });
                    
                    setShows(filteredMovies);
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setShows([])
            } finally {
                setLoading(false)
            }
        }
        
        // Only fetch if we have determined the user city (or lack thereof)
        if (currentUserCity !== null) {
            fetchData()
        }
    }, [api, currentUserCity, cityChangeCounter])

    // Use the filtered movies directly (no need for uniqueMoviesMap since we're already filtering)
    const uniqueShows = shows;

    const responsiveTitleSize = getResponsiveValue({
        xl: '1.6rem',
        lg: '1.5rem',
        md: '1.4rem',
        sm: '1.3rem',
        xs: '1.2rem',
        tiny: '1.1rem',
    });

    const responsiveGap = getResponsiveValue({
        xl: '2.5rem',
        lg: '2.5rem',
        md: '2.5rem',
        sm: '2.5rem',
        xs: '2.5rem',
        tiny: '2.5rem',
    });

  if (loading) {
    return (
      <ResponsiveContainer>
        <section className='featured-section' style={{ 
          width: '100%', 
          color: '#ffefcb', 
          padding: '20px 0 80px 0', 
          position: 'relative', 
          marginBottom: '60px', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className='featured-header' style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%', 
              paddingTop: '2.5rem', 
              paddingBottom: '1.5rem',
              '@media (max-width: 300px)': {
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }
            }}>
              <p className='featured-title' style={{ 
                textAlign: 'left', 
                margin: 0, 
                fontFamily: 'Gotham, Arial, sans-serif', 
                fontSize: responsiveTitleSize, 
                color: '#ffefcb', 
                letterSpacing: '1px' 
              }}>NOW SHOWING{currentUserCity ? ` IN ${currentUserCity.toUpperCase()}` : ''}</p>
              <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
                  View All 
                  <ArrowRight style={{transition: 'transform 0.2s'}}/>
              </button>
            </div>
            <div className='featured-movies' style={{ 
              display: 'flex', 
              gap: responsiveGap, 
              alignItems: 'flex-start', 
              justifyContent: 'flex-start', 
              width: '100%',
              '@media (max-width: 300px)': {
                justifyContent: 'center',
              }
            }}>
              <p style={{ color: '#ffefcb' }}>Loading shows...</p>
            </div>
          </div>
        </section>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer>
      <section className='featured-section' style={{ 
        width: '100%', 
        color: '#ffefcb', 
        padding: '20px 0 60px 0', 
        position: 'relative', 
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className='featured-header' style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%', 
            paddingTop: '2.5rem', 
            paddingBottom: '1.5rem',
            '@media (max-width: 300px)': {
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }
          }}>
            <p className='featured-title' style={{ 
              textAlign: 'left', 
              margin: 0, 
              fontFamily: 'Gotham, Arial, sans-serif', 
              fontSize: responsiveTitleSize, 
              color: '#ffefcb', 
              letterSpacing: '1px', 
              fontWeight: 'bold' 
            }}>NOW SHOWING{currentUserCity ? ` IN ${currentUserCity.toUpperCase()}` : ''}</p>
            <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
                View All 
                <ArrowRight style={{transition: 'transform 0.2s'}}/>
            </button>
          </div>
          {uniqueShows.length > 0 ? (
            <ResponsiveGrid
              columns={{
                default: 4,
                lg: 4,
                md: 3,
                sm: 2,
                xs: 2,
                tiny: 2
              }}
              gap={responsiveGap}
            >
                             {uniqueShows.map((movie) => (
                 <MovieCard key={movie.id || movie._id} movie={movie}/>
               ))}
            </ResponsiveGrid>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%',
              padding: '2rem 0'
            }}>
              <p style={{ color: '#ffefcb' }}>No shows available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </ResponsiveContainer>
  )
}

export default FeaturedSection
