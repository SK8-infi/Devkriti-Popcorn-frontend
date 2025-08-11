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

    // Fetch shows data with city filtering
    useEffect(() => {
        const fetchShows = async () => {
            try {
                // Build query params - only add city if it exists
                const params = new URLSearchParams()
                if (currentUserCity && currentUserCity.trim() !== '') {
                    params.append('city', currentUserCity)
                }
                
                const queryString = params.toString()
                const url = queryString ? `/api/show/all?${queryString}` : '/api/show/all'
                
                const response = await api.get(url)
                if (response.data.success) {
                    setShows(response.data.shows || [])
                }
            } catch (error) {
                console.error('Error fetching shows:', error)
                setShows([])
            } finally {
                setLoading(false)
            }
        }
        
        // Only fetch if we have determined the user city (or lack thereof)
        if (currentUserCity !== null) {
            fetchShows()
        }
    }, [api, currentUserCity, cityChangeCounter])

    // Get unique movies from shows
    const uniqueMoviesMap = new Map();
    if (shows && shows.length > 0) {
        shows.forEach(show => {
            if (show.movie && !uniqueMoviesMap.has(show.movie._id)) {
                uniqueMoviesMap.set(show.movie._id, show);
            }
        });
    }
    const uniqueShows = Array.from(uniqueMoviesMap.values());

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
              }}>NOW SHOWING</p>
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
            }}>NOW SHOWING</p>

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
              {uniqueShows.map((show) => (
                <MovieCard 
                  key={show.movie._id || show.movie.id} 
                  movie={{ ...show.movie, id: show.movie.id || show.movie._id }}
                  variant="home"
                />
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
